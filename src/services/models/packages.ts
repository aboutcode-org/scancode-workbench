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

import { Sequelize, StringDataType, IntegerDataType, DataTypes, Model } from 'sequelize';
import { jsonDataType, JSON_Type } from './databaseUtils';

export interface PackagesAttributes {
  id: IntegerDataType;
  type: StringDataType,
  namespace: StringDataType | null,
  name: StringDataType,
  version: StringDataType | null,
  qualifiers: JSON_Type,
  subpath: StringDataType | null,
  primary_language: StringDataType | null,
  description: StringDataType | null,
  release_date: StringDataType | null,
  parties: JSON_Type,
  keywords: JSON_Type,
  homepage_url: StringDataType | null,
  download_url: StringDataType | null,
  size: StringDataType | null,
  sha1: StringDataType | null,
  md5: StringDataType | null,
  sha256: StringDataType | null,
  sha512: StringDataType | null,
  bug_tracking_url: StringDataType | null,
  code_view_url: StringDataType | null,
  vcs_url: StringDataType | null,
  copyright: StringDataType | null,
  declared_license_expression: StringDataType | null,
  declared_license_expression_spdx: StringDataType | null,
  other_license_expression: StringDataType | null,
  other_license_expression_spdx: StringDataType | null,
  extracted_license_statement: JSON_Type | null,
  notice_text: StringDataType | null,
  source_packages: JSON_Type,
  extra_data: JSON_Type,
  repository_homepage_url: StringDataType | null,
  repository_download_url: StringDataType | null,
  api_data_url: StringDataType | null,
  package_uid: StringDataType,
  datafile_paths: JSON_Type,
  datasource_ids: JSON_Type,
  purl: StringDataType,
}

export default function packagesModel(sequelize: Sequelize) {
  return sequelize.define<Model<PackagesAttributes>>(
    'packages',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: DataTypes.STRING,
      namespace: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      name: DataTypes.STRING,
      version: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      qualifiers: jsonDataType('qualifiers'),
      subpath: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      primary_language: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      release_date: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      parties: jsonDataType('parties'),
      keywords: jsonDataType('keywords'),
      homepage_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      download_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      size: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      sha1: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      md5: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      sha256: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      sha512: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      bug_tracking_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      code_view_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      vcs_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      copyright: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      declared_license_expression: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      declared_license_expression_spdx: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      other_license_expression: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      other_license_expression_spdx: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      extracted_license_statement: jsonDataType('extracted_license_statement'),
      notice_text: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      source_packages: jsonDataType('source_packages'),
      extra_data: jsonDataType('extra_data'),
      repository_homepage_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      repository_download_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      api_data_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      package_uid: DataTypes.STRING,
      datafile_paths: jsonDataType('datafile_paths'),
      datasource_ids: jsonDataType('datasource_ids'),
      purl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false
    });
}