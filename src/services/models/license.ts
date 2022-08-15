/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-workbench/
 # The ScanCode Workbench software is licensed under the Apache License version 2.0.
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


import { Sequelize, DataTypes, Model } from 'sequelize';
import { jsonDataType } from './databaseUtils';

export interface LicenseAttributes {
  id: DataTypes.IntegerDataType,
  fileId: DataTypes.IntegerDataType,
  key: DataTypes.StringDataType,
  score: DataTypes.IntegerDataType,
  short_name: DataTypes.StringDataType,
  category: DataTypes.StringDataType,
  is_unknown: boolean,
  owner: DataTypes.StringDataType,
  homepage_url: DataTypes.StringDataType,
  text_url: DataTypes.StringDataType,
  reference_url: DataTypes.StringDataType,
  spdx_license_key: DataTypes.StringDataType,
  spdx_url: DataTypes.StringDataType,
  start_line: DataTypes.IntegerDataType,
  end_line: DataTypes.IntegerDataType,
  matched_rule: DataTypes.StringDataType
}

export default function licenseModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseAttributes>>(
    'licenses',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.INTEGER,
      key: DataTypes.STRING,
      score: DataTypes.INTEGER,
      short_name: DataTypes.STRING,
      category: DataTypes.STRING,
      is_unknown: { type: DataTypes.BOOLEAN, defaultValue: false },
      owner: DataTypes.STRING,
      homepage_url: DataTypes.STRING,
      text_url: DataTypes.STRING,
      reference_url: DataTypes.STRING,
      spdx_license_key: DataTypes.STRING,
      spdx_url: DataTypes.STRING,
      start_line: DataTypes.INTEGER,
      end_line: DataTypes.INTEGER,
      matched_rule: jsonDataType('matched_rule')
    },
    {
      timestamps: false
    });
}