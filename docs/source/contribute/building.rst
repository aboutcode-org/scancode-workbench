.. _building:

=================
:index:`Building`
=================

Clone, Install, Build and Run
=============================

You'll need `Node.js <https://nodejs.org/>`__ (which comes with `npm <http://npmjs.com/>`__) installed on your computer in order to build this app. (See below for a list of platform-specific requirements.) Then, from your command line:

.. code-block:: none

   # Clone this repository
   $ git clone https://github.com/nexB/scancode-workbench.git

   # Go into the repository
   $ cd scancode-workbench

   # Install dependencies and run the app (Native dependencies are handled automatically)
   $ npm install

   # Run the app
   $ npm start

Building Requirements
=====================

Linux
-----

- Python 3.7
- `Node.js version <https://nodejs.org/en/download/package-manager/>`_ 6.x or later
- npm 3.10.x or later but <= 5.2.0 (run ``npm install npm@5.2.0 -g``)

MacOS
-----

- Python 3.7
- `Node.js <https://nodejs.org/en/>`_ >=6.x or later but <=8.9.4
- npm 3.10.x or later but <= 5.2.0 (run ``npm install npm@5.2.0 -g``)
- Command Line Tools for `Xcode <https://developer.apple.com/xcode/downloads/>`_
  (run ``xcode-select --install`` to install)

Windows
-------

- `Node.js <https://nodejs.org/en/>`_ 6.x or later
- npm 3.10.x or later but <= 5.2.0 (``run npm install npm@5.2.0 -g``)
- Python v3.7.x

  * Make sure your Python path is set. To verify, open a command prompt and type
    ``python --version``. Then, the version of python will be displayed.

Release Instructions
====================

You can build a ``dist`` directory containing executables for any one of three target platforms
by running:

.. code-block:: none

   $ python build.py

After building is done, you can find ScanCode-Workbench under
``dist/ScanCode-Workbench-<os>-x64-<version>``. Archives (``tar.gz`` and ``.zip``)
are also built.

.. Note:: A build for any of the three target platforms must be executed on the targeted platform.
