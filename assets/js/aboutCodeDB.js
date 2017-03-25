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
function AboutCodeDB(config) {

    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    this.sequelize = new Sequelize(
        config && config.dbName ? config.dbName : "tmp",
        config && config.dbUser ? config.dbUser : null,
        config && config.dbPassword ? config.dbPassword : null,
        { dialect: "sqlite" });

    // Flattened table is for the DataTable
    this.FlattenedFile = AboutCodeDB.flattenedFileModel(this.sequelize);

    // Non-flattened tables are for the NodeView
    this.File = AboutCodeDB.fileModel(this.sequelize);
    this.License = AboutCodeDB.licenseModel(this.sequelize);
    this.Copyright = AboutCodeDB.copyrightModel(this.sequelize);
    this.Package = AboutCodeDB.packageModel(this.sequelize);
    this.Email = AboutCodeDB.emailModel(this.sequelize);
    this.Url = AboutCodeDB.urlModel(this.sequelize);

    // Relations
    this.File.hasMany(this.License);
    this.File.hasMany(this.Copyright);
    this.File.hasMany(this.Package);
    this.File.hasMany(this.Email);
    this.File.hasMany(this.Url);

    // Include Array for queries
    this.include = [
        this.License,
        this.Copyright,
        this.Package,
        this.Email,
        this.Url
    ]

    // A promise that will return when the db and tables have been created
    this.db = this.sequelize.sync();
}

module.exports = AboutCodeDB;


/**
 * AboutCodeDB data instance functions.
 *
 * Each new AboutCodeDB() has its own "this" variable.
 */

AboutCodeDB.prototype = {
    findOne: function(query) {
        var that = this;
        return this.db.then(function() {
            return that.File.findOne(
                $.extend(query, {
                    include: that.include
                }));
        });
    },
    findAll: function(query) {
        var that = this;
        return this.db.then(function() {
            return that.File.findAll(
                $.extend(query, {
                    include: that.include
                }));
        });
    },
    addFlattenedRows: function (json) {
        if (!json) {
            return this.db;
        }

        var that = this;

        // Add all rows to the flattened DB
        return this.db.then(function() {
            return $.map(json.files, function(file, index) {
                return AboutCodeDB.flattenData(file);
            });
        }).then(function(flattenedFiles) {
            return that.FlattenedFile.bulkCreate(flattenedFiles, {
                logging: false
            });
        });
    },
    addRows: function (json) {
        if (!json) {
            return this.db;
        }

        var that = this;

        // Add all rows to the non-flattened DB
        var dbSync = this.db;
        return this.db.then(function() {
            return that.sequelize.transaction(function(transaction) {
                $.each(json.files, function(index, file) {
                    dbSync = dbSync.then(function() {
                        return that.File.create(
                            $.extend(file, { parent: AboutCodeDB.parent(file.path) }), {
                            logging: false,
                            transaction: transaction,
                            include: that.include
                        });
                    });
                });
                return dbSync;
            });
        });
    },

    // Format for jstree
    // [
    //  {id: root, text: root, parent: #, type: directory}
    //  {id: root/file1, text: file1, parent: root, type: file},
    //  {id: root/file2, text: file2, parent: root, type: file}
    // ]
    toJSTreeFormat: function () {
        var that = this;

        return this.db.then(function() {
            return that.FlattenedFile.findAll({
                attributes: ["path", "parent", "infos_file_name", "infos_type"]
            });
        })
        .then(function(files) {
            return $.map(files, function(file, index) {
                 return {
                     id: file.path,
                     text: file.infos_file_name,
                     parent: file.parent,
                     type: file.infos_type
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

// File Model definitions
AboutCodeDB.fileModel = function(sequelize) {
    return sequelize.define("files", {
        path: Sequelize.STRING,
        parent: Sequelize.STRING,
        type: Sequelize.STRING,
        name: Sequelize.STRING,
        extension: Sequelize.STRING,
        date: Sequelize.STRING,
        size: Sequelize.STRING,
        sha1: Sequelize.STRING,
        md5: Sequelize.STRING,
        files_count: Sequelize.STRING,
        mime_type: Sequelize.STRING,
        file_type: Sequelize.STRING,
        programming_language: Sequelize.STRING,
        is_binary: Sequelize.STRING,
        is_text: Sequelize.STRING,
        is_archive: Sequelize.STRING,
        is_media: Sequelize.STRING,
        is_source: Sequelize.STRING,
        is_script: Sequelize.STRING
    });
}

    // License Model definitions
AboutCodeDB.licenseModel = function(sequelize) {
    return sequelize.define("licenses", {
        key: Sequelize.STRING,
        score: Sequelize.STRING,
        short_name: Sequelize.STRING,
        category: Sequelize.STRING,
        owner: Sequelize.STRING,
        homepage_url:Sequelize.STRING,
        text_url: Sequelize.STRING,
        dejacode_url: Sequelize.STRING,
        spdx_license_key: Sequelize.STRING,
        spdx_url: Sequelize.STRING,
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });
}

    // Copyright Model definitions
AboutCodeDB.copyrightModel = function(sequelize) {
    return sequelize.define("copyrights", {
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });
}

    // Package Model definitions
AboutCodeDB.packageModel = function(sequelize) {
    return sequelize.define("packages", {
        type: Sequelize.STRING,
        packaging: Sequelize.STRING,
        primary_language: Sequelize.STRING
    });
}

    // Email Model definitions
AboutCodeDB.emailModel = function(sequelize) {
    return sequelize.define("emails", {
        email: Sequelize.STRING,
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });
}

    // URL Model definitions
AboutCodeDB.urlModel = function(sequelize) {
    return sequelize.define("urls", {
        url: Sequelize.STRING,
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });
}

// Defines a table for a flattened scanned file
AboutCodeDB.flattenedFileModel = function(sequelize) {
    return sequelize.define("flattened_file", {
        path: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        parent:               { type: Sequelize.STRING, defaultValue: "" },
        copyright_statements: { type: Sequelize.STRING, defaultValue: "" },
        copyright_holders:    { type: Sequelize.STRING, defaultValue: "" },
        copyright_authors:    { type: Sequelize.STRING, defaultValue: "" },
        copyright_start_line: { type: Sequelize.STRING, defaultValue: "" },
        copyright_end_line:   { type: Sequelize.STRING, defaultValue: "" },
        license_key:          { type: Sequelize.STRING, defaultValue: "" },
        license_score:        { type: Sequelize.STRING, defaultValue: "" },
        license_short_name:   { type: Sequelize.STRING, defaultValue: "" },
        license_category:     { type: Sequelize.STRING, defaultValue: "" },
        license_owner:        { type: Sequelize.STRING, defaultValue: "" },
        license_homepage_url: { type: Sequelize.STRING, defaultValue: "" },
        license_text_url:     { type: Sequelize.STRING, defaultValue: "" },
        license_djc_url:      { type: Sequelize.STRING, defaultValue: "" },
        license_spdx_key:     { type: Sequelize.STRING, defaultValue: "" },
        license_start_line:   { type: Sequelize.STRING, defaultValue: "" },
        license_end_line:     { type: Sequelize.STRING, defaultValue: "" },
        email:                { type: Sequelize.STRING, defaultValue: "" },
        email_start_line:     { type: Sequelize.STRING, defaultValue: "" },
        email_end_line:       { type: Sequelize.STRING, defaultValue: "" },
        url:                  { type: Sequelize.STRING, defaultValue: "" },
        url_start_line:       { type: Sequelize.STRING, defaultValue: "" },
        url_end_line:         { type: Sequelize.STRING, defaultValue: "" },
        infos_type:           { type: Sequelize.STRING, defaultValue: "" },
        infos_file_name:      { type: Sequelize.STRING, defaultValue: "" },
        infos_file_extension: { type: Sequelize.STRING, defaultValue: "" },
        infos_file_date:      { type: Sequelize.STRING, defaultValue: "" },
        infos_file_size:      { type: Sequelize.STRING, defaultValue: "" },
        infos_file_sha1:      { type: Sequelize.STRING, defaultValue: "" },
        infos_md5:            { type: Sequelize.STRING, defaultValue: "" },
        infos_file_count:     { type: Sequelize.STRING, defaultValue: "" },
        infos_mime_type:      { type: Sequelize.STRING, defaultValue: "" },
        infos_file_type:      { type: Sequelize.STRING, defaultValue: "" },
        infos_programming_language: { type: Sequelize.STRING, defaultValue: "" },
        infos_is_binary:      { type: Sequelize.STRING, defaultValue: "" },
        infos_is_text:        { type: Sequelize.STRING, defaultValue: "" },
        infos_is_archive:     { type: Sequelize.STRING, defaultValue: "" },
        infos_is_media:       { type: Sequelize.STRING, defaultValue: "" },
        infos_is_source:      { type: Sequelize.STRING, defaultValue: "" },
        infos_is_script:      { type: Sequelize.STRING, defaultValue: "" },
        packages_type:        { type: Sequelize.STRING, defaultValue: "" },
        packages_packaging:   { type: Sequelize.STRING, defaultValue: "" },
        packages_primary_language: { type: Sequelize.STRING, defaultValue: "" }
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
        parent: AboutCodeDB.parent(file.path),
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

AboutCodeDB.parent = function(path) {
    var splits = path.split("/");
    return splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
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