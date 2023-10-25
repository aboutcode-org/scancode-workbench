/*
 #
 # Copyright (c) nexB Inc. and others. All rights reserved.
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

import fs from "fs";
import JSONStream from "JSONStream";
import path from "path";
import { DataNode } from "rc-tree/lib/interface";
import { toast } from "react-toastify";
import {
  BulkCreateOptions,
  FindOptions,
  Model,
  Sequelize,
  Transaction,
  TransactionOptions,
} from "sequelize";

import { UNKNOWN_EXPRESSION, UNKNOWN_EXPRESSION_SPDX } from "../constants/data";
import { logDependenciesOnError } from "../utils/ensureRendererDeps";
import { DebugLogger } from "../utils/logger";
import { DatabaseStructure, newDatabase } from "./models/database";
import {
  filterSpdxKeys,
  parentPath,
  parseSubExpressions,
  parseTokenKeysFromExpression,
} from "./models/databaseUtils";
import { FileAttributes } from "./models/file";
import { flattenFile } from "./models/flatFile";
import {
  LicenseClue,
  LicenseExpressionKey,
  LicenseReference,
  ParsedJsonHeader,
  Resource,
  ResourceLicenseDetection,
  TopLevelLicenseDetection,
} from "./importedJsonTypes";
import { LicenseDetectionAttributes } from "./models/licenseDetections";
import { LicenseClueAttributes } from "./models/licenseClues";
import packageJson from "../../package.json";

const { version: workbenchVersion } = packageJson;

/**
 * Manages the database created from a ScanCode JSON input.
 * The database contains tables for both flattened and unflattened data
 *
 * The config will load an existing database or will create a new, empty
 * database if none exists. For a new database, the data is loaded from a JSON
 * file by calling addFromJson(jsonFilePath).
 *
 * @param config
 * @param config.dbName
 * @param config.dbUser
 * @param config.dbPassword
 * @param config.dbStorage
 */

interface WorkbenchDbConfig {
  dbName: string;
  dbStoragePath: string;
  dbUser?: string;
  dbPassword?: string;
}
interface TopLevelDataFormat {
  header: unknown;
  parsedHeader: ParsedJsonHeader;
  packages: unknown[];
  dependencies: unknown[];
  license_clues: LicenseClue[];
  license_detections: TopLevelLicenseDetection[];
  license_detections_map: Map<string, TopLevelLicenseDetection>;
  license_references: LicenseReference[];
  license_references_map: Map<string, LicenseReference>;
  license_references_spdx_map: Map<string, LicenseReference>;
  license_rule_references: unknown[];
}
export interface FileDataNode extends DataNode {
  id: number;
  path: string;
  parent: string;
  name: string;
  type: string;
  children?: FileDataNode[];
}

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
  config: WorkbenchDbConfig;

  constructor(config?: WorkbenchDbConfig & { deleteExisting?: boolean }) {
    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    const name = config && config.dbName ? config.dbName : "tmp";
    const user = config && config.dbUser ? config.dbUser : null;
    const password = config && config.dbPassword ? config.dbPassword : null;
    const storagePath =
      config && config.dbStoragePath ? config.dbStoragePath : ":memory:";
    this.config = {
      dbName: name,
      dbStoragePath: storagePath,
      dbUser: user,
      dbPassword: password,
    };

    // Clear existing data in sqlite file (if any)
    if (config.deleteExisting && fs.existsSync(storagePath)) {
      fs.unlink(storagePath, (err: Error) => {
        if (err) {
          throw err;
        }
        console.info(`Deleted existing db: ${storagePath}`);
      });
    }

    this.sequelize = new Sequelize(name, user, password, {
      dialect: "sqlite",
      // dialectModule: { Database },
      // dialectOptions: {
      //   sqlite3: Database,
      // },
      storage: storagePath,
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

  getScanInfo() {
    return this.sync.then((db) => db.Header.findOne());
  }

  getFileCount() {
    return this.sync
      .then((db) => db.Header.findOne({ attributes: ["files_count"] }))
      .then((count) => (count ? count.getDataValue("files_count") : 0));
  }

  getAllLicenseDetections() {
    return this.sync.then((db) =>
      db.LicenseDetections.findAll({ order: ["license_expression"] })
    );
  }

  getAllLicenseClues() {
    return this.sync.then((db) => db.LicenseClues.findAll());
  }

  getAllPackages() {
    return this.sync.then((db) => db.Packages.findAll());
  }

  getAllDependencies() {
    return this.sync.then((db) => db.Dependencies.findAll());
  }

  getLicenseRuleReference(identifier: string, attributes?: string[]) {
    return this.sync.then((db) =>
      db.LicenseRuleReferences.findOne({ where: { identifier }, attributes })
    );
  }

  // Uses the files table to do a findOne query
  findOne(query: FindOptions) {
    return this.sync.then((db) =>
      db.File.findOne({
        ...query,
        include: this.db.fileIncludes,
      })
    );
  }

  // Uses the files table to do a findAll query
  findAll(query: FindOptions) {
    return this.sync.then((db) =>
      db.File.findAll({
        ...query,
        include: this.db.fileIncludes,
      })
    );
  }

  // Uses findAll to return JSTree format from the File Table
  findAllJSTree() {
    const fileQuery: FindOptions<FileAttributes> = {
      attributes: ["id", "path", "parent", "name", "type"],
    };
    return this.sync
      .then((db) => db.File.findAll(fileQuery))
      .then((files) => this.listToTreeData(files));
  }

  listToTreeData(fileList: Model<FileAttributes, FileAttributes>[]) {
    const pathToNodeMap = new Map<string, FileDataNode>();
    const roots: FileDataNode[] = [];

    fileList.forEach((file) => {
      // Maintain path mapping for each file to DataNode properties
      const filePath = file.getDataValue("path");
      const fileType = file.getDataValue("type") || "file";
      pathToNodeMap.set(filePath, {
        id: file.getDataValue("id"),
        key: filePath,
        title: path.basename(filePath),
        path: filePath,
        parent: file.getDataValue("parent"),
        name: file.getDataValue("name"),
        type: fileType,
        isLeaf: fileType == "file",
        ...(fileType == "directory" && { children: [] }),
        // @TODO - Trial to fix rc-tree showing file icon instead of empty directory https://github.com/nexB/scancode-workbench/issues/542
        // isLeaf: fileType == "file",
      });
    });

    fileList.forEach((file) => {
      const fileParentPath = file.getDataValue("parent");
      const fileNode = pathToNodeMap.get(file.getDataValue("path"));
      if (Number(file.getDataValue("id")) !== 0) {
        if (pathToNodeMap.has(fileParentPath)) {
          pathToNodeMap.get(fileParentPath).children?.push(fileNode);
        }
      } else {
        roots.push(fileNode);
      }
    });

    roots.forEach(sortChildren);
    return roots;
  }

  // Add rows to the flattened files table from a ScanCode json object
  addFromJson(
    jsonFilePath: string,
    onProgressUpdate: (progress: number) => void
  ): Promise<void> {
    if (!jsonFilePath) {
      throw new Error("Invalid json file name: " + jsonFilePath);
    }

    // console.log("Adding from json with params", { jsonFilePath, workbenchVersion, onProgressUpdate });

    const stream = fs.createReadStream(jsonFilePath, { encoding: "utf8" });
    let files_count = 0;
    let dirs_count = 0;
    let index = 0;
    let rootPath: string | null = null;
    let hasRootPath = false;
    const batchSize = 1000;
    let files: Resource[] = [];
    let progress = 0;
    let promiseChain: Promise<unknown> = this.sync;

    console.info("JSON parse started (step 1)");
    console.time("json-parse-time");

    return this.sync.then(
      () =>
        new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const primaryPromise = this;

          let batchCount = 0;
          let TopLevelData: TopLevelDataFormat = {
            header: null,
            parsedHeader: this._parseHeader(jsonFilePath, workbenchVersion, {}),
            packages: [],
            dependencies: [],
            license_clues: [],
            license_detections: [],
            license_detections_map: new Map(),
            license_references: [],
            license_references_map: new Map(),
            license_references_spdx_map: new Map(),
            license_rule_references: [],
          };

          stream
            .pipe(JSONStream.parse("files.*")) // files field is piped to 'data' & rest to 'header' (Includes other top level fields)
            .on("header", (rawTopLevelData: any) => {
              TopLevelData = this._parseTopLevelFields(
                jsonFilePath,
                rawTopLevelData
              );

              files_count = Number(TopLevelData.parsedHeader.files_count);
              promiseChain = promiseChain
                .then(() => this.db.Packages.bulkCreate(TopLevelData.packages))
                .then(() =>
                  this.db.Dependencies.bulkCreate(TopLevelData.dependencies)
                )
                .then(() =>
                  this.db.LicenseRuleReferences.bulkCreate(
                    TopLevelData.license_rule_references
                  )
                )
                .catch((err: unknown) => {
                  console.error(
                    "Some error parsing Top level data (caught in workbenchDB) !!",
                    err,
                    TopLevelData
                  );
                  reject(err);
                });
            })
            .on("data", function (file?: Resource) {
              if (!file) return;

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

              primaryPromise._parseLicenseDetections(file, TopLevelData);
              primaryPromise._parseLicenseClues(file, TopLevelData);

              files.push(file);
              if (files.length >= batchSize) {
                // Need to set a new variable before handing to promise
                this.pause();

                promiseChain = promiseChain
                  .then(() => primaryPromise._batchCreateFiles(files))
                  .then(() => {
                    const currentProgress = Math.round(
                      (index / (files_count + dirs_count)) * 100
                    );
                    if (currentProgress > progress) {
                      progress = currentProgress;
                      console.info(
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
                .then(() => this._batchCreateFiles(files))
                .then(() => this.db.Header.create(TopLevelData.parsedHeader))
                .then(() => {
                  console.info(
                    `Batch-${++batchCount} completed, \n`,
                    `JSON Import progress @ ${progress} % -- ${index}/${files_count}+${dirs_count}`
                  );
                  onProgressUpdate(90);
                })
                .then(() =>
                  this.db.LicenseDetections.bulkCreate(
                    TopLevelData.license_detections as any as LicenseDetectionAttributes[]
                  )
                )
                .then(() =>
                  this.db.LicenseClues.bulkCreate(
                    TopLevelData.license_clues as any as LicenseClueAttributes[]
                  )
                )
                .then(() => {
                  onProgressUpdate(100);
                  console.info("JSON parse completed (final step)");
                  console.timeEnd("json-parse-time");
                  resolve();
                })
                .catch((e: unknown) => reject(e));
            })
            .on("error", (err: unknown) => {
              console.error(
                "Some error parsing data (caught in workbenchDB) !!",
                err
              );
              toast.error(
                "Some error parsing data !! \nPlease check console for more info"
              );
              logDependenciesOnError();
              reject(err);
            });
        })
    );
  }

  // Helper function for parsing Toplevel data
  _parseTopLevelFields(
    jsonFilePath: string,
    rawTopLevelData: any
  ): TopLevelDataFormat {
    const header = rawTopLevelData.headers
      ? rawTopLevelData.headers[0] || {}
      : {};
    const parsedHeader = this._parseHeader(
      jsonFilePath,
      workbenchVersion,
      header
    );
    const packages = rawTopLevelData.packages || [];
    const dependencies = rawTopLevelData.dependencies || [];
    const license_detections: TopLevelLicenseDetection[] = (
      rawTopLevelData.license_detections || []
    ).map((detection: TopLevelLicenseDetection) => {
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
    const license_detections_map = new Map<string, TopLevelLicenseDetection>(
      license_detections.map((detection) => [detection.identifier, detection])
    );
    const license_references: LicenseReference[] =
      rawTopLevelData.license_references || [];
    const license_references_mapping = new Map(
      license_references.map((ref) => [ref.key, ref])
    );
    const license_references_mapping_spdx = new Map(
      license_references.map((ref) => [ref.spdx_license_key, ref])
    );
    const license_rule_references: any[] =
      rawTopLevelData.license_rule_references || [];

    return {
      header,
      parsedHeader,
      packages,
      dependencies,
      license_detections,
      license_clues: [],
      license_references_map: license_references_mapping,
      license_references_spdx_map: license_references_mapping_spdx,
      license_detections_map,
      license_references,
      license_rule_references,
    };
  }

  _parseHeader(jsonFilePath: string, workbenchVersion: string, header: any) {
    const input = header.options?.input || [];
    delete header.options?.input;
    const parsedHeader: ParsedJsonHeader = {
      json_file_name: path.basename(jsonFilePath),
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
      workbench_version: workbenchVersion,
      workbench_notice:
        'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.',
      header_content: JSON.stringify(header, undefined, 2),
      errors: header.errors,
    };
    return parsedHeader;
  }

  _parseLicenseDetections(file: Resource, TopLevelData: TopLevelDataFormat) {
    if (!file) return;

    const file_license_expressions_components = parseSubExpressions(
      file.detected_license_expression
    );
    const file_license_expressions_spdx_components = parseSubExpressions(
      file.detected_license_expression_spdx
    );
    // Handle absence of detection.identifier in matches at file level in prev toolkit versions
    // upto v32.0.0rc2
    const for_license_detections: string[] = file.for_license_detections || [];

    function addLicenseDetection(
      detection: ResourceLicenseDetection,
      detectionIdx: number,
      from_package = false
    ) {
      const detectionIdentifier =
        detection.identifier || for_license_detections[detectionIdx];

      const targetLicenseDetection =
        TopLevelData.license_detections_map.get(detectionIdentifier);

      if (!targetLicenseDetection) return;
      if (!targetLicenseDetection.file_regions)
        targetLicenseDetection.file_regions = [];

      // Collect file region from each detection
      let min_start_line = detection.matches[0].start_line;
      let max_end_line = detection.matches[0].end_line;
      detection.matches.forEach((match) => {
        min_start_line = Math.min(min_start_line, match.start_line);
        max_end_line = Math.max(max_end_line, match.end_line);
      });
      targetLicenseDetection.file_regions.push({
        path: file.path,
        start_line: min_start_line,
        end_line: max_end_line,
        from_package,
      });

      // Ensure that matches is collected only once for each unique License detection
      // Ignore match encountered in other files as it would be the same repeated match
      if (!targetLicenseDetection.matches && detection.matches.length) {
        targetLicenseDetection.matches = [];
        const detectionLicenseExpressionComponents = parseSubExpressions(
          detection.license_expression
        );

        let correspondingFileLicenseExpressionSpdxComponent =
          file_license_expressions_spdx_components[
            file_license_expressions_components.findIndex(
              (val) => val === detection.license_expression
            )
          ];

        // Cases when,
        // detection.license_expression = file.detected_license_expression &
        // detection.license_expression_spdx = file.detected_license_expression_spdx
        if (detection.license_expression === file.detected_license_expression) {
          correspondingFileLicenseExpressionSpdxComponent =
            file.detected_license_expression_spdx;
        }

        // Unknown
        if (detection.license_expression == UNKNOWN_EXPRESSION) {
          correspondingFileLicenseExpressionSpdxComponent =
            UNKNOWN_EXPRESSION_SPDX;
        }

        const detectionSpdxLicenseExpressionComponents = parseSubExpressions(
          correspondingFileLicenseExpressionSpdxComponent
        );

        detection.matches.forEach((match) => {
          const { license_references_map, license_references_spdx_map } =
            TopLevelData;

          if (!match.license_expression_keys?.length)
            match.license_expression_keys = [];
          if (
            !match.license_expression_spdx_keys ||
            !match.license_expression_spdx_keys.length
          )
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
          if (match.license_expression === detection.license_expression) {
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

          parsedLicenseKeys.forEach((key) => {
            const license_reference: any = license_references_map.get(key);
            // if (!license_reference) return;

            match.license_expression_keys.push({
              key,
              licensedb_url: license_reference?.licensedb_url || null,
              scancode_url: license_reference?.scancode_url || null,
            });
          });
          parsedSpdxLicenseKeys.forEach((key) => {
            const license_reference: any = license_references_spdx_map.get(key);
            // if (!license_reference) return;

            match.license_expression_spdx_keys.push({
              key,
              spdx_url: license_reference?.spdx_url || null,
            });
          });
          match.path = file.path;
          targetLicenseDetection.matches.push(match);
        });
      }

      delete detection.matches; // Not required further, hence removing to reduce sqlite size
    }

    (file?.license_detections || []).forEach((detection, idx) =>
      addLicenseDetection(detection, idx, false)
    );
    file?.package_data?.forEach((pkg) =>
      pkg.license_detections?.forEach((detection, idx) =>
        addLicenseDetection(detection, idx, true)
      )
    );
  }

  _parseLicenseClues(file: Resource, TopLevelData: TopLevelDataFormat) {
    file.license_clues?.forEach((license_clue, clue_idx) => {
      const parsedLicenseKeys = parseSubExpressions(
        license_clue.license_expression
      );

      const license_expression_keys: LicenseExpressionKey[] = [];
      parsedLicenseKeys.forEach((key) => {
        const license_reference = TopLevelData.license_references_map.get(key);
        if (!license_reference) return [];

        license_expression_keys.push({
          key,
          licensedb_url: license_reference.licensedb_url || null,
          scancode_url: license_reference.scancode_url || null,
        });
      });

      license_clue.fileId = file.id;
      license_clue.filePath = file.path;
      license_clue.fileClueIdx = clue_idx;
      TopLevelData.license_clues.push(license_clue);
      license_clue.matches = [
        {
          score: license_clue.score,
          start_line: license_clue.start_line,
          end_line: license_clue.end_line,
          matched_text: license_clue.matched_text,
          matched_length: license_clue.matched_length,
          match_coverage: license_clue.match_coverage,
          matcher: license_clue.matcher,
          license_expression: license_clue.license_expression,
          rule_identifier: license_clue.rule_identifier,
          rule_relevance: license_clue.rule_relevance,
          rule_url: license_clue.rule_url,
          path: file.path,
          license_expression_keys,
        },
      ];
      license_clue.file_regions = [
        {
          path: file.path,
          start_line: license_clue.start_line,
          end_line: license_clue.end_line,
          // from_package: false,
        },
      ];
    });
  }

  _batchCreateFiles(files: Resource[]) {
    // Add batched files to the DB
    return this._addFlattenedFiles(files).then(() => this._addFiles(files));
  }

  _addFlattenedFiles(files: Resource[]) {
    // Fix for issue #232
    files.forEach((file) => {
      if (
        file.type === "directory" &&
        Object.prototype.hasOwnProperty.call(file, "size_count")
      ) {
        file.size = file.size_count;
      }
    });

    const flattenedFiles = files.map((file) => flattenFile(file));

    return this.db.FlatFile.bulkCreate(flattenedFiles as any[], {
      logging: false,
    });
  }

  _addFiles(files: Resource[]) {
    const transactionOptions: TransactionOptions = {
      autocommit: false,
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    };
    return this.sequelize.transaction(transactionOptions, (t) => {
      const options: BulkCreateOptions = {
        // logging: () => DebugLogger("add file", "AddFiles transaction executed !"),
        transaction: t,
      };
      files.forEach((file) => {
        // Fix for issue #232
        if (
          file.type === "directory" &&
          Object.prototype.hasOwnProperty.call(file, "size_count")
        ) {
          file.size = file.size_count;
        }
        file.parent = parentPath(file.path);
      });

      return this.db.File.bulkCreate(files as any, options)
        .then(() => DebugLogger("file processor", "Processed bulkcreate"))

        .then(() =>
          this.db.LicenseExpression.bulkCreate(
            this._getLicenseExpressions(files) as any,
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
          console.error(
            "Some error adding files data (caught in workbenchDB) !!",
            err,
            files,
            options
          );
          toast.error(
            "Some error parsing data !! \nPlease check console for more info"
          );
          logDependenciesOnError();
        });
    });
  }

  _addExtraFields(files: Resource[], attribute: string) {
    return files.flatMap((file) => {
      if (!file) {
        // console.log("invalid file added", file);
        return [];
      }

      if (attribute === "copyrights") {
        return this._getNewCopyrights(file);
      } else if (attribute === "license_policy") {
        return this._getLicensePolicy(file);
      }

      const fileAttr = (file as any)[attribute] || [];

      return fileAttr.map((value: any) => {
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

  _getLicenseExpressions(files: Resource[]) {
    const licenseExpressions: {
      fileId: number;
      license_expression: string;
      license_expression_spdx: string;
      license_keys: string[];
      license_keys_spdx: string[];
    }[] = [];

    files.forEach((file) => {
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
        license_keys: licenseKeys,
        license_keys_spdx: filteredSpdxLicenseKeys,
      });
    });
    return licenseExpressions;
  }

  _getLicensePolicy(file: Resource) {
    if (!file.license_policy || !Object.keys(file.license_policy).length) {
      return [];
    }
    const license_policies = file.license_policy;
    license_policies.forEach((policy) => (policy.fileId = file.id));
    return license_policies;
  }

  _getNewCopyrights(file: Resource) {
    const statements = file.copyrights || [];
    const holders = file.holders || [];
    const authors = file.authors || [];

    const newLines: { start_line: number; end_line: number }[] = [];
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
