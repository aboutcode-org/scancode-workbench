/*
 #
 # Copyright (c) nexB Inc. and others. All rights reserved.
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

import { Sequelize, DataTypes, Model } from "sequelize";
import { JSON_Type, jsonDataType } from "./databaseUtils";

export interface LicenseClueAttributes {
  id: number;
  fileId: number;
  filePath: string;
  fileClueIdx: number;
  score: number;
  license_expression: string;
  rule_identifier: string;
  vetted: boolean;
  matches: JSON_Type;
  file_regions: JSON_Type;
}

export default function licenseClueModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseClueAttributes>>(
    "license_clues",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.NUMBER,
      filePath: DataTypes.STRING,
      fileClueIdx: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      score: DataTypes.NUMBER,
      license_expression: DataTypes.STRING,
      rule_identifier: DataTypes.STRING,
      vetted: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      matches: jsonDataType("matches"),
      file_regions: jsonDataType("file_regions"),
    },
    {
      timestamps: false,
    }
  );
}
