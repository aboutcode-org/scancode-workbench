.. _building:

========
Building
========

Clone, Install, Build and Run
=============================

You'll need `Node.js <https://nodejs.org/>`__ (which comes with `npm <http://npmjs.com/>`__) installed on your computer in order to build this app. (See below for a list of platform-specific requirements.) Then, from your command line:

.. code-block::

   # Clone this repository
   $ git clone https://github.com/nexB/scancode-workbench.git

   # Go into the repository
   $ cd scancode-workbench

   # Install dependencies and run the app
   $ npm install

   # Rebuild native Node.js modules against the app version of Node.js
   # MacOS, Linux and Git Bash on Windows
   $ $(npm bin)/electron-rebuild
   # Windows except for Git Bash
   > .\node_modules\.bin\electron-rebuild.cmd

   # Run the app
   $ npm start

Building Requirements
=====================

Linux
-----

- Python 2.7
- `Node.js version <https://nodejs.org/en/download/package-manager/>`_ 6.x or later
- npm 3.10.x or later but <= 5.2.0 (run ``npm install npm@5.2.0 -g``)

MacOS
-----

- Python 2.7
- `Node.js <https://nodejs.org/en/>`_ >=6.x or later but <=8.9.4
- npm 3.10.x or later but <= 5.2.0 (run ``npm install npm@5.2.0 -g``)
- Command Line Tools for `Xcode <https://developer.apple.com/xcode/downloads/>`_
  (run ``xcode-select --install to install``)

Windows
-------

- `Node.js <https://nodejs.org/en/>`_ 6.x or later
- npm 3.10.x or later but <= 5.2.0 (``run npm install npm@5.2.0 -g``)
- Python v2.7.x

  * Make sure your Python path is set. To verify, open a command prompt and type
    ``python --version``. Then, the version of python will be displayed.

- Visual C++ Build Environment:

  * Either:

  - Option 1: Install `Visual C++ Build Tools 2015 <https://www.microsoft.com/en-in/download/details.aspx?id=48159>`_
    (or modify an existing installation) and select Common Tools for Visual C++ during setup.
    This also works with the free Community and Express for Desktop editions.
  - Option 2: `Visual Studio 2015 <https://visualstudio.microsoft.com/vs/older-downloads/>`_ (Community Edition or better)

  * Note: Windows 7 requires `.NET Framework 4.5.1 <http://www.microsoft.com/en-us/download/details.aspx?id=40773>`_
  * Launch cmd, ``npm config set msvs_version 2015``

Release Instructions
====================

You can build a ``dist`` directory containing executables for any one of three target platforms by running:

.. code-block::

   $ python build.py

After building is done, you can find ScanCode-Workbench under ``dist/ScanCode-Workbench-<os>-x64-<version>``. Archives (``tar.gz`` and ``.zip``) are also built.

.. Note:: A build for any of the three target platforms must be executed on the targeted platform.
