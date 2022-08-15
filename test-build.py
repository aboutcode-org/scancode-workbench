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
import platform
import shutil
import subprocess
import sys
import tarfile
from tkinter import ARC
import zipfile

# Build configuration
#######################
APP_NAME = 'ScanCode-Workbench'
APP_BUNDLE_ID = 'com.electron.scancode-workbench'
APP_VERSION = '4.0.0'
ELECTRON_VERSION = '4.0.0'

#######################
ARCH = str(platform.machine())
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


file_name = '-'.join([APP_NAME, PLATFORM_NAME, ARCH, APP_VERSION])

print("Zip file name", file_name)
print(
    on_linux,
    on_windows,
    on_mac,
)