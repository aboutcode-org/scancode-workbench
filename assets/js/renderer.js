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

    // These classes are only created once, otherwise DataTables will complain
    const cluesTable = new AboutCodeDataTable("#clues-table", aboutCodeDB);
    const componentsTable = new ComponentDataTable("#components-table", aboutCodeDB);

    // TODO: Move this into its own file
    // Create and setup the jstree, and the click-event logic
    const jstree = $("#jstree").jstree(
        {
            "types": {
                "directory": {
                    "icon": "glyphicon glyphicon-folder-close"
                },
                "file": {
                    "icon": "glyphicon glyphicon-file"
                }
            },
            "plugins": [ "types"]
        })
        .on('open_node.jstree', function (evt, data) {
            data.instance.set_icon(
                data.node,
                'glyphicon glyphicon-folder-open');
        })
        .on('close_node.jstree', function (evt, data) {
            data.instance.set_icon(
                data.node,
                'glyphicon glyphicon-folder-close');
        })
        // Get the node id when selected
        .on('select_node.jstree', function (evt, data) {
            cluesTable.columns(0).search(data.node.id).draw();
            nodeView.setRoot(data.node.id);
        });

    // The electron library for opening a dialog
    const dialog = require('electron').remote.dialog;

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
    const saveComponentButton = $("#save-component");
    const openDBFileButton = $("#open-file");
    const saveDBFileButton = $("#save-file");
    const openJSONFileButton = $("#import-json-file");
    const saveJSONFileButton = $("#export-json-file");
    const submitComponentButton = $("#componentSubmit");
    const leftCol = $("#leftCol");
    const tabBar = $("#tabbar");

    // Defines DOM element constants for the main view containers.
    const nodeContainer = $("#node-container");
    const cluesContainer = $("#clues-table_wrapper");
    const componentContainer = $("#component-container");

    // Resize the nodes based on how many clues are selected
    const nodeDropdown = $("#node-drop-down");
    nodeDropdown.change(() => {
        let numClueSelected = nodeDropdown.val().length;
        nodeView.resize(numClueSelected * 30, 180);
    });

    function onNodeClick (node) {
        aboutCodeDB.findComponent({ where: { path: node.id } })
            .then((component) => showDialog(node, component ? component : {}));
    }

    function showDialog(node, component) {
        // TODO: Use DB to add suggestion data for all sub-nodes.
        // Add sub-node data to the select menu options
        let licenses = [];
        let copyrights = [];
        let parties = [];
        let programming_language = [];

        // Add saved data to the select menu options
        licenses = $.unique(licenses.concat(component.licenses || []));
        copyrights = $.unique(copyrights.concat(component.copyrights || []));
        parties = $.unique(parties.concat(component.owner || []));
        programming_language = $.unique(programming_language.concat(
            component.programming_language || []));

        // update select2 selectors for node view component
        componentModal.license.html('').select2({
            data: $.map(licenses, (license, i) => {
                return license.short_name;
            }),
            multiple: true,
            placeholder: "Enter license",
            tags: true
        }, true);

        componentModal.owner.html('').select2({
            data: parties,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter owner",
            tags: true
        }, true);

        componentModal.copyright.html('').select2({
            data: $.map(copyrights, (copyright, i) => {
                return copyright.statements.join("\n");
            }),
            multiple: true,
            placeholder: "Enter copyright",
            tags: true
        }, true);

        componentModal.language.html('').select2({
            data: programming_language,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter language",
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
            homepage_url: componentModal.homepage.val(),
            programming_language: (componentModal.language.val() || [null])[0],
            notes: componentModal.notes.val()
        };
        aboutCodeDB.setComponent(component, { where: { path: id } });
        componentModal.container.modal('hide');
        nodeView.redraw()
    });

    nodeDropdown.select2({
        closeOnSelect: false,
        placeholder: "select me"
    });

    // Show clue DataTable. Hide node view and component summary table
    showClueButton.click(function() {
        cluesContainer.show();
        nodeContainer.hide();
        componentContainer.hide();
        leftCol.addClass('col-md-2').show();
        tabBar.removeClass('col-md-11').addClass('col-md-9');
        cluesTable.draw();
    });

    // Show node view. Hide clue and component table
    showNodeViewButton.click(function() {
        nodeContainer.show();
        cluesContainer.hide();
        componentContainer.hide();
        leftCol.addClass('col-md-2').show();
        tabBar.removeClass('col-md-11').addClass('col-md-9');
        nodeView.redraw();
    });

    // Show component summary table. Hide DataTable and node view
    showComponentButton.click(function() {
        componentContainer.show();
        nodeContainer.hide();
        cluesContainer.hide();
        leftCol.removeClass('col-md-2').hide();
        tabBar.removeClass('col-md-9').addClass('col-md-11');
        componentsTable.reload();
    });

    // Creates the database and all View objects from a SQLite file
    function loadDatabaseFromFile(fileName) {
        // Create a new database when importing a json file
        aboutCodeDB = new AboutCodeDB({
            dbName: "demo_schema",
            dbStorage: fileName
        });

        // The flattened data is used by the clue table and jstree
        aboutCodeDB.db
            .then(function() {
                // reload the DataTable after all insertions are done.
                cluesTable.database(aboutCodeDB);
                cluesTable.reload();

                componentsTable.database(aboutCodeDB);
                componentsTable.reload();

                nodeView = new AboutCodeNodeView(aboutCodeDB, onNodeClick);

                // loading data into jstree
                aboutCodeDB.toJSTreeFormat()
                    .then(function(data) {
                        jstree.jstree(true).settings.core.data = data;
                        jstree.jstree(true).refresh(true);
                    });
            })
            .catch(function(reason) {
               throw reason;
            });
    }

    // Open a SQLite Database File
    openDBFileButton.click(function() {
        dialog.showOpenDialog({
            properties: ['openFile'],
            title: "Open a SQLite file",
            filters: [{
                name: 'SQLite File',
                extensions: ['sqlite']
            }]
        }, function(fileNames) {
            if (fileNames === undefined) return;
            loadDatabaseFromFile(fileNames[0]);
        });
    });

    // Save a SQLite Database file
    saveDBFileButton.click(function() {
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
    });

    // TODO: Move to application File Menu
    // Open a ScanCode results JSON file
    openJSONFileButton.click(function() {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) return;

            const fileName = fileNames[0];

            $.getJSON(fileName, function(json) {

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
                json.files.push({
                    path: rootPath,
                    name: rootPath,
                    type: "directory",
                    files_count: json.files_count
                });

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

                        // Load component table database
                        componentsTable.database(aboutCodeDB);
                        componentsTable.reload();

                        // The flattened data is used by the clue table and jstree
                        aboutCodeDB.addFlattenedRows(json)
                            .then(function () {
                                // reload the DataTable after all insertions are done.
                                cluesTable.database(aboutCodeDB);
                                cluesTable.reload();

                                // loading data into jstree
                                aboutCodeDB.toJSTreeFormat()
                                    .then(function (data) {
                                        jstree.jstree(true).settings.core.data = data;
                                        jstree.jstree(true).refresh(true);
                                    });
                            })
                            .catch(function (reason) {
                                throw reason;
                            });

                        // The non-flattened data is used by the node view.
                        aboutCodeDB.addRows(json)
                            .then(function () {
                                nodeView = new AboutCodeNodeView(aboutCodeDB, onNodeClick);
                            })
                            .catch(function (reason) {
                                throw reason;
                            });

                    });
            });
        });
    });

    // TODO: Move to application File Menu
    // Export JSON file with components that have been created
    saveJSONFileButton.click(function() {
        dialog.showSaveDialog({
                properties: ['openFile'],
                title: "Save as JSON file",
                filters: [{name: 'JSON File Type',
                extensions: ['json']}]
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
    submitComponentButton.on('click', function () {
        let createdComponents = scanData.toSaveFormat().components;
        // Get product name and version
        let productNameVersion = $("#product-name").val()
            .concat(":", $("#product-version").val());
        let apiUrl = $("#apiURLDejaCode").val();
        let apiKey = $("#apiKey").val();
        uploadComponents( apiUrl, createdComponents, apiKey, productNameVersion );
        $("#componentExportModal").modal("hide");
    });
});