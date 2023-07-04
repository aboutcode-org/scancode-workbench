import { Model } from "sequelize";
import { PackagesAttributes } from "../../services/models/packages";
import { PackageDetails } from "./packageDefinitions";

export function generatePackagesMapping(
  rawPackages: Model<PackagesAttributes, PackagesAttributes>[]
) {
  return new Map<string, PackageDetails>(
    rawPackages.map((packageInfo): [string, PackageDetails] => [
      packageInfo.getDataValue("package_uid").toString({}),
      {
        package_uid: packageInfo.getDataValue("package_uid").toString({}),
        name: packageInfo.getDataValue("name").toString({}),
        type: packageInfo.getDataValue("type").toString({}),
        dependencies: [],
        namespace: packageInfo.getDataValue("namespace")?.toString({}) || null,
        version: packageInfo.getDataValue("version")?.toString({}) || null,
        qualifiers: JSON.parse(
          packageInfo.getDataValue("qualifiers").toString({})
        ),
        subpath: packageInfo.getDataValue("subpath")?.toString({}) || null,
        primary_language:
          packageInfo.getDataValue("primary_language")?.toString({}) || null,
        description:
          packageInfo.getDataValue("description")?.toString({}) || null,
        release_date:
          packageInfo.getDataValue("release_date")?.toString({}) || null,
        parties: JSON.parse(packageInfo.getDataValue("parties").toString({})),
        keywords: JSON.parse(packageInfo.getDataValue("keywords").toString({})),
        homepage_url:
          packageInfo.getDataValue("homepage_url")?.toString({}) || null,
        download_url:
          packageInfo.getDataValue("download_url")?.toString({}) || null,
        size: packageInfo.getDataValue("size")?.toString({}) || null,
        sha1: packageInfo.getDataValue("sha1")?.toString({}) || null,
        md5: packageInfo.getDataValue("md5")?.toString({}) || null,
        sha256: packageInfo.getDataValue("sha256")?.toString({}) || null,
        sha512: packageInfo.getDataValue("sha512")?.toString({}) || null,
        bug_tracking_url:
          packageInfo.getDataValue("bug_tracking_url")?.toString({}) || null,
        code_view_url:
          packageInfo.getDataValue("code_view_url")?.toString({}) || null,
        vcs_url: packageInfo.getDataValue("vcs_url")?.toString({}) || null,
        copyright: packageInfo.getDataValue("copyright")?.toString({}) || null,
        declared_license_expression:
          packageInfo
            .getDataValue("declared_license_expression")
            ?.toString({}) || null,
        declared_license_expression_spdx:
          packageInfo
            .getDataValue("declared_license_expression_spdx")
            ?.toString({}) || null,
        other_license_expression:
          packageInfo.getDataValue("other_license_expression")?.toString({}) ||
          null,
        other_license_expression_spdx:
          packageInfo
            .getDataValue("other_license_expression_spdx")
            ?.toString({}) || null,
        extracted_license_statement:
          packageInfo
            .getDataValue("extracted_license_statement")
            ?.toString({})
            .replace(/(^"|"$)/g, "") || null,
        notice_text:
          packageInfo.getDataValue("notice_text")?.toString({}) || null,
        source_packages: JSON.parse(
          packageInfo.getDataValue("source_packages").toString({})
        ),
        extra_data: JSON.parse(
          packageInfo.getDataValue("extra_data").toString({})
        ),
        repository_homepage_url:
          packageInfo.getDataValue("repository_homepage_url")?.toString({}) ||
          null,
        repository_download_url:
          packageInfo.getDataValue("repository_download_url")?.toString({}) ||
          null,
        api_data_url:
          packageInfo.getDataValue("api_data_url")?.toString({}) || null,
        datafile_paths:
          JSON.parse(
            packageInfo.getDataValue("datafile_paths")?.toString({}) || "[]"
          ) || [],
        datasource_ids:
          JSON.parse(
            packageInfo.getDataValue("datasource_ids")?.toString({}) || "[]"
          ) || [],
        purl: packageInfo.getDataValue("purl").toString({}),
      },
    ])
  );
}
