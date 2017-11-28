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

class AboutCodeJsTree {
    constructor(jsTreeId, aboutCodeDB) {
        this.handlers = {};
        this.jsTreeId = jsTreeId;
        this.aboutCodeDB = aboutCodeDB;
        this.jsTree = this._initJsTree(jsTreeId);
    }

    on(event, handler) {
        this.handlers[event] = handler;
        return this;
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    reload() {
        this.jsTree.jstree(true).refresh(true);
    }

    getSelected() {
        return this.jsTree.jstree("get_selected")[0];
    }

    _initJsTree(jsTreeId) {
        const that = this;
        return $(jsTreeId).jstree(
            {
                "core": {
                    "data": function (currentDirectory, callback) {
                        that.aboutCodeDB
                            .findAllJSTree({
                                where: {
                                    parent: currentDirectory.id
                                }
                            })
                            .then((children) => callback.call(this, children));
                    },
                    "animation": false
                },
                "types": {
                    "directory": {
                        "icon": "fa fa-folder fa_custom"
                    },
                    "file": {
                        "icon": "fa fa-file-text-o"
                    }
                },
                "plugins": ["types", "sort", "contextmenu", "wholerow"],
                "sort": function (a, b) {
                    const a1 = this.get_node(a);
                    const b1 = this.get_node(b);
                    if (a1.type === b1.type) {
                        return a1.text.localeCompare(b1.text, 'en-US-u-kf-upper');
                    }
                    else {
                        return (a1.type === 'directory') ? -1 : 1;
                    }
                },
                "contextmenu": {
                    "items": (node) => {
                        return {
                            "edit_component": {
                                "label": "Edit Component",
                                "action": () => this.handlers['node-edit'](node)
                            }
                        };
                    }
                }
            })
            .on('open_node.jstree', (evt, data) => {
                data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom');
            })
            .on('close_node.jstree', (evt, data) => {
                data.instance.set_icon(data.node, 'fa fa-folder fa_custom');
            })
            // Select the root node when the tree is refreshed
            .on('refresh.jstree', (evt, data) => {
                let rootNode = this.jsTree.jstree('get_node', '#').children;
                this.jsTree.jstree('select_node', rootNode);
            })
            .on('select_node.jstree', (evt, data) => {
                this.handlers['node-selected'](data.node);
            });
    }
}

module.exports = AboutCodeJsTree;