#!/usr/bin/python

# Copyright (c) 2017 - 2019 nexB Inc. http://www.nexb.com/ - All rights reserved.

"""
Run this script to build ScanCode Workbench. The script detects which OS
it is running on and produces a build archive only for this platform.
It is meant to run primarily on Github actions
"""

import os
import sys
import json
import platform

# Expected output file name: ScanCode-Workbench-{platform}-{arch}-{version}.tar.gz
# Example: ScanCode-Workbench-linux-x64-3.1.1.tar.gz

# Archive properties
APP_NAME = 'ScanCode-Workbench'
APP_BUNDLE_ID = 'com.nexb.scancode-workbench'
ARCHIVE_DIR = 'dist'
PACKAGE_DIR = 'out'

# Get scancode workbench version from package.json
with open('package.json') as json_file:
  package_json_object = json.load(json_file)
  APP_VERSION = package_json_object['version']

# platform-specific properties
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

# Prepare file name for archive using platform, architecture & app version
archive_file_name = '-'.join([APP_NAME, PLATFORM_NAME, ARCH, APP_VERSION])
print("Composed Archive file name: '" + archive_file_name + "'")

# Ensure archive directory dist/ is created, before attempting to store archive inside it
ensure_archive_directory = f"mkdir -p {ARCHIVE_DIR}"
print("Executing mkdir command:", ensure_archive_directory)
os.system(ensure_archive_directory)

# Prepare .zip file for windows
if on_windows:
  zip_command = f"powershell Compress-Archive {PACKAGE_DIR}/* {ARCHIVE_DIR}/{archive_file_name}.zip"
  print("Executing zip command on powershell:", zip_command)
  os.system(zip_command)
  print(f"Zip file ready in {ARCHIVE_DIR}/ !!")

# Prepare .tar.gz file for mac & linux
else:
  tar_command = f"tar -czf {ARCHIVE_DIR}/{archive_file_name}.tar.gz -C {PACKAGE_DIR} ."
  print("Executing tar command:", tar_command)
  os.system(tar_command)
  print(f"Tar file ready in {ARCHIVE_DIR}/ !!")

print("Build succeeded !!!")