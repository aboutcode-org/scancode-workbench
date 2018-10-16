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

const Sequelize = require('sequelize');
const Utils = require('../helpers/utils');
const Controller = require('./controller');

// There must be a table element within the container element with this class
const SCANDATA_TABLE = 'table.scandata-table';

const HAS_A_VALUE =  'about_code_data_table_has_a_value';

const NO_VALUE_DETECTED =  'about_code_data_table_no_value_detected';

/**
 * The view responsible for displaying the DataTable containing the ScanCode
 * Scan data
 */
class AboutCodeScanDataTable extends Controller {
  constructor(containerId, aboutCodeDB) {
    super(containerId, aboutCodeDB);
  }

  draw() {
    return this.dataTable().draw();
  }

  rows() {
    return this.dataTable().rows();
  }

  columns(columnId) {
    return this.dataTable().columns(columnId);
  }

  reload() {
    this.needsReload(false);
    this.dataTable().ajax.reload();
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }
    this.dataTable().draw();
  }

  clearColumnFilters() {
    $.each(AboutCodeScanDataTable.TABLE_COLUMNS, (i, column) => {
      const columnSelect = $(`select#scandata-${column.name}`);
      columnSelect.val('');
      this.dataTable()
        .column(`${column.name}:name`)
        .search('', false, false);
    });
  }

  setColumnFilter(columnName, value) {
    // Get the ScanData table column and make sure it's visible
    const column = this.dataTable().column(`${columnName}:name`);
    column.visible(true);

    // Get the column's filter select box
    const select = $(`select#scandata-${columnName}`);
    select.empty().append(`<option value="">All</option>`);

    // Add the chart value options and select it.
    if (value === NO_VALUE_DETECTED) {
      select.append(`<option value="${value}">No Value Detected</option>`);
    } else {
      select.append(`<option value="${value}">${value}</option>`);
    }
    select.val(value).change();
  }

  dataTableSelector() {
    return `${this.id()} ${SCANDATA_TABLE}`;
  }

  dataTable() {
    if (this._dataTable) {
      return this._dataTable;
    }

    // Adds a footer for each column. This needs to be done before creating
    // the DataTable
    const cells = $.map(AboutCodeScanDataTable.TABLE_COLUMNS, () => '<td></td>').join('');
    $(this.dataTableSelector()).append('<tfoot><tr>' + cells + '</tr></tfoot>');

    this._dataTable = $(this.dataTableSelector()).DataTable({
      serverSide: true,
      processing: true,
      ajax: (dataTablesInput, dataTablesCallback) =>
        this._query(dataTablesInput, dataTablesCallback),
      columns: AboutCodeScanDataTable.TABLE_COLUMNS,
      fixedColumns: { leftColumns: 1 },
      colResize: true,
      scrollX: true,
      scrollResize: true,
      deferRender: true,
      initComplete: () => this._initComplete(),
      drawCallback: () => this._drawCallback(),
      columnDefs: [{
        targets: [4, 5, 8, 16, 17, 19, 20, 22, 23, 28, 31],
        className: 'column-right-justify',
      }],
      buttons: [
        {   // Do not allow the first column to be hidden
          extend: 'colvis',
          columns: ':gt(0)',
          collectionLayout: 'fixed two-column'
        },
        {
          extend: 'colvisGroup',
          text: 'Show all',
          show: ':hidden'
        },
        {
          // Hide all columns except Path
          extend: 'colvisGroup',
          text: 'Hide all',
          show: AboutCodeScanDataTable.LOCATION_COLUMN
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.LOCATION_COLUMN.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        },
        {
          // Show only FileInfo columns
          extend: 'colvisGroup',
          text: 'File info',
          show: AboutCodeScanDataTable.FILEINFO_GROUP
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.FILEINFO_GROUP.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        },
        {
          // Show only origin columns
          extend: 'colvisGroup',
          text: 'Origin info',
          show: AboutCodeScanDataTable.ORIGIN_GROUP
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.ORIGIN_GROUP.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        },
        {
          // Show only copyright columns
          extend: 'colvisGroup',
          text: 'Copyright info',
          show: AboutCodeScanDataTable.COPYRIGHT_GROUP
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.COPYRIGHT_GROUP.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        },
        {
          // Show only license columns
          extend: 'colvisGroup',
          text: 'License info',
          show: AboutCodeScanDataTable.LICENSE_GROUP
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.LICENSE_GROUP.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        },
        {
          // Show only package columns
          extend: 'colvisGroup',
          text: 'Package info',
          show: AboutCodeScanDataTable.PACKAGE_GROUP
            .map((column) => `${column.name}:name`),
          hide: AboutCodeScanDataTable.TABLE_COLUMNS
            .filter((column) => AboutCodeScanDataTable.PACKAGE_GROUP.indexOf(column) < 0)
            .map((column) => `${column.name}:name`)
        }
      ],
      dom: // Needed to keep datatables buttons and search inline
                "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-3'l><'col-sm-4'i><'col-sm-5'p>>"
    });

    return this._dataTable;
  }

  // This function is called every time DataTables needs to be redrawn.
  // For details on the parameters https://datatables.net/manual/server-side
  _query(dataTablesInput, dataTablesCallback) {
    // Sorting and Querying of data for DataTables
    this.db().sync.then((db) => {
      const columnIndex = dataTablesInput.order[0].column;
      const columnName = dataTablesInput.columns[columnIndex].name;
      const direction = dataTablesInput.order[0].dir === 'desc' ? 'DESC' : 'ASC';

      // query = {
      //   where: {
      //     $and: {
      //       path: { $like: "columnSearch%" },
      //       $or: [
      //         { path: { $like: "globalSearch%" } },
      //         { copyright_statements: { $like: "globalSearch%" } },
      //         ...,
      //       ]
      //     }
      //   }
      // }
      const query = {
        where: {
          $and: {}
        },
        // Only take the chunk of data DataTables needs
        limit: dataTablesInput.length,
        offset: dataTablesInput.start,
        order: [Sequelize.literal(`${columnName} COLLATE NOCASE ${direction}`)]
      };

      // If a column search exists, add search for that column
      for (let i = 0; i < dataTablesInput.columns.length; i++) {
        let columnSearch = dataTablesInput.columns[i].search.value;
        // Handle 'binary' true/false column filters
        if (columnSearch === 'true') {
          columnSearch = 1;
        } else if (columnSearch === 'false') {
          columnSearch = 0;
        }
        if (columnSearch) {
          const columnName = dataTablesInput.columns[i].name;
          this.dataTable().column(`${columnName}:name`).visible(true);

          if (i === 0) {
            // Column 0 is the "path", which should only match
            // wildcards at the end of the path.
            query.where.$and.path = {
              $or: [
                // Matches a file.
                { $like: `${columnSearch}` },
                // Matches a directory and all its children.
                { $like: `${columnSearch}/%`}
              ]
            };
          } else if (columnSearch === HAS_A_VALUE) {
            // Return all non empty values
            query.where.$and[columnName] = {
              $and: [
                { $ne: '[]' },
                { $ne: '[[]]' },
                { $ne: '' },
                { $ne: '{}' }
              ]
            };
          } else if (columnSearch === NO_VALUE_DETECTED) {
            // Return all empty values
            query.where.$and[columnName] = {
              $or: [
                { $eq: '[]' },
                { $eq: '[[]]' },
                { $eq: '' },
                { $eq: '{}' },
                { $eq: null }
              ]
            };
          } else if (columnName === 'extension') {
            query.where.$and[columnName] = {
              $eq: columnSearch
            };
          } else {
            query.where.$and[columnName] = {
              $like: `%${columnSearch}%`
            };
          }
        }
      }

      // If a global search exists, add an $or search for each column
      const globalSearch = dataTablesInput.search.value;
      if (globalSearch) {
        query.where.$and.$or = [];
        for (let i = 0; i < dataTablesInput.columns.length; i++) {
          const orSearch = {};
          orSearch[dataTablesInput.columns[i].name] = {
            $like: `%${globalSearch.trim()}%`
          };
          query.where.$and.$or.push(orSearch);
        }
      }

      // Execute the database find to get the rows of data
      const dFind = db.FlatFile.findAll(query);

      // Execute the database count of all rows
      const dCount = db.FlatFile.count({});

      // Execute the database count of filtered query rows
      const dFilteredCount = db.FlatFile.count(query);

      // Wait for all three of the Deferred objects to finish
      Promise.all([dFind, dCount, dFilteredCount])
        .then((values) => {
          const [rows, count, filteredCount] = values;
          dataTablesCallback({
            draw: dataTablesInput.draw,
            data: rows ? rows : [],
            recordsFiltered: filteredCount,
            recordsTotal: count
          });
        });
    });
  }

  _initComplete() {
    const pathCol = this.dataTable().columns(0);

    const footer = $(pathCol.footer());
    // keep the buttons horizontally aligned
    footer.css('white-space', 'nowrap');

    const genFiltersButton = $(`<button id="activate-filters-button" type="button">Activate Filters</button>`);
    const clearFiltersButton = $(`<button id="clear-filters-button" type="button">Clear Filters</button>`);

    footer.append(genFiltersButton);
    footer.append(clearFiltersButton);

    this.dataTable().columns().every(function (columnIndex) {
      const columnInfo = AboutCodeScanDataTable.TABLE_COLUMNS[columnIndex];

      if ('skipFilter' in columnInfo && columnInfo.skipFilter) {
        return;
      }

      const column = this;
      const footer = $(column.footer());
      const columnName = columnInfo.name;

      const select = $(`<select id="scandata-${columnName}"></select>`)
        .on('change', function () {
          const val = $(this).val();
          column
            .search(val, false, false)
            .draw();
        });

      footer.append(select);
    });
  }

  _drawCallback() {
    $('.dataTables_scrollBody').scrollTop(0);
  }

  resetColumnFilters() {
    $.each(AboutCodeScanDataTable.TABLE_COLUMNS, (i, column) => {
      const columnSelect = $(`select#scandata-${column.name}`);
      columnSelect.empty();
      columnSelect.val('');
      this.dataTable()
        .column(`${column.name}:name`)
        .search('', false, false);
    });
    // clear the global search box
    this.dataTable().search('').columns().search('').draw();
  }

  genFilters() {
    this.resetColumnFilters();
    const that = this;

    this.dataTable().columns().every(function (columnIndex) {
      const columnInfo = AboutCodeScanDataTable.TABLE_COLUMNS[columnIndex];
      const currentColumn = that.dataTable().columns(columnIndex);

      if ('skipFilter' in columnInfo && columnInfo.skipFilter) {
        return;
      }

      // skip columns that are not currently visible
      if (currentColumn.visible()[0] === false) {
        return;
      }

      const column = this;
      const footer = $(column.footer());
      const columnName = columnInfo.name;

      footer.empty();

      const select = $('#scandata-' + columnName)
        .empty()
        .on('change', function () {
          const val = $(this).val();
          column
            .search(val, false, false)
            .draw();
        });

      const currPath = that._selectedPath;
      const where = { path: { $like: `${currPath}%`} };

      that.db().sync.then((db) => db.FlatFile.findAll({
        attributes: [
          Sequelize.fn('TRIM',  Sequelize.col(columnName)),
          columnName
        ],
        group: [columnName],
        where: where,
      }))
        .then((rows) => {
          let filterValues =
            // $.map is used to flatten array values.
            $.map(rows, (row) => row[columnName])
              .map((row) => row.toString().trim())
              .filter((val) => val.length > 0);

          filterValues = $.unique(filterValues).sort();

          select.append(`<option value="">All</option>`);

          if (filterValues.length > 0) {
            select.append(`<option value="${HAS_A_VALUE}">Has a Value</option>`);
            select.append(`<option value="${NO_VALUE_DETECTED}">No Value Detected</option>`);
          }

          $.each(filterValues, (i, filterValue) => {
            select.append(`<option value="${filterValue}">${filterValue}</option>`);
          });
        });
      footer.append(select);
    });
  }

  // Define DataTable columns
  static get TABLE_COLUMNS() {
    return AboutCodeScanDataTable.LOCATION_COLUMN.concat(
      AboutCodeScanDataTable.COPYRIGHT_COLUMNS,
      AboutCodeScanDataTable.LICENSE_COLUMNS,
      AboutCodeScanDataTable.EMAIL_COLUMNS,
      AboutCodeScanDataTable.URL_COLUMNS,
      AboutCodeScanDataTable.FILE_COLUMNS,
      AboutCodeScanDataTable.PACKAGE_COLUMNS);
  }

  static get FILEINFO_COLUMNS() {
    return $.grep(AboutCodeScanDataTable.TABLE_COLUMNS, (column) => {
      return $.inArray(column.name, AboutCodeScanDataTable.FILEINFO_COLUMN_NAMES) >= 0;
    });
  }

  static get ORIGIN_COLUMNS() {
    return $.grep(AboutCodeScanDataTable.TABLE_COLUMNS, (column) => {
      return $.inArray(column.name, AboutCodeScanDataTable.ORIGIN_COLUMN_NAMES) >= 0;
    });
  }

  static get CUSTOM_LICENSE_COLUMNS() {
    return $.grep(AboutCodeScanDataTable.TABLE_COLUMNS, (column) => {
      return $.inArray(column.name, AboutCodeScanDataTable.LICENSE_COLUMN_NAMES) >= 0;
    });
  }

  static get CUSTOM_PACKAGE_COLUMNS() {
    return $.grep(AboutCodeScanDataTable.TABLE_COLUMNS, (column) => {
      return $.inArray(column.name, AboutCodeScanDataTable.PACKAGE_COLUMN_NAMES) >= 0;
    });
  }

  static get LICENSE_GROUP() {
    return AboutCodeScanDataTable.LOCATION_COLUMN
      .concat(AboutCodeScanDataTable.CUSTOM_LICENSE_COLUMNS);
  }

  static get COPYRIGHT_GROUP() {
    return AboutCodeScanDataTable.LOCATION_COLUMN
      .concat(AboutCodeScanDataTable.COPYRIGHT_COLUMNS);
  }

  static get FILEINFO_GROUP() {
    return AboutCodeScanDataTable.LOCATION_COLUMN
      .concat(AboutCodeScanDataTable.FILEINFO_COLUMNS);
  }

  static get ORIGIN_GROUP() {
    return AboutCodeScanDataTable.LOCATION_COLUMN
      .concat(AboutCodeScanDataTable.ORIGIN_COLUMNS);
  }

  static get PACKAGE_GROUP() {
    return AboutCodeScanDataTable.LOCATION_COLUMN
      .concat(AboutCodeScanDataTable.CUSTOM_PACKAGE_COLUMNS);
  }
}

AboutCodeScanDataTable.LOCATION_COLUMN =
    [
      {
        'data': 'path',
        'title': 'Path',
        'name': 'path',
        'skipFilter': true,
        'visible': true
      }
    ];

AboutCodeScanDataTable.COPYRIGHT_COLUMNS =
    [
      {
        'data': function (row) {
          return row.copyright_statements.map((statements) => {
            return statements.join('<br/>');
          }).join('<hr/>');
        },
        'title': 'Copyright Statements',
        'name': 'copyright_statements',
        'bar_chart_class': 'bar-chart-copyrights',
        'visible': false
      },
      {
        'data': function (row) {
          return row.copyright_holders.map((holders) => {
            return holders.join('<br/>');
          }).join('<hr/>');
        },
        'title': 'Copyright Holders',
        'name': 'copyright_holders',
        'bar_chart_class': 'bar-chart-copyrights',
        'visible': false
      },
      {
        'data': function (row) {
          return row.copyright_authors.map((authors) => {
            return authors.join('<br/>');
          }).join('<hr/>');
        },
        'title': 'Copyright Authors',
        'name': 'copyright_authors',
        'bar_chart_class': 'bar-chart-copyrights',
        'visible': false
      },
      {
        'data': 'copyright_start_line[<hr/>]',
        'title': 'Copyright Start Line',
        'name': 'copyright_start_line',
        'visible': false
      },
      {
        'data': 'copyright_end_line[<hr/>]',
        'title': 'Copyright End Line',
        'name': 'copyright_end_line',
        'visible': false
      }
    ];

AboutCodeScanDataTable.LICENSE_COLUMNS =
    [
      {
        'data': 'license_expressions[<hr/>]',
        'title': 'License Expressions',
        'name': 'license_expressions',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_key[<hr/>]',
        'title': 'License Key',
        'name': 'license_key',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_score[<hr/>]',
        'title': 'License Score',
        'name': 'license_score',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_short_name[<hr/>]',
        'title': 'License Short Name',
        'name': 'license_short_name',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_category[<hr/>]',
        'title': 'License Category',
        'name': 'license_category',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_owner[<hr/>]',
        'title': 'License Owner',
        'name': 'license_owner',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_homepage_url',
        'title': 'License Homepage URL',
        'name': 'license_homepage_url',
        'render': (hrefs) => $.map(hrefs, Utils.anchorTag).join('<br>'),
        'visible': false
      },
      {
        'data': 'license_text_url',
        'title': 'License Text URL',
        'name': 'license_text_url',
        'render': (hrefs) => $.map(hrefs, Utils.anchorTag).join('<br>'),
        'visible': false
      },
      {
        'data': 'license_reference_url',
        'title': 'License Reference URL',
        'name': 'license_reference_url',
        'render': (hrefs) => $.map(hrefs, Utils.anchorTag).join('<br>'),
        'visible': false
      },
      {
        'data': 'license_spdx_key[<hr/>]',
        'title': 'SPDX License Key',
        'name': 'license_spdx_key',
        'bar_chart_class': 'bar-chart-licenses',
        'visible': false
      },
      {
        'data': 'license_start_line[<hr/>]',
        'title': 'License Start Line',
        'name': 'license_start_line',
        'visible': false
      },
      {
        'data': 'license_end_line[<hr/>]',
        'title': 'License End Line',
        'name': 'license_end_line',
        'visible': false
      }
    ];

AboutCodeScanDataTable.EMAIL_COLUMNS =
    [
      {
        'data': 'email[<hr/>]',
        'title': 'Email',
        'name': 'email',
        'bar_chart_class': 'bar-chart-emails',
        'visible': false
      },
      {
        'data': 'email_start_line[<hr/>]',
        'title': 'Email Start Line',
        'name': 'email_start_line',
        'visible': false
      },
      {
        'data': 'email_start_line[<hr/>]',
        'title': 'End Start Line',
        'name': 'email_start_line',
        'visible': false
      }
    ];

AboutCodeScanDataTable.URL_COLUMNS =
    [
      {
        'data': 'url',
        'title': 'URL',
        'name': 'url',
        'render': function (data) {
          return $.map(data, Utils.anchorTag).join('<br>');
        },
        'visible': false
      },
      {
        'data': 'url_start_line[<br>]',
        'title': 'URL Start Line',
        'name': 'url_start_line',
        'visible': false
      },
      {
        'data': 'url_end_line[<br>]',
        'title': 'URL End Line',
        'name': 'url_end_line',
        'visible': false
      }
    ];

AboutCodeScanDataTable.FILE_COLUMNS =
    [
      {
        'data': 'type',
        'title': 'Type',
        'name': 'type',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'name',
        'title': 'File Name',
        'name': 'name',
        'visible': true
      },
      {
        'data': 'extension',
        'title': 'File Extension',
        'name': 'extension',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': true
      },
      {
        'data': 'date',
        'title': 'File Date',
        'name': 'date',
        'visible': false
      },
      {
        'data': 'size',
        'title': 'File Size',
        'name': 'size',
        'visible': true
      },
      {
        'data': 'sha1',
        'title': 'SHA1',
        'name': 'sha1',
        'visible': false
      },
      {
        'data': 'md5',
        'title': 'MD5',
        'name': 'md5',
        'visible': false
      },
      {
        'data': 'file_count',
        'title': 'File Count',
        'name': 'file_count',
        'visible': false
      },
      {
        'data': 'mime_type',
        'title': 'MIME Type',
        'name': 'mime_type',
        'visible': true
      },
      {
        'data': 'file_type',
        'title': 'File Type',
        'name': 'file_type',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': true
      },
      {
        'data': 'programming_language',
        'title': 'Language',
        'name': 'programming_language',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': true
      },
      {
        'data': 'is_binary',
        'title': 'Binary',
        'name': 'is_binary',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'is_text',
        'title': 'Text File',
        'name': 'is_text',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'is_archive',
        'title': 'Archive File',
        'name': 'is_archive',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'is_media',
        'title': 'Media File',
        'name': 'is_media',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'is_source',
        'title': 'Source File',
        'name': 'is_source',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      },
      {
        'data': 'is_script',
        'title': 'Script File',
        'name': 'is_script',
        'bar_chart_class': 'bar-chart-file-infos',
        'visible': false
      }
    ];

AboutCodeScanDataTable.PACKAGE_COLUMNS =
    [
      {
        'data': 'packages_type',
        'title': 'Package Type',
        'name': 'packages_type',
        'bar_chart_class': 'bar-chart-package-infos',
        'visible': false
      },
      {
        'data': 'packages_name',
        'title': 'Package Name',
        'name': 'packages_name',
        'bar_chart_class': 'bar-chart-package-infos',
        'visible': false
      },
      {
        'data': 'packages_version',
        'title': 'Package Version',
        'name': 'packages_version',
        'visible': false
      },
      {
        'data': 'packages_declared_licensing[<hr/>]',
        'title': 'Package Declared Licensing',
        'name': 'packages_declared_licensing',
        'visible': false
      },
      {
        'data': 'packages_primary_language',
        'title': 'Package Primary Language',
        'name': 'packages_primary_language',
        'bar_chart_class': 'bar-chart-package-infos',
        'visible': false
      },
      // add package parties
      {
        'data': 'packages_homepage_url',
        'title': 'Package Homepage URL',
        'name': 'packages_homepage_url',
        'visible': false
      },
      {
        'data': 'packages_download_url',
        'title': 'Package Download URL',
        'name': 'packages_download_url',
        'visible': false
      },
      {
        'data': 'packages_purl',
        'title': 'Package URL',
        'name': 'packages_purl',
        'visible': false
      },
    ];

AboutCodeScanDataTable.FILEINFO_COLUMN_NAMES = 
  [
    'name',
    'extension',
    'size',
    'mime_type', 
    'file_type',
    'programming_language'
  ];

AboutCodeScanDataTable.ORIGIN_COLUMN_NAMES =
  [
    'copyright_statements',
    'license_short_name',
    'license_category',
    'email',
    'url',
    'mime_type',
    'file_type',
    'programming_language'
  ];

AboutCodeScanDataTable.LICENSE_COLUMN_NAMES = 
  [
    'license_expressions',
    'license_key',
    'license_score',
    'license_short_name', 
    'license_category',
    'license_owner',
    'license_spdx_key',
    'license_start_line',
    'license_end_line'
  ];

AboutCodeScanDataTable.PACKAGE_COLUMN_NAMES = 
  [
    'packages_type',
    'packages_name',
    'packages_version',
    'packages_declared_licensing',
    'packages_primary_language',
    'packages_purl'
  ];

module.exports = AboutCodeScanDataTable;
