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
const Progress = require('./helpers/progress');
const BarChart = require('./helpers/barChart');
const Utils = require('./helpers/utils');
const AboutCodeClueDataTable = require('./aboutCodeClueDataTable');

// Bar chart summary for AboutCode scan data
class AboutCodeBarChart {
    constructor(barChartId, aboutCodeDB) {
        this.barChartId = barChartId;
        this.aboutCodeDB = aboutCodeDB;
        this.handlers = {};

        this.progressBar = new Progress("#barchart-view .svg-container", {size: 100});

        this.chartOptions = {
            name: "License Summary",
            margin: 30,
            barHeight: 25,
            xAxisName: "License Count",
            yAxisName: "License Name"
        };

        this.chartAttributesSelect = $("select#select-chart-attribute");
        this.barChartTotalFiles = $("span.total-files");

        this.chartAttributesSelect.select2({ placeholder: "Select an attribute" });

        // Populate bar chart summary select box values
        $.each(AboutCodeClueDataTable.TABLE_COLUMNS, (i, column) => {
            if (column.bar_chart_class) {
                this.chartAttributesSelect.append(
                    `<option class="${column.bar_chart_class}" value="${column.name}">${column.title}</option>`);
            }
        });

        this.chartAttributesSelect.on( "change", () => this.showSummary());

        $(".bar-chart-copyrights").wrapAll(`<optgroup label="Copyright Information"/>`);
        $(".bar-chart-licenses").wrapAll(`<optgroup label="License Information"/>`);
        $(".bar-chart-emails").wrapAll(`<optgroup label="Email Information"/>`);
        $(".bar-chart-file-infos").wrapAll(`<optgroup label="File Information"/>`);
        $(".bar-chart-package-infos").wrapAll(`<optgroup label="Package Information"/>`);

        this.reload();
    }

    on(event, handler) {
        this.handlers[event] = handler;
        return this;
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    reload() {
        this.aboutCodeDB
            .getFileCount()
            .then(value => this.barChartTotalFiles.text(value));

        this.barChart = new BarChart([], this.chartOptions, this.barChartId);
    }

    draw() {
        this.showSummary();
    }

    showSummary() {
        if (this.chartAttributesSelect.val()) {
            this._showSummary(this.chartAttributesSelect.val());
        }
    }

    _showSummary(attribute) {
        let query = {
            attributes: [Sequelize.fn("TRIM", Sequelize.col(attribute)), attribute]
        };

        // Allow the query to be intercepted and modified by the caller.
        this.handlers['query-interceptor'](query);

        this.progressBar.showIndeterminate();
        return this.aboutCodeDB.sync
            .then(db => db.FlatFile.findAll(query))
            .then(values => Utils.getAttributeValues(values, attribute))
            .then(values => {
                this.progressBar.hide();
                return values;
            })
            .catch(err => {
                this.progressBar.hide();
                throw err;
            })
            .then(values => {
                this.barChart = new BarChart(values, this.chartOptions, this.barChartId);
                if (this.handlers['bar-clicked']) {
                    const that = this;
                    const chartElement = $("#summary-bar-chart");
                    chartElement.find("rect").click(function () {
                        const attribute =  that.chartAttributesSelect.val();
                        const value = $(this).data("value");
                        that.handlers['bar-clicked'](attribute, value);
                    });
                    chartElement.find(".y.axis .tick").click(function () {
                        const attribute =  that.chartAttributesSelect.val();
                        const value = $(this).data("value");
                        that.handlers['bar-clicked'](attribute, value);
                    });
                }
            });
    }
}

module.exports = AboutCodeBarChart;