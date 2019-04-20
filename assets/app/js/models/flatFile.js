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

const {jsonDataType, parentPath} = require('./databaseUtils');

module.exports = function(sequelize, DataTypes) {
  const Model = sequelize.define(
    'flat_files',
    {
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
      license_policy: jsonDataType('license_policy'),
      license_expressions: jsonDataType('license_expressions'),
      license_key: jsonDataType('license_key'),
      license_score: jsonDataType('license_score'),
      license_short_name: jsonDataType('license_short_name'),
      license_category: jsonDataType('license_category'),
      license_owner: jsonDataType('license_owner'),
      license_homepage_url: jsonDataType('license_homepage_url'),
      license_text_url: jsonDataType('license_text_url'),
      license_reference_url: jsonDataType('license_reference_url'),
      license_spdx_key: jsonDataType('license_spdx_key'),
      license_start_line: jsonDataType('license_start_line'),
      license_end_line: jsonDataType('license_end_line'),
      license_matched_rule: jsonDataType('license_matched_rule'),
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
      is_binary: DataTypes.BOOLEAN,
      is_text: DataTypes.BOOLEAN,
      is_archive: DataTypes.BOOLEAN,
      is_media: DataTypes.BOOLEAN,
      is_source: DataTypes.BOOLEAN,
      is_script: DataTypes.BOOLEAN,
      scan_errors: jsonDataType('scan_errors'),
      packages_type: jsonDataType('packages_type'),
      packages_namespace: jsonDataType('packages_dataspace'),
      packages_name: jsonDataType('packages_name'),
      packages_version: jsonDataType('packages_version'),
      packages_qualifiers: jsonDataType('packages_qualifiers'),
      packages_subpath: jsonDataType('packages_subpath'),
      packages_purl: jsonDataType('packages_purl'),
      packages_primary_language: jsonDataType('packages_primary_language'),
      packages_code_type: jsonDataType('packages_code_type'),
      packages_description: jsonDataType('packages_description'),
      packages_size: jsonDataType('packages_size'),
      packages_release_date: jsonDataType('packages_release_date'),
      packages_keywords: jsonDataType('packages_keywords'),
      packages_homepage_url: jsonDataType('packages_homepage_url'),
      packages_download_url: jsonDataType('packages_download_url'),
      packages_donwload_checksums: jsonDataType('packages_download_checksums'),
      packages_bug_tracking_url: jsonDataType('packages_bug_tracking_url'),
      packages_code_view_url: jsonDataType('packages_code_view_url'),
      packages_vcs_tool: jsonDataType('packages_vcs_tool'),
      packages_vcs_repository: jsonDataType('packages_vcs_repository'),
      packages_vcs_revision: jsonDataType('packages_vcs_revision'),
      packages_declared_licensing: jsonDataType('packages_declared_licensing'),
      packages_license_expression: jsonDataType('packages_license_expression'),
      packages_notice_text: jsonDataType('packages_notice_text'),
      packages_dependencies: jsonDataType('packages_dependencies'),
      packages_related_packages: jsonDataType('packages_related_packages'),
    },
    {
      timestamps: false
    });

  /**
   * Flatten ScanCode results data to load into database
   *
   * @param file
   * @param file.path
   * @param file.copyrights
   * @param file.licenses
   * @param file.emails
   * @param file.urls
   * @param file.packages
   * @param file.type
   * @param file.name
   * @param file.extension
   * @param file.date
   * @param file.size
   * @param file.sha1
   * @param file.md5
   * @param file.files_count
   * @param file.mime_type
   * @param file.file_type
   * @param file.programming_language
   * @param file.is_binary
   * @param file.is_text
   * @param file.is_archive
   * @param file.is_media
   * @param file.is_source
   * @param file.is_script
   */
  Model.flatten = function(file) {
    return {
      path: file.path,
      parent: parentPath(file.path),
      copyright_statements: getCopyrightValues(file.copyrights),
      copyright_holders: getCopyrightValues(file.holders),
      copyright_authors: getCopyrightValues(file.authors),
      copyright_start_line: getValues(file.holders, 'start_line'),
      copyright_end_line: getValues(file.holders, 'end_line'),
      license_policy: getLicensePolicyLabel(file.license_policy),
      license_expressions: file.license_expressions,
      license_key: getValues(file.licenses, 'key'),
      license_score: getValues(file.licenses, 'score'),
      license_short_name: getValues(file.licenses, 'short_name'),
      license_category: getValues(file.licenses, 'category'),
      license_owner: getValues(file.licenses, 'owner'),
      license_homepage_url: getValues(file.licenses, 'homepage_url'),
      license_text_url: getValues(file.licenses, 'text_url'),
      license_reference_url: getValues(file.licenses, 'reference_url'),
      license_spdx_key: getValues(file.licenses, 'spdx_license_key'),
      license_start_line: getValues(file.licenses, 'start_line'),
      license_end_line: getValues(file.licenses, 'end_line'),
      license_matched_rule: getValues(file.licenses, 'matched_rule'),
      email: getValues(file.emails, 'email'),
      email_start_line: getValues(file.emails, 'start_line'),
      email_end_line: getValues(file.emails, 'end_line'),
      url: getValues(file.urls, 'url'),
      url_start_line: getValues(file.urls, 'start_line'),
      url_end_line: getValues(file.urls, 'end_line'),
      type: file.type,
      name: file.name,
      extension: file.extension,
      date: file.date,
      size: file.size,
      sha1: file.sha1,
      md5: file.md5,
      file_count: file.files_count,
      mime_type: file.mime_type,
      file_type: file.file_type,
      programming_language: file.programming_language,
      is_binary: file.is_binary,
      is_text: file.is_text,
      is_archive: file.is_archive,
      is_media: file.is_media,
      is_source: file.is_source,
      is_script: file.is_script,
      scan_errors: file.scan_errors,
      packages_type: getValues(file.packages, 'type'),
      pacages_namespace: getValues(file.packages, 'namespace'),
      packages_name: getValues(file.packages, 'name'),
      packages_version: getValues(file.packages, 'version'),
      packages_qualifiers: getValues(file.packages, 'qualifiers'),
      packages_subpath: getValues(file.packages, 'subpath'),
      packages_purl: getValues(file.packages, 'purl'),
      packages_primary_language: getValues(file.packages, 'primary_language'),
      packages_code_type: getValues(file.packages, 'code_type'),
      packages_description: getValues(file.packages, 'description'),
      packages_size: getValues(file.packages, 'size'),
      packages_release_date: getValues(file.packages, 'release_date'),
      packages_keywords: getValues(file.packages, 'keywords'),
      packages_homepage_url: getValues(file.packages, 'homepage_url'),
      packages_download_url: getValues(file.packages, 'download_url'),
      packages_download_checksums: getValues(file.packages, 'download_checksums'),
      packages_bug_tracking_url: getValues(file.packages, 'bug_tracking_url'),
      packages_code_view_url: getValues(file.packages, 'code_view_url'),
      packages_vcs_tool: getValues(file.packages, 'vcs_tool'),
      packages_vcs_repository: getValues(file.packages, 'vcs_repository'),
      packages_vcs_revision: getValues(file.packages, 'vcs_revision'),
      packages_declared_licensing: getValues(file.packages, 'declared_license'),
      packages_license_expression: getValues(file.packages, 'license_expression'),
      packages_notice_text: getValues(file.packages, 'notice_text'),
      packages_dependencies: getValues(file.packages, 'dependencies'),
      packages_related_packages: getValues(file.packages, 'related_packages'),
    };
  };

  return Model;
};

function getLicensePolicyLabel(policy) {
  if (!policy) {
    return;
  } else if (!policy['label']) {
    return;
  }
  return [policy['label']];
}

function getCopyrightValues(array) {
  if (!array) {
    array = [];
  }
  const vals = [];
  array.forEach((val) => {
    vals.push(val['value']);
  });
  // must wrap this in a list for datatables display; not sure why
  return [vals];
}

// [{key: val0}, {key: val1}] => [val0, val1]
function getValues(array, key) {
  return $.map(array ? array : [], (elem) => {
    return [elem[key] ? elem[key] : []];
  });
}
