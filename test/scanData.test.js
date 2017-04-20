const jsdom = require("jsdom");
const window = jsdom.jsdom().defaultView;
const $ = require("jquery")(window);
global.$ = $;
const ScanData = require("../assets/js/scandata");
const AboutCodeDB = require("../assets/js/aboutCodeDB");

const assert = require("chai").assert;
const fs = require("fs");

describe("getScanData", function () {
    it("should return an array", function () {
        var json = JSON.parse(fs.readFileSync(__dirname + "/data/scandata.json", "utf8"));
        assert.isArray(json.files, "did not return an array");
        assert.lengthOf(json.files, 3, "did not return 3 items");
        var scandata = new ScanData(json);
        assert.isArray(scandata.json.files, "did not return an array");
    })
});

describe("getComponentDataFormat", function () {
    var expectedComponent = [
        {
            "review_status": "analyzed",
            "name": "zlib",
            "version": "",
            "licenses": [
                {
                    "short_name": "ZLIB License",
                    "key": "zlib"
                }
            ],
            "copyrights": [ "Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler" ],
            "party": "zlib",
            "notes": "",
            "files": [{"path": "samples/zlib"}]
        },
        {
            "review_status": "analyzed",
            "name": "JGroups",
            "version": "",
            "licenses": [
                {
                    "short_name": "LGPL 2.1 or later",
                    "key": "lgpl-2.1"
                }
            ],
            "copyrights": [ "Copyright 2006 Red Hat, Inc." ],
            "party": "JBoss Community",
            "notes": "",
            "files":[{"path":"samples/JGroups"}]
        }
    ];
    it("should return created component", function () {
        var json = JSON.parse(fs.readFileSync(__dirname + "/data/scandata_and_conclusions.json", "utf8"));
        var scandata = new ScanData(json);
        assert.deepEqual(scandata.json.components, expectedComponent);
    })
});

describe("setComponent", function () {
    var components = [
        {
            "review_status": "analyzed",
            "name": "zlib",
            "version": "",
            "licenses": [
                {
                    "short_name": "ZLIB License",
                    "key": "zlib"
                }
            ],
            "copyrights": [ "Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler" ],
            "party": "zlib",
            "notes": "",
            files: [{path: 'samples/zlib'}]
        },
        {
            "review_status": "analyzed",
            "name": "JGroups",
            "version": "",
            "licenses": [
                {
                    "short_name": "LGPL 2.1 or later",
                    "key": "lgpl-2.1"
                }
            ],
            "copyrights": [ "Copyright 2006 Red Hat, Inc." ],
            "party": "JBoss Community",
            "notes": "",
            files: [{path: 'samples/JGroups'}]
        }
    ];

    it("should save components in the scandata object", function () {
        var scandata = new ScanData({files: []});
        scandata.setComponent('samples/zlib', components[0]);
        assert.deepEqual(scandata.getComponent('samples/zlib'), components[0]);
        scandata.setComponent('samples/JGroups', components[1]);
        assert.deepEqual(scandata.getComponent('samples/JGroups'), components[1]);
        assert.deepEqual(scandata.components(), components);
    })

});

describe("testSavingAndLoading", function () {
    var loadComponentFormat = {
        'samples/nexB': {
            review_status: 'original',
            name: 'scancode',
            version: '1.0',
            licenses: [ 'nexB Proprietary', 'ZLIB License' ],
            copyrights: [ 'Copyright (c) 2016 nexB, Inc.' ],
            party: [ 'nexB' ],
            programming_language: '',
            notes: ''
        }
    }

    // The saved format is the same as above, except with the path as a key
    var savedComponentFormat = [{
        files: [{path: 'samples/nexB'}],
        review_status: 'original',
        name: 'scancode',
        version: '1.0',
        licenses: [
            {
                "key": "nexb proprietary",
                "short_name": "nexB Proprietary"
            },
            {
                "short_name": "ZLIB License",
                "key": "zlib license"
            }
        ],
        copyrights: [ 'Copyright (c) 2016 nexB, Inc.' ],
        party: [ 'nexB' ],
        programming_language: '',
        notes: '',
        license_expression: "nexb proprietary and zlib license"
    }]

    describe("toSaveFormat", function () {
        it("should save scan data and components in array format", function () {
            var scandata = new ScanData({
                files: []
            });
            assert.deepEqual(scandata.toSaveFormat(), {
                files: [],
                components: []
            });

            scandata.setComponent('samples/nexB', loadComponentFormat['samples/nexB']);
            assert.deepEqual(scandata.toSaveFormat(), {
                files: [],
                components: savedComponentFormat
            });
        })
    })

    describe("toLoadFormat", function () {
        it("should load scan data and components in array format", function () {
            var scandata = new ScanData({
                results: []
            });
            assert.deepEqual(scandata.toLoadFormat(savedComponentFormat), loadComponentFormat);
        })
    })
});

describe("checkAboutCodeDB", function() {
    const scanCodeJSONResults =   {
        "files": [
            {
              "path": "samples/README",
              "type": "file",
              "name": "README",
              "extension": "",
              "date": "2017-04-08",
              "size": 236,
              "sha1": "2e07e32c52d607204fad196052d70e3d18fb8636",
              "md5": "effc6856ef85a9250fb1a470792b3f38",
              "files_count": 1,
              "mime_type": "text/plain",
              "file_type": "ASCII text",
              "programming_language": "text",
              "is_binary": false,
              "is_text": true,
              "is_archive": false,
              "is_media": false,
              "is_source": false,
              "is_script": false,
              "licenses": [
                {
                  "key": "jboss-eula",
                  "score": 100,
                  "short_name": "JBoss EULA",
                  "category": "Proprietary Free",
                  "owner": "JBoss Community",
                  "homepage_url": "",
                  "text_url": "http://repository.jboss.org/licenses/jbossorg-eula.txt",
                  "dejacode_url": "https://enterprise.dejacode.com/urn/urn:dje:license:jboss-eula",
                  "spdx_license_key": "",
                  "spdx_url": "",
                  "start_line": 3,
                  "end_line": 108,
                  "matched_rule": {
                    "identifier": "jboss-eula.LICENSE",
                    "license_choice": false,
                    "licenses": [
                      "jboss-eula"
                    ]
                  }
                }
              ],
              "copyrights": [
                {
                  "statements": [
                    "Copyright (c) 1991, 1999 Free Software Foundation, Inc."
                  ],
                  "holders": [
                    "Free Software Foundation, Inc."
                  ],
                  "authors": [],
                  "start_line": 4,
                  "end_line": 7
                },
                {
                  "statements": [
                    "copyrighted by the Free Software Foundation"
                  ],
                  "holders": [
                    "Free Software Foundation"
                  ],
                  "authors": [],
                  "start_line": 426,
                  "end_line": 433
                }
              ],
              "packages": [
                  {
                      "type": "plain tarball",
                      "name": null,
                      "version": null,
                      "primary_language": null,
                      "packaging": "archive",
                      "summary": null,
                      "description": null,
                      "payload_type": null,
                      "authors": [],
                      "maintainers": [],
                      "contributors": [],
                      "owners": [],
                      "packagers": [],
                      "distributors": [],
                      "vendors": [],
                      "keywords": [],
                      "keywords_doc_url": null,
                      "metafile_locations": [],
                      "metafile_urls": [],
                      "homepage_url": null,
                      "notes": null,
                      "download_urls": [],
                      "download_sha1": null,
                      "download_sha256": null,
                      "download_md5": null,
                      "bug_tracking_url": null,
                      "support_contacts": [],
                      "code_view_url": null,
                      "vcs_tool": null,
                      "vcs_repository": null,
                      "vcs_revision": null,
                      "copyright_top_level": null,
                      "copyrights": [],
                      "asserted_licenses": [],
                      "legal_file_locations": [],
                      "license_expression": null,
                      "license_texts": [],
                      "notice_texts": [],
                      "dependencies": {},
                      "related_packages": []
                  }
              ],
              "emails": [
                  {
                      "email": "apache@apache.org",
                      "start_line": 29,
                      "end_line": 29
                  }
              ],
              "urls": [
                {
                  "url": "http://zlib.net/zlib-1.2.8.tar.gz",
                  "start_line": 3,
                  "end_line": 3
                },
                {
                  "url": "http://master.dl.sourceforge.net/project/javagroups/JGroups/2.10.0.GA/JGroups-2.10.0.GA.src.zip",
                  "start_line": 4,
                  "end_line": 4
                }
              ]
            }]
    };

    it("should add rows to database", function () {
        let aboutCodeDB = new AboutCodeDB();

        return aboutCodeDB.db
            .then(() => aboutCodeDB.File.count())
            .then((rowCount) => assert.strictEqual(rowCount, 0))
            .then(() => aboutCodeDB.addRows(scanCodeJSONResults))
            .then(() => aboutCodeDB.File.count())
            .then((rowCount) => assert.strictEqual(rowCount, 1))
            .then(() => aboutCodeDB.License.count())
            .then((licenseCount) => assert.strictEqual(licenseCount,1))
            .then(() => aboutCodeDB.Copyright.count())
            .then((copyrightCount) => assert.strictEqual(copyrightCount, 2))
            .then(() => aboutCodeDB.Package.count())
            .then((packageCount) => assert.strictEqual(packageCount, 1))
            .then(() => aboutCodeDB.Email.count())
            .then((emailCount) => assert.strictEqual(emailCount, 1))
            .then(() => aboutCodeDB.Url.count())
            .then((urlCount) => assert.strictEqual(urlCount, 2))
    });
});