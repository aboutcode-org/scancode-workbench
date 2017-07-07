#!/usr/bin/python

# Copyright (c) 2017 nexB Inc. http://www.nexb.com/ - All rights reserved.


"""
Run this script to build AboutCode Manager. The script detects which OS
it is running on and produces a build archive only for this platform.
"""

from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

from contextlib import closing
import os
import shutil
import subprocess
import sys
import tarfile
import zipfile


# Build configuration
#######################
APP_NAME = 'AboutCode-Manager'
VERSION = '2.0.0'
ELECTRON_VERSION = '1.4.0'

#######################
ARCH = 'x64'
BUILD_DIR = 'dist'
ASAR = 'true'
#######################


# platform-specific constants including OS-specific ICONS
sys_platform = str(sys.platform).lower()

if 'linux' in sys_platform :
    PLATFORM_NAME = 'linux'
    PLATFORM = 'linux'
    ICON = 'png/aboutcode_512x512.png'

elif'win32' in sys_platform :
    PLATFORM_NAME = 'windows'
    PLATFORM = 'win32'
    ICON = 'win/aboutcode_256x256.ico'

elif 'darwin' in sys_platform :
    PLATFORM_NAME = 'macos'
    PLATFORM = 'darwin'
    ICON = 'mac/aboutcode.icns'

else:
    raise Exception('Unsupported OS/platform %r' % sys_platform)
    platform_names = tuple()


def call(cmd):
    """
    Run a `cmd` command (as a list of args) with all env vars.
    """
    cmd = ' '.join(cmd)
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
        if not distance and not dirty:
            # we are from a clean Git tag: use tag
            return tag

        distance = 'post{}'.format(distance)
        if dirty:
            time_stamp = get_time_stamp()
            dirty = '.dirty.' + get_time_stamp()
        else:
            dirty = ''

        return template.format(**locals())
    except:
        # no git data: use default version
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
    dirty = version.endswith('-dirty')
    tag, distance, commit = version.split('-')[:3]
    # lower tag and strip V prefix in tags
    tag = tag.lower().lstrip('v ').strip()
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
    Create a zip at path `archive_name` from the files in `base_dir`
    """
    len_base_dir = len(base_dir) + 1

    with closing(tarfile.open(os.path.join(base_dir, archive_base_name + '.tar.gz'), mode='w:gz')) as tarf:
        for dirname, _, files in os.walk(os.path.join(base_dir, archive_base_name)):
            relative_dir = dirname[len_base_dir:]
            for name in files:
                member_location = os.path.join(dirname, name)
                member_path = os.path.join(relative_dir, name)
                tarf.add(member_location, member_path)


def build(clean=True, app_name=APP_NAME,
          platform=PLATFORM, platform_name=PLATFORM_NAME,
          arch=ARCH, build_dir=BUILD_DIR, icon=ICON,
          electron_version=ELECTRON_VERSION, asar=ASAR):
    """
    Run a build.
    """
    build_version = get_version()

    print('=> BUILDING AboutCode App release:', build_version)

    if clean:
        # cleanup of previous build
        shutil.rmtree(build_dir)
        if not os.path.exists(build_dir):
            os.makedirs(build_dir)

    electron_args = [
        '.',
        app_name,
        '--prune',
        '--ignore=thirdparty/*',
        '--ignore=dist/*',
        '--ignore=.idea' ,
        '--ignore=.gitignore' ,
        '--ignore=test',
        '--ignore=bower.json',
        '--platform=' + platform,
        '--arch=' + arch,
        '--icon=assets/app-icon/' + icon,
        '--version=' + electron_version,
        '--out=' + build_dir,
         '--asar=' + asar,
        '--overwrite=true'
    ]

    # find the path to the NPM bin directory
    npm_bin = subprocess.check_output(['npm', 'bin'], stderr=subprocess.STDOUT).strip()

    # run the build with electron_packager
    electron_packager = os.path.join(npm_bin, 'electron-packager')
    cmd = [electron_packager] + electron_args
    print('Electron Packager command:', ' '.join(cmd))
    call(cmd)

    # rename the build dir to a proper directory that always includes a
    # version and a "nice" platform name as opposed to a code
    old_release_dir = "{app_name}-{platform}-{arch}".format(**locals())
    archive_base_name = "{app_name}-{platform_name}-{arch}-{build_version}".format(**locals())
    os.rename(os.path.join(build_dir, old_release_dir),
              os.path.join(build_dir, archive_base_name))

    # create final archives: zip on Windows and tar.gz elsewhere
    if PLATFORM == 'win32':
        create_zip(build_dir, archive_base_name)
    else:
        create_tar(build_dir, archive_base_name)

    print('=> AboutCode App BUILD completed with these archives:')
    for archive in os.listdir(build_dir):
        if archive.endswith(('zip', 'tar.gz')):
            print(archive, 'size:', os.path.getsize(os.path.join(build_dir, archive)))

    # TODO: Upload the archive somewhere we can fetch these


if __name__ == '__main__':
    build()
