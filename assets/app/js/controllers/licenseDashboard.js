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
class LicenseDashboard extends Controller {
  constructor(dashboardId, workbenchDB) {
    super(dashboardId, workbenchDB);

    this.totalLicenses = $('#total-licenses').find('.title');
    this.totalFilesWithLicense = $('#total-files-with-license').find('.title');
    this.totalSPDX = $('#total-spdx').find('.title');

    // First row
    this.totalLicensesProgressbar =
            new Progress('#total-licenses .title', {size: 25});
    this.totalFilesWithLicenseProgressbar =
            new Progress('#total-files-with-license .title', {size: 25});
    this.totalSPDXProgressbar =
            new Progress('#total-spdx .title', {size: 25});

    // Second row
    this.licenseExpressionChartProgressbar =
            new Progress('#license-expression-chart .content', {size: 50});
    this.licenseKeyChartProgressbar =
            new Progress('#license-key-chart .content', {size: 50});
    this.licensePolicyChartProgressbar =
            new Progress('#license-policy-chart .content', {size: 50});

    this.licenseExpressionChart = c3.generate({
      bindto: '#license-expression-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      },
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

    this.licensePolicyChart = c3.generate({
      bindto: '#license-policy-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      }
    });
  }

  reload() {
    this.needsReload(false);

    // Get total number of licenses scanned and number of files with licenses and spdx licenses
    this.totalLicensesProgressbar.showIndeterminate();
    this.totalFilesWithLicenseProgressbar.showIndeterminate();
    this.totalSPDXProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.License.findAll({where: {fileId: fileIds}}))
        .then((licenses) => {
          const licenseKeys = licenses.map((val) => val.key);
          const licenseFileIds = licenses.map((val) => val.fileId);
          const spdxKeys = licenses.map((val) => val.spdx_license_key);
          this.totalLicenses.text(new Set(licenseKeys).size);
          this.totalFilesWithLicense.text(new Set(licenseFileIds).size);
          this.totalSPDX.text(new Set(spdxKeys).size);
          this.totalLicensesProgressbar.hide();
          this.totalFilesWithLicenseProgressbar.hide();
          this.totalSPDXProgressbar.hide();
        }));
    
    // Get license expression data
    this.licenseExpressionChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.LicenseExpression.findAll({where: {fileId: fileIds}}))
        .then((expressions) => expressions.map((val) => val.license_expression ? val.license_expression : 'No Value Detected'))
        .then((expressions) => Utils.formatChartData(expressions))
        .then((expressions) => Utils.limitChartData(expressions, LEGEND_LIMIT)));

    // Get license key data
    this.licenseKeyChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.License.findAll({where: {fileId: fileIds}}))
        .then((licenses) => licenses.map((val) => val.key ? val.key : 'No Value Detected'))
        .then((keys) => Utils.formatChartData(keys))
        .then((keys) => Utils.limitChartData(keys, LEGEND_LIMIT)));
    
    // Get license policy data
    this.licensePolicyChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.LicensePolicy.findAll({where: {fileId: fileIds}}))
        .then((policies) => policies.map((val) => val.label ? val.label : 'No Value Detected'))
        .then((labels) => Utils.formatChartData(labels))
        .then((labels) => Utils.limitChartData(labels, LEGEND_LIMIT)));
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }

    // Display license expression key chart
    this.licenseExpressionChartProgressbar.showIndeterminate();
    this.licenseExpressionChartData
      .then((data) => this.licenseExpressionChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.licenseExpressionChartProgressbar.hide();
          this.licenseExpressionChart.flush();
        }
      }));

    // Display license key chart
    this.licenseKeyChartProgressbar.showIndeterminate();
    this.licenseKeyChartData
      .then((data) => this.licenseKeyChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.licenseKeyChartProgressbar.hide();
          this.licenseKeyChart.flush();
        }
      }));
    
    // Display license policy chart
    this.licensePolicyChartProgressbar.showIndeterminate();
    this.licensePolicyChartData
      .then((data) => this.licensePolicyChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.licensePolicyChartProgressbar.hide();
          this.licensePolicyChart.flush();
        }
      }));
  }
}

module.exports = LicenseDashboard;
