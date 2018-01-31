/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-toolkit/
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

const Utils = require('./helpers/utils');
const View = require('./helpers/view');

/**
 * The view responsible for displaying the DataTable containing the concluded
 * data created for Components
 */
class AboutCodeComponentDataTable extends View {
  constructor(tableID, aboutCodeDB) {
    super(tableID, aboutCodeDB);
  }

  reload() {
    this.needsReload(false);
    this.db().findAllComponents({})
      .then((components) => {
        this.dataTable().clear();
        this.dataTable().rows.add(components);
        this.dataTable().draw();
      });
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }
    this.dataTable().draw();
  }

  dataTable() {
    if (this._dataTable) {
      return this._dataTable;
    }

    $('<p class="lead">Component Summary</p>').prependTo($('#components-table_wrapper'));
    this._dataTable = $(this.id()).DataTable({
      scrollX: true,
      scrollResize: true,
      columns: AboutCodeComponentDataTable.COLUMNS,
      buttons: [
        {
          name: 'uploadDeja',
          text: '<i class=" fa fa-cloud-upload"></i> Upload Components',
          titleAttr: 'Upload Components to DejaCode',
          action: () => {
            this.db()
              .findAllComponents({})
              .then((components) =>
                this.getHandler('upload-clicked')(components));
          },
        },
        {   // Do not allow the first 2 columns to be hidden
          extend: 'colvis',
          columns: ':gt(1)',
          collectionLayout: 'fixed two-column'
        },
        {
          extend: 'csv',
          text: 'Export CSV'
        },
        {
          extend: 'excel',
          text: 'Export Excel'
        },
        {
          name: 'json',
          text: 'Export JSON',
          titleAttr: 'Export JSON file',
          action: () => this.getHandler('export-json')()
        }
      ],
      language: {
        'emptyTable': 'No Components created.'
      },
      dom: // Needed to keep datatables buttons and search inline
                "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-3'l><'col-sm-4'i><'col-sm-5'p>>",
    });

    return this._dataTable;
  }

  static get COLUMNS() {
    return [
      {
        data: 'review_status',
        title: 'Status',
        name: 'status'
      },
      {
        data: 'path',
        title: 'Path',
        name: 'path'
      },
      {
        data: 'name',
        title: 'Name',
        name: 'name'
      },
      {
        data: 'version',
        title: 'Version',
        name: 'version'
      },
      {
        data: 'owner',
        title: 'Owner',
        name: 'owner'
      },
      {
        data: 'licenses[<hr/>].key',
        title: 'License',
        name: 'license_expression'
      },
      {
        'data': 'copyrights[<hr/>].statements[]',
        'title': 'Copyright',
        'name': 'copyright_statements'
      },
      {
        'data': 'is_modified',
        'title': 'Modified',
        'name': 'is_modified'
      },
      {
        'data': 'is_deployed',
        'title': 'Deployed',
        'name': 'is_deployed'
      },
      {
        data: 'code_type',
        title: 'Code Type',
        name: 'code_type',
      },
      {
        data: 'programming_language',
        title: 'Programming Language',
        name: 'programming_language'
      },
      {
        'data': 'homepage_url',
        'title': 'Homepage URL',
        'name': 'homepage_url',
        'render': Utils.anchorTag
      },
      {
        'data': 'download_url',
        'title': 'Download URL',
        'name': 'download_url',
        'render': Utils.anchorTag
      },
      {
        'data': 'license_url',
        'title': 'License URL',
        'name': 'license_url',
        'render': Utils.anchorTag
      },
      {
        'data': 'notice_url',
        'title': 'Notice URL',
        'name': 'notice_url',
        'render': Utils.anchorTag
      },
      {
        data: 'feature',
        title: 'Feature',
        name: 'feature'
      },
      {
        data: 'purpose',
        title: 'Purpose',
        name: 'purpose'
      },
      {
        data: 'notes',
        title: 'Notes',
        name: 'notes',
      },
    ];
  }
}

module.exports = AboutCodeComponentDataTable;
