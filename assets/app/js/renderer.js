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
const ComponentDialog = require('./controllers/componentDialog');
const AboutCodeDashboard = require('./controllers/aboutCodeDashboard');
const AboutCodeBarChart = require('./controllers/aboutCodeBarChart');
const AboutCodeJsTree = require('./controllers/aboutCodeJsTree');
const AboutCodeClueDataTable = require('./controllers/aboutCodeClueDataTable');
const AboutCodeComponentDataTable = require('./controllers/aboutCodeComponentDataTable');

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
      if (value !== 'No Value Detected') {
        cluesTable.clearColumnFilters();
        cluesTable.setColumnFilter(attribute, value);
        
        updateViewsByPath(cluesTable._selectedPath);

        // This needs to be done only when the column is visible.
        // So we do it last to try our best
        showClueButton.trigger('click');
      }
    });

  const cluesTable = new AboutCodeClueDataTable('#tab-clues', aboutCodeDB);

  const componentsTable = new AboutCodeComponentDataTable('#tab-component', aboutCodeDB)
    .on('upload-clicked', (components) => {
      if (components.length > 0) {
        dejaCodeExportDialog.show();
      } else {
        dialog.showErrorBox(
          'No Components to Upload',
          'You have no Components to upload.\n\n' +
                    'Please create at least one Component and try again.');
      }
    })
    .on('export-json', exportJsonComponents);

  const componentDialog = new ComponentDialog('#componentDialog', aboutCodeDB)
    .on('save', () => {
      componentsTable.needsReload(true);
      redrawCurrentView();
    })
    .on('delete', () => {
      componentsTable.needsReload(true);
      redrawCurrentView();
    });

  const dejaCodeExportDialog =
        new DejaCodeExportDialog('#componentExportModal', aboutCodeDB);

  const jstree = new AboutCodeJsTree('#jstree', aboutCodeDB)
    .on('node-edit', (node) => componentDialog.show(node.id))
    .on('node-selected', (node) => {
      updateViewsByPath(node.id);
    });

  $(document).on('click', '#gen-filters-button', () => { 
    cluesTable.genFilters(); 
    updateViewsByPath(cluesTable._selectedPath);
  });

  $(document).on('click', '#clear-filters-button', () => { 
    cluesTable.resetColumnFilters(); 
    updateViewsByPath(cluesTable._selectedPath);
  });

  const splitter = new Splitter('#leftCol', '#rightCol')
    .on('drag-end', () => redrawCurrentView());

  // The id of the currently selected nav bar button.
  const currentNavButtonId = '#sidebar-wrapper .sidebar-nav .active button';

  // Defines DOM element constants for sidebar buttons.
  const saveSQLiteFileButton = $('#save-file');
  const openSQLiteFileButton = $('#open-file');
  const showClueButton = $('#show-tab-clues');
  const showComponentButton = $('#show-tab-component');
  const showBarChartButton = $('#show-tab-barchart');
  const showDashboardButton = $('#show-tab-dashboard');

  // Open a SQLite Database File
  openSQLiteFileButton.click(openSQLite);

  // Save a SQLite Database file
  saveSQLiteFileButton.click(saveSQLite);

  // Show clue DataTable. Hide node view and component summary table
  showClueButton.click(() => {
    splitter.show();
    cluesTable.redraw();
  });

  // Show component summary table. Hide DataTable and node view
  showComponentButton.click(() => {
    splitter.hide();
    componentsTable.redraw();
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

  ipcRenderer.on('table-view', () => showClueButton.trigger('click'));
  ipcRenderer.on('component-summary-view', () => showComponentButton.trigger('click'));
  ipcRenderer.on('open-SQLite', () => openSQLiteFileButton.trigger('click'));
  ipcRenderer.on('chart-summary-view', () => showBarChartButton.trigger('click'));
  ipcRenderer.on('save-SQLite', () => saveSQLiteFileButton.trigger('click'));
  ipcRenderer.on('import-JSON', importJson);
  ipcRenderer.on('export-JSON', exportJson);
  ipcRenderer.on('export-JSON-components-only', exportJsonComponents);

  // Opens the dashboard view when the app is first opened
  showDashboardButton.trigger('click');

  function updateViewsByPath(path) {
    // Update all the views with the given path string
    cluesTable.columns(0).search(path);

    componentDialog.selectedPath(path);
    dejaCodeExportDialog.selectedPath(path);
    jstree.selectedPath(path);
    cluesTable.selectedPath(path);
    componentsTable.selectedPath(path);
    dashboard.selectedPath(path);
    barChart.selectedPath(path);

    redrawCurrentView();
  }

  /** Creates the database and all View objects from a SQLite file */
  function loadDatabase(fileName) {
    // Create a new database when importing a json file
    aboutCodeDB = new AboutCodeDB({
      dbName: 'aboutcode_db',
      dbStorage: fileName
    });

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

  /** Loads data for all views based on the current data */
  function updateViews() {
    return aboutCodeDB.sync
      .then(() => {
        const currFile = aboutCodeDB.sequelize.options.storage;
        document.title = 'AboutCode Manager - ' + path.basename(currFile);
        cluesTable.clearColumnFilters();

        // update all views with the new database.
        componentDialog.db(aboutCodeDB);
        dejaCodeExportDialog.db(aboutCodeDB);
        jstree.db(aboutCodeDB);
        cluesTable.db(aboutCodeDB);
        componentsTable.db(aboutCodeDB);
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

  /** Export JSON file with original ScanCode data and components that have been created */
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

      const clueFilesPromise = aboutCodeDB.findAll({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      const componentsPromise = aboutCodeDB.findAllComponents({
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
        filesCountPromise, clueFilesPromise, componentsPromise])
        .then(([scanCodeInfo, aboutCodeInfo, filesCount, clueFiles, components]) => {
          const json = {
            aboutcode_manager_notice: aboutCodeInfo.aboutcode_manager_notice,
            aboutcode_manager_version: aboutCodeInfo.aboutcode_manager_version,
            scancode_version: scanCodeInfo.scancode_version,
            scancode_options: scanCodeInfo.scancode_options,
            files_count: filesCount,
            files: clueFiles,
            components: components
          };

          fs.writeFile(fileName, JSON.stringify(json), (err) => {
            if (err) {
              throw err;
            }
          });
        });
    });
  }

  /** Export JSON file with only components that have been created */
  function exportJsonComponents() {
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

      const componentsPromise = aboutCodeDB.findAllComponents({
        attributes: {
          exclude: ['id', 'createdAt', 'updatedAt']
        }
      });

      Promise.all([aboutCodeInfoPromise, componentsPromise])
        .then(([aboutCodeInfo, components]) => {
          const json = {
            aboutcode_manager_notice: aboutCodeInfo.aboutcode_manager_notice,
            aboutcode_manager_version: aboutCodeInfo.aboutcode_manager_version,
            components: components
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
