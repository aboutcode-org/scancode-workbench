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

import { Sequelize, DataTypes, IntegerDataType, StringDataType, Model } from 'sequelize';
import { JSON_Type, jsonDataType } from './databaseUtils';

export interface HeaderAttributes {
  id: IntegerDataType,
  tool_name: StringDataType,
  tool_version: StringDataType,
  notice: StringDataType,
  duration: DataTypes.DoubleDataType,
  header_content: StringDataType,
  options: JSON_Type,
  input: JSON_Type,
  files_count: IntegerDataType,
  output_format_version: StringDataType,
  spdx_license_list_version: StringDataType,
  operating_system: StringDataType,
  cpu_architecture: StringDataType,
  platform: StringDataType,
  platform_version: StringDataType,
  python_version: StringDataType,
  workbench_version: StringDataType,
  workbench_notice: StringDataType,
}

export default function headerModel(sequelize: Sequelize) {
  return sequelize.define<Model<HeaderAttributes>>(
    'headers',
    {
      // @TODO: The notices and versions should be in their own table
      // See https://github.com/nexB/aboutcode/issues/7

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tool_name: DataTypes.STRING,
      tool_version: DataTypes.STRING,
      notice: DataTypes.STRING,
      duration: DataTypes.DOUBLE,
      options: jsonDataType('options'),
      input: jsonDataType('input'),
      header_content: DataTypes.STRING,
      files_count: DataTypes.INTEGER,
      output_format_version: {
        type: DataTypes.STRING,
        defaultValue: '0.1.0',
      },
      spdx_license_list_version: {
        type: DataTypes.STRING,
        defaultValue: '1.00',
      },
      operating_system: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      cpu_architecture: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      platform: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      platform_version: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      python_version: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      workbench_version: DataTypes.STRING,
      workbench_notice: {
        type: DataTypes.STRING,
        defaultValue: 'None',
      },
    });
}