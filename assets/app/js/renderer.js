/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/aboutcode-manager/
 # The ScanCode software is licensed under the Apache License version 2.0.
 # AboutCode is a trademark of nexB Inc.
 #
 # You may not use this software except in compliance with the License.
 # You may obtain a copy of the License at: http://apache.org/licenses/LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software distributed
 # under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 # CONDITIONS OF ANY KIND, either express or implied. See the License for the
 # specific language governing permissions and limitations under the License.
 #
 */

const AboutCodeDB = require('./aboutCodeDB');
const Splitter = require('./helpers/splitter');
const Progress = require('./helpers/progress');

const DejaCodeExportDialog = require('./controllers/dejacodeExportDialog');
const ConclusionDialog = require('./controllers/conclusionDialog');
const AboutCodeDashboard = require('./controllers/aboutCodeDashboard');
const AboutCodeBarChart = require('./controllers/aboutCodeBarChart');
const AboutCodeJsTree = require('./controllers/aboutCodeJsTree');
const AboutCodeScanDataTable = require('./controllers/aboutCodeScanDataTable');
const AboutCodeConclusionDataTable = require('./controllers/aboutCodeConclusionDataTable');

const fs = require('fs');
const shell = require('electron').shell;
const dialog = require('electron').remote.dialog;
const path = require('path');

// The Electron module used to communicate asynchronously from a renderer process to the main process.
const ipcRenderer = require('electron').ipcRenderer;
const aboutCodeVersion = require('../../../package.json').version;

/**
 * This is the UI Controller for the application. It's responsible for
 * initializing and updating all of the views and handling user interaction
 */
$(document).ready(() => {
  // Create default values for all of the data and ui classes
  let aboutCodeDB = new AboutCodeDB();

  const dashboard = new AboutCodeDashboard('#tab-dashboard', aboutCodeDB);

  const barChart = new AboutCodeBarChart('#tab-barchart', aboutCodeDB)
    .on('bar-clicked', (attribute, value) => {
      // Show files that contain attribute value selected by user in bar chart
      scanDataTable.clearColumnFilters();
      if (value !== 'No Value Detected') {
        scanDataTable.setColumnFilter(attribute, value);
      } else {
        scanDataTable.setColumnFilter(attribute, 'about_code_data_table_no_value_detected');
      }

      updateViewsByPath(scanDataTable._selectedPath);

      // This needs to be done only when the column is visible.
      // So we do it last to try our best
      showScanDataButton.trigger('click');
    });

  const scanDataTable = new AboutCodeScanDataTable('#tab-scandata', aboutCodeDB);

  const conclusionsTable = new AboutCodeConclusionDataTable('#tab-conclusion', aboutCodeDB)
    .on('upload-clicked', (conclusions) => {
      if (conclusions.length > 0) {
        dejaCodeExportDialog.show();
      } else {
        dialog.showErrorBox(
          'No Conclusions to Upload',
          'You have no Conclusions to upload.\n\n' +
                    'Please create at least one Conclusion and try again.');
      }
    })
    .on('export-json', exportJsonConclusions);

  const conclusionDialog = new ConclusionDialog('#conclusionDialog', aboutCodeDB)
    .on('save', () => {
      conclusionsTable.needsReload(true);
      redrawCurrentView();
    })
    .on('delete', () => {
      conclusionsTable.needsReload(true);
      redrawCurrentView();
    });

  const dejaCodeExportDialog =
        new DejaCodeExportDialog('#conclusionExportModal', aboutCodeDB);

  const jstree = new AboutCodeJsTree('#jstree', aboutCodeDB)
    .on('node-edit', (node) => conclusionDialog.show(node.id))
    .on('node-selected', (node) => {
      updateViewsByPath(node.id);
    });

  $(document).on('click', '#activate-filters-button', () => {
    scanDataTable.genFilters();
    updateViewsByPath(scanDataTable._selectedPath);
  });

  $(document).on('click', '#clear-filters-button', () => {
    scanDataTable.resetColumnFilters();
    updateViewsByPath(scanDataTable._selectedPath);
  });

  const splitter = new Splitter('#leftCol', '#rightCol')
    .on('drag-end', () => redrawCurrentView());

  // The id of the currently selected nav bar button.
  const currentNavButtonId = '#sidebar-wrapper .sidebar-nav .active button';

  // Defines DOM element constants for sidebar buttons.
  const saveSQLiteFileButton = $('#save-file');
  const openSQLiteFileButton = $('#open-file');
  const showScanDataButton = $('#show-tab-scandata');
  const showConclusionButton = $('#show-tab-conclusion');
  const showBarChartButton = $('#show-tab-barchart');
  const showDashboardButton = $('#show-tab-dashboard');

  // Open a SQLite Database File
  openSQLiteFileButton.click(openSQLite);

  // Save a SQLite Database file
  saveSQLiteFileButton.click(saveSQLite);

  // Show ScanData DataTable. Hide node view and conclusion summary table
  showScanDataButton.click(() => {
    splitter.show();
    scanDataTable.redraw();
  });

  // Show conclusion summary table. Hide DataTable and node view
  showConclusionButton.click(() => {
    splitter.hide();
    conclusionsTable.redraw();
  });

  showBarChartButton.click(() => {
    splitter.show();
    barChart.redraw();
  });

  showDashboardButton.click(() => {
    splitter.hide();
    dashboard.redraw();
  });

  // Open links in default browser
  $('.open-in-default').click((evt) => {
    evt.preventDefault();
    shell.openExternal(evt.target.href);
  });

  ipcRenderer.on('table-view', () => showScanDataButton.trigger('click'));
  ipcRenderer.on('conclusion-summary-view', () => showConclusionButton.trigger('click'));
  ipcRenderer.on('open-SQLite', () => openSQLiteFileButton.trigger('click'));
  ipcRenderer.on('chart-summary-view', () => showBarChartButton.trigger('click'));
  ipcRenderer.on('save-SQLite', () => saveSQLiteFileButton.trigger('click'));
  ipcRenderer.on('import-JSON', importJson);
  ipcRenderer.on('export-JSON', exportJson);
  ipcRenderer.on('export-JSON-conclusions-only', exportJsonConclusions);
  ipcRenderer.on('get-ScanInfo', getScanInfo);

  // Opens the dashboard view when the app is first opened
  showDashboardButton.trigger('click');

  function updateViewsByPath(path) {
    // Update all the views with the given path string
    scanDataTable.columns(0).search(path);

    conclusionDialog.selectedPath(path);
    dejaCodeExportDialog.selectedPath(path);
    jstree.selectedPath(path);
    scanDataTable.selectedPath(path);
    conclusionsTable.selectedPath(path);
    dashboard.selectedPath(path);
    barChart.selectedPath(path);

    redrawCurrentView();
  }

  function schemaChange(dbVersion, aboutCodeVersion) {
    dbVersion = dbVersion.split('.');
    aboutCodeVersion = aboutCodeVersion.split('.');

    if (dbVersion[1] != aboutCodeVersion[1]) {
      return true;
    } else {
      return false;
    }
  }

  /** Creates the database and all View objects from a SQLite file */
  function loadDatabase(fileName) {
    // Create a new database when importing a json file
    aboutCodeDB = new AboutCodeDB({
      dbName: 'aboutcode_db',
      dbStorage: fileName
    });
    
    // Check that that the database schema matches current schema.
    aboutCodeDB.sync
      .then((db) => db.Header.findById(1)
        .then((header) => {
          const dbVersion = header.aboutcode_manager_version;
          if (schemaChange(dbVersion, aboutCodeVersion)) { 
            dialog.showErrorBox(
              'Old SQLite schema found at file: ' + fileName,
              'The SQLite schema has been updated since the last time you loaded this ' +
              'file.\n\n' + 
              'Some features may not work correctly until you re-import the original' +
              'ScanCode JSON file to create an updated SQLite database.');
          }
        }));
    // Check that the database has the correct header information.
    aboutCodeDB.sync
      .then((db) => db.Header.findAll())
      .then((headers) => {
        if (headers.length === 0) {
          dialog.showErrorBox(
            'Invalid SQLite file: ' + fileName,
            'The SQLite file is invalid. Try re-importing the ScanCode JSON ' +
            'file and creating a new SQLite file.');
        }
      });

    return updateViews();
  }

  // Get the ScanCode version and options data from the DB and populate and open the modal
  function getScanInfo() {
    return aboutCodeDB.sync
      .then((db) => db.Header.findById(1)
        .then((header) => {
          const scancode_label = $('#scancode-info').find('#scancode-label');
          const scancode_display = $('#scancode-info').find('#scancode-display');
          if (header === null || header.scancode_version === null || header.scancode_options === null) {
            scancode_label.text('Please import a ScanCode results file or an AboutCode Manager sqlite file to see the scan options.');
            scancode_display.css('display', 'none');
          } else {
            scancode_label.text('This information has been extracted from your imported ScanCode JSON file:');
            scancode_display.text('ScanCode version: ' + header.scancode_version + '\n\nScanCode options: ' + JSON.stringify(header.scancode_options, null, 2));
            scancode_display.css('display', 'block');
          }
        }))
      .then($('#myModal').modal('show'));
  }

  /** Loads data for all views based on the current data */
  function updateViews() {
    return aboutCodeDB.sync
      .then(() => {
        const currFile = aboutCodeDB.sequelize.options.storage;
        document.title = 'AboutCode Manager - ' + path.basename(currFile);
        scanDataTable.clearColumnFilters();

        // update all views with the new database.
        conclusionDialog.db(aboutCodeDB);
        dejaCodeExportDialog.db(aboutCodeDB);
        jstree.db(aboutCodeDB);
        scanDataTable.db(aboutCodeDB);
        conclusionsTable.db(aboutCodeDB);
        dashboard.db(aboutCodeDB);
        barChart.db(aboutCodeDB);

        // Reload the jstree, then trigger the current view to reload.
        jstree.redraw();
      })
      .catch((reason) => { throw reason; });
  }

  function redrawCurrentView() {
    $(currentNavButtonId).trigger('click');
  }

  /** Open a SQLite Database File */
  function openSQLite() {
    dialog.showOpenDialog({
      properties: ['openFile'],
      title: 'Open a SQLite File',
      filters: [{
        name: 'SQLite File',
        extensions: ['sqlite']
      }]
    }, (fileNames) => {
      if (fileNames && fileNames[0]) {
        loadDatabase(fileNames[0]);
      }
    });
  }

  /** Save a SQLite Database File */
  function saveSQLite() {
    dialog.showSaveDialog({
      title: 'Save as a Database File',
      filters: [
        { name: 'SQLite File', extensions: ['sqlite'] }
      ]
    }, (newFileName) => {
      if (newFileName) {
        const oldFileName = aboutCodeDB.sequelize.options.storage;
        const reader = fs.createReadStream(oldFileName);
        const writer = fs.createWriteStream(newFileName);
        reader.pipe(writer);
        reader.on('end', () => loadDatabase(newFileName));
      }
    });
  }

  /** Import a ScanCode JSON file and create a SQLite database */
  function importJson() {
    dialog.showOpenDialog({
      title: 'Open a JSON File',
      filters: [{
        name: 'JSON File',
        extensions: ['json']
      }]
    }, (fileNames) => {
      if (fileNames === undefined) {
        return;
      }

      const jsonFileName = fileNames[0];

      // Immediately ask for a SQLite to save and create the database
      dialog.showSaveDialog({
        title: 'Save a SQLite Database File',
        filters: [{
          name: 'SQLite File',
          extensions: ['sqlite']
        }]
      }, (sqliteFileName) => {
        if (sqliteFileName === undefined) {
          return;
        }

        // Overwrite existing sqlite file
        if (fs.existsSync(sqliteFileName)) {
          fs.unlink(sqliteFileName, (err) => {
            if (err) {
              throw err;
            }
            console.info(`Deleted ${sqliteFileName}`);
          });
        }

        // Create a new database when importing a json file
        aboutCodeDB = new AboutCodeDB({
          dbName: 'demo_schema',
          dbStorage: sqliteFileName,
        });

        const progressbar = new Progress('#content', {
          title: 'Creating Database...',
          size: 100,
        });

        aboutCodeDB.sync
          .then(() => progressbar.showDeterminate())
          .then(() => aboutCodeDB.addFromJson(
            jsonFileName,
            aboutCodeVersion,
            (progress) => progressbar.update(progress / 100)))
          .then(() => progressbar.hide())
          .then(updateViews)
          .catch((err) => {
            progressbar.hide();
            if (err instanceof AboutCodeDB.MissingFileInfoError) {
              dialog.showErrorBox(
                'Missing File Type Information',
                'Missing file \'type\' information in the scanned data. ' +
                '\n\nThis probably means you ran the scan without the -i ' +
                'option in ScanCode. The app requires file information from ' +
                'a ScanCode scan. Rerun the scan using \n./scancode ' +
                '-clipeu options.'
              );
            } else {
              // Show error for problem with the JSON file
              dialog.showErrorBox(
                'JSON Error',
                'There is a problem with your JSON file. It may be malformed ' +
                '(e.g., the addition of a trailing comma), ' +
                'or there could be some other problem with the file. ' +
                '\n\nPlease check your file and try again. ' +
                '\n\nThe error thrown by the system is: \n\n' + err
              );
            }
            console.error(err);
          });
      });
    });
  }

  /** Export JSON file with original ScanCode data and conclusions that have been created */
  function exportJson() {
    dialog.showSaveDialog({
      properties: ['openFile'],
      title: 'Save as JSON file',
      filters: [{
        name: 'JSON File Type',
        extensions: ['json']
      }]
    }, (fileName) => {
      if (fileName === undefined) {
        return;
      }

      const scanCodeInfoPromise = aboutCodeDB.getScanCodeInfo({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const aboutCodeInfoPromise = aboutCodeDB.getAboutCodeInfo({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const scanDataFilesPromise = aboutCodeDB.findAll({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const conclusionsPromise = aboutCodeDB.findAllConclusions({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const filesCountPromise = aboutCodeDB.getFileCount({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      Promise.all([scanCodeInfoPromise, aboutCodeInfoPromise,
        filesCountPromise, scanDataFilesPromise, conclusionsPromise])
        .then(([scanCodeInfo, aboutCodeInfo, filesCount, scanDataFiles, conclusions]) => {
          const json = {
            aboutcode_manager_notice: aboutCodeInfo.aboutcode_manager_notice,
            aboutcode_manager_version: aboutCodeInfo.aboutcode_manager_version,
            scancode_version: scanCodeInfo.scancode_version,
            scancode_options: scanCodeInfo.scancode_options,
            files_count: filesCount,
            files: scanDataFiles,
            conclusions: conclusions
          };

          fs.writeFile(fileName, JSON.stringify(json), (err) => {
            if (err) {
              throw err;
            }
          });
        });
    });
  }

  /** Export JSON file with only conclusions that have been created */
  function exportJsonConclusions() {
    dialog.showSaveDialog({
      properties: ['openFile'],
      title: 'Save as JSON file',
      filters: [{
        name: 'JSON File Type',
        extensions: ['json']
      }]
    }, (fileName) => {
      if (fileName === undefined) {
        return;
      }

      const aboutCodeInfoPromise = aboutCodeDB.getAboutCodeInfo({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const conclusionsPromise = aboutCodeDB.findAllConclusions({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      Promise.all([aboutCodeInfoPromise, conclusionsPromise])
        .then(([aboutCodeInfo, conclusions]) => {
          const json = {
            aboutcode_manager_notice: aboutCodeInfo.aboutcode_manager_notice,
            aboutcode_manager_version: aboutCodeInfo.aboutcode_manager_version,
            conclusions: conclusions
          };

          fs.writeFile(fileName, JSON.stringify(json), (err) => {
            if (err) {
              throw err;
            }
          });
        });
    });
  }
});

module.exports = aboutCodeVersion;
