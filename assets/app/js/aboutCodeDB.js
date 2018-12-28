/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-toolkit/
 # The ScanCode software is licensed under the Apache License version 2.0.
 # AboutCode is a trademark of nexB Inc.
 #
 # You may not use this software except in compliance with the License.
 # You may obtain a copy of the License at: http://apache.org/licenses/LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software distributed
 # under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 # CONDITIONS OF ANY KIND, either express or implied. See the License for the
 # specific language governing permissions and limitations under the License.
 #
 */

const Sequelize = require('sequelize');
const fs = require('fs');
const JSONStream = require('JSONStream');
const Database = require('./models/database');
const {parentPath} = require('./models/databaseUtils');

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
class AboutCodeDB {
  constructor(config) {
    // Constructor returns an object which effectively represents a connection
    // to the db arguments (name of db, username for db, pw for that user)
    const name = (config && config.dbName) ? config.dbName : 'tmp';
    const user = (config && config.dbUser) ? config.dbUser : null;
    const password = (config && config.dbPassword) ? config.dbPassword : null;
    const storage = (config && config.dbStorage) ? config.dbStorage : ':memory:';

    this.sequelize = new Sequelize(name, user, password, {
      dialect: 'sqlite',
      storage: storage
    });

    this.db = Database(this.sequelize, Sequelize);

    // A promise that will return when the db and tables have been created
    this.sync = this.sequelize.sync().then(() => this.db);
  }

  // Get AboutCode Manager app information
  getAboutCodeInfo() {
    return this.sync.then((db) => db.Header.findOne({
      attributes: [
        'aboutcode_manager_notice',
        'aboutcode_manager_version'
      ]
    }));
  }

  // Get ScanCode Toolkit information
  getScanCodeInfo() {
    return this.sync.then((db) => db.Header.findOne({
      attributes: [
        'scancode_notice',
        'scancode_version',
        'scancode_options'
      ]
    }));
  }

  getFileCount() {
    return this.sync
      .then((db) => db.Header.findOne({attributes: ['files_count']}))
      .then((count) => count ? count.files_count : 0);
  }

  // Uses the conclusions table to do a findAll query
  findAllConclusions(query) {
    return this.sync.then((db) => db.Conclusion.findAll(query));
  }

  // Uses the conclusions table to do a findOne query
  findConclusion(query) {
    return this.sync.then((db) => db.Conclusion.findOne(query));
  }

  // Uses the conclusions table to create or set a conclusion
  setConclusion(conclusion) {
    return this.findConclusion({ where: { path: conclusion.path } })
      .then((dbConclusion) => {
        if (dbConclusion) {
          return dbConclusion.update(conclusion);
        }
        else {
          return this.db.Conclusion.create(conclusion);
        }
      });
  }

  // Uses the files table to do a findOne query
  findOne(query) {
    query = $.extend(query, { include: this.db.fileIncludes });
    return this.sync.then((db) => db.File.findOne(query));
  }

  // Uses the files table to do a findAll query
  findAll(query) {
    query = $.extend(query, { include: this.db.fileIncludes });
    return this.sync.then((db) => db.File.findAll(query));
  }

  findAllUnique(path, field, subTable) {
    return this.sync
      .then((db) => {
        if (!subTable) {
          return db.File
            .findAll({
              attributes: [field],
              group: [field],
              where: {
                path: {$like: `${path}%`},
                $and: [
                  {[field]: {$ne: null}},
                  {[field]: {$ne: ''}}
                ]
              }
            })
            .then((rows) => $.map(rows, (row) => row[field]));
        }
        return db.File
          .findAll({
            attributes: [],
            group: [`${subTable.name}.${field}`],
            where: { path: {$like: `${path}%`} },
            include: [{
              model: subTable,
              attributes: [field],
              where: {
                $and: [
                  { [field]: {$ne: null} },
                  { [field]: {$ne: ''} }
                ]
              },
            }]
          })
          .then((rows) => $.map(rows, (row) => row[subTable.name]))
          .then((values) => $.map(values, (value) => value[field]));
      });
  }


  // Uses findAll to return JSTree format from the File Table
  findAllJSTree(query) {
    query = $.extend(query, {
      attributes: ['id', 'path', 'parent', 'name', 'type']
    });

    const analyzedPromise = this.db.Conclusion.findAll({where: {review_status: 'Analyzed'}, attributes: ['fileId']})
      .then((concs) => concs.map((conc) => conc.fileId));
    const NAPromise = this.db.Conclusion.findAll({where: {review_status: 'Attention'}, attributes: ['fileId']})
      .then((concs) => concs.map((conc) => conc.fileId));
    const OCPromise = this.db.Conclusion.findAll({where: {review_status: 'Original'}, attributes: ['fileId']})
      .then((concs) => concs.map((conc) => conc.fileId));
    const NRPromise = this.db.Conclusion.findAll({where: {review_status: 'NR'}, attributes: ['fileId']})
      .then((concs) => concs.map((conc) => conc.fileId));
    const pkgPromise = this.db.Package.findAll({attributes: ['fileId']})
      .then((pkgs) => pkgs.map((pkg) => pkg.fileId));

    return Promise.all([analyzedPromise, NAPromise, OCPromise, NRPromise,  pkgPromise]).then((promises) => this.sync
      .then((db) => db.File.findAll(query))
      .then((files) => {
        return files.map((file) => {
          return {
            id: file.path,
            text: file.name,
            parent: file.parent,
            type: this.determineJSTreeType(file, promises),
            children: file.type === 'directory'
          };
        });
      }));
  }
  
  determineJSTreeType(file, promises) {
    let type = '';

    const analyzed = promises[0];
    const na = promises[1];
    const oc = promises[2];
    const nr = promises[3];
    const packages = promises[4];

    if (analyzed.includes(file.id)) {
      if (file.type === 'file') {
        type = 'analyzedFile';
      } else if (file.type === 'directory') {
        type = 'analyzedDir'; 
      }
    } else if (na.includes(file.id)) {
      if (file.type === 'file') {
        type = 'naFile';
      } else if (file.type === 'directory') {
        type = 'naDir'; 
      }
    } else if (oc.includes(file.id)) {
      if (file.type === 'file') {
        type = 'ocFile';
      } else if (file.type === 'directory') {
        type = 'ocDir'; 
      }
    } else if (nr.includes(file.id)) {
      if (file.type === 'file') {
        type = 'nrFile';
      } else if (file.type === 'directory') {
        type = 'nrDir'; 
      }
    } else if (packages.includes(file.id)) {
      if (file.type === 'file') {
        type = 'packageFile';
      } else if (file.type === 'directory') {
        type = 'packageDir'; 
      }
    } else {
      type = file.type;
    }
    
    return type;
  }

  // Add rows to the flattened files table from a ScanCode json object
  addFromJson(jsonFileName, aboutCodeVersion, onProgressUpdate) {
    if (!jsonFileName) {
      throw new Error('Invalid json file name: ' + jsonFileName);
    }

    const stream = fs.createReadStream(jsonFileName, {encoding: 'utf8'});
    const version = aboutCodeVersion;
    let headerId = null;
    let files_count = null;
    let dirs_count = null;
    let index = 0;
    let rootPath = null;
    let hasRootPath = false;
    const batchSize  = 1000;
    let files = [];
    let progress = 0;
    let promiseChain = this.sync;

    console.time('Load Database');
    return new Promise((resolve, reject) => {
      const that = this;
      stream
        .pipe(JSONStream.parse('files.*'))
        .on('header', (header) => {
          if ('headers' in header) {
            // FIXME: This should be smarter
            const header_data = header.headers[0];
            header = {
              scancode_notice: header_data.notice,
              scancode_version: header_data.tool_version,
              scancode_options: header_data.options,
              files_count: header_data.extra_data.files_count
            };
          }
          $.extend(header, {
            aboutcode_manager_version: version,
            aboutcode_manager_notice: 'Exported from AboutCode Manager and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nAboutCode Manager should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nAboutCode Manager is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/aboutcode-manager/ for support and download."'
          });
          files_count = header.files_count;
          promiseChain = promiseChain
            .then(() => this.db.Header.create(header))
            .then((result) => headerId = result.id);
        })
        .on('data', function(file) {
          if (!rootPath) {
            rootPath = file.path.split('/')[0];
            // Show error for scans missing file type information
            if (file.type === undefined) {
              reject(new AboutCodeDB.MissingFileInfoError());
            }
          }
          if (rootPath === file.path) {
            hasRootPath = true;
          }
          // TODO: When/if scancode reports directories in its header, this needs
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
              .then(() => that._batchCreateFiles(files, headerId))
              .then(() => {
                const currProgress = Math.round(index / (files_count + dirs_count) * 100);
                if (currProgress > progress) {
                  progress = currProgress;
                  onProgressUpdate(progress);
                  console.log('Progress: ' + `${progress}% ` +
                              `(${index}/(${files_count}+${dirs_count}))`);
                }
              })
              .then(() => {
                files = [];
                this.resume();
              })
              .catch((e) => reject(e));
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
              console.timeEnd('Load Database');
              resolve();
            }).catch((e) => reject(e));
        })
        .on('error', (e) => reject(e));
    });
  }

  _batchCreateFiles(files, headerId) {
    // Add batched files to the DB
    return this._addFlattenedFiles(files)
      .then(() => this._addFiles(files, headerId));
  }

  _addFlattenedFiles(files) {
    files = $.map(files, (file) => this.db.FlatFile.flatten(file));
    return this.db.FlatFile.bulkCreate(files, {logging: false});
  }

  _addFiles(files, headerId) {
    const transactionOptions = {
      logging: () => {},
      autocommit: false,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
    };
    return this.sequelize.transaction(transactionOptions, (t) => {
      const options = {
        logging: () => {},
        transaction: t
      };
      $.each(files, (i, file) => {
        file.parent = parentPath(file.path);
        file.headerId = headerId;
      });
      return this.db.File.bulkCreate(files, options)
        .then(() => this.db.License.bulkCreate(this._addExtraFields(files, 'licenses'), options))
        .then(() => this.db.LicenseExpression.bulkCreate(this._addExtraFields(files, 'license_expressions'), options))
        .then(() => this.db.Copyright.bulkCreate(this._addExtraFields(files, 'copyrights'), options))
        .then(() => this.db.Package.bulkCreate(this._addExtraFields(files, 'packages'), options))
        .then(() => this.db.Email.bulkCreate(this._addExtraFields(files, 'emails'), options))
        .then(() => this.db.Url.bulkCreate(this._addExtraFields(files, 'urls'), options))
        .then(() => this.sequelize.Promise.each(files, (file) => {
          if (file.conclusion) {
            return this.db.Conclusion.create(file.conclusion, options);
          }
        }));
    });
  }

  _addExtraFields(files, attribute) {
    return $.map(files, (file) => {
      if (attribute === 'copyrights') {
        return this._getNewCopyrights(file);
      }
      return $.map(file[attribute] || [], (value) => {
        if (attribute === 'license_expressions') {
          return {
            license_expression: value,
            fileId: file.id
          };
        }
        value.fileId = file.id;
        return value;
      });
    });
  }

  _getNewCopyrights(file) {
    const statements = file.copyrights;
    const holders = file.holders;
    const authors = file.authors;
    
    const newLines = [];
    const newStatements = [];
    if (Array.isArray(statements)) {
      statements.forEach((statement) => {
        const value = statement['value'];
        if (!value) {
          return;
        }
        newStatements.push(value);

        const line = {};
        line.start_line = statement['start_line'];
        line.end_line = statement['end_line'];
        newLines.push(line);
      });
    }
    
    const newHolders = [];
    if (Array.isArray(holders)) {
      holders.forEach((holder) => {
        const value = holder['value'];
        newHolders.push(value);
      });
    }

    const newAuthors = [];
    if (Array.isArray(authors)) {
      authors.forEach((author) => {
        const value = author['value'];
        newAuthors.push(value);
      });
    }

    const newCopyrights = [];
    for (let i = 0; i < newStatements.length; i++) {
      const newCopyright = {};
      newCopyright.statements = [newStatements[i]];
      newCopyright.holders = [newHolders[i]];
      // FIXME: this probably does not work correctly
      if (!newAuthors) {
        newCopyright.authors = [];
      } else {
        newCopyright.authors = newAuthors;
      }
      newCopyright.start_line = newLines[0].start_line;
      newCopyright.end_line = newLines[0].end_line;

      newCopyright.fileId = file.id;

      newCopyrights.push(newCopyright);
    }
    return newCopyrights;
  }
}

AboutCodeDB.MissingFileInfoError = class MissingFileInfoError extends Error {};

module.exports = AboutCodeDB;
