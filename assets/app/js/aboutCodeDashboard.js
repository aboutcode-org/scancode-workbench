/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # http://nexb.com and https://github.com/nexB/aboutcode-manager/
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

        this.dashboardId = dashboardId;
        this.database(aboutCodeDB);

        this.sourceLanguageChart = c3.generate({
            bindto: "#source-chart",
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
                bindto: "#license-category-chart",
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
                bindto: "#license-key-chart",
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
                bindto: "#packages-type-chart",
                data: {
                    columns: [],
                    type: "bar",
                    order: 'desc',
                },
                color: {
                    pattern: LEGEND_COLORS
                }
        });
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;

        // Get total files scanned
        this.aboutCodeDB.db.then(() => {
            return this.aboutCodeDB.ScanCode
                .findOne({ attributes: ["files_count"] })
                .then(row => this.totalFilesScanned.text(row ? row.files_count : "0"));
        });

        // Get total unique licenses detected
        this.aboutCodeDB.db.then(() => {
            return this.aboutCodeDB.License
                .aggregate("key", "DISTINCT", {plain: false})
                .then(row => this.uniqueLicenses.text(row ? row.length : "0"));
        });

        // Get total unique copyright statements detected
        this.aboutCodeDB.db.then(() => {
            return this.aboutCodeDB.Copyright
                .aggregate("holders", "DISTINCT", { plain: false })
                .then(row => this.uniqueCopyrights.text(row ? row.length : "0"));
        });

        // Get total number of packages detected
        this.aboutCodeDB.db.then(() => {
            return this.aboutCodeDB.Package.count("type")
                .then(count => this.totalPackages.text(count ? count : "0"));
        });

        // Get unique programming languages detected
        this.sourceLanguageData = this._loadData("programming_language");

        // Get license categories detected
        this.licenseCategoryData = this._loadData("license_category");

        // Get license keys detected
        this.licenseKeyData = this._loadData("license_key");

        // Get package types detected
        this.packagesTypeData = this._loadData("packages_type");
    }

    reload() {
        this.sourceLanguageData
            .then(data => this.sourceLanguageChart.load({
                columns: data,
                unload: true,
                done: () => {
                    this.sourceLanguageChart.legend.show();
                    this.sourceLanguageChart.hide('No Value Detected');
                }
            }));

        this.licenseCategoryData
            .then(data => this.licenseCategoryChart.load({
                columns: data,
                unload: true,
                done: () => {
                    this.licenseCategoryChart.legend.show();
                    this.licenseCategoryChart.hide('No Value Detected');
                }
            }));

        this.licenseKeyData
            .then(data => this.licenseKeyChart.load({
                columns: data,
                unload:true,
                done: () => {
                    this.licenseKeyChart.legend.show();
                    this.licenseKeyChart.hide('No Value Detected');
                }
            }));

        this.packagesTypeData
            .then(data => this.packagesTypeChart.load({
                columns: data,
                unload: true,
                done: () => {
                    this.packagesTypeChart.legend.show();
                    this.packagesTypeChart.hide('No Value Detected');
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