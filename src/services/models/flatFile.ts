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

import path from 'path';
import { Sequelize, DataTypes, IntegerDataType, StringDataType, Model, NumberDataType } from 'sequelize';
import { JSON_Type, jsonDataType, parentPath } from './databaseUtils';


export interface FlatFileAttributes {
  id: IntegerDataType,
  fileId: IntegerDataType,
  path: string;
  parent: StringDataType,
  copyright_statements: JSON_Type,
  copyright_holders: JSON_Type,
  copyright_authors: JSON_Type,
  copyright_start_line: JSON_Type,
  copyright_end_line: JSON_Type,

  detected_license_expression: StringDataType,
  detected_license_expression_spdx: StringDataType,
  percentage_of_license_text: NumberDataType,
  license_policy: JSON_Type,
  license_clues: JSON_Type,
  license_detections: JSON_Type,

  email: JSON_Type,
  email_start_line: JSON_Type,
  email_end_line: JSON_Type,
  url: JSON_Type,
  url_start_line: JSON_Type,
  url_end_line: JSON_Type,

  type: StringDataType,
  name: StringDataType,
  extension: StringDataType,
  date: StringDataType,
  size: IntegerDataType,
  sha1: StringDataType,
  md5: StringDataType,
  file_count: IntegerDataType
  mime_type: StringDataType,
  file_type: StringDataType,
  programming_language: StringDataType,
  for_packages: JSON_Type,
  is_binary: boolean,
  is_text: boolean,
  is_archive: boolean,
  is_media: boolean,
  is_source: boolean,
  is_script: boolean,
  scan_errors: JSON_Type,

  package_data_type: JSON_Type,
  package_data_namespace: JSON_Type,
  package_data_name: JSON_Type,
  package_data_version: JSON_Type,
  package_data_qualifiers: JSON_Type,
  package_data_subpath: JSON_Type,
  package_data_purl: JSON_Type,
  package_data_primary_language: JSON_Type,
  package_data_code_type: JSON_Type,
  package_data_description: JSON_Type,
  package_data_size: JSON_Type,
  package_data_release_date: JSON_Type,
  package_data_keywords: JSON_Type,
  package_data_homepage_url: JSON_Type,
  package_data_download_url: JSON_Type,
  package_data_download_checksums: JSON_Type,
  package_data_bug_tracking_url: JSON_Type,
  package_data_code_view_url: JSON_Type,
  package_data_vcs_tool: JSON_Type,
  package_data_vcs_url: JSON_Type,
  package_data_vcs_repository: JSON_Type,
  package_data_vcs_revision: JSON_Type,
  package_data_extracted_license_statement: JSON_Type,
  package_data_declared_license_expression: JSON_Type,
  package_data_declared_license_expression_spdx: JSON_Type,
  package_data_notice_text: JSON_Type,
  package_data_dependencies: JSON_Type,
  package_data_related_packages: JSON_Type,
}

export default function flatFileModel(sequelize: Sequelize) {
  const FlatFileModel = sequelize.define<Model<FlatFileAttributes>>(
    'flat_files',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fileId: DataTypes.INTEGER,
      path: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      parent: {type: DataTypes.STRING, defaultValue: ''},
      copyright_statements: jsonDataType('copyright_statements'),
      copyright_holders: jsonDataType('copyright_holders'),
      copyright_authors: jsonDataType('copyright_authors'),
      copyright_start_line: jsonDataType('copyright_start_line'),
      copyright_end_line: jsonDataType('copyright_end_line'),

      detected_license_expression: DataTypes.STRING,
      detected_license_expression_spdx: DataTypes.STRING,
      percentage_of_license_text: DataTypes.NUMBER,
      license_clues: jsonDataType('license_clues'),
      license_policy: jsonDataType('license_policy'),
      license_detections: jsonDataType('license_detections'),

      email: jsonDataType('email'),
      email_start_line: jsonDataType('email_start_line'),
      email_end_line: jsonDataType('email_end_line'),
      url: jsonDataType('url'),
      url_start_line: jsonDataType('url_start_line'),
      url_end_line: jsonDataType('url_end_line'),

      type: {type: DataTypes.STRING, defaultValue: ''},
      name: {type: DataTypes.STRING, defaultValue: ''},
      extension: {type: DataTypes.STRING, defaultValue: ''},
      date: {type: DataTypes.STRING, defaultValue: ''},
      size: {type: DataTypes.INTEGER, defaultValue: ''},
      sha1: {type: DataTypes.STRING, defaultValue: ''},
      md5: {type: DataTypes.STRING, defaultValue: ''},
      file_count: {type: DataTypes.INTEGER, defaultValue: ''},
      mime_type: {type: DataTypes.STRING, defaultValue: ''},
      file_type: {type: DataTypes.STRING, defaultValue: ''},
      programming_language: {type: DataTypes.STRING, defaultValue: ''},
      for_packages: jsonDataType('for_packages'),
      is_binary: DataTypes.BOOLEAN,
      is_text: DataTypes.BOOLEAN,
      is_archive: DataTypes.BOOLEAN,
      is_media: DataTypes.BOOLEAN,
      is_source: DataTypes.BOOLEAN,
      is_script: DataTypes.BOOLEAN,
      scan_errors: jsonDataType('scan_errors'),
      
      package_data_type: jsonDataType('package_data_type'),
      package_data_namespace: jsonDataType('package_data_dataspace'),
      package_data_name: jsonDataType('package_data_name'),
      package_data_version: jsonDataType('package_data_version'),
      package_data_qualifiers: jsonDataType('package_data_qualifiers'),
      package_data_subpath: jsonDataType('package_data_subpath'),
      package_data_purl: jsonDataType('package_data_purl'),
      package_data_primary_language: jsonDataType('package_data_primary_language'),
      package_data_code_type: jsonDataType('package_data_code_type'),
      package_data_description: jsonDataType('package_data_description'),
      package_data_size: jsonDataType('package_data_size'),
      package_data_release_date: jsonDataType('package_data_release_date'),
      package_data_keywords: jsonDataType('package_data_keywords'),
      package_data_homepage_url: jsonDataType('package_data_homepage_url'),
      package_data_download_url: jsonDataType('package_data_download_url'),
      package_data_download_checksums: jsonDataType('package_data_download_checksums'),
      package_data_bug_tracking_url: jsonDataType('package_data_bug_tracking_url'),
      package_data_code_view_url: jsonDataType('package_data_code_view_url'),
      package_data_vcs_tool: jsonDataType('package_data_vcs_tool'),
      package_data_vcs_url: jsonDataType('package_data_vcs_url'),
      package_data_vcs_repository: jsonDataType('package_data_vcs_repository'),
      package_data_vcs_revision: jsonDataType('package_data_vcs_revision'),
      package_data_extracted_license_statement: jsonDataType('package_data_extracted_license_statement'),
      package_data_declared_license_expression: jsonDataType('package_data_declared_license_expression'),
      package_data_declared_license_expression_spdx: jsonDataType('package_data_declared_license_expression'),
      package_data_notice_text: jsonDataType('package_data_notice_text'),
      package_data_dependencies: jsonDataType('package_data_dependencies'),
      package_data_related_packages: jsonDataType('package_data_related_packages'),
    },
    {
      timestamps: false
    });

  return FlatFileModel;
}


// /**
//  * Flatten ScanCode results data to load into database
//  *
interface FlattenedFile {
  id: number,
  fileId: number,
  path: string;
  parent: StringDataType,
  copyright_statements: unknown[],
  copyright_holders: unknown[],
  copyright_authors: unknown[],
  copyright_start_line: unknown[],
  copyright_end_line: unknown[],

  detected_license_expression: StringDataType,
  detected_license_expression_spdx: StringDataType,
  percentage_of_license_text: number,
  license_policy: unknown[],
  license_clues: unknown[],
  license_detections: unknown[],

  email: unknown[],
  email_start_line: unknown[],
  email_end_line: unknown[],
  url: unknown[],
  url_start_line: unknown[],
  url_end_line: unknown[],

  type: StringDataType,
  name: StringDataType,
  extension: StringDataType,
  date: StringDataType,
  size: StringDataType,
  sha1: StringDataType,
  md5: StringDataType,
  file_count: IntegerDataType
  mime_type: StringDataType,
  file_type: StringDataType,
  programming_language: StringDataType,
  for_packages: unknown[],
  is_binary: boolean,
  is_text: boolean,
  is_archive: boolean,
  is_media: boolean,
  is_source: boolean,
  is_script: boolean,
  scan_errors: unknown[],

  package_data_type: unknown[],
  package_data_namespace: unknown[],
  package_data_name: unknown[],
  package_data_version: unknown[],
  package_data_qualifiers: unknown[],
  package_data_subpath: unknown[],
  package_data_purl: unknown[],
  package_data_primary_language: unknown[],
  package_data_code_type: unknown[],
  package_data_description: unknown[],
  package_data_size: unknown[],
  package_data_release_date: unknown[],
  package_data_keywords: unknown[],
  package_data_homepage_url: unknown[],
  package_data_download_url: unknown[],
  package_data_download_checksums: unknown[],
  package_data_bug_tracking_url: unknown[],
  package_data_code_view_url: unknown[],
  package_data_vcs_tool: unknown[],
  package_data_vcs_url: unknown[],
  package_data_vcs_repository: unknown[],
  package_data_vcs_revision: unknown[],
  package_data_extracted_license_statement: unknown[],
  package_data_declared_license_expression: unknown[],
  package_data_declared_license_expression_spdx: unknown[],
  package_data_notice_text: unknown[],
  package_data_dependencies: unknown[],
  package_data_related_packages: unknown[],
}
export function flattenFile(file: any): FlattenedFile { 
  return {
    id: file.id,
    fileId: file.id,
    path: file.path,
    parent: parentPath(file.path) as any,
    copyright_statements: getCopyrightValues(file.copyrights, 'copyright'),
    copyright_holders: getCopyrightValues(file.holders, 'holder'),
    copyright_authors: getCopyrightValues(file.authors, 'author'),
    copyright_start_line: getValues(file.holders, 'start_line'),
    copyright_end_line: getValues(file.holders, 'end_line'),


    detected_license_expression: file.detected_license_expression,
    detected_license_expression_spdx: file.detected_license_expression_spdx,
    percentage_of_license_text: file.percentage_of_license_text,
    license_clues: file.license_clues,    // TODO - Dunno type of this yet
    license_policy: getLicensePolicyLabel(file.license_policy),
    license_detections: file.license_detections,

    email: getValues(file.emails, 'email'),
    email_start_line: getValues(file.emails, 'start_line'),
    email_end_line: getValues(file.emails, 'end_line'),
    url: getValues(file.urls, 'url'),
    url_start_line: getValues(file.urls, 'start_line'),
    url_end_line: getValues(file.urls, 'end_line'),
    type: file.type,
    name: file.name || path.basename(file.path),
    extension: file.extension || path.extname(file.path),
    date: file.date,
    size: file.size,
    sha1: file.sha1,
    md5: file.md5,
    file_count: file.files_count,
    mime_type: file.mime_type,
    file_type: file.file_type,
    programming_language: file.programming_language,
    for_packages: file.for_packages,
    is_binary: file.is_binary,
    is_text: file.is_text,
    is_archive: file.is_archive,
    is_media: file.is_media,
    is_source: file.is_source,
    is_script: file.is_script,
    scan_errors: file.scan_errors,
    package_data_type: getValues(file.package_data, 'type'),
    package_data_namespace: getValues(file.package_data, 'namespace'),
    package_data_name: getValues(file.package_data, 'name'),
    package_data_version: getValues(file.package_data, 'version'),
    package_data_qualifiers: getValues(file.package_data, 'qualifiers'),
    package_data_subpath: getValues(file.package_data, 'subpath'),
    package_data_purl: getValues(file.package_data, 'purl'),
    package_data_primary_language: getValues(file.package_data, 'primary_language'),
    package_data_code_type: getValues(file.package_data, 'code_type'),  // @QUERY - Does exist ?
    package_data_description: getValues(file.package_data, 'description'),
    package_data_size: getValues(file.package_data, 'size'),
    package_data_release_date: getValues(file.package_data, 'release_date'),
    package_data_keywords: getValues(file.package_data, 'keywords'),
    package_data_homepage_url: getValues(file.package_data, 'homepage_url'),
    package_data_download_url: getValues(file.package_data, 'download_url'),
    package_data_download_checksums: getValues(file.package_data, 'download_checksums'),
    package_data_bug_tracking_url: getValues(file.package_data, 'bug_tracking_url'),
    package_data_code_view_url: getValues(file.package_data, 'code_view_url'),
    package_data_vcs_tool: getValues(file.package_data, 'vcs_tool'),  // @QUERY - Does exist ?
    package_data_vcs_url: getValues(file.package_data, 'vcs_url'),
    package_data_vcs_repository: getValues(file.package_data, 'vcs_repository'),  // @QUERY - Does exist ?
    package_data_vcs_revision: getValues(file.package_data, 'vcs_revision'),    // @QUERY - Does exist ?
    package_data_extracted_license_statement: getValues(file.package_data, 'extracted_license_statement'),
    package_data_declared_license_expression: getValues(file.package_data, 'declared_license_expression'),
    package_data_declared_license_expression_spdx: getValues(file.package_data, 'declared_license_expression_spdx'),
    package_data_notice_text: getValues(file.package_data, 'notice_text'),
    package_data_dependencies: getValues(file.package_data, 'dependencies'),
    package_data_related_packages: getValues(file.package_data, 'related_packages'),
  };
}

function getLicensePolicyLabel(policy: any) {
  if (!policy) {
    return;
  } else if (!policy['label']) {
    return;
  }
  return [policy['label']];
}

function getCopyrightValues(array: any, field: | 'copyright' | 'holder' | 'author') {
  if (!array || !Array.isArray(array)) {
    array = [];
  }
  const values = array.map((val: any) => val[field]);
  // must wrap this in a list for datatables display; not sure why
  return [values];
}

// [{key: val0}, {key: val1}] => [val0, val1]
function getValues(array: unknown, key: string) {
  if(!array || !(Array.isArray(array) && array.length))
    return [];
  return array.map((elem) => {
    return [elem[key] ? elem[key] : []];
  });
}
// getNestedValues(file.package_data, 'license_detections', 'license_expression'),
function getNestedValues(array: unknown, key: string, nestedKey: string){
  if(!array || !(Array.isArray(array) && array.length))
    return [];
  return (array.map((elem) => {
    if(Array.isArray(elem[key]))
      return elem[key].map((elem2: any) => elem2[nestedKey])
    if(elem[key])
      return elem[key][nestedKey];
    return [];
  })).flat(2);
}
function hasValue(array: unknown, key: string, value: any) {
  if(!array || !(Array.isArray(array) && array.length))
    return false;
  for(const elem of array){
    if(elem[key] === value)
      return true;
  }
  return false;
}