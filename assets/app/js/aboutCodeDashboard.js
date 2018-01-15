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

const LEGEND_COLORS = [
    "#A0D468",
    "#FFCE54",
    "#EC87C0",
    "#48CFAD",
    "#AC92EC",
    "#4FC1E9",
    "#AAB2BD",
    "#3D7AFC"
];

const LEGEND_LIMIT = 8;

// Dashboard with summary
class AboutCodeDashboard {
    constructor(dashboardId, aboutCodeDB) {
        this.totalFilesScanned = $("#total-files .title");
        this.uniqueLicenses = $("#unique-licenses .title");
        this.uniqueCopyrights = $("#unique-copyrights .title");
        this.totalPackages = $("#total-packages .title");

        this.sourceLanguageChart = c3.generate({
            bindto: "#source-chart .chart",
            data: {
                columns: [],
                type: "pie",
                order: 'desc',
            },
            color: {
                pattern: LEGEND_COLORS
            },
        });

        this.licenseCategoryChart = c3.generate({
                bindto: "#license-category-chart .chart",
                data: {
                    columns: [],
                    type: "pie",
                    order: 'desc',
                },
                color: {
                    pattern: LEGEND_COLORS
                }
        });

        this.licenseKeyChart = c3.generate({
                bindto: "#license-key-chart .chart",
                data: {
                    columns: [],
                    type: "pie",
                    order: 'desc',
                },
                color: {
                    pattern: LEGEND_COLORS
                }
        });

        this.packagesTypeChart = c3.generate({
                bindto: "#packages-type-chart .chart",
                data: {
                    columns: [],
                    type: "bar",
                    order: 'desc',
                },
                color: {
                    pattern: LEGEND_COLORS
                }
        });

        this.dashboardId = dashboardId;
        this.database(aboutCodeDB);
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;

        // Get total files scanned
        const totalFilesProgressbar =
            new Progress("#total-files .title", {size: 25});
        totalFilesProgressbar.showIndeterminate();
        this.aboutCodeDB.db
            .then(() => this.aboutCodeDB.ScanCode.findOne({ attributes: ["files_count"] }))
            .then(row => this.totalFilesScanned.text(row ? row.files_count : "0"))
            .then(() => totalFilesProgressbar.hide());

        // Get total unique licenses detected
        const uniqueLicensesProgressbar =
            new Progress("#unique-licenses .title", {size: 25});
        uniqueLicensesProgressbar.showIndeterminate();
        this.aboutCodeDB.db
            .then(() => this.aboutCodeDB.License.aggregate("key", "DISTINCT", {plain: false}))
            .then(row => this.uniqueLicenses.text(row ? row.length : "0"))
            .then(() => uniqueLicensesProgressbar.hide());

        // Get total unique copyright statements detected
        const uniqueCopyrightsProgressbar =
            new Progress("#unique-copyrights .title", {size: 25});
        uniqueCopyrightsProgressbar.showIndeterminate();
        this.aboutCodeDB.db
            .then(() => this.aboutCodeDB.Copyright.aggregate("holders", "DISTINCT", { plain: false }))
            .then(row => this.uniqueCopyrights.text(row ? row.length : "0"))
            .then(() => uniqueCopyrightsProgressbar.hide());

        // Get total number of packages detected
        const totalPackagesProgressbar =
            new Progress("#total-packages .title", {size: 25});
        totalPackagesProgressbar.showIndeterminate();
        this.aboutCodeDB.db
            .then(() => this.aboutCodeDB.Package.count("type"))
            .then(count => this.totalPackages.text(count ? count : "0"))
            .then(() => totalPackagesProgressbar.hide());

        // Get unique programming languages detected
        const sourceLanguageChartProgressbar =
            new Progress("#source-chart .content", {size: 50});
        sourceLanguageChartProgressbar.showIndeterminate();
        this._loadData("programming_language")
            .then(data => this.sourceLanguageChart.load({
                    columns: data,
                    unload: true,
                    done: () => {
                        this.sourceLanguageChart.hide('No Value Detected');
                        sourceLanguageChartProgressbar.hide();
                    }
                }));

        // Get license categories detected
        const licenseCategoryChartProgressbar =
            new Progress("#license-category-chart .content", {size: 50});
        licenseCategoryChartProgressbar.showIndeterminate();
        this._loadData("license_category")
            .then(data => this.licenseCategoryChart.load({
                    columns: data,
                    unload: true,
                    done: () => {
                        this.licenseCategoryChart.hide('No Value Detected');
                        licenseCategoryChartProgressbar.hide();
                    }
                }))

        // Get license keys detected
        const licenseKeyChartProgressbar =
            new Progress("#license-key-chart .content", {size: 50});
        licenseKeyChartProgressbar.showIndeterminate();
        this._loadData("license_key")
            .then(data => this.licenseKeyChart.load({
                    columns: data,
                    unload:true,
                    done: () => {
                        this.licenseKeyChart.hide('No Value Detected');
                        licenseKeyChartProgressbar.hide();
                    }
                }))

        // Get package types detected
        const packagesTypeChartProgressbar =
            new Progress("#packages-type-chart .content", {size: 50});
        packagesTypeChartProgressbar.showIndeterminate();
        this._loadData("packages_type")
            .then(data => this.packagesTypeChart.load({
                columns: data,
                unload: true,
                done: () => {
                    this.packagesTypeChart.hide('No Value Detected');
                    packagesTypeChartProgressbar.hide();
                }
            }));
    }

    _loadData(attribute, parentPath) {
        let where = {
            $and: [{
                type: {
                    $eq: "file"
                }
            }]
        };

        if (parentPath) {
            where.path.$and.append({$like: `${parentPath}%`});
        }

        return this.aboutCodeDB.db.then(() => {
            return this.aboutCodeDB.FlattenedFile
                .findAll({
                    attributes: [
                        Sequelize.fn("TRIM", Sequelize.col(attribute)),
                        attribute
                    ],
                    where: where
                })
                .then(data => AboutCodeDashboard.getAttributeValues(data, attribute))
                .then(data => AboutCodeDashboard.formatData(data))
                .then(data => AboutCodeDashboard.limitData(data, LEGEND_LIMIT));
        });
    }

    static limitData(data, limit) {
        // TODO: Use partitioning (like in quicksort) to find top "limit"
        // more efficiently.
        // Sort data by count
        return data.sort((a,b) => (a[1] > b[1]) ? 1 : -1)
            .map((dataPair, i) => {
                if (data.length - i >= limit) {
                    return ["other", dataPair[1]];
                } else {
                    return dataPair;
                }
            });
    }

    // Formats data for c3: [[key1, count1], [key2, count2], ...]
    static formatData(names) {
        // Sum the total number of times the name appears
        let count = {};
        $.each(names, function(i, name){
            count[name] = count[name] + 1 || 1;
        });

        // Transform license count into array of objects with license name & count
        return $.map(count, function(val, key) {
            return [[key, val]];
        });
    }

    // Map each row to the given attribute value, and sanitize invalid values.
    static getAttributeValues(values, attribute) {
        const validatedValues = [];
        let attributeValue = null;

        for (let i = 0; i < values.length; i++) {
            attributeValue = values[i][attribute];

            if (!Array.isArray(attributeValue) || attributeValue.length === 0){
                attributeValue = [attributeValue];
            }

            for (let j = 0; j < attributeValue.length; j++) {
                validatedValues.push(
                    AboutCodeDashboard.isValid(attributeValue[j]) ?
                        attributeValue[j] : "No Value Detected");
            }
        }
        return validatedValues;
    }

    static isValid(value) {
        if (Array.isArray(value)) {
            return value.length > 0
                && value.every((element) => AboutCodeDashboard.isValid(element));
        } else {
            return value !== null;
        }
    }
 }