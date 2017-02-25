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
function NodeViewDB(json, callback) {

    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    var sequelize = new Sequelize("nodeview_schema", null , null, {
        dialect: "sqlite"
    });

    // File Model definitions
    this.ScannedFile = sequelize.define("files", {
        path: Sequelize.STRING,
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
        is_script: Sequelize.STRING,
    });

    // License Model definitions
    this.License = sequelize.define("licenses", {
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

    // Copyright Model definitions
    this.Copyright = sequelize.define("copyrights", {
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });

    // Package Model definitions
    this.Package = sequelize.define("packages", {
        type: Sequelize.STRING,
        packaging: Sequelize.STRING,
        primary_language: Sequelize.STRING
    });

    // Email Model definitions
    this.Email = sequelize.define("emails", {
        email: Sequelize.STRING,
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });

    // URL Model definitions
    this.Url = sequelize.define("urls", {
        url: Sequelize.STRING,
        start_line: Sequelize.STRING,
        end_line: Sequelize.STRING
    });

    // Relations
    this.ScannedFile.hasMany(this.License);
    this.ScannedFile.hasMany(this.Copyright);
    this.ScannedFile.hasMany(this.Package);
    this.ScannedFile.hasMany(this.Email);
    this.ScannedFile.hasMany(this.Url);

    // A promise that will return when the db and tables have been created
    var dbSync = sequelize.sync();

    if (json) {

        var that = this;

        // Add all rows to the DB, then call the callback
        this.db = dbSync.then(function() {
            return sequelize.transaction(function(transaction) {
                $.each(json.files, function(index, file) {
                    dbSync = dbSync.then(function() {
                        return that.ScannedFile.create(file, {
                            logging: false,
                            transaction: transaction,
                            include: [
                                that.License,
                                that.Copyright,
                                that.Package,
                                that.Email,
                                that.Url
                            ]
                        });
                    });
                });
                return dbSync;
            });
        }).then(callback);
    }
}


module.exports = NodeViewDB;


/**
 * NodeViewDB data instance functions.
 *
 * Each new NodeViewDB() has its own "this" variable.
 */

NodeViewDB.prototype = {
    getFile: function(path) {
        var that = this;
        return this.db.then(function() {
            return that.ScannedFile.findAll({
                where: { path: path },
                include: [
                    that.License,
                    that.Copyright,
                    that.Package,
                    that.Email,
                    that.Url
                ]
            });
        });
    }
}


