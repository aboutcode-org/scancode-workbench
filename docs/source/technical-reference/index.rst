.. _technical-reference:

============================
:index:`Technical Reference`
============================

Underlying Technology
=====================

-  ScanCode Workbench is based on `Electron <https://electron.atom.io/>`__ and works on
   Windows, OS X and Linux operating systems.

Platform Support
================

ScanCode Workbench Supported Platforms
--------------------------------------

Our approach for platform support is to focus on one primary release for each of Linux, MacOS and
Windows. The Priority definitions are:

* Primary - These are the primary platforms for build/test/release on an ongoing basis.
* Secondary - These are platforms where the primary ScanCode Workbench release for the
   corresponding OS Group should be forward-compatible, e.g., Windows 7 build should work on
   Windows 10. Issues reported and traced to a Secondary platform may not be fixed.
* Tertiary - These are any other platforms not listed as Primary or Secondary. In these cases, we
   will help users help themselves, but we are likely not to fix Issues that only surface on a
   Tertiary platform.

+-------------+------------------+----------+------------+-----------------------------------------+
| OS Group    |  Desktop OS      |    Arch  |  Priority  |      Notes                              |
|             |  Version         |          |            |                                         |
+=============+==================+==========+============+=========================================+
|  Windows    |   Windows 7      |    x64   |      2     |                                         |
+-------------+------------------+----------+------------+-----------------------------------------+
|  Windows    |  Windows 10      |    x64   |     1      | Verified to be able to run the prebuilt |
+-------------+------------------+----------+------------+-----------------------------------------+
|  Windows    | Windows 11       |    x64   |     1      | Verified to be able to run the prebuilt |
+-------------+------------------+----------+------------+-----------------------------------------+
|  MacOS      | 10.15 Catalina   |    x64   |      2     |                                         |
+-------------+------------------+----------+------------+-----------------------------------------+
|  MacOS      | 11 Big Sur       |x64, arm64|    2       | Verified to be able to run the prebuilt |
+-------------+------------------+----------+------------+-----------------------------------------+
|  MacOS      | 12 Monterey      |x64, arm64|     1      | Verified to be able to run the prebuilt |
+-------------+------------------+----------+------------+-----------------------------------------+
|  MacOS      | 13 Ventura       |x64, arm64|     1      | Verified to be able to run the prebuilt |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 12.04     |    x64   |     2      | From Electron Docs: The prebuilt ia32   |
|             |                  |          |            | (i686) and x64 (amd64) binaries of      |
|             |                  |          |            | Electron are built on Ubuntu 12.04.     |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 14.xx     |    x64   |     2      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 16.xx     |    x64   |     1      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 18.xx     |    x64   |     1      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 20.xx     |    x64   |     1      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux Deb   | Ubuntu 22.xx     |    x64   |     1      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
|   Linux     |  Fedora 21       |    x64   |     2      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
|   Linux     |  Debian 8        |    x64   |     2      | Verified to be able to run the prebuilt |
|             |                  |          |            | binaries of Electron.                   |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux RH    |  CentOS 7.xx     |    x64   |     ?      |                                         |
+-------------+------------------+----------+------------+-----------------------------------------+
| Linux RH    |  RHEL 7.xx       |    x64   |     ?      |                                         |
+-------------+------------------+----------+------------+-----------------------------------------+

Electron Supported Platforms
----------------------------

https://electronjs.org/docs/tutorial/support#supported-platforms

The following platforms are supported by Electron:

MacOS
^^^^^

Binaries for both x64 & arm64 are provided for MacOS, and the minimum MacOS version supported is MacOS 10.9

Windows
^^^^^^^

Windows 7 and later are supported, while older operating systems are not supported (and do not
work). Both ia32 (x86) and x64 (amd64) binaries are provided for Windows. Please note: the ARM
version of Windows is not supported for now.

Linux
^^^^^

The prebuilt ia32 (i686) and x64 (amd64) binaries of Electron are built on Ubuntu 12.04, and the
ARM binary is built against ARM v7 with hard-float ABI and NEON for Debian Wheezy.

Whether the prebuilt binary can run on a distribution depends on whether the distribution includes
the libraries that Electron is linked to on the building platform, so only Ubuntu 12.04 is
guaranteed to work, but the following platforms are also verified to be able to run the prebuilt
binaries of Electron:

- Ubuntu 12.04 and later
- Fedora 21
- Debian 8
