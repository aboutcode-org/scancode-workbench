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
import { jsonDataType, JSON_Type } from './databaseUtils';

export interface PackageDataAttributes {
  id: IntegerDataType,
  fileId: IntegerDataType,
  type: StringDataType,
  namespace: StringDataType,
  name: StringDataType,
  version: StringDataType,
  qualifiers: JSON_Type,
  subpath: StringDataType,
  purl: StringDataType,
  primary_language: StringDataType,
  code_type: StringDataType,  // @QUERY - Does exist ?
  description: StringDataType,
  size: IntegerDataType,
  release_date: StringDataType,
  parties: JSON_Type,
  keywords: JSON_Type,
  homepage_url: StringDataType,
  download_url: StringDataType,
  download_checksums: JSON_Type,
  bug_tracking_url: StringDataType,
  code_view_url: StringDataType,
  vcs_tool: StringDataType,
  vcs_repository: StringDataType,
  vcs_revision: StringDataType,
  copyright: StringDataType,
  declared_license_expression: StringDataType,
  declared_license_expression_spdx: StringDataType,
  extracted_license_statement: StringDataType,
  notice_text: StringDataType,
  dependencies: JSON_Type,
  related_packages: JSON_Type,  // @QUERY - Does exist ?
}

export default function packageDataModel(sequelize: Sequelize) {
  return sequelize.define<Model<PackageDataAttributes>>(
    'package_data',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      namespace: DataTypes.STRING,
      name: DataTypes.STRING,
      version: DataTypes.STRING,
      qualifiers: jsonDataType('qualifiers'),
      subpath: DataTypes.STRING,
      purl: DataTypes.STRING,
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
      declared_license_expression: DataTypes.STRING,
      declared_license_expression_spdx: DataTypes.STRING,
      extracted_license_statement: DataTypes.STRING,
      notice_text: DataTypes.STRING,
      dependencies: jsonDataType('dependencies'),
      related_packages: jsonDataType('related_packages')    // @QUERY - Does exist ?
    },
    {
      timestamps: false
    });
}