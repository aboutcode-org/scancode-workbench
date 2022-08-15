#!/usr/bin/python

# Copyright (c) 2017 - 2019 nexB Inc. http://www.nexb.com/ - All rights reserved.


"""
Run this script to build ScanCode Workbench. The script detects which OS
it is running on and produces a build archive only for this platform.
It is meant to run primarily on a CI such as Travis and Appveyor.
"""

from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

from contextlib import closing
import argparse
import os
import platform as std_platform
import shutil
import subprocess
import sys
import tarfile
import zipfile

# Build configuration
#######################
APP_NAME = 'ScanCode-Workbench'
APP_BUNDLE_ID = 'com.electron.scancode-workbench'
VERSION = '3.1.1'
ELECTRON_VERSION = '3.1.11'

#######################
ARCH = 'x64'
BUILD_DIR = 'dist'
ASAR = 'true'
#######################


# platform-specific constants including OS-specific ICONS
sys_platform = str(sys.platform).lower()

on_linux = on_windows = on_mac = False


if 'linux' in sys_platform :
    PLATFORM_NAME = 'linux'
    PLATFORM = 'linux'
    ICON = 'png/scwb_layered_01.png'
    on_linux = True

elif'win32' in sys_platform :
    PLATFORM_NAME = 'windows'
    PLATFORM = 'win32'
    ICON = 'win/scwb_layered_01.ico'
    on_windows = True

elif 'darwin' in sys_platform :
    PLATFORM_NAME = 'macos'
    PLATFORM = 'darwin'
    ICON = 'mac/scwb_layered_01.icns'
    on_mac = True

else:
    raise Exception('Unsupported OS/platform %r' % sys_platform)
    platform_names = tuple()


def call(cmd):
    """
    Run a `cmd` command (as a list of args) with all env vars.
    """

    cmd = ' '.join(cmd)
    print('Running command: %(cmd)r...' % locals())
    if  subprocess.Popen(cmd, shell=True, env=dict(os.environ)).wait() != 0:
        print()
        print('Failed to execute command:\n%(cmd)r\nAborting...' % locals())
        sys.exit(1)


def get_version(default=VERSION, template='{tag}.{distance}.{commit}{dirty}',
                use_default=False):
    """
    Return a version collected from git if possible or fall back to an
    hard-coded default version otherwise. If `use_default` is True,
    always use the default version.
    """
    if use_default:
        return default
    try:
        tag, distance, commit, dirty = get_git_version()

        print('DEBUG: get_version: tag:', tag, 'distance:', distance,
              'commit:', commit, 'dirty:', dirty)

        if not distance and not dirty:
            # we are from a clean Git tag: use tag
            print('DEBUG: get_version: clean, using tag:', tag)
            return tag

        distance = 'post{}'.format(distance)
        if dirty:
            time_stamp = get_time_stamp()
            dirty = '.dirty.' + get_time_stamp()
        else:
            dirty = ''

        version = template.format(**locals())
        print('DEBUG: get_version: dirty, using timestamp:', version)
        return version

    except:
        # no git data: use default version
        print('DEBUG: get_version: failed to get git data, usind default:', default)
        import traceback
        print(traceback.format_exc())
        return default


def get_time_stamp():
    """
    Return a numeric UTC time stamp without microseconds.
    """
    from datetime import datetime
    return (datetime.isoformat(datetime.utcnow()).split('.')[0]
            .replace('T', '').replace(':', '').replace('-', ''))


def get_git_version():
    """
    Return version parts from Git or raise an exception.
    """
    # this may fail with exceptions
    cmd = 'git', 'describe', '--tags', '--long', '--dirty',
    version = subprocess.check_output(cmd, stderr=subprocess.STDOUT).strip()
    version = version.decode('utf-8')
    dirty = version.endswith('-dirty')
    if dirty:
        version, _, _ = version.rpartition('-')

    version, _, commit = version.rpartition('-')
    tag, _, distance = version.rpartition('-')

    # lower tag and strip V prefix in tags
    tag = tag.lower().lstrip('v').strip()
    # strip leading g from git describe commit
    commit = commit.lstrip('g').strip()
    return tag, int(distance), commit, dirty


def create_zip(base_dir, archive_base_name,):
    """
    Create a zip at path `archive_name` from the files in `base_dir`
    """
    len_base_dir = len(base_dir) + 1

    with zipfile.ZipFile(os.path.join(base_dir, archive_base_name + '.zip'), 'w', zipfile.ZIP_DEFLATED) as zipf:
        for dirname, _, files in os.walk(os.path.join(base_dir, archive_base_name)):
            relative_dir = dirname[len_base_dir:]
            for name in files:
                member_location = os.path.join(dirname, name)
                member_path = os.path.join(relative_dir, name)
                zipf.write(member_location, member_path)


def create_tar(base_dir, archive_base_name):
    """
    Create a tar at path `archive_name` from the files in `base_dir`
    """
    tarfile_name = os.path.join(base_dir, archive_base_name + '.tar.gz')
    source_dir = os.path.join(base_dir, archive_base_name)

    with closing(tarfile.open(tarfile_name, mode='w:gz')) as tarf:
        tarf.add(source_dir, arcname=archive_base_name)


def build(clean=True, app_name=APP_NAME,
          platform=PLATFORM, platform_name=PLATFORM_NAME,
          arch=ARCH, build_dir=BUILD_DIR, icon=ICON,
          electron_version=ELECTRON_VERSION, asar=ASAR, osx_sign=False):
    """
    Run a build.
    """
    build_version = get_version()

    print()
    print('#############################################################')
    print('=> BUILDING ScanCode Workbench App release:', build_version)
    print('platform:', std_platform.platform(), 'sys.platform:', sys_platform)

    # find the path to the NPM bin directory
    if on_windows:
        npm_bin = subprocess.check_output(['npm', 'bin'], stderr=subprocess.STDOUT, shell=True)
    else:
        npm_bin = subprocess.check_output(['npm', 'bin'], stderr=subprocess.STDOUT,)
    npm_bin = npm_bin.decode('utf-8')
    npm_bin = npm_bin.strip()
    print('using NPM bin at:', npm_bin)

    # cleanup of previous build
    if clean:
        if os.path.exists(build_dir):
            shutil.rmtree(build_dir)
            os.makedirs(build_dir)

    # run rebuild
    electron_rebuild = os.path.join(npm_bin, 'electron-rebuild')
    print('Running electron-rebuild...')
    call([electron_rebuild])

    electron_args = [
        '.',
        app_name,
        # '--prune',
        # FIXME: could we use .npmignore instead?
        # '--ignore=dist/*',
        # '--ignore=/\.idea',
        # '--ignore=/\.gitignore',
        # '--ignore=/test',
        # '--ignore=/tmp',
        # '--ignore=/bower.json',
        '--platform=' + platform,
        '--arch=' + arch,
        # '--icon=assets/app/app-icon/' + icon,
        # '--electron-version=' + electron_version,
        # '--out=' + build_dir,
        # '--asar=' + asar,
        # '--overwrite=true'
    ]

    if on_mac and osx_sign:
        electron_args += [
            '--app-bundle-id=' + APP_BUNDLE_ID,
            '--osx-sign'
        ]

    if on_windows:
        electron_args += [
            '--win32metadata.CompanyName="https://AboutCode.org"',
            '--win32metadata.ProductName="{}"'.format(app_name),
        ]

    # run the build with electron_packager
    electron_packager = os.path.join(npm_bin, 'electron-forge package')
    cmd = [electron_packager] + electron_args
    print('Running electron-forge...')
    call(cmd)

    # rename the build dir to a proper directory that always includes a
    # version and a "nice" platform name as opposed to a code
    print('Build complete: building release archives...')

    old_release_dir = "{app_name}-{platform}-{arch}".format(**locals())
    archive_base_name = "{app_name}-{platform_name}-{arch}-{build_version}".format(**locals())
    os.rename(os.path.join(build_dir, old_release_dir),
              os.path.join(build_dir, archive_base_name))

    # create final archives: zip on Windows and tar.gz elsewhere
    if on_windows:
        create_zip(build_dir, archive_base_name)
    else:
        create_tar(build_dir, archive_base_name)

    print()
    print('##################################################')
    print('ScanCode Workbench App BUILD completed with these archives:')
    for archive in os.listdir(build_dir):
        if archive.endswith(('zip', 'tar.gz')):
            print('   ', archive, 'size:', os.path.getsize(os.path.join(build_dir, archive)))
    print('##################################################')
    print()

    if False:
        print('Uploading release archives...')
        decpass = os.environ.get('DEPLOY_KEY_PASS')
        deciv = os.environ.get('DEPLOY_KEY_IV')
        if not decpass and deciv:
            print('Missing secrets...')
            sys.exit(1)
        os.mkdir('secret')
        deploy_key = os.path.join('secret', 'deploy_rsa.enc')
        decrypt_cmd = [
            'openssl', 'aes-256-cbc',
            '-k', decpass, '-K', deciv,
            '-in', 'deploy_rsa.enc',
            '-out', deploy_key,
            '-d'
        ]

        for archive in os.listdir(build_dir):
            if archive.endswith(('zip', 'tar.gz')):
                archive_loc = os.path.join(build_dir, archive)
                cmd = [
                    'scp'
                ]
                # @TODO: Upload the archive somewhere we can fetch these
                # check scp
                # print('Checking SCP...')
                # if on_windows:
                #    print(subprocess.check_output(['C:\\MinGW\\msys\\1.0\\bin\\scp.exe'], stderr=subprocess.STDOUT, shell=True).strip())
                # else:
                #    print(subprocess.check_output(['scp'], stderr=subprocess.STDOUT,).strip())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Produces a build archive of ScanCode Workbench for this '
                    'platform.')

    parser.add_argument('--osx-sign',
                        default=False,
                        action='store_true',
                        help='Sign the app (Mac only).')

    args = parser.parse_args()
    if args.osx_sign and not on_mac:
        parser.error('--osx-sign can only be used on Mac')

    build(osx_sign=args.osx_sign)
