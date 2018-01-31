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
    return this.sync.then(db => db.Header.findOne({
      attributes: [
        'aboutcode_manager_notice',
        'aboutcode_manager_version'
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

  getFileCount() {
    return this.sync
      .then(db => db.Header.findOne({attributes: ['files_count']}))
      .then(count => count ? count.files_count : 0);
  }

  // Uses the components table to do a findAll query
  findAllComponents(query) {
    return this.sync.then(db => db.Component.findAll(query));
  }

  // Uses the components table to do a findOne query
  findComponent(query) {
    return this.sync.then(db => db.Component.findOne(query));
  }

  // Uses the components table to create or set a component
  setComponent(component) {
    return this.findComponent({ where: { path: component.path } })
      .then(dbComponent => {
        if (dbComponent) {
          return dbComponent.update(component);
        }
        else {
          return this.db.Component.create(component);
        }
      });
  }

  // Uses the files table to do a findOne query
  findOne(query) {
    query = $.extend(query, { include: this.db.fileIncludes });
    return this.sync.then(db => db.File.findOne(query));
  }

  // Uses the files table to do a findAll query
  findAll(query) {
    query = $.extend(query, { include: this.db.fileIncludes });
    return this.sync.then(db => db.File.findAll(query));
  }

  findAllUnique(path, field, subTable) {
    return this.sync
      .then(db => {
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
            .then(rows => $.map(rows, row => row[field]));
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
          .then(rows => $.map(rows, row => row[subTable.name]))
          .then(values => $.map(values, value => value[field]));
      });
  }

  // Uses findAll to return JSTree format from the File Table
  findAllJSTree(query) {
    query = $.extend(query, {
      attributes: ['path', 'parent', 'name', 'type']
    });
    return this.sync
      .then(db => db.File.findAll(query))
      .then(files => {
        return files.map((file) => {
          return {
            id: file.path,
            text: file.name,
            parent: file.parent,
            type: file.type,
            children: file.type === 'directory'
          };
        });
      });
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
        .on('header', header => {
          if ('header' in header) {
            header = header.header;
          }
          $.extend(header, {
            aboutcode_manager_version: version,
            aboutcode_manager_notice: 'Exported from AboutCode Manager and provided on an "AS IS" BASIS, WITHOUT WARRANTIES\\nOR CONDITIONS OF ANY KIND, either express or implied. No content created from\\nAboutCode Manager should be considered or used as legal advice. Consult an Attorney\\nfor any legal advice.\\nAboutCode Manager is a free software analysis application from nexB Inc. and others.\\nVisit https://github.com/nexB/aboutcode-manager/ for support and download."'
          });
          files_count = header.files_count;
          promiseChain = promiseChain
            .then(() => this.db.Header.create(header))
            .then(result => headerId = result.id);
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
          file.id = index++;
          files.push(file);
          if (files.length >= batchSize) {
            // Need to set a new variable before handing to promise
            this.pause();
            promiseChain = promiseChain
              .then(() => that._batchCreateFiles(files, headerId))
              .then(() => {
                const currProgress = Math.round(index / files_count * 100);
                if (currProgress > progress) {
                  progress = currProgress;
                  onProgressUpdate(progress);
                  console.log('Progress: ' + `${progress}% ` +
                              `(${index}/${files_count})`);
                }
              })
              .then(() => {
                files = [];
                this.resume();
              })
              .catch(e => reject(e));
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
        .on('error', e => reject(e));
    });
  }

  _batchCreateFiles(files, headerId) {
    // Add batched files to the DB
    return this._addFlattenedFiles(files)
      .then(() => this._addFiles(files, headerId));
  }

  _addFlattenedFiles(files) {
    files = $.map(files, file => this.db.FlatFile.flatten(file));
    return this.db.FlatFile.bulkCreate(files, {logging: false});
  }

  _addFiles(files, headerId) {
    const transactionOptions = {
      logging: () => {},
      autocommit: false,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
    };
    return this.sequelize.transaction(transactionOptions, t => {
      const options = {
        logging: () => {},
        transaction: t
      };
      $.each(files, (i, file) => {
        file.parent = parentPath(file.path);
        file.headerId = headerId;
      });
      return this.db.File.bulkCreate(files, options)
        .then(() => this.db.License.bulkCreate(this._addFileIds(files, 'licenses'), options))
        .then(() => this.db.Copyright.bulkCreate(this._addFileIds(files, 'copyrights'), options))
        .then(() => this.db.Package.bulkCreate(this._addFileIds(files, 'packages'), options))
        .then(() => this.db.Email.bulkCreate(this._addFileIds(files, 'emails'), options))
        .then(() => this.db.Url.bulkCreate(this._addFileIds(files, 'urls'), options))
        .then(() => this.sequelize.Promise.each(files, file => {
          if (file.component) {
            return this.db.Component.create(file.component, options);
          }
        }));
    });
  }

  _addFileIds(files, attribute) {
    return $.map(files, file => {
      return $.map(file[attribute] || [], value => {
        value.fileId = file.id;
        return value;
      });
    });
  }
}

AboutCodeDB.MissingFileInfoError = class MissingFileInfoError extends Error {};

module.exports = AboutCodeDB;