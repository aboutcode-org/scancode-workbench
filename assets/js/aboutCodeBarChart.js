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


// Bar chart summary for AboutCode scan data
class AboutCodeBarChart {
    constructor(barChartId, aboutCodeDB) {
        this.barChartId = barChartId;
        this.aboutCodeDB = aboutCodeDB;

        this.chartOptions = {
            name: "License Summary",
            margin: 30,
            barHeight: 25,
            xAxisName: "License Count",
            yAxisName: "License Name"
        };

        this.barChart = new BarChart([], this.chartOptions, this.barChartId);

    }

    draw() {
        this.barChart.draw();
    }

    showLicenseSummary(attribute) {
        return this.aboutCodeDB.getLicenseValues(attribute)
            .then((values) => {
                this.barChart = new BarChart(values, this.chartOptions, this.barChartId);
            });
    }

    showCopyrightSummary(attribute) {
        return this.aboutCodeDB.getCopyrightValues(attribute)
            .then((values) => {
                this.barChart = new BarChart(values, this.chartOptions, this.barChartId);
            });
    }
}