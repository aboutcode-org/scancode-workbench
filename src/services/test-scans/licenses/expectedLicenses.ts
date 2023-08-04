import { LicenseFlatFileAttributes } from "../../models/flatFile";
import { LicenseClueAttributes } from "../../models/licenseClues";
import { LicenseDetectionAttributes } from "../../models/licenseDetections";
import { LicenseExpressionAttributes } from "../../models/licenseExpression";
import { LicensePolicyAttributes } from "../../models/licensePolicy";
import { LicenseRuleReferenceAttributes } from "../../models/licenseRuleReference";

export const LicenseSamples: {
  jsonFileName: string;
  expectedFlatFiles: LicenseFlatFileAttributes[];
  expectedLicenseClues: LicenseClueAttributes[];
  expectedLicenseDetections: LicenseDetectionAttributes[];
  expectedLicenseExpressions: LicenseExpressionAttributes[];
  expectedLicensePolicies: LicensePolicyAttributes[];
  expectedLicenseRuleReferences: LicenseRuleReferenceAttributes[];
}[] = [
  {
    jsonFileName: "withLicenses.json",
    expectedLicenseClues: [
      {
        id: 1,
        fileId: 5,
        filePath: "rx-lite/package.json",
        fileClueIdx: 0,
        score: 52,
        license_expression: "apache-2.0 OR gpl-2.0",
        rule_identifier: "apache-2.0_or_gpl-2.0_24.RULE",
        matches:
          '[{"score":52,"start_line":56,"end_line":59,"matched_length":13,"match_coverage":52,"matcher":"3-seq","license_expression":"apache-2.0 OR gpl-2.0","rule_identifier":"apache-2.0_or_gpl-2.0_24.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE","path":"rx-lite/package.json","license_expression_keys":[{"key":"apache-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/apache-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE"},{"key":"gpl-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/gpl-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/gpl-2.0.LICENSE"}]}]',
        file_regions:
          '[{"path":"rx-lite/package.json","start_line":56,"end_line":59}]',
      },
    ],
    expectedLicenseDetections: [
      {
        identifier:
          "apache_2_0_and_gpl_3_0-494ca0ae-1282-09a2-139f-a52c04fde6dc",
        license_expression: "apache-2.0 AND gpl-3.0",
        detection_count: 1,
        detection_log: null,
        matches:
          '[{"score":100,"start_line":1,"end_line":1,"matched_length":4,"match_coverage":100,"matcher":"2-aho","license_expression":"apache-2.0","rule_identifier":"apache-2.0_65.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_65.RULE","license_expression_keys":[{"key":"apache-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/apache-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE"}],"license_expression_spdx_keys":[{"key":"Apache-2.0","spdx_url":"https://spdx.org/licenses/Apache-2.0"}],"license_expression_spdx":"Apache-2.0","path":"anglesharp.css.0.16.4/file_with_multiple_licenses.txt"},{"score":100,"start_line":3,"end_line":3,"matched_length":4,"match_coverage":100,"matcher":"2-aho","license_expression":"gpl-3.0","rule_identifier":"gpl-3.0_173.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/gpl-3.0_173.RULE","license_expression_keys":[{"key":"gpl-3.0","licensedb_url":null,"scancode_url":null}],"license_expression_spdx_keys":[{"key":"GPL-3.0-only","spdx_url":null}],"license_expression_spdx":"GPL-3.0-only","path":"anglesharp.css.0.16.4/file_with_multiple_licenses.txt"}]',
        file_regions:
          '[{"path":"anglesharp.css.0.16.4/file_with_multiple_licenses.txt","start_line":1,"end_line":3,"from_package":false}]',
      },
      {
        identifier: "mit-b941df29-6c4b-fe7e-752f-a5fc7f9a28b5",
        license_expression: "mit",
        detection_count: 1,
        detection_log: null,
        matches:
          '[{"score":100,"start_line":9,"end_line":9,"matched_length":2,"match_coverage":100,"matcher":"2-aho","license_expression":"mit","rule_identifier":"mit_14.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/mit_14.RULE","matched_text":"MIT</license>","license_expression_keys":[{"key":"mit","licensedb_url":"https://scancode-licensedb.aboutcode.org/mit","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE"}],"license_expression_spdx_keys":[{"key":"MIT","spdx_url":"https://spdx.org/licenses/MIT"}],"license_expression_spdx":"MIT","path":"anglesharp.css.0.16.4/AngleSharp.Css.nuspec"},{"score":100,"start_line":10,"end_line":10,"matched_length":5,"match_coverage":100,"matcher":"1-spdx-id","license_expression":"mit","rule_identifier":"spdx-license-identifier-mit-c02399fc3bda518cf5890c9587642a2525fce16b","rule_relevance":100,"rule_url":null,"matched_text":"licenses.nuget.org/MIT</licenseUrl>","license_expression_keys":[{"key":"mit","licensedb_url":"https://scancode-licensedb.aboutcode.org/mit","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE"}],"license_expression_spdx_keys":[{"key":"MIT","spdx_url":"https://spdx.org/licenses/MIT"}],"license_expression_spdx":"MIT","path":"anglesharp.css.0.16.4/AngleSharp.Css.nuspec"}]',
        file_regions:
          '[{"path":"anglesharp.css.0.16.4/AngleSharp.Css.nuspec","start_line":9,"end_line":10,"from_package":false}]',
      },
      {
        identifier: "mit-a822f434-d61f-f2b1-c792-8b8cb9e7b9bf",
        license_expression: "mit",
        detection_count: 1,
        detection_log: null,
        matches:
          '[{"score":100,"start_line":1,"end_line":1,"matched_length":1,"match_coverage":100,"matcher":"1-spdx-id","license_expression":"mit","rule_identifier":"spdx-license-identifier-mit-5da48780aba670b0860c46d899ed42a0f243ff06","rule_relevance":100,"rule_url":null,"matched_text":"MIT","license_expression_keys":[{"key":"mit","licensedb_url":"https://scancode-licensedb.aboutcode.org/mit","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/mit.LICENSE"}],"license_expression_spdx_keys":[{"key":"MIT","spdx_url":"https://spdx.org/licenses/MIT"}],"license_expression_spdx":"MIT","path":"anglesharp.css.0.16.4/AngleSharp.Css.nuspec"}]',
        file_regions:
          '[{"path":"anglesharp.css.0.16.4/AngleSharp.Css.nuspec","start_line":1,"end_line":1,"from_package":true}]',
      },
      {
        identifier: "unknown-73f5f4e3-0fd7-c629-d3b0-a8bf52447aff",
        license_expression: "unknown",
        detection_count: 4,
        detection_log: null,
        matches:
          '[{"score":77.78,"start_line":1,"end_line":1,"matched_length":7,"match_coverage":100,"matcher":"5-undetected","license_expression":"unknown","rule_identifier":"package-manifest-unknown-16117ed57856733eaaf6d91ea575b186a9dab3df","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/package-manifest-unknown-16117ed57856733eaaf6d91ea575b186a9dab3df","matched_text":"license {\'LegalCopyright\': \'Copyright © AngleSharp, 2013-2019\', \'LegalTrademarks\': \'\', \'License\': None}","license_expression_keys":[{"key":"unknown","licensedb_url":"https://scancode-licensedb.aboutcode.org/unknown","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/unknown.LICENSE"}],"license_expression_spdx_keys":[],"path":"anglesharp.css.0.16.4/AngleSharp.Css.dll"}]',
        file_regions:
          '[{"path":"anglesharp.css.0.16.4/AngleSharp.Css.dll","start_line":1,"end_line":1,"from_package":true},{"path":"anglesharp.css.0.16.4/AngleSharpLib.Css.dll","start_line":1,"end_line":1,"from_package":true}]',
      },
      {
        identifier: "apache_2_0-428c1364-ecb5-f806-7a2e-77d10737a7ce",
        license_expression: "apache-2.0",
        detection_count: 1,
        detection_log: null,
        matches:
          '[{"score":100,"start_line":1,"end_line":1,"matched_length":5,"match_coverage":100,"matcher":"1-hash","license_expression":"apache-2.0","rule_identifier":"apache-2.0_48.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_48.RULE","matched_text":"Apache License, Version 2.0","license_expression_keys":[{"key":"apache-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/apache-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE"}],"license_expression_spdx_keys":[],"path":"rx-lite/package.json"}]',
        file_regions:
          '[{"path":"rx-lite/package.json","start_line":1,"end_line":1,"from_package":true}]',
      },
      {
        identifier: "apache_2_0-9a5226a4-0901-7d18-06ae-49c1887ecbd7",
        license_expression: "apache-2.0",
        detection_count: 1,
        detection_log: null,
        matches:
          '[{"score":100,"start_line":1,"end_line":1,"matched_length":9,"match_coverage":100,"matcher":"1-hash","license_expression":"apache-2.0","rule_identifier":"apache-2.0_20.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_20.RULE","matched_text":"http://www.apache.org/licenses/LICENSE-2.0.html","license_expression_keys":[{"key":"apache-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/apache-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE"}],"license_expression_spdx_keys":[],"path":"rx-lite/package.json"}]',
        file_regions:
          '[{"path":"rx-lite/package.json","start_line":1,"end_line":1,"from_package":true}]',
      },
    ],
    expectedLicenseExpressions: [
      {
        id: 1,
        fileId: 1,
        license_expression: "apache-2.0 AND gpl-3.0",
        license_expression_spdx: "Apache-2.0 AND GPL-3.0-only",
        license_keys: '["apache-2.0","gpl-3.0"]',
        license_keys_spdx: '["Apache-2.0","GPL-3.0-only"]',
      },
      {
        id: 2,
        fileId: 3,
        license_expression: "mit",
        license_expression_spdx: "MIT",
        license_keys: '["mit"]',
        license_keys_spdx: '["MIT"]',
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 2,
        relevance: 100,
        minimum_coverage: 100,
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: true,
        length: 1,
        relevance: 100,
        minimum_coverage: 0,
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: true,
        length: 5,
        relevance: 100,
        minimum_coverage: 0,
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 9,
        relevance: 100,
        minimum_coverage: 100,
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 5,
        relevance: 100,
        minimum_coverage: 80,
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
        is_continuous: false,
        is_builtin: true,
        is_from_license: false,
        is_synthetic: false,
        length: 25,
        relevance: 100,
        minimum_coverage: 50,
        text: '"licenses": [\n        {\n            "type": "Apache License",\n            "url": "http://www.apache.org/licenses/LICENSE-2.0"\n        }, {\n            "type": "GPL",\n            "url": "https://www.gnu.org/licenses/gpl-2.0.html"\n        }\n    ],',
      },
    ],
    expectedFlatFiles: [
      {
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
        license_policy: null,
        license_clues: "[]",
        license_detections: "[]",
      },
      {
        detected_license_expression: "apache-2.0 AND gpl-3.0",
        detected_license_expression_spdx: "Apache-2.0 AND GPL-3.0-only",
        percentage_of_license_text: 100,
        license_policy: null,
        license_clues: "[]",
        license_detections:
          '[{"license_expression":"apache-2.0 AND gpl-3.0","identifier":"apache_2_0_and_gpl_3_0-494ca0ae-1282-09a2-139f-a52c04fde6dc"}]',
      },
      {
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
        license_policy: null,
        license_clues: "[]",
        license_detections: "[]",
      },
      {
        detected_license_expression: "mit",
        detected_license_expression_spdx: "MIT",
        percentage_of_license_text: 6.36,
        license_policy: null,
        license_clues: "[]",
        license_detections:
          '[{"license_expression":"mit","detection_log":[],"identifier":"mit-b941df29-6c4b-fe7e-752f-a5fc7f9a28b5"}]',
      },
      {
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 0,
        license_policy: null,
        license_clues: "[]",
        license_detections: "[]",
      },
      {
        detected_license_expression: null,
        detected_license_expression_spdx: null,
        percentage_of_license_text: 6.37,
        license_policy: null,
        license_clues:
          '[{"score":52,"start_line":56,"end_line":59,"matched_length":13,"match_coverage":52,"matcher":"3-seq","license_expression":"apache-2.0 OR gpl-2.0","rule_identifier":"apache-2.0_or_gpl-2.0_24.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE","fileId":5,"filePath":"rx-lite/package.json","fileClueIdx":0,"matches":[{"score":52,"start_line":56,"end_line":59,"matched_length":13,"match_coverage":52,"matcher":"3-seq","license_expression":"apache-2.0 OR gpl-2.0","rule_identifier":"apache-2.0_or_gpl-2.0_24.RULE","rule_relevance":100,"rule_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/rules/apache-2.0_or_gpl-2.0_24.RULE","path":"rx-lite/package.json","license_expression_keys":[{"key":"apache-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/apache-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/apache-2.0.LICENSE"},{"key":"gpl-2.0","licensedb_url":"https://scancode-licensedb.aboutcode.org/gpl-2.0","scancode_url":"https://github.com/nexB/scancode-toolkit/tree/develop/src/licensedcode/data/licenses/gpl-2.0.LICENSE"}]}],"file_regions":[{"path":"rx-lite/package.json","start_line":56,"end_line":59}]}]',
        license_detections: "[]",
      },
    ],
  },
];
