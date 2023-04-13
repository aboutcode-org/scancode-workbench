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

export interface FileAttributes {
  id: IntegerDataType,
  path: string;
  parent: StringDataType,
  type: StringDataType,
  name: StringDataType,
  extension: StringDataType,
  date: StringDataType,
  size: IntegerDataType,
  sha1: StringDataType,
  md5: StringDataType,
  files_count: IntegerDataType,
  dirs_count: IntegerDataType,
  mime_type: StringDataType,
  file_type: StringDataType,
  programming_language: StringDataType,
  for_packages: JSON_Type,
  is_binary: boolean,
  is_text: boolean,
  is_archive: boolean,
  is_media: boolean,
  is_source: boolean,
  is_script: boolean,
}

// interface OptionalFileAttributes
//   extends Optional<FileAttributes, {}> {}


export default function fileModel(sequelize: Sequelize) {
  // return sequelize.define<Model<FileAttributes, OptionalFileAttributes>>(
  return sequelize.define<Model<FileAttributes>>(
    'files',
    {
      path: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      parent: DataTypes.STRING,
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      extension: DataTypes.STRING,
      date: DataTypes.STRING,
      size: DataTypes.INTEGER,
      sha1: DataTypes.STRING,
      md5: DataTypes.STRING,
      files_count: DataTypes.INTEGER,
      dirs_count: DataTypes.INTEGER,
      mime_type: DataTypes.STRING,
      file_type: DataTypes.STRING,
      programming_language: DataTypes.STRING,
      for_packages: jsonDataType('for_packages'),
      is_binary: DataTypes.BOOLEAN,
      is_text: DataTypes.BOOLEAN,
      is_archive: DataTypes.BOOLEAN,
      is_media: DataTypes.BOOLEAN,
      is_source: DataTypes.BOOLEAN,
      is_script: DataTypes.BOOLEAN
    },
    {
      timestamps: false
    });
}