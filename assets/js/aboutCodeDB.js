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


// Load Sequelize and create an in-memory database
var Sequelize = require("sequelize");

// Creates a new database on the flattened json data
function AboutCodeDB(json, callback) {

    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    var sequelize = new Sequelize("demo_schema", "root", "password", {
        dialect: "sqlite"
    });

    // Defines columns in the scanned file table
    this.ScannedFile = AboutCodeDB.defineScannedFile(sequelize);

    // A promise that will return when the db and tables have been created
    this.dbPromise = sequelize.sync();
    this.json = json;

    if (json) {
        var that = this;

        // Add all rows to the DB, then call the callback
        this.dbPromise.then(function() {
            var flattenedFiles = $.map(json.files, function(file, index) {
                return AboutCodeDB.flattenData(file);
            });
            return that.ScannedFile.bulkCreate(flattenedFiles, {logging: false});
        })
        .then(callback)
        .catch(function(err) {
            console.log(err);
        });
    }
}

module.exports = AboutCodeDB;


/**
 * AboutCodeDB data instance functions.
 *
 * Each new AboutCodeDB() has its own "this" variable.
 */

AboutCodeDB.prototype = {

    // This function is called every time DataTables needs to be redrawn.
    // For details on the parameters https://datatables.net/manual/server-side
    query: function (dataTablesInput, dataTablesCallback) {
        var that = this;

        // Sorting and Querying of data for DataTables
        this.dbPromise.then(function() {
            var columnIndex = dataTablesInput.order[0].column;
            var columnName = dataTablesInput.columns[columnIndex].name;
            var direction = dataTablesInput.order[0].dir === "desc" ? "DESC" : "ASC";

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
            var query = {
                where: {
                    $and: {}
                },
                // Only take the chunk of data DataTables needs
                limit: dataTablesInput.length,
                offset: dataTablesInput.start,
                order: [[columnName, direction]]
            };

            // If a column search exists, add search for that column
            for (var i = 0; i < dataTablesInput.columns.length; i++) {
                var columnSearch = dataTablesInput.columns[i].search.value;
                if (columnSearch) {
                    query.where.$and[dataTablesInput.columns[i].name] = {
                        $like: columnSearch + "%"
                    }
                }
            }

            // If a global search exists, add an $or search for each column
            var globalSearch = dataTablesInput.search.value;
            if (globalSearch) {
                query.where.$and.$or = [];
                for (var i = 0; i < dataTablesInput.columns.length; i++) {
                    var orSearch = {};
                    orSearch[dataTablesInput.columns[i].name] = {
                        $like: globalSearch + "%"
                    };
                    query.where.$and.$or.push(orSearch);
                }
            }

            // Execute the database find to get the rows of data
            var dFind = $.Deferred();
            that.ScannedFile.findAll(query)
                .then(function(result) {
                    dFind.resolve(result);
                });

            // Execute the database count of all rows
            var dCount = $.Deferred();
            that.ScannedFile.count({})
                .then(function(count) {
                    dCount.resolve(count);
                });

            // Execute the database count of filtered query rows
            var dFilteredCount = $.Deferred();
            that.ScannedFile.count(query)
                .then(function(count) {
                    dFilteredCount.resolve(count);
                })

            // Wait for all three of the Deferred objects to finish
            $.when(dFind, dCount, dFilteredCount)
                .then(function (rows, count, filteredCount) {
                    dataTablesCallback({
                       draw: dataTablesInput.draw,
                       data: rows ? rows : [],
                       recordsFiltered: filteredCount,
                       recordsTotal: count
                    });
                });
        });
    },

    // Return original scan files
    files: function () {
        return this.json.files;
    },

    // Format for jstree
    // [
    //  {id: root, text: root, parent: #, type: directory}
    //  {id: root/file1, text: file1, parent: root, type: file},
    //  {id: root/file2, text: file2, parent: root, type: file}
    // ]
    toJSTreeFormat: function () {
        var that = this;

        return this.dbPromise.then(function() {
            return that.ScannedFile.findAll({
                attributes: ["path", "infos_file_name", "infos_type"]
            });
        })
        .then(function(result) {
            return $.map(result, function(scanData, index) {
                 var splits = scanData.path.split('/');
                 var parent = splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
                 return {
                     id: scanData.path,
                     text: scanData.infos_file_name,
                     parent: parent,
                     type: scanData.infos_type
                 };
            });
        });
    }
}

/**
 * AboutCodeDB data class functions.
 *
 * These functions do not have "this" variables.
 */

// Defines a table for a flattened scanned file
AboutCodeDB.defineScannedFile = function(sequelize) {

    // DB COLUMN TYPE: A string with empty string default value
    function getDefaultStringType() {
        return {
            type: Sequelize.STRING,
            defaultValue: ""
        };
    }

    return sequelize.define("file", {
        path: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        copyright_statements: getDefaultStringType(),
        copyright_holders: getDefaultStringType(),
        copyright_authors: getDefaultStringType(),
        copyright_start_line: getDefaultStringType(),
        copyright_end_line:  getDefaultStringType(),
        license_key: getDefaultStringType(),
        license_score:  getDefaultStringType(),
        license_short_name: getDefaultStringType(),
        license_category: getDefaultStringType(),
        license_owner: getDefaultStringType(),
        license_homepage_url: getDefaultStringType(),
        license_text_url: getDefaultStringType(),
        license_djc_url: getDefaultStringType(),
        license_spdx_key: getDefaultStringType(),
        license_start_line:  getDefaultStringType(),
        license_end_line:  getDefaultStringType(),
        email: getDefaultStringType(),
        email_start_line:  getDefaultStringType(),
        email_end_line:  getDefaultStringType(),
        url: getDefaultStringType(),
        url_start_line: getDefaultStringType(),
        url_end_line: getDefaultStringType(),
        infos_type: getDefaultStringType(),
        infos_file_name: getDefaultStringType(),
        infos_file_extension: getDefaultStringType(),
        infos_file_date: getDefaultStringType(),
        infos_file_size: getDefaultStringType(),
        infos_file_sha1: getDefaultStringType(),
        infos_md5: getDefaultStringType(),
        infos_file_count: getDefaultStringType(),
        infos_mime_type: getDefaultStringType(),
        infos_file_type: getDefaultStringType(),
        infos_programming_language: getDefaultStringType(),
        infos_is_binary:  getDefaultStringType(),
        infos_is_text: getDefaultStringType(),
        infos_is_archive:  getDefaultStringType(),
        infos_is_media: getDefaultStringType(),
        infos_is_source: getDefaultStringType(),
        infos_is_script: getDefaultStringType(),
        packages_type: getDefaultStringType(),
        packages_packaging: getDefaultStringType(),
        packages_primary_language: getDefaultStringType()
    }, {
        indexes: [
            // Create a unique index on path
            {
                unique: true,
                fields: ["path"]
            }
        ]
    });
}

// Flatten ScanCode results data to load into database
AboutCodeDB.flattenData = function (file) {
    return {
        path: file.path,
        copyright_statements: AboutCodeDB.flattenArrayOfArray(file.copyrights, "statements"),
        copyright_holders: AboutCodeDB.flattenArrayOfArray(file.copyrights, "holders"),
        copyright_authors: AboutCodeDB.flattenArrayOfArray(file.copyrights, "authors"),
        copyright_start_line: AboutCodeDB.flattenArray(file.copyrights, "start_line"),
        copyright_end_line: AboutCodeDB.flattenArray(file.copyrights, "end_line"),
        license_key: AboutCodeDB.flattenArray(file.licenses, "key"),
        license_score: AboutCodeDB.flattenArray(file.licenses, "score"),
        license_short_name: AboutCodeDB.flattenArray(file.licenses, "short_name"),
        license_category: AboutCodeDB.flattenArray(file.licenses, "category"),
        license_owner: AboutCodeDB.flattenArray(file.licenses, "party"),
        license_homepage_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, "homepage_url"),
        license_text_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, "text_url"),
        license_djc_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, "dejacode_url"),
        license_spdx_key: AboutCodeDB.flattenArray(file.licenses, "spdx_license_key"),
        license_start_line: AboutCodeDB.flattenArray(file.licenses, "start_line"),
        license_end_line: AboutCodeDB.flattenArray(file.licenses, "end_line"),
        email: AboutCodeDB.flattenArray(file.emails, "email"),
        email_start_line: AboutCodeDB.flattenArray(file.emails, "start_line"),
        email_end_line: AboutCodeDB.flattenArray(file.emails, "end_line"),
        url: AboutCodeDB.flattenArrayOfUrl(file.urls, "url"),
        url_start_line: AboutCodeDB.flattenArrayOfUrlLine(file.urls, "start_line"),
        url_end_line: AboutCodeDB.flattenArrayOfUrlLine(file.urls, "end_line"),
        infos_type: file.type,
        infos_file_name: file.name,
        infos_file_extension: file.extension,
        infos_file_date: file.date,
        infos_file_size: file.size,
        infos_file_sha1: file.sha1,
        infos_md5: file.md5,
        infos_file_count: file.files_count,
        infos_mime_type: file.mime_type,
        infos_file_type: file.file_type,
        infos_programming_language: file.programming_language,
        infos_is_binary: file.is_binary,
        infos_is_text: file.is_text,
        infos_is_archive: file.is_archive,
        infos_is_media: file.is_media,
        infos_is_source: file.is_source,
        infos_is_script: file.is_script,
        packages_type: AboutCodeDB.flattenArray(file.packages, "type"),
        packages_packaging: AboutCodeDB.flattenArray(file.packages, "packaging"),
        packages_primary_language: AboutCodeDB.flattenArray(file.packages, "primary_language")
    }
}

// array: [
//     {key: [val0, val1]},
//     {key: [val2, val3]},
// ]
// => 'val0</br>val1<hr/>val2</br>val3'
AboutCodeDB.flattenArrayOfArray = function (array, key) {
    return $.map(array ? array : [], function (elem, i) {
        return elem[key] ? elem[key].join("</br>") : [];
    }).join("<hr/>");
}

// array: [
//     {key: val0},
//     {key: val1},
// ]
// => 'val0<hr/>val1'
AboutCodeDB.flattenArray = function (array, key) {
    return $.map(array ? array : [], function (elem, i) {
        return elem[key] ? elem[key] : [];
    }).join("<hr/>");
}

// array: [
//     {key: val0},
//     {key: val1},
// ]
// => 'val0</br>val1'
AboutCodeDB.flattenArrayOfUrlLine = function (array, key) {
    return $.map(array ? array : [], function (elem, i) {
        return elem[key] ? elem[key] : [];
    }).join("</br>");
}

// array: [
//     {key: url0},
//     {key: url1},
// ]
// => '<a href=url0 target="_blank">url0</a><br/>
//     <a href=url1 target="_blank">url1</a>'
AboutCodeDB.flattenArrayOfUrl = function (array, key) {
    return $.map(array ? array : [], function (elem, i) {
        var href = elem[key];

        return '<a href="'+href+'" target="_blank">'+href+'</a>';
    }).join("</br>");
}