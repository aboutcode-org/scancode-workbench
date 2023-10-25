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

- `Python <https://www.python.org/>`__ v3.7 or later
- `Node.js <https://nodejs.org/en//>`__ 14.x or later
- `npm <https://www.npmjs.com/>`__ v6.14.4 or later

.. include:: ../rst_snippets/centos-note.rst

MacOS
-----

- `Python <https://www.python.org/>`__ v3.7 or later
- `Node.js <https://nodejs.org/en/>`__ 14.x or later
- `npm <https://www.npmjs.com/>`__ v6.14.4 or later
- Command Line Tools for `Xcode <https://developer.apple.com/xcode/resources/>`_
   Install using:

   .. code-block:: bash

      xcode-select --install

Windows
-------

- `Python <https://www.python.org/>`__ v3.7 or later

  * Make sure your Python path is set. To verify, open a command prompt and see the python version:

   .. code-block:: bash

      python --version

- `Node.js <https://nodejs.org/en/>`__ v14.x or later
- `npm <https://www.npmjs.com/>`__ v6.14.4 or later


Release Instructions
====================

You can build a ``dist`` directory and a ``tar/zip`` file containing executable for your platform
by running:

.. code-block:: bash

   npm run publish

After building is done, you can find ScanCode-Workbench under
``dist/ScanCode-Workbench-<os>-<arch>-<version>``.

Archives are also built as:
   - ``tar.gz`` - Linux / MacOS
   - ``.zip`` - Windows

.. Note:: A build for any of the three target platforms must be executed on the targeted platform.

Building Documentation
======================

Create python environment, make docs


.. code-block:: none

   # Clone this repository
   git clone https://github.com/nexB/scancode-workbench.git

   # Go into the docs directory
   cd docs/

   # Setup virtual environment for python dependencies
   python3 -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Build Documentation
   make html

   # Run Documentation server
   make docs
