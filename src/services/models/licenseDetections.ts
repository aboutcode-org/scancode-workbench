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
import { jsonDataType, JSON_Type } from "./databaseUtils";

export interface LicenseDetectionAttributes {
  id: number;
  identifier: string;
  license_expression: string;
  detection_count: number;
  vetted: boolean;
  detection_log: JSON_Type;
  matches: JSON_Type;
  file_regions: JSON_Type;
}

export default function licenseDetectionModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseDetectionAttributes>>(
    "license_detections",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      license_expression: DataTypes.STRING,
      detection_count: DataTypes.NUMBER,
      vetted: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      detection_log: jsonDataType("detection_log"),
      matches: jsonDataType("matches"),
      file_regions: jsonDataType("file_regions"),
    },
    {
      timestamps: false,
    }
  );
}
