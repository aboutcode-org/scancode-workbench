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

const fs = require('fs');
const shell = require("electron").shell;
const dialog = require('electron').remote.dialog;
const path = require('path');

const AboutCodeDB = require('./aboutCodeDB');
const Splitter = require("./splitter");
const Progress = require("./progress");
const AboutCodeDashboard = require('./aboutCodeDashboard');
const AboutCodeBarChart = require('./aboutCodeBarChart');
const DejaCodeExportDialog = require('./dejacodeExportDialog');
const ComponentDialog = require('./componentDialog');
const AboutCodeJsTree = require('./aboutCodeJsTree');
const AboutCodeNodeView = require('./aboutCodeNodeView');
const AboutCodeDataTable = require('./aboutCodeDataTables');
const ComponentDataTable = require('./componentDataTables');

// The Electron module used to communicate asynchronously from a renderer process to the main process.
const ipcRenderer = require('electron').ipcRenderer;
const aboutCodeVersion = require('../../../package.json').version;

$(document).ready(function () {
    // Create default values for all of the data and ui classes
    let aboutCodeDB = new AboutCodeDB();

    const dashboard = new AboutCodeDashboard("#dashboard-container", aboutCodeDB);

    const barChart = new AboutCodeBarChart("#summary-bar-chart", aboutCodeDB)
        .on('bar-clicked', (attribute, value) => {
            // Show files that contain attribute value selected by user in bar chart
            if (value !== "No Value Detected") {
                cluesTable.clearColumnFilters();
                cluesTable.setColumnFilter(attribute, value);

                // This needs to be done only when the column is visible.
                // So we do it last to try our best
                showClueButton.trigger("click");
            }
        })
        .on('query-interceptor', query => {
            query.where = { path: { $like: `${jstree.getSelected()}%` } };
        });

    const componentDialog = new ComponentDialog("#nodeModal", aboutCodeDB)
        .on('save', component => {
            nodeView.nodeData()[component.path].component = component;
            nodeView.redraw();
        })
        .on('delete', component => {
            nodeView.nodeData()[component.path].component = null;
            nodeView.redraw();
        });

    const dejaCodeExportDialog =
        new DejaCodeExportDialog("#componentExportModal", aboutCodeDB);

    const nodeView = new AboutCodeNodeView("#nodeview", aboutCodeDB)
        .on('node-clicked', node => componentDialog.show(node.id));

    const cluesTable = new AboutCodeDataTable("#clues-table", aboutCodeDB);
    const componentsTable = new ComponentDataTable("#components-table", aboutCodeDB)
    // TODO: Move this into componentDataTable.js
        .on('upload-clicked', components => {
            if (components.length > 0) {
                dejaCodeExportDialog.show();
            } else {
                dialog.showErrorBox(
                    "No Components to Upload",
                    "You have no Components to upload.\n\n" +
                    "Please create at least one Component and try again.");
            }
        })
        .on('export-json', exportJsonComponents);

    const jstree = new AboutCodeJsTree("#jstree", aboutCodeDB)
        .on('node-edit', node => componentDialog.show(node.id))
        .on("node-selected", node => {
            // Set the search value for the first column (path) equal to the
            // Selected jstree path and redraw the table
            const searchTerm = node.id + (node.type === "file" ? "" : "/");

            cluesTable.columns(0).search(searchTerm).draw();
            nodeView.setRoot(node.id);
            barChart.draw();
        });

    const splitter = new Splitter('#leftCol', '#rightCol')
        .on('drag-end', () => {
            if ($('#tab-barchart').is(':visible')) {
                barChart.draw();
            }
            if ($('#tab-clues').is(':visible')) {
                cluesTable.draw();
            }
        });

    // The id of the currently selected nav bar button.
    const currentNavButtonId = "#sidebar-wrapper .sidebar-nav .active button";

    // Defines DOM element constants for sidebar buttons.
    const saveSQLiteFileButton = $("#save-file");
    const openSQLiteFileButton = $("#open-file");
    const showClueButton = $("#show-tab-clues");
    const showNodeViewButton = $("#show-tab-nodeview");
    const showComponentButton = $("#show-tab-component");
    const showBarChartButton = $("#show-tab-barchart");
    const showDashboardButton = $("#show-tab-dashboard");

    // Open a SQLite Database File
    openSQLiteFileButton.click(openSQLite);

    // Save a SQLite Database file
    saveSQLiteFileButton.click(saveSQLite);

    // Show clue DataTable. Hide node view and component summary table
    showClueButton.click(() => {
        splitter.show();
        cluesTable.draw();
    });

    // Show node view. Hide clue and component table
    showNodeViewButton.click(() => {
        splitter.show();
        nodeView.redraw();
    });

    // Show component summary table. Hide DataTable and node view
    showComponentButton.click(() => {
        splitter.hide();
        componentsTable.reload();
    });

    showBarChartButton.click(() => {
        splitter.show();
        barChart.draw();
    });

    showDashboardButton.click(() => {
        splitter.hide();
        dashboard.reload();
    });

    ipcRenderer.on('table-view', () => showClueButton.trigger("click"));
    ipcRenderer.on('node-view', () => showNodeViewButton.trigger("click"));
    ipcRenderer.on('component-summary-view', () => showComponentButton.trigger("click"));
    ipcRenderer.on('open-SQLite', () => openSQLiteFileButton.trigger("click"));
    ipcRenderer.on('chart-summary-view', () => showBarChartButton.trigger("click"));
    ipcRenderer.on('save-SQLite', () => saveSQLiteFileButton.trigger("click"));
    ipcRenderer.on('import-JSON', importJson);
    ipcRenderer.on('export-JSON', exportJson);
    ipcRenderer.on('export-JSON-components-only', exportJsonComponents);

    // Open links in default browser
    $(".open-in-default").click((evt) => {
           evt.preventDefault();
           shell.openExternal(evt.target.href);
    });

    // Opens the dashboard view when the app is first opened
    showDashboardButton.trigger("click");

    /** Open a SQLite Database File */
    function openSQLite() {
        dialog.showOpenDialog({
            properties: ['openFile'],
            title: "Open a SQLite File",
            filters: [{
                name: 'SQLite File',
                extensions: ['sqlite']
            }]
        }, function(fileNames) {
            if (fileNames === undefined) {
                return;
            }
            loadDatabase(fileNames[0]);
            cluesTable.clearColumnFilters();
        });
    }

    /** Save a SQLite Database File */
    function saveSQLite() {
        dialog.showSaveDialog(
            {
                title: 'Save as a Database File',
                filters: [
                  { name: 'SQLite File', extensions: ['sqlite'] }
                ]
            },
            function (newFileName) {
                if (newFileName === undefined) {
                    return;
                }

                const oldFileName = aboutCodeDB.sequelize.options.storage;
                const reader = fs.createReadStream(oldFileName);
                const writer = fs.createWriteStream(newFileName);
                reader.pipe(writer);
                reader.on("end", () => loadDatabase(newFileName));
            }
        );
    }

    /** Import a ScanCode JSON file and create a SQLite database */
    function importJson() {
        dialog.showOpenDialog({
            title: "Open a JSON File",
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
            dialog.showSaveDialog(
                {
                    title: 'Save a SQLite Database File',
                    filters: [
                        { name: 'SQLite File', extensions: ['sqlite'] }
                    ]
                },
                function (fileName) {
                    if (fileName === undefined) {
                        return;
                    }

                    // Overwrite existing sqlite file
                    if (fs.existsSync(fileName)) {
                        fs.unlink(fileName, (err) => {
                          if (err) {
                              throw err;
                          }
                          console.info(`Deleted ${fileName}`);
                        });
                    }

                    // Create a new database when importing a json file
                    aboutCodeDB = new AboutCodeDB({
                        dbName: "demo_schema",
                        dbStorage: fileName,
                    });

                    const progressbar =
                        new Progress("#content", {
                            title: "Creating Database...",
                            size: 100,
                        });
                    aboutCodeDB.db
                        .then(() => progressbar.showDeterminate())
                        .then(() => aboutCodeDB.addFromJson(
                            jsonFileName,
                            aboutCodeVersion,
                            progress => progressbar.update(progress/100)))
                        .then(() => progressbar.hide())
                        .then(() => loadDataForViews(fileName))
                        .catch((err) => {
                            progressbar.hide();
                            if (err instanceof AboutCodeDB.MissingFileInfoError) {
                                dialog.showErrorBox(
                                    "Missing File Type Information",
                                    "Missing file 'type' information in the " +
                                    "scanned data. \n\nThis probably means you ran " +
                                    "the scan without the -i option in ScanCode. " +
                                    "The app requires file information from a " +
                                    "ScanCode scan. Rerun the scan using \n./scancode " +
                                    "-clipeu options."
                                );
                            } else {
                                // Show error for problem with the JSON file
                                dialog.showErrorBox(
                                    "JSON Error",
                                    "There is a problem with your JSON file. It may be malformed " +
                                    "(e.g., the addition of a trailing comma), " +
                                    "or there could be some other problem with the file. " +
                                    "\n\nPlease check your file and try again. " +
                                    "\n\nThe error thrown by the system is: \n\n" + err
                                );
                            }
                            console.error(err);
                        });
                });
            cluesTable.clearColumnFilters();
        });
    }

    /** Export JSON file with original ScanCode data and components that have been created */
    function exportJson() {
        dialog.showSaveDialog({
            properties: ['openFile'],
            title: "Save as JSON file",
            filters: [{
                name: 'JSON File Type',
                extensions: ['json']
            }]
        }, (fileName) => {
            if (fileName === undefined) {
                return;
            }

            let aboutCodeInfoPromise = aboutCodeDB.getAboutCodeInfo({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            let clueFilesPromise = aboutCodeDB.findAll({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            let componentsPromise = aboutCodeDB.findAllComponents({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            let filesCountPromise = aboutCodeDB.getFileCount({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            Promise.all([aboutCodeInfoPromise, filesCountPromise, clueFilesPromise, componentsPromise])
                .then(([aboutCodeInfo, filesCount, clueFiles, components]) => {
                    let json = {
                        aboutcode_manager_notice: aboutCodeInfo.notice,
                        aboutcode_manager_version: aboutCodeInfo.version,
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
            title: "Save as JSON file",
            filters: [{
                name: 'JSON File Type',
                extensions: ['json']
            }]
        }, (fileName) => {
            if (fileName === undefined) {
                return;
            }

            let aboutCodeInfoPromise = aboutCodeDB.getAboutCodeInfo({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            let componentsPromise = aboutCodeDB.findAllComponents({
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            });

            Promise.all([aboutCodeInfoPromise, componentsPromise])
                .then(([aboutCodeInfo, components]) => {
                    let json = {
                        aboutcode_manager_notice: aboutCodeInfo.notice,
                        aboutcode_manager_version: aboutCodeInfo.version,
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

    /** Creates the database and all View objects from a SQLite file */
    function loadDatabase(fileName) {
        // Create a new database when importing a json file
        aboutCodeDB = new AboutCodeDB({
            dbName: "demo_schema",
            dbStorage: fileName
        });

        loadDataForViews(fileName);
    }

    /** Loads data for all views based on the current data */
    function loadDataForViews(fileName) {
        document.title = 'AboutCode Manager - ' + path.basename(fileName);
        return aboutCodeDB.db
            .then(() => {
                // update all views with the new database.
                componentDialog.database(aboutCodeDB);
                dejaCodeExportDialog.database(aboutCodeDB);

                jstree.database(aboutCodeDB);
                cluesTable.database(aboutCodeDB);
                componentsTable.database(aboutCodeDB);
                dashboard.database(aboutCodeDB);
                nodeView.database(aboutCodeDB);
                barChart.database(aboutCodeDB);

                // Reload the jstree, then trigger the current view to reload.
                jstree.reload();
                $(currentNavButtonId).trigger("click");
                return aboutCodeDB;
            })
            .catch(function(reason) {
               throw reason;
            });
    }
});

module.exports = aboutCodeVersion;