import { Model } from "sequelize";
import { PackagesAttributes } from "../../services/models/packages";
import { PackageDetails } from "./packageDefinitions";

export function generatePackagesMapping(
  rawPackages: Model<PackagesAttributes, PackagesAttributes>[]
) {
  return new Map<string, PackageDetails>(
    rawPackages.map((packageInfo): [string, PackageDetails] => [
      packageInfo.getDataValue("package_uid"),
      {
        package_uid: packageInfo.getDataValue("package_uid"),
        name: packageInfo.getDataValue("name"),
        type: packageInfo.getDataValue("type"),
        dependencies: [],
        namespace: packageInfo.getDataValue("namespace") || null,
        version: packageInfo.getDataValue("version") || null,
        qualifiers: JSON.parse(packageInfo.getDataValue("qualifiers")),
        subpath: packageInfo.getDataValue("subpath") || null,
        primary_language: packageInfo.getDataValue("primary_language") || null,
        description: packageInfo.getDataValue("description") || null,
        release_date: packageInfo.getDataValue("release_date") || null,
        parties: JSON.parse(packageInfo.getDataValue("parties")),
        keywords: JSON.parse(packageInfo.getDataValue("keywords")),
        homepage_url: packageInfo.getDataValue("homepage_url") || null,
        download_url: packageInfo.getDataValue("download_url") || null,
        size: packageInfo.getDataValue("size") || null,
        sha1: packageInfo.getDataValue("sha1") || null,
        md5: packageInfo.getDataValue("md5") || null,
        sha256: packageInfo.getDataValue("sha256") || null,
        sha512: packageInfo.getDataValue("sha512") || null,
        bug_tracking_url: packageInfo.getDataValue("bug_tracking_url") || null,
        code_view_url: packageInfo.getDataValue("code_view_url") || null,
        vcs_url: packageInfo.getDataValue("vcs_url") || null,
        copyright: packageInfo.getDataValue("copyright") || null,
        declared_license_expression:
          packageInfo.getDataValue("declared_license_expression") || null,
        declared_license_expression_spdx:
          packageInfo.getDataValue("declared_license_expression_spdx") || null,
        other_license_expression:
          packageInfo.getDataValue("other_license_expression") || null,
        other_license_expression_spdx:
          packageInfo.getDataValue("other_license_expression_spdx") || null,
        extracted_license_statement:
          packageInfo
            .getDataValue("extracted_license_statement")
            ?.replace(/(^"|"$)/g, "") || null,
        notice_text: packageInfo.getDataValue("notice_text") || null,
        source_packages: JSON.parse(
          packageInfo.getDataValue("source_packages")
        ),
        extra_data: JSON.parse(packageInfo.getDataValue("extra_data")),
        repository_homepage_url:
          packageInfo.getDataValue("repository_homepage_url") || null,
        repository_download_url:
          packageInfo.getDataValue("repository_download_url") || null,
        api_data_url: packageInfo.getDataValue("api_data_url") || null,
        datafile_paths:
          JSON.parse(packageInfo.getDataValue("datafile_paths") || "[]") || [],
        datasource_ids:
          JSON.parse(packageInfo.getDataValue("datasource_ids") || "[]") || [],
        purl: packageInfo.getDataValue("purl"),
      },
    ])
  );
}
