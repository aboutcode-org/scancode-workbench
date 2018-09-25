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
const Progress = require('../helpers/progress');
const BarChart = require('../helpers/barChart');
const Utils = require('../helpers/utils');
const AboutCodeScanDataTable = require('./aboutCodeScanDataTable');
const Controller = require('./controller');

// There must be an svg element within the container element with this class
const BARCHART = 'svg.barchart';

/**
 * Bar chart summary for AboutCode scan data
 */
class AboutCodeBarChart extends Controller {
  constructor(containerId, aboutCodeDB) {
    super(containerId, aboutCodeDB);

    this.chartOptions = {
      name: 'License Summary',
      margin: 30,
      barHeight: 25,
      xAxisName: 'License Count',
      yAxisName: 'License Name'
    };

    this.barChart = new BarChart([], this.chartOptions, this.barchartSelector());

    this.progressBar = new Progress('#barchart-view .svg-container', {size: 100});

    this.chartAttributesSelect = $('select#select-chart-attribute');
    this.barChartTotalFiles = $('span.total-files');

    this.chartAttributesSelect.select2({ placeholder: 'Select an attribute' });

    // Populate bar chart summary select box values
    $.each(AboutCodeScanDataTable.TABLE_COLUMNS, (i, column) => {
      if (column.bar_chart_class) {
        this.chartAttributesSelect.append(
          `<option class="${column.bar_chart_class}" value="${column.name}">${column.title}</option>`);
      }
    });

    $('.bar-chart-copyrights').wrapAll(`<optgroup label="Copyright Information"/>`);
    $('.bar-chart-licenses').wrapAll(`<optgroup label="License Information"/>`);
    $('.bar-chart-emails').wrapAll(`<optgroup label="Email Information"/>`);
    $('.bar-chart-file-infos').wrapAll(`<optgroup label="File Information"/>`);
    $('.bar-chart-package-infos').wrapAll(`<optgroup label="Package Information"/>`);

    this.chartAttributesSelect.val([]);

    this.chartAttributesSelect.on('change', () => {
      this.needsReload(true);
      this.redraw();
    });
  }

  barchartSelector() {
    return `${this.id()} ${BARCHART}`;
  }

  reload() {
    this.needsReload(false);

    this.db().sync
      .then((db) => db.File.findOne({where: {path: this.selectedPath()}}))
      .then((file) => this.barChartTotalFiles.text(file.files_count));

    if (this.chartAttributesSelect.val()) {
      const attribute = this.chartAttributesSelect.val();
      const query = {
        attributes: [Sequelize.fn('TRIM', Sequelize.col(attribute)), attribute],
        where: { 
          path: { $like: `${this.selectedPath()}%` },
          type: { $ne: 'directory' },
        }
      };
      

      this.progressBar.showIndeterminate();
      this.barChartData = this.db().sync
        .then((db) => db.FlatFile.findAll(query))
        .then((values) => Utils.getAttributeValues(values, attribute))
        .then((values) => {
          this.progressBar.hide();
          return values;
        })
        .catch((err) => {
          this.progressBar.hide();
          throw err;
        });
    } else {
      this.barChartData = Promise.resolve([]);
    }
  }

  redraw() {
    if (this.needsReload()) {
      this.reload();
    }

    this.barChartData
      .then((values) => {
        this.barChart = new BarChart(
          values, this.chartOptions, this.barchartSelector());
        const that = this;
        const chartElement = $(this.barchartSelector());
        chartElement.find('rect').click(function () {
          const attribute =  that.chartAttributesSelect.val();
          const value = $(this).data('value');
          that.getHandler('bar-clicked')(attribute, value);
        });
        chartElement.find('.y.axis .tick').click(function () {
          const attribute =  that.chartAttributesSelect.val();
          const value = $(this).data('value');
          that.getHandler('bar-clicked')(attribute, value);
        });

        // This is needed to give the dom time to set the bounds of
        // the barchart element.
        setTimeout(() => this.barChart.redraw(), 0);
      });
  }
}

module.exports = AboutCodeBarChart;
