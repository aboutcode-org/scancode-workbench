/*
 #
 # Copyright (c) 2017 - 2019 nexB Inc. and others. All rights reserved.
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

import $ from "jquery";
import {
  BulkCreateOptions,
  DataTypes,
  FindOptions,
  StringDataType,
  IntegerDataType,
  Model,
  Sequelize,
  Transaction,
  TransactionOptions,
} from "sequelize";
import fs from "fs";
import path from "path";
import JSONStream from "jsonstream";
import { DatabaseStructure, newDatabase } from "./models/database";
import {
  filterSpdxKeys,
  JSON_Type,
  parentPath,
  parseTokenKeysFromExpression,
  parseSubExpressions,
} from "./models/databaseUtils";
import { DebugLogger } from "../utils/logger";
import { FileAttributes } from "./models/file";
import { DataNode } from "rc-tree/lib/interface";
import { flattenFile } from "./models/flatFile";
import { toast } from "react-toastify";

/**
 * Manages the database created from a ScanCode JSON input.
 * The database contains tables for both flattened and unflattened data
 *
 * The config will load an existing database or will create a new, empty
 * database if none exists. For a new database, the data is loaded from a JSON
 * file by calling addFromJson(jsonFileName).
 *
 * @param config
 * @param config.dbName
 * @param config.dbUser
 * @param config.dbPassword
 * @param config.dbStorage
 */

interface WorkbenchDbConfig {
  dbName: string;
  dbStorage: string;
  dbUser?: string;
  dbPassword?: string;
}
type FileDataNode = Model<FileAttributes, FileAttributes> & DataNode;

// @TODO
// function sortChildren(node: Model<FileAttributes, FileAttributes>){
function sortChildren(node: FileDataNode) {
  if (!node.children || !node.children.length) return;
  node.children.sort((a: any, b: any) => {
    if (a.type === b.type) return 0;
    if (a.type === "file") return 1;
    return -1;
  });
  node.children.forEach(sortChildren);
}

export class WorkbenchDB {
  sequelize: Sequelize;
  db: DatabaseStructure;
  sync: Promise<DatabaseStructure>;

  constructor(config: WorkbenchDbConfig) {
    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    const name = config && config.dbName ? config.dbName : "tmp";
    const user = config && config.dbUser ? config.dbUser : null;
    const password = config && config.dbPassword ? config.dbPassword : null;
    const storage = config && config.dbStorage ? config.dbStorage : ":memory:";

    console.log("Sequelize DB details", {
      name,
      user,
      password,
      storage,
    });

    this.sequelize = new Sequelize(name, user, password, {
      dialect: "sqlite",
      // dialectModule: { Database },
      // dialectOptions: {
      //   sqlite3: Database,
      // },
      // dialectModule: BetterSqlite3,
      // dialectOptions: {
      //   sqlite3: BetterSqlite3,
      // },
      // dialectModule: sqlite3,
      // dialectOptions: {
      //   sqlite3
      // },
      storage: storage,
      logging: false,
    });
    this.db = newDatabase(this.sequelize);

    // A promise that will return when the db and tables have been created
    this.sync = this.sequelize.sync().then(() => {
      return this.db;
    });
  }

  // Get ScanCode Workbench app information
  getWorkbenchInfo() {
    return this.sync.then((db) =>
      db.Header.findOne({
        attributes: ["workbench_notice", "workbench_version"],
      })
    );
  }

  // Get ScanCode Toolkit information
  getScanCodeInfo() {
    return this.sync.then((db) =>
      db.Header.findOne({
        attributes: ["scancode_notice", "scancode_version", "scancode_options"],
      })
    );
  }

  getScanInfo() {
    return this.sync.then((db) => db.Header.findOne());
  }

  getFileCount() {
    return this.sync
      .then((db) => db.Header.findOne({ attributes: ["files_count"] }))
      .then((count) => (count ? count.getDataValue("files_count") : 0));
  }

  getAllLicenseDetections() {
    return this.sync.then((db) => db.LicenseDetections.findAll());
  }

  getAllPackages() {
    return this.sync.then((db) => db.Packages.findAll());
  }

  getAllDependencies() {
    return this.sync.then((db) => db.Dependencies.findAll());
  }

  // Uses the files table to do a findOne query
  findOne(query: FindOptions) {
    query = $.extend(query, {
      include: this.db.fileIncludes,
    });
    return this.sync.then((db) => db.File.findOne(query));
  }

  // Uses the files table to do a findAll query
  findAll(query: FindOptions) {
    query = $.extend(query, {
      include: this.db.fileIncludes,
    });
    return this.sync.then((db) => db.File.findAll(query));
  }

  // Uses findAll to return JSTree format from the File Table
  findAllJSTree() {
    const fileQuery: FindOptions<FileAttributes> = {
      attributes: ["id", "path", "parent", "name", "type"],
    };
    return this.sync
      .then((db) => db.File.findAll(fileQuery))
      .then((files) => {
        const result = this.listToTreeData(files as FileDataNode[]);
        return result;
      });
  }

  listToTreeData(
    fileList: FileDataNode[] & Model<FileAttributes, FileAttributes>[]
  ) {
    const pathToIndexMap = new Map<string, number>();
    const roots: FileDataNode[] = [];

    fileList.forEach((file) => {
      // Maintain path mapping for each file
      pathToIndexMap.set(
        file.getDataValue("path"),
        Number(file.getDataValue("id"))
      );

      // Setup DataNode properties
      file.key = file.getDataValue("path");
      file.children = [];
      file.title = path.basename(file.getDataValue("path"));
    });

    fileList.forEach((file) => {
      const fileParentPath = file.getDataValue("parent").toString({});
      if (Number(file.getDataValue("id")) !== 0) {
        if (pathToIndexMap.has(fileParentPath)) {
          // @TODO
          // if you have dangling branches check that map[node.parentId] exists
          fileList[pathToIndexMap.get(fileParentPath)].children.push(file);
        }
      } else {
        roots.push(file);
      }

      // @TODO - Trying to fix rc-tree showing file icon instead of directory https://github.com/nexB/scancode-workbench/issues/542
      // fileList.forEach(file => {
      //   if(file.getDataValue('type').toString({}) === 'directory' && !file.children){
      //     file.children=[];
      //     file.isLeaf=true;
      //   }
      //   file.children?.forEach((file: any) => {
      //     if(file.getDataValue('type').toString({}) === 'directory' && !file.children){
      //       file.children=[];
      //       file.isLeaf=true;
      //     }
      //   })
      // })
    });

    roots.forEach(sortChildren);
    return roots;
  }

  // Add rows to the flattened files table from a ScanCode json object
  addFromJson(
    jsonFileName: string,
    workbenchVersion: string,
    onProgressUpdate: (progress: number) => void
  ): Promise<void> {
    if (!jsonFileName) {
      throw new Error("Invalid json file name: " + jsonFileName);
    }
    // console.log("Adding from json with params", { jsonFileName, workbenchVersion, onProgressUpdate });

    const stream = fs.createReadStream(jsonFileName, { encoding: "utf8" });
    const version = workbenchVersion;
    let headerId: number | null = null;
    let files_count: number = 0;
    let dirs_count: number = 0;
    let index = 0;
    let rootPath: string | null = null;
    let hasRootPath = false;
    const batchSize = 1000;
    let files: unknown[] = []; // @TODO
    let progress = 0;
    let promiseChain: Promise<void | DatabaseStructure | number> = this.sync;

    console.log("JSON parse started (step 1)");
    console.time("json-parse-time");
    // @TODO - Remove this in next commit
    const DEBUG_MODE_MATCHES = true;
    const DEBUG_MATCH_FILE_NAME = "node_modules/rc/package.json";

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const primaryPromise = this; // @TODO - Remove this

      let batchCount = 0;

      interface TopLevelDataFormat {
        header: unknown;
        parsedHeader: unknown;
        packages: unknown[];
        dependencies: unknown[];
        license_detections: unknown[];
        license_detections_map: Map<string, unknown>;
        license_references: unknown[];
        license_references_map: Map<string, unknown>;
        license_references_spdx_map: Map<string, unknown>;
        license_rule_references: unknown[];
      }
      let TopLevelData: TopLevelDataFormat = null;

      stream
        .pipe(JSONStream.parse("files.*")) // files field is piped to 'data' & rest to 'header'
        .on("header", (topLevelData: any) => {
          console.log(
            "\n----------------------------------------------------------------\n"
          );
          const header = topLevelData.headers
            ? topLevelData.headers[0] || {}
            : {};
          const parsedHeader = this._parseHeader(workbenchVersion, header);
          const packages = topLevelData.packages || [];
          const dependencies = topLevelData.dependencies || [];
          const license_detections: any[] = (
            topLevelData.license_detections || []
          ).map((detection: any) => {
            // Handle duplicated match_data present at top level in prev toolkit versions
            // upto v32.0.0rc2
            return {
              identifier: detection.identifier,
              license_expression: detection.license_expression,
              detection_count:
                detection.detection_count !== undefined
                  ? detection.detection_count
                  : detection.count || 0,
            };
          });
          const license_detections_map = new Map<string, unknown>(
            license_detections.map((detection) => [
              detection.identifier,
              detection,
            ])
          );
          const license_references: any[] =
            topLevelData.license_references || [];
          const license_references_mapping = new Map<string, unknown>(
            license_references.map((ref) => [ref.key, ref])
          );
          const license_references_mapping_spdx = new Map<string, unknown>(
            license_references.map((ref) => [ref.spdx_license_key, ref])
          );
          const license_rule_references: any[] =
            topLevelData.license_rule_references || [];
          // const license_rule_references_mapping = new Map<string, unknown>(
          //   license_rule_references.map(rule_ref => [rule_ref.identifier, rule_ref])
          // );

          TopLevelData = {
            header,
            parsedHeader,
            packages,
            dependencies,
            license_detections,
            license_references_map: license_references_mapping,
            license_references_spdx_map: license_references_mapping_spdx,
            license_detections_map,
            license_references,
            license_rule_references,
          };

          console.log("Parsed Top level data", TopLevelData);

          files_count = Number(parsedHeader.files_count);
          promiseChain = promiseChain
            .then(() => this.db.Packages.bulkCreate(packages))
            .then(() => this.db.Dependencies.bulkCreate(dependencies))
            .then(() => this.db.Header.create(parsedHeader))
            .then((header) => (headerId = Number(header.getDataValue("id"))));

          console.log(
            "\n----------------------------------------------------------------\n"
          );
        })
        .on("data", function (file: any) {
          const file_license_expressions_components = parseSubExpressions(
            file.detected_license_expression
          );
          const file_license_expressions_spdx_components = parseSubExpressions(
            file.detected_license_expression_spdx
          );
          const UNKNOWN_EXPRESSION = "unknown-license-reference";
          const UNKNOWN_EXPRESSION_SPDX =
            "LicenseRef-scancode-unknown-license-reference";

          if (DEBUG_MODE_MATCHES && file.path.includes(DEBUG_MATCH_FILE_NAME))
            console.log("Sub", {
              detected: file.detected_license_expression,
              detectedspdx: file.detected_license_expression_spdx,
              detected_sub_license_expressions:
                file_license_expressions_components,
              detected_sub_license_expressions_spdx:
                file_license_expressions_spdx_components,
            });

          file?.license_detections?.forEach(
            (detection: any, detectionIdx: number) => {
              const targetLicenseDetection: any =
                TopLevelData.license_detections_map.get(detection.identifier);

              if (!targetLicenseDetection) return;
              if (!targetLicenseDetection.file_regions)
                targetLicenseDetection.file_regions = [];
              if (!targetLicenseDetection.matches) {
                targetLicenseDetection.matches = [];
              }
              if (detection.matches?.length) {
                const detectionLicenseExpressionComponents =
                  parseSubExpressions(detection.license_expression);

                let correspondingFileLicenseExpressionSpdxComponent =
                  file_license_expressions_spdx_components[
                    file_license_expressions_components.findIndex(
                      (val) => val === detection.license_expression
                    )
                  ];

                // Cases when,
                // detection.license_expression = file.detected_license_expression &
                // detection.license_expression_spdx = file.detected_license_expression_spdx
                if (
                  detection.license_expression ===
                  file.detected_license_expression
                ) {
                  correspondingFileLicenseExpressionSpdxComponent =
                    file.detected_license_expression_spdx;
                }

                // Unknown
                if (detection.license_expression == UNKNOWN_EXPRESSION) {
                  correspondingFileLicenseExpressionSpdxComponent =
                    UNKNOWN_EXPRESSION_SPDX;
                }

                const detectionSpdxLicenseExpressionComponents =
                  parseSubExpressions(
                    correspondingFileLicenseExpressionSpdxComponent
                  );

                if (
                  DEBUG_MODE_MATCHES &&
                  file.path.includes(DEBUG_MATCH_FILE_NAME)
                )
                  console.log(`Detection #${detectionIdx} in ${file.path}, `, {
                    jsonDetection: detection,
                    targetLicenseDetection,
                    detection_le: detection.license_expression,
                    detection_lespdx:
                      file_license_expressions_spdx_components[
                        file_license_expressions_components.findIndex(
                          (val) => val === detection.license_expression
                        )
                      ],
                    detectionComponents: detectionLicenseExpressionComponents,
                    detectionSpdxComponents:
                      detectionSpdxLicenseExpressionComponents,
                  });

                let min_start_line = detection.matches[0].start_line;
                let max_end_line = detection.matches[0].end_line;

                (detection.matches as any[]).forEach((match: any, matchIdx) => {
                  min_start_line = Math.min(min_start_line, match.start_line);
                  max_end_line = Math.max(max_end_line, match.end_line);
                  const {
                    license_references_map,
                    license_references_spdx_map,
                  } = TopLevelData;

                  if (!match.license_expression_keys?.length)
                    match.license_expression_keys = [];
                  if (!match.license_expression_spdx_keys?.length)
                    match.license_expression_spdx_keys = [];

                  // SPDX not available in matches, so find corresponding spdx license expression
                  match.license_expression_spdx =
                    detectionSpdxLicenseExpressionComponents[
                      detectionLicenseExpressionComponents.findIndex(
                        (exp) => exp === match.license_expression
                      )
                    ];
                  // Cases when,
                  // match.license_expression = license_detection.license_expression &
                  // match.license_expression_spdx = license_detection.license_expression_spdx
                  if (
                    match.license_expression === detection.license_expression
                  ) {
                    match.license_expression_spdx =
                      file_license_expressions_spdx_components[
                        file_license_expressions_components.findIndex(
                          (val) => val === detection.license_expression
                        )
                      ];
                  }
                  // Unknown
                  if (match.license_expression == UNKNOWN_EXPRESSION) {
                    match.license_expression_spdx = UNKNOWN_EXPRESSION_SPDX;
                  }

                  const parsedLicenseKeys = parseSubExpressions(
                    match.license_expression
                  );
                  const parsedSpdxLicenseKeys = parseSubExpressions(
                    match.license_expression_spdx
                  );
                  if (
                    DEBUG_MODE_MATCHES &&
                    file.path.includes(DEBUG_MATCH_FILE_NAME)
                  )
                    console.log(
                      `Match details ${matchIdx}. ${match.license_expression}`,
                      {
                        license_expression: match.license_expression,
                        license_expression_spdx: match.license_expression_spdx,
                        parsedLicenseKeys,
                        parsedLicenseSpdxKeys: parsedSpdxLicenseKeys,
                        foundItemInLE: file_license_expressions_components.find(
                          (val) => val === match.license_expression
                        ),
                        foundItemInLEIdx:
                          file_license_expressions_components.findIndex(
                            (val) => val === match.license_expression
                          ),
                        corresponding:
                          file_license_expressions_spdx_components[
                            file_license_expressions_components.findIndex(
                              (val) => val === match.license_expression
                            )
                          ],
                      }
                    );
                  // console.log("Debug for match expression", match.license_expression_keys, match.license_expression_spdx_keys);

                  parsedLicenseKeys.forEach((key) => {
                    const license_reference: any =
                      license_references_map.get(key);
                    // if (!license_reference) return;

                    match.license_expression_keys.push({
                      key,
                      licensedb_url: license_reference?.licensedb_url || null,
                      scancode_url: license_reference?.scancode_url || null,
                    });
                  });
                  parsedSpdxLicenseKeys.forEach((key) => {
                    const license_reference: any =
                      license_references_spdx_map.get(key);
                    // if (!license_reference) return;

                    match.license_expression_spdx_keys.push({
                      key,
                      spdx_url: license_reference?.spdx_url || null,
                    });
                  });
                  match.path = file.path;
                  targetLicenseDetection.matches.push(match);
                });
                targetLicenseDetection.file_regions.push({
                  path: file.path,
                  start_line: min_start_line,
                  end_line: max_end_line,
                });
                if (
                  DEBUG_MODE_MATCHES &&
                  file.path.includes(DEBUG_MATCH_FILE_NAME)
                )
                  console.log(
                    `(Matches: ${targetLicenseDetection.matches.length}) Prepared detection in ${file.path}`,
                    detection,
                    targetLicenseDetection
                  );
              }

              delete detection.matches; // Not required, adds extra memory usage

              if (
                DEBUG_MODE_MATCHES &&
                file.path.includes(DEBUG_MATCH_FILE_NAME)
              ) {
                console.log(
                  "Final top level detection",
                  targetLicenseDetection
                );
                console.log(
                  "\n----------------------------------------------------------------\n"
                );
              }
            }
          );

          if (!rootPath) {
            rootPath = file.path.split("/")[0];
          }
          if (rootPath === file.path) {
            hasRootPath = true;
          }
          // @TODO: When/if scancode reports directories in its header, this needs
          //       to be replaced.
          if (index === 0) {
            dirs_count = file.dirs_count;
          }
          file.id = index++;
          files.push(file);
          if (files.length >= batchSize) {
            // Need to set a new variable before handing to promise
            this.pause();

            // @TODO - is this required explicitly ?
            promiseChain = promiseChain
              .then(() => primaryPromise._batchCreateFiles(files, headerId))
              .then(() => {
                const currentProgress = Math.round(
                  (index / (files_count + dirs_count)) * 100
                );
                if (currentProgress > progress) {
                  progress = currentProgress;
                  console.log(
                    `Batch-${++batchCount} completed, \n`,
                    `JSON Import progress @ ${progress} % -- ${index}/${files_count}+${dirs_count}`
                  );
                  onProgressUpdate(progress);
                }
              })
              .then(() => {
                files = [];
                this.resume();
              })
              .catch((e: unknown) => reject(e));
          }
        })
        .on("end", () => {
          console.log(
            "\n----------------------------------------------------------------\n"
          );
          // Create license detections at the end, based on match data in files
          promiseChain = promiseChain.then(() => {
            const allLicenseDetections = Array.from(
              TopLevelData.license_detections_map.values()
            );
            this.db.LicenseDetections.bulkCreate(allLicenseDetections);
          });

          // Add root directory into data
          // See https://github.com/nexB/scancode-toolkit/issues/543
          promiseChain
            .then(() => {
              if (rootPath && !hasRootPath) {
                files.push({
                  path: rootPath,
                  name: rootPath,
                  type: "directory",
                  files_count: files_count,
                });
              }
            })
            .then(() => this._batchCreateFiles(files, headerId))
            .then(() => {
              console.log(
                `Batch-${++batchCount} completed, \n`,
                `JSON Import progress @ ${progress} % -- ${index}/${files_count}+${dirs_count}`
              );
              onProgressUpdate(100);
              console.log("JSON parse completed (final step)");
              console.timeEnd("json-parse-time");
              resolve();
            })
            .catch((e: unknown) => reject(e));
        })
        .on("error", (e: unknown) => reject(e));
    });
  }

  _parseHeader(workbenchVersion: string, header: any) {
    interface ParsedJsonHeader {
      tool_name: StringDataType;
      tool_version: StringDataType;
      notice: StringDataType;
      duration: DataTypes.DoubleDataType;
      options: JSON_Type;
      input: JSON_Type;
      files_count: IntegerDataType;
      output_format_version: StringDataType;
      spdx_license_list_version: StringDataType; // @QUERY - Justify need for this
      operating_system: StringDataType;
      cpu_architecture: StringDataType;
      platform: StringDataType;
      platform_version: StringDataType;
      python_version: StringDataType;
      workbench_version: StringDataType;
      workbench_notice: StringDataType;
      header_content: StringDataType;
    }

    const input = header.options?.input || [];
    delete header.options?.input;
    const parsedHeader: ParsedJsonHeader = {
      tool_name: header.tool_name,
      tool_version: header.tool_version,
      notice: header.notice,
      duration: header.duration,
      options: header?.options || {},
      input,
      files_count: header.extra_data?.files_count,
      output_format_version: header.output_format_version,
      spdx_license_list_version: header.extra_data?.spdx_license_list_version,
      operating_system: header.extra_data?.system_environment?.operating_system,
      cpu_architecture: header.extra_data?.system_environment?.cpu_architecture,
      platform: header.extra_data?.system_environment?.platform,
      platform_version: header.extra_data?.system_environment?.platform_version,
      python_version: header.extra_data?.system_environment?.python_version,
      workbench_version: workbenchVersion as unknown as StringDataType,
      workbench_notice:
        'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.' as unknown as StringDataType,
      header_content: JSON.stringify(
        header,
        undefined,
        2
      ) as unknown as StringDataType, // FIXME
    };
    return parsedHeader;
  }

  _batchCreateFiles(files: any, headerId: number) {
    // Add batched files to the DB
    return this._addFlattenedFiles(files).then(() =>
      this._addFiles(files, headerId)
    );
  }

  _addFlattenedFiles(files: unknown[]) {
    // Fix for issue #232
    $.each(files, (i, file: any) => {
      if (
        file.type === "directory" &&
        Object.prototype.hasOwnProperty.call(file, "size_count")
      ) {
        file.size = file.size_count;
      }
    });

    const flattenedFiles = files.map((file: unknown) => flattenFile(file));

    // @DEBUG
    // flattenedFiles.forEach(file => {
    //   if(file.path == 'samples/JGroups/EULA')
    //     console.log("Flat File: ", file);
    // });

    return this.db.FlatFile.bulkCreate(flattenedFiles as any, {
      logging: false,
    });
  }

  _addFiles(files: any, headerId: number) {
    const transactionOptions: TransactionOptions = {
      autocommit: false,
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    };
    return this.sequelize.transaction(transactionOptions, (t) => {
      const options: BulkCreateOptions = {
        // logging: () => DebugLogger("add file", "AddFiles transaction executed !"),
        transaction: t,
      };
      $.each(files, (_, file) => {
        // Fix for issue #232
        if (
          file.type === "directory" &&
          Object.prototype.hasOwnProperty.call(file, "size_count")
        ) {
          file.size = file.size_count;
        }
        file.parent = parentPath(file.path);
        file.headerId = headerId;
      });

      return this.db.File.bulkCreate(files, options)
        .then(() => DebugLogger("file processor", "Processed bulkcreate"))

        .then(() =>
          this.db.LicenseExpression.bulkCreate(
            this._getLicenseExpressions(files),
            options
          )
        )
        .then(() =>
          DebugLogger("license exp processor", "Processed license_exp")
        )

        .then(() =>
          this.db.LicensePolicy.bulkCreate(
            this._addExtraFields(files, "license_policy"),
            options
          )
        )
        .then(() =>
          DebugLogger("license policy processor", "Processed license_policy")
        )

        .then(() =>
          this.db.Copyright.bulkCreate(
            this._addExtraFields(files, "copyrights"),
            options
          )
        )
        .then(() => DebugLogger("copyright processor", "Processed copyrights"))

        .then(() =>
          this.db.PackageData.bulkCreate(
            this._addExtraFields(files, "package_data"),
            options
          )
        )
        .then(() => DebugLogger("package processor", "Processed package_data"))

        .then(() =>
          this.db.Email.bulkCreate(
            this._addExtraFields(files, "emails"),
            options
          )
        )
        .then(() => DebugLogger("email processor", "Processed emails"))

        .then(() =>
          this.db.Url.bulkCreate(this._addExtraFields(files, "urls"), options)
        )
        .then(() => DebugLogger("URL processor", "Processed urls"))

        .then(() =>
          this.db.ScanError.bulkCreate(
            this._addExtraFields(files, "scan_errors"),
            options
          )
        )
        .then(() =>
          DebugLogger("scan error processor", "Processed scan-errors")
        )

        .then(() =>
          DebugLogger("file processor", "File processing completed !!!")
        )

        .catch((err) => {
          console.error("Some error parsing data !!", err);
          toast.error(
            "Some error parsing data !! \nPlease check console for more info"
          );
        });
    });
  }

  _addExtraFields(files: any, attribute: string) {
    return $.map(files, (file) => {
      if (!file) {
        console.log("invalid file added", file);
      }

      if (attribute === "copyrights") {
        return this._getNewCopyrights(file);
      } else if (attribute === "license_policy") {
        return this._getLicensePolicy(file);
      }

      const fileAttr = file[attribute] || [];

      return $.map(fileAttr, (value) => {
        if (attribute === "license_expressions") {
          return {
            license_expression: value,
            fileId: file.id,
          };
        } else if (attribute === "scan_errors") {
          return {
            scan_error: value,
            fileId: file.id,
          };
        }
        if (!file || !file.id)
          DebugLogger("add file", "Invalid file/file.id", file);
        value.fileId = file.id;
        return value;
      });
    });
  }

  _getLicenseExpressions(files: any[]) {
    const licenseExpressions: {
      fileId: IntegerDataType;
      license_expression: StringDataType;
      license_expression_spdx: StringDataType;
      license_keys: JSON_Type;
      license_keys_spdx: JSON_Type;
    }[] = [];

    files.forEach((file, idx) => {
      if (
        !file.detected_license_expression &&
        !file.detected_license_expression_spdx
      ) {
        return;
      }
      // Use concluded detected_license_expression & detected_license_expression_spdx
      const licenseKeys = parseTokenKeysFromExpression(
        file.detected_license_expression || ""
      );
      const filteredSpdxLicenseKeys = filterSpdxKeys(
        parseTokenKeysFromExpression(
          file.detected_license_expression_spdx || ""
        )
      );
      licenseExpressions.push({
        fileId: file.id,
        license_expression: file.detected_license_expression,
        license_expression_spdx: file.detected_license_expression_spdx,
        license_keys: licenseKeys as any,
        license_keys_spdx: filteredSpdxLicenseKeys as any,
      });
    });
    return licenseExpressions;
  }

  _getLicensePolicy(file: any) {
    // if ($.isEmptyObject(file.license_policy)) {
    if (!file.license_policy || !Object.keys(file.license_policy).length) {
      // if ($.isEmptyObject(file.license_policy)) {
      return null;
    }
    const license_policies = file.license_policy;
    license_policies.forEach((policy: any) => (policy.fileId = file.id));
    return license_policies;
  }

  _getNewCopyrights(file: any) {
    const statements = file.copyrights;
    const holders = file.holders;
    const authors = file.authors;

    const newLines: { start_line: string; end_line: string }[] = [];
    const newStatements: string[] = [];
    if (Array.isArray(statements)) {
      statements.forEach((statement) => {
        const value = statement["copyright"];
        if (!value) {
          return;
        }
        newStatements.push(value);

        const line = {
          start_line: statement["start_line"],
          end_line: statement["end_line"],
        };
        newLines.push(line);
      });
    }

    let newHolders: string[] = [];
    if (Array.isArray(holders)) {
      newHolders = holders.map((holder) => holder["holder"]);
    }

    let newAuthors: string[] = [];
    if (Array.isArray(authors)) {
      newAuthors = authors.map((author) => author["author"]);
    }

    const newCopyrights = [];
    for (let i = 0; i < newStatements.length; i++) {
      const newCopyright = {
        statements: [newStatements[i]],
        holders: [newHolders[i]],
        // FIXME: this probably does not work correctly
        authors: newAuthors || [],
        start_line: newLines[0].start_line,
        end_line: newLines[0].end_line,
        fileId: file.id,
      };

      newCopyrights.push(newCopyright);
    }
    return newCopyrights;
  }
}
