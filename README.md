<p align="center"><img src="src/assets/images/scancode-workbench-logo.png" align="center" alt="ScanCode Workbench">
</p>

[![Test CI](https://github.com/aboutcode-org/scancode-workbench/actions/workflows/Test.yml/badge.svg)](https://github.com/aboutcode-org/scancode-workbench/actions/workflows/Test.yml)
[![Release](https://github.com/aboutcode-org/scancode-workbench/actions/workflows/Release.yml/badge.svg)](https://github.com/aboutcode-org/scancode-workbench/actions/workflows/Release.yml)

ScanCode Workbench provides a visual UI (GUI) to help you quickly evaluate
license, copyright and other important information from a
[ScanCode Toolkit](https://github.com/aboutcode-org/scancode-toolkit/) scan.

The Workbench is a single-user desktop application that works on Windows,
macOS, and Linux operating systems. There is no current or planned future 
functionality to edit or update scan results - the Scan data is read-only.

If you need a multi-user application for running or reviewing ScanCode scans,
you should use [ScanCode.io](https://github.com/aboutcode-org/scancode.io) 
instead of ScanCode Workbench. You cannot edit scan data in ScanCode.io, but 
you can export the scan data in SBOM, XLSX and other formats for further 
analysis and processing. You can also import a ScanCode Toolkit scan into
ScanCode.io using the `load_inventory` pipeline.

If you need an application to review and edit ScanCode scan data or to convert
that data into an SBOM or a software inventory, you should use [DejaCode](https://github.com/aboutcode-org/dejacode). You can import scan data from ScanCode Toolkit or ScanCode.io into DejaCode or you can import an SBOM. The DejaCode
Dashboard provides immediate visibility into license or vulnerability issues
related to your products, components and packages. You can use the [DejaCode demo system](https://public.dejacode.com/account/register/) for quick access to its
features and functions.

![ScanCode Workbench](/src/assets/images/workbench_intro.gif)

ScanCode Workbench is based on [Electron](https://www.electronjs.org/).


## Using

- You can
  [download the latest release](https://github.com/aboutcode-org/scancode-workbench/releases)
  for your operating system or build it yourself (see below). Once downloaded,
  you can find `ScanCode-Workbench` under
  `dist/ScanCode-Workbench-<os>-<arch>-<version>`
- ScanCode Workbench >= v4 is only compatible with scans from
  [ScanCode v32.0.0](https://github.com/aboutcode-org/scancode-toolkit/releases)
  and above which are run with the ScanCode `-i` option. For a list of available
  ScanCode options see
  [How To: Set what will be detected in a scan](https://scancode-toolkit.readthedocs.io/en/latest/tutorials/how_to_set_what_will_be_detected_in_a_scan.html)

```bash
scancode -clipeu <input> <output_file>
```

- We have provided a set of sample scans that you can quickly review in ScanCode
  Workbench in order to get a sense of its functionality and the types of
  information captured by a scan. The samples are located at
  [https://github.com/aboutcode-org/scancode-workbench/tree/develop/samples](https://github.com/aboutcode-org/scancode-workbench/tree/develop/samples).
- Import a ScanCode JSON file, and see what components are in your software! See
  the [documentation](https://scancode-workbench.readthedocs.io) for more
  information on how to use ScanCode Workbench.

[Import a JSON file](https://scancode-workbench.readthedocs.io/en/latest/how-to-guides/load-your-data/import-json.html)

## Running locally

You'll need [Node.js](https://nodejs.org) (which comes with
[npm](http://npmjs.com)) installed on your computer in order to build this app.
For a list of platform specific requirements, see the Building section of the
[documentation](https://scancode-workbench.readthedocs.io/en/latest/contribute/building.html).
Then, from your command line:

```bash
# Clone this repository
$ git clone https://github.com/aboutcode-org/scancode-workbench.git

# Go into the repository
$ cd scancode-workbench

# Install dependencies and run the app
$ npm install

# Run the app
$ npm start
```

## Release Instructions

You'll need python 3.x to run the build. You can build a `dist` directory
containing executables for your platform

Note: Due to usage of native modules, a build must be done on target platform
only.

```bash
$ npm run publish
```

You can find the executible `ScanCode-Workbench-<version>` inside
`out/ScanCode-Workbench-<version>-<os>-<arch>` and distributable archive
(.tar.gz or .zip) in `dist/`

## Testing

Run tests using:

```bash
$ npm test
```

## License

- Apache-2.0
- Multiple licenses (LGPL, MIT, BSD, etc.) for third-party components.

See the NOTICE file for more details.

## Support

If you have a question, a suggestion or find a bug, enter an issue.

[![Gitter chat](https://badges.gitter.im/aboutcode-org/gitter.png)](https://matrix.to/#/#aboutcode-org_scancode-workbench:gitter.im)

For questions and chats, you can join the Gitter channel at
https://matrix.to/#/#aboutcode-org_scancode-workbench:gitter.im
