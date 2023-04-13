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

import { Model, ModelStatic, Sequelize } from 'sequelize';

import headerModel, { HeaderAttributes } from './header';
import fileModel, { FileAttributes } from './file';
import licenseExpressionModel, { LicenseExpressionAttributes, OptionalLicenseExpressionAttributes } from './licenseExpression';
import licensePolicyModel, { LicensePolicyAttributes } from './licensePolicy';
import copyrightModel, { CopyrightAttributes } from './copyright';
import packageDataModel, { PackageDataAttributes } from './packageData';
import emailModel, { EmailAttributes } from './email';
import urlModel, { UrlAttributes } from './url';
import flatFileModel, { FlatFileAttributes } from './flatFile';
import scanErrorModel, { ScanErrorAttributes } from './scanError';
import packagesModel, { PackagesAttributes } from './packages';
import dependenciesModel, { DependenciesAttributes } from './dependencies';
import licenseDetectionModel, { LicenseDetectionAttributes } from './licenseDetections';


// let Header;
// let File;
// let License;
// let Copyright;
// let Package;
// let Email;
// let Url;
// let Scan;


// type SupportedModels = <Model<HeaderAttributes, HeaderAttributes>>;

export interface DatabaseStructure{
  // Top level entities
  Header: ModelStatic<Model<HeaderAttributes, HeaderAttributes>>,
  Packages: ModelStatic<Model<PackagesAttributes, PackagesAttributes>>,
  Dependencies: ModelStatic<Model<DependenciesAttributes, DependenciesAttributes>>,
  LicenseDetections: ModelStatic<Model<LicenseDetectionAttributes, LicenseDetectionAttributes>>,

  File: ModelStatic<Model<FileAttributes>>,
  LicenseExpression: ModelStatic<Model<LicenseExpressionAttributes, OptionalLicenseExpressionAttributes>>,
  LicensePolicy: ModelStatic<Model<LicensePolicyAttributes>>,
  Copyright: ModelStatic<Model<CopyrightAttributes>>,
  PackageData: ModelStatic<Model<PackageDataAttributes>>,
  Email: ModelStatic<Model<EmailAttributes>>,
  Url: ModelStatic<Model<UrlAttributes>>,
  ScanError: ModelStatic<Model<ScanErrorAttributes>>,

  FlatFile: ModelStatic<Model<FlatFileAttributes>>,

  fileIncludes: { model: ModelStatic<Model<unknown>>, separate: boolean }[],
}

export function newDatabase(sequelize: Sequelize): DatabaseStructure {
  // Define the models
  const result = {
    // Top  level entities
    Header: headerModel(sequelize),
    Packages: packagesModel(sequelize),
    Dependencies: dependenciesModel(sequelize),
    LicenseDetections: licenseDetectionModel(sequelize),

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
  result.Header.hasMany(result.File);
  result.File.hasMany(result.LicenseExpression);
  result.File.hasMany(result.LicensePolicy);
  result.File.hasMany(result.Copyright);
  result.File.hasMany(result.PackageData);
  result.File.hasMany(result.Email);
  result.File.hasMany(result.Url);
  result.File.hasMany(result.ScanError);

  // Include Array for queries
  const fileIncludes = [
    { model: result.LicenseExpression, separate: true },
    { model: result.LicensePolicy, separate: true },
    { model: result.Copyright, separate: true },
    { model: result.PackageData, separate: true },
    { model: result.Email, separate: true },
    { model: result.Url, separate: true },
    { model: result.ScanError, separate: true },
  ];

  return {
    ...result,
    fileIncludes
  };
}