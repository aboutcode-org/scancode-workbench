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

class AboutCodeDataTable {
    constructor(tableID, aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
        this.dataTable = this._createDataTable(tableID);
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    draw() {
        return this.dataTable.draw();
    }

    rows() {
        return this.dataTable.rows();
    }

    columns(columnId) {
        return this.dataTable.columns(columnId);
    }

    reload() {
        return this.dataTable.ajax.reload();
    }

    // This function is called every time DataTables needs to be redrawn.
    // For details on the parameters https://datatables.net/manual/server-side
    _query(dataTablesInput, dataTablesCallback) {
        // Sorting and Querying of data for DataTables
        this.aboutCodeDB.db.then(() => {
            let columnIndex = dataTablesInput.order[0].column;
            let columnName = dataTablesInput.columns[columnIndex].name;
            let direction = dataTablesInput.order[0].dir === "desc" ? "DESC" : "ASC";

            // query = {
            //   where: {
            //     $and: {
            //       path: { $like: "columnSearch%" },
            //       $or: [
            //         { path: { $like: "globalSearch%" } },
            //         { copyright_statements: { $like: "globalSearch%" } },
            //         ...,
            //       ]
            //     }
            //   }
            // }
            let query = {
                where: {
                    $and: {}
                },
                // Only take the chunk of data DataTables needs
                limit: dataTablesInput.length,
                offset: dataTablesInput.start,
                order: [[columnName, direction]]
            };

            // If a column search exists, add search for that column
            for (let i = 0; i < dataTablesInput.columns.length; i++) {
                let columnSearch = dataTablesInput.columns[i].search.value;
                if (columnSearch) {
                    query.where.$and[dataTablesInput.columns[i].name] = {
                        $like: `${columnSearch}%`
                    }
                }
            }

            // If a global search exists, add an $or search for each column
            let globalSearch = dataTablesInput.search.value;
            if (globalSearch) {
                query.where.$and.$or = [];
                for (let i = 0; i < dataTablesInput.columns.length; i++) {
                    let orSearch = {};
                    orSearch[dataTablesInput.columns[i].name] = {
                        $like: `%${globalSearch}%`
                    };
                    query.where.$and.$or.push(orSearch);
                }
            }

            // Execute the database find to get the rows of data
            let dFind = $.Deferred();
            this.aboutCodeDB.FlattenedFile.findAll(query)
                .then((result) => dFind.resolve(result));

            // Execute the database count of all rows
            let dCount = $.Deferred();
            this.aboutCodeDB.FlattenedFile.count({})
                .then((count) => dCount.resolve(count));

            // Execute the database count of filtered query rows
            let dFilteredCount = $.Deferred();
            this.aboutCodeDB.FlattenedFile.count(query)
                .then((count) => dFilteredCount.resolve(count));

            // Wait for all three of the Deferred objects to finish
            $.when(dFind, dCount, dFilteredCount)
                .then((rows, count, filteredCount) => {
                    dataTablesCallback({
                        draw: dataTablesInput.draw,
                        data: rows ? rows : [],
                        recordsFiltered: filteredCount,
                        recordsTotal: count
                    });
                });
        });
    }

    _createDataTable(tableID) {
        return $(tableID).DataTable({
            "info": false,
            "colReorder": true,
            "serverSide": true,
            "processing": true,
            "ajax": (dataTablesInput, dataTablesCallback) =>
                this._query(dataTablesInput, dataTablesCallback),
            "columns": AboutCodeDataTable.TABLE_COLUMNS,
            "fixedColumns": {
                leftColumns: 1
            },
            // TODO: We want to use scroller but the current version of the
            // plugin doesn't work with fixedColumns. Try updating
            // "scroller": true,
            "scrollX": true,
            "scrollY": "75vh",
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
                    show: AboutCodeDataTable.COPYRIGHT_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: $(AboutCodeDataTable.TABLE_COLUMNS)
                        .not(AboutCodeDataTable.COPYRIGHT_GROUP)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only license columns
                    extend: "colvisGroup",
                    text: "License info",
                    show: AboutCodeDataTable.LICENSE_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: $(AboutCodeDataTable.TABLE_COLUMNS)
                        .not(AboutCodeDataTable.LICENSE_GROUP)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only origin columns
                    extend: "colvisGroup",
                    text: "Origin info",
                    show: AboutCodeDataTable.ORIGIN_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: $(AboutCodeDataTable.TABLE_COLUMNS)
                        .not(AboutCodeDataTable.ORIGIN_GROUP)
                        .map((column) => `${column.name}:name`)
                },
                {
                    extend: "colvisGroup",
                    text: "Show all columns",
                    show: ":hidden"
                }
            ],
            dom: // Needed to keep datatables buttons and search inline
            "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"
        });
    }

    static get LOCATION_COLUMN() {
        return [{
            "data": "path",
            "title": "Path",
            "name": "path"
        }];
    }

    static get COPYRIGHT_COLUMNS() {
        return [
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
    }

    static get LICENSE_COLUMNS() {
        return [
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
    }

    static get EMAIL_COLUMNS() {
        return [
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
    }

    static get URL_COLUMNS() {
        return [
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
    }

    static get FILE_COLUMNS() {
        return [
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
    }

    static get PACKAGE_COLUMNS() {
        return [
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
    }

    static get ORIGIN_COLUMN_NAMES() {
        return [
            "copyright_statements",
            "license_shortname",
            "license_category",
            "email",
            "url"
        ];
    }

    // Define DataTable columns
    static get TABLE_COLUMNS() {
        return AboutCodeDataTable.LOCATION_COLUMN.concat(
            AboutCodeDataTable.COPYRIGHT_COLUMNS,
            AboutCodeDataTable.LICENSE_COLUMNS,
            AboutCodeDataTable.EMAIL_COLUMNS,
            AboutCodeDataTable.URL_COLUMNS,
            AboutCodeDataTable.FILE_COLUMNS,
            AboutCodeDataTable.PACKAGE_COLUMNS);
    }

    static get ORIGIN_COLUMNS() {
        return $.grep(AboutCodeDataTable.TABLE_COLUMNS, function (column) {
            return $.inArray(column.name, AboutCodeDataTable.ORIGIN_COLUMN_NAMES) >= 0;
        });
    }

    static get LICENSE_GROUP() {
        return AboutCodeDataTable.LOCATION_COLUMN
            .concat(AboutCodeDataTable.LICENSE_COLUMNS);
    }

    static get COPYRIGHT_GROUP() {
        return AboutCodeDataTable.LOCATION_COLUMN
            .concat(AboutCodeDataTable.COPYRIGHT_COLUMNS);
    }

    static get ORIGIN_GROUP() {
        return AboutCodeDataTable.LOCATION_COLUMN
            .concat(AboutCodeDataTable.ORIGIN_COLUMNS);
    }
}

module.exports = AboutCodeDataTable;