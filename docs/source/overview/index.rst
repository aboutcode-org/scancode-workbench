=================
:index:`Overview`
=================

What Is ScanCode Workbench?
================================

ScanCode Workbench is a desktop application designed to view and work with ScanCode Toolkit
scans.  With ScanCode Workbench, you can:

-  Load a `ScanCode Toolkit <https://github.com/nexB/scancode-toolkit>`__ ``.json`` scan of
   your codebase.
-  Use an advanced visual UI to analyze license and other notices identified by ScanCode Toolkit.

Organization of the Documentation
=================================

This documentation is organized in six sections:

-  The :ref:`getting-started` section -- the suggested entry point for all new users -- will walk
   you through the process of downloading, installing and opening ScanCode Workbench and
   loading a ScanCode Toolkit scan.

-  The :ref:`how-to-guides` section contains feature-specific guides and can be read in any order
   as the need arises.

-  The :ref:`ui-reference` section provides an overview of each of ScanCode Workbench's data views.

-  The :ref:`contribute` section is intended for advanced users and contributors to ScanCode
   Workbench development.

-  The :ref:`license` section provides summary licensing information for ScanCode Workbench.

Underlying Technology
=====================

-  ScanCode Workbench is a cross-platform application built using the `Electron <https://www.electronjs.org/>`__  framework that works on Windows, macOS and Linux operating systems.
- It uses
   - `TypeScript <https://www.typescriptlang.org/>`__ as the primary language.
   - `React <https://react.dev/>`__  for user interface.
   - `Sequelize <https://sequelize.org/>`__  ORM for database access.
   - `Sqlite3 <https://www.sqlite.org/index.html>`__  for managing sqlite database.

Platform Support
================

* Linux - ``x64``
* Windows 10/11 - ``x64``
* MacOS - ``x64``, ``arm64``

Important Links
===============

-  Repository: https://github.com/nexB/scancode-workbench

-  Issues: https://github.com/nexB/scancode-workbench/issues
