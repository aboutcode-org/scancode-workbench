# <img src="assets/images/aboutcode-logo.png" align="center" alt="AboutCode Manager">

[![Travis Build Status](https://travis-ci.org/nexB/aboutcode-manager.svg?branch=develop)](https://travis-ci.org/nexB/aboutcode-manager) 
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/nexB/aboutcode-manager)](https://ci.appveyor.com/project/nexB/aboutcode-manager)

AboutCode Manager provides an advanced visual UI to help you quickly evaluate
license and other notices identified by 
[ScanCode](https://github.com/nexB/scancode-toolkit/) and record your conclusion
about the effective license(s) for a component. AboutCode Manager is based on
[Electron](https://electron.atom.io/) and will be the primary desktop/GUI tool 
for using nexB’s [AboutCode tools](https://github.com/nexB/aboutcode). This app 
works on Windows, OS X and Linux operating systems.

[ScanCode](https://github.com/nexB/scancode-toolkit/) detects licenses, copyrights 
and other interesting information in your code and enables you to format the scan 
results as JSON. AboutCode Manager allows you to take the JSON-formatted 
scan results from ScanCode and create components. By creating these components 
within your codebase, you are creating a software inventory of your product. 
The conclusions (Concluded License, Concluded Owner, etc.) you make when 
creating your component can then be exported to a JSON file.

![AboutCode Manager](https://github.com/nexB/aboutcode-manager/wiki/aboutcode-manager-chart-summary.gif)

## Using

* You can [download the latest release](https://github.com/nexB/aboutcode-manager/releases) 
for your operating system or build it yourself (see below). Once downloaded, you 
can find `AboutCode-Manager` under `dist/AboutCode-Manager-<os>-x64-<version>`.
* AboutCode Manager v2 is only compatible with scans from 
[ScanCode Toolkit v2.0.0](https://github.com/nexB/scancode-toolkit/releases) and 
above which are run with the ScanCode `-i` option. For a list of available ScanCode 
options see [How To: Set what will be detected in a scan](https://github.com/nexB/scancode-toolkit/wiki/How-To:-Set-what-will-be-detected-in-a-scan)

```bash
./scancode -clipeu <input> <output_file>
```

* We have provided a set of sample scans that you can quickly review in 
AboutCode Manager in order to get a sense of its functionality and the types of 
information captured by a scan.  The samples are located at 
[https://github.com/nexB/aboutcode-manager/tree/develop/samples](https://github.com/nexB/aboutcode-manager/tree/develop/samples).

* To import a ScanCode JSON file:
  * Open the `File` menu and select `Import JSON File` (keyboard shortcut: 
  <kbd>Ctrl+I</kbd> or <kbd>&#8984;+I</kbd>).
  * In the dialog window that opens, navigate to the JSON file you want to 
  import, select the file and click `Open`.
  * You will then be prompted to choose a filename and location to save the JSON 
  file as a SQLite database file.  Add a filename, select the folder in which 
  you want to save the SQLite database file, and click `Save`.
  * AboutCode Manager will then create a SQLite database file from your JSON 
  file, indicated by the status message "Creating Database ..."
  * Once the process has finished, the status message will be replaced by an 
  expandable tree displaying the root node of your SQLite database file and, to 
  the right of the tree, a table displaying the root node attributes generated 
  by ScanCode.

See the [wiki](https://github.com/nexB/aboutcode-manager/wiki#tutorials) for 
more documentation on how to use AboutCode Manager.

## Building

You'll need [Node.js](https://nodejs.org) (which comes with [npm](http://npmjs.com)) 
installed on your computer in order to build this app. For a list of platform 
specific requirements, see the Building section of the [wiki](https://github.com/nexB/aboutcode-manager/wiki/Building).
Then, from your command line:

```bash
# Clone this repository
git clone https://github.com/nexB/aboutcode-manager.git

# Go into the repository
cd aboutcode-manager

# Install dependencies and run the app
npm install

# Rebuild native Node.js modules against the app version of Node.js
# MacOS, Linux and Git Bash on Windows
$(npm bin)/electron-rebuild
# Windows except for Git Bash
.\node_modules\.bin\electron-rebuild.cmd

# Run the app
npm start
```

## Release instructions

You can build a `dist` directory containing executables for any one of three 
target platforms by running:

```bash
$ python build.py
```

After building is done, you can find `AboutCode-Manager` under 
`dist/AboutCode-Manager-<os>-x64-<version>`. Archives (tar.gz and .zip) are 
also built.

Note: A build for any of the three target platforms must be executed on the 
targeted platform.

## Testing

Test functionality using:

```bash
$ npm test
```

## License

* Apache-2.0 with an acknowledgement required to accompany the scan output.
* Public domain CC-0 for reference datasets.
* Multiple licenses (LGPL, MIT, BSD, etc.) for third-party components.

See the NOTICE file for more details.

## Support

If you have a question, a suggestion or find a bug, enter an issue.

For questions and chats, there is an official #aboutcode IRC channel on freenode 
for scancode and other related tools. You can use your favorite IRC client or 
use the web chat at http://webchat.freenode.net/
