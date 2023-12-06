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

export interface LicenseRuleReferenceAttributes {
  id: number;
  license_expression: string;
  identifier: string;
  language: string;
  rule_url: string;
  is_license_text: boolean;
  is_license_notice: boolean;
  is_license_reference: boolean;
  is_license_tag: boolean;
  is_license_intro: boolean;
  is_license_clue: boolean;
  is_continuous: boolean;
  is_builtin: boolean;
  is_from_license: boolean;
  is_synthetic: boolean;
  length: number;
  relevance: number;
  minimum_coverage: number;
  referenced_filenames: string[];
  // notes: string;
  // ignorable_copyrights: string[];
  // ignorable_holders: string[];
  // ignorable_authors: string[];
  // ignorable_urls: string[];
  // ignorable_emails: string[];
  text: string;
}

export default function licenseRuleReferenceModel(sequelize: Sequelize) {
  return sequelize.define<Model<LicenseRuleReferenceAttributes>>(
    "license_rule_reference",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      license_expression: DataTypes.STRING,
      identifier: DataTypes.STRING,
      language: DataTypes.STRING,
      rule_url: DataTypes.STRING,
      is_license_text: DataTypes.BOOLEAN,
      is_license_notice: DataTypes.BOOLEAN,
      is_license_reference: DataTypes.BOOLEAN,
      is_license_tag: DataTypes.BOOLEAN,
      is_license_intro: DataTypes.BOOLEAN,
      is_license_clue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_continuous: DataTypes.BOOLEAN,
      is_builtin: DataTypes.BOOLEAN,
      is_from_license: DataTypes.BOOLEAN,
      is_synthetic: DataTypes.BOOLEAN,
      length: DataTypes.NUMBER,
      relevance: DataTypes.NUMBER,
      minimum_coverage: DataTypes.NUMBER,
      referenced_filenames: jsonDataType("referenced_filenames", []),
      // notes: DataTypes.STRING,
      // ignorable_copyrights: jsonDataType("ignorable_copyrights", []),
      // ignorable_holders: jsonDataType("ignorable_holders", []),
      // ignorable_authors: jsonDataType("ignorable_authors", []),
      // ignorable_urls: jsonDataType("ignorable_urls", []),
      // ignorable_emails: jsonDataType("ignorable_emails", []),
      text: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
}
