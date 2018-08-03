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
      namespace: DataTypes.STRING,
      name: DataTypes.STRING,
      version: DataTypes.STRING,
      qualifiers: DataTypes.STRING,
      subpath: DataTypes.STRING,
      primary_language: DataTypes.STRING,
      code_type: DataTypes.STRING,
      description: DataTypes.STRING,
      size: DataTypes.INTEGER,
      release_date: DataTypes.STRING,
      parties: jsonDataType('parties'),
      keywords: jsonDataType('keywords'),
      homepage_url: DataTypes.STRING,
      download_url: DataTypes.STRING,
      download_checksums: jsonDataType('download_checksums'),
      bug_tracking_url: DataTypes.STRING,
      code_view_url: DataTypes.STRING,
      vcs_tool: DataTypes.STRING,
      vcs_repository: DataTypes.STRING,
      vcs_revision: DataTypes.STRING,
      copyright: DataTypes.STRING,
      license_expression: DataTypes.STRING,
      declared_licensing: DataTypes.STRING,
      notice_text: DataTypes.STRING,
      dependencies: jsonDataType('dependencies'),
      related_packages: jsonDataType('related_packages')
    },
    {
      timestamps: false
    });
};
