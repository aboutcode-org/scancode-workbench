#!/usr/bin/python

# Copyright (c) 2017 - 2019 nexB Inc. http://www.nexb.com/ - All rights reserved.


"""
Run this script to build ScanCode Workbench. The script detects which OS
it is running on and produces a build archive only for this platform.
It is meant to run primarily on a CI such as Travis and Appveyor.
"""

import os
import sys
import json
import platform
# import tarfile
# import zipfile


# Expected output file name: ScanCode-Workbench-{platform}-{arch}-{version}.tar.gz
# Example: ScanCode-Workbench-linux-x64-3.1.1.tar.gz

# Tar properties
#######################
APP_NAME = 'scanCode-workbench'
APP_BUNDLE_ID = 'com.nexb.scancode-workbench'
ARCHIVE_DIR = 'dist'
PACKAGE_DIR = 'out'

# Get scancode workbench version from package.json
with open('package.json') as json_file:
    package_json_object = json.load(json_file)
    APP_VERSION = package_json_object['version']

# platform-specific constants including OS-specific ICONS
ARCH = str(platform.machine())
SYSTEM_PLATFORM = str(sys.platform).lower()


on_linux = on_windows = on_mac = False

if 'linux' in SYSTEM_PLATFORM :
    PLATFORM_NAME = 'linux'
    PLATFORM = 'linux'
    on_linux = True

elif 'win32' in SYSTEM_PLATFORM :
    PLATFORM_NAME = 'windows'
    PLATFORM = 'win32'
    on_windows = True

elif 'darwin' in SYSTEM_PLATFORM :
    PLATFORM_NAME = 'macos'
    PLATFORM = 'darwin'
    on_mac = True

else:
    raise Exception('Unsupported OS/platform %r' % SYSTEM_PLATFORM)

tar_file_name = '-'.join([APP_NAME, PLATFORM_NAME, ARCH, APP_VERSION])
ensure_archive_directory = f"mkdir -p {ARCHIVE_DIR}"
tar_command = f"tar -czf {ARCHIVE_DIR}/{tar_file_name}.tar.gz -C {PACKAGE_DIR} ."

print("Final Zip file name: '" + tar_file_name + "'")

print("Executing command:", ensure_archive_directory)
os.system(ensure_archive_directory)

print("Executing command:", tar_command)
os.system(tar_command)

print("Tar file ready !!")