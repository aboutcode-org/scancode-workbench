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

import { Sequelize, DataTypes, Model, AbstractDataType } from 'sequelize';
import { jsonDataType } from './databaseUtils';

export interface PackagesAttributes {
  id: DataTypes.IntegerDataType;
  type: DataTypes.StringDataType,
  namespace: DataTypes.StringDataType | null,
  name: DataTypes.StringDataType,
  version: DataTypes.StringDataType | null,
  qualifiers: AbstractDataType,
  subpath: DataTypes.StringDataType | null,
  primary_language: DataTypes.StringDataType | null,
  description: DataTypes.StringDataType | null,
  release_date: DataTypes.StringDataType | null,
  parties: AbstractDataType,
  keywords: AbstractDataType,
  homepage_url: DataTypes.StringDataType | null,
  download_url: DataTypes.StringDataType | null,
  size: DataTypes.StringDataType | null,
  sha1: DataTypes.StringDataType | null,
  md5: DataTypes.StringDataType | null,
  sha256: DataTypes.StringDataType | null,
  sha512: DataTypes.StringDataType | null,
  bug_tracking_url: DataTypes.StringDataType | null,
  code_view_url: DataTypes.StringDataType | null,
  vcs_url: DataTypes.StringDataType | null,
  copyright: DataTypes.StringDataType | null,
  license_expression: DataTypes.StringDataType | null,
  declared_license: AbstractDataType | null,
  notice_text: DataTypes.StringDataType | null,
  source_packages: AbstractDataType,
  extra_data: AbstractDataType,
  repository_homepage_url: DataTypes.StringDataType | null,
  repository_download_url: DataTypes.StringDataType | null,
  api_data_url: DataTypes.StringDataType | null,
  package_uid: DataTypes.StringDataType,
  datafile_paths: AbstractDataType,
  datasource_ids: AbstractDataType,
  purl: DataTypes.StringDataType,
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
      license_expression: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      declared_license: jsonDataType('declared_license'),
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