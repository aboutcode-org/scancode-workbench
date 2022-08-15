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

export interface PackageDataAttributes {
  id: DataTypes.IntegerDataType,
  fileId: DataTypes.IntegerDataType,
  type: DataTypes.StringDataType,
  namespace: DataTypes.StringDataType,
  name: DataTypes.StringDataType,
  version: DataTypes.StringDataType,
  qualifiers: DataTypes.StringDataType,
  subpath: DataTypes.StringDataType,
  purl: DataTypes.StringDataType,
  primary_language: DataTypes.StringDataType,
  code_type: DataTypes.StringDataType,
  description: DataTypes.StringDataType,
  size: DataTypes.IntegerDataType,
  release_date: DataTypes.StringDataType,
  parties: DataTypes.StringDataType,
  keywords: DataTypes.StringDataType,
  homepage_url: DataTypes.StringDataType,
  download_url: DataTypes.StringDataType,
  download_checksums: DataTypes.StringDataType,
  bug_tracking_url: DataTypes.StringDataType,
  code_view_url: DataTypes.StringDataType,
  vcs_tool: DataTypes.StringDataType,
  vcs_repository: DataTypes.StringDataType,
  vcs_revision: DataTypes.StringDataType,
  copyright: DataTypes.StringDataType,
  license_expression: DataTypes.StringDataType,
  declared_licensing: DataTypes.StringDataType,
  notice_text: DataTypes.StringDataType,
  dependencies: DataTypes.StringDataType,
  related_packages: DataTypes.StringDataType,
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
      license_expression: DataTypes.STRING,
      declared_licensing: DataTypes.STRING,
      notice_text: DataTypes.STRING,
      dependencies: jsonDataType('dependencies'),
      related_packages: jsonDataType('related_packages')
    },
    {
      timestamps: false
    });
}