.. _getting-started:

========================
:index:`Getting Started`
========================

Download and Install
=======================

-  You can download the latest ScanCode Workbench release for your Windows, OS X or Linux
   operating system from the `ScanCode Workbench releases page <https://github.com/nexB/scancode-workbench/releases>`__.
   Once downloaded, you'll find the ScanCode Workbench executable in the
   ``ScanCode-Workbench-<os>-x64-<version>`` folder.
   On Windows 10, for example, the executable will be named `ScanCode-Workbench.exe`.

-  If you're interested in digging into the code, you can also use ScanCode Workbench by cloning
   the GitHub repository and building it yourself -- see the :ref:`Contribute/Building<building>`
   section for details.

ScanCode Workbench-ScanCode Toolkit Compatibility
=================================================

-  ScanCode Workbench >= v3.1.1 is only compatible with scans from ScanCode v3.1.1 and above
   that have been run with the ScanCode Toolkit ``-i`` option.

   -  A list of available ScanCode Toolkit options is available in the ScanCode Toolkit
      documentation:
      :doc:`scancode-toolkit:tutorials/how_to_set_what_will_be_detected_in_a_scan`.

- You would typically create your scan with the following command:
  ``./scancode -clipeu <input> <output_file>``

Open ScanCode Workbench and Load a ScanCode Toolkit Scan
========================================================

-  Double-click the ScanCode Workbench executable you downloaded.  You'll probably want to
   maximize the application once it has opened.

-  Import your JSON scan file and save it as a SQLite file (ScanCode Workbench works with the
   data in a SQLite database).

   -  :kbd:`File` > :kbd:`Import JSON File` (:kbd:`Ctrl` + :kbd:`I`) ==> opens
      ``Open a JSON File`` window.

   -  Select your JSON scan and click :kbd:`Open` ==> opens ``Save a SQLite Database File`` window.

   -  Keep or modify the default SQLite filename and click :kbd:`Save`.

-  You're now looking at your scan data displayed in the Table View -- the Table View itself is on
   the right, and the Directory Tree (which is visible in all views) is on the left.

   .. figure:: data/initial_load_getting_started.png
      :class: with-border
      :width: 600px

      ..

      Your first imported ScanCode Toolkit Scan.

You can find additional details in the :ref:`how-to-guides` section below.

Try a Sample Scan
====================

We've also provided a set of `sample scans <https://github.com/nexB/scancode-workbench/tree/develop/samples>`__
that you can  review in ScanCode Workbench in order to get a sense of its functionality and the
types of information captured by a scan.
