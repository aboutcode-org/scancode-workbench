.. _building:

=================
:index:`Building`
=================

Clone, Install, Build and Run
=============================

You'll need `Node.js <https://nodejs.org/en>`__ (which comes with `npm <https://www.npmjs.com/>`__) installed on your computer in order to build this app. (See below for a list of platform-specific requirements.) Then, from your command line:

.. code-block:: bash

   # Clone this repository
   git clone https://github.com/nexB/scancode-workbench.git

   # Go into the repository
   cd scancode-workbench

   # Install dependencies and run the app (Native dependencies are handled automatically)
   npm install

   # Run the app
   npm start

Building Requirements
=====================

Linux
-----

- `Python <https://www.python.org/>`__ v3.9 or later
- `Node.js <https://nodejs.org/en//>`__ 16.x or later
- `npm <https://www.npmjs.com/>`__ v8.x or later

.. include:: ../rst_snippets/centos-note.rst

MacOS
-----

- `Python <https://www.python.org/>`__ v3.9 or later
- `Node.js <https://nodejs.org/en/>`__ 16.x or later
- `npm <https://www.npmjs.com/>`__ v8.x or later
- Command Line Tools for `Xcode <https://developer.apple.com/xcode/resources/>`_
   Install using:

   .. code-block:: bash

      xcode-select --install

Windows
-------

- `Python <https://www.python.org/>`__ v3.9 or later

  * Make sure your Python path is set. To verify, open a command prompt and see the python version:

   .. code-block:: bash

      python --version

- `Node.js <https://nodejs.org/en/>`__ v16.x or later
- `npm <https://www.npmjs.com/>`__ v8.x or later


Release Instructions
====================

ScanCode Workbench release is built using `electron-forge <https://www.electronforge.io/>`__.
You can build the application for your platform using following command:

.. code-block:: bash

   npm run publish

You can find the executible ``ScanCode-Workbench-<version>`` inside
``out/ScanCode-Workbench-<version>-<os>-<arch>`` and
a distributable archive in ``dist/`` directory.

Archives are built as:
   - ``tar.gz`` - Linux / MacOS
   - ``.zip`` - Windows

.. Note::
   Due to usage of native modules, a build must be done on target platform only.
   For example, a linux build must be done on linux machine only.


Building Documentation
======================

Create python environment, make docs

.. code-block:: bash

   # Clone this repository
   git clone https://github.com/nexB/scancode-workbench.git

   # Go into the docs directory
   cd docs/

   # Setup virtual environment for python dependencies
   python -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Build Documentation
   make html

   # Run Documentation server
   make docs
