.. _building:

=================
:index:`Building`
=================

Clone, Install, Build and Run
=============================

You'll need `Node.js <https://nodejs.org/>`__ (which comes with `npm <http://npmjs.com/>`__) installed on your computer in order to build this app. (See below for a list of platform-specific requirements.) Then, from your command line:

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

- Python 3.7 or later
- `Node.js <https://nodejs.org/en/download/package-manager/>`__ 12.x or later
- npm 6.14.x or later
- For CentOS (or linux distros without the new libstdc++) -
   
   -  Install the new libstdc++ library: 

      .. code-block:: bash
      
         yum provides libstdc++
         
   -  Update LD_LIBRARY_PATH:
      
      .. code-block:: bash
      
         export LD_LIBRARY_PATH="/usr/local/lib64/:$LD_LIBRARY_PATH"

   -  Run the application with ``no-sandbox`` option:
   
      .. code-block:: bash
      
         ./ScanCode\ Workbench-linux-x64/ScanCode\ Workbench --no-sandbox

MacOS
-----

- Python 3.7 or later
- `Node.js <https://nodejs.org/en/>`__ 12.x or later
- npm 6.14.x or later
- Command Line Tools for `Xcode <https://developer.apple.com/xcode/downloads/>`_
   Install using:

   .. code-block:: bash
   
      xcode-select --install

Windows
-------

- Python v3.7 or later

  * Make sure your Python path is set. To verify, open a command prompt and see the python version:

   .. code-block:: bash
   
      python --version

- `Node.js <https://nodejs.org/en/>`__ 12.x or later
- npm 6.14.x or later


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
