/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-workbench/
 # The ScanCode Workbench software is licensed under the Apache License version 2.0.
 # ScanCode is a trademark of nexB Inc.
 #
 # You may not use this software except in compliance with the License.
 # You may obtain a copy of the License at: http://apache.org/licenses/LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software distributed
 # under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 # CONDITIONS OF ANY KIND, either express or implied. See the License for the
 # specific language governing permissions and limitations under the License.
 #
 */

const Controller = require('./controller');

/**
 * The view responsible for displaying the jsTree representing file paths in the
 * ScanCode Scan data
 */
class JsTree extends Controller {
  constructor(jsTreeId, workbenchDB) {
    super(jsTreeId, workbenchDB);
  }

  reload() {
    this.needsReload(false);
    this.jsTree().jstree(true).refresh(true);
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }
  }

  getSelected() {
    return this.jsTree().jstree('get_selected')[0];
  }

  jsTree() {
    if (this._jsTree) {
      return this._jsTree;
    }

    const that = this;
    this._jsTree = $(this.id()).jstree(
      {
        'core': {
          'data': function (currentDirectory, callback) {
            that.db()
              .findAllJSTree({
                where: {
                  parent: currentDirectory.id
                }
              })
              .then((children) => callback.call(this, children));
          },
          'animation': false
        },
        'types': {
          'directory': {
            'icon': 'fa fa-folder fa_custom'
          },
          'file': {
            'icon': 'fa fa-file-text-o'
          },
          'analyzedDir': {
            'icon': 'fa fa-folder fa_custom_analyzed'
          },
          'analyzedFile': {
            'icon': 'fa fa-file fa_custom_analyzed'
          }, 
          'naDir': {
            'icon': 'fa fa-folder fa_custom_na'
          }, 
          'naFile': {
            'icon': 'fa fa-file fa_custom_na'
          }, 
          'ocDir': {
            'icon': 'fa fa-folder fa_custom_oc'
          }, 
          'ocFile': {
            'icon': 'fa fa-file fa_custom_oc'
          }, 
          'nrDir': {
            'icon': 'fa fa-folder fa_custom_nr'
          }, 
          'nrFile': {
            'icon': 'fa fa-file fa_custom_nr'
          },
          'packageDir': {
            'icon': 'fa fa-folder fa_custom_package'
          },
          'packageFile': {
            'icon': 'fa fa-file fa_custom_package'
          },
          'approvedLicense': {
            'icon': 'fa fa-check-circle fa_custom_approved'
          },
          'prohibitedLicense': {
            'icon': 'fa fa-ban fa_custom_prohibited'
          },
          'recommendedLicense': {
            'icon': 'fa fa-thumbs-up fa_custom_recommended'
          },
          'restrictedLicense': {
            'icon': 'fa fa-exclamation-triangle fa_custom_restricted'
          }
        },
        'plugins': ['types', 'sort', 'contextmenu', 'wholerow'],
        // TODO: must fix sorting with these new types
        'sort': function (a, b) {
          const dir_types = ['directory', 'analyzedDir', 'naDir', 'ocDir', 'nrDir', 'packageDir'];
          const file_types = ['file', 'analyzedFile', 'naFile', 'ocFile', 'ocDir', 'pacakgeFile', 'approvedLicense', 'prohibitedLicense', 'recommendedLicense', 'restrictedLicense'];

          const a1 = this.get_node(a);
          const b1 = this.get_node(b);

          let a1CompareType;
          let b1CompareType;

          if (dir_types.includes(a1.type)) {
            a1CompareType = 'directory';
          } else if (file_types.includes(a1.type)) {
            a1CompareType = 'file';
          }

          if (dir_types.includes(b1.type)) {
            b1CompareType = 'directory';
          } else if (file_types.includes(b1.type)) {
            b1CompareType = 'file';
          }

          if (a1CompareType === b1CompareType) {
            return a1.text.localeCompare(b1.text, 'en-US-u-kf-upper');
          }
          else {
            return (a1CompareType === 'directory') ? -1 : 1;
          }
        },
        'contextmenu': {
          'items': (node) => {
            return {
              'edit_conclusion': {
                'label': 'Edit Conclusion',
                'action': () => this.getHandler('node-edit')(node)
              }
            };
          }
        }
      })
      .on('open_node.jstree', (evt, data) => {
        if (data.node.type === 'directory') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom');
        } else if (data.node.type === 'analyzedDir') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom_analyzed');
        } else if (data.node.type === 'naDir') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom_na');
        } else if (data.node.type === 'ocDir') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom_oc');
        } else if (data.node.type === 'nrDir') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom_nr');
        } else if (data.node.type === 'packageDir') {
          data.instance.set_icon(data.node, 'fa fa-folder-open fa_custom_package');
        }
      })
      .on('close_node.jstree', (evt, data) => {
        if (data.node.type === 'directory') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom');
        } else if (data.node.type === 'analyzedDir') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom_analyzed');
        } else if (data.node.type === 'naDir') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom_na');
        } else if (data.node.type === 'ocDir') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom_oc');
        } else if (data.node.type === 'nrDir') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom_nr');
        } else if (data.node.type === 'packageDir') {
          data.instance.set_icon(data.node, 'fa fa-folder fa_custom_package');
        }
      })
      // Select the root node when the tree is loaded
      .on('loaded.jstree', () => {
        const rootNode = this.jsTree().jstree('get_node', '#').children;
        this.jsTree().jstree('select_node', rootNode);
      })
      .on('select_node.jstree', (evt, data) => {
        this.getHandler('node-selected')(data.node);
      });

    return this._jsTree;
  }
}

module.exports = JsTree;
