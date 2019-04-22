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
class FileDashboard extends Controller {
  constructor(dashboardId, workbenchDB) {
    super(dashboardId, workbenchDB);

    this.totalFilesScanned = $('#total-files').find('.title');
    this.totalDirsScanned = $('#total-dirs').find('.title');
    this.uniqueHolders = $('#unique-holders').find('.title');

    // First row
    this.totalFilesProgressbar =
            new Progress('#total-files .title', {size: 25});
    this.totalDirsProgressbar =
            new Progress('#total-dirs .title', {size: 25});
    this.uniqueHoldersProgressbar =
            new Progress('#unique-holders .title', {size: 25});

    // Second row
    this.sourceLanguageChartProgressbar =
            new Progress('#source-chart .content', {size: 50});
    this.fileTypeChartProgressbar =
            new Progress('#license-category-chart .content', {size: 50});
    this.holdersChartProgressbar =
            new Progress('#holders-chart .content', {size: 50});

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

    this.fileTypeChart = c3.generate({
      bindto: '#file-type-chart .chart',
      data: {
        columns: [],
        type: 'pie',
        order: 'desc',
      },
      color: {
        pattern: LEGEND_COLORS
      }
    });

    this.holdersChart = c3.generate({
      bindto: '#holders-chart .chart',
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

    // Get # files, # dirs scanned at a certain path
    this.totalFilesProgressbar.showIndeterminate();
    this.totalDirsProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findOne({where: {path: this.selectedPath()}}))
      .then((row) => {
        const files_count = row.type === 'directory' ? row.files_count : 1;
        const dirs_count = row.type === 'directory' ? row.dirs_count : 0;
        this.totalFilesScanned.text(files_count);
        this.totalDirsScanned.text(dirs_count);
        this.totalFilesProgressbar.hide();
        this.totalDirsProgressbar.hide();
      });

    // Get total unique copyright holders detected at a certain path
    this.uniqueHoldersProgressbar.showIndeterminate();
    this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Copyright.findAll({where: {fileId: fileIds}}))
        .then((copyrights) => copyrights.map((val) => val.holders))
        .then((holders) => holders.map((val) => val.pop()))
        .then((holders) => this.uniqueHolders.text(new Set(holders).size)))
      .then(() => this.uniqueHoldersProgressbar.hide());

    // Get unique programming languages detected
    this.sourceLanguageChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.programming_language ? val.programming_language : 'No Value Detected')) 
      .then((langs) => FileDashboard.formatData(langs))
      .then((langs) => FileDashboard.limitData(langs, LEGEND_LIMIT));

    // Get file (mime) type data
    this.fileTypeChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.mime_type ? val.mime_type : 'No Value Detected')) 
      .then((types) => FileDashboard.formatData(types))
      .then((types) => FileDashboard.limitData(types, LEGEND_LIMIT));

      
    this.holdersChartData = this.db().sync
      .then((db) => db.File.findAll({where: {path: {$like: `${this.selectedPath()}%`}}}))
      .then((files) => files.map((val) => val.id))
      .then((fileIds) => this.db().sync
        .then((db) => db.Copyright.findAll({where: {fileId: fileIds}}))
        .then((copyrights) => copyrights.map((val) => val.holders ? val.holders : 'No Value Detected'))
        .then((holders) => FileDashboard.formatData(holders))
        .then((holders) => FileDashboard.limitData(holders, LEGEND_LIMIT)));
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
    this.fileTypeChartProgressbar.showIndeterminate();
    this.fileTypeChartData
      .then((data) => this.fileTypeChart.load({
        columns: data,
        unload: true,
        done: () => {
          this.fileTypeChartProgressbar.hide();
          this.fileTypeChart.hide('No Value Detected');
          this.fileTypeChart.flush();
        }
      }));

    // Get license keys detected
    this.holdersChartProgressbar.showIndeterminate();
    this.holdersChartData
      .then((data) => this.holdersChart.load({
        columns: data,
        unload:true,
        done: () => {
          this.holdersChartProgressbar.hide();
          this.holdersChart.hide('No Value Detected');
          this.holdersChart.flush();
        }
      }));
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

module.exports = FileDashboard;
