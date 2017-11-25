/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # http://nexb.com and https://github.com/nexB/aboutcode-manager/
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

 // The electron library for opening a dialog
const dialog = require('electron').remote.dialog;

// The Electron module used to communicate asynchronously from a renderer process to the main process.
const ipcRenderer = require('electron').ipcRenderer;
const packageJson = require('../../../package.json');
const aboutCodeVersion = packageJson.version;

$(document).ready(function () {
    // Create default values for all of the data and ui classes
    let aboutCodeDB = new AboutCodeDB();
    let dashboard = new AboutCodeDashboard("#dashboard-container", aboutCodeDB);

    const barChart = new AboutCodeBarChart("#summary-bar-chart", aboutCodeDB)
        .on('bar-clicked', (attribute, value) => {
            chartSummaryToFiles(attribute, value);
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
        .on('upload-clicked', components => {
            if (components.length > 0) {
                dejaCodeExportDialog().show();
            } else {
                alert("You have no Components to upload.\n\n" +
                    "Please create at least one Component and try again.");
            }
        });

    const jstree = new AboutCodeJsTree("#jstree", aboutCodeDB)
        .on('node-edit', node => componentDialog.show(node.id))
        .on("node-selected", node => {
            // Set the search value for the first column (path) equal to the
            // Selected jstree path and redraw the table
            cluesTable.columns(0).search(node.id).draw();
            nodeView.setRoot(node.id);
            barChart.draw();
        });

    const splitter = new Splitter('#leftCol', '#tabbar')
        .on('drag-end', () => {
            if ($('#bar-chart-container').is(':visible')) {
                barChart.draw();
            }
            if ($('#clues-container').is(':visible')) {
                cluesTable.draw();
            }
        });

    // Setup css styling for sidebar button state when clicked.
    const navButtons = $("#sidebar-wrapper").find(".btn-change");
    navButtons.each((i, clickedButton) => {
        $(clickedButton).click(function() {
            navButtons.each((i, button) => {
                if (button === clickedButton) {
                    $(button).addClass("selected");
                } else {
                    $(button).removeClass("selected");
                }
            });
        });
    });

    // Defines DOM element constants for buttons.
    const showClueButton = $("#show-clue-table");
    const showNodeViewButton = $("#show-tree");
    const showComponentButton = $("#show-component-table");
    const showBarChartButton = $("#show-bar-chart");
    const showDashboardButton = $("#show-dashboard");
    const saveSQLiteFileButton = $("#save-file");
    const openSQLiteFileButton = $("#open-file");
    const leftCol = $("#leftCol");
    const tabBar = $("#tabbar");

    // Defines DOM element constants for the main view containers.
    const nodeContainer = $("#node-container");
    const cluesContainer = $("#clues-container");
    const componentContainer = $("#component-container");
    const barChartContainer = $("#bar-chart-container");
    const dashboardContainer = $("#dashboard-container");

    // Open a SQLite Database File
    openSQLiteFileButton.click(openSQLite);

    // Save a SQLite Database file
    saveSQLiteFileButton.click(saveSQLite);

    ipcRenderer.on('table-view', () => showClueButton.trigger("click"));
    ipcRenderer.on('node-view', () => showNodeViewButton.trigger("click"));
    ipcRenderer.on('component-summary-view', () => showComponentButton.trigger("click"));
    ipcRenderer.on('open-SQLite', openSQLite);
    ipcRenderer.on('chart-summary-view', () => showBarChartButton.trigger("click"));
    ipcRenderer.on('save-SQLite', saveSQLite);
    ipcRenderer.on('import-JSON', importJson);
    ipcRenderer.on('export-JSON', exportJson);
    ipcRenderer.on('export-JSON-components-only', exportJsonComponents);

    // Open links in default browser
    $(".open-in-default").click((evt) => {
           evt.preventDefault();
           shell.openExternal(evt.target.href);
    });

    // Show clue DataTable. Hide node view and component summary table
    showClueButton.click(() => {
        splitter.show();
        cluesContainer.show();
        nodeContainer.hide();
        componentContainer.hide();
        barChartContainer.hide();
        dashboardContainer.hide();
        cluesTable.draw();
    });

    // Show node view. Hide clue and component table
    showNodeViewButton.click(() => {
        splitter.show();
        nodeContainer.show();
        cluesContainer.hide();
        componentContainer.hide();
        barChartContainer.hide();
        dashboardContainer.hide();
        nodeView.redraw();
    });

    // Show component summary table. Hide DataTable and node view
    showComponentButton.click(() => {
        splitter.hide();
        componentContainer.show();
        nodeContainer.hide();
        cluesContainer.hide();
        barChartContainer.hide();
        dashboardContainer.hide();
        componentsTable.reload();
    });

    showBarChartButton.click(() => {
        splitter.show();
        barChartContainer.show();
        componentContainer.hide();
        nodeContainer.hide();
        cluesContainer.hide();
        dashboardContainer.hide();
        barChart.draw();
    });

    showDashboardButton.click(() => {
        splitter.hide();
        dashboardContainer.show();
        componentContainer.hide();
        nodeContainer.hide();
        cluesContainer.hide();
        barChartContainer.hide();
        dashboard.reload();
    });

    showDashboardButton.trigger("click");

    // Creates the database and all View objects from a SQLite file
    function loadDatabaseFromFile(fileName) {
        // Create a new database when importing a json file
        aboutCodeDB = new AboutCodeDB({
            dbName: "demo_schema",
            dbStorage: fileName
        });

        reloadDataForViews();
    }

    function reloadDataForViews() {
        // The flattened data is used by the clue table and jstree
        return aboutCodeDB.db
            .then(() => {
                componentDialog.database(aboutCodeDB);
                dejaCodeExportDialog.database(aboutCodeDB);

                jstree.database(aboutCodeDB);
                jstree.reload();

                // reload the DataTable after all insertions are done.
                cluesTable.database(aboutCodeDB);
                cluesTable.reload();

                componentsTable.database(aboutCodeDB);
                componentsTable.reload();

                dashboard.database(aboutCodeDB);
                dashboard.reload();

                nodeView.database(aboutCodeDB);
                nodeView.reload();

                barChart.database(aboutCodeDB);
                barChart.reload();

                return aboutCodeDB;
            })
            .catch(function(reason) {
               throw reason;
            });
    }

    // Show files that contain attribute value selected by user in bar chart
    function chartSummaryToFiles(attribute, value) {
        if (value !== "No Value Detected") {
            // Get the clue table column and make sure it's visible
            const column = cluesTable.dataTable.column(`${attribute}:name`);
            column.visible(true);

            // Clear all other columns
            cluesTable.clearColumnFilters();

            // Get the column's filter select box
            const select = $(`select#clue-${attribute}`);
            select.empty().append(`<option value=""></option>`);

            // Add the chart value options and select it.
            select.append(`<option value="${value}">${value}</option>`);
            select.val(value).change();

            // This needs to be done only when the column is visible.
            // So we do it last to try our best
            showClueButton.trigger("click");
        }
    }

    // Open a SQLite Database File
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
            loadDatabaseFromFile(fileNames[0]);
            cluesTable.clearColumnFilters();
        });
    }

    // Save a SQLite Database File
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

                let oldFileName = aboutCodeDB.sequelize.options.storage;
                let reader = fs.createReadStream(oldFileName);
                let writer = fs.createWriteStream(newFileName);
                reader.pipe(writer);
                reader.on("end", () => loadDatabaseFromFile(newFileName));
            }
        );
    }

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

                    const stream =
                        fs.createReadStream(jsonFileName, {encoding: 'utf8'});
                    aboutCodeDB.db
                        .then(() => showProgressIndicator())
                        .then(() => aboutCodeDB.addFromJsonStream(stream, aboutCodeVersion))
                        .then(() => reloadDataForViews())
                        .then(() => hideProgressIndicator())
                        .catch((err) => {
                            hideProgressIndicator();
                            if (err instanceof MissingFileInfoError) {
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

    // Show database creation indicator and hide table view
    function showProgressIndicator() {
        $("#db-indicator").show();
        $("#indicator-text").show();
        $("#tabbar").hide();
        $("#leftCol").hide();
    }

    // Hide database creation indicator and show table view
    function hideProgressIndicator() {
        $("#tabbar").show();
        $("#leftCol").show();
        $("#db-indicator").hide();
        $("#indicator-text").hide();
    }

    // Export JSON file with ScanCode data and components that have been created
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

            Promise.all([clueFilesPromise, componentsPromise])
                .then(([clueFiles, components]) => {
                    let json = {
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

    // Export JSON file with only components that have been created
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

            aboutCodeDB
                .findAllComponents({
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"]
                    }
                })
                .then((components) => {
                    let json = {
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