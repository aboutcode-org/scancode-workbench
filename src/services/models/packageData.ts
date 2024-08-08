/*
 #
 # Copyright (c) nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/aboutcode-org/scancode-workbench/
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
import { jsonDataType } from "./databaseUtils";

export interface PackageDataAttributes {
  id: number;
  fileId: number;
  type: string;
  namespace: string;
  name: string;
  version: string;
  qualifiers: unknown;
  subpath: string;
  purl: string;
  primary_language: string;
  code_type: string; // @QUERY - Does exist ?
  description: string;
  size: number;
  release_date: string;
  parties: {
    type: string;
    role: string;
    name: string;
    email: string;
    url: string;
  }[];
  keywords: string[];
  homepage_url: string;
  download_url: string;
  download_checksums: string[];
  bug_tracking_url: string;
  code_view_url: string;
  vcs_tool: string;
  vcs_repository: string;
  vcs_revision: string;
  copyright: string;
  declared_license_expression: string;
  declared_license_expression_spdx: string;
  extracted_license_statement: string;
  notice_text: string;
  dependencies: any[];
  related_packages: unknown[]; // @QUERY - Does exist ?
}

export default function packageDataModel(sequelize: Sequelize) {
  return sequelize.define<Model<PackageDataAttributes>>(
    "package_data",
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
      qualifiers: jsonDataType("qualifiers", {}),
      subpath: DataTypes.STRING,
      purl: DataTypes.STRING,
      primary_language: DataTypes.STRING,
      code_type: DataTypes.STRING,
      description: DataTypes.STRING,
      size: DataTypes.INTEGER,
      release_date: DataTypes.STRING,
      parties: jsonDataType("parties", []),
      keywords: jsonDataType("keywords", []),
      homepage_url: DataTypes.STRING,
      download_url: DataTypes.STRING,
      download_checksums: jsonDataType("download_checksums", []),
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
      dependencies: jsonDataType("dependencies", []),
      related_packages: jsonDataType("related_packages", []), // @QUERY - Does exist ?
    },
    {
      timestamps: false,
    }
  );
}
