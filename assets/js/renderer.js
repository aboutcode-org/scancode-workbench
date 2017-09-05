/*
 #
 # Copyright (c) 2016 nexB Inc. and others. All rights reserved.
 # http://nexb.com and https://github.com/nexB/scancode-toolkit/
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


$(document).ready(function () {
    // Create default values for all of the data and ui classes
    let aboutCodeDB = new AboutCodeDB();
    let nodeView = new AboutCodeNodeView("#node-view", aboutCodeDB);
    let barChart = new AboutCodeBarChart("#summary-bar-chart", aboutCodeDB);

    // These classes are only created once, otherwise DataTables will complain
    const cluesTable = new AboutCodeDataTable("#clues-table", aboutCodeDB);
    const componentsTable = new ComponentDataTable("#components-table", aboutCodeDB);

    // TODO: Move this into its own file
    // Create and setup the jstree, and the click-event logic
    const jstree = $("#jstree").jstree(
        {
            "core": {
                "data": function (currentDirectory, callback) {
                    aboutCodeDB
                        .findAllJSTree({
                            where: {
                                parent: currentDirectory.id
                            }
                        })
                        .then((children) => {
                            callback.call(this, children)
                        });
                }
            },
            "types": {
                "directory": {
                    "icon": "fa fa-folder fa_custom"
                },
                "file": {
                    "icon": "fa fa-file-text-o"
                }
            },
            "plugins": [ "types", "sort", "contextmenu", "wholerow"],
            "sort": function (a, b) {
                a1 = this.get_node(a);
                b1 = this.get_node(b);
                if (a1.type == b1.type) {
                    return a1.text.localeCompare(b1.text, 'en-US-u-kf-upper');
                }
                else {
                    return (a1.type === 'directory') ? -1 : 1;
                }
            },
            "contextmenu" : {
                "items": function (node) {
                    return {
                        "edit_component": {
                            "label": "Edit Component",
                            "action": function () {
                                onNodeClick(node)
                            }
                        }
                    };
                }
            }
        })
        .on('open_node.jstree', function (evt, data) {
            data.instance.set_icon(
                data.node,
                'fa fa-folder-open fa_custom');
        })
        .on('close_node.jstree', function (evt, data) {
            data.instance.set_icon(
                data.node,
                'fa fa-folder fa_custom');
        })
        // Get the node id when selected
        .on('select_node.jstree', function (evt, data) {
            let barChartValue = chartAttributesSelect.val();

            // Set the search value for the first column (path) equal to the
            // Selected jstree path and redraw the table
            cluesTable.columns(0).search(data.node.id).draw();
            nodeView.setRoot(data.node.id);
            barChart.showSummary(barChartValue, data.node.id);
        });

    // The electron library for opening a dialog
    const dialog = require('electron').remote.dialog;

    // The Electron module used to communicate asynchronously from a renderer process to the main process.
    const ipcRenderer = require('electron').ipcRenderer;

    // Define DOM element constants for the modal dialog.
    const componentModal = {
        container: $("#nodeModal"),
        label: $("#nodeModalLabel"),
        status: $("#select-status"),
        component_name: $("#component-name"),
        license: $("#select-license"),
        owner: $("#select-owner"),
        copyright: $("#select-copyright"),
        language: $("#select-language"),
        version: $("#component-version"),
        homepage: $("#component-homepage-url"),
        notes: $("#component-notes")
    };

    // Make node view modal box draggable
    componentModal.container.draggable({ handle: ".modal-header" });

    // Defines DOM element constants for buttons.
    const showClueButton = $( "#show-clue-table" );
    const showNodeViewButton = $("#show-tree");
    const showComponentButton = $("#show-component-table");
    const showBarChartButton = $("#show-bar-chart");
    const saveComponentButton = $("#save-component");
    const deleteComponentButton = $("#delete-component");
    const saveSQLiteFileButton = $("#save-file");
    const openSQLiteFileButton = $("#open-file");
    const submitComponentButton = $("#componentSubmit");
    const resetZoomButton = $("#reset-zoom");
    const leftCol = $("#leftCol");
    const tabBar = $("#tabbar");

    // Defines DOM element constants for the main view containers.
    const nodeContainer = $("#node-container");
    const cluesContainer = $("#clues-container");
    const componentContainer = $("#component-container");
    const barChartContainer = $("#bar-chart-container");

    const chartAttributesSelect = $("select#select-chart-attribute");
    const barChartTotalFiles = $("span.total-files");


    chartAttributesSelect.select2({
        placeholder: "Select an attribute"
    });

    // Populate bar chart summary select box values
    $.each(AboutCodeDataTable.TABLE_COLUMNS, (i, column) => {
        if (column.bar_chart_class) {
            chartAttributesSelect.append(`<option class="${column.bar_chart_class}" value="${column.name}">${column.title}</option>`);
        }
    });

    chartAttributesSelect.on( "change", function () {
        // Get dropdown element selected value
        let val = $(this).val();
        const jstreePath = jstree.jstree("get_selected")[0];
        barChart.showSummary(val, jstreePath);
    });

    $(".bar-chart-copyrights").wrapAll(`<optgroup label="Copyright Information"/>`);
    $(".bar-chart-licenses").wrapAll(`<optgroup label="License Information"/>`);
    $(".bar-chart-emails").wrapAll(`<optgroup label="Email Information"/>`);
    $(".bar-chart-file-infos").wrapAll(`<optgroup label="File Information"/>`);
    $(".bar-chart-package-infos").wrapAll(`<optgroup label="Package Information"/>`);

    let selectedStatuses = [];

    $(".status-dropdown-menu a").on("click", (event) => {
        let $target = $(event.currentTarget),
            value = $target.attr("data-value"),
            $input = $target.find("input"),
            index;

        if ((index = selectedStatuses.indexOf(value)) > -1) {
            selectedStatuses.splice( index, 1 );
            setTimeout(() =>  $input.prop("checked", false), 0);
        } else {
            selectedStatuses.push(value);
            setTimeout(() => $input.prop("checked", true), 0);
        }
        $(event.target).blur();

        nodeView.setIsNodePruned((node) => {
            return selectedStatuses.indexOf(node.review_status) >= 0;
        });
        nodeView.redraw();
        return false;
    });


    // Resize the nodes based on how many clues are selected
    const nodeDropdown = $("#node-drop-down");
    nodeDropdown.change(() => {
        let numClueSelected = nodeDropdown.val().length;
        nodeView.resize(numClueSelected * 30, 180);
    });

    // Populate modal input fields with suggestions from ScanCode results
    function onNodeClick (node) {
        let componentPromise = aboutCodeDB.findComponent({
            where: { path: node.id }
        })
        .then((component) => component ? component : {});

        let licensesPromise = aboutCodeDB.File.findAll({
            attributes: [],
            group: ['licenses.short_name'],
            where: { path: {$like: `${node.id}%`}},
            include: [{
                model: aboutCodeDB.License,
                attributes: ['short_name'],
                where: {short_name: {$ne: null}}
            }]
        })
        .then((rows) => $.map(rows, (row) => row.licenses));

        let copyrightsPromise = aboutCodeDB.File.findAll({
            attributes: [],
            group: ['copyrights.statements'],
            where: { path: {$like: `${node.id}%`}},
            include: [{
                model: aboutCodeDB.Copyright,
                attributes: ['statements'],
                where: {statements: {$ne: null}}
            }]
        })
        .then((rows) => $.map(rows, (row) => row.copyrights));

        let ownersPromise = aboutCodeDB.File.findAll({
            attributes: [],
            group: ['copyrights.holders'],
            where: { path: {$like: `${node.id}%`}},
            include: [{
                model: aboutCodeDB.Copyright,
                attributes: ['holders'],
                where: {holders: {$ne: null}}
            }]
        })
        .then((rows) => $.map(rows, (row) => {
            return $.map(row.copyrights, (copyright) => {
                return copyright.holders;
            });
        }));

        let languagePromise = aboutCodeDB.File.findAll({
            attributes: ["programming_language"],
            group: ['programming_language'],
            where: {
                path: {$like: `${node.id}%`},
                programming_language: {$ne: null}
            }
        })
        .then((rows) => $.map(rows, (row) => row.programming_language));

        let homepageUrlPromise = aboutCodeDB.File.findAll({
            attributes: [],
            group: ['urls.url'],
            where: { path: {$like: `${node.id}%`}},
            include: [{
                model: aboutCodeDB.Url,
                attributes: ['url'],
                where: {url: {$ne: null}}
            }]
        })
        .then((rows) => $.map(rows, (row) => $.map(row.urls, (url) => url.url)));

        Promise.all([componentPromise, licensesPromise, copyrightsPromise,
            ownersPromise, languagePromise, homepageUrlPromise
        ])
            .then(([component, licenses, copyrights, owners,
                       programming_languages, urls]) => {
                showDialog(node, component, {
                    licenses: licenses,
                    copyrights: copyrights,
                    owners: owners,
                    programming_languages: programming_languages,
                    urls: urls
                });
            });
    }

    function showDialog(node, component, subNodeData) {
        // Add sub-node clue data to the select menu options
        let licenses = subNodeData.licenses;
        let copyrights = subNodeData.copyrights;
        let owners = subNodeData.owners;
        let programming_languages = subNodeData.programming_languages;
        let urls = subNodeData.urls;

        // Add saved data to the select menu options
        licenses = licenses.concat(component.licenses || []);
        copyrights = copyrights.concat(component.copyrights || []);
        owners = owners.concat(component.owner || []);
        programming_languages = $.unique(programming_languages.concat(
            component.programming_language || []));
        urls =  $.unique(urls.concat(
            component.homepage_url || []));

        // update select2 selectors for node view component
        componentModal.license.html('').select2({
            data: $.unique($.map(licenses, (license, i) => {
                return license.short_name;
            })),
            multiple: true,
            placeholder: "Enter license",
            tags: true
        }, true);

        componentModal.owner.html('').select2({
            data: $.unique(owners),
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter owner",
            tags: true
        }, true);

        componentModal.copyright.html('').select2({
            data: $.unique($.map(copyrights, (copyright, i) => {
                return copyright.statements;
            })),
            multiple: true,
            placeholder: "Enter copyright",
            tags: true
        }, true);

        componentModal.language.html('').select2({
            data: programming_languages,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter language",
            tags: true
        }, true);

        componentModal.homepage.html('').select2({
            data: urls,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter Homepage URL",
            tags: true
        }, true);

        componentModal.status.val(component.review_status || "");
        componentModal.component_name.val(component.name || "");
        componentModal.version.val(component.version || "");
        componentModal.license.val((component.licenses || [])
            .map((license) => license.short_name));
        componentModal.copyright.val((component.copyrights || [])
            .map((copyright) => copyright.statements.join("\n")));
        componentModal.owner.val(component.owner || []);
        componentModal.language.val(component.programming_language || []);
        componentModal.homepage.val(component.homepage_url || "");
        componentModal.notes.val(component.notes || "");

        // Notify only select2 of changes
        $('select').trigger('change.select2');

        componentModal.label.text(node.id);
        componentModal.container.modal('show');
    }

    saveComponentButton.on('click', function () {
        let id = componentModal.label.text();
        let component = {
            path: id,
            fileId: nodeView.nodeData[id].fileId,
            review_status: componentModal.status.val(),
            name: componentModal.component_name.val(),
            licenses: $.map(componentModal.license.val() || [], function(license) {
                return { short_name: license };
            }),
            copyrights: $.map(componentModal.copyright.val() || [], function(copyright) {
                return { statements: copyright.split("\n") };
            }),
            version: componentModal.version.val(),
            owner: (componentModal.owner.val() || [null])[0],
            homepage_url: (componentModal.homepage.val() || [null])[0],
            programming_language: (componentModal.language.val() || [null])[0],
            notes: componentModal.notes.val()
        };
        aboutCodeDB.setComponent(component)
            .then(() => {
                nodeView.nodeData[id].component = component;
                nodeView.redraw();
            });
        componentModal.container.modal('hide');
    });

    // Delete a created Component inside the Component Modal
    deleteComponentButton.click(function () {
        let id = componentModal.label.text();

        aboutCodeDB.findComponent({ where: { path: id }})
            .then((component) => {
                if (component !== null) {
                    return component.destroy();
                }
            })
            .then(() => {
                nodeView.nodeData[id].component = null;
                nodeView.redraw();
            });
    });

    nodeDropdown.select2({
        closeOnSelect: false,
        placeholder: "select me"
    });

    // Center and reset node view
    resetZoomButton.click(() => nodeView.centerNode());

    // Instantiate the splitter.
    const splitter = Split(['#leftCol', '#tabbar'], {
        sizes: [20, 80],
        minSize: 200,
        gutterSize: 5,
        elementStyle: function (dimension, size, gutterSize) {
            const width = this.outerWidth * (size / 100);
            return { 'flex-basis': `${width - gutterSize}px`}
        },
        gutterStyle: function (dimension, gutterSize) {
            return { 'flex-basis': `${gutterSize}px`}
        },
        onDragEnd: function() {
            sessionStorage.setItem('splitSizes', JSON.stringify(splitter.getSizes()));
            if ($('#bar-chart-container').is(':visible')) {
                barChart.draw();
            }
        }
    });

    // Retrieve any saved resize settings from sessionStorage or else use our default setting.
    function restoreSplitterSizes() {
        let splitSizes = [20, 80];
        try {
            splitSizes = JSON.parse(sessionStorage.getItem('splitSizes')) || splitSizes;
        } catch (err) {
            console.log(err);
        }
        splitter.setSizes(splitSizes);
    }

    // Show Table View (aka "clue DataTable").  Hide node view and component summary table.
    function showTableView() {
        restoreSplitterSizes();
        $(".gutter-horizontal").removeClass("div-hide").addClass("div-show");
        cluesContainer.show();
        nodeContainer.hide();
        componentContainer.hide();
        barChartContainer.hide();
        cluesTable.draw();
    }

    // Show clue DataTable. Hide node view and component summary table
    showClueButton.click(showTableView);

    // Show clue DataTable. Hide node view and component summary table -- custom menu
    ipcRenderer.on('table-view', showTableView);

    // Show node view. Hide clue and component table
    function showNodeView() {
        restoreSplitterSizes();
        $(".gutter-horizontal").removeClass("div-hide").addClass("div-show");
        nodeContainer.show();
        cluesContainer.hide();
        componentContainer.hide();
        barChartContainer.hide();
        nodeView.redraw();
    }

    // Show node view. Hide clue and component table
    showNodeViewButton.click(showNodeView);

    // Show node view. Hide clue and component table -- custom menu
    ipcRenderer.on('node-view', showNodeView);

    // Show component summary table. Hide DataTable and node view
    function showComponentSummaryView() {
        $(".gutter-horizontal").removeClass("div-show").addClass("div-hide");
        splitter.collapse(0);
        componentContainer.show();
        nodeContainer.hide();
        cluesContainer.hide();
        barChartContainer.hide();
        componentsTable.reload();
    }

    // Show component summary table. Hide DataTable and node view
    showComponentButton.click(showComponentSummaryView);

    // Show component summary table. Hide DataTable and node view -- custom menu
    ipcRenderer.on('component-summary-view', showComponentSummaryView);

    // Show bar chart table. Hide other views
    function showBarChartView() {
        restoreSplitterSizes();
        $(".gutter-horizontal").removeClass("div-hide").addClass("div-show");
        barChartContainer.show();
        componentContainer.hide();
        nodeContainer.hide();
        cluesContainer.hide();
        barChart.draw();
        aboutCodeDB.getFileCount()
            .then((value) => {
                barChartTotalFiles.text(value);
            });
    }

    showBarChartButton.click(showBarChartView);

    // Show chart summary table. Hide other views -- custom menu
    ipcRenderer.on('chart-summary-view', showBarChartView);

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
                // reload the DataTable after all insertions are done.
                cluesTable.database(aboutCodeDB);
                cluesTable.reload();

                componentsTable.database(aboutCodeDB);
                componentsTable.reload();

                nodeView = new AboutCodeNodeView("#nodeview", aboutCodeDB, onNodeClick);
                barChart = new AboutCodeBarChart("#summary-bar-chart", aboutCodeDB);

                // loading data into jstree
                jstree.jstree(true).refresh(true);

                aboutCodeDB.getFileCount()
                    .then((value) => {
                        barChartTotalFiles.text(value);
                    });

                return aboutCodeDB;
            })
            .catch(function(reason) {
               throw reason;
            });
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
            if (fileNames === undefined) return;
            loadDatabaseFromFile(fileNames[0]);
        });
    }

    // Open a SQLite Database File
    openSQLiteFileButton.click(openSQLite);

    // Open a SQLite Database File -- custom menu
    ipcRenderer.on('open-SQLite', openSQLite);

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
                if (newFileName === undefined) return;

                let oldFileName = aboutCodeDB.sequelize.options.storage;
                let reader = fs.createReadStream(oldFileName);
                let writer = fs.createWriteStream(newFileName);
                reader.pipe(writer);
                reader.on("end", function () {
                    loadDatabaseFromFile(newFileName);
                })
            }
        );
    }

    // Save a SQLite Database file
    saveSQLiteFileButton.click(saveSQLite);

    // Save a SQLite Database File -- custom menu
    ipcRenderer.on('save-SQLite', saveSQLite);

    // Open a ScanCode results JSON file
    ipcRenderer.on('import-JSON', function () {
        dialog.showOpenDialog({
            title: "Open a JSON File",
            filters: [{
                name: 'JSON File',
                extensions: ['json']
            }]
        },
        function (fileNames) {
            if (fileNames === undefined) return;

            const fileName = fileNames[0];

            $.getJSON(fileName, function (json) {

                // Show error for scans missing file type information
                if (json.files != undefined && json.files.length > 0
                    && json.files[0].type === undefined) {
                    dialog.showErrorBox(
                        "Missing File Type Information",
                        "Missing file 'type' information in the " +
                        "scanned data. \n\nThis probably means you ran " +
                        "the scan without the -i option in ScanCode. " +
                        "The app requires file information from a " +
                        "ScanCode scan. Rerun the scan using \n./scancode " +
                        "-clipeu options."
                    );
                    return;
                }

                // Add root directory into data
                // See https://github.com/nexB/scancode-toolkit/issues/543
                const rootPath = json.files[0].path.split("/")[0];
                let hasRootPath = false;

                for (let i = 0, n = json.files.length; i < n; i++) {
                    if (rootPath === json.files[i].path) {
                        hasRootPath = true;
                        break;
                    }
                }

                if (!hasRootPath) {
                    json.files.push({
                        path: rootPath,
                        name: rootPath,
                        type: "directory",
                        files_count: json.files_count
                    });
                }

                // Immediately ask for a SQLite to save and create the database
                dialog.showSaveDialog(
                    {
                        title: 'Save a SQLite Database File',
                        filters: [
                            { name: 'SQLite File', extensions: ['sqlite'] }
                        ]
                    },
                    function (fileName) {
                        if (fileName === undefined) return;

                        // Create a new database when importing a json file
                        aboutCodeDB = new AboutCodeDB({
                            dbName: "demo_schema",
                            dbStorage: fileName,
                        });

                        // The flattened data is used by the clue table and jstree
                        aboutCodeDB.db
                            .then(() => showProgressIndicator())
                            .then(() => aboutCodeDB.addFlattenedRows(json))
                            .then(() => aboutCodeDB.addScanData(json))
                            .then(() => reloadDataForViews())
                            .then(() => hideProgressIndicator())
                            .then(() => {
                                barChart = new AboutCodeBarChart("#summary-bar-chart", aboutCodeDB);
                            })
                            .catch((err) => {
                                hideProgressIndicator();
                                console.log(err);
                                alert(`Error: ${err.message ? err.message : err}`);
                            });
                    });
            }).fail(function (jqxhr, textStatus, error) {
                // Show error for problem with the JSON file
                dialog.showErrorBox(
                    "JSON Error",
                    "There is a problem with your JSON file.  It may be malformed " +
                    "(e.g., the addition of a trailing comma), " +
                    "or there could be some other problem with the file. " +
                    "\n\nPlease check your file and try again. " +
                    "\n\nThe error thrown by the system is: \n\n" + error
                );
            });
        });
    });

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

    // Export JSON file with components that have been created
    ipcRenderer.on('export-JSON', function () {
        dialog.showSaveDialog({
            properties: ['openFile'],
            title: "Save as JSON file",
            filters: [{
                name: 'JSON File Type',
                extensions: ['json']
            }]
        },
            function (fileName) {
                if (fileName === undefined) return;

                let clueFiles = aboutCodeDB.findAll({
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"]
                    }
                });

                let components = aboutCodeDB.findAllComponents({
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"]
                    }
                });

                Promise.all([clueFiles, components])
                    .then((arguments) => {
                        let json = {
                            files: arguments[0],
                            components: arguments[1]
                        };

                        fs.writeFile(fileName, JSON.stringify(json));
                    });

            });
    });

    // Submit components to a DejaCode Product via ProductComponent API
    // TODO (@jdaguil): DejaCode doesn't require any field, but we probably
    // want to require name, version, and owner
    submitComponentButton.on("click", function () {
        // Get product name and version
        const productName = $("#product-name").val();
        const productVersion = $("#product-version").val();
        const productNameVersion = productName.concat(":", productVersion);
        const apiUrl = $("#apiURLDejaCode").val();
        const apiKey = $("#apiKey").val();
        // Test whether any form field is empty
        if ((productName === "") || (productVersion === "") || (apiUrl === "") || (apiKey === "")) {
            alert("Please make sure you complete all fields in the upload form.");
        } else {
            aboutCodeDB.findAllComponents({})
                .then((components) => {
                    // Converts array of components from AboutCode Manager to
                    // DejaCode component format
                    dejaCodeComponents = $.map(components, (component, index) => {
                        return {
                            name: component.name,
                            version: component.version,
                            owner: component.owner,
                            license_expression: component.license_expression,
                            copyright: component.copyright,
                            homepage_url: component.homepage_url,
                            primary_language: component.programming_language,
                            reference_notes: component.notes,
                            product: productNameVersion
                        }
                    });

                    uploadComponents(apiUrl, dejaCodeComponents, apiKey);
                });
            $("#componentExportModal").modal("hide");
        }
    });

    restoreSplitterSizes();
    showTableView();
});