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
    'conclusions',
    {
      path: DataTypes.STRING,
      review_status: DataTypes.STRING,
      name: DataTypes.STRING,
      version: DataTypes.STRING,
      license_expression: jsonDataType('license_expression'),
      copyrights: jsonDataType('copyrights'),
      owner: DataTypes.STRING,
      code_type: DataTypes.STRING,
      is_modified: DataTypes.BOOLEAN,
      is_deployed: DataTypes.BOOLEAN,
      feature: DataTypes.STRING,
      purpose: DataTypes.STRING,
      homepage_url: DataTypes.STRING,
      download_url: DataTypes.STRING,
      license_url: DataTypes.STRING,
      notice_url: DataTypes.STRING,
      programming_language: DataTypes.STRING,
      notes: DataTypes.STRING
    },
    {
      getterMethods: {
        copyright: function() {
          return $.map(this.copyrights, (copyright) => {
            return copyright.statements.join(' ');
          }).join('\n');
        }
      }
    });
};
