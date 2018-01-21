/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
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

const {jsonDataType} = require('./databaseUtils');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'packages',
        {
            type: DataTypes.STRING,
            name: DataTypes.STRING,
            version: DataTypes.STRING,
            primary_language: DataTypes.STRING,
            packaging: DataTypes.STRING,
            summary: DataTypes.STRING,
            description: DataTypes.STRING,
            payload_type: DataTypes.STRING,
            size: DataTypes.INTEGER,
            release_date: DataTypes.STRING,
            authors: jsonDataType("authors"),
            maintainers: jsonDataType("maintainers"),
            contributors: jsonDataType("contributors"),
            owners: jsonDataType("owners"),
            packagers: jsonDataType("packagers"),
            distributors: jsonDataType("distributors"),
            vendors: jsonDataType("vendors"),
            keywords: jsonDataType("keywords"),
            keywords_doc_url: DataTypes.STRING,
            metafile_locations: jsonDataType("metafile_locations"),
            metafile_urls: jsonDataType("metafile_urls"),
            homepage_url: DataTypes.STRING,
            notes: DataTypes.STRING,
            download_urls: jsonDataType("download_urls"),
            download_sha1: DataTypes.STRING,
            download_sha256: DataTypes.STRING,
            download_md5: DataTypes.STRING,
            bug_tracking_url: DataTypes.STRING,
            support_contacts: jsonDataType("support_contacts"),
            code_view_url: DataTypes.STRING,
            vcs_tool: DataTypes.STRING,
            vcs_repository: DataTypes.STRING,
            vcs_revision: DataTypes.STRING,
            copyright_top_level: DataTypes.STRING,
            copyrights: jsonDataType("copyrights"),
            asserted_licenses: jsonDataType("asserted_licenses"),
            legal_file_locations: jsonDataType("legal_file_locations"),
            license_expression: DataTypes.STRING,
            license_texts: jsonDataType("license_texts"),
            notice_texts: jsonDataType("notice_texts"),
            dependencies: jsonDataType("dependencies"),
            related_packages: jsonDataType("related_packages")
        },
        {
            timestamps: false
        });
};