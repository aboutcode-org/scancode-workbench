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


// Dashboard with summary
 class AboutCodeDashboard {
    constructor(dashboardId, aboutCodeDB) {
        this.totalFilesScanned = $("#total-files .title");
        this.uniqueLicenses = $("#unique-licenses .title");
        this.uniqueCopyrights = $("#unique-copyrights .title");
        this.totalPackages = $("#total-packages .title");

        this.dashboardId = dashboardId;
        this.aboutCodeDB = aboutCodeDB;
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    reload() {
        // Get total number of files scanned
        this.aboutCodeDB.ScanCode
            .findOne({
                attributes: ["files_count"]
            })
            .then((row) => {
                const fileCount = row.files_count;
                if (fileCount) {
                    this.totalFilesScanned.text(fileCount);
                } else {
                    this.totalFilesScanned.text("0");
                }
            });

        // Get total unique licenses detected
        this.aboutCodeDB.License.aggregate("key", "DISTINCT", { plain: false })
            .then((row) => {
                const uniqueLicenseCount = row.length;
                if (uniqueLicenseCount) {
                    this.uniqueLicenses.text(uniqueLicenseCount);
                } else {
                    this.uniqueLicenses.text("0");
                }
            });

        // Get total unique copyright statements detected
        this.aboutCodeDB.Copyright.aggregate("statements", "DISTINCT", { plain: false })
            .then((row) => {
                const uniqueCopyrightCount = row.length;
                if (uniqueCopyrightCount) {
                    this.uniqueCopyrights.text(uniqueCopyrightCount);
                } else {
                    this.uniqueCopyrights.text("0");
                }
            });

        // Get total number of packages detected
        this.aboutCodeDB.Package.count("type")
            .then((row) => {
                if (row) {
                    this.totalPackages.text(row);
                } else {
                    this.totalPackages.text("0");
                }
            });
    }
 }