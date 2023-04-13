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

import { Model, Sequelize, DataTypes, IntegerDataType, StringDataType } from 'sequelize';

export interface EmailAttributes {
  id: IntegerDataType,
  email: StringDataType,
  fileId: IntegerDataType,
  start_line: IntegerDataType,
  end_line: IntegerDataType
}

export default function emailModel(sequelize: Sequelize) {
  return sequelize.define<Model<EmailAttributes>>(
    'emails',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.INTEGER,
      email: DataTypes.STRING,
      start_line: DataTypes.INTEGER,
      end_line: DataTypes.INTEGER
    },
    {
      timestamps: false
    });
}