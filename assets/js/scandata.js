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
    this.nodeViewData = this.toNodeViewFormat(this.json.files);
    // Convert components to a dictionary for easy access of key:value
    this.componentsMap = this.toLoadFormat(this.json.components);
}

module.exports = ScanData;

// ScanCode data instance functions
ScanData.prototype = {
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
        licenses = $.map(this.json.files, function(file, i) {
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

    toNodeViewFormat: function (data) {
        var fileMap = {};
        $.each(data, function(i, scanData) {
            var splits = scanData.path.split('/');
            var parent = splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
            fileMap[scanData.path] = {
                id: scanData.path,
                name: scanData.name,
                parent: parent,
                _children: [],
                children: [],
                scanData: scanData
            }
        });

        $.each(data, function(i, scanData) {
            var splits = scanData.path.split('/');
            var parent = splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
            if (parent in fileMap) {
                fileMap[parent]._children.push(fileMap[scanData.path]);
            }
        });

        return {
            root: fileMap[data[0].path],
            data: fileMap
        };
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
}
