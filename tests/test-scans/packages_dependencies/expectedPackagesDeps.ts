import { DependenciesAttributes } from "../../../src/services/models/dependencies";
import {
  PackageDataFlatFileAttributes,
  PackageFlatFileAttributes,
} from "../../../src/services/models/flatFile";
import { PackageDataAttributes } from "../../../src/services/models/packageData";
import { PackagesAttributes } from "../../../src/services/models/packages";

export const PackageDepsSamples: {
  jsonFileName: string;
  expectedFlatFiles: (PackageFlatFileAttributes &
    PackageDataFlatFileAttributes)[];
  expectedPackages: PackagesAttributes[];
  expectedDependencies: DependenciesAttributes[];
  expectedPackageData: PackageDataAttributes[];
}[] = [
  {
    jsonFileName: "withPackagesAndDeps.json",
    expectedFlatFiles: [
      {
        for_packages: "[]",
        package_data_type: "[]",
        package_data_namespace: "[]",
        package_data_name: "[]",
        package_data_version: "[]",
        package_data_qualifiers: "[]",
        package_data_subpath: "[]",
        package_data_purl: "[]",
        package_data_primary_language: "[]",
        package_data_code_type: "[]",
        package_data_description: "[]",
        package_data_size: "[]",
        package_data_release_date: "[]",
        package_data_keywords: "[]",
        package_data_homepage_url: "[]",
        package_data_download_url: "[]",
        package_data_download_checksums: "[]",
        package_data_bug_tracking_url: "[]",
        package_data_code_view_url: "[]",
        package_data_vcs_tool: "[]",
        package_data_vcs_url: "[]",
        package_data_vcs_repository: "[]",
        package_data_vcs_revision: "[]",
        package_data_extracted_license_statement: "[]",
        package_data_declared_license_expression: "[]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[]",
        package_data_dependencies: "[]",
        package_data_related_packages: "[]",
      },
      {
        for_packages: "[]",
        package_data_type: "[]",
        package_data_namespace: "[]",
        package_data_name: "[]",
        package_data_version: "[]",
        package_data_qualifiers: "[]",
        package_data_subpath: "[]",
        package_data_purl: "[]",
        package_data_primary_language: "[]",
        package_data_code_type: "[]",
        package_data_description: "[]",
        package_data_size: "[]",
        package_data_release_date: "[]",
        package_data_keywords: "[]",
        package_data_homepage_url: "[]",
        package_data_download_url: "[]",
        package_data_download_checksums: "[]",
        package_data_bug_tracking_url: "[]",
        package_data_code_view_url: "[]",
        package_data_vcs_tool: "[]",
        package_data_vcs_url: "[]",
        package_data_vcs_repository: "[]",
        package_data_vcs_revision: "[]",
        package_data_extracted_license_statement: "[]",
        package_data_declared_license_expression: "[]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[]",
        package_data_dependencies: "[]",
        package_data_related_packages: "[]",
      },
      {
        for_packages: "[]",
        package_data_type: '[["pypi"]]',
        package_data_namespace: "[]",
        package_data_name: "[[[]]]",
        package_data_version: "[[[]]]",
        package_data_qualifiers: "[[{}]]",
        package_data_subpath: "[[[]]]",
        package_data_purl: "[[[]]]",
        package_data_primary_language: '[["Python"]]',
        package_data_code_type: "[[[]]]",
        package_data_description: "[[[]]]",
        package_data_size: "[[[]]]",
        package_data_release_date: "[[[]]]",
        package_data_keywords: "[[[]]]",
        package_data_homepage_url: "[[[]]]",
        package_data_download_url: "[[[]]]",
        package_data_download_checksums: "[[[]]]",
        package_data_bug_tracking_url: "[[[]]]",
        package_data_code_view_url: "[[[]]]",
        package_data_vcs_tool: "[[[]]]",
        package_data_vcs_url: "[[[]]]",
        package_data_vcs_repository: "[[[]]]",
        package_data_vcs_revision: "[[[]]]",
        package_data_extracted_license_statement: "[[[]]]",
        package_data_declared_license_expression: "[[[]]]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[[[]]]",
        package_data_dependencies: "[[[]]]",
        package_data_related_packages: "[[[]]]",
      },
      {
        for_packages: "[]",
        package_data_type: '[["pypi"]]',
        package_data_namespace: "[]",
        package_data_name: "[[[]]]",
        package_data_version: "[[[]]]",
        package_data_qualifiers: "[[{}]]",
        package_data_subpath: "[[[]]]",
        package_data_purl: "[[[]]]",
        package_data_primary_language: '[["Python"]]',
        package_data_code_type: "[[[]]]",
        package_data_description: "[[[]]]",
        package_data_size: "[[[]]]",
        package_data_release_date: "[[[]]]",
        package_data_keywords: "[[[]]]",
        package_data_homepage_url: "[[[]]]",
        package_data_download_url: "[[[]]]",
        package_data_download_checksums: "[[[]]]",
        package_data_bug_tracking_url: "[[[]]]",
        package_data_code_view_url: "[[[]]]",
        package_data_vcs_tool: "[[[]]]",
        package_data_vcs_url: "[[[]]]",
        package_data_vcs_repository: "[[[]]]",
        package_data_vcs_revision: "[[[]]]",
        package_data_extracted_license_statement: "[[[]]]",
        package_data_declared_license_expression: "[[[]]]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[[[]]]",
        package_data_dependencies:
          '[[[{"purl":"pkg:pypi/aboutcode-toolkit@6.0.0","extracted_requirement":"aboutcode-toolkit==6.0.0","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}},{"purl":"pkg:pypi/py@1.10.0","extracted_requirement":"py==1.10.0","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}},{"purl":"pkg:pypi/pytest@6.2.4","extracted_requirement":"pytest==6.2.4","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}}]]]',
        package_data_related_packages: "[[[]]]",
      },
      {
        for_packages:
          '["pkg:about/scancode-toolkit?uuid=3b5a9865-8101-430a-ac7c-9f184631b803"]',
        package_data_type: '[["about"]]',
        package_data_namespace: "[]",
        package_data_name: '[["scancode-toolkit"]]',
        package_data_version: "[[[]]]",
        package_data_qualifiers: "[[{}]]",
        package_data_subpath: "[[[]]]",
        package_data_purl: '[["pkg:about/scancode-toolkit"]]',
        package_data_primary_language: "[[[]]]",
        package_data_code_type: "[[[]]]",
        package_data_description: "[[[]]]",
        package_data_size: "[[[]]]",
        package_data_release_date: "[[[]]]",
        package_data_keywords: "[[[]]]",
        package_data_homepage_url: '[["https://www.aboutcode.org/"]]',
        package_data_download_url: "[[[]]]",
        package_data_download_checksums: "[[[]]]",
        package_data_bug_tracking_url: "[[[]]]",
        package_data_code_view_url: "[[[]]]",
        package_data_vcs_tool: "[[[]]]",
        package_data_vcs_url: "[[[]]]",
        package_data_vcs_repository: "[[[]]]",
        package_data_vcs_revision: "[[[]]]",
        package_data_extracted_license_statement:
          '[["apache-2.0 AND cc-by-4.0 AND other-permissive AND other-copyleft"]]',
        package_data_declared_license_expression:
          '[["Apache-2.0 AND CC-BY-4.0"]]',
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[[[]]]",
        package_data_dependencies: "[[[]]]",
        package_data_related_packages: "[[[]]]",
      },
    ],
    expectedPackages: [
      {
        id: 1,
        package_uid:
          "pkg:about/scancode-toolkit?uuid=3b5a9865-8101-430a-ac7c-9f184631b803",
        type: "about",
        namespace: null,
        name: "scancode-toolkit",
        version: null,
        qualifiers: "{}",
        subpath: null,
        primary_language: null,
        description: null,
        release_date: null,
        parties:
          '[{"type":"person","role":"owner","name":"None","email":null,"url":null}]',
        keywords: "[]",
        homepage_url: "https://www.aboutcode.org/",
        download_url: null,
        size: null,
        sha1: null,
        md5: null,
        sha256: null,
        sha512: null,
        bug_tracking_url: null,
        code_view_url: null,
        vcs_url: null,
        copyright: "Copyright (c) nexB Inc. and others.",
        declared_license_expression: "apache-2.0 AND cc-by-4.0",
        declared_license_expression_spdx: "Apache-2.0 AND CC-BY-4.0",
        license_detections:
          '[{"license_expression":"apache-2.0 AND cc-by-4.0","identifier":"apache_2_0_and_cc_by_4_0-9b136727-da14-7f8d-c7e5-319687ed57a5"}]',
        other_license_expression: null,
        other_license_expression_spdx: null,
        other_license_detections: "[]",
        extracted_license_statement:
          "apache-2.0 AND cc-by-4.0 AND other-permissive AND other-copyleft",
        notice_text: null,
        source_packages: "[]",
        extra_data:
          '{"missing_file_references":[{"path":".","size":0,"sha1":null,"md5":null,"sha256":null,"sha512":null,"extra_data":{}}]}',
        repository_homepage_url: null,
        repository_download_url: null,
        api_data_url: null,
        datafile_paths: '["python-sample-trimmed/scancode-toolkit.ABOUT"]',
        datasource_ids: '["about_file"]',
        purl: "pkg:about/scancode-toolkit",
      },
    ],
    expectedDependencies: [
      {
        id: 1,
        purl: "pkg:pypi/aboutcode-toolkit@6.0.0",
        extracted_requirement: "aboutcode-toolkit==6.0.0",
        scope: "development",
        is_runtime: false,
        is_optional: true,
        is_resolved: true,
        resolved_package: "{}",
        dependency_uid:
          "pkg:pypi/aboutcode-toolkit@6.0.0?uuid=faa3b45c-2e04-4891-b854-52ed459a6b0a",
        for_package_uid: null,
        datafile_path: "python-sample-trimmed/requirements-dev.txt",
        datasource_id: "pip_requirements",
      },
      {
        id: 2,
        purl: "pkg:pypi/py@1.10.0",
        extracted_requirement: "py==1.10.0",
        scope: "development",
        is_runtime: false,
        is_optional: true,
        is_resolved: true,
        resolved_package: "{}",
        dependency_uid:
          "pkg:pypi/py@1.10.0?uuid=b2cf6831-b0eb-4a30-98c3-3dac9202d639",
        for_package_uid: null,
        datafile_path: "python-sample-trimmed/requirements-dev.txt",
        datasource_id: "pip_requirements",
      },
      {
        id: 3,
        purl: "pkg:pypi/pytest@6.2.4",
        extracted_requirement: "pytest==6.2.4",
        scope: "development",
        is_runtime: false,
        is_optional: true,
        is_resolved: true,
        resolved_package: "{}",
        dependency_uid:
          "pkg:pypi/pytest@6.2.4?uuid=1c719652-292f-419c-a7a4-164c39296661",
        for_package_uid: null,
        datafile_path: "python-sample-trimmed/requirements-dev.txt",
        datasource_id: "pip_requirements",
      },
    ],
    expectedPackageData: [
      {
        id: 1,
        fileId: 2,
        type: "pypi",
        namespace: null,
        name: null,
        version: null,
        qualifiers: "{}",
        subpath: null,
        purl: null,
        primary_language: "Python",
        code_type: null,
        description: null,
        size: null,
        release_date: null,
        parties: "[]",
        keywords: "[]",
        homepage_url: null,
        download_url: null,
        download_checksums: "[]",
        bug_tracking_url: null,
        code_view_url: null,
        vcs_tool: null,
        vcs_repository: null,
        vcs_revision: null,
        copyright: null,
        declared_license_expression: null,
        declared_license_expression_spdx: null,
        extracted_license_statement: null,
        notice_text: null,
        dependencies: "[]",
        related_packages: "[]",
      },
      {
        id: 2,
        fileId: 3,
        type: "pypi",
        namespace: null,
        name: null,
        version: null,
        qualifiers: "{}",
        subpath: null,
        purl: null,
        primary_language: "Python",
        code_type: null,
        description: null,
        size: null,
        release_date: null,
        parties: "[]",
        keywords: "[]",
        homepage_url: null,
        download_url: null,
        download_checksums: "[]",
        bug_tracking_url: null,
        code_view_url: null,
        vcs_tool: null,
        vcs_repository: null,
        vcs_revision: null,
        copyright: null,
        declared_license_expression: null,
        declared_license_expression_spdx: null,
        extracted_license_statement: null,
        notice_text: null,
        dependencies:
          '[{"purl":"pkg:pypi/aboutcode-toolkit@6.0.0","extracted_requirement":"aboutcode-toolkit==6.0.0","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}},{"purl":"pkg:pypi/py@1.10.0","extracted_requirement":"py==1.10.0","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}},{"purl":"pkg:pypi/pytest@6.2.4","extracted_requirement":"pytest==6.2.4","scope":"development","is_runtime":false,"is_optional":true,"is_resolved":true,"resolved_package":{},"extra_data":{"is_editable":false,"link":null,"hash_options":[],"is_constraint":false,"is_archive":null,"is_wheel":false,"is_url":null,"is_vcs_url":null,"is_name_at_url":false,"is_local_path":null}}]',
        related_packages: "[]",
      },
      {
        id: 3,
        fileId: 4,
        type: "about",
        namespace: null,
        name: "scancode-toolkit",
        version: null,
        qualifiers: "{}",
        subpath: null,
        purl: "pkg:about/scancode-toolkit",
        primary_language: null,
        code_type: null,
        description: null,
        size: null,
        release_date: null,
        parties:
          '[{"type":"person","role":"owner","name":"None","email":null,"url":null}]',
        keywords: "[]",
        homepage_url: "https://www.aboutcode.org/",
        download_url: null,
        download_checksums: "[]",
        bug_tracking_url: null,
        code_view_url: null,
        vcs_tool: null,
        vcs_repository: null,
        vcs_revision: null,
        copyright: "Copyright (c) nexB Inc. and others.",
        declared_license_expression: "apache-2.0 AND cc-by-4.0",
        declared_license_expression_spdx: "Apache-2.0 AND CC-BY-4.0",
        extracted_license_statement:
          "apache-2.0 AND cc-by-4.0 AND other-permissive AND other-copyleft",
        notice_text: null,
        dependencies: "[]",
        related_packages: "[]",
      },
    ],
  },
  {
    jsonFileName: "nullPackageData.json",
    expectedFlatFiles: [
      {
        for_packages: "[]",
        package_data_type: "[]",
        package_data_namespace: "[]",
        package_data_name: "[]",
        package_data_version: "[]",
        package_data_qualifiers: "[]",
        package_data_subpath: "[]",
        package_data_purl: "[]",
        package_data_primary_language: "[]",
        package_data_code_type: "[]",
        package_data_description: "[]",
        package_data_size: "[]",
        package_data_release_date: "[]",
        package_data_keywords: "[]",
        package_data_homepage_url: "[]",
        package_data_download_url: "[]",
        package_data_download_checksums: "[]",
        package_data_bug_tracking_url: "[]",
        package_data_code_view_url: "[]",
        package_data_vcs_tool: "[]",
        package_data_vcs_url: "[]",
        package_data_vcs_repository: "[]",
        package_data_vcs_revision: "[]",
        package_data_extracted_license_statement: "[]",
        package_data_declared_license_expression: "[]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[]",
        package_data_dependencies: "[]",
        package_data_related_packages: "[]",
      },
      {
        for_packages:
          '["pkg:maven/org.elasticsearch/elasticsearch@7.16.3?uuid=f9eb7144-715b-4293-8eb4-826897071e83"]',
        package_data_type: "[[[]]]",
        package_data_namespace: "[]",
        package_data_name: "[[[]]]",
        package_data_version: "[[[]]]",
        package_data_qualifiers: "[[{}]]",
        package_data_subpath: "[[[]]]",
        package_data_purl: "[[[]]]",
        package_data_primary_language: "[[[]]]",
        package_data_code_type: "[[[]]]",
        package_data_description: "[[[]]]",
        package_data_size: "[[[]]]",
        package_data_release_date: "[[[]]]",
        package_data_keywords: "[[[]]]",
        package_data_homepage_url: "[[[]]]",
        package_data_download_url: "[[[]]]",
        package_data_download_checksums: "[[[]]]",
        package_data_bug_tracking_url: "[[[]]]",
        package_data_code_view_url: "[[[]]]",
        package_data_vcs_tool: "[[[]]]",
        package_data_vcs_url: "[[[]]]",
        package_data_vcs_repository: "[[[]]]",
        package_data_vcs_revision: "[[[]]]",
        package_data_extracted_license_statement: "[[[]]]",
        package_data_declared_license_expression: "[[[]]]",
        package_data_declared_license_expression_spdx: "[]",
        package_data_notice_text: "[[[]]]",
        package_data_dependencies: "[[[]]]",
        package_data_related_packages: "[[[]]]",
      },
    ],
    expectedPackages: [
      {
        id: 1,
        package_uid:
          "pkg:maven/org.elasticsearch/elasticsearch@7.16.3?uuid=f9eb7144-715b-4293-8eb4-826897071e83",
        type: "maven",
        namespace: "org.elasticsearch",
        name: "elasticsearch",
        version: "7.16.3",
        qualifiers: "{}",
        subpath: null,
        primary_language: "Java",
        description: "server\nElasticsearch subproject :server",
        release_date: null,
        parties:
          '[{"type":"person","role":"developper","name":"Elastic","email":null,"url":"https://www.elastic.co"}]',
        keywords: "[]",
        homepage_url: "https://github.com/elastic/elasticsearch",
        download_url: null,
        size: null,
        sha1: null,
        md5: null,
        sha256: null,
        sha512: null,
        bug_tracking_url: null,
        code_view_url: "https://github.com/elastic/elasticsearch.git",
        vcs_url: "https://github.com/elastic/elasticsearch.git",
        copyright: null,
        declared_license_expression: "elastic-license-v2 AND mongodb-sspl-1.0",
        declared_license_expression_spdx: "Elastic-2.0 AND SSPL-1.0",
        license_detections:
          '[{"license_expression":"elastic-license-v2","identifier":"elastic_license_v2-6c37b8f5-5040-e1bb-0317-f206f4c3bf1e"},{"license_expression":"elastic-license-v2","identifier":"elastic_license_v2-b6912041-a97e-92aa-9086-3b2dad5c3f7a"},{"license_expression":"mongodb-sspl-1.0","identifier":"mongodb_sspl_1_0-40b027d1-15f0-7f38-f6e5-0c4a6824884e"},{"license_expression":"mongodb-sspl-1.0","identifier":"mongodb_sspl_1_0-ed7798b8-5fa4-d992-84da-b64833db315c"}]',
        other_license_expression: null,
        other_license_expression_spdx: null,
        other_license_detections: "[]",
        extracted_license_statement:
          "[{'name': 'Elastic License 2.0', 'url': 'https://raw.githubusercontent.com/elastic/elasticsearch/v7.16.3/licenses/ELASTIC-LICENSE-2.0.txt', 'comments': None, 'distribution': 'repo'}, {'name': 'Server Side Public License, v 1', 'url': 'https://www.mongodb.com/licensing/server-side-public-license', 'comments': None, 'distribution': 'repo'}]",
        notice_text: null,
        source_packages:
          '["pkg:maven/org.elasticsearch/elasticsearch@7.16.3?classifier=sources"]',
        extra_data: "{}",
        repository_homepage_url:
          "https://repo1.maven.org/maven2/org/elasticsearch/elasticsearch/7.16.3/",
        repository_download_url:
          "https://repo1.maven.org/maven2/org/elasticsearch/elasticsearch/7.16.3/elasticsearch-7.16.3.jar",
        api_data_url:
          "https://repo1.maven.org/maven2/org/elasticsearch/elasticsearch/7.16.3/elasticsearch-7.16.3.pom",
        datafile_paths:
          '["elasticsearch/elasticsearch/7.16.3/elasticsearch-7.16.3.pom"]',
        datasource_ids: '["maven_pom"]',
        purl: "pkg:maven/org.elasticsearch/elasticsearch@7.16.3",
      },
    ],
    expectedDependencies: [],
    expectedPackageData: [
      {
        id: 1,
        fileId: 1,
        type: null,
        namespace: null,
        name: null,
        version: null,
        qualifiers: "{}",
        subpath: null,
        purl: null,
        primary_language: null,
        code_type: null,
        description: null,
        size: null,
        release_date: null,
        parties: "[]",
        keywords: "[]",
        homepage_url: null,
        download_url: null,
        download_checksums: "[]",
        bug_tracking_url: null,
        code_view_url: null,
        vcs_tool: null,
        vcs_repository: null,
        vcs_revision: null,
        copyright: null,
        declared_license_expression: null,
        declared_license_expression_spdx: null,
        extracted_license_statement: null,
        notice_text: null,
        dependencies: "[]",
        related_packages: "[]",
      },
    ],
  },
];
