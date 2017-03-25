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

$(document).ready(function () {
    $("#node-drop-down").change(function () {
        var numClueSelected = $("#node-drop-down").val().length;
        nodeView.resize(numClueSelected * 30, 180);
    });

    function onNodeClick (node) {
        aboutCodeDB.findComponent({ where: { path: node.id } })
            .then(function(component) {
                showDialog(node, component ? component : {});
            });
    }

    function showDialog(node, component) {
        // TODO: Use DB to add suggestion data for all sub-nodes.
        // Add sub-node data to the select menu options
        var licenses = [];
        var copyrights = [];
        var parties = [];
        var programming_language = [];

        // Add saved data to the select menu options
        licenses = $.unique(licenses.concat(component.licenses || []));
        copyrights = $.unique(copyrights.concat(component.copyrights || []));
        parties = $.unique(parties.concat(component.owner));
        programming_language = $.unique(programming_language.concat(
            component.programming_language));

        // update select2 selectors for node view component
        $("#select-license").html('').select2({
            data: $.map(licenses, function(license) {
                return license.short_name;
            }),
            multiple: true,
            placeholder: "Enter license",
            tags: true
        }, true);

        $("#select-owner").html('').select2({
            data: parties,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter owner",
            tags: true
        }, true);

        $("#select-copyright").html('').select2({
            data: $.map(copyrights, function(copyright) {
                return copyright.statements.join("\n");
            }),
            multiple: true,
            placeholder: "Enter copyright",
            tags: true
        }, true);

        $("#select-language").html('').select2({
            data: programming_language,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter language",
            tags: true
        }, true);

        $("#select-status").val(component.review_status || "");
        $('#component-name').val(component.name || "");
        $('#component-version').val(component.version || "");
        $('#select-license').val($.map(component.licenses || [], function(license) {
            return license.short_name;
        }));
        $('#select-copyright').val($.map(component.copyrights || [], function(copyright) {
            return copyright.statements.join("\n");
        }));
        $('#select-owner').val(component.owner || "");
        $('#select-language').val(component.programming_language || "");
        $('#component-homepage-url').val(component.homepage_url || "");
        $('#component-notes').val(component.notes || "");

        // Notify only select2 of changes
        $('select').trigger('change.select2');

        $('#nodeModalLabel').text(node.id);
        $('#nodeModal').modal('show');
    }

    $('#save-component').on('click', function () {
        var id = $('#nodeModalLabel').text();
        var component = {
            path: id,
            review_status: $("#select-status").val(),
            name: $('#component-name').val(),
            licenses: $.map($('#select-license').val() || [], function(license) {
                return { short_name: license };
            }),
            copyrights: $.map($('#select-copyright').val() || [], function(copyright) {
                return { statements: copyright.split("\n") };
            }),
            version: $('#component-version').val(),
            owner: ($('#select-owner').val() || [""])[0],
            homepage_url: $('#component-homepage-url').val(),
            programming_language: ($('#select-language').val() || [""])[0],
            notes: $('#component-notes').val()
        };
        aboutCodeDB.setComponent(component, { where: { path: id } });
        $('#nodeModal').modal('hide');
        nodeView.redraw()
    });

    $('#node-drop-down').select2({
        closeOnSelect: false,
        placeholder: "select me"
    });

    var jstree = $('#jstree').jstree({
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
            table.columns(0).search(data.node.id).draw();
            nodeView.setRoot(data.node.id);
        });

    var scanData = null;
    var aboutCodeDB = new AboutCodeDB();
    var table = new AboutCodeDataTable("#clues-table", aboutCodeDB);

    // Create a table with analyzed Components from node view
    var componentsTable = $("#components-table")
        .DataTable( {
            columns: [
                {
                    data: "name",
                    title: "Name",
                    name: "name"
                },
                {
                    data: "version",
                    title: "Version",
                    name: "version"
                },
                {
                    data: "party.name",
                    title: "Owner",
                    name: "party name",
                    defaultContent: ""
                },
                {
                    data: "license_expression",
                    title: "License",
                    name: "license_expression",
                    defaultContent: ""
                },
                {
                    data: "programming_language",
                    title: "Programming Language",
                    name: "programming_language",
                    defaultContent: ""
                },
                {
                    data: "homepage_url",
                    title: "Homepage URL",
                    name: "homepage_url",
                    defaultContent: ""
                },
                {
                    data: "notes",
                    title: "Notes",
                    name: "notes",
                    defaultContent: ""
                }
            ],
            dom:
            // Needed to keep datatables buttons and search inline
                "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            buttons: [
                {
                    name: "uploadDeja",
                    text: '<i class=" fa fa-cloud-upload"></i> Upload Components'
                }
            ],
            "language": {
              "emptyTable": "No Components created."
            }

        });

    componentsTable.buttons().container().attr({
        "id": "show-components",
        "data-toggle": "modal",
        "data-placement": "right",
        "title": "Upload Components to DejaCode",
        "data-target":"#componentExportModal"
    });


    // Show DataTable. Hide node view and component summary table
    $( "#show-datatable" ).click(function() {
        $("#clues-table").show();
        $("#node-container").hide();
        $("#clues-table_wrapper").show();
        $("#component-container").hide();
        $('#leftCol').addClass('col-md-2');
        $('#tabbar').removeClass('col-md-11');
        $('#tabbar').addClass('col-md-9');
        $('#leftCol').show();
        table.draw();
    });

    // Show node view. Hide DataTable and component summary table
    $("#show-tree").click(function() {
        $("#node-container").show();
        $("#clues-table").hide();
        $("#clues-table_wrapper").hide();
        $("#component-container").hide();
        $('#leftCol').addClass('col-md-2');
        $('#tabbar').removeClass('col-md-11');
        $('#tabbar').addClass('col-md-9');
        $('#leftCol').show();
        nodeView.redraw();
    });

    // Show component summary table. Hide DataTable and node view
    $("#table-test").click(function() {
        $('#leftCol').removeClass('col-md-2');
        $('#tabbar').removeClass('col-md-9');
        $('#tabbar').addClass('col-md-11');
        $('#leftCol').hide();
        $("#component-container").show();
        $("#clues-table").hide();
        $("#node-container").hide();
        $("#clues-table_wrapper").hide();
        componentsTable.clear();
        componentsTable.rows.add(scanData.toSaveFormat().components);
        componentsTable.draw();
    });

    // Open a json file
    var dialog = require('electron').remote.dialog;
    var nodeView;
    $('#open-file').click(function() {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) return;

            var fileName = fileNames[0];

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
                        "ScanCode scan. Rerun the scan using ./scancode " +
                        "-clip options."
                    );
                }

                // Add root directory into data
                // See https://github.com/nexB/scancode-toolkit/issues/543
                var rootPath = json.files[0].path.split("/")[0];

                json.files.push({
                    path: rootPath,
                    name: rootPath,
                    type: "directory",
                    files_count: json.files_count
                });

                aboutCodeDB = new AboutCodeDB({
                    dbName: "demo_schema"
                });

                aboutCodeDB.addFlattenedRows(json)
                    .then(function() {
                        // reload the DataTable after all insertions are done.
                        table.database(aboutCodeDB);
                        table.ajax().reload();

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

                aboutCodeDB.addRows(json)
                    .then(function() {
                        nodeView = new AboutCodeNodeView(aboutCodeDB, onNodeClick);
                    })
                    .catch(function(reason) {
                       throw reason;
                    });

                scanData = new ScanData(json);
            });
        });
    });

    // Save component file
    $( "#save-file" ).click(function() {
        // Get data from table to JSON
        var fs = require('fs');
        var tableData = JSON.stringify(scanData.toSaveFormat());
        dialog.showSaveDialog({properties: ['openFile'],
            title: "Save as JSON file",
            filters: [{name: 'JSON File Type',
            extensions: ['json']}]},
            function (fileName) {
                if (fileName === undefined) return;
                    fs.writeFile(fileName, tableData, function (err) {
                });
            });
    });

    // Submit components to a DejaCode Product via ProductComponent API
    $('#componentSubmit').on('click', function () {
        var createdComponents = scanData.toSaveFormat().components;
        // Get product name and version
        var productNameVersion = $('#product-name').val()
            .concat(':', $('#product-version').val());
        var apiUrl = $('#apiURLDejaCode').val();
        var apiKey = $('#apiKey').val();
        uploadComponents( apiUrl, createdComponents, apiKey, productNameVersion );
        $('#componentExportModal').modal('hide');
    });

    // Make node view modal box draggable
    $("#nodeModal").draggable({ handle: ".modal-header" });

});