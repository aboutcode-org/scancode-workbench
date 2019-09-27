/*
 #
 # Copyright (c) 2017 - 2019 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-workbench/
 # The ScanCode software is licensed under the Apache License version 2.0.
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

const Progress = require('../helpers/progress');
const Controller = require('./controller');
const Utils = require('../helpers/utils');

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
class PackageDashboard extends Controller {
  constructor(dashboardId, workbenchDB) {
    super(dashboardId, workbenchDB);

    this.totalPackagesScanned = $('#total-packages').find('.title');

    // First row
    this.totalPackagesProgressbar =
            new Progress('#total-packages .title', {size: 25});

    // Second row
    this.packageTypeChartProgressbar = 
            new Progress('#package-type-chart .content', {size: 50});
    this.packageLanguageChartProgressbar = 
            new Progress('#package-language-chart .content', {size: 50});
    this.packageLicenseChartProgressbar = 
            new Progress('#package-license-chart .content', {size: 50});
    
    this.packageTypeChart = c3.generate({
      bindto: '#package-type-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      },
    });

    this.packageLanguageChart = c3.generate({
      bindto: '#package-language-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      },
    });

    this.packageLicenseChart = c3.generate({
      bindto: '#package-license-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      },
    });
  }

  reload() {
    this.needsReload(false);

    // TODO: These queries can probably be combined
    // Get # of packages scanned at a certain path
    this.totalPackagesProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Package.findAll({where: {fileId: fileIds}}))
        .then((packages) => this.totalPackagesScanned.text(packages.length)))
      .then(() => this.totalPackagesProgressbar.hide());
          
    // Get package types detected
    this.packageTypeChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Package.findAll({where: {fileId: fileIds}}))
        .then((packages) => packages.map((val) => val.type ? val.type : 'No Value Detected'))
        .then((types) => Utils.formatChartData(types))
        .then((types) => Utils.limitChartData(types, LEGEND_LIMIT)));

    // Get package languages detected
    this.packageLanguageChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Package.findAll({where: {fileId: fileIds}}))
        .then((packages) => packages.map((val) => val.primary_language ? val.primary_language : 'No Value Detected'))
        .then((langs) => Utils.formatChartData(langs))
        .then((langs) => Utils.limitChartData(langs, LEGEND_LIMIT)));
   
    // Get package license detected
    this.packageLicenseChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Package.findAll({where: {fileId: fileIds}}))
        .then((packages) => packages.map((val) => val.license_expression ? val.license_expression : 'No Value Detected'))
        .then((expressions) => Utils.formatChartData(expressions))
        .then((expressions) => Utils.limitChartData(expressions, LEGEND_LIMIT)));
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }

    // Display package type chart
    this.packageTypeChartProgressbar.showIndeterminate();
    this.packageTypeChartData
      .then((data) => this.packageTypeChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.packageTypeChartProgressbar.hide();
          this.packageTypeChart.flush();
        }
      }));

    // Display package languages chart
    this.packageLanguageChartProgressbar.showIndeterminate();
    this.packageLanguageChartData
      .then((data) => this.packageLanguageChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.packageLanguageChartProgressbar.hide();
          this.packageLanguageChart.flush();
        }
      }));

    // Display package license chart
    this.packageLicenseChartProgressbar.showIndeterminate();
    this.packageLicenseChartData
      .then((data) => this.packageLicenseChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.packageLicenseChartProgressbar.hide();
          this.packageLicenseChart.flush();
        }
      }));
  }
}

module.exports = PackageDashboard;
