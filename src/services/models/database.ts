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

import { Model, ModelStatic, Sequelize } from "sequelize";

import headerModel, { HeaderAttributes } from "./header";
import fileModel, { FileAttributes } from "./file";
import licenseExpressionModel, {
  LicenseExpressionAttributes,
  OptionalLicenseExpressionAttributes,
} from "./licenseExpression";
import licensePolicyModel, { LicensePolicyAttributes } from "./licensePolicy";
import copyrightModel, { CopyrightAttributes } from "./copyright";
import packageDataModel, { PackageDataAttributes } from "./packageData";
import emailModel, { EmailAttributes } from "./email";
import urlModel, { UrlAttributes } from "./url";
import flatFileModel, { FlatFileAttributes } from "./flatFile";
import scanErrorModel, { ScanErrorAttributes } from "./scanError";
import packagesModel, { PackagesAttributes } from "./packages";
import dependenciesModel, { DependenciesAttributes } from "./dependencies";
import licenseDetectionModel, {
  LicenseDetectionAttributes,
} from "./licenseDetections";
import licenseClueModel, { LicenseClueAttributes } from "./licenseClues";
import licenseRuleReferenceModel, {
  LicenseRuleReferenceAttributes,
} from "./licenseRuleReference";

// let Header;
// let File;
// let License;
// let Copyright;
// let Package;
// let Email;
// let Url;
// let Scan;

// type SupportedModels = <Model<HeaderAttributes, HeaderAttributes>>;

export interface DatabaseStructure {
  // Top level entities
  Header: ModelStatic<Model<HeaderAttributes, HeaderAttributes>>;
  Packages: ModelStatic<Model<PackagesAttributes, PackagesAttributes>>;
  Dependencies: ModelStatic<
    Model<DependenciesAttributes, DependenciesAttributes>
  >;
  LicenseDetections: ModelStatic<
    Model<LicenseDetectionAttributes, LicenseDetectionAttributes>
  >;
  LicenseRuleReferences: ModelStatic<
    Model<LicenseRuleReferenceAttributes, LicenseRuleReferenceAttributes>
  >;
  LicenseClues: ModelStatic<
    Model<LicenseClueAttributes, LicenseClueAttributes>
  >;

  File: ModelStatic<Model<FileAttributes>>;
  LicenseExpression: ModelStatic<
    Model<LicenseExpressionAttributes, OptionalLicenseExpressionAttributes>
  >;
  LicensePolicy: ModelStatic<Model<LicensePolicyAttributes>>;
  Copyright: ModelStatic<Model<CopyrightAttributes>>;
  PackageData: ModelStatic<Model<PackageDataAttributes>>;
  Email: ModelStatic<Model<EmailAttributes>>;
  Url: ModelStatic<Model<UrlAttributes>>;
  ScanError: ModelStatic<Model<ScanErrorAttributes>>;

  FlatFile: ModelStatic<Model<FlatFileAttributes>>;

  fileIncludes: { model: ModelStatic<Model<unknown>>; separate: boolean }[];
  allTables: ModelStatic<Model<unknown>>[];
}

export function newDatabase(sequelize: Sequelize): DatabaseStructure {
  // Define the models
  const tables = {
    // Top  level entities
    Header: headerModel(sequelize),
    Packages: packagesModel(sequelize),
    Dependencies: dependenciesModel(sequelize),
    LicenseDetections: licenseDetectionModel(sequelize),
    LicenseRuleReferences: licenseRuleReferenceModel(sequelize),
    LicenseClues: licenseClueModel(sequelize),

    File: fileModel(sequelize),
    LicenseExpression: licenseExpressionModel(sequelize),
    LicensePolicy: licensePolicyModel(sequelize),
    Copyright: copyrightModel(sequelize),
    PackageData: packageDataModel(sequelize),
    Email: emailModel(sequelize),
    Url: urlModel(sequelize),
    ScanError: scanErrorModel(sequelize),
    FlatFile: flatFileModel(sequelize),
  };

  // Define the relations
  tables.Header.hasMany(tables.File);
  tables.File.hasMany(tables.LicenseExpression);
  tables.File.hasMany(tables.LicenseClues);
  tables.File.hasMany(tables.LicensePolicy);
  tables.File.hasMany(tables.Copyright);
  tables.File.hasMany(tables.PackageData);
  tables.File.hasMany(tables.Email);
  tables.File.hasMany(tables.Url);
  tables.File.hasMany(tables.ScanError);
  tables.Packages.hasMany(tables.Dependencies, {
    sourceKey: "package_uid",
    foreignKey: "for_package_uid",
    as: "dependencies",
  });
  tables.Dependencies.belongsTo(tables.Packages, {
    foreignKey: "for_package_uid",
    as: "package",
    targetKey: "package_uid",
  });

  // Include Array for queries
  const fileIncludes = [
    { model: tables.LicenseExpression, separate: true },
    { model: tables.LicensePolicy, separate: true },
    { model: tables.Copyright, separate: true },
    { model: tables.PackageData, separate: true },
    { model: tables.Email, separate: true },
    { model: tables.Url, separate: true },
    { model: tables.ScanError, separate: true },
  ];

  return {
    ...tables,
    fileIncludes,
    allTables: Object.values(tables),
  };
}
