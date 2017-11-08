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

const fs = require('fs');
const JSONStream = require('JSONStream');

class MissingFileInfoError extends Error {}

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

        // Flattened table is used by the Clues DataTable
        this.FlattenedFile = this.sequelize.define(
            TABLE.FLATTEN_FILE.name,
            TABLE.FLATTEN_FILE.columns, { timestamps: false });

        // Non-flattened tables are for the NodeView
        this.ScanCode = this.sequelize.define(
            TABLE.SCANCODE.name, TABLE.SCANCODE.columns);

        this.File = this.sequelize.define(
            TABLE.FILE.name, TABLE.FILE.columns, { timestamps: false });

        this.License = this.sequelize.define(
            TABLE.LICENSE.name, TABLE.LICENSE.columns, { timestamps: false });

        this.Copyright = this.sequelize.define(
            TABLE.COPYRIGHT.name, TABLE.COPYRIGHT.columns, { timestamps: false });

        this.Package = this.sequelize.define(
            TABLE.PACKAGE.name, TABLE.PACKAGE.columns, { timestamps: false });

        this.Email = this.sequelize.define(
            TABLE.EMAIL.name, TABLE.EMAIL.columns, { timestamps: false });

        this.Url = this.sequelize.define(
            TABLE.URL.name, TABLE.URL.columns, { timestamps: false });

        // Component table is for creating custom components.
        this.Component = this.sequelize.define(
            TABLE.COMPONENT.name,
            TABLE.COMPONENT.columns, {
                getterMethods: {
                    license_expression: function()  {
                        return $.map(this.licenses, (license, index) => {
                           return license.key;
                        }).join(" AND ");
                    },
                    copyright: function() {
                        return $.map(this.copyrights, (copyright, index) => {
                            return copyright.statements.join(" ");
                        }).join("\n");
                    }
                }
            });

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
            { model: this.License, separate: true },
            { model: this.Copyright, separate: true },
            { model: this.Package, separate: true },
            { model: this.Email, separate: true },
            { model: this.Url, separate: true },
            { model: this.Component }
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
    addFromJsonStream(stream) {
        if (!stream) {
            return this.db;
        }

        let scancode = null;
        let promiseChain = this.db;
        let index = 0;
        let rootPath = null;
        let hasRootPath = false;
        const batchSize  = 1000;
        let files = [];
        let progress = 0;

        console.time('Load Database');
        return new Promise((resolve, reject) => {
            let that = this;
            stream
                .pipe(JSONStream.parse('files.*'))
                .on('header', header => {
                    promiseChain = promiseChain
                        .then(() => this.ScanCode.create(header))
                        .then((result) => scancode = result);
                })
                .on('data', function(file) {
                    if (!rootPath) {
                        rootPath = file.path.split("/")[0];
                        // Show error for scans missing file type information
                        if (file.type === undefined) {
                            reject(new MissingFileInfoError());
                        }
                    }
                    if (rootPath === file.path) {
                        hasRootPath = true;
                    }
                    files.push(file);
                    if (files.length >= batchSize) {
                        // Need to set a new variable before handing to promise
                        this.pause();
                        promiseChain = promiseChain
                            .then(() => that._batchCreateFiles(files, scancode.id))
                            .then(() => {
                                index += files.length;
                                const files_count = scancode.files_count;
                                const currProgress = Math.round(index/files_count*100);
                                if (currProgress > progress) {
                                    progress = currProgress;
                                    console.log("Progress: "
                                        + `${progress}% `
                                        + `(${index}/${files_count})`);

                                }
                            })
                            .then(() => {
                                files = [];
                                this.resume();
                            });
                    }
                })
                .on('end', () => {
                    // Add root directory into data
                    // See https://github.com/nexB/scancode-toolkit/issues/543
                    promiseChain
                        .then(() => {
                            if (rootPath && !hasRootPath) {
                                files.push({
                                    path: rootPath,
                                    name: rootPath,
                                    type: "directory",
                                    files_count: scancode.files_count
                                });
                            }
                        })
                        .then(() => this._batchCreateFiles(files, scancode.id))
                        .then(() => {
                            console.timeEnd('Load Database');
                            resolve();
                        }).catch((e) => reject(e));
                })
                .on('error', e => reject(e));
            });
    }

    _batchCreateFiles(files, scancodeId) {
        // Add batched files to the DB
        return this._addFlattenedFiles(files)
            .then(() => this._addFiles(files, scancodeId))
            .catch((err) => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    // FIXME: json.files no longer exists
                    err.message = getDuplicatePathsErrorMessage(files);
                }
                throw err;
            });
    }

    _addFlattenedFiles(files) {
        files = $.map(files, file => flattenData(file));
        return this.FlattenedFile.bulkCreate(files, {logging: false});
    }

    _addFiles(files, scancodeId) {
        let transactionOptions = {
            logging: false,
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        };
        return this.sequelize.transaction(transactionOptions, (t) => {
            let options = {
                logging: false,
                transaction: t
            };
            $.each(files, (i, file) => {
                file.parent = parent(file.path);
                file.scancodeId = scancodeId;
            });
            return this.File.bulkCreate(files, options)
                .then((savedFiles) => {
                    $.each(files, (i, file) => {
                        file.id = savedFiles[i].id;
                    });
                })
                .then(() => {
                    let licenses = $.map(files, file => {
                        return $.map(file.licenses || [], license => {
                            license.fileId = file.id;
                            return license;
                        });
                    });
                    this.License.bulkCreate(licenses || [], options);
                })
                .then(() => {
                    let copyrights = $.map(files, file => {
                        return $.map(file.copyrights || [], copyright => {
                            copyright.fileId = file.id;
                            return copyright;
                        });
                    });
                    this.Copyright.bulkCreate(copyrights || [], options);
                })
                .then(() => {
                    let packages = $.map(files, file => {
                        return $.map(file.packages || [], pkg => {
                            pkg.fileId = file.id;
                            return pkg;
                        });
                    });
                    this.Package.bulkCreate(packages || [], options);
                })
                .then(() => {
                    let emails = $.map(files, file => {
                        return $.map(file.emails || [], email => {
                            email.fileId = file.id;
                            return email;
                        });
                    });
                    this.Email.bulkCreate(emails || [], options);
                })
                .then(() => {
                    let urls = $.map(files, file => {
                        return $.map(file.urls || [], url => {
                            url.fileId = file.id;
                            return url;
                        });
                    });
                    this.Url.bulkCreate(urls || [], options);
                })
                .then(() => {
                    return this.sequelize.Promise.each(files, file => {
                        if (file.component) {
                            return this.Component.create(file.component, options);
                        }
                    });
                });
            });
    }

    getFileCount() {
        return this.db
            .then(() => this.ScanCode.findOne({attributes: ["files_count"]}))
            .then((count) => count ? count.files_count : 0);
    }
}

// Define table names and columns
const TABLE = {
    SCANCODE: {
        name: "scancode",
        columns: {
            scancode_notice: Sequelize.STRING,
            scancode_version: Sequelize.STRING,
            scancode_options: jsonDataType('scancode_options'),
            files_count: Sequelize.INTEGER
        }
    },
    FILE: {
        name: "files",
        columns: {
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
        }
    },
    LICENSE: {
        name: "licenses",
        columns: {
            key: Sequelize.STRING,
            score: Sequelize.INTEGER,
            short_name: Sequelize.STRING,
            category: Sequelize.STRING,
            owner: Sequelize.STRING,
            homepage_url: Sequelize.STRING,
            text_url: Sequelize.STRING,
            reference_url: Sequelize.STRING,
            spdx_license_key: Sequelize.STRING,
            spdx_url: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER,
            matched_rule: jsonDataType("matched_rule")
        }
    },
    COPYRIGHT: {
        name: "copyrights",
        columns: {
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER,
            holders: jsonDataType("holders"),
            authors: jsonDataType("authors"),
            statements: jsonDataType("statements")
        }
    },
    PACKAGE: {
        name: "packages",
        columns: {
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
            authors: jsonDataType("authors"),
            maintainers: jsonDataType("maintainers"),
            contributors: jsonDataType("contributors"),
            owners: jsonDataType("owners"),
            packagers: jsonDataType("packagers"),
            distributors: jsonDataType("distributors"),
            vendors: jsonDataType("vendors"),
            keywords: jsonDataType("keywords"),
            keywords_doc_url: Sequelize.STRING,
            metafile_locations: jsonDataType("metafile_locations"),
            metafile_urls: jsonDataType("metafile_urls"),
            homepage_url: Sequelize.STRING,
            notes: Sequelize.STRING,
            download_urls: jsonDataType("download_urls"),
            download_sha1: Sequelize.STRING,
            download_sha256: Sequelize.STRING,
            download_md5: Sequelize.STRING,
            bug_tracking_url: Sequelize.STRING,
            support_contacts: jsonDataType("support_contacts"),
            code_view_url: Sequelize.STRING,
            vcs_tool: Sequelize.STRING,
            vcs_repository: Sequelize.STRING,
            vcs_revision: Sequelize.STRING,
            copyright_top_level: Sequelize.STRING,
            copyrights: jsonDataType("copyrights"),
            asserted_licenses: jsonDataType("asserted_licenses"),
            legal_file_locations: jsonDataType("legal_file_locations"),
            license_expression: Sequelize.STRING,
            license_texts: jsonDataType("license_texts"),
            notice_texts: jsonDataType("notice_texts"),
            dependencies: jsonDataType("dependencies"),
            related_packages: jsonDataType("related_packages")
        }
    },
    EMAIL: {
        name: "emails",
        columns: {
            email: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER
        }
    },
    URL: {
        name: "urls",
        columns: {
            url: Sequelize.STRING,
            start_line: Sequelize.INTEGER,
            end_line: Sequelize.INTEGER
        }
    },
    COMPONENT: {
        name: "components",
        columns: {
            path: Sequelize.STRING,
            review_status: Sequelize.STRING,
            name: Sequelize.STRING,
            version: Sequelize.STRING,
            licenses: jsonDataType('licenses'),
            copyrights: jsonDataType('copyrights'),
            owner: Sequelize.STRING,
            homepage_url: Sequelize.STRING,
            programming_language: Sequelize.STRING,
            notes: Sequelize.STRING
        }
    },
    FLATTEN_FILE: {
        name: "flattened_file",
        columns: {
            path: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            parent: {type: Sequelize.STRING, defaultValue: ""},
            copyright_statements: jsonDataType("copyright_statements"),
            copyright_holders: jsonDataType("copyright_holders"),
            copyright_authors: jsonDataType("copyright_authors"),
            copyright_start_line: jsonDataType("copyright_start_line"),
            copyright_end_line: jsonDataType("copyright_end_line"),
            license_key: jsonDataType("license_key"),
            license_score: jsonDataType("license_score"),
            license_short_name: jsonDataType("license_short_name"),
            license_category: jsonDataType("license_category"),
            license_owner: jsonDataType("license_owner"),
            license_homepage_url: jsonDataType("license_homepage_url"),
            license_text_url: jsonDataType("license_text_url"),
            license_reference_url: jsonDataType("license_reference_url"),
            license_spdx_key: jsonDataType("license_spdx_key"),
            license_start_line: jsonDataType("license_start_line"),
            license_end_line: jsonDataType("license_end_line"),
            license_matched_rule: jsonDataType("license_matched_rule"),
            email: jsonDataType("email"),
            email_start_line: jsonDataType("email_start_line"),
            email_end_line: jsonDataType("email_end_line"),
            url: jsonDataType("url"),
            url_start_line: jsonDataType("url_start_line"),
            url_end_line: jsonDataType("url_end_line"),
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
            packages_type: jsonDataType("packages_type"),
            packages_name: jsonDataType("packages_name"),
            packages_version: jsonDataType("packages_version"),
            packages_primary_language: jsonDataType("packages_primary_language"),
            packages_packaging: jsonDataType("packages_packaging"),
            packages_summary: jsonDataType( "packages_summary"),
            packages_description: jsonDataType( "packages_description"),
            packages_payload_type: jsonDataType( "packages_payload_type"),
            packages_size: jsonDataType( "packages_size"),
            packages_release_date: jsonDataType( "packages_release_date"),
            packages_authors_type: jsonDataType( "packages_authors_type"),
            packages_authors_name: jsonDataType( "packages_authors_name"),
            packages_authors_email: jsonDataType( "packages_authors_email"),
            packages_authors_url: jsonDataType( "packages_authors_url"),
            packages_maintainers_type: jsonDataType( "packages_maintainers_type"),
            packages_maintainers_name: jsonDataType( "packages_maintainers_name"),
            packages_maintainers_email: jsonDataType( "packages_maintainers_email"),
            packages_maintainers_url: jsonDataType( "packages_maintainers_url"),
            packages_contributors_type: jsonDataType( "packages_contributors_type"),
            packages_contributors_name: jsonDataType( "packages_contributors_name"),
            packages_contributors_email: jsonDataType( "packages_contributors_email"),
            packages_contributors_url: jsonDataType( "packages_contributors_url"),
            packages_owners_type: jsonDataType( "packages_owners_type"),
            packages_owners_name: jsonDataType( "packages_owners_name"),
            packages_owners_email: jsonDataType( "packages_owners_email"),
            packages_owners_url: jsonDataType( "packages_owners_url"),
            packages_packagers_type: jsonDataType( "packages_packagers_type"),
            packages_packagers_name: jsonDataType( "packages_packagers_name"),
            packages_packagers_email: jsonDataType( "packages_packagers_email"),
            packages_packagers_url: jsonDataType( "packages_packagers_url"),
            packages_distributors_type: jsonDataType( "packages_distributors_type"),
            packages_distributors_name: jsonDataType( "packages_distributors_name"),
            packages_distributors_email: jsonDataType( "packages_distributors_email"),
            packages_distributors_url: jsonDataType( "packages_distributors_url"),
            packages_vendors_type: jsonDataType( "packages_vendors_type"),
            packages_vendors_name: jsonDataType( "packages_vendors_name"),
            packages_vendors_email: jsonDataType( "packages_vendors_email"),
            packages_vendors_url: jsonDataType( "packages_vendors_url"),
            packages_keywords: jsonDataType( "packages_keywords"),
            packages_keywords_doc_url: jsonDataType( "packages_keywords_doc_url"),
            packages_metafile_locations: jsonDataType( "packages_metafile_locations"),
            packages_metafile_urls: jsonDataType( "packages_metafile_urls"),
            packages_homepage_url: jsonDataType( "packages_homepage_url"),
            packages_notes: jsonDataType( "packages_notes"),
            packages_download_urls: jsonDataType( "packages_download_urls"),
            packages_download_sha1: jsonDataType( "packages_download_sha1"),
            packages_download_sha256: jsonDataType( "packages_download_sha256"),
            packages_download_md5: jsonDataType( "packages_download_md5"),
            packages_bug_tracking_url: jsonDataType( "packages_bug_tracking_url"),
            packages_support_contacts: jsonDataType( "packages_support_contacts"),
            packages_code_view_url: jsonDataType( "packages_code_view_url"),
            packages_vcs_tool: jsonDataType( "packages_vcs_tool"),
            packages_vcs_repository: jsonDataType( "packages_vcs_repository"),
            packages_vcs_revision: jsonDataType( "packages_vcs_revision"),
            packages_copyright_top_level: jsonDataType( "packages_copyright_top_level"),
            packages_copyrights: jsonDataType( "packages_copyrights"),
            packages_asserted_licenses_license: jsonDataType( "packages_asserted_licenses_license"),
            packages_asserted_licenses_url: jsonDataType( "packages_asserted_licenses_url"),
            packages_asserted_licenses_text: jsonDataType( "packages_asserted_licenses_text"),
            packages_asserted_licenses_notice: jsonDataType( "packages_asserted_licenses_notice"),
            packages_legal_file_locations: jsonDataType( "packages_legal_file_locations"),
            packages_license_expression: jsonDataType( "packages_license_expression"),
            packages_license_texts: jsonDataType( "packages_license_texts"),
            packages_notice_texts: jsonDataType( "packages_notice_texts"),
            packages_dependencies: jsonDataType( "packages_dependencies"),
            packages_related_packages_type: jsonDataType( "packages_related_packages_type"),
            packages_related_packages_name: jsonDataType( "packages_related_packages_name"),
            packages_related_packages_version: jsonDataType( "packages_related_packages_version"),
            packages_related_packages_payload_type: jsonDataType( "packages_related_packages_payload_type")
        }
    }
};

// Flatten ScanCode results data to load into database
function flattenData(file) {
    return {
        path: file.path,
        parent: parent(file.path),
        copyright_statements: getValues(file.copyrights, "statements"),
        copyright_holders: getValues(file.copyrights, "holders"),
        copyright_authors: getValues(file.copyrights, "authors"),
        copyright_start_line: getValues(file.copyrights, "start_line"),
        copyright_end_line: getValues(file.copyrights, "end_line"),
        license_key: getValues(file.licenses, "key"),
        license_score: getValues(file.licenses, "score"),
        license_short_name: getValues(file.licenses, "short_name"),
        license_category: getValues(file.licenses, "category"),
        license_owner: getValues(file.licenses, "owner"),
        license_homepage_url: getValues(file.licenses, "homepage_url"),
        license_text_url: getValues(file.licenses, "text_url"),
        license_reference_url: getValues(file.licenses, "reference_url"),
        license_spdx_key: getValues(file.licenses, "spdx_license_key"),
        license_start_line: getValues(file.licenses, "start_line"),
        license_end_line: getValues(file.licenses, "end_line"),
        license_matched_rule: getValues(file.licenses, "matched_rule"),
        email: getValues(file.emails, "email"),
        email_start_line: getValues(file.emails, "start_line"),
        email_end_line: getValues(file.emails, "end_line"),
        url: getValues(file.urls, "url"),
        url_start_line: getValues(file.urls, "start_line"),
        url_end_line: getValues(file.urls, "end_line"),
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
        packages_type: getValues(file.packages, "type"),
        packages_name: getValues(file.packages, "name"),
        packages_version: getValues(file.packages, "version"),
        packages_primary_language: getValues(file.packages, "primary_language"),
        packages_packaging: getValues(file.packages, "packaging"),
        packages_summary: getValues(file.packages, "summary"),
        packages_description: getValues(file.packages, "description"),
        packages_payload_type: getValues(file.packages, "payload_type"),
        packages_size: getValues(file.packages, "size"),
        packages_release_date: getValues(file.packages, "release_date"),
        packages_authors_type: getNestedValues(file.packages, "authors", "type"),
        packages_authors_name: getNestedValues(file.packages, "authors", "name"),
        packages_authors_email: getNestedValues(file.packages, "authors", "email"),
        packages_authors_url: getNestedValues(file.packages, "authors", "url"),
        packages_maintainers_type: getNestedValues(file.packages, "maintainers", "type"),
        packages_maintainers_name: getNestedValues(file.packages, "maintainers", "name"),
        packages_maintainers_email: getNestedValues(file.packages, "maintainers", "email"),
        packages_maintainers_url: getNestedValues(file.packages, "maintainers", "url"),
        packages_contributors_type: getNestedValues(file.packages, "contributors", "type"),
        packages_contributors_name: getNestedValues(file.packages, "contributors", "name"),
        packages_contributors_email: getNestedValues(file.packages, "contributors", "email"),
        packages_contributors_url: getNestedValues(file.packages, "contributors", "url"),
        packages_owners_type: getNestedValues(file.packages, "owners", "type"),
        packages_owners_name: getNestedValues(file.packages, "owners", "name"),
        packages_owners_email: getNestedValues(file.packages, "owners", "email"),
        packages_owners_url: getNestedValues(file.packages, "owners", "url"),
        packages_packagers_type: getNestedValues(file.packages, "packagers", "type"),
        packages_packagers_name: getNestedValues(file.packages, "packagers", "name"),
        packages_packagers_email: getNestedValues(file.packages, "packagers", "email"),
        packages_packagers_url: getNestedValues(file.packages, "packagers", "url"),
        packages_distributors_type: getNestedValues(file.packages, "distributors", "type"),
        packages_distributors_name: getNestedValues(file.packages, "distributors", "name"),
        packages_distributors_email: getNestedValues(file.packages, "distributors", "email"),
        packages_distributors_url: getNestedValues(file.packages, "distributors", "url"),
        packages_vendors_type: getNestedValues(file.packages, "vendors", "type"),
        packages_vendors_name: getNestedValues(file.packages, "vendors", "name"),
        packages_vendors_email: getNestedValues(file.packages, "vendors", "email"),
        packages_vendors_url: getNestedValues(file.packages, "vendors", "url"),
        packages_keywords: getValues(file.packages, "keywords"),
        packages_keywords_doc_url: getValues(file.packages, "keywords_doc_url"),
        packages_metafile_locations: getValues(file.packages, "metafile_locations"),
        packages_metafile_urls: getValues(file.packages, "metafile_urls"),
        packages_homepage_url: getValues(file.packages, "homepage_url"),
        packages_notes: getValues(file.packages, "notes"),
        packages_download_urls: getValues(file.packages, "download_urls"),
        packages_download_sha1: getValues(file.packages, "download_sha1"),
        packages_download_sha256: getValues(file.packages, "download_sha256"),
        packages_download_md5: getValues(file.packages, "download_md5"),
        packages_bug_tracking_url: getValues(file.packages, "bug_tracking_url"),
        packages_support_contacts: getValues(file.packages, "support_contacts"),
        packages_code_view_url: getValues(file.packages, "code_view_url"),
        packages_vcs_tool: getValues(file.packages, "vcs_tool"),
        packages_vcs_repository: getValues(file.packages, "vcs_repository"),
        packages_vcs_revision: getValues(file.packages, "vcs_revision"),
        packages_copyright_top_level: getValues(file.packages, "copyright_top_level"),
        packages_copyrights: getValues(file.packages, "copyrights"),
        packages_asserted_licenses_license: getNestedValues(file.packages, "asserted_licenses", "license"),
        packages_asserted_licenses_url: getNestedValues(file.packages, "asserted_licenses", "url"),
        packages_asserted_licenses_text: getNestedValues(file.packages, "asserted_licenses", "text"),
        packages_asserted_licenses_notice: getNestedValues(file.packages, "asserted_licenses", "notice"),
        packages_legal_file_locations: getValues(file.packages, "legal_file_locations"),
        packages_license_expression: getValues(file.packages, "license_expression"),
        packages_license_texts: getValues(file.packages, "license_texts"),
        packages_notice_texts: getValues(file.packages, "notice_texts"),
        packages_dependencies: getValues(file.packages, "dependencies"),
        packages_related_packages_type: getNestedValues(file.packages, "related_packages", "type"),
        packages_related_packages_name: getNestedValues(file.packages, "related_packages", "name"),
        packages_related_packages_version: getNestedValues(file.packages, "related_packages", "version"),
        packages_related_packages_payload_type: getNestedValues(file.packages, "related_packages", "payload_type")
    };
}

// Stores an object as a json string internally, but as an object externally
function jsonDataType(attributeName) {
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

function parent(path) {
    let splits = path.split("/");
    return splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
}

// [{key: val0}, {key: val1}] => [val0, val1]
function getValues(array, key) {
    return $.map(array ? array : [], (elem, i) => {
        return [elem[key] ? elem[key] : []];
    });
}

// [{key: [{ nestedKey: val0}], {key: [ nestedKey: val1]}] => [val0, val1]
function getNestedValues(array, key, nestedKey) {
    return $.map(array ? array : [], (elem, i) => {
        return $.map(elem[key] ? elem[key] : [], (nestedElem, i) => {
            return [nestedElem[nestedKey] ? nestedElem[nestedKey] : []]
        });
    });
}

function getDuplicatePathsErrorMessage(files) {
    return "The files in the ScanCode output "
        + "should have unique path values. The following path "
        + "values were not unique:\n"
        + getDuplicatePaths(files);
}

// Gets the duplicate paths in a set of files
function getDuplicatePaths(files) {
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

module.exports = AboutCodeDB;