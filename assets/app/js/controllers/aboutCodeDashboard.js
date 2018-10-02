/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/aboutcode-manager/
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
const Progress = require('../helpers/progress');
const Utils = require('../helpers/utils');
const Controller = require('./controller');

const LEGEND_COLORS = [
  '#B3F82F',
  '#FFA330',
  '#EC2D95',
  '#2BE189',
  '#9095F0',
  '#2AD0D8',
  '#AAB2BD',
  '#3499DB'
];

const LEGEND_LIMIT = 8;

/**
 * The view responsible for displaying the summary information from ScanCode
 * Scan data
 */
class AboutCodeDashboard extends Controller {
  constructor(dashboardId, aboutCodeDB) {
    super(dashboardId, aboutCodeDB);

    this.totalFilesScanned = $('#total-files').find('.title');
    this.uniqueLicenses = $('#unique-licenses').find('.title');
    this.uniqueCopyrights = $('#unique-copyrights').find('.title');
    this.totalPackages = $('#total-packages').find('.title');

    this.totalFilesProgressbar =
            new Progress('#total-files .title', {size: 25});
    this.uniqueLicensesProgressbar =
            new Progress('#unique-licenses .title', {size: 25});
    this.uniqueCopyrightsProgressbar =
            new Progress('#unique-copyrights .title', {size: 25});
    this.totalPackagesProgressbar =
            new Progress('#total-packages .title', {size: 25});
    this.sourceLanguageChartProgressbar =
            new Progress('#source-chart .content', {size: 50});
    this.licenseCategoryChartProgressbar =
            new Progress('#license-category-chart .content', {size: 50});
    this.licenseKeyChartProgressbar =
            new Progress('#license-key-chart .content', {size: 50});
    this.packagesTypeChartProgressbar =
            new Progress('#packages-type-chart .content', {size: 50});

    this.sourceLanguageChart = c3.generate({
      bindto: '#source-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      },
    });

    this.licenseCategoryChart = c3.generate({
      bindto: '#license-category-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      }
    });

    this.licenseKeyChart = c3.generate({
      bindto: '#license-key-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      }
    });

    this.packagesTypeChart = c3.generate({
      bindto: '#packages-type-chart .chart',
      data: {
        columns: [],
        type: 'bar',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      }
    });
  }

  reload() {
    this.needsReload(false);

    // Get # files scanned at a certain path
    this.totalFilesProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findOne({where: {path: this.selectedPath()}}))
      .then((row) => this.totalFilesScanned.text(row ? row.files_count : '0'))
      .then(() => this.totalFilesProgressbar.hide());

    // Get total unique licenses detected at a certain path
    this.uniqueLicensesProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.License.findAll({where: {fileId: fileIds}}))
        .then((licenses) => licenses.map((val) => val.key))
        .then((keys) => this.uniqueLicenses.text(new Set(keys).size)))
      .then(() => this.uniqueLicensesProgressbar.hide());

    // Get total unique copyright statements detected at a certain path
    this.uniqueCopyrightsProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Copyright.findAll({where: {fileId: fileIds}}))
        .then((copyrights) => copyrights.map((val) => val.statements))
        .then((statements) => statements.map((val) => val.pop()))
        .then((statements) => this.uniqueCopyrights.text(new Set(statements).size)))
      .then(() => this.uniqueCopyrightsProgressbar.hide());

    // Get total number of packages detected
    this.totalPackagesProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Package.findAll({where: {fileId: fileIds}}))
        .then((packages) => packages.map((val) => val.type))
        .then((types) => this.totalPackages.text(types.length)))
      .then(() => this.totalPackagesProgressbar.hide());

    // Get unique programming languages detected
    this.sourceLanguageChartData = this._loadChartData('programming_language', this.selectedPath());

    // Get license categories detected
    this.licenseCategoryChartData = this._loadChartData('license_category', this.selectedPath());

    // Get license keys detected
    this.licenseKeyChartData = this._loadChartData('license_key', this.selectedPath());

    // Get package types detected
    this.packagesTypeChartData = this._loadChartData('packages_type', this.selectedPath());
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }

    // Get unique programming languages detected
    this.sourceLanguageChartProgressbar.showIndeterminate();
    this.sourceLanguageChartData
      .then((data) => this.sourceLanguageChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.sourceLanguageChartProgressbar.hide();
          this.sourceLanguageChart.hide('No Value Detected');
          this.sourceLanguageChart.flush();
        }
      }));

    // Get license categories detected
    this.licenseCategoryChartProgressbar.showIndeterminate();
    this.licenseCategoryChartData
      .then((data) => this.licenseCategoryChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.licenseCategoryChartProgressbar.hide();
          this.licenseCategoryChart.hide('No Value Detected');
          this.licenseCategoryChart.flush();
        }
      }));

    // Get license keys detected
    this.licenseKeyChartProgressbar.showIndeterminate();
    this.licenseKeyChartData
      .then((data) => this.licenseKeyChart.load({
        columns: data,
        unload:true,
        done: () => {
          this.licenseKeyChartProgressbar.hide();
          this.licenseKeyChart.hide('No Value Detected');
          this.licenseKeyChart.flush();
        }
      }));

    // Get package types detected
    this.packagesTypeChartProgressbar.showIndeterminate();
    this.packagesTypeChartData
      .then((data) => this.packagesTypeChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.packagesTypeChartProgressbar.hide();
          this.packagesTypeChart.hide('No Value Detected');
          this.packagesTypeChart.flush();
        }
      }));
  }

  _loadChartData(attribute, parentPath) {
    const where = {
      $and: [{
        type: {
          $eq: 'file'
        }
      }]
    };
    
    if (parentPath) {
      where.$and.push({path: {$like: `${parentPath}%`}});
    }

    return this.db().sync.then((db) => {
      return db.FlatFile
        .findAll({
          attributes: [
            Sequelize.fn('TRIM', Sequelize.col(attribute)),
            attribute
          ],
          where: where
        })
        .then((data) => Utils.getAttributeValues(data, attribute))
        .then((data) => AboutCodeDashboard.formatData(data))
        .then((data) => AboutCodeDashboard.limitData(data, LEGEND_LIMIT));
    });
  }

  static limitData(data, limit) {
    // TODO: Use partitioning (like in quicksort) to find top "limit"
    // more efficiently.
    // Sort data by count
    return data.sort((a,b) => (a[1] > b[1]) ? 1 : -1)
      .map((dataPair, i) => {
        if (data.length - i >= limit) {
          return ['other', dataPair[1]];
        } else {
          return dataPair;
        }
      });
  }

  // Formats data for c3: [[key1, count1], [key2, count2], ...]
  static formatData(names) {
    // Sum the total number of times the name appears
    const count = {};
    $.each(names, (i, name) => {
      count[name] = count[name] + 1 || 1;
    });

    // Transform license count into array of objects with license name & count
    return $.map(count, (val, key) => {
      return [[key, val]];
    });
  }
}

module.exports = AboutCodeDashboard;
