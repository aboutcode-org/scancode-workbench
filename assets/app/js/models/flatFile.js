/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-toolkit/
 # The ScanCode software is licensed under the Apache License version 2.0.
 # AboutCode is a trademark of nexB Inc.
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
      packages_type: jsonDataType('packages_type'),
      packages_name: jsonDataType('packages_name'),
      packages_version: jsonDataType('packages_version'),
      packages_primary_language: jsonDataType('packages_primary_language'),
      packages_packaging: jsonDataType('packages_packaging'),
      packages_summary: jsonDataType('packages_summary'),
      packages_description: jsonDataType('packages_description'),
      packages_payload_type: jsonDataType('packages_payload_type'),
      packages_size: jsonDataType('packages_size'),
      packages_release_date: jsonDataType('packages_release_date'),
      packages_authors_type: jsonDataType('packages_authors_type'),
      packages_authors_name: jsonDataType('packages_authors_name'),
      packages_authors_email: jsonDataType('packages_authors_email'),
      packages_authors_url: jsonDataType('packages_authors_url'),
      packages_maintainers_type: jsonDataType('packages_maintainers_type'),
      packages_maintainers_name: jsonDataType('packages_maintainers_name'),
      packages_maintainers_email: jsonDataType('packages_maintainers_email'),
      packages_maintainers_url: jsonDataType('packages_maintainers_url'),
      packages_contributors_type: jsonDataType('packages_contributors_type'),
      packages_contributors_name: jsonDataType('packages_contributors_name'),
      packages_contributors_email: jsonDataType('packages_contributors_email'),
      packages_contributors_url: jsonDataType('packages_contributors_url'),
      packages_owners_type: jsonDataType('packages_owners_type'),
      packages_owners_name: jsonDataType('packages_owners_name'),
      packages_owners_email: jsonDataType('packages_owners_email'),
      packages_owners_url: jsonDataType('packages_owners_url'),
      packages_packagers_type: jsonDataType('packages_packagers_type'),
      packages_packagers_name: jsonDataType('packages_packagers_name'),
      packages_packagers_email: jsonDataType('packages_packagers_email'),
      packages_packagers_url: jsonDataType('packages_packagers_url'),
      packages_distributors_type: jsonDataType('packages_distributors_type'),
      packages_distributors_name: jsonDataType('packages_distributors_name'),
      packages_distributors_email: jsonDataType('packages_distributors_email'),
      packages_distributors_url: jsonDataType('packages_distributors_url'),
      packages_vendors_type: jsonDataType('packages_vendors_type'),
      packages_vendors_name: jsonDataType('packages_vendors_name'),
      packages_vendors_email: jsonDataType('packages_vendors_email'),
      packages_vendors_url: jsonDataType('packages_vendors_url'),
      packages_keywords: jsonDataType('packages_keywords'),
      packages_keywords_doc_url: jsonDataType('packages_keywords_doc_url'),
      packages_metafile_locations: jsonDataType('packages_metafile_locations'),
      packages_metafile_urls: jsonDataType('packages_metafile_urls'),
      packages_homepage_url: jsonDataType('packages_homepage_url'),
      packages_notes: jsonDataType('packages_notes'),
      packages_download_urls: jsonDataType('packages_download_urls'),
      packages_download_sha1: jsonDataType('packages_download_sha1'),
      packages_download_sha256: jsonDataType('packages_download_sha256'),
      packages_download_md5: jsonDataType('packages_download_md5'),
      packages_bug_tracking_url: jsonDataType('packages_bug_tracking_url'),
      packages_support_contacts: jsonDataType('packages_support_contacts'),
      packages_code_view_url: jsonDataType('packages_code_view_url'),
      packages_vcs_tool: jsonDataType('packages_vcs_tool'),
      packages_vcs_repository: jsonDataType('packages_vcs_repository'),
      packages_vcs_revision: jsonDataType('packages_vcs_revision'),
      packages_copyright_top_level: jsonDataType('packages_copyright_top_level'),
      packages_copyrights: jsonDataType('packages_copyrights'),
      packages_asserted_licenses_license: jsonDataType('packages_asserted_licenses_license'),
      packages_asserted_licenses_url: jsonDataType('packages_asserted_licenses_url'),
      packages_asserted_licenses_text: jsonDataType('packages_asserted_licenses_text'),
      packages_asserted_licenses_notice: jsonDataType('packages_asserted_licenses_notice'),
      packages_legal_file_locations: jsonDataType('packages_legal_file_locations'),
      packages_license_expression: jsonDataType('packages_license_expression'),
      packages_license_texts: jsonDataType('packages_license_texts'),
      packages_notice_texts: jsonDataType('packages_notice_texts'),
      packages_dependencies: jsonDataType('packages_dependencies'),
      packages_related_packages_type: jsonDataType('packages_related_packages_type'),
      packages_related_packages_name: jsonDataType('packages_related_packages_name'),
      packages_related_packages_version: jsonDataType('packages_related_packages_version'),
      packages_related_packages_payload_type: jsonDataType('packages_related_packages_payload_type')
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
      copyright_statements: getValues(file.copyrights, 'statements'),
      copyright_holders: getValues(file.copyrights, 'holders'),
      copyright_authors: getValues(file.copyrights, 'authors'),
      copyright_start_line: getValues(file.copyrights, 'start_line'),
      copyright_end_line: getValues(file.copyrights, 'end_line'),
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
      packages_type: getValues(file.packages, 'type'),
      packages_name: getValues(file.packages, 'name'),
      packages_version: getValues(file.packages, 'version'),
      packages_primary_language: getValues(file.packages, 'primary_language'),
      packages_packaging: getValues(file.packages, 'packaging'),
      packages_summary: getValues(file.packages, 'summary'),
      packages_description: getValues(file.packages, 'description'),
      packages_payload_type: getValues(file.packages, 'payload_type'),
      packages_size: getValues(file.packages, 'size'),
      packages_release_date: getValues(file.packages, 'release_date'),
      packages_authors_type: getNestedValues(file.packages, 'authors', 'type'),
      packages_authors_name: getNestedValues(file.packages, 'authors', 'name'),
      packages_authors_email: getNestedValues(file.packages, 'authors', 'email'),
      packages_authors_url: getNestedValues(file.packages, 'authors', 'url'),
      packages_maintainers_type: getNestedValues(file.packages, 'maintainers', 'type'),
      packages_maintainers_name: getNestedValues(file.packages, 'maintainers', 'name'),
      packages_maintainers_email: getNestedValues(file.packages, 'maintainers', 'email'),
      packages_maintainers_url: getNestedValues(file.packages, 'maintainers', 'url'),
      packages_contributors_type: getNestedValues(file.packages, 'contributors', 'type'),
      packages_contributors_name: getNestedValues(file.packages, 'contributors', 'name'),
      packages_contributors_email: getNestedValues(file.packages, 'contributors', 'email'),
      packages_contributors_url: getNestedValues(file.packages, 'contributors', 'url'),
      packages_owners_type: getNestedValues(file.packages, 'owners', 'type'),
      packages_owners_name: getNestedValues(file.packages, 'owners', 'name'),
      packages_owners_email: getNestedValues(file.packages, 'owners', 'email'),
      packages_owners_url: getNestedValues(file.packages, 'owners', 'url'),
      packages_packagers_type: getNestedValues(file.packages, 'packagers', 'type'),
      packages_packagers_name: getNestedValues(file.packages, 'packagers', 'name'),
      packages_packagers_email: getNestedValues(file.packages, 'packagers', 'email'),
      packages_packagers_url: getNestedValues(file.packages, 'packagers', 'url'),
      packages_distributors_type: getNestedValues(file.packages, 'distributors', 'type'),
      packages_distributors_name: getNestedValues(file.packages, 'distributors', 'name'),
      packages_distributors_email: getNestedValues(file.packages, 'distributors', 'email'),
      packages_distributors_url: getNestedValues(file.packages, 'distributors', 'url'),
      packages_vendors_type: getNestedValues(file.packages, 'vendors', 'type'),
      packages_vendors_name: getNestedValues(file.packages, 'vendors', 'name'),
      packages_vendors_email: getNestedValues(file.packages, 'vendors', 'email'),
      packages_vendors_url: getNestedValues(file.packages, 'vendors', 'url'),
      packages_keywords: getValues(file.packages, 'keywords'),
      packages_keywords_doc_url: getValues(file.packages, 'keywords_doc_url'),
      packages_metafile_locations: getValues(file.packages, 'metafile_locations'),
      packages_metafile_urls: getValues(file.packages, 'metafile_urls'),
      packages_homepage_url: getValues(file.packages, 'homepage_url'),
      packages_notes: getValues(file.packages, 'notes'),
      packages_download_urls: getValues(file.packages, 'download_urls'),
      packages_download_sha1: getValues(file.packages, 'download_sha1'),
      packages_download_sha256: getValues(file.packages, 'download_sha256'),
      packages_download_md5: getValues(file.packages, 'download_md5'),
      packages_bug_tracking_url: getValues(file.packages, 'bug_tracking_url'),
      packages_support_contacts: getValues(file.packages, 'support_contacts'),
      packages_code_view_url: getValues(file.packages, 'code_view_url'),
      packages_vcs_tool: getValues(file.packages, 'vcs_tool'),
      packages_vcs_repository: getValues(file.packages, 'vcs_repository'),
      packages_vcs_revision: getValues(file.packages, 'vcs_revision'),
      packages_copyright_top_level: getValues(file.packages, 'copyright_top_level'),
      packages_copyrights: getValues(file.packages, 'copyrights'),
      packages_asserted_licenses_license: getNestedValues(file.packages, 'asserted_licenses', 'license'),
      packages_asserted_licenses_url: getNestedValues(file.packages, 'asserted_licenses', 'url'),
      packages_asserted_licenses_text: getNestedValues(file.packages, 'asserted_licenses', 'text'),
      packages_asserted_licenses_notice: getNestedValues(file.packages, 'asserted_licenses', 'notice'),
      packages_legal_file_locations: getValues(file.packages, 'legal_file_locations'),
      packages_license_expression: getValues(file.packages, 'license_expression'),
      packages_license_texts: getValues(file.packages, 'license_texts'),
      packages_notice_texts: getValues(file.packages, 'notice_texts'),
      packages_dependencies: getValues(file.packages, 'dependencies'),
      packages_related_packages_type: getNestedValues(file.packages, 'related_packages', 'type'),
      packages_related_packages_name: getNestedValues(file.packages, 'related_packages', 'name'),
      packages_related_packages_version: getNestedValues(file.packages, 'related_packages', 'version'),
      packages_related_packages_payload_type: getNestedValues(file.packages, 'related_packages', 'payload_type')
    };
  };

  return Model;
};

// [{key: val0}, {key: val1}] => [val0, val1]
function getValues(array, key) {
  return $.map(array ? array : [], (elem) => {
    return [elem[key] ? elem[key] : []];
  });
}

// [{key: [{ nestedKey: val0}], {key: [ nestedKey: val1]}] => [val0, val1]
function getNestedValues(array, key, nestedKey) {
  return $.map(array ? array : [], (elem) => {
    return $.map(elem[key] ? elem[key] : [], (nestedElem) => {
      return [nestedElem[nestedKey] ? nestedElem[nestedKey] : []];
    });
  });
}