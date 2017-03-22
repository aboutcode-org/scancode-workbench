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

const createDataTable = function(tableID, query){
    // Create main DataTable with scan results
    return $(tableID)
        .DataTable({
            "info": false,
            "colReorder": true,
            "serverSide": true,
            "processing": true,
            "ajax": query,
            "columns": TABLE_COLUMNS,
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
                    show: $.map(COPYRIGHT_GROUP, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(TABLE_COLUMNS).not(COPYRIGHT_GROUP),
                        function(column, i) { return column.name + ":name"; })
                },
                {
                    // Show only license columns
                    extend: "colvisGroup",
                    text: "License info",
                    show: $.map(LICENSE_GROUP, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(TABLE_COLUMNS).not(LICENSE_GROUP),
                        function(column, i) { return column.name + ":name"; })
                },
                {
                    // Show only origin columns
                    extend: "colvisGroup",
                    text: "Origin info",
                    show: $.map(ORIGIN_GROUP, function(column, i) {
                        return column.name + ":name";
                    }),
                    hide: $.map($(TABLE_COLUMNS).not(ORIGIN_GROUP),
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

const LOCATION_COLUMN = [
    {
        "data": "path",
        "title": "Path",
        "name": "path"
    }
];

const COPYRIGHT_COLUMNS = [
    {
        "data": "copyright_statements",
        "title": "Copyright Statements",
        "name": "copyright_statements"
    },
    {
        "data": "copyright_holders",
        "title": "Copyright Holders",
        "name": "copyright_holders"
    },
    {
        "data": "copyright_authors",
        "title": "Copyright Authors",
        "name": "copyright_authors"
    },
    {
        "data": "copyright_start_line",
        "title": "Copyright Start Line",
        "name": "copyright_start_line"
    },
    {
        "data": "copyright_end_line",
        "title": "Copyright End Line",
        "name": "copyright_end_line"
    }
];

const LICENSE_COLUMNS = [
    {
        "data": "license_key",
        "title": "License Key",
        "name": "license_key"
    },
    {
        "data": "license_score",
        "title": "License Score",
        "name": "license_score"
    },
    {
        "data": "license_short_name",
        "title": "License Short Name",
        "name": "license_short_name"
    },
    {
        "data": "license_category",
        "title": "License Category",
        "name": "license_category"
    },
    {
        "data": "license_owner",
        "title": "License Owner",
        "name": "license_owner"
    },
    {
        "data": "license_homepage_url",
        "title": "License Homepage URL",
        "name": "license_homepage_url"
    },
    {
        "data": "license_text_url",
        "title": "License Text URL",
        "name": "license_text_url"
    },
    {
        "data": "license_djc_url",
        "title": "DejaCode License URL",
        "name": "license_djc_url"
    },
    {
        "data": "license_spdx_key",
        "title": "SPDX License Key",
        "name": "license_spdx_key"
    },
    {
        "data": "license_start_line",
        "title": "License Start Line",
        "name": "license_start_line"
    },
    {
        "data": "license_end_line",
        "title": "License End Line",
        "name": "license_end_line"
    }
];

const EMAIL_COLUMNS = [
    {
        "data": "email",
        "title": "Email",
        "name": "email"
    },
    {
        "data": "email_start_line",
        "title": "Email Start Line",
        "name": "email_start_line"
    },
    {
        "data": "email_start_line",
        "title": "End Start Line",
        "name": "email_start_line"
    }
];

const URL_COLUMNS = [
    {
        "data": "url",
        "title": "URL",
        "name": "url"
    },
    {
        "data": "url_start_line",
        "title": "URL Start Line",
        "name": "url_start_line"
    },
    {
        "data": "url_end_line",
        "title": "URL End Line",
        "name": "url_end_line"
    }
];

const FILE_COLUMNS = [
    {
        "data": "infos_type",
        "title": "Type",
        "name": "infos_type"
    },
    {
        "data": "infos_file_name",
        "title": "File Name",
        "name": "infos_file_name"
    },
    {
        "data": "infos_file_extension",
        "title": "File Extension",
        "name": "infos_file_extension"
    },
    {
        "data": "infos_file_date",
        "title": "File Date",
        "name": "infos_file_date"
    },
    {
        "data": "infos_file_size",
        "title": "File Size",
        "name": "infos_file_size"
    },
    {
        "data": "infos_file_sha1",
        "title": "SHA1",
        "name": "infos_file_sha1"
    },
    {
        "data": "infos_md5",
        "title": "MD5",
        "name": "infos_md5"
    },
    {
        "data": "infos_file_count",
        "title": "File Count",
        "name": "infos_file_count"
    },
    {
        "data": "infos_mime_type",
        "title": "MIME Type",
        "name": "infos_mime_type"
    },
    {
        "data": "infos_file_type",
        "title": "File Type",
        "name": "infos_file_type"
    },
    {
        "data": "infos_programming_language",
        "title": "Language",
        "name": "infos_programming_language"
    },
    {
        "data": "infos_is_binary",
        "title": "Binary",
        "name": "infos_is_binary"
    },
    {
        "data": "infos_is_text",
        "title": "Text File",
        "name": "infos_is_text"
    },
    {
        "data": "infos_is_archive",
        "title": "Archive File",
        "name": "infos_is_archive"
    },
    {
        "data": "infos_is_media",
        "title": "Media File",
        "name": "infos_is_media"
    },
    {
        "data": "infos_is_source",
        "title": "Source File",
        "name": "infos_is_source"
    },
    {
        "data": "infos_is_script",
        "title": "Script File",
        "name": "infos_is_script"
    }
];

const PACKAGE_COLUMNS = [
    {
        "data": "packages_type",
        "title": "Package Type",
        "name": "packages_type"
    },
    {
        "data": "packages_packaging",
        "title": "Packaging",
        "name": "packages_packaging"
    },
    {
        "data": "packages_primary_language",
        "title": "Package Primary Language",
        "name": "packages_primary_language"
    }
];

const ORIGIN_COLUMN_NAMES = [
    "copyright_statements",
    "license_shortname",
    "license_category",
    "email",
    "url"
];

// Define DataTable columns
const TABLE_COLUMNS = LOCATION_COLUMN.concat(
    COPYRIGHT_COLUMNS,
    LICENSE_COLUMNS,
    EMAIL_COLUMNS,
    URL_COLUMNS,
    FILE_COLUMNS,
    PACKAGE_COLUMNS);

const ORIGIN_COLUMNS = $.grep(TABLE_COLUMNS,
    function(column) {
        return $.inArray(column.name,  ORIGIN_COLUMN_NAMES) >= 0;
    });

const LICENSE_GROUP = LOCATION_COLUMN.concat(LICENSE_COLUMNS);
const COPYRIGHT_GROUP = LOCATION_COLUMN.concat(COPYRIGHT_COLUMNS);
const ORIGIN_GROUP = LOCATION_COLUMN.concat(ORIGIN_COLUMNS);

