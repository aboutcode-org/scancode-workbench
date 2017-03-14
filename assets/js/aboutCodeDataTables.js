/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
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

function AboutCodeDataTable(tableID, aboutCodeDB) {
    var that = this;
    this.aboutCodeDB = aboutCodeDB;
    this.dataTable = createDataTable(tableID, function(input, callback) {
        that.aboutCodeDB.query(input, callback);
    });
}

module.exports = AboutCodeDataTable;

AboutCodeDataTable.prototype = {
    draw: function() {
        return this.dataTable.draw();
    },
    rows: function() {
        return this.dataTable.rows();
    },
    columns: function(columnId) {
        return this.dataTable.columns(columnId);
    },
    ajax: function() {
        return this.dataTable.ajax;
    }
}

// Define DataTable custom buttons
var LICENSE_COLUMNS = ScanData.LOCATION_COLUMN.concat(ScanData.LICENSE_COLUMNS);
var COPYRIGHT_COLUMNS = ScanData.LOCATION_COLUMN.concat(ScanData.COPYRIGHT_COLUMNS);
var ORIGIN_COLUMNS = ScanData.LOCATION_COLUMN.concat(ScanData.ORIGIN_COLUMNS);

function createDataTable(tableID, query) {
    // Create main DataTable with scan results
    return $(tableID)
        .DataTable({
            "info": false,
            "colReorder": true,
            "serverSide": true,
            "processing": true,
            "ajax": query,
            "columns": ScanData.TABLE_COLUMNS,
            "fixedColumns": {
                leftColumns: 1
            },
            // TODO: We want to use scroller but the current version of the
            // plugin doesn't work with fixedColumns. Try updating
            // "scroller": true,
            "scrollX": true,
            "scrollY": "75vh",
            "stateSave": true,
            "deferRender": true,
            "buttons": [
                {   // Do not allow the first column to be hidden
                    extend: "colvis",
                    columns: ":not(:first-child)",
                    collectionLayout: "fixed two-column"
                },
                {
                    // Show only copyright columns
                    extend: "colvisGroup",
                    text: "Copyright info",
                    show: $.map(COPYRIGHT_COLUMNS, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(ScanData.TABLE_COLUMNS).not(COPYRIGHT_COLUMNS),
                        function(column, i) { return column.name + ":name"; })
                },
                {
                    // Show only license columns
                    extend: "colvisGroup",
                    text: "License info",
                    show: $.map(LICENSE_COLUMNS, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(ScanData.TABLE_COLUMNS).not(LICENSE_COLUMNS),
                        function(column, i) { return column.name + ":name"; })
                },
                {
                    // Show only origin columns
                    extend: "colvisGroup",
                    text: "Origin info",
                    show: $.map(ORIGIN_COLUMNS, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(ScanData.TABLE_COLUMNS).not(ORIGIN_COLUMNS),
                        function(column, i) { return column.name + ":name"; })
                },
                {
                    extend: "colvisGroup",
                    text: "Show all columns",
                    show: ":hidden"
                }
            ],
            dom:
            // Needed to keep datatables buttons and search inline
                "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-5'i><'col-sm-7'p>>"
        });
}

