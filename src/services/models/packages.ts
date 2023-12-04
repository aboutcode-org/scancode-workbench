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
import { jsonDataType } from "./databaseUtils";

export interface PackagesAttributes {
  id: number;
  type: string;
  namespace: string;
  name: string;
  version: string;
  qualifiers: unknown;
  subpath: string;
  primary_language: string;
  description: string;
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
  size: string;
  sha1: string;
  md5: string;
  sha256: string;
  sha512: string;
  bug_tracking_url: string;
  code_view_url: string;
  vcs_url: string;
  copyright: string;
  declared_license_expression: string;
  declared_license_expression_spdx: string;
  license_detections: {
    license_expression: string;
    identifier: string;
  }[];
  other_license_expression: string;
  other_license_expression_spdx: string;
  other_license_detections: unknown[];
  extracted_license_statement: string;
  notice_text: string;
  source_packages: string[];
  extra_data: unknown;
  repository_homepage_url: string;
  repository_download_url: string;
  api_data_url: string;
  package_uid: string;
  datafile_paths: string[];
  datasource_ids: string[];
  purl: string;
}

export default function packagesModel(sequelize: Sequelize) {
  return sequelize.define<Model<PackagesAttributes>>(
    "packages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      package_uid: {
        unique: true,
        type: DataTypes.STRING,
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
      qualifiers: jsonDataType("qualifiers", []),
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
      parties: jsonDataType("parties", []),
      keywords: jsonDataType("keywords", []),
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
      license_detections: jsonDataType("license_detections", []),
      other_license_expression: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      other_license_expression_spdx: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      other_license_detections: jsonDataType("other_license_detections", []),
      extracted_license_statement: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      notice_text: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      source_packages: jsonDataType("source_packages", []),
      extra_data: jsonDataType("extra_data", {}),
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
      datafile_paths: jsonDataType("datafile_paths", []),
      datasource_ids: jsonDataType("datasource_ids", []),
      purl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
}
