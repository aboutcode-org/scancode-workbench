import { LicenseFlatFileAttributes } from "../../../src/services/models/flatFile";
import { LicenseClueAttributes } from "../../../src/services/models/licenseClues";
import { LicenseExpressionAttributes } from "../../../src/services/models/licenseExpression";
import { LicensePolicyAttributes } from "../../../src/services/models/licensePolicy";
import { LicenseRuleReferenceAttributes } from "../../../src/services/models/licenseRuleReference";
import { LicenseDetectionAttributes } from "../../../src/services/models/licenseDetections";
import { LicenseReferenceAttributes } from "../../../src/services/models/licenseReference";

export const LicenseSamples: {
  jsonFileName: string;
  expectedFlatFiles: LicenseFlatFileAttributes[];
  expectedLicenseClues: LicenseClueAttributes[];
  expectedLicenseDetections: LicenseDetectionAttributes[];
  expectedLicenseExpressions: LicenseExpressionAttributes[];
  expectedLicensePolicies: LicensePolicyAttributes[];
  expectedLicenseReferences: LicenseReferenceAttributes[];
  expectedLicenseRuleReferences: LicenseRuleReferenceAttributes[];
}[] = [
  {
    jsonFileName: "withLicenses.json",
    expectedLicenseClues: [
      {
        matches: [
          {
            score: 52,
            start_line: 56,
            end_line: 59,
            matched_length: 13,
            match_coverage: 52,
            matcher: "3-seq",
            license_expression: "apache-2.0 OR gpl-2.0",
            license_expression_spdx: "Apache-2.0 OR GPL-2.0-only",
            license_expression_keys: [
              {
                key: "apache-2.0",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/apache-2.0",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
              },
              {
                key: "gpl-2.0",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/gpl-2.0",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/gpl-2.0.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "Apache-2.0",
                spdx_url: "https://spdx.org/licenses/Apache-2.0",
              },
              {
                key: "GPL-2.0-only",
                spdx_url: "https://spdx.org/licenses/GPL-2.0-only",
              },
            ],
            rule_identifier: "apache-2.0_or_gpl-2.0_24.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE",
            path: "rx-lite/package.json",
          },
        ],
        file_regions: [
          {
            path: "rx-lite/package.json",
            start_line: 56,
            end_line: 59,
          },
        ],
        id: 1,
        fileId: 5,
        filePath: "rx-lite/package.json",
        fileClueIdx: 0,
        score: 52,
        license_expression: "apache-2.0 OR gpl-2.0",
        rule_identifier: "apache-2.0_or_gpl-2.0_24.RULE",
        reviewed: false,
      },
    ],
    expectedLicenseDetections: [
      {
        detection_log: [],
        matches: [
          {
            score: 100,
            start_line: 1,
            end_line: 1,
            matched_length: 4,
            match_coverage: 100,
            matcher: "2-aho",
            license_expression: "apache-2.0",
            rule_identifier: "apache-2.0_65.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_65.RULE",
            license_expression_spdx: "Apache-2.0",
            license_expression_keys: [
              {
                key: "apache-2.0",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/apache-2.0",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "Apache-2.0",
                spdx_url: "https://spdx.org/licenses/Apache-2.0",
              },
            ],
            path: "anglesharp.css.0.16.4/file_with_multiple_licenses.txt",
          },
          {
            score: 100,
            start_line: 3,
            end_line: 3,
            matched_length: 4,
            match_coverage: 100,
            matcher: "2-aho",
            license_expression: "gpl-3.0",
            rule_identifier: "gpl-3.0_173.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/gpl-3.0_173.RULE",
            license_expression_spdx: "GPL-3.0-only",
            license_expression_keys: [
              {
                key: "gpl-3.0",
                licensedb_url: null,
                scancode_url: null,
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "GPL-3.0-only",
                spdx_url: null,
              },
            ],
            path: "anglesharp.css.0.16.4/file_with_multiple_licenses.txt",
          },
        ],
        file_regions: [
          {
            path: "anglesharp.css.0.16.4/file_with_multiple_licenses.txt",
            start_line: 1,
            end_line: 3,
            from_package: null,
          },
        ],
        id: 1,
        identifier:
          "apache_2_0_and_gpl_3_0-494ca0ae-1282-09a2-139f-a52c04fde6dc",
        license_expression: "apache-2.0 AND gpl-3.0",
        detection_count: 1,
        reviewed: false,
        count: null,
      },
      {
        detection_log: [],
        matches: [
          {
            score: 100,
            start_line: 9,
            end_line: 9,
            matched_length: 2,
            match_coverage: 100,
            matcher: "2-aho",
            license_expression: "mit",
            rule_identifier: "mit_14.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/mit_14.RULE",
            matched_text: "MIT</license>",
            license_expression_spdx: "MIT",
            license_expression_keys: [
              {
                key: "mit",
                licensedb_url: "https://scancode-licensedb.aboutcode.org/mit",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "MIT",
                spdx_url: "https://spdx.org/licenses/MIT",
              },
            ],
            path: "anglesharp.css.0.16.4/AngleSharp.Css.nuspec",
          },
          {
            score: 100,
            start_line: 10,
            end_line: 10,
            matched_length: 5,
            match_coverage: 100,
            matcher: "1-spdx-id",
            license_expression: "mit",
            rule_identifier:
              "spdx-license-identifier-mit-c02399fc3bda518cf5890c9587642a2525fce16b",
            rule_relevance: 100,
            rule_url: null,
            matched_text: "licenses.nuget.org/MIT</licenseUrl>",
            license_expression_spdx: "MIT",
            license_expression_keys: [
              {
                key: "mit",
                licensedb_url: "https://scancode-licensedb.aboutcode.org/mit",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "MIT",
                spdx_url: "https://spdx.org/licenses/MIT",
              },
            ],
            path: "anglesharp.css.0.16.4/AngleSharp.Css.nuspec",
          },
        ],
        file_regions: [
          {
            path: "anglesharp.css.0.16.4/AngleSharp.Css.nuspec",
            start_line: 9,
            end_line: 10,
            from_package: null,
          },
        ],
        id: 2,
        identifier: "mit-b941df29-6c4b-fe7e-752f-a5fc7f9a28b5",
        license_expression: "mit",
        detection_count: 1,
        reviewed: false,
        count: null,
      },
      {
        detection_log: [],
        matches: [
          {
            score: 100,
            start_line: 1,
            end_line: 1,
            matched_length: 1,
            match_coverage: 100,
            matcher: "1-spdx-id",
            license_expression: "mit",
            rule_identifier:
              "spdx-license-identifier-mit-5da48780aba670b0860c46d899ed42a0f243ff06",
            rule_relevance: 100,
            rule_url: null,
            matched_text: "MIT",
            license_expression_spdx: "MIT",
            license_expression_keys: [
              {
                key: "mit",
                licensedb_url: "https://scancode-licensedb.aboutcode.org/mit",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "MIT",
                spdx_url: "https://spdx.org/licenses/MIT",
              },
            ],
            path: "anglesharp.css.0.16.4/AngleSharp.Css.nuspec",
          },
        ],
        file_regions: [
          {
            path: "anglesharp.css.0.16.4/AngleSharp.Css.nuspec",
            start_line: 1,
            end_line: 1,
            from_package: "pkg:nuget/AngleSharp.Css@0.16.4",
          },
        ],
        id: 3,
        identifier: "mit-a822f434-d61f-f2b1-c792-8b8cb9e7b9bf",
        license_expression: "mit",
        detection_count: 1,
        reviewed: false,
        count: null,
      },
      {
        detection_log: [],
        matches: [
          {
            score: 77.78,
            start_line: 1,
            end_line: 1,
            matched_length: 7,
            match_coverage: 100,
            matcher: "5-undetected",
            license_expression: "unknown",
            rule_identifier:
              "package-manifest-unknown-16117ed57856733eaaf6d91ea575b186a9dab3df",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/package-manifest-unknown-16117ed57856733eaaf6d91ea575b186a9dab3df",
            matched_text:
              "license {'LegalCopyright': 'Copyright © AngleSharp, 2013-2019', 'LegalTrademarks': '', 'License': None}",
            license_expression_spdx: "LicenseRef-scancode-unknown",
            license_expression_keys: [
              {
                key: "unknown",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/unknown",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/unknown.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "LicenseRef-scancode-unknown",
                spdx_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/unknown.LICENSE",
              },
            ],
            path: "anglesharp.css.0.16.4/AngleSharp.Css.dll",
          },
        ],
        file_regions: [
          {
            path: "anglesharp.css.0.16.4/AngleSharp.Css.dll",
            start_line: 1,
            end_line: 1,
            from_package:
              "pkg:winexe/AngleSharp.Css@0.16.4%2Ba754c9adb1d678341e9f489674a8ad7a7199eae8",
          },
          {
            path: "anglesharp.css.0.16.4/AngleSharpLib.Css.dll",
            start_line: 1,
            end_line: 1,
            from_package:
              "pkg:winexe/AngleSharp.Css@0.16.4%2Ba754c9adb1d678341e9f489674a8ad7a7199eae8",
          },
        ],
        id: 4,
        identifier: "unknown-73f5f4e3-0fd7-c629-d3b0-a8bf52447aff",
        license_expression: "unknown",
        detection_count: 4,
        reviewed: false,
        count: null,
      },
      {
        detection_log: [],
        matches: [
          {
            score: 100,
            start_line: 1,
            end_line: 1,
            matched_length: 5,
            match_coverage: 100,
            matcher: "1-hash",
            license_expression: "apache-2.0",
            rule_identifier: "apache-2.0_48.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_48.RULE",
            matched_text: "Apache License, Version 2.0",
            license_expression_spdx: "Apache-2.0",
            license_expression_keys: [
              {
                key: "apache-2.0",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/apache-2.0",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "Apache-2.0",
                spdx_url: "https://spdx.org/licenses/Apache-2.0",
              },
            ],
            path: "rx-lite/package.json",
          },
        ],
        file_regions: [
          {
            path: "rx-lite/package.json",
            start_line: 1,
            end_line: 1,
            from_package: "pkg:npm/rx-lite@4.0.8",
          },
        ],
        id: 5,
        identifier: "apache_2_0-428c1364-ecb5-f806-7a2e-77d10737a7ce",
        license_expression: "apache-2.0",
        detection_count: 1,
        reviewed: false,
        count: null,
      },
      {
        detection_log: [],
        matches: [
          {
            score: 100,
            start_line: 1,
            end_line: 1,
            matched_length: 9,
            match_coverage: 100,
            matcher: "1-hash",
            license_expression: "apache-2.0",
            rule_identifier: "apache-2.0_20.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_20.RULE",
            matched_text: "http://www.apache.org/licenses/LICENSE-2.0.html",
            license_expression_spdx: "Apache-2.0",
            license_expression_keys: [
              {
                key: "apache-2.0",
                licensedb_url:
                  "https://scancode-licensedb.aboutcode.org/apache-2.0",
                scancode_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
              },
            ],
            license_expression_spdx_keys: [
              {
                key: "Apache-2.0",
                spdx_url: "https://spdx.org/licenses/Apache-2.0",
              },
            ],
            path: "rx-lite/package.json",
          },
        ],
        file_regions: [
          {
            path: "rx-lite/package.json",
            start_line: 1,
            end_line: 1,
            from_package: "pkg:npm/rx-lite@4.0.8",
          },
        ],
        id: 6,
        identifier: "apache_2_0-9a5226a4-0901-7d18-06ae-49c1887ecbd7",
        license_expression: "apache-2.0",
        detection_count: 1,
        reviewed: false,
        count: null,
      },
    ],
    expectedLicenseExpressions: [
      {
        id: 1,
        fileId: 1,
        license_expression: "apache-2.0 AND gpl-3.0",
        license_expression_spdx: "Apache-2.0 AND GPL-3.0-only",
        license_keys: ["apache-2.0", "gpl-3.0"],
        license_keys_spdx: ["Apache-2.0", "GPL-3.0-only"],
      },
      {
        id: 2,
        fileId: 3,
        license_expression: "mit",
        license_expression_spdx: "MIT",
        license_keys: ["mit"],
        license_keys_spdx: ["MIT"],
      },
    ],
    expectedLicensePolicies: [
      {
        id: 1,
        fileId: 1,
        license_key: "apache-2.0",
        label: "Approved License",
        color_code: "#008000",
        icon: "icon-ok-circle",
      },
      {
        id: 2,
        fileId: 1,
        license_key: "gpl-3.0",
        label: "Restricted License",
        color_code: "#FFcc33",
        icon: "icon-warning-sign",
      },
    ],
    expectedLicenseReferences: [
      {
        other_spdx_license_keys: [],
        id: 1,
        key: "mit",
        language: "en",
        short_name: "MIT License",
        name: "MIT License",
        category: "Permissive",
        owner: "MIT",
        homepage_url: "http://opensource.org/licenses/mit-license.php",
        is_builtin: true,
        is_exception: false,
        is_unknown: false,
        is_generic: false,
        spdx_license_key: "MIT",
        osi_license_key: null,
        osi_url: "http://www.opensource.org/licenses/MIT",
        text: 'Permission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n"Software"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
        scancode_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE",
        licensedb_url: "https://scancode-licensedb.aboutcode.org/mit",
        spdx_url: "https://spdx.org/licenses/MIT",
      },
      {
        other_spdx_license_keys: [],
        id: 2,
        key: "unknown",
        language: "en",
        short_name: "unknown",
        name: "Unknown license detected but not recognized",
        category: "Unstated License",
        owner: "Unspecified",
        homepage_url: null,
        is_builtin: true,
        is_exception: false,
        is_unknown: true,
        is_generic: false,
        spdx_license_key: "LicenseRef-scancode-unknown",
        osi_license_key: null,
        osi_url: null,
        text: "",
        scancode_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/unknown.LICENSE",
        licensedb_url: "https://scancode-licensedb.aboutcode.org/unknown",
        spdx_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/unknown.LICENSE",
      },
      {
        other_spdx_license_keys: ["LicenseRef-Apache", "LicenseRef-Apache-2.0"],
        id: 3,
        key: "apache-2.0",
        language: "en",
        short_name: "Apache 2.0",
        name: "Apache License 2.0",
        category: "Permissive",
        owner: "Apache Software Foundation",
        homepage_url: "http://www.apache.org/licenses/",
        is_builtin: true,
        is_exception: false,
        is_unknown: false,
        is_generic: false,
        spdx_license_key: "Apache-2.0",
        osi_license_key: "Apache-2.0",
        osi_url: "http://opensource.org/licenses/apache2.0.php",
        text: '                                 Apache License\n                           Version 2.0, January 2004\n                        http://www.apache.org/licenses/\n \n   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\n \n   1. Definitions.\n \n      "License" shall mean the terms and conditions for use, reproduction,\n      and distribution as defined by Sections 1 through 9 of this document.\n \n      "Licensor" shall mean the copyright owner or entity authorized by\n      the copyright owner that is granting the License.\n \n      "Legal Entity" shall mean the union of the acting entity and all\n      other entities that control, are controlled by, or are under common\n      control with that entity. For the purposes of this definition,\n      "control" means (i) the power, direct or indirect, to cause the\n      direction or management of such entity, whether by contract or\n      otherwise, or (ii) ownership of fifty percent (50%) or more of the\n      outstanding shares, or (iii) beneficial ownership of such entity.\n \n      "You" (or "Your") shall mean an individual or Legal Entity\n      exercising permissions granted by this License.\n \n      "Source" form shall mean the preferred form for making modifications,\n      including but not limited to software source code, documentation\n      source, and configuration files.\n \n      "Object" form shall mean any form resulting from mechanical\n      transformation or translation of a Source form, including but\n      not limited to compiled object code, generated documentation,\n      and conversions to other media types.\n \n      "Work" shall mean the work of authorship, whether in Source or\n      Object form, made available under the License, as indicated by a\n      copyright notice that is included in or attached to the work\n      (an example is provided in the Appendix below).\n \n      "Derivative Works" shall mean any work, whether in Source or Object\n      form, that is based on (or derived from) the Work and for which the\n      editorial revisions, annotations, elaborations, or other modifications\n      represent, as a whole, an original work of authorship. For the purposes\n      of this License, Derivative Works shall not include works that remain\n      separable from, or merely link (or bind by name) to the interfaces of,\n      the Work and Derivative Works thereof.\n \n      "Contribution" shall mean any work of authorship, including\n      the original version of the Work and any modifications or additions\n      to that Work or Derivative Works thereof, that is intentionally\n      submitted to Licensor for inclusion in the Work by the copyright owner\n      or by an individual or Legal Entity authorized to submit on behalf of\n      the copyright owner. For the purposes of this definition, "submitted"\n      means any form of electronic, verbal, or written communication sent\n      to the Licensor or its representatives, including but not limited to\n      communication on electronic mailing lists, source code control systems,\n      and issue tracking systems that are managed by, or on behalf of, the\n      Licensor for the purpose of discussing and improving the Work, but\n      excluding communication that is conspicuously marked or otherwise\n      designated in writing by the copyright owner as "Not a Contribution."\n \n      "Contributor" shall mean Licensor and any individual or Legal Entity\n      on behalf of whom a Contribution has been received by Licensor and\n      subsequently incorporated within the Work.\n \n   2. Grant of Copyright License. Subject to the terms and conditions of\n      this License, each Contributor hereby grants to You a perpetual,\n      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n      copyright license to reproduce, prepare Derivative Works of,\n      publicly display, publicly perform, sublicense, and distribute the\n      Work and such Derivative Works in Source or Object form.\n \n   3. Grant of Patent License. Subject to the terms and conditions of\n      this License, each Contributor hereby grants to You a perpetual,\n      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n      (except as stated in this section) patent license to make, have made,\n      use, offer to sell, sell, import, and otherwise transfer the Work,\n      where such license applies only to those patent claims licensable\n      by such Contributor that are necessarily infringed by their\n      Contribution(s) alone or by combination of their Contribution(s)\n      with the Work to which such Contribution(s) was submitted. If You\n      institute patent litigation against any entity (including a\n      cross-claim or counterclaim in a lawsuit) alleging that the Work\n      or a Contribution incorporated within the Work constitutes direct\n      or contributory patent infringement, then any patent licenses\n      granted to You under this License for that Work shall terminate\n      as of the date such litigation is filed.\n \n   4. Redistribution. You may reproduce and distribute copies of the\n      Work or Derivative Works thereof in any medium, with or without\n      modifications, and in Source or Object form, provided that You\n      meet the following conditions:\n \n      (a) You must give any other recipients of the Work or\n          Derivative Works a copy of this License; and\n \n      (b) You must cause any modified files to carry prominent notices\n          stating that You changed the files; and\n \n      (c) You must retain, in the Source form of any Derivative Works\n          that You distribute, all copyright, patent, trademark, and\n          attribution notices from the Source form of the Work,\n          excluding those notices that do not pertain to any part of\n          the Derivative Works; and\n \n      (d) If the Work includes a "NOTICE" text file as part of its\n          distribution, then any Derivative Works that You distribute must\n          include a readable copy of the attribution notices contained\n          within such NOTICE file, excluding those notices that do not\n          pertain to any part of the Derivative Works, in at least one\n          of the following places: within a NOTICE text file distributed\n          as part of the Derivative Works; within the Source form or\n          documentation, if provided along with the Derivative Works; or,\n          within a display generated by the Derivative Works, if and\n          wherever such third-party notices normally appear. The contents\n          of the NOTICE file are for informational purposes only and\n          do not modify the License. You may add Your own attribution\n          notices within Derivative Works that You distribute, alongside\n          or as an addendum to the NOTICE text from the Work, provided\n          that such additional attribution notices cannot be construed\n          as modifying the License.\n \n      You may add Your own copyright statement to Your modifications and\n      may provide additional or different license terms and conditions\n      for use, reproduction, or distribution of Your modifications, or\n      for any such Derivative Works as a whole, provided Your use,\n      reproduction, and distribution of the Work otherwise complies with\n      the conditions stated in this License.\n \n   5. Submission of Contributions. Unless You explicitly state otherwise,\n      any Contribution intentionally submitted for inclusion in the Work\n      by You to the Licensor shall be under the terms and conditions of\n      this License, without any additional terms or conditions.\n      Notwithstanding the above, nothing herein shall supersede or modify\n      the terms of any separate license agreement you may have executed\n      with Licensor regarding such Contributions.\n \n   6. Trademarks. This License does not grant permission to use the trade\n      names, trademarks, service marks, or product names of the Licensor,\n      except as required for reasonable and customary use in describing the\n      origin of the Work and reproducing the content of the NOTICE file.\n \n   7. Disclaimer of Warranty. Unless required by applicable law or\n      agreed to in writing, Licensor provides the Work (and each\n      Contributor provides its Contributions) on an "AS IS" BASIS,\n      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or\n      implied, including, without limitation, any warranties or conditions\n      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A\n      PARTICULAR PURPOSE. You are solely responsible for determining the\n      appropriateness of using or redistributing the Work and assume any\n      risks associated with Your exercise of permissions under this License.\n \n   8. Limitation of Liability. In no event and under no legal theory,\n      whether in tort (including negligence), contract, or otherwise,\n      unless required by applicable law (such as deliberate and grossly\n      negligent acts) or agreed to in writing, shall any Contributor be\n      liable to You for damages, including any direct, indirect, special,\n      incidental, or consequential damages of any character arising as a\n      result of this License or out of the use or inability to use the\n      Work (including but not limited to damages for loss of goodwill,\n      work stoppage, computer failure or malfunction, or any and all\n      other commercial damages or losses), even if such Contributor\n      has been advised of the possibility of such damages.\n \n   9. Accepting Warranty or Additional Liability. While redistributing\n      the Work or Derivative Works thereof, You may choose to offer,\n      and charge a fee for, acceptance of support, warranty, indemnity,\n      or other liability obligations and/or rights consistent with this\n      License. However, in accepting such obligations, You may act only\n      on Your own behalf and on Your sole responsibility, not on behalf\n      of any other Contributor, and only if You agree to indemnify,\n      defend, and hold each Contributor harmless for any liability\n      incurred by, or claims asserted against, such Contributor by reason\n      of your accepting any such warranty or additional liability.\n \n   END OF TERMS AND CONDITIONS\n \n   APPENDIX: How to apply the Apache License to your work.\n \n      To apply the Apache License to your work, attach the following\n      boilerplate notice, with the fields enclosed by brackets "[]"\n      replaced with your own identifying information. (Don\'t include\n      the brackets!)  The text should be enclosed in the appropriate\n      comment syntax for the file format. We also recommend that a\n      file or class name and description of purpose be included on the\n      same "printed page" as the copyright notice for easier\n      identification within third-party archives.\n \n   Copyright [yyyy] [name of copyright owner]\n \n   Licensed under the Apache License, Version 2.0 (the "License");\n   you may not use this file except in compliance with the License.\n   You may obtain a copy of the License at\n \n       http://www.apache.org/licenses/LICENSE-2.0\n \n   Unless required by applicable law or agreed to in writing, software\n   distributed under the License is distributed on an "AS IS" BASIS,\n   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n   See the License for the specific language governing permissions and\n   limitations under the License.',
        scancode_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
        licensedb_url: "https://scancode-licensedb.aboutcode.org/apache-2.0",
        spdx_url: "https://spdx.org/licenses/Apache-2.0",
      },
      {
        other_spdx_license_keys: ["GPL-2.0", "GPL 2.0", "LicenseRef-GPL-2.0"],
        id: 4,
        key: "gpl-2.0",
        language: "en",
        short_name: "GPL 2.0",
        name: "GNU General Public License 2.0",
        category: "Copyleft",
        owner: "Free Software Foundation (FSF)",
        homepage_url: "http://www.gnu.org/licenses/gpl-2.0.html",
        is_builtin: true,
        is_exception: false,
        is_unknown: false,
        is_generic: false,
        spdx_license_key: "GPL-2.0-only",
        osi_license_key: "GPL-2.0",
        osi_url: "http://opensource.org/licenses/gpl-license.php",
        text: '                    GNU GENERAL PUBLIC LICENSE\n                       Version 2, June 1991\n \n Copyright (C) 1989, 1991 Free Software Foundation, Inc.,\n 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA\n Everyone is permitted to copy and distribute verbatim copies\n of this license document, but changing it is not allowed.\n \n                            Preamble\n \n  The licenses for most software are designed to take away your\nfreedom to share and change it.  By contrast, the GNU General Public\nLicense is intended to guarantee your freedom to share and change free\nsoftware--to make sure the software is free for all its users.  This\nGeneral Public License applies to most of the Free Software\nFoundation\'s software and to any other program whose authors commit to\nusing it.  (Some other Free Software Foundation software is covered by\nthe GNU Lesser General Public License instead.)  You can apply it to\nyour programs, too.\n \n  When we speak of free software, we are referring to freedom, not\nprice.  Our General Public Licenses are designed to make sure that you\nhave the freedom to distribute copies of free software (and charge for\nthis service if you wish), that you receive source code or can get it\nif you want it, that you can change the software or use pieces of it\nin new free programs; and that you know you can do these things.\n \n  To protect your rights, we need to make restrictions that forbid\nanyone to deny you these rights or to ask you to surrender the rights.\nThese restrictions translate to certain responsibilities for you if you\ndistribute copies of the software, or if you modify it.\n \n  For example, if you distribute copies of such a program, whether\ngratis or for a fee, you must give the recipients all the rights that\nyou have.  You must make sure that they, too, receive or can get the\nsource code.  And you must show them these terms so they know their\nrights.\n \n  We protect your rights with two steps: (1) copyright the software, and\n(2) offer you this license which gives you legal permission to copy,\ndistribute and/or modify the software.\n \n  Also, for each author\'s protection and ours, we want to make certain\nthat everyone understands that there is no warranty for this free\nsoftware.  If the software is modified by someone else and passed on, we\nwant its recipients to know that what they have is not the original, so\nthat any problems introduced by others will not reflect on the original\nauthors\' reputations.\n \n  Finally, any free program is threatened constantly by software\npatents.  We wish to avoid the danger that redistributors of a free\nprogram will individually obtain patent licenses, in effect making the\nprogram proprietary.  To prevent this, we have made it clear that any\npatent must be licensed for everyone\'s free use or not licensed at all.\n \n  The precise terms and conditions for copying, distribution and\nmodification follow.\n \n                    GNU GENERAL PUBLIC LICENSE\n   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n \n  0. This License applies to any program or other work which contains\na notice placed by the copyright holder saying it may be distributed\nunder the terms of this General Public License.  The "Program", below,\nrefers to any such program or work, and a "work based on the Program"\nmeans either the Program or any derivative work under copyright law:\nthat is to say, a work containing the Program or a portion of it,\neither verbatim or with modifications and/or translated into another\nlanguage.  (Hereinafter, translation is included without limitation in\nthe term "modification".)  Each licensee is addressed as "you".\n \nActivities other than copying, distribution and modification are not\ncovered by this License; they are outside its scope.  The act of\nrunning the Program is not restricted, and the output from the Program\nis covered only if its contents constitute a work based on the\nProgram (independent of having been made by running the Program).\nWhether that is true depends on what the Program does.\n \n  1. You may copy and distribute verbatim copies of the Program\'s\nsource code as you receive it, in any medium, provided that you\nconspicuously and appropriately publish on each copy an appropriate\ncopyright notice and disclaimer of warranty; keep intact all the\nnotices that refer to this License and to the absence of any warranty;\nand give any other recipients of the Program a copy of this License\nalong with the Program.\n \nYou may charge a fee for the physical act of transferring a copy, and\nyou may at your option offer warranty protection in exchange for a fee.\n \n  2. You may modify your copy or copies of the Program or any portion\nof it, thus forming a work based on the Program, and copy and\ndistribute such modifications or work under the terms of Section 1\nabove, provided that you also meet all of these conditions:\n \n    a) You must cause the modified files to carry prominent notices\n    stating that you changed the files and the date of any change.\n \n    b) You must cause any work that you distribute or publish, that in\n    whole or in part contains or is derived from the Program or any\n    part thereof, to be licensed as a whole at no charge to all third\n    parties under the terms of this License.\n \n    c) If the modified program normally reads commands interactively\n    when run, you must cause it, when started running for such\n    interactive use in the most ordinary way, to print or display an\n    announcement including an appropriate copyright notice and a\n    notice that there is no warranty (or else, saying that you provide\n    a warranty) and that users may redistribute the program under\n    these conditions, and telling the user how to view a copy of this\n    License.  (Exception: if the Program itself is interactive but\n    does not normally print such an announcement, your work based on\n    the Program is not required to print an announcement.)\n \nThese requirements apply to the modified work as a whole.  If\nidentifiable sections of that work are not derived from the Program,\nand can be reasonably considered independent and separate works in\nthemselves, then this License, and its terms, do not apply to those\nsections when you distribute them as separate works.  But when you\ndistribute the same sections as part of a whole which is a work based\non the Program, the distribution of the whole must be on the terms of\nthis License, whose permissions for other licensees extend to the\nentire whole, and thus to each and every part regardless of who wrote it.\n \nThus, it is not the intent of this section to claim rights or contest\nyour rights to work written entirely by you; rather, the intent is to\nexercise the right to control the distribution of derivative or\ncollective works based on the Program.\n \nIn addition, mere aggregation of another work not based on the Program\nwith the Program (or with a work based on the Program) on a volume of\na storage or distribution medium does not bring the other work under\nthe scope of this License.\n \n  3. You may copy and distribute the Program (or a work based on it,\nunder Section 2) in object code or executable form under the terms of\nSections 1 and 2 above provided that you also do one of the following:\n \n    a) Accompany it with the complete corresponding machine-readable\n    source code, which must be distributed under the terms of Sections\n    1 and 2 above on a medium customarily used for software interchange; or,\n \n    b) Accompany it with a written offer, valid for at least three\n    years, to give any third party, for a charge no more than your\n    cost of physically performing source distribution, a complete\n    machine-readable copy of the corresponding source code, to be\n    distributed under the terms of Sections 1 and 2 above on a medium\n    customarily used for software interchange; or,\n \n    c) Accompany it with the information you received as to the offer\n    to distribute corresponding source code.  (This alternative is\n    allowed only for noncommercial distribution and only if you\n    received the program in object code or executable form with such\n    an offer, in accord with Subsection b above.)\n \nThe source code for a work means the preferred form of the work for\nmaking modifications to it.  For an executable work, complete source\ncode means all the source code for all modules it contains, plus any\nassociated interface definition files, plus the scripts used to\ncontrol compilation and installation of the executable.  However, as a\nspecial exception, the source code distributed need not include\nanything that is normally distributed (in either source or binary\nform) with the major components (compiler, kernel, and so on) of the\noperating system on which the executable runs, unless that component\nitself accompanies the executable.\n \nIf distribution of executable or object code is made by offering\naccess to copy from a designated place, then offering equivalent\naccess to copy the source code from the same place counts as\ndistribution of the source code, even though third parties are not\ncompelled to copy the source along with the object code.\n \n  4. You may not copy, modify, sublicense, or distribute the Program\nexcept as expressly provided under this License.  Any attempt\notherwise to copy, modify, sublicense or distribute the Program is\nvoid, and will automatically terminate your rights under this License.\nHowever, parties who have received copies, or rights, from you under\nthis License will not have their licenses terminated so long as such\nparties remain in full compliance.\n \n  5. You are not required to accept this License, since you have not\nsigned it.  However, nothing else grants you permission to modify or\ndistribute the Program or its derivative works.  These actions are\nprohibited by law if you do not accept this License.  Therefore, by\nmodifying or distributing the Program (or any work based on the\nProgram), you indicate your acceptance of this License to do so, and\nall its terms and conditions for copying, distributing or modifying\nthe Program or works based on it.\n \n  6. Each time you redistribute the Program (or any work based on the\nProgram), the recipient automatically receives a license from the\noriginal licensor to copy, distribute or modify the Program subject to\nthese terms and conditions.  You may not impose any further\nrestrictions on the recipients\' exercise of the rights granted herein.\nYou are not responsible for enforcing compliance by third parties to\nthis License.\n \n  7. If, as a consequence of a court judgment or allegation of patent\ninfringement or for any other reason (not limited to patent issues),\nconditions are imposed on you (whether by court order, agreement or\notherwise) that contradict the conditions of this License, they do not\nexcuse you from the conditions of this License.  If you cannot\ndistribute so as to satisfy simultaneously your obligations under this\nLicense and any other pertinent obligations, then as a consequence you\nmay not distribute the Program at all.  For example, if a patent\nlicense would not permit royalty-free redistribution of the Program by\nall those who receive copies directly or indirectly through you, then\nthe only way you could satisfy both it and this License would be to\nrefrain entirely from distribution of the Program.\n \nIf any portion of this section is held invalid or unenforceable under\nany particular circumstance, the balance of the section is intended to\napply and the section as a whole is intended to apply in other\ncircumstances.\n \nIt is not the purpose of this section to induce you to infringe any\npatents or other property right claims or to contest validity of any\nsuch claims; this section has the sole purpose of protecting the\nintegrity of the free software distribution system, which is\nimplemented by public license practices.  Many people have made\ngenerous contributions to the wide range of software distributed\nthrough that system in reliance on consistent application of that\nsystem; it is up to the author/donor to decide if he or she is willing\nto distribute software through any other system and a licensee cannot\nimpose that choice.\n \nThis section is intended to make thoroughly clear what is believed to\nbe a consequence of the rest of this License.\n \n  8. If the distribution and/or use of the Program is restricted in\ncertain countries either by patents or by copyrighted interfaces, the\noriginal copyright holder who places the Program under this License\nmay add an explicit geographical distribution limitation excluding\nthose countries, so that distribution is permitted only in or among\ncountries not thus excluded.  In such case, this License incorporates\nthe limitation as if written in the body of this License.\n \n  9. The Free Software Foundation may publish revised and/or new versions\nof the General Public License from time to time.  Such new versions will\nbe similar in spirit to the present version, but may differ in detail to\naddress new problems or concerns.\n \nEach version is given a distinguishing version number.  If the Program\nspecifies a version number of this License which applies to it and "any\nlater version", you have the option of following the terms and conditions\neither of that version or of any later version published by the Free\nSoftware Foundation.  If the Program does not specify a version number of\nthis License, you may choose any version ever published by the Free Software\nFoundation.\n \n  10. If you wish to incorporate parts of the Program into other free\nprograms whose distribution conditions are different, write to the author\nto ask for permission.  For software which is copyrighted by the Free\nSoftware Foundation, write to the Free Software Foundation; we sometimes\nmake exceptions for this.  Our decision will be guided by the two goals\nof preserving the free status of all derivatives of our free software and\nof promoting the sharing and reuse of software generally.\n \n                            NO WARRANTY\n \n  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY\nFOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN\nOTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES\nPROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED\nOR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF\nMERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS\nTO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE\nPROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,\nREPAIR OR CORRECTION.\n \n  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING\nWILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR\nREDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,\nINCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING\nOUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED\nTO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY\nYOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER\nPROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE\nPOSSIBILITY OF SUCH DAMAGES.\n \n                     END OF TERMS AND CONDITIONS\n \n            How to Apply These Terms to Your New Programs\n \n  If you develop a new program, and you want it to be of the greatest\npossible use to the public, the best way to achieve this is to make it\nfree software which everyone can redistribute and change under these terms.\n \n  To do so, attach the following notices to the program.  It is safest\nto attach them to the start of each source file to most effectively\nconvey the exclusion of warranty; and each file should have at least\nthe "copyright" line and a pointer to where the full notice is found.\n \n    <one line to give the program\'s name and a brief idea of what it does.>\n    Copyright (C) <year>  <name of author>\n \n    This program is free software; you can redistribute it and/or modify\n    it under the terms of the GNU General Public License as published by\n    the Free Software Foundation; either version 2 of the License, or\n    (at your option) any later version.\n \n    This program is distributed in the hope that it will be useful,\n    but WITHOUT ANY WARRANTY; without even the implied warranty of\n    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n    GNU General Public License for more details.\n \n    You should have received a copy of the GNU General Public License along\n    with this program; if not, write to the Free Software Foundation, Inc.,\n    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.\n \nAlso add information on how to contact you by electronic and paper mail.\n \nIf the program is interactive, make it output a short notice like this\nwhen it starts in an interactive mode:\n \n    Gnomovision version 69, Copyright (C) year name of author\n    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w\'.\n    This is free software, and you are welcome to redistribute it\n    under certain conditions; type `show c\' for details.\n \nThe hypothetical commands `show w\' and `show c\' should show the appropriate\nparts of the General Public License.  Of course, the commands you use may\nbe called something other than `show w\' and `show c\'; they could even be\nmouse-clicks or menu items--whatever suits your program.\n \nYou should also get your employer (if you work as a programmer) or your\nschool, if any, to sign a "copyright disclaimer" for the program, if\nnecessary.  Here is a sample; alter the names:\n \n  Yoyodyne, Inc., hereby disclaims all copyright interest in the program\n  `Gnomovision\' (which makes passes at compilers) written by James Hacker.\n \n  <signature of Ty Coon>, 1 April 1989\n  Ty Coon, President of Vice\n \nThis General Public License does not permit incorporating your program into\nproprietary programs.  If your program is a subroutine library, you may\nconsider it more useful to permit linking proprietary applications with the\nlibrary.  If this is what you want to do, use the GNU Lesser General\nPublic License instead of this License.',
        scancode_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/gpl-2.0.LICENSE",
        licensedb_url: "https://scancode-licensedb.aboutcode.org/gpl-2.0",
        spdx_url: "https://spdx.org/licenses/GPL-2.0-only",
      },
    ],
    expectedLicenseRuleReferences: [
      {
        id: 1,
        license_expression: "mit",
        identifier: "mit_14.RULE",
        language: "en",
        rule_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/mit_14.RULE",
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: true,
        is_license_tag: false,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 2,
        relevance: 100,
        minimum_coverage: 100,
        referenced_filenames: [],
        text: "MIT license",
      },
      {
        id: 2,
        license_expression: "mit",
        identifier:
          "spdx-license-identifier-mit-5da48780aba670b0860c46d899ed42a0f243ff06",
        language: "en",
        rule_url: null,
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: false,
        is_license_tag: true,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: true,
        length: 1,
        relevance: 100,
        minimum_coverage: 0,
        referenced_filenames: [],
        text: "MIT",
      },
      {
        id: 3,
        license_expression: "mit",
        identifier:
          "spdx-license-identifier-mit-9bb4edb114765888fe17c4abc738531d3a8554cc",
        language: "en",
        rule_url: null,
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: false,
        is_license_tag: true,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: true,
        length: 5,
        relevance: 100,
        minimum_coverage: 0,
        referenced_filenames: [],
        text: "licenses.nuget.org/MIT</licenseUrl>",
      },
      {
        id: 4,
        license_expression: "apache-2.0",
        identifier: "apache-2.0_20.RULE",
        language: "en",
        rule_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_20.RULE",
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: true,
        is_license_tag: false,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 9,
        relevance: 100,
        minimum_coverage: 100,
        referenced_filenames: [],
        text: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      {
        id: 5,
        license_expression: "apache-2.0",
        identifier: "apache-2.0_48.RULE",
        language: "en",
        rule_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_48.RULE",
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: true,
        is_license_tag: false,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 5,
        relevance: 100,
        minimum_coverage: 80,
        referenced_filenames: [],
        text: "Apache License, Version 2.0",
      },
      {
        id: 6,
        license_expression: "apache-2.0 OR gpl-2.0",
        identifier: "apache-2.0_or_gpl-2.0_24.RULE",
        language: "en",
        rule_url:
          "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE",
        is_license_text: false,
        is_license_notice: false,
        is_license_reference: false,
        is_license_tag: true,
        is_license_intro: false,
        is_license_clue: false,
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 25,
        relevance: 100,
        minimum_coverage: 50,
        referenced_filenames: [],
        text: '"licenses": [\n        {\n            "type": "Apache License",\n            "url": "http://www.apache.org/licenses/LICENSE-2.0"\n        }, {\n            "type": "GPL",\n            "url": "https://www.gnu.org/licenses/gpl-2.0.html"\n        }\n    ],',
      },
    ],
    expectedFlatFiles: [
      {
        license_clues: [],
        license_policy: [],
        license_detections: [],
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
      },
      {
        license_clues: [],
        license_policy: [
          "apache-2.0 - Approved License",
          "gpl-3.0 - Restricted License",
        ],
        license_detections: [
          {
            license_expression: "apache-2.0 AND gpl-3.0",
            identifier:
              "apache_2_0_and_gpl_3_0-494ca0ae-1282-09a2-139f-a52c04fde6dc",
          },
        ],
        detected_license_expression: "apache-2.0 AND gpl-3.0",
        detected_license_expression_spdx: "Apache-2.0 AND GPL-3.0-only",
        percentage_of_license_text: 100,
      },
      {
        license_clues: [],
        license_policy: [],
        license_detections: [],
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
      },
      {
        license_clues: [],
        license_policy: [],
        license_detections: [
          {
            license_expression: "mit",
            detection_log: [],
            identifier: "mit-b941df29-6c4b-fe7e-752f-a5fc7f9a28b5",
          },
        ],
        detected_license_expression: "mit",
        detected_license_expression_spdx: "MIT",
        percentage_of_license_text: 6.36,
      },
      {
        license_clues: [],
        license_policy: [],
        license_detections: [],
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
      },
      {
        license_clues: [
          {
            score: 52,
            start_line: 56,
            end_line: 59,
            matched_length: 13,
            match_coverage: 52,
            matcher: "3-seq",
            license_expression: "apache-2.0 OR gpl-2.0",
            rule_identifier: "apache-2.0_or_gpl-2.0_24.RULE",
            rule_relevance: 100,
            rule_url:
              "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE",
            license_expression_spdx: "Apache-2.0 OR GPL-2.0-only",
            fileId: 5,
            filePath: "rx-lite/package.json",
            fileClueIdx: 0,
            matches: [
              {
                score: 52,
                start_line: 56,
                end_line: 59,
                matched_length: 13,
                match_coverage: 52,
                matcher: "3-seq",
                license_expression: "apache-2.0 OR gpl-2.0",
                license_expression_spdx: "Apache-2.0 OR GPL-2.0-only",
                license_expression_keys: [
                  {
                    key: "apache-2.0",
                    licensedb_url:
                      "https://scancode-licensedb.aboutcode.org/apache-2.0",
                    scancode_url:
                      "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE",
                  },
                  {
                    key: "gpl-2.0",
                    licensedb_url:
                      "https://scancode-licensedb.aboutcode.org/gpl-2.0",
                    scancode_url:
                      "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/gpl-2.0.LICENSE",
                  },
                ],
                license_expression_spdx_keys: [
                  {
                    key: "Apache-2.0",
                    spdx_url: "https://spdx.org/licenses/Apache-2.0",
                  },
                  {
                    key: "GPL-2.0-only",
                    spdx_url: "https://spdx.org/licenses/GPL-2.0-only",
                  },
                ],
                rule_identifier: "apache-2.0_or_gpl-2.0_24.RULE",
                rule_relevance: 100,
                rule_url:
                  "https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE",
                path: "rx-lite/package.json",
              },
            ],
            file_regions: [
              {
                path: "rx-lite/package.json",
                start_line: 56,
                end_line: 59,
              },
            ],
          },
        ],
        license_policy: [],
        license_detections: [],
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 6.37,
      },
    ],
  },
];
