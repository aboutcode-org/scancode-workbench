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

import { Sequelize, StringDataType, IntegerDataType, DataTypes, Model, Optional } from 'sequelize';
import { jsonDataType, JSON_Type } from './databaseUtils';

export interface LicenseExpressionAttributes {
  id: IntegerDataType,
  fileId: IntegerDataType,
  license_expression: StringDataType
  license_expression_spdx: StringDataType,
  license_keys: JSON_Type,
  license_keys_spdx: JSON_Type,
}

export type OptionalLicenseExpressionAttributes =
  Optional<LicenseExpressionAttributes, 'license_expression'>

export default function licenseExpressionModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseExpressionAttributes, OptionalLicenseExpressionAttributes>>(
    'license_expressions',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.INTEGER,
      license_expression: DataTypes.STRING,
      license_expression_spdx: DataTypes.STRING,
      license_keys: jsonDataType('license_keys'),
      license_keys_spdx: jsonDataType('license_keys_spdx'),
    },
    {
      timestamps: false
    });
}