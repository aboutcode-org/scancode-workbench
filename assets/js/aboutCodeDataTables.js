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

const HAS_A_VALUE =  "about_code_data_table_has_a_value";

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
                    // Return all non empty values
                    if (columnSearch === HAS_A_VALUE) {
                        query.where.$and[dataTablesInput.columns[i].name] = {
                            $and: [
                                { $ne: "[]" },
                                { $ne: "" },
                                { $ne: "{}" }
                            ]
                        }
                    } else {
                        // Column 0 is the "path", which should only match wildcards
                        // at the end of the path.
                        query.where.$and[dataTablesInput.columns[i].name] = {
                            $like: i === 0 ? `${columnSearch}%` : `%${columnSearch}%`
                        }
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
        // Adds a footer for each column. This needs to be done before creating
        // the DataTable
        let cells = $.map(AboutCodeDataTable.TABLE_COLUMNS, () => "<td></td>")
            .join("");
        $(tableID).append("<tfoot><tr>" + cells + "</tr></tfoot>");
        let that = this;

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
            "scrollResize": true,
            "deferRender": true,
            initComplete: function () {
                // Add a select element to each column's footer
                this.api().columns().every(function (columnIndex) {
                    const columnInfo = AboutCodeDataTable.TABLE_COLUMNS[columnIndex];

                    if ("skipFilter" in columnInfo && columnInfo.skipFilter) {
                        return;
                    }

                    const column = this;
                    const footer = $(column.footer());
                    const columnName = columnInfo.name;

                    let select = $(`<select id="clue-${columnName}" class="form-control">
                        <option value=""></option></select>`)
                        .appendTo(footer)
                        .on("click", () => {
                            let where = {};
                            where[columnName] = {$ne: null};

                            that.aboutCodeDB.FlattenedFile.findAll({
                                attributes: [Sequelize.fn("TRIM",
                                    Sequelize.col(columnName)), columnName],
                                group: [columnName],
                                where: where,
                                order: [columnName]
                            })
                            .then((rows) => {
                                let filterValues = $.map(rows, (row) => {
                                    return row[columnName];
                                })
                                    .map(filterValue => (filterValue).toString())
                                    .filter((filterValue) => filterValue.length > 0);

                                filterValues = $.map(filterValues, (filterValue) => filterValue);
                                filterValues.forEach((filterValue) => {
                                    filterValue.trim();
                                });
                                filterValues = $.unique(filterValues).sort();

                                const select = $(`select#clue-${columnName}`);
                                let val = select.find("option:selected");

                                select.empty().append(`<option value=""></option>`);

                                /**
                                 * Add Has a Value option to dropdown menu to show all rows
                                 * that contain a detected ScanCode value.
                                 */
                                if (filterValues.length > 0) {
                                    select.append(`<option value="${HAS_A_VALUE}">Has a Value</option>`);
                                }

                                $.each(filterValues, function ( i, filterValue ) {
                                    select.append(`<option value="${filterValue}">${filterValue}</option>`)
                                });
                                select.val(val);
                            });
                        })
                        .on( "change", function () {
                            // Get dropdown element selected value
                            let val = $(this).val();
                            column
                                .search(val, false, false)
                                .draw();
                        });
                });
             },
            "buttons": [
                {   // Do not allow the first column to be hidden
                    extend: "colvis",
                    columns: ":not(:first-child)",
                    collectionLayout: "fixed two-column"
                },
                {
                    extend: "colvisGroup",
                    text: "Show all",
                    show: ":hidden"
                },
                {
                    // Hide all columns except Path
                    extend: "colvisGroup",
                    text: "Hide all",
                    show: AboutCodeDataTable.LOCATION_COLUMN
                        .map((column) => `${column.name}:name`),
                    hide: AboutCodeDataTable.TABLE_COLUMNS
                        .filter((column) => AboutCodeDataTable.LOCATION_COLUMN.indexOf(column) < 0)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only origin columns
                    extend: "colvisGroup",
                    text: "Origin info",
                    show: AboutCodeDataTable.ORIGIN_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: AboutCodeDataTable.TABLE_COLUMNS
                        .filter((column) => AboutCodeDataTable.ORIGIN_GROUP.indexOf(column) < 0)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only copyright columns
                    extend: "colvisGroup",
                    text: "Copyright info",
                    show: AboutCodeDataTable.COPYRIGHT_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: AboutCodeDataTable.TABLE_COLUMNS
                        .filter((column) => AboutCodeDataTable.COPYRIGHT_GROUP.indexOf(column) < 0)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only license columns
                    extend: "colvisGroup",
                    text: "License info",
                    show: AboutCodeDataTable.LICENSE_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: AboutCodeDataTable.TABLE_COLUMNS
                        .filter((column) => AboutCodeDataTable.LICENSE_GROUP.indexOf(column) < 0)
                        .map((column) => `${column.name}:name`)
                },
                {
                    // Show only package columns
                    extend: "colvisGroup",
                    text: "Package info",
                    show: AboutCodeDataTable.PACKAGE_GROUP
                        .map((column) => `${column.name}:name`),
                    hide: AboutCodeDataTable.TABLE_COLUMNS
                        .filter((column) => AboutCodeDataTable.PACKAGE_GROUP.indexOf(column) < 0)
                        .map((column) => `${column.name}:name`)
                }
            ],
            dom: // Needed to keep datatables buttons and search inline
            "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"
        });
    }

    // Define DataTable columns
    static get TABLE_COLUMNS() {
        return AboutCodeDataTable.LOCATION_COLUMN
            .concat(AboutCodeDataTable.COPYRIGHT_COLUMNS,
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

    static get PACKAGE_GROUP() {
        return AboutCodeDataTable.LOCATION_COLUMN
            .concat(AboutCodeDataTable.PACKAGE_COLUMNS);
    }
}

AboutCodeDataTable.LOCATION_COLUMN =
    [
        {
        "data": "path",
        "title": "Path",
        "name": "path",
        "skipFilter": true
        }
    ];

AboutCodeDataTable.COPYRIGHT_COLUMNS =
    [
        {
            "data": function (row, type, val, meta) {
                return row.copyright_statements.map(statements => {
                    return statements.join("<br/>")
                }).join("<hr/>");
            },
            "title": "Copyright Statements",
            "name": "copyright_statements",
            "bar_chart_class": "bar-chart-copyrights"
        },
        {
            "data": function (row, type, val, meta) {
                return row.copyright_holders.map(holders => {
                    return holders.join("<br/>")
                }).join("<hr/>");
            },
            "title": "Copyright Holders",
            "name": "copyright_holders",
            "bar_chart_class": "bar-chart-copyrights"
        },
        {
            "data": function (row, type, val, meta) {
                return row.copyright_authors.map(authors => {
                    return authors.join("<br/>")
                }).join("<hr/>");
            },
            "title": "Copyright Authors",
            "name": "copyright_authors",
            "bar_chart_class": "bar-chart-copyrights"
        },
        {
            "data": "copyright_start_line[<hr/>]",
            "title": "Copyright Start Line",
            "name": "copyright_start_line"
        },
        {
            "data": "copyright_end_line[<hr/>]",
            "title": "Copyright End Line",
            "name": "copyright_end_line"
        }
    ];

AboutCodeDataTable.LICENSE_COLUMNS =
    [
        {
            "data": "license_key[<hr/>]",
            "title": "License Key",
            "name": "license_key",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_score[<hr/>]",
            "title": "License Score",
            "name": "license_score",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_short_name[<hr/>]",
            "title": "License Short Name",
            "name": "license_short_name",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_category",
            "title": "License Category",
            "name": "license_category",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_owner[<hr/>]",
            "title": "License Owner",
            "name": "license_owner",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_homepage_url",
            "title": "License Homepage URL",
            "name": "license_homepage_url",
            "render": function ( data, type, full, meta ) {
                return $.map(data, function (href, i) {
                    return '<a href="'+href+'" target="_blank">'+href+'</a>';
                }).join("<br>");
            }
        },
        {
            "data": "license_text_url",
            "title": "License Text URL",
            "name": "license_text_url",
            "render": function ( data, type, full, meta ) {
                return $.map(data, function (href, i) {
                    return '<a href="'+href+'" target="_blank">'+href+'</a>';
                }).join("<br>");
            }
        },
        {
            "data": "license_djc_url",
            "title": "DejaCode License URL",
            "name": "license_djc_url",
            "render": function ( data, type, full, meta ) {
                return $.map(data, function (href, i) {
                    return '<a href="'+href+'" target="_blank">'+href+'</a>';
                }).join("<br>");
            }
        },
        {
            "data": "license_spdx_key[<hr/>]",
            "title": "SPDX License Key",
            "name": "license_spdx_key",
            "bar_chart_class": "bar-chart-licenses"
        },
        {
            "data": "license_start_line[<hr/>]",
            "title": "License Start Line",
            "name": "license_start_line"
        },
        {
            "data": "license_end_line[<hr/>]",
            "title": "License End Line",
            "name": "license_end_line"
        }
    ];

AboutCodeDataTable.EMAIL_COLUMNS =
    [
        {
            "data": "email[<hr/>]",
            "title": "Email",
            "name": "email",
            "bar_chart_class": "bar-chart-emails"
        },
        {
            "data": "email_start_line[<hr/>]",
            "title": "Email Start Line",
            "name": "email_start_line"
        },
        {
            "data": "email_start_line[<hr/>]",
            "title": "End Start Line",
            "name": "email_start_line"
        }
    ];

AboutCodeDataTable.URL_COLUMNS =
    [
        {
            "data": "url",
            "title": "URL",
            "name": "url",
            "render": function ( data, type, full, meta ) {
                return $.map(data, function (href, i) {
                    return '<a href="'+href+'" target="_blank">'+href+'</a>';
                }).join("<br>");
            }
        },
        {
            "data": "url_start_line[<br>]",
            "title": "URL Start Line",
            "name": "url_start_line"
        },
        {
            "data": "url_end_line[<br>]",
            "title": "URL End Line",
            "name": "url_end_line"
        }
    ];

AboutCodeDataTable.FILE_COLUMNS =
    [
        {
            "data": "type",
            "title": "Type",
            "name": "type",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "name",
            "title": "File Name",
            "name": "name"
        },
        {
            "data": "extension",
            "title": "File Extension",
            "name": "extension",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "date",
            "title": "File Date",
            "name": "date"
        },
        {
            "data": "size",
            "title": "File Size",
            "name": "size"
        },
        {
            "data": "sha1",
            "title": "SHA1",
            "name": "sha1"
        },
        {
            "data": "md5",
            "title": "MD5",
            "name": "md5"
        },
        {
            "data": "file_count",
            "title": "File Count",
            "name": "file_count"
        },
        {
            "data": "mime_type",
            "title": "MIME Type",
            "name": "mime_type"
        },
        {
            "data": "file_type",
            "title": "File Type",
            "name": "file_type",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "programming_language",
            "title": "Language",
            "name": "programming_language",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_binary",
            "title": "Binary",
            "name": "is_binary",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_text",
            "title": "Text File",
            "name": "is_text",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_archive",
            "title": "Archive File",
            "name": "is_archive",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_media",
            "title": "Media File",
            "name": "is_media",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_source",
            "title": "Source File",
            "name": "is_source",
            "bar_chart_class": "bar-chart-file-infos"
        },
        {
            "data": "is_script",
            "title": "Script File",
            "name": "is_script",
            "bar_chart_class": "bar-chart-file-infos"
        }
    ];

AboutCodeDataTable.PACKAGE_COLUMNS =
    [
        {
            "data": "packages_type",
            "title": "Package Type",
            "name": "packages_type",
            "bar_chart_class": "bar-chart-package-infos"
        },
        {
            "data": "packages_name",
            "title": "Package Name",
            "name": "packages_name"
        },
        {
            "data": "packages_version",
            "title": "Package Version",
            "name": "packages_version"
        },
        {
            "data": "packages_asserted_licenses_license[<hr/>]",
            "title": "Package Asserted License",
            "name": "packages_asserted_licenses_license",
            "bar_chart_class": "bar-chart-package-infos"
        },
        {
            "data": "packages_primary_language",
            "title": "Package Primary Language",
            "name": "packages_primary_language",
            "bar_chart_class": "bar-chart-package-infos"
        },
        {
            "data": "packages_authors_name[<hr/>]",
            "title": "Package Authors Name",
            "name": "packages_authors_name",
            "bar_chart_class": "bar-chart-package-infos"
        },
        {
            "data": "packages_homepage_url",
            "title": "Package Homepage URL",
            "name": "packages_homepage_url"
        },
        {
            "data": function (row, type, val, meta) {
                return row.packages_download_urls.map(urls => {
                    return urls.map(url => {
                         return '<a href="'+url+'" target="_blank">'+url+'</a>';
                    }).join("<br/>")
                }).join("<hr/>");
            },
            "title": "Package Download URLs",
            "name": "packages_download_urls"
        },
    ];

AboutCodeDataTable.ORIGIN_COLUMN_NAMES =
    [
        "copyright_statements",
        "license_short_name",
        "license_category",
        "email",
        "url"
    ];

module.exports = AboutCodeDataTable;