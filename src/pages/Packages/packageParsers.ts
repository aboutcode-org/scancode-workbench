import { PackagesAttributes } from "../../services/models/packages";
import { PackageDetails } from "./packageDefinitions";

export function generatePackagesMapping(packages: PackagesAttributes[]) {
  return new Map<string, PackageDetails>(
    packages.map((packageInfo): [string, PackageDetails] => [
      packageInfo.package_uid,
      {
        package_uid: packageInfo.package_uid,
        name: packageInfo.name,
        type: packageInfo.type,
        dependencies: [],
        namespace: packageInfo.namespace || null,
        version: packageInfo.version || null,
        qualifiers: packageInfo.qualifiers || [],
        subpath: packageInfo.subpath || null,
        primary_language: packageInfo.primary_language || null,
        description: packageInfo.description || null,
        release_date: packageInfo.release_date || null,
        parties: packageInfo.parties,
        keywords: packageInfo.keywords,
        homepage_url: packageInfo.homepage_url || null,
        download_url: packageInfo.download_url || null,
        size: packageInfo.size || null,
        sha1: packageInfo.sha1 || null,
        md5: packageInfo.md5 || null,
        sha256: packageInfo.sha256 || null,
        sha512: packageInfo.sha512 || null,
        bug_tracking_url: packageInfo.bug_tracking_url || null,
        code_view_url: packageInfo.code_view_url || null,
        vcs_url: packageInfo.vcs_url || null,
        copyright: packageInfo.copyright || null,
        declared_license_expression:
          packageInfo.declared_license_expression || null,
        declared_license_expression_spdx:
          packageInfo.declared_license_expression_spdx || null,
        other_license_expression: packageInfo.other_license_expression || null,
        other_license_expression_spdx:
          packageInfo.other_license_expression_spdx || null,
        extracted_license_statement:
          packageInfo.extracted_license_statement?.replace(/(^"|"$)/g, "") ||
          null,
        notice_text: packageInfo.notice_text || null,
        source_packages: packageInfo.source_packages,
        extra_data: packageInfo.extra_data || null,
        repository_homepage_url: packageInfo.repository_homepage_url || null,
        repository_download_url: packageInfo.repository_download_url || null,
        api_data_url: packageInfo.api_data_url || null,
        datafile_paths: packageInfo.datafile_paths || [],
        datasource_ids: packageInfo.datasource_ids || [],
        purl: packageInfo.purl,
        license_detections: packageInfo.license_detections,
      },
    ])
  );
}
