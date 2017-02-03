/*
 #
 # Copyright (c) 2016 nexB Inc. and others. All rights reserved.
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

// This class stores the original json scan data, all the added components,
// and handles the formatting for the jstree and the node view formats.


function ScanData(json) {
    // Load json file and other options
    // Save the scan data so it can be used elsewhere in the class
    this.json = json;
    this.jsTreeData = this.toJSTreeFormat(this.files());
    // the node view data takes the jstree data as input because the format is
    // very similar
    this.nodeViewData = this.toNodeViewFormat(this.jsTreeData);
    // Convert components to a dictionary for easy access of key:value
    this.componentsMap = this.toLoadFormat(this.json.components);

    // Convert nodeViewData to a dictionary for easy access of keyvalue
    var map = {};
    if (this.nodeViewData.length > 0) {
        ScanData.forEachNode(this.nodeViewData[0], "children", function (node) {
            map[node.id] = node;
        })
    }
    this.nodeViewDataMap = map;
}

module.exports = ScanData;

// ScanCode data instance functions
ScanData.prototype = {
    // Return original scan files
    files: function () {
        return this.json.files;
    },
    // Return any components made
    components: function () {
        return $.map( this.componentsMap, function( value, key ) {
            return $.extend({}, value, {files: [{path: key}]});
        });
    },
    nodeData: function (path) {
        return this.nodeViewDataMap[path];
    },
    // Gets a component for a scanned path or returns empty default values
    getComponent: function (path) {
        if (path in this.componentsMap) {
            return this.componentsMap[path];
        } else {
            return this.defaultComponent();
        }
    },
    // Sets a component
    setComponent: function (path, component) {
        var defaultComponent = this.defaultComponent();

        if (!('review_status' in component) || component.review_status === null) {
            component.review_status = defaultComponent.review_status;
        }

        if (!('name' in component) || component.name === null) {
            component.name = defaultComponent.name;
        }

        if (!('version' in component) || component.version === null) {
            component.version = defaultComponent.version;
        }

        if (!('licenses' in component) || component.licenses === null) {
            component.licenses = defaultComponent.licenses;
        }

        if (!('copyrights' in component) || component.copyrights === null) {
            component.copyrights = defaultComponent.copyrights;
        }

        if (!('party' in component) || component.party === null) {
            component.party = defaultComponent.party;
        }

        if (!('notes' in component) || component.notes === null) {
            component.notes = defaultComponent.notes;
        }
        // console.log('saving', this.components());
        this.componentsMap[path] = component;
    },
    // Returns a complete set of components with default values
    defaultComponent: function () {
        return {
            review_status: '',
            name: '',
            version: '',
            licenses: [],
            copyrights: [],
            party: {},
            notes: ''
        };
    },
    toSaveFormat: function () {
        // The saved format has special ABCD format for licenses
        licenses = $.map(this.files(), function(file, i) {
            return file.licenses;
        });
        saveFormat = this.components();
        $.each(saveFormat, function (i, component) {
            component.licenses = $.map(component.licenses, function(license, j) {
                var detected_license = licenses.find(function(detected_license) {
                    return detected_license.short_name == license;
                })
                return {
                    short_name: license,
                    key: detected_license ? detected_license.key : license.toLowerCase()
                };
            });

            component.license_expression = $.map(component.licenses, function(license, j) {
                return license.key;
            }).join(' and ');
        });
        return $.extend({}, this.json, {components: saveFormat});
    },
    toLoadFormat: function (componentRows) {
        var components = {}
        if (componentRows != undefined) {
            $.each(componentRows, function(index, value) {
                var newValue = $.extend({}, value);
                newValue.licenses = $.map(newValue.licenses, function(license, i) {
                    return license.short_name;
                });
                // Delete path from the value, and use it as the key
                // in the dictionary
                delete newValue.files;
                // Delete license_expression, it's only used in saved data
                delete newValue.license_expression;
                components[value.files[0].path] = newValue;
            })
        }
        return components;
    },
    toJSTreeFormat: function (data) {
        var that = this;
        // start with a dictionary so we can check for duplicates easily
        var nodeMap = {};
        // loop through all paths
        $.each(data, function (index, x) {
            path = x.path;
            // loop through all parts of the path to create tree nodes
            var parts = null;
            if (path[0] === '/') {
                // slice off the first element because it's an empty string.
                // Example: '/root/dir' => ['', 'root', 'dir']
                parts = path.split('/').slice(1);
                // Add the forward slash back in to the first element
                parts[0] = "/" + parts[0];
            } else {
                parts = path.split('/');
            }

            for (var i = 0; i < parts.length; i++) {
                var id = that.subPath(parts, i + 1);
                if (!(id in nodeMap)) {
                    // insert node for this id
                    nodeMap[id] = {
                        id: id,
                        text: parts[i],
                        parent: that.subPath(parts, i),
                        type: (i + 1 === parts.length) ? 'file' : 'folder',
                        scanData: x
                    };
                }
            }
        });
        // return only the values of the map
        return $.map(nodeMap, function (val, key) {
            return val;
        });
    },

    /*
     Returns the subpath given an array of directories, e.g.,
     subPath(['root', 'dir1', 'file1'], 0) = '#'
     subPath(['root', 'dir1', 'file1'], 1) = 'root'
     subPath(['root', 'dir1', 'file1'], 2) = 'root/dir1'
     subPath(['root', 'dir1', 'file1'], 3) = 'root/dir1/file1'
     */
    subPath: function (parts, i) {
        if (i === 0) {
            // return the jstree id for the root
            return '#';
        } else {
            // return the subpath between start/end
            return parts.slice(0, i).join('/');
        }
    },

    toNodeViewFormat: function (data) {
        tmp = $.map(data, function(d, i) {
            return {
                id: d.id,
                name: d.text,
                parent: d.parent,
                children: null,
                scanData: d.scanData
            };
        });

        $.each(tmp, function(i, d) {
            d.children = $.map(tmp, function(x, j) {
                if (x.parent == d.id) {
                    return x;
                }
            });
        });

        return tmp;
    }
};

// Does a breadth first search to visit each of the root's children and perform
// the action
ScanData.forEachNode = function (root, childrenId, action) {
    var q = [root] || [];
    while (q.length > 0) {
        var parent = q.shift();
        action(parent);
        $.each(parent[childrenId], function (i, child) {
            q.push(child);
        })
    }
},

ScanData.LOCATION_COLUMN = [
    {
        "data": "path",
        "title": "Path",
        "name": "path"
    }
];

ScanData.COPYRIGHT_COLUMNS = [
    {
        "data": "copyright_statements",
        "title": "Copyright Statements",
        "name": "copyright_statements"
    },
    {
        "data": "copyright_holders",
        "title": "Copyright Holders",
        "name": "copyright_holders"
    },
    {
        "data": "copyright_authors",
        "title": "Copyright Authors",
        "name": "copyright_authors"
    },
    {
        "data": "copyright_start_line",
        "title": "Copyright Start Line",
        "name": "copyright_start_line"
    },
    {
        "data": "copyright_end_line",
        "title": "Copyright End Line",
        "name": "copyright_end_line"
    }
];

ScanData.LICENSE_COLUMNS = [
    {
        "data": "license_key",
        "title": "License Key",
        "name": "license_key"
    },
    {
        "data": "license_score",
        "title": "License Score",
        "name": "license_score"
    },
    {
        "data": "license_shortname",
        "title": "License Short Name",
        "name": "license_shortname"
    },
    {
        "data": "license_category",
        "title": "License Category",
        "name": "license_category"
    },
    {
        "data": "license_owner",
        "title": "License Owner",
        "name": "license_owner"
    },
    {
        "data": "license_homepage_url",
        "title": "License Homepage URL",
        "name": "license_homepage_url"
    },
    {
        "data": "license_text_url",
        "title": "License Text URL",
        "name": "license_text_url"
    },
    {
        "data": "license_djc_url",
        "title": "DejaCode License URL",
        "name": "license_djc_url"
    },
    {
        "data": "license_spdx_key",
        "title": "SPDX License Key",
        "name": "license_spdx_key"
    },
    {
        "data": "license_start_line",
        "title": "License Start Line",
        "name": "license_start_line"
    },
    {
        "data": "license_end_line",
        "title": "License End Line",
        "name": "license_end_line"
    }
];

ScanData.EMAIL_COLUMNS = [
    {
        "data": "email",
        "title": "Email",
        "name": "email"
    },
    {
        "data": "email_start_line",
        "title": "Email Start Line",
        "name": "email_start_line"
    },
    {
        "data": "email_start_line",
        "title": "End Start Line",
        "name": "email_start_line"
    }
];

ScanData.URL_COLUMNS = [
    {
        "data": "url",
        "title": "URL",
        "name": "url"
    },
    {
        "data": "url_start_line",
        "title": "URL Start Line",
        "name": "url_start_line"
    },
    {
        "data": "url_end_line",
        "title": "URL End Line",
        "name": "url_end_line"
    }
];

ScanData.FILE_COLUMNS = [
    {
        "data": "infos_type",
        "title": "Type",
        "name": "infos_type"
    },
    {
        "data": "infos_file_name",
        "title": "File Name",
        "name": "infos_file_name"
    },
    {
        "data": "infos_file_extension",
        "title": "File Extension",
        "name": "infos_file_extension"
    },
    {
        "data": "infos_file_data",
        "title": "File Date",
        "name": "infos_file_data"
    },
    {
        "data": "infos_file_size",
        "title": "File Size",
        "name": "infos_file_size"
    },
    {
        "data": "infos_file_sha1",
        "title": "SHA1",
        "name": "infos_file_sha1"
    },
    {
        "data": "infos_md5",
        "title": "MD5",
        "name": "infos_md5"
    },
    {
        "data": "infos_file_count",
        "title": "File Count",
        "name": "infos_file_count"
    },
    {
        "data": "infos_mime_type",
        "title": "MIME Type",
        "name": "infos_mime_type"
    },
    {
        "data": "infos_file_type",
        "title": "File Type",
        "name": "infos_file_type"
    },
    {
        "data": "infos_programming_language",
        "title": "Language",
        "name": "infos_programming_language"
    },
    {
        "data": "infos_is_binary",
        "title": "Binary",
        "name": "infos_is_binary"
    },
    {
        "data": "infos_is_text",
        "title": "Text File",
        "name": "infos_is_text"
    },
    {
        "data": "infos_is_archive",
        "title": "Archive File",
        "name": "infos_is_archive"
    },
    {
        "data": "infos_is_media",
        "title": "Media File",
        "name": "infos_is_media"
    },
    {
        "data": "infos_is_source",
        "title": "Source File",
        "name": "infos_is_source"
    },
    {
        "data": "infos_is_script",
        "title": "Script File",
        "name": "infos_is_script"
    }
];

ScanData.PACKAGE_COLUMNS = [
    {
        "data": "packages_type",
        "title": "Package Type",
        "name": "packages_type"
    },
    {
        "data": "packages_packaging",
        "title": "Packaging",
        "name": "packages_packaging"
    },
    {
        "data": "packages_primary_language",
        "title": "Package Primary Language",
        "name": "packages_primary_language"
    }
];

ScanData.TABLE_COLUMNS = ScanData.LOCATION_COLUMN.concat(
    ScanData.COPYRIGHT_COLUMNS,
    ScanData.LICENSE_COLUMNS,
    ScanData.EMAIL_COLUMNS,
    ScanData.URL_COLUMNS,
    ScanData.FILE_COLUMNS,
    ScanData.PACKAGE_COLUMNS
);

ScanData.ORIGIN_COLUMN_NAMES = [
    "copyright_statements",
    "license_shortname",
    "license_category",
    "email",
    "url"
];

ScanData.ORIGIN_COLUMNS = $.grep(ScanData.TABLE_COLUMNS,
    function(column) {
        return $.inArray(column.name,  ScanData.ORIGIN_COLUMN_NAMES) >= 0;
    });
