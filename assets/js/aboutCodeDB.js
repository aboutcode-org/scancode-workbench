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


// Load nedb and create an in-memory database
var Sequelize = require("sequelize");

// Creates a new database on the flattened json data
function AboutCodeDB(json, callback) {

    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    var connection = new Sequelize("demo_schema", "root", "password", {
        dialect: "sqlite"
    });

    // Defines columns in the scanned file table
    this.ScannedFile = AboutCodeDB.defineScannedFile(connection);

    // A promise that will return when the db and tables have been created
    this.dbPromise = connection.sync();

    if (json) {

        // Flatten the json data to allow sorting and searching
        var flattenedData = $.map(json.files, function (file, i) {
            return AboutCodeDB.flattenData(file);
        });

        // Add all rows to the DB, then call the callback
        var that = this;

        this.dbPromise.then(function() {
            $.each(flattenedData, function(i, file) {
                that.ScannedFile.create(file);
            });
        })
        .then(callback);
    }
}

module.exports = AboutCodeDB;


/**
 * AboutCodeDB data instance functions.
 *
 * Each new AboutCodeDB() has its own 'this' variable.
 */

AboutCodeDB.prototype = {

    // This function is called every time DataTables needs to be redrawn.
    // For details on the parameters https://datatables.net/manual/server-side
    query: function (dataTablesInput, dataTablesCallback) {

        var that = this;

        // TODO: Add back in searching and sorting of DataTable
        this.dbPromise.then(function() {

            // Execute the database find to get the rows of data
            that.ScannedFile.findAndCountAll({})
                .then(function(result) {
                    if (result && result.rows) {
                       dataTablesCallback({
                           draw: dataTablesInput.draw,
                           data: result.rows,
                           recordsFiltered: result.count,
                           recordsTotal: result.count
                       });
                    }
                });
            });
    }
}

/**
 * AboutCodeDB data class functions.
 *
 * These functions do not have 'this' variables.
 */

// Defines a table for a flattened scanned file
AboutCodeDB.defineScannedFile = function(connection) {

    // DB COLUMN TYPE: A string with empty string default value
    var DEFAULT_STRING_TYPE = {
        type: Sequelize.STRING,
        defaultValue: ""
    };

    return connection.define("file", {
        path: Sequelize.STRING,
        copyright_statements: DEFAULT_STRING_TYPE,
        copyright_holders: DEFAULT_STRING_TYPE,
        copyright_authors: DEFAULT_STRING_TYPE,
        copyright_start_line: DEFAULT_STRING_TYPE,
        copyright_end_line:  DEFAULT_STRING_TYPE,
        license_key: DEFAULT_STRING_TYPE,
        license_score:  DEFAULT_STRING_TYPE,
        license_short_name: DEFAULT_STRING_TYPE,
        license_category: DEFAULT_STRING_TYPE,
        license_owner: DEFAULT_STRING_TYPE,
        license_homepage_url: DEFAULT_STRING_TYPE,
        license_text_url: DEFAULT_STRING_TYPE,
        license_djc_url: DEFAULT_STRING_TYPE,
        license_spdx_key: DEFAULT_STRING_TYPE,
        license_start_line:  DEFAULT_STRING_TYPE,
        license_end_line:  DEFAULT_STRING_TYPE,
        email: DEFAULT_STRING_TYPE,
        email_start_line:  DEFAULT_STRING_TYPE,
        email_end_line:  DEFAULT_STRING_TYPE,
        url: DEFAULT_STRING_TYPE,
        url_start_line: DEFAULT_STRING_TYPE,
        url_end_line: DEFAULT_STRING_TYPE,
        infos_type: DEFAULT_STRING_TYPE,
        infos_file_name: DEFAULT_STRING_TYPE,
        infos_file_extension: DEFAULT_STRING_TYPE,
        infos_file_date: DEFAULT_STRING_TYPE,
        infos_file_size: DEFAULT_STRING_TYPE,
        infos_file_sha1: DEFAULT_STRING_TYPE,
        infos_md5: DEFAULT_STRING_TYPE,
        infos_file_count: DEFAULT_STRING_TYPE,
        infos_mime_type: DEFAULT_STRING_TYPE,
        infos_file_type: DEFAULT_STRING_TYPE,
        infos_programming_language: DEFAULT_STRING_TYPE,
        infos_is_binary:  DEFAULT_STRING_TYPE,
        infos_is_text: DEFAULT_STRING_TYPE,
        infos_is_archive:  DEFAULT_STRING_TYPE,
        infos_is_media: DEFAULT_STRING_TYPE,
        infos_is_source: DEFAULT_STRING_TYPE,
        infos_is_script: DEFAULT_STRING_TYPE,
        packages_type: DEFAULT_STRING_TYPE,
        packages_packaging: DEFAULT_STRING_TYPE,
        packages_primary_language: DEFAULT_STRING_TYPE
    });
}

// Flatten ScanCode results data to load into database
AboutCodeDB.flattenData = function (file) {
    return {
        path: file.path,
        copyright_statements: AboutCodeDB.flattenArrayOfArray(file.copyrights, 'statements'),
        copyright_holders: AboutCodeDB.flattenArrayOfArray(file.copyrights, 'holders'),
        copyright_authors: AboutCodeDB.flattenArrayOfArray(file.copyrights, 'authors'),
        copyright_start_line: AboutCodeDB.flattenArray(file.copyrights, 'start_line'),
        copyright_end_line: AboutCodeDB.flattenArray(file.copyrights, 'end_line'),
        license_key: AboutCodeDB.flattenArray(file.licenses, 'key'),
        license_score: AboutCodeDB.flattenArray(file.licenses, 'score'),
        license_short_name: AboutCodeDB.flattenArray(file.licenses, 'short_name'),
        license_category: AboutCodeDB.flattenArray(file.licenses, 'category'),
        license_owner: AboutCodeDB.flattenArray(file.licenses, 'party'),
        license_homepage_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, 'homepage_url'),
        license_text_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, 'text_url'),
        license_djc_url: AboutCodeDB.flattenArrayOfUrl(file.licenses, 'dejacode_url'),
        license_spdx_key: AboutCodeDB.flattenArray(file.licenses, 'spdx_license_key'),
        license_start_line: AboutCodeDB.flattenArray(file.licenses, 'start_line'),
        license_end_line: AboutCodeDB.flattenArray(file.licenses, 'end_line'),
        email: AboutCodeDB.flattenArray(file.emails, 'email'),
        email_start_line: AboutCodeDB.flattenArray(file.emails, 'start_line'),
        email_end_line: AboutCodeDB.flattenArray(file.emails, 'end_line'),
        url: AboutCodeDB.flattenArrayOfUrl(file.urls, 'url'),
        url_start_line: AboutCodeDB.flattenArrayOfUrlLine(file.urls, 'start_line'),
        url_end_line: AboutCodeDB.flattenArrayOfUrlLine(file.urls, 'end_line'),
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
        packages_type: AboutCodeDB.flattenArray(file.packages, 'type'),
        packages_packaging: AboutCodeDB.flattenArray(file.packages, 'packaging'),
        packages_primary_language: AboutCodeDB.flattenArray(file.packages, 'primary_language')
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