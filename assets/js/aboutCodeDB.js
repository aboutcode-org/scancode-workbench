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
var Datastore = require('nedb');

// Creates a new database on the flattened json data
function AboutCodeDB(json, callback) {
    // create a database
    this.db = new Datastore();
    if (json) {
        // Flatten the json data to allow sorting and searching
        var flattenedData = $.map(json.files, function (file, i) {
            return AboutCodeDB.flattenData(file);
        });

        this.db.insert(flattenedData, callback);
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
        // Build the database query for both global searches and searches on
        // particular columns
        var query = {
            $where : function() {
                var globalSearch = dataTablesInput.search.value;

                for (var i = 0; i < dataTablesInput.columns.length; i++) {
                    // get all values
                    var value = this[dataTablesInput.columns[i].name]
                    var valueStr = String(value);

                    // If column search exists, match on column
                    var columnSearch = dataTablesInput.columns[i].search.value;
                    if (columnSearch && (!value || valueStr.indexOf(columnSearch) != 0)) {
                        return false;
                    }

                    // If global search exists, match on any column
                    if (value && valueStr.indexOf(globalSearch) >= 0) {
                        return true;
                    }
                }
                return false;
            }
        }

        var dbFind = this.db.find(query);

        // Sort by column if needed. Currently only supporting sorting for
        // one column
        if (dataTablesInput.order.length > 0) {
            var columnIndex = dataTablesInput.order[0].column;
            var columnName = dataTablesInput.columns[columnIndex].name;
            var direction = dataTablesInput.order[0].dir == 'asc' ? 1 : -1;
            var sortObj = {};
            sortObj[columnName] = direction;
            dbFind = dbFind.sort(sortObj);
        }

        // Only take the chunk of data DataTables needs
        dbFind = dbFind.skip(dataTablesInput.start);
        if (dataTablesInput.length >= 0) {
            dbFind = dbFind.limit(dataTablesInput.length);
        }

        // Execute the database find to get the rows of data
        var dFind = $.Deferred();
        dbFind.exec(function (err, docs) {
            if (err) {
                throw err;
            }
            dFind.resolve(docs);
        });

        // Count all documents in the datastore
        var dCountTotal = $.Deferred();
        this.db.count({}).exec(function (err, count) {
            if (err) {
                throw err;
            }
            dCountTotal.resolve(count);
        });

        // Count only filtered documents in the datastore
        var dCountFiltered = $.Deferred();
        this.db.count(query).exec(function (err, count) {
            if (err) {
                throw err;
            }
            dCountFiltered.resolve(count);
        });

        // Wait for all three of the Deferred objects to finish
        $.when(dFind, dCountTotal, dCountFiltered)
            .then(function (docs, countTotal, countFiltered) {
               if (docs) {
                   dataTablesCallback({
                       draw: dataTablesInput.draw,
                       data: docs,
                       recordsFiltered: countFiltered,
                       recordsTotal: countTotal
                   })
            }
        });
    }
}

/**
 * AboutCodeDB data class functions.
 *
 * These functions do not have 'this' variables.
 */

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
        infos_file_data: file.date,
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