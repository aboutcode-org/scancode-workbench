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
        this.ScanCode = AboutCodeDB.scanCodeModel(this.sequelize);
        this.File = AboutCodeDB.fileModel(this.sequelize);
        this.License = AboutCodeDB.licenseModel(this.sequelize);
        this.Copyright = AboutCodeDB.copyrightModel(this.sequelize);
        this.Package = AboutCodeDB.packageModel(this.sequelize);
        this.Email = AboutCodeDB.emailModel(this.sequelize);
        this.Url = AboutCodeDB.urlModel(this.sequelize);

        // Component table is for creating custom components.
        this.Component = AboutCodeDB.componentModel(this.sequelize);

        // Relations
        this.ScanCode.hasMany(this.File);
        this.File.hasMany(this.License);
        this.File.hasMany(this.Copyright);
        this.File.hasMany(this.Package);
        this.File.hasMany(this.Email);
        this.File.hasMany(this.Url);
        this.File.hasOne(this.Component);

        // Include Array for queries
        this.fileIncludes = [
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

    // Uses findAll to return JSTree format from the File Table
    findAllJSTree(query) {
        return this.db
            .then(() => {
                return this.File.findAll($.extend(query, {
                    attributes: ["path", "parent", "name", "type"]
                }));
            })
            .then((files) => {
                return files.map((file) => {
                    return {
                        id: file.path,
                        text: file.name,
                        parent: file.parent,
                        type: file.type,
                        children: file.type === "directory"
                    };
                });
            });
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
        query = $.extend(query, { include: this.fileIncludes });
        return this.db.then(() => this.File.findOne(query));
    }

    // Uses the files table to do a findAll query
    findAll(query) {
        query = $.extend(query, { include: this.fileIncludes });
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
            .then((files) => {
                let chain = Promise.resolve();
                const fileCount = json.files.length;
                const chunkCount = 1000;

                // Loop over each chunk and bulkCreate the rows. We separate
                // into chunks to reduce memory allocations and allow GC.
                for (let i = 0; i < fileCount; i += chunkCount) {
                    // Ending index of chunk
                    const j = Math.min(fileCount, i + chunkCount);
                    chain = chain.then(() => {
                        // Technically, this Promise isn't needed for
                        // correctness but solves a memory leak (Issue #100)
                        return new Promise((resolve, reject) => {
                            this.FlattenedFile.bulkCreate(files.slice(i, j), {
                                logging: false
                            })
                            .then(() => {
                                resolve();
                                console.log("Add FlattenedRows Progress: "
                                    + Math.round(j/fileCount*100) + "%");
                            })
                            .catch((e) => reject(e));
                        });
                    });
                }
                return chain;
            })
            .catch((err) => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    err.message = AboutCodeDB.getDuplicatePathsErrorMessage(json.files);
                }
                throw err;
            });
    }

    //  Adds rows to the ScanCode and File table
    addScanData(json) {
        if (!json) {
            return this.db;
        }

        // Add all rows to the non-flattened DB
        return this.db
            .then(() => {
                return this.ScanCode.create(json);
            })
            .then((scancode) => {
                return json.files.map((file) => {
                    file.parent = AboutCodeDB.parent(file.path);
                    file.scancodeId = scancode.id;
                    return file;
                });
            })
            .then((files) => {
                let chain = Promise.resolve();
                const fileCount = files.length;
                for (let i = 0; i < fileCount; i++) {
                    chain = chain.then(() => {
                        // Technically, this Promise isn't needed for
                        // correctness but solves a memory leak (Issue #100)
                        return new Promise((resolve, reject) => {
                            this.File.create(files[i],
                                {
                                    logging: false,
                                    include: this.fileIncludes
                                })
                                .then(() => {
                                    resolve();
                                    if (i % 1000 === 0) {
                                        console.log("Add Rows Progress: "
                                            + Math.round(i/fileCount*100) + "%");
                                    }
                                })
                                .catch((e) => reject(e));
                        });
                    });
                }
                return chain;
            })
            .catch((err) => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    err.message = AboutCodeDB.getDuplicatePathsErrorMessage(json.files);
                }
                throw err;
            });
    }

    getFileCount() {
        return this.db
            .then(() => {
                return this.ScanCode.findOne({
                    attributes: ["files_count"]
                })
            })
            .then((count) => {
                return count.files_count;
            });
    }

    // ScanCode Scan Details Model definitions
    static scanCodeModel(sequelize) {
        return sequelize.define("scancode", {
            scancode_notice: Sequelize.STRING,
            scancode_version: Sequelize.STRING,
            scancode_options: AboutCodeDB.jsonDataType('scancode_options'),
            files_count: Sequelize.INTEGER
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
            end_line: Sequelize.INTEGER,
            matched_rule: AboutCodeDB.jsonDataType("matched_rule")
        });
    }

    // Copyright Model definitions
    static copyrightModel(sequelize) {
        return sequelize.define("copyrights", {
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER,
            holders: AboutCodeDB.jsonDataType("holders"),
            authors: AboutCodeDB.jsonDataType("authors"),
            statements: AboutCodeDB.jsonDataType("statements")
        });
    }

    // Package Model definitions
    static packageModel(sequelize) {
        return sequelize.define("packages", {
            type: Sequelize.STRING,
            name: Sequelize.STRING,
            version: Sequelize.STRING,
            primary_language: Sequelize.STRING,
            packaging: Sequelize.STRING,
            summary: Sequelize.STRING,
            description: Sequelize.STRING,
            payload_type: Sequelize.STRING,
            size: Sequelize.INTEGER,
            release_date: Sequelize.STRING,
            authors: AboutCodeDB.jsonDataType("authors"),
            maintainers: AboutCodeDB.jsonDataType("maintainers"),
            contributors: AboutCodeDB.jsonDataType("contributors"),
            owners: AboutCodeDB.jsonDataType("owners"),
            packagers: AboutCodeDB.jsonDataType("packagers"),
            distributors: AboutCodeDB.jsonDataType("distributors"),
            vendors: AboutCodeDB.jsonDataType("vendors"),
            keywords: AboutCodeDB.jsonDataType("keywords"),
            keywords_doc_url: Sequelize.STRING,
            metafile_locations: AboutCodeDB.jsonDataType("metafile_locations"),
            metafile_urls: AboutCodeDB.jsonDataType("metafile_urls"),
            homepage_url: Sequelize.STRING,
            notes: Sequelize.STRING,
            download_urls: AboutCodeDB.jsonDataType("download_urls"),
            download_sha1: Sequelize.STRING,
            download_sha256: Sequelize.STRING,
            download_md5: Sequelize.STRING,
            bug_tracking_url: Sequelize.STRING,
            support_contacts: AboutCodeDB.jsonDataType("support_contacts"),
            code_view_url: Sequelize.STRING,
            vcs_tool: Sequelize.STRING,
            vcs_repository: Sequelize.STRING,
            vcs_revision: Sequelize.STRING,
            copyright_top_level: Sequelize.STRING,
            copyrights: AboutCodeDB.jsonDataType("copyrights"),
            asserted_licenses: AboutCodeDB.jsonDataType("asserted_licenses"),
            legal_file_locations: AboutCodeDB.jsonDataType("legal_file_locations"),
            license_expression: Sequelize.STRING,
            license_texts: AboutCodeDB.jsonDataType("license_texts"),
            notice_texts: AboutCodeDB.jsonDataType("notice_texts"),
            dependencies: AboutCodeDB.jsonDataType("dependencies"),
            related_packages: AboutCodeDB.jsonDataType("related_packages")
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
            license_matched_rule: AboutCodeDB.jsonDataType("license_matched_rule"),
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
            programming_language: {type: Sequelize.STRING, defaultValue: ""},
            is_binary: Sequelize.BOOLEAN,
            is_text: Sequelize.BOOLEAN,
            is_archive: Sequelize.BOOLEAN,
            is_media: Sequelize.BOOLEAN,
            is_source: Sequelize.BOOLEAN,
            is_script: Sequelize.BOOLEAN,
            packages_type: AboutCodeDB.jsonDataType("packages_type"),
            packages_name: AboutCodeDB.jsonDataType("packages_name"),
            packages_version: AboutCodeDB.jsonDataType("packages_version"),
            packages_primary_language: AboutCodeDB.jsonDataType("packages_primary_language"),
            packages_packaging: AboutCodeDB.jsonDataType("packages_packaging"),
            packages_summary: AboutCodeDB.jsonDataType( "packages_summary"),
            packages_description: AboutCodeDB.jsonDataType( "packages_description"),
            packages_payload_type: AboutCodeDB.jsonDataType( "packages_payload_type"),
            packages_size: AboutCodeDB.jsonDataType( "packages_size"),
            packages_release_date: AboutCodeDB.jsonDataType( "packages_release_date"),
            packages_authors_type: AboutCodeDB.jsonDataType( "packages_authors_type"),
            packages_authors_name: AboutCodeDB.jsonDataType( "packages_authors_name"),
            packages_authors_email: AboutCodeDB.jsonDataType( "packages_authors_email"),
            packages_authors_url: AboutCodeDB.jsonDataType( "packages_authors_url"),
            packages_maintainers_type: AboutCodeDB.jsonDataType( "packages_maintainers_type"),
            packages_maintainers_name: AboutCodeDB.jsonDataType( "packages_maintainers_name"),
            packages_maintainers_email: AboutCodeDB.jsonDataType( "packages_maintainers_email"),
            packages_maintainers_url: AboutCodeDB.jsonDataType( "packages_maintainers_url"),
            packages_contributors_type: AboutCodeDB.jsonDataType( "packages_contributors_type"),
            packages_contributors_name: AboutCodeDB.jsonDataType( "packages_contributors_name"),
            packages_contributors_email: AboutCodeDB.jsonDataType( "packages_contributors_email"),
            packages_contributors_url: AboutCodeDB.jsonDataType( "packages_contributors_url"),
            packages_owners_type: AboutCodeDB.jsonDataType( "packages_owners_type"),
            packages_owners_name: AboutCodeDB.jsonDataType( "packages_owners_name"),
            packages_owners_email: AboutCodeDB.jsonDataType( "packages_owners_email"),
            packages_owners_url: AboutCodeDB.jsonDataType( "packages_owners_url"),
            packages_packagers_type: AboutCodeDB.jsonDataType( "packages_packagers_type"),
            packages_packagers_name: AboutCodeDB.jsonDataType( "packages_packagers_name"),
            packages_packagers_email: AboutCodeDB.jsonDataType( "packages_packagers_email"),
            packages_packagers_url: AboutCodeDB.jsonDataType( "packages_packagers_url"),
            packages_distributors_type: AboutCodeDB.jsonDataType( "packages_distributors_type"),
            packages_distributors_name: AboutCodeDB.jsonDataType( "packages_distributors_name"),
            packages_distributors_email: AboutCodeDB.jsonDataType( "packages_distributors_email"),
            packages_distributors_url: AboutCodeDB.jsonDataType( "packages_distributors_url"),
            packages_vendors_type: AboutCodeDB.jsonDataType( "packages_vendors_type"),
            packages_vendors_name: AboutCodeDB.jsonDataType( "packages_vendors_name"),
            packages_vendors_email: AboutCodeDB.jsonDataType( "packages_vendors_email"),
            packages_vendors_url: AboutCodeDB.jsonDataType( "packages_vendors_url"),
            packages_keywords: AboutCodeDB.jsonDataType( "packages_keywords"),
            packages_keywords_doc_url: AboutCodeDB.jsonDataType( "packages_keywords_doc_url"),
            packages_metafile_locations: AboutCodeDB.jsonDataType( "packages_metafile_locations"),
            packages_metafile_urls: AboutCodeDB.jsonDataType( "packages_metafile_urls"),
            packages_homepage_url: AboutCodeDB.jsonDataType( "packages_homepage_url"),
            packages_notes: AboutCodeDB.jsonDataType( "packages_notes"),
            packages_download_urls: AboutCodeDB.jsonDataType( "packages_download_urls"),
            packages_download_sha1: AboutCodeDB.jsonDataType( "packages_download_sha1"),
            packages_download_sha256: AboutCodeDB.jsonDataType( "packages_download_sha256"),
            packages_download_md5: AboutCodeDB.jsonDataType( "packages_download_md5"),
            packages_bug_tracking_url: AboutCodeDB.jsonDataType( "packages_bug_tracking_url"),
            packages_support_contacts: AboutCodeDB.jsonDataType( "packages_support_contacts"),
            packages_code_view_url: AboutCodeDB.jsonDataType( "packages_code_view_url"),
            packages_vcs_tool: AboutCodeDB.jsonDataType( "packages_vcs_tool"),
            packages_vcs_repository: AboutCodeDB.jsonDataType( "packages_vcs_repository"),
            packages_vcs_revision: AboutCodeDB.jsonDataType( "packages_vcs_revision"),
            packages_copyright_top_level: AboutCodeDB.jsonDataType( "packages_copyright_top_level"),
            packages_copyrights: AboutCodeDB.jsonDataType( "packages_copyrights"),
            packages_asserted_licenses_license: AboutCodeDB.jsonDataType( "packages_asserted_licenses_license"),
            packages_asserted_licenses_url: AboutCodeDB.jsonDataType( "packages_asserted_licenses_url"),
            packages_asserted_licenses_text: AboutCodeDB.jsonDataType( "packages_asserted_licenses_text"),
            packages_asserted_licenses_notice: AboutCodeDB.jsonDataType( "packages_asserted_licenses_notice"),
            packages_legal_file_locations: AboutCodeDB.jsonDataType( "packages_legal_file_locations"),
            packages_license_expression: AboutCodeDB.jsonDataType( "packages_license_expression"),
            packages_license_texts: AboutCodeDB.jsonDataType( "packages_license_texts"),
            packages_notice_texts: AboutCodeDB.jsonDataType( "packages_notice_texts"),
            packages_dependencies: AboutCodeDB.jsonDataType( "packages_dependencies"),
            packages_related_packages_type: AboutCodeDB.jsonDataType( "packages_related_packages_type"),
            packages_related_packages_name: AboutCodeDB.jsonDataType( "packages_related_packages_name"),
            packages_related_packages_version: AboutCodeDB.jsonDataType( "packages_related_packages_version"),
            packages_related_packages_payload_type: AboutCodeDB.jsonDataType( "packages_related_packages_payload_type")
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
            license_matched_rule: AboutCodeDB.getValues(file.licenses, "matched_rule"),
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
            packages_name: AboutCodeDB.getValues(file.packages, "name"),
            packages_version: AboutCodeDB.getValues(file.packages, "version"),
            packages_primary_language: AboutCodeDB.getValues(file.packages, "primary_language"),
            packages_packaging: AboutCodeDB.getValues(file.packages, "packaging"),
            packages_summary: AboutCodeDB.getValues(file.packages, "summary"),
            packages_description: AboutCodeDB.getValues(file.packages, "description"),
            packages_payload_type: AboutCodeDB.getValues(file.packages, "payload_type"),
            packages_size: AboutCodeDB.getValues(file.packages, "size"),
            packages_release_date: AboutCodeDB.getValues(file.packages, "release_date"),
            packages_authors_type: AboutCodeDB.getNestedValues(file.packages, "authors", "type"),
            packages_authors_name: AboutCodeDB.getNestedValues(file.packages, "authors", "name"),
            packages_authors_email: AboutCodeDB.getNestedValues(file.packages, "authors", "email"),
            packages_authors_url: AboutCodeDB.getNestedValues(file.packages, "authors", "url"),
            packages_maintainers_type: AboutCodeDB.getNestedValues(file.packages, "maintainers", "type"),
            packages_maintainers_name: AboutCodeDB.getNestedValues(file.packages, "maintainers", "name"),
            packages_maintainers_email: AboutCodeDB.getNestedValues(file.packages, "maintainers", "email"),
            packages_maintainers_url: AboutCodeDB.getNestedValues(file.packages, "maintainers", "url"),
            packages_contributors_type: AboutCodeDB.getNestedValues(file.packages, "contributors", "type"),
            packages_contributors_name: AboutCodeDB.getNestedValues(file.packages, "contributors", "name"),
            packages_contributors_email: AboutCodeDB.getNestedValues(file.packages, "contributors", "email"),
            packages_contributors_url: AboutCodeDB.getNestedValues(file.packages, "contributors", "url"),
            packages_owners_type: AboutCodeDB.getNestedValues(file.packages, "owners", "type"),
            packages_owners_name: AboutCodeDB.getNestedValues(file.packages, "owners", "name"),
            packages_owners_email: AboutCodeDB.getNestedValues(file.packages, "owners", "email"),
            packages_owners_url: AboutCodeDB.getNestedValues(file.packages, "owners", "url"),
            packages_packagers_type: AboutCodeDB.getNestedValues(file.packages, "packagers", "type"),
            packages_packagers_name: AboutCodeDB.getNestedValues(file.packages, "packagers", "name"),
            packages_packagers_email: AboutCodeDB.getNestedValues(file.packages, "packagers", "email"),
            packages_packagers_url: AboutCodeDB.getNestedValues(file.packages, "packagers", "url"),
            packages_distributors_type: AboutCodeDB.getNestedValues(file.packages, "distributors", "type"),
            packages_distributors_name: AboutCodeDB.getNestedValues(file.packages, "distributors", "name"),
            packages_distributors_email: AboutCodeDB.getNestedValues(file.packages, "distributors", "email"),
            packages_distributors_url: AboutCodeDB.getNestedValues(file.packages, "distributors", "url"),
            packages_vendors_type: AboutCodeDB.getNestedValues(file.packages, "vendors", "type"),
            packages_vendors_name: AboutCodeDB.getNestedValues(file.packages, "vendors", "name"),
            packages_vendors_email: AboutCodeDB.getNestedValues(file.packages, "vendors", "email"),
            packages_vendors_url: AboutCodeDB.getNestedValues(file.packages, "vendors", "url"),
            packages_keywords: AboutCodeDB.getValues(file.packages, "keywords"),
            packages_keywords_doc_url: AboutCodeDB.getValues(file.packages, "keywords_doc_url"),
            packages_metafile_locations: AboutCodeDB.getValues(file.packages, "metafile_locations"),
            packages_metafile_urls: AboutCodeDB.getValues(file.packages, "metafile_urls"),
            packages_homepage_url: AboutCodeDB.getValues(file.packages, "homepage_url"),
            packages_notes: AboutCodeDB.getValues(file.packages, "notes"),
            packages_download_urls: AboutCodeDB.getValues(file.packages, "download_urls"),
            packages_download_sha1: AboutCodeDB.getValues(file.packages, "download_sha1"),
            packages_download_sha256: AboutCodeDB.getValues(file.packages, "download_sha256"),
            packages_download_md5: AboutCodeDB.getValues(file.packages, "download_md5"),
            packages_bug_tracking_url: AboutCodeDB.getValues(file.packages, "bug_tracking_url"),
            packages_support_contacts: AboutCodeDB.getValues(file.packages, "support_contacts"),
            packages_code_view_url: AboutCodeDB.getValues(file.packages, "code_view_url"),
            packages_vcs_tool: AboutCodeDB.getValues(file.packages, "vcs_tool"),
            packages_vcs_repository: AboutCodeDB.getValues(file.packages, "vcs_repository"),
            packages_vcs_revision: AboutCodeDB.getValues(file.packages, "vcs_revision"),
            packages_copyright_top_level: AboutCodeDB.getValues(file.packages, "copyright_top_level"),
            packages_copyrights: AboutCodeDB.getValues(file.packages, "copyrights"),
            packages_asserted_licenses_license: AboutCodeDB.getNestedValues(file.packages, "asserted_licenses", "license"),
            packages_asserted_licenses_url: AboutCodeDB.getNestedValues(file.packages, "asserted_licenses", "url"),
            packages_asserted_licenses_text: AboutCodeDB.getNestedValues(file.packages, "asserted_licenses", "text"),
            packages_asserted_licenses_notice: AboutCodeDB.getNestedValues(file.packages, "asserted_licenses", "notice"),
            packages_legal_file_locations: AboutCodeDB.getValues(file.packages, "legal_file_locations"),
            packages_license_expression: AboutCodeDB.getValues(file.packages, "license_expression"),
            packages_license_texts: AboutCodeDB.getValues(file.packages, "license_texts"),
            packages_notice_texts: AboutCodeDB.getValues(file.packages, "notice_texts"),
            packages_dependencies: AboutCodeDB.getValues(file.packages, "dependencies"),
            packages_related_packages_type: AboutCodeDB.getNestedValues(file.packages, "related_packages", "type"),
            packages_related_packages_name: AboutCodeDB.getNestedValues(file.packages, "related_packages", "name"),
            packages_related_packages_version: AboutCodeDB.getNestedValues(file.packages, "related_packages", "version"),
            packages_related_packages_payload_type: AboutCodeDB.getNestedValues(file.packages, "related_packages", "payload_type")
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

    // [{key: [{ nestedKey: val0}], {key: [ nestedKey: val1]}] => [val0, val1]
    static getNestedValues(array, key, nestedKey) {
        return $.map(array ? array : [], (elem, i) => {
            return $.map(elem[key] ? elem[key] : [], (nestedElem, i) => {
                return [nestedElem[nestedKey] ? nestedElem[nestedKey] : []]
            });
        });
    }

    static getDuplicatePathsErrorMessage(files) {
        return "The files in the ScanCode output "
            + "should have unique path values. The following path "
            + "values were not unique:\n"
            + AboutCodeDB.getDuplicatePaths(files);
    }

    // Gets the duplicate paths in a set of files
    static getDuplicatePaths(files) {
        let paths = new Set();
        let duplicatePaths = new Set();
        files.forEach((file) => {
            if (!paths.has(file.path)) {
                paths.add(file.path);
            } else {
                duplicatePaths.add(file.path);
            }
        });

        return Array.from(duplicatePaths).slice(0, 15).join(", \n");
    }
}

module.exports = AboutCodeDB;