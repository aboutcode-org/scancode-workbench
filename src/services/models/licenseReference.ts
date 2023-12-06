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

export interface LicenseReferenceAttributes {
  id: number;
  key: string;
  language: string;
  short_name: string;
  name: string;
  category: string;
  owner: string;
  homepage_url: string;
  is_builtin: boolean;
  is_exception: boolean;
  is_unknown: boolean;
  is_generic: boolean;
  spdx_license_key: string;
  other_spdx_license_keys: string[];
  osi_license_key: string;
  osi_url: string;
  // notes: string;
  // ignorable_copyrights: string[];
  // ignorable_holders: string[];
  // ignorable_authors: string[];
  // ignorable_urls: string[];
  // ignorable_emails: string[];
  text: string;
  scancode_url: string;
  licensedb_url: string;
  spdx_url: string;
}

export default function licenseReferenceModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseReferenceAttributes>>(
    "license_reference",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      key: DataTypes.STRING,
      language: DataTypes.STRING,
      short_name: DataTypes.STRING,
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      owner: DataTypes.STRING,
      homepage_url: DataTypes.STRING,
      is_builtin: DataTypes.BOOLEAN,
      is_exception: DataTypes.BOOLEAN,
      is_unknown: DataTypes.BOOLEAN,
      is_generic: DataTypes.BOOLEAN,
      spdx_license_key: DataTypes.STRING,
      other_spdx_license_keys: jsonDataType("other_spdx_license_keys", []),
      osi_license_key: DataTypes.STRING,
      osi_url: DataTypes.STRING,
      // notes: DataTypes.STRING,
      // ignorable_copyrights: jsonDataType("ignorable_copyrights", []),
      // ignorable_holders: jsonDataType("ignorable_holders", []),
      // ignorable_authors: jsonDataType("ignorable_authors", []),
      // ignorable_urls: jsonDataType("ignorable_urls", []),
      // ignorable_emails: jsonDataType("ignorable_emails", []),
      text: DataTypes.STRING,
      scancode_url: DataTypes.STRING,
      licensedb_url: DataTypes.STRING,
      spdx_url: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
}
