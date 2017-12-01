/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/aboutcode-manager/
 # The AboutCode Manager software is licensed under the Apache License version 2.0.
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


const jsdom = require("jsdom");
const window = jsdom.jsdom().defaultView;
const $ = require("jquery")(window);
global.$ = $;

const fs = require("fs");
const chai = require('chai');
const assert = chai.assert;
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const AboutCodeDB = require("../assets/app/js/aboutCodeDB");

const SCANCODE_FILE = __dirname + "/data/scancode-results.json";
const FLATTENED_FILE = __dirname + "/data/flattened-scancode-results.json";
const DUPLICATE_PATH_FILE = __dirname + "/data/scancode-duplicate-path-values.json";

describe("checkAboutCodeDB", function() {

    describe("addFromJsonFile", function() {
        it("should add rows to database", function () {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.File.count())
                .then((rowCount) => assert.strictEqual(rowCount, 0))
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.File.count())
                .then((rowCount) => assert.strictEqual(rowCount, 3))
                .then(() => aboutCodeDB.License.count())
                .then((licenseCount) => assert.strictEqual(licenseCount,1))
                .then(() => aboutCodeDB.Copyright.count())
                .then((copyrightCount) => assert.strictEqual(copyrightCount, 2))
                .then(() => aboutCodeDB.Package.count())
                .then((packageCount) => assert.strictEqual(packageCount, 1))
                .then(() => aboutCodeDB.Email.count())
                .then((emailCount) => assert.strictEqual(emailCount, 1))
                .then(() => aboutCodeDB.Url.count())
                .then((urlCount) => assert.strictEqual(urlCount, 2));
        });
    });

    describe("getDuplicatePaths", function() {
        it("should throw SequelizeUniqueConstraintError error for duplicate path", function() {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.addFromJson(DUPLICATE_PATH_FILE))
                .then(() => assert.fail(true, true, "This code should not be called!"))
                .catch((e) => assert.equal(e.name, "SequelizeUniqueConstraintError"));
        });
    });

    describe("findAll", function() {
        const results = JSON.parse(fs.readFileSync(SCANCODE_FILE, "utf8"));
        it("should return all rows", function() {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.findAll({}))
                .then((rows) => {
                    rows = rows.map(row => row.toJSON());
                    assert.containSubset(rows, results.files.splice(1,3));
                });
        });
    });

    describe("findOne", function() {
        const results = JSON.parse(fs.readFileSync(SCANCODE_FILE, "utf8"));
        it("should return one", function() {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.findOne({
                    where: { path: "samples/JGroups/src"}
                }))
                .then((row) => {
                    row = row.toJSON();
                    assert.containSubset(row, results.files[1]);
                });
        });
    });

    describe("findAllJSTree", function() {
        it("should format ScanCode results to jsTree Format", function() {
            let aboutCodeDB = new AboutCodeDB();
            let expectedJSTreeFormat= [
                {
                    id: "samples/README",
                    text: "README",
                    parent: "samples",
                    type: "file",
                    children: false
                },
                {
                    id: "samples/JGroups/src",
                    text: "src",
                    parent: "samples/JGroups",
                    type: "directory",
                    children: true
                },
                {
                    children: true,
                    id: "samples",
                    parent: "#",
                    text: "samples",
                    type: "directory"
                }
            ];

            return aboutCodeDB.db
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.findAllJSTree())
                .then(results => assert.deepEqual(expectedJSTreeFormat, results));
        });
    });

    describe("setComponent", function() {
        it("should create a component in Component Table", function() {
            let aboutCodeDB = new AboutCodeDB();
            let component = {
                "license_expression": "apache-1.1",
                "copyright": "(c) 2004 by Henrik Ravn",
                "licenses": [
                    {
                      "key": "apache-1.1"
                    }
                ],
                "copyrights": [
                    {
                      "statements": [
                        "(c) 2004 by Henrik Ravn"
                      ]
                    }
                ],
                "path": "samples",
                "review_status": "attention",
                "name": "samples",
                "version": "1.0",
                "owner": "Jean-loup Gailly, Brian Raiter",
                "homepage_url": "http://www.jboss.org/",
                "programming_language": "C",
                "notes": ""
            };

            let component2 = {
                "license_expression": "zlib",
                "copyright": "Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler",
                "licenses": [
                {
                  "key": "zlib"
                }
                ],
                "copyrights": [
                {
                  "statements": [
                    "Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler"
                  ]
                }
                ],
                "path": "samples/zlib",
                "review_status": "analyzed",
                "name": "zlib",
                "version": "1.0",
                "owner": "Jean-loup Gailly and Mark Adler",
                "homepage_url": "http://www.zlib.net/",
                "programming_language": "C#",
                "notes": ""
                };

            return aboutCodeDB.db
                .then(() => aboutCodeDB.setComponent(component))
                .then(() => aboutCodeDB.Component.count())
                .then((rowCount) => assert.strictEqual(rowCount, 1))
                .then(() => aboutCodeDB.findComponent({
                    where: { path: "samples"}
                }))
                .then(row => assert.containSubset(row.toJSON(), component))
                .then(() => aboutCodeDB.setComponent(component2))
                .then(() => aboutCodeDB.Component.count())
                .then((rowCount) => assert.strictEqual(rowCount, 2));
        });
    });

    describe("addFlattenedRows", function() {
        const results = JSON.parse(fs.readFileSync(FLATTENED_FILE, "utf8"));
        it("should add rows to the flattened files table", function() {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.FlattenedFile.count())
                .then((rowCount) => assert.strictEqual(rowCount, 0))
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.FlattenedFile.count())
                .then((rowCount) => assert.strictEqual(rowCount, 3))
                .then(() => aboutCodeDB.FlattenedFile.findAll())
                .then((rows) => {
                    rows = rows.map((row) => row.toJSON());
                    assert.containSubset(rows, results);
                });
        });
    });

    describe("getFileCount", function() {
        it("should return the ScanCode files_count", function() {
            let aboutCodeDB = new AboutCodeDB();

            return aboutCodeDB.db
                .then(() => aboutCodeDB.addFromJson(SCANCODE_FILE))
                .then(() => aboutCodeDB.getFileCount())
                .then((value) => {
                    assert.strictEqual(value, 43);
                });
        });
    });
});