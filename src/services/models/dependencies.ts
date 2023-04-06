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

 export interface DependenciesAttributes {
  id: IntegerDataType,
  purl: StringDataType,
  extracted_requirement: StringDataType,
  scope: StringDataType,
  is_runtime: boolean,
  is_optional: boolean,
  is_resolved: boolean,
  resolved_package: JSON_Type,
  dependency_uid: StringDataType,
  for_package_uid: StringDataType,
  datafile_path: StringDataType,
  datasource_id: StringDataType,
 }

 export enum DEPENDENCY_SCOPES {
  TEST = "test",
  COMPILE = "compile",
  DEVELOPMENT = "development",
  DEPENDENCIES = "dependencies",
  DEV_DEPENDENCIES = "devDependencies",
  IMPORT = "import",
  REQUIRE = "require",
  RUNTIME = "runtime",
  PROVIDED = "provided",
  DEPENDENCY_MGMT = "dependencymanagement",
 }
 
export default function dependenciesModel(sequelize: Sequelize) {
  return sequelize.define<Model<DependenciesAttributes>>(
    "dependencies",
    {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    purl: DataTypes.STRING,
    extracted_requirement: DataTypes.STRING,
    scope: DataTypes.STRING,
    is_runtime: DataTypes.BOOLEAN,
    is_optional: DataTypes.BOOLEAN,
    is_resolved: DataTypes.BOOLEAN,
    resolved_package: jsonDataType('resolved_package'),
    dependency_uid: DataTypes.STRING,
    for_package_uid: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    datafile_path: DataTypes.STRING,
    datasource_id: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
 }