var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var $ = require("jquery")(window);
global.$ = $;
var ScanData = require("../assets/js/scandata");
var exportToDejaCode = require("../assets/js/export-to-dejacode");

var assert = require("chai").assert;
var fs = require("fs");

describe("getScanData", function () {
    it("should return an array", function () {
        var json = JSON.parse(fs.readFileSync(__dirname + "/data/scandata.json", "utf8"));
        assert.isArray(json.files, "did not return an array");
        assert.lengthOf(json.files, 3, "did not return 3 items");
        var scandata = new ScanData(json);
        assert.isArray(scandata.json.files, "did not return an array");
    })
});

describe("checkJSTreeDataFormat", function () {
    var expectedJSTreeData = [
        {
            id: 'root',
            text: 'root',
            parent: '#',
            type: 'file',         // TODO: This is a bug that needs to be fixed
            scanData: { path: 'root' }
        },
        {
            id: 'root/dir1',
            text: 'dir1',
            parent: 'root',
            type: 'folder',
            scanData: { path: 'root/dir1/file1' }
        },
        {
            id: 'root/dir1/file1',
            text: 'file1',
            parent: 'root/dir1',
            type: 'file',
            scanData: { path: 'root/dir1/file1' }
        },
        {
            id: 'root/dir1/file2',
            text: 'file2',
            parent: 'root/dir1',
            type: 'file',
            scanData: { path: 'root/dir1/file2' }
        }
    ];

    it("should return the parent child jsTree format", function () {
        var json = JSON.parse(fs.readFileSync(__dirname + "/data/scandata.json", "utf8"));
        var scandata = new ScanData(json);
        assert.deepEqual(scandata.jsTreeData, expectedJSTreeData);
    })
});

describe("checkNodeViewDataFormat", function () {
    var expectedNodeViewData =
        {
            "id": "root",
            "name": "root",
            "parent": "#",
            "children": [
                {
                    "id": "root/dir1",
                    "name": "dir1",
                    "parent": "root",
                    "children": [
                        {
                            "id": "root/dir1/file1",
                            "name": "file1",
                            "parent": "root/dir1",
                            "children": [],
                            "scanData": {
                                "path": "root/dir1/file1"
                            }
                        },
                        {
                            "id": "root/dir1/file2",
                            "name": "file2",
                            "parent": "root/dir1",
                            "children": [],
                            "scanData": {
                                "path": "root/dir1/file2"
                            }
                        }
                    ],
                    "scanData": {
                        "path": "root/dir1/file1"
                    }
                }
            ],
            "scanData": {
                "path": "root"
            }
        }

    it("should return the node view format", function () {
        var json = JSON.parse(fs.readFileSync(__dirname + "/data/scandata.json", "utf8"));
        var scandata = new ScanData(json);
        assert.deepEqual(scandata.nodeViewData[0], expectedNodeViewData);
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

describe("checkToDejaCodeFormat", function () {
    var savedComponentFormat = [
        {
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
            party: { name: 'nexB' },
            programming_language: 'Python',
            homepage_url: 'www.dejacode.com',
            notes: '',
            license_expression: "nexb proprietary and zlib license"
        },
        {
            files: [{path: 'samples/jquery-1.7.2.js'}],
            review_status: 'analyzed',
            name: 'jQuery',
            version: '1.7.2',
            licenses: [
                {
                    "key": "mit",
                    "short_name": "MIT License"
                },
                {
                    "short_name": "GPL 2.0",
                    "key": "gpl-2.0"
                }
            ],
            copyrights: [ 'Copyright 2011, John Resig' ],
            party: { name: 'jQuery Project' },
            programming_language: 'JavaScript',
            homepage_url: 'http://jquery.com/',
            license_expression: "mit or gpl-2.0",
            notes: 'Dual licensed under the MIT or GPL Version 2 licenses.'
        }
    ];

    var expectedDejaCodeFormat = [
        {
            name: 'scancode',
            version: '1.0',
            license_expression: 'nexb proprietary and zlib license',
            owner_name: 'nexB',
            copyright: 'Copyright (c) 2016 nexB, Inc.',
            primary_language: 'Python',
            homepage_url: 'www.dejacode.com',
            reference_notes: ''
        },
        {
            name: 'jQuery',
            version: '1.7.2',
            license_expression: 'mit or gpl-2.0',
            owner_name: 'jQuery Project',
            copyright: 'Copyright 2011, John Resig',
            primary_language: 'JavaScript',
            homepage_url: 'http://jquery.com/',
            reference_notes: 'Dual licensed under the MIT or GPL Version 2 licenses.'
        }
    ];

    it("should return the JSON format DejaCode expects", function () {
        assert.deepEqual(exportToDejaCode.toDejaCodeFormat(savedComponentFormat), expectedDejaCodeFormat);
    })
});