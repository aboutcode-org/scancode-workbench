import { WORKBENCH_VERSION } from "../../../constants/general";
import { ScanInfo, ScanOptionKeys } from "../../../utils/parsers";

export const HeaderSamples: {
  jsonFileName: string;
  expectedHeaders: ScanInfo;
}[] = [
  {
    jsonFileName: "headerless.json",
    expectedHeaders: {
      tool_name: "",
      tool_version: "",
      notice: "",
      duration: null,
      optionsList: [],
      optionsMap: new Map(),
      input: [],
      files_count: 0,
      output_format_version: "",
      spdx_license_list_version: "",
      operating_system: "",
      cpu_architecture: "",
      platform: "",
      platform_version: "",
      python_version: "",
      workbench_version: WORKBENCH_VERSION,
      workbench_notice:
        'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.',
      raw_header_content: "{}",
    },
  },
  {
    jsonFileName: "minimal.json",
    expectedHeaders: {
      tool_name: "scancode-toolkit",
      tool_version: "32.0.0rc3",
      notice:
        'Generated with ScanCode and provided on an "AS IS" BASIS, WITHOUT WARRANTIES.',
      duration: "25.00",
      optionsList: [],
      optionsMap: new Map(),
      input: [],
      files_count: 0,
      output_format_version: "3.0.0",
      spdx_license_list_version: "3.20",
      operating_system: "linux",
      cpu_architecture: "64",
      platform: "Linux-5.14.0-1059-oem-x86_64-with-glibc2.29",
      platform_version: "#67-Ubuntu SMP Mon Mar 13 14:22:10 UTC 2023",
      python_version: "3.8.10 (default, Mar 13 2023, 10:26:41) \n[GCC 9.4.0]",
      workbench_version: WORKBENCH_VERSION,
      workbench_notice:
        'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.',
      raw_header_content:
        '{\n  "tool_name": "scancode-toolkit",\n  "tool_version": "32.0.0rc3",\n  "notice": "Generated with ScanCode and provided on an \\"AS IS\\" BASIS, WITHOUT WARRANTIES.",\n  "start_timestamp": "2023-04-03T075922.014902",\n  "end_timestamp": "2023-04-03T075941.622685",\n  "output_format_version": "3.0.0",\n  "duration": 25,\n  "extra_data": {\n    "system_environment": {\n      "operating_system": "linux",\n      "cpu_architecture": "64",\n      "platform": "Linux-5.14.0-1059-oem-x86_64-with-glibc2.29",\n      "platform_version": "#67-Ubuntu SMP Mon Mar 13 14:22:10 UTC 2023",\n      "python_version": "3.8.10 (default, Mar 13 2023, 10:26:41) \\n[GCC 9.4.0]"\n    },\n    "spdx_license_list_version": "3.20"\n  }\n}',
    },
  },
  {
    jsonFileName: "withOptions.json",
    expectedHeaders: {
      tool_name: "scancode-toolkit",
      tool_version: "32.0.0rc3",
      notice:
        'Generated with ScanCode and provided on an "AS IS" BASIS, WITHOUT WARRANTIES.',
      duration: "19.61",
      optionsList: [
        ["--classify", true],
        ["--copyright", true],
        ["--json-pp", "hazelcast-v32.0.0rc3-wref.json"],
        ["--license-text", true],
        ["--processes", "12"],
        ["--url", true],
      ],
      optionsMap: new Map<ScanOptionKeys, unknown>([
        [ScanOptionKeys.CLASSIFY, true],
        [ScanOptionKeys.COPYRIGHT, true],
        [ScanOptionKeys.JSON_PP, "hazelcast-v32.0.0rc3-wref.json"],
        [ScanOptionKeys.LICENSE_TEXT, true],
        [ScanOptionKeys.PROCESSES, "12"],
        [ScanOptionKeys.URL, true],
      ]),
      input: ["hazelcast-spring-5.1.5-sources/"],
      files_count: 39,
      output_format_version: "2.0.0",
      spdx_license_list_version: "3.10",
      operating_system: "linux",
      cpu_architecture: "64",
      platform: "Linux-5.14.0-1059-oem-x86_64-with-glibc2.29",
      platform_version: "#67-Ubuntu SMP Mon Mar 13 14:22:10 UTC 2023",
      python_version: "3.8.10 (default, Mar 13 2023, 10:26:41) \n[GCC 9.4.0]",
      workbench_version: WORKBENCH_VERSION,
      workbench_notice:
        'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.',
      raw_header_content:
        '{\n  "tool_name": "scancode-toolkit",\n  "tool_version": "32.0.0rc3",\n  "options": {\n    "--classify": true,\n    "--copyright": true,\n    "--json-pp": "hazelcast-v32.0.0rc3-wref.json",\n    "--license-text": true,\n    "--processes": "12",\n    "--url": true\n  },\n  "notice": "Generated with ScanCode and provided on an \\"AS IS\\" BASIS, WITHOUT WARRANTIES.",\n  "start_timestamp": "2023-04-03T075922.014902",\n  "end_timestamp": "2023-04-03T075941.622685",\n  "output_format_version": "2.0.0",\n  "duration": 19.607794523239136,\n  "message": null,\n  "errors": [],\n  "warnings": [],\n  "extra_data": {\n    "system_environment": {\n      "operating_system": "linux",\n      "cpu_architecture": "64",\n      "platform": "Linux-5.14.0-1059-oem-x86_64-with-glibc2.29",\n      "platform_version": "#67-Ubuntu SMP Mon Mar 13 14:22:10 UTC 2023",\n      "python_version": "3.8.10 (default, Mar 13 2023, 10:26:41) \\n[GCC 9.4.0]"\n    },\n    "spdx_license_list_version": "3.10",\n    "files_count": 39\n  }\n}',
    },
  },
];