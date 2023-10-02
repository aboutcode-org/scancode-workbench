import { Model } from "sequelize";
import { HeaderAttributes } from "../services/models/header";

export function parseIfValidJson(str: unknown) {
  if (typeof str !== "string") return null;
  try {
    const parsedObj = JSON.parse(str);
    // Return only if it is an object & not a primitive value
    if (Object(parsedObj) === parsedObj) return parsedObj;
    return null;
  } catch (e) {
    return null;
  }
}

export enum ScanOptionKeys {
  CLASSIFY = "--classify",
  COPYRIGHT = "--copyright",
  SYSTEM_PACKAGE = "--system-package",
  JSON_PP = "--json-pp",
  SUMMARY = "--summary",
  PROCESSES = "--processes",
  INFO = "--info",
  EMAIL = "--email",
  URL = "--url",
  PACKAGE = "--package",
  LICENSE = "--license",
  LICENSE_DIAGNOSTICS = "--license-diagnostics",
  LICENSE_REFERENCES = "--license-references",
  LICENSE_TEXT = "--license-text",
  LICENSE_SCORE = "--license-score",
  UNKNOWN_LICENSES = "--unknown-licenses",
}

export interface ScanInfo {
  json_file_name: string;
  tool_name: string;
  tool_version: string;
  notice: string;
  duration: string;
  optionsList: [string, unknown][];
  optionsMap: Map<ScanOptionKeys, unknown>;
  input: string[];
  files_count: number;
  output_format_version: string;
  spdx_license_list_version: string;
  operating_system: string;
  cpu_architecture: string;
  platform: string;
  platform_version: string;
  python_version: string;
  workbench_version: string;
  workbench_notice: string;
  raw_header_content: string;
  errors: string[];
}

export function parseScanInfo(
  rawInfo: Model<HeaderAttributes, HeaderAttributes>
): ScanInfo {
  const optionsList =
    Object.entries(parseIfValidJson(rawInfo.getDataValue("options")) || []) ||
    [];
  const optionsMap = new Map<ScanOptionKeys, unknown>(
    optionsList.map(([k, v]) => [k as ScanOptionKeys, v])
  );

  const parsedScanInfo: ScanInfo = {
    json_file_name: rawInfo.getDataValue("json_file_name") || "Not available",
    tool_name: rawInfo.getDataValue("tool_name") || "",
    tool_version: rawInfo.getDataValue("tool_version") || "",
    notice: rawInfo.getDataValue("notice") || "",
    duration: rawInfo.getDataValue("duration")
      ? Number(rawInfo.getDataValue("duration")).toFixed(2)
      : null,
    optionsList,
    optionsMap,
    input: parseIfValidJson(rawInfo.getDataValue("input")) || [],
    files_count: Number(rawInfo.getDataValue("files_count")),
    output_format_version: rawInfo.getDataValue("output_format_version") || "",
    spdx_license_list_version:
      rawInfo.getDataValue("spdx_license_list_version") || "",
    operating_system: rawInfo.getDataValue("operating_system") || "",
    cpu_architecture: rawInfo.getDataValue("cpu_architecture") || "",
    platform: rawInfo.getDataValue("platform") || "",
    platform_version: rawInfo.getDataValue("platform_version") || "",
    python_version: rawInfo.getDataValue("python_version") || "",
    workbench_version: rawInfo.getDataValue("workbench_version") || "",
    workbench_notice: rawInfo.getDataValue("workbench_notice") || "",
    raw_header_content: rawInfo.getDataValue("header_content") || "",
    errors: parseIfValidJson(rawInfo.getDataValue("errors")) || [],
  };
  return parsedScanInfo;
}
