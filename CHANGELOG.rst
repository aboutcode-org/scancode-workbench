Changelog                                                                                 
=========                                                                                 
All notable changes to this project will be documented in this file.    

The format is based on `Keep a                                                               
Changelog <https://keepachangelog.com/en/1.0.0/>`__

[v4.0.0] - 2023-10-26
--------------------------

**This ScanCode-Workbench release contains schema changes: scans will have to be re-imported**
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

------------
Refactoring
~~~~~~~~~~~~
Entire source code is refactored to TypeScript + React

--------------------
New Features
~~~~~~~~~~~~

- Add support for ScanCode Toolkit v32.x
- Maintain history of imports for quick access
- Updated dependencies
- Support for top level packages-deps obtained in latest scans
- Scan Info page to present header info
- Support Drag & drop JSON/SQLite files
- Github actions to create automated releases
- Remove the ability to upload Conclusions to DejaCode #413
- Remove ability to edit conclusions & remove conclusions view
- New top-level views: Packages Explorer & Licenses Explorer
- Update in-app help links #412
- Add source controlled documentation #411
- Update app icon to a more visible one #382
- Add color to DataTables "Progress..." pop-up #407
- Update the display of scan headers #400
- New views:
   - Licenses Explorer
   - Packages Explorer
   - Dependencies Info Dashboard
   - Scan Info
- Inter-view links for 'for_packages' & 'license_detections'
- Remove ability to edit conclusions & remove conclusions view
- Search in licenses explorer
- Filters for packages based on dependencies flags & data_source_id
- License clues section in Licenses explorer  view
- Normalize Chart summary data
- Close file & cleanup option
- Unit tests
- Dependency Info dashboard - Dependency Scope summary by Package Type
- Working indicator for queries
- Diff modal for Matched text & Rule text in Matches table


Bug Fixes
~~~~~~~~~

- Fixed table column inconsistencies
- Fixed UI anomalies
- Invalid path query fix (Data for files with similar prefix were colliding)
- license_expression values now being uploaded correctly #403

[v3.1.1] - 2019-9-27
--------------------
New Features
~~~~~~~~~~~~

-  DejaCode API key visibility is now toggle-able in the upload dialog
   #391

Bug Fixes
~~~~~~~~~

-  Table rows are fixed height by default #1
-  Fix incorrect directory size on Scan Data Table view #232
-  Keep columns visible when navigating pagination pages #253
-  Long path names should now display properly #263
-  After Conclusion creation, the root node is no longer selected
   automatically #372
-  "No Value Detected" are now shown on the pie charts by default #378
-  Workbench can now import scans without fileinfo information #385
-  Products with no version are no longer rejected by the DejaCode
   upload #392
-  Update major dependencies #395

ScanCode Toolkit Compatibility
------------------------------

This beta version of ScanCode Workbench is compatible with scans from
any `ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__
develop version/branch at or after ``v3.1.1``.

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the ScanCode-Workbench
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/scancode-workbench/wiki>`__.

[v3.1.0] - 2019-4-26
--------------------

Updates
-------

**This AboutCode-Manager release contains schema changes: scans will have to be re-imported**
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

New Features
~~~~~~~~~~~~

-  Add support for Scan Errors #248
-  Add pURL support for Conclusions #337
-  Add new Dashboard Views #366

Bug Fixes
~~~~~~~~~

-  Update Wiki/README doc images/gifs #322

ScanCode Toolkit Compatibility
------------------------------

This beta version of ScanCode Workbench is compatible with scans from
any `ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__
develop version/branch at or after ``v3.0.2``. Scans imported into the
app need to contain the file information data. Therefore, the ``-i``
option needs to be used in your ScanCode command. For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the ScanCode-Workbench
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/scancode-workbench/wiki>`__.

[v3.0.0b3] - 2019-3-15
----------------------

New Features
~~~~~~~~~~~~

-  Add support for License Policy #215
-  Enable/Allow to zoom in/out #356
-  Submit AboutCode Manager to Electron Applications #216
-  Column Visibility Options #164
-  Enable/Allow to zoom in/out #356

Bug Fixes
~~~~~~~~~

-  ScanCode Workbench does not warn that ``-i / --info`` is missing from
   input json file #266
-  Dashboard does not correctly display a single file count #347
-  Fix package entries on BarChart #344

ScanCode Toolkit Compatibility
------------------------------

This beta version of ScanCode Workbench is compatible with scans from
any `ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__
develop version/branch at or after ``v3.0.2``. Scans imported into the
app need to contain the file information data. Therefore, the ``-i``
option needs to be used in your ScanCode command. For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the ScanCode-Workbench
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/scancode-workbench/wiki>`__.

[v3.0.0b2] - 2019-3-15
----------------------

Updates
-------

Beta release of upcoming v3.0 ScanCode Workbench release

New Features
~~~~~~~~~~~~

-  Add Welcome Page #290
-  Streamline left panel #306
-  Add Scan filename/SQLite filename to the Dashboard View #336

Bug Fixes
~~~~~~~~~

-  Package Declared Licensing filter not working on unusual values #287
-  Refresh Table View (and others) on Import of JSON file #293
-  Some menu shortcuts are misdescribed #326

ScanCode Toolkit Compatibility
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This beta version of ScanCode Workbench is compatible with scans from
any ScanCode Toolkit develop version/branch at or after ``v2.9.9``.
Scans imported into the app need to contain the file information data.
Therefore, the -i option needs to be used in your ScanCode command. For
example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

[v3.0.0b1] - 2019-1-14
----------------------

Updates
-------

Beta release of upcoming v3.0 ScanCode Workbench release

New Features
~~~~~~~~~~~~

-  Rename AboutCode Manager to ScanCode Workbench #324

Bug Fixes
~~~~~~~~~

-  Clear column filters on BarChart drill down #327
-  Package Declared Licensing filter working on unusual values #287

ScanCode Toolkit Compatibility
------------------------------

This beta version of ScanCode Workbench is compatible with scans from
any `ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__
develop version/branch at or after ``v2.9.9``. Scans imported into the
app need to contain the file information data. Therefore, the ``-i``
option needs to be used in your ScanCode command. For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the ScanCode-Workbench
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/scancode-workbench/wiki>`__.

[v2.6.1] - 2018-12-19
---------------------

Updates
-------

New Features
~~~~~~~~~~~~

-  Add Tree view to all views to aid in navigation and general UX #267
-  Visual marker for Packages on the Tree view #26
-  Visual markers for Conclusions on the Tree view #209
-  Refined column sets on the Scan Data view #272

Bug Fixes
~~~~~~~~~

-  Default SQLite filename now be identical to scan file filename #304
-  Update package's declared licensing values #318
-  Handle new scancode-toolkit header structure #323

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from any
`ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__ develop
version/branch at or after ``v2.9.8``. Scans imported into the app need
to contain the file information data. Therefore, the ``-i`` option needs
to be used in your ScanCode command. For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.6.0] - 2018-9-10
--------------------

Updates
-------

**This AboutCode-Manager release contains schema changes: scans will have to be re-imported**
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

API Changes
~~~~~~~~~~~

This release contains changes to the AboutCode Manager API: \* Add
support for Package URL #244 \* Handle new scancode Copyright attributes
#274

New Features
~~~~~~~~~~~~

-  Improve "Table" View names #268
-  Numeric columns should be right-justified #286
-  Alert user when they need to re-import scan files #288

Bug Fixes
~~~~~~~~~

-  Fix loading graphic exceeds 100% #233
-  Fix 'Has a Value' filter sometimes displaying empty copyright
   attributes #277
-  Binary filters now filtering correctly #295
-  Copyright "Has a Value" and "No Value Detected" now working #297

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from any
`ScanCode Toolkit <https://github.com/nexB/scancode-toolkit/>`__ develop
version/branch after ``v2.9.2``. Version 2.9.2 scans will still import,
but Copyright data may not display correctly. Scans imported into the
app need to contain the file information data. Therefore, the ``-i``
option needs to be used in your ScanCode command. For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.5.0] - 2018-8-14
--------------------

Updates
-------

**This AboutCode-Manager release contains schema changes: scans will have to be re-imported**
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

API Changes
~~~~~~~~~~~

This release contains changes to the AboutCode Manager API: \* License
Expression table and fields added to code models #243 \* Package Model
and fields are now aligned with ScanCode Toolkit's package model #244

New Features
~~~~~~~~~~~~

-  ClueTable View now lets the user filter by "No Value Detected" #235
-  BarChart View now lets the user drill down by "No Value Detected"
   #280
-  The user can now view Scan options used from the origin scan #239

Bug Fixes
~~~~~~~~~

-  eslint testing fixes for Windows hosts #278
-  Leading and trailing whitespace is now ignored in the global search
   box #240

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.9.2 <https://github.com/nexB/scancode-toolkit/releases/>`__. Scans
imported into the app need to contain the file information data.
Therefore, the ``-i`` option needs to be used in your ScanCode command.
For example:

.. code:: bash

    ./scancode -iclpeu <input> --json-pp <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives above. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.4.1] - 2018-7-24
--------------------

Updates:
--------

New Features
~~~~~~~~~~~~

-  Component creation dialog view no longer has a grey background. #22
-  "Clear Filters" button added: clears both column filters + global
   search box. #241
-  "All" is now an explicit column filter value. #251
-  The ClueDataTable view now resets to the top row upon hitting a
   pagination button. #252
-  Removed Node View due to lack of interest. #255

Bug Fixes
~~~~~~~~~

-  Bar chart count for clues now only counts files. #183
-  ClueDataTable filters now return exact match instead of pattern. #223
-  ClueDataTable filters now appear on all platforms correctly. #227
-  Top level directory now displays correctly. #231
-  URLs now open in the user's default desktop browser. #236
-  Changed "Component" to "Name" in Edit Conclusion screen. #250
-  BarChart Drill down filter is now activated and cleared correctly.
   #265

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
later. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.3.0] - 2018-1-30
--------------------

This release contains a change to the AboutCode Manager API. New
Conclusion Fields were added to enable a user to enter additional
Conclusion data from their review of ScanCode data.

Updates:
--------

API Changes
~~~~~~~~~~~

-  Add new component fields to table #204
-  Add AboutCode Manager header information #198

New Features
~~~~~~~~~~~~

-  Add component dialog options #204
-  Add component table column visibility button #204
-  Add additional tooltips for component fields #207
-  Fix populated data for input drop down #204
-  Add new fields to DejaCode upload #204
-  Add files\_count to JSON export #198

Bug Fixes
~~~~~~~~~

-  Fix silently failing SQLite exception #176
-  Fix cases where querying on jstree directory path returned similar
   path names #211
-  Fix input placeholder text width #204
-  Fix Table View display order #134

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__. Scans
imported into the app need to contain the file information data.
Therefore, the ``-i`` option needs to be used in your ScanCode command.
For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.4.0] - 2018-1-29
--------------------

Updates:
--------

API Changes
~~~~~~~~~~~

-  This release contains a change to the AboutCode Manager API. Header
   information from ScanCode Toolkit and AboutCode Manager are combined
   into one table. #168

New Features
~~~~~~~~~~~~

-  User feedback has been improved throughout the application. Progress
   bars are now present when loading occurs. #212
-  CSV and JSON export are available directly in Component Summary View
   #220

Bug Fixes
~~~~~~~~~

-  Fix when clue table results when a file is selected in the jsTree
   view #221

Testing
~~~~~~~

-  ESLint validation tests have been added. #168

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__. Scans
imported into the app need to contain the file information data.
Therefore, the ``-i`` option needs to be used in your ScanCode command.
For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.2.0] - 2017-12-15
---------------------

Updates:
--------

This release contains significant code refactoring #168

Bug Fixes
~~~~~~~~~

-  Fix DataTable filter to match width of the DataTable column #194
-  Remove 'About...' view from 'Help' menu #186
-  Add build matrix and use Xcode 7.3 in Travis #168

New Features
~~~~~~~~~~~~

-  Show progress with completion percentage #205
-  Filter column values based on selected directory #195
-  Display name of current SQLite file in app #185
-  Add warning for unsaved Component edits #127

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.1.0] - 2017-11-21
---------------------

Updates:
--------

API Changes
~~~~~~~~~~~

-  Add JSONStream to import JSON files larger than 256 MB #196
-  Refactored renderer to create a stream from the imported JSON file
   #196
-  Refactored aboutCodeDB to use JSONStream library to read the JSON
   file line by line #196
-  Improved database creation speed by manually implementing batch
   create and wrapping all nested batch creation calls in a transaction
   #196
-  Fixed stack overflow for large files from $.map by converting it to a
   normal for loop (aboutCodeDashboard and aboutCodeBarChart)
-  Added support for ScanCode Toolkit jsonlines format #196
-  Added AboutCode database table which contains AboutCode Manager
   version #196

Bug Fixes
~~~~~~~~~

-  Fix missing file id in nested tables #196
-  Dashboard display fixes #196
-  Cached graph data after the first load so that a database lookup
   isn’t needed for each redraw of the dashboard charts #196

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.0.1] - 2017-11-4
--------------------

Updates:
--------

Bug Fixes
~~~~~~~~~

-  Open URLs in external default browser #187
-  Remove set table filter value when a new file is loaded #181

Miscellaneous
~~~~~~~~~~~~~

-  Remove default jstree animation #188
-  Add issue template for submitting issues #190

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.0.0] - 2017-10-25
---------------------

AboutCode Manager 2.0.0 has been released 🚀

ScanCode Compatibility
----------------------

This version of AboutCode Manager is compatible with scans from
`ScanCode Toolkit
v2.2.1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -iclpeu <input> <output_file.json>

Using
-----

-  To install, download and extract the release for your operating
   system from the archives below. Then, run the AboutCode-Manager
   application from the extracted directory.

-  For more information on how to use the app see the
   `wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

Some of the key highlights include:
-----------------------------------

New Features
~~~~~~~~~~~~

-  Significant performance improvements with the addition of a new
   SQLite database
-  Upload created components to DejaCode using DejaCode API.
-  Auto-saving file (SQLite format)
-  Import and Export JSON File
-  Added ScanCode results Summary Bar Chart which when clicked shows the
   corresponding files
-  Added column filters to Table View
-  Added ability to filter nodes that are shown by their Component
   Status
-  Added ability to create component from codebase tree

API Changes
~~~~~~~~~~~

-  Changed ``dejacode_url`` attribute to ``reference_url`` attribute

Miscellaneous
~~~~~~~~~~~~~

-  Updated Electron to v1.6.14
-  Update sqlite3 to v3.1.10
-  Integrated Travis and AppVeyor into build process
-  Ported Shell build script to Python script
-  Updated application menu items
-  Various UI styling updates

Kudos
-----

:raised\_hands: Huge thanks to all the contributors who have helped
AboutCode Manager come this far. Some of the contributors to this
release with either code and/or bug reports include:

-  @jdaguil
-  @johnmhoran
-  @majurg
-  @pombredanne
-  @mjherzog
-  @JonoYang
-  @chinyeungli
-  @DennisClark
-  @nspsjsu

[v2.0.0-rc5] - 2017-12-15
-------------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism.

This version is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/>`__.
Scans imported into the app need to contain the file information data.
Therefore, the ``-i`` option needs to be used in your ScanCode command.
For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

Using
~~~~~

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory. 📢 Mac users 📢 After extracting the
release, you will need to right click the app and select **Open**.
Select **Open** again when asked if you are sure you want to open the
app.

For more information on how to use the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

Some of the key highlights include:
-----------------------------------

New Features
~~~~~~~~~~~~

-  Significant performance improvements with the addition of a new
   SQLite database
-  Upload created components to DejaCode using DejaCode API.
-  Auto-saving file (SQLite format)
-  Import and Export JSON File
-  Added ScanCode results Summary Bar Chart which when clicked shows the
   corresponding files
-  Added column filters to Table View
-  Added a UI indicator for database creation
-  Added keyboard shortcuts for different views
-  Added ability to remove created components
-  Added ability to filter nodes that are shown by their Component
   Status
-  Added ability to create component from codebase tree
-  Added Component Copyright to Component Summary table
-  Added the ability to overwrite an existing sqlite file
-  Added Export for only Component concluded data

API Changes
~~~~~~~~~~~

-  Changed ``dejacode_url`` attribute to ``reference_url`` attribute

Bug Fixes
~~~~~~~~~

-  Added error message on import when JSON is malformed
-  Fixed memory leak allocation failure for large JSON File import
-  Fixed display of directories before files in jstree
-  Removed fixed zooming in Node View

Miscellaneous
~~~~~~~~~~~~~

-  Updated Electron to v1.6.14
-  Update sqlite3 to v3.1.10
-  Replaced electron-prebuilt with electron
-  Added additional tests
-  Various updates to application build process
-  Integrated Travis and AppVeyor into build process
-  Ported Shell build script to Python script
-  Updated application menu items
-  Various UI styling updates

[v2.0.0-rc4] - 2017-9-18
------------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

Using
~~~~~

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory. 📢 Mac users 📢 After extracting the
release, you will need to right click the app and select **Open**.
Select **Open** again when asked if you are sure you want to open the
app.

For more information on how to use the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

Some of the key highlights include:
-----------------------------------

New Features
~~~~~~~~~~~~

-  Significant performance improvements with the addition of a new
   SQLite database
-  Upload created components to DejaCode using DejaCode API.
-  Auto-saving file (SQLite format)
-  Import and Export JSON File
-  Added ScanCode results Summary Bar Chart
-  Added column filters to Table View
-  Added a UI indicator for database creation
-  Added keyboard shortcuts for different views
-  Added ability to remove created components
-  Added ability to filter nodes that are shown by their Component
   Status
-  Added ability to create component from codebase tree
-  Added Component Copyright to Component Summary table

Bug Fixes
~~~~~~~~~

-  Added error message on import when JSON is malformed
-  Fixed memory leak allocation failure for large JSON File import
-  Fixed display of directories before files in jstree
-  Removed fixed zooming in Node View

Miscellaneous
~~~~~~~~~~~~~

-  Replaced electron-prebuilt with electron
-  Added additional tests
-  Various updates to application build process
-  Integrated Travis and AppVeyor into build process
-  Ported Shell build script to Python script
-  Updated application menu items
-  Various UI styling updates

[v2.0.0-rc3.post144.e15d202] - 2017-9-11
----------------------------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism. Changelog
is in preparation.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/>`__ and
above. Scans imported into the app need to contain the file information
data. Therefore, the ``-i`` option needs to be used in your ScanCode
command. For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory. 📢 Mac users 📢 After extracting the
release, you will need to right click the app and select **Open**.
Select **Open** again when asked if you are sure you want to open the
app.

For more information on how to use the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.0.0-rc3] - 2017-5-31
------------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism. Changelog
is in preparation.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/tag/v2.0.0.rc1>`__
and above. Scans imported into the app need to contain the file
information data. Therefore, the ``-i`` option needs to be used in your
ScanCode command. For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how using the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.0.0-rc2] - 2017-5-5
-----------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism. Changelog
is in preparation.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/tag/v2.0.0.rc1>`__
and above. Scans imported into the app need to contain the file
information data. Therefore, the ``-i`` option needs to be used in your
ScanCode command. For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how using the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v2.0.0-rc1] - 2017-4-22
------------------------

This is a release candidate for v2.0.0 that can be used for testing.

This is a significant new feature release that includes significant
improvements in performance and adds a data storage mechanism. Changelog
is in preparation.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/tag/v2.0.0.rc1>`__
and above. Scans imported into the app need to contain the file
information data. Therefore, the ``-i`` option needs to be used in your
ScanCode command. For example:

.. code:: bash

    ./scancode -clipeu <input> <output_file.json>

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how using the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v1.1.0-beta.3] - 2017-1-11
---------------------------

Early beta release for testing - Upgraded Electron to v1.4.0. - Added
support to Import Components to DejaCode - Added additional data fields
for Components (Primary Language and Homepage URL). - Made URLs into
hyperlinks in the table view and other minor bug fixes

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how to use the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v1.1.0-beta1] - 2016-12-23
---------------------------

Beta release for testing - Upgraded Electron. - Added support to Import
Components to DejaCode

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how to use the app see the
`wiki <https://github.com/nexB/aboutcode-manager/wiki>`__.

[v1.0.0-beta.1] - 2016-11-21
----------------------------

:rocket: Initial beta release.

AboutCode Manager is only compatible with scans from `ScanCode Toolkit
v2.0.0.rc1 <https://github.com/nexB/scancode-toolkit/releases/tag/v2.0.0.rc1>`__
and above.

Scans imported into the app need to contain the file information data.
Therefore, the ``-i`` option needs to be used in your ScanCode command.
For example:

.. code:: bash

    ./scancode -clipf

To install, download and extract the release for your operating system
from the archives below. Then, run the AboutCode-Manager application
from the extracted directory.

For more information on how to use the app see the
