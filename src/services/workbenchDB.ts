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

import $ from 'jquery'
import { BulkCreateOptions, DataTypes, FindOptions, IntegerDataType, Model, Sequelize, Transaction, TransactionOptions } from 'sequelize';
import fs from 'fs';
import path from 'path';
// import sqlite3 from 'sqlite3';
import JSONStream from 'JSONStream';
import { DatabaseStructure, newDatabase } from './models/database';
import {parentPath} from './models/databaseUtils';
import { DebugLogger } from '../utils/logger';
import { FileAttributes } from './models/file';
import { DataNode } from 'rc-tree/lib/interface';
import { flattenFile } from './models/flatFile';

// console.log("Sqlite3", sqlite3);

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
  dbName: string,
  dbStorage: string,
  dbUser?: string,
  dbPassword?: string,
}
type FileDataNode = Model<FileAttributes, FileAttributes> & DataNode;


// @TODO
// function sortChildren(node: Model<FileAttributes, FileAttributes>){
function sortChildren(node: FileDataNode){
  if(!node.children || !node.children.length)
    return;
  node.children.sort((a: any, b: any) => {
    if(a.type === b.type)
      return 0;
    if(a.type === 'file')
      return 1;
    return -1;
  });
  node.children.forEach(sortChildren);
}

export class WorkbenchDB {
  sequelize: Sequelize;
  db: DatabaseStructure;
  sync:  Promise<DatabaseStructure>;
  
  constructor(config: WorkbenchDbConfig) {
    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    const name = (config && config.dbName) ? config.dbName : 'tmp';
    const user = (config && config.dbUser) ? config.dbUser : null;
    const password = (config && config.dbPassword) ? config.dbPassword : null;
    const storage = (config && config.dbStorage) ? config.dbStorage : ':memory:';

    console.log("Sequelize DB details", {
      name, user, password, storage,
    });
    // console.log("Dialect module :", sqlite3);

    this.sequelize = new Sequelize(name, user, password, {
      dialect: 'sqlite',
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
      return this.db
    });
  }

  // Get ScanCode Workbench app information
  getWorkbenchInfo() {
    return this.sync.then(db => db.Header.findOne({
      attributes: [
        'workbench_notice',
        'workbench_version'
      ]
    }));
  }

  // Get ScanCode Toolkit information
  getScanCodeInfo() {
    return this.sync.then(db => db.Header.findOne({
      attributes: [
        'scancode_notice',
        'scancode_version',
        'scancode_options'
      ]
    }));
  }

  getScanInfo(){
    return this.sync.then(db => db.Header.findOne());
  }

  getFileCount(){
    return this.sync
      .then(db => db.Header.findOne({attributes: ['files_count']}))
      .then((count) => count ? count.getDataValue('files_count') : 0);
  }

  getAllPackages(){
    return this.sync.then(db => db.Packages.findAll());
  }

  getAllDependencies(){
    return this.sync.then(db => db.Dependencies.findAll());
  }

  // Uses the files table to do a findOne query
  findOne(query: FindOptions) {
    query = $.extend(
      query,
      {
        include: this.db.fileIncludes
      }
    );
    return this.sync.then(db => db.File.findOne(query));
  }

  // Uses the files table to do a findAll query
  findAll(query: FindOptions) {
    query = $.extend(
      query,
      {
        include: this.db.fileIncludes
      }
    );
    return this.sync.then(db => db.File.findAll(query));
  }


  // Uses findAll to return JSTree format from the File Table
  findAllJSTree() {
    const fileQuery: FindOptions<FileAttributes> = {
      attributes: ['id', 'path', 'parent', 'name', 'type']
    };
    return this.sync
      .then(db => db.File.findAll(fileQuery))
      .then(files => {
        const result = this.listToTreeData(files as FileDataNode[]);
        return result;
      });
    
    // @TODO-Residue: Remove this
    // But, maybe needed, if we want different file icons for packages licenses etc

    // // When determining type for each file is important
    // type GenericModelValues = { fileId: DataTypes.IntegerDataType};
    // function prepareIdSet(values: Model<GenericModelValues, GenericModelValues>[]){
    //   const resultMapping = new Set<number>();
    //   values.forEach(value => resultMapping.add(Number(value.getDataValue('fileId'))));
    //   return resultMapping;
    // }
    // const pkgPromise = this.db.Package
    //   .findAll({attributes: ['fileId']})
    //   .then(prepareIdSet);
    // const approvedPromise = this.db.LicensePolicy
    //   .findAll({where: {label: 'Approved License'}, attributes: ['fileId']})
    //   .then(prepareIdSet);
    // const prohibitedPromise = this.db.LicensePolicy
    //   .findAll({where: {label: 'Prohibited License'}, attributes: ['fileId']})
    //   .then(prepareIdSet);
    // const recommendedPromise = this.db.LicensePolicy
    //   .findAll({where: {label: 'Recommended License'}, attributes: ['fileId']})
    //   .then(prepareIdSet);
    // const restrictedPromise = this.db.LicensePolicy
    //   .findAll({where: {label: 'Restricted License'}, attributes: ['fileId']})
    //   .then(prepareIdSet);

    // return Promise.all(
    //   [pkgPromise, approvedPromise, prohibitedPromise, recommendedPromise, restrictedPromise]
    // )
    //   .then(() => this.sync
    //   .then((db) => db.File.findAll(fileQuery))
    //   .then(files => {
    //     const result = this.listToTreeData(files);
    //     console.log("pathtest", result);
    //     return result;
    //   }));
  }
  

  listToTreeData(fileList: FileDataNode[]) {
    const pathToIndexMap = new Map<string, number>();
    const roots: FileDataNode[] = [];

    fileList.forEach(file => {
      // Maintain path mapping for each file
      pathToIndexMap.set(file.getDataValue('path'), Number(file.getDataValue('id')));

      // Setup DataNode properties
      file.key = file.getDataValue('path');
      file.children = [];
      file.title = path.basename(file.getDataValue('path'));
    });
    
    fileList.forEach(file => {
      const fileParentPath = file.getDataValue('parent').toString({});
      if (Number(file.getDataValue('id')) !== 0) {
        if(pathToIndexMap.has(fileParentPath)){
          // @TODO
          // if you have dangling branches check that map[node.parentId] exists
          fileList[pathToIndexMap.get(fileParentPath)].children.push(file);
        }
      } else {
        roots.push(file);
      }
    });

    roots.forEach(sortChildren);
    return roots;
  }

  // @TODO-Residue: Remove this
  determineJSTreeType(file: Model<FileAttributes, FileAttributes>, promises: Set<number>[]) {
    let type = '';

    const packages = promises[0] || new Set();
    const approvedPolicies = promises[1] || new Set();
    const prohibitedPolicies = promises[2] || new Set();
    const recommendedPolicies = promises[3] || new Set();
    const restrictedPolicies = promises[4] || new Set();

    const fileID = Number(file.getDataValue('id').toString({}));
    const fileType = file.getDataValue('type').toString({});

    if (packages.has(fileID)) {
      if (fileType === 'file') {
        type = 'packageFile';
      } else if (fileType === 'directory') {
        type = 'packageDir'; 
      }
    } else if (approvedPolicies.has(fileID)) {
      type = 'approvedLicense';
    } else if (prohibitedPolicies.has(fileID)) {
      type = 'prohibitedLicense';
    } else if (recommendedPolicies.has(fileID)) {
      type = 'recommendedLicense';
    } else if (restrictedPolicies.has(fileID)) {
      type = 'restrictedLicense';
    } else {
      type = fileType;
    }
    
    return type;
  }

  // Add rows to the flattened files table from a ScanCode json object
  addFromJson(
    jsonFileName: string,
    workbenchVersion: string,
    onProgressUpdate: (progress: number) => void,
  ): Promise<void> {
    if (!jsonFileName) {
      throw new Error('Invalid json file name: ' + jsonFileName);
    }
    // console.log("Adding from json with params", { jsonFileName, workbenchVersion, onProgressUpdate });
    
    const stream = fs.createReadStream(jsonFileName, {encoding: 'utf8'});
    const version = workbenchVersion;
    let headerId: number | null = null;
    let files_count: number | null = null;
    let dirs_count: number | null = null;
    let index = 0;
    let rootPath: string | null = null;
    let hasRootPath = false;
    const batchSize  = 1000;
    let files: any[] = [];    // @TODO
    let progress = 0;
    let promiseChain: Promise<void | DatabaseStructure | number> = this.sync;

    console.log('JSON parse started (step 1)');
    console.time('json-parse-time')

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const primaryPromise = this;    // @TODO

      let batchCount = 0;

      stream
        .pipe(JSONStream.parse('files.*'))
        .on('header', (topLevelData: any) => {
          const header = topLevelData.headers[0];
          const packages = topLevelData.packages || [];
          const dependencies = topLevelData.dependencies || [];
          
          interface ParsedJsonHeader {
            workbench_version: DataTypes.StringDataType,
            workbench_notice: DataTypes.StringDataType,
            header_content: DataTypes.StringDataType,
            files_count: IntegerDataType,
            output_format_version: DataTypes.StringDataType,        // Query -Justify need for this
            spdx_license_list_version: DataTypes.StringDataType,    // Query - Justify need for this
            operating_system: DataTypes.StringDataType,
            cpu_architecture: DataTypes.StringDataType,
            platform: DataTypes.StringDataType,
            platform_version: DataTypes.StringDataType,
            python_version: DataTypes.StringDataType,
          }
          const parsedHeader: ParsedJsonHeader = {
            header_content: JSON.stringify(header, undefined, 2) as unknown as DataTypes.StringDataType,   // FIXME
            files_count: header.extra_data.files_count,
            output_format_version: header.output_format_version,
            spdx_license_list_version: header.extra_data?.spdx_license_list_version,
            operating_system: header.extra_data?.system_environment?.operating_system,
            cpu_architecture: header.extra_data?.system_environment?.cpu_architecture,
            platform: header.extra_data?.system_environment?.platform,
            platform_version: header.extra_data?.system_environment?.platform_version,
            python_version: header.extra_data?.system_environment?.python_version,
            workbench_version: version as unknown as DataTypes.StringDataType,
            workbench_notice: 'Exported from ScanCode Workbench and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nScanCode Workbench should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nScanCode Workbench is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/scancode-workbench/ for support and download.' as unknown as DataTypes.StringDataType,
          };

          console.log("Scan header info:", parsedHeader);
          
          files_count = Number(parsedHeader.files_count);
          promiseChain = promiseChain
            .then(() => this.db.Packages.bulkCreate(packages))
            .then(() => this.db.Dependencies.bulkCreate(dependencies))
            .then(() => this.db.Header.create(parsedHeader))
            .then(header => headerId = Number(header.getDataValue('id')));
        })
        .on('data', function(file: any) {
          if (!rootPath) {
            rootPath = file.path.split('/')[0];
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
            
            promiseChain = promiseChain
              .then(() => primaryPromise._batchCreateFiles(files, headerId))
              .then(() => {
                const currentProgress = Math.round(index / (files_count + dirs_count) * 100);
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
        .on('end', () => {
          // Add root directory into data
          // See https://github.com/nexB/scancode-toolkit/issues/543
          promiseChain
            .then(() => {
              if (rootPath && !hasRootPath) {
                files.push({
                  path: rootPath,
                  name: rootPath,
                  type: 'directory',
                  files_count: files_count
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
              console.log('JSON parse completed (final step)');
              console.timeEnd('json-parse-time')
              resolve();
            }).catch((e: unknown) => reject(e));
        })
        .on('error', (e: unknown) => reject(e));
    });
  }

  _batchCreateFiles(files: any, headerId: number) {
    // Add batched files to the DB
    return this._addFlattenedFiles(files)
      .then(() => this._addFiles(files, headerId));
  }

  _addFlattenedFiles(files: any) {
    // Fix for issue #232
    $.each(files, (i, file) => {
      if (file.type === 'directory' && Object.prototype.hasOwnProperty.call(file, 'size_count')) {
        file.size = file.size_count;
      }
    });
    files = $.map(files, (file) => flattenFile(file));
    return this.db.FlatFile.bulkCreate(files, { logging: false });
  }

  _addFiles(files: any, headerId: number) {
    const transactionOptions: TransactionOptions = {
      autocommit: false,
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    };
    return this.sequelize.transaction(transactionOptions, (t) => {
      const options: BulkCreateOptions = {
        // logging: () => DebugLogger("add file", "AddFiles transaction executed !"),
        transaction: t
      };
      $.each(files, (_, file) => {
        // Fix for issue #232
        if (file.type === 'directory' && Object.prototype.hasOwnProperty.call(file, 'size_count')) {
          file.size = file.size_count;
        }
        file.parent = parentPath(file.path);
        file.headerId = headerId;
      });
      
      return this.db.File.bulkCreate(files, options)
        .then(() => DebugLogger("file processor", "Processed bulkcreate"))
        
        .then(() => this.db.License.bulkCreate(this._addExtraFields(files, 'licenses'), options))
        .then(() => DebugLogger("license processor", "Processed licenses"))

        .then(() => this.db.LicenseExpression.bulkCreate(this._addExtraFields(files, 'license_expressions'), options))
        .then(() => DebugLogger("license exp processor", "Processed license_exp"))

        .then(() => this.db.LicensePolicy.bulkCreate(this._addExtraFields(files, 'license_policy'), options)) 
        .then(() => DebugLogger("license policy processor", "Processed license_policy"))

        .then(() => this.db.Copyright.bulkCreate(this._addExtraFields(files, 'copyrights'), options))
        .then(() => DebugLogger("copyright processor", "Processed copyrights"))

        .then(() => this.db.PackageData.bulkCreate(this._addExtraFields(files, 'package_data'), options))
        .then(() => DebugLogger("package processor", "Processed package_data"))

        .then(() => this.db.Email.bulkCreate(this._addExtraFields(files, 'emails'), options))
        .then(() => DebugLogger("email processor", "Processed emails"))

        .then(() => this.db.Url.bulkCreate(this._addExtraFields(files, 'urls'), options))
        .then(() => DebugLogger("URL processor", "Processed urls"))

        .then(() => this.db.ScanError.bulkCreate(this._addExtraFields(files, 'scan_errors'), options))
        .then(() => DebugLogger("scan error processor", "Processed scan-errors"))

        .then(() => DebugLogger("file processor", "File processing completed !!!"));
    });
  }

  _addExtraFields(files: any, attribute: string) {
    return $.map(files, (file) => {
      if(!file){
        console.log("invalid file added", file);
      }

      if (attribute === 'copyrights') {
        return this._getNewCopyrights(file);
      } else if (attribute === 'license_policy') {
        return this._getLicensePolicy(file);
      }

      const fileAttr = file[attribute] || [];

      return $.map(fileAttr, (value) => {
        if (attribute === 'license_expressions') {
          return {
            license_expression: value,
            fileId: file.id
          };
        } else if (attribute === 'scan_errors') {
          return {
            scan_error: value,
            fileId: file.id
          };
        }
        if(!file || !file.id)
          DebugLogger("add file", "Invalid file/file.id", file);
        value.fileId = file.id;
        return value;
      });
    });
  }

  _getLicensePolicy(file: any) {
    // if ($.isEmptyObject(file.license_policy)) {
    if (!file.license_policy || !Object.keys(file.license_policy).length) {
    // if ($.isEmptyObject(file.license_policy)) {
      return;
    }
    const license_policy = file.license_policy;
    license_policy.fileId = file.id;
    return license_policy;
  }

  _getNewCopyrights(file: any) {
    const statements = file.copyrights;
    const holders = file.holders;
    const authors = file.authors;
    
    const newLines: { start_line: string, end_line: string }[] = [];
    const newStatements: string[] = [];
    if (Array.isArray(statements)) {
      statements.forEach((statement) => {
        const value = statement['copyright'];
        if (!value) {
          return;
        }
        newStatements.push(value);

        const line = {
          start_line: statement['start_line'],
          end_line: statement['end_line'],
        };
        newLines.push(line);
      });
    }
    
    let newHolders: string[] = [];
    if (Array.isArray(holders)) {
      newHolders = holders.map(holder => holder['holder']);
    }

    let newAuthors: string[] = [];
    if (Array.isArray(authors)) {
      newAuthors = authors.map((author) => author['author']);
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