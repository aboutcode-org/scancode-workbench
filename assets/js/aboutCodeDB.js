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
const Sequelize = require("sequelize");

// Creates a new database on the flattened json data
class AboutCodeDB {
    constructor(config) {
        // Constructor returns an object which effectively represents a connection
        // to the db arguments (name of db, username for db, pw for that user)
        let name = (config && config.dbName) ? config.dbName : "tmp";
        let user = (config && config.dbUser) ? config.dbUser : null;
        let password = (config && config.dbPassword) ? config.dbPassword : null;
        let storage = (config && config.dbStorage)
            ? config.dbStorage
            : ":memory:";

        this.sequelize = new Sequelize(name, user, password, {
            dialect: "sqlite",
            storage: storage
        });

        // Flattened table is for the DataTable
        // This table is used by the Clues DataTable
        this.FlattenedFile = AboutCodeDB.flattenedFileModel(this.sequelize);

        // Non-flattened tables are for the NodeView
        this.File = AboutCodeDB.fileModel(this.sequelize);
        this.License = AboutCodeDB.licenseModel(this.sequelize);
        this.Copyright = AboutCodeDB.copyrightModel(this.sequelize);
        this.Package = AboutCodeDB.packageModel(this.sequelize);
        this.Email = AboutCodeDB.emailModel(this.sequelize);
        this.Url = AboutCodeDB.urlModel(this.sequelize);

        // Component table is for creating custom components.
        this.Component = AboutCodeDB.componentModel(this.sequelize);

        // Relations
        this.File.hasMany(this.License);
        this.File.hasMany(this.Copyright);
        this.File.hasMany(this.Package);
        this.File.hasMany(this.Email);
        this.File.hasMany(this.Url);
        this.File.hasOne(this.Component);

        // Include Array for queries
        this.include = [
            this.License,
            this.Copyright,
            this.Package,
            this.Email,
            this.Url,
            this.Component
        ];

        // A promise that will return when the db and tables have been created
        this.db = this.sequelize.sync();
    }

    // Uses the components table to do a findAll query
    findAllComponents(query) {
        return this.db.then(() => this.Component.findAll(query));
    }

    // Uses the components table to do a findOne query
    findComponent(query) {
        return this.db.then(() => this.Component.findOne(query));
    }

    // Uses the components table to create or set a component
    setComponent(component) {
        return this.findComponent({
            where: { path: component.path }
        })
            .then((dbComponent) => {
                if (dbComponent) {
                    return dbComponent.update(component);
                }
                else {
                    return this.Component.create(component);
                }
            });
    }

    // Uses the files table to do a findOne query
    findOne(query) {
        query = $.extend(query, { include: this.include });
        return this.db.then(() => this.File.findOne(query));
    }

    // Uses the files table to do a findAll query
    findAll(query) {
        query = $.extend(query, { include: this.include });
        return this.db.then(() => this.File.findAll(query));
    }

    // Add rows to the flattened files table from a ScanCode json object
    addFlattenedRows(json) {
        if (!json) {
            return this.db;
        }

        // Add all rows to the flattened DB
        return this.db
            .then(() => {
                return json.files.map((file) => AboutCodeDB.flattenData(file));
            })
            .then((flattenedFiles) => {
                return this.FlattenedFile.bulkCreate(flattenedFiles, {
                    logging: false
                });
            });
    }

    // Adds row to the files table
    addRows(json) {
        if (!json) {
            return this.db;
        }

        // Add all rows to the non-flattened DB
        return this.db.then(() => {
            return this.sequelize.transaction((transaction) => {
                let promiseChain = Promise.resolve();
                $.each(json.files, (index, file) => {
                    file = $.extend(file, {parent: AboutCodeDB.parent(file.path)});
                    promiseChain = promiseChain.then(() => {
                        return this.File.create(file, {
                            logging: false,
                            transaction: transaction,
                            include: this.include
                        });
                    });
                });
                return promiseChain;
            });
        });
    }

    // Format for jstree
    // [
    //  {id: root, text: root, parent: #, type: directory}
    //  {id: root/file1, text: file1, parent: root, type: file},
    //  {id: root/file2, text: file2, parent: root, type: file}
    // ]
    toJSTreeFormat() {
        return this.db
            .then(() => {
                return this.File.findAll({
                    attributes: ["path", "parent", "name", "type"]
                });
            })
            .then((files) => {
                return files.map((file) => {
                    return {
                        id: file.path,
                        text: file.name,
                        parent: file.parent,
                        type: file.type
                    };
                });
            });
    }

    // File Model definitions
    static fileModel(sequelize) {
        return sequelize.define("files", {
            path: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            parent: Sequelize.STRING,
            type: Sequelize.STRING,
            name: Sequelize.STRING,
            extension: Sequelize.STRING,
            date: Sequelize.STRING,
            size: Sequelize.INTEGER,
            sha1: Sequelize.STRING,
            md5: Sequelize.STRING,
            files_count: Sequelize.INTEGER,
            mime_type: Sequelize.STRING,
            file_type: Sequelize.STRING,
            programming_language: Sequelize.STRING,
            is_binary: Sequelize.BOOLEAN,
            is_text: Sequelize.BOOLEAN,
            is_archive: Sequelize.BOOLEAN,
            is_media: Sequelize.BOOLEAN,
            is_source: Sequelize.BOOLEAN,
            is_script: Sequelize.BOOLEAN
        });
    }
    // TODO (@jdaguil): Add matched_rule to license model
    // License Model definitions
    static licenseModel(sequelize) {
        return sequelize.define("licenses", {
            key: Sequelize.STRING,
            score: Sequelize.INTEGER,
            short_name: Sequelize.STRING,
            category: Sequelize.STRING,
            owner: Sequelize.STRING,
            homepage_url: Sequelize.STRING,
            text_url: Sequelize.STRING,
            dejacode_url: Sequelize.STRING,
            spdx_license_key: Sequelize.STRING,
            spdx_url: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER
        });
    }

    // TODO (@jdaguil): Add author to copyright model
    // Copyright Model definitions
    static copyrightModel(sequelize) {
        return sequelize.define("copyrights", {
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER,
            holders: AboutCodeDB.jsonDataType('holders'),
            statements: AboutCodeDB.jsonDataType('statements')
        });
    }

    // TODO (@jdaguil): Add other package attributes to package model
    // Package Model definitions
    static packageModel(sequelize) {
        return sequelize.define("packages", {
            type: Sequelize.STRING,
            packaging: Sequelize.STRING,
            primary_language: Sequelize.STRING
        });
    }

    // Email Model definitions
    static emailModel(sequelize) {
        return sequelize.define("emails", {
            email: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER
        });
    }

    // URL Model definitions
    static urlModel(sequelize) {
        return sequelize.define("urls", {
            url: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER
        });
    }

    // Component Model definitions
    static componentModel(sequelize) {
        return sequelize.define("components", {
            path: Sequelize.STRING,
            review_status: Sequelize.STRING,
            name: Sequelize.STRING,
            version: Sequelize.STRING,
            licenses: AboutCodeDB.jsonDataType('licenses'),
            copyrights: AboutCodeDB.jsonDataType('copyrights'),
            owner: Sequelize.STRING,
            homepage_url: Sequelize.STRING,
            programming_language: Sequelize.STRING,
            notes: Sequelize.STRING
        }, {
            getterMethods: {
                license_expression: function()  {
                    return $.map(this.licenses, (license, index) => {
                       return license.short_name;
                    }).join(" AND ");
                },
                copyright: function() {
                    return $.map(this.copyrights, (copyright, index) => {
                        return copyright.statements.join(" ");
                    }).join("\n");
                }
            }
        });
    }

    // Stores an object as a json string internally, but as an object externally
    static jsonDataType(attributeName) {
        return {
            type: Sequelize.STRING,
            get: function() {
                return JSON.parse(this.getDataValue(attributeName));
            },
            set: function(val) {
                return this.setDataValue(attributeName, JSON.stringify(val));
            }
        }
    }

    // Defines a table for a flattened scanned file
    static flattenedFileModel(sequelize) {
        return sequelize.define("flattened_file", {
            path: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            parent: {type: Sequelize.STRING, defaultValue: ""},
            copyright_statements: AboutCodeDB.jsonDataType("copyright_statements"),
            copyright_holders: AboutCodeDB.jsonDataType("copyright_holders"),
            copyright_authors: AboutCodeDB.jsonDataType("copyright_authors"),
            copyright_start_line: AboutCodeDB.jsonDataType("copyright_start_line"),
            copyright_end_line: AboutCodeDB.jsonDataType("copyright_end_line"),
            license_key: AboutCodeDB.jsonDataType("license_key"),
            license_score: AboutCodeDB.jsonDataType("license_score"),
            license_short_name: AboutCodeDB.jsonDataType("license_short_name"),
            license_category: AboutCodeDB.jsonDataType("license_category"),
            license_owner: AboutCodeDB.jsonDataType("license_owner"),
            license_homepage_url: AboutCodeDB.jsonDataType("license_homepage_url"),
            license_text_url: AboutCodeDB.jsonDataType("license_text_url"),
            license_djc_url: AboutCodeDB.jsonDataType("license_djc_url"),
            license_spdx_key: AboutCodeDB.jsonDataType("license_spdx_key"),
            license_start_line: AboutCodeDB.jsonDataType("license_start_line"),
            license_end_line: AboutCodeDB.jsonDataType("license_end_line"),
            email: AboutCodeDB.jsonDataType("email"),
            email_start_line: AboutCodeDB.jsonDataType("email_start_line"),
            email_end_line: AboutCodeDB.jsonDataType("email_end_line"),
            url: AboutCodeDB.jsonDataType("url"),
            url_start_line: AboutCodeDB.jsonDataType("url_start_line"),
            url_end_line: AboutCodeDB.jsonDataType("url_end_line"),
            type: {type: Sequelize.STRING, defaultValue: ""},
            name: {type: Sequelize.STRING, defaultValue: ""},
            extension: {type: Sequelize.STRING, defaultValue: ""},
            date: {type: Sequelize.STRING, defaultValue: ""},
            size: {type: Sequelize.INTEGER, defaultValue: ""},
            sha1: {type: Sequelize.STRING, defaultValue: ""},
            md5: {type: Sequelize.STRING, defaultValue: ""},
            file_count: {type: Sequelize.INTEGER, defaultValue: ""},
            mime_type: {type: Sequelize.STRING, defaultValue: ""},
            file_type: {type: Sequelize.STRING, defaultValue: ""},
            programming_language: {
                type: Sequelize.STRING,
                defaultValue: ""
            },
            is_binary: Sequelize.BOOLEAN,
            is_text: Sequelize.BOOLEAN,
            is_archive: Sequelize.BOOLEAN,
            is_media: Sequelize.BOOLEAN,
            is_source: Sequelize.BOOLEAN,
            is_script: Sequelize.BOOLEAN,
            packages_type: AboutCodeDB.jsonDataType("packages_type"),
            packages_packaging: AboutCodeDB.jsonDataType("packages_packaging"),
            packages_primary_language: AboutCodeDB.jsonDataType("packages_primary_language")
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
    static flattenData(file) {
        return {
            path: file.path,
            parent: AboutCodeDB.parent(file.path),
            copyright_statements: AboutCodeDB.getValues(file.copyrights, "statements"),
            copyright_holders: AboutCodeDB.getValues(file.copyrights, "holders"),
            copyright_authors: AboutCodeDB.getValues(file.copyrights, "authors"),
            copyright_start_line: AboutCodeDB.getValues(file.copyrights, "start_line"),
            copyright_end_line: AboutCodeDB.getValues(file.copyrights, "end_line"),
            license_key: AboutCodeDB.getValues(file.licenses, "key"),
            license_score: AboutCodeDB.getValues(file.licenses, "score"),
            license_short_name: AboutCodeDB.getValues(file.licenses, "short_name"),
            license_category: AboutCodeDB.getValues(file.licenses, "category"),
            license_owner: AboutCodeDB.getValues(file.licenses, "owner"),
            license_homepage_url: AboutCodeDB.getValues(file.licenses, "homepage_url"),
            license_text_url: AboutCodeDB.getValues(file.licenses, "text_url"),
            license_djc_url: AboutCodeDB.getValues(file.licenses, "dejacode_url"),
            license_spdx_key: AboutCodeDB.getValues(file.licenses, "spdx_license_key"),
            license_start_line: AboutCodeDB.getValues(file.licenses, "start_line"),
            license_end_line: AboutCodeDB.getValues(file.licenses, "end_line"),
            email: AboutCodeDB.getValues(file.emails, "email"),
            email_start_line: AboutCodeDB.getValues(file.emails, "start_line"),
            email_end_line: AboutCodeDB.getValues(file.emails, "end_line"),
            url: AboutCodeDB.getValues(file.urls, "url"),
            url_start_line: AboutCodeDB.getValues(file.urls, "start_line"),
            url_end_line: AboutCodeDB.getValues(file.urls, "end_line"),
            type: file.type,
            name: file.name,
            extension: file.extension,
            date: file.date,
            size: file.size,
            sha1: file.sha1,
            md5: file.md5,
            file_count: file.files_count,
            mime_type: file.mime_type,
            file_type: file.file_type,
            programming_language: file.programming_language,
            is_binary: file.is_binary,
            is_text: file.is_text,
            is_archive: file.is_archive,
            is_media: file.is_media,
            is_source: file.is_source,
            is_script: file.is_script,
            packages_type: AboutCodeDB.getValues(file.packages, "type"),
            packages_packaging: AboutCodeDB.getValues(file.packages, "packaging"),
            packages_primary_language: AboutCodeDB.getValues(file.packages,
                "primary_language")
        }
    }

    static parent(path) {
        let splits = path.split("/");
        return splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
    }

    // [{key: val0}, {key: val1}] => [val0, val1]
    static getValues(array, key) {
        return $.map(array ? array : [], (elem, i) => {
            return [elem[key] ? elem[key] : []];
        });
    }
}

module.exports = AboutCodeDB;