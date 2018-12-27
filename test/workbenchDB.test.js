/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
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


const jsdom = require('jsdom');
const window = jsdom.jsdom().defaultView;
const $ = require('jquery')(window);
global.$ = $;

const fs = require('fs');
const chai = require('chai');
const assert = chai.assert;
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const WorkbenchDB = require('../assets/app/js/workbenchDB');

const SCANCODE_FILE = __dirname + '/data/scancode-results.json';
const DUPLICATE_PATH_FILE = __dirname + '/data/scancode-duplicate-path-values.json';

describe('checkWorkbenchDB', () => {
  describe('addFromJsonFile', () => {
    it('should add rows to database', () => {
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(SCANCODE_FILE))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 3))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount,1))
        .then(() => workbenchDB.db.Copyright.count())
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 1))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 2));
    });
    it('should load from a v2.2.1 scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.2.1-results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 27))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 0))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should load from a v2.9.0b1 scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.0b1-results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 28))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 0))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should load from a v2.9.1 scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.1-results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 28))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 0))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should load from a v2.9.2 scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.2-results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 29))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 0))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should load from a v2.9.2 license-expression scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.2-le-results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 29))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 29))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 0))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should load from a v2.9.2+ scancode result file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.2+results.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 44))
        .then(() => workbenchDB.db.License.count())
        .then((licenseCount) => assert.strictEqual(licenseCount, 29))
        .then(() => workbenchDB.db.LicenseExpression.count())
        .then((licenseExpressionCount) => assert.strictEqual(licenseExpressionCount, 28))
        .then(() => workbenchDB.db.Copyright.count())
        // 0 because of copyrigiht model change
        .then((copyrightCount) => assert.strictEqual(copyrightCount, 26))
        .then(() => workbenchDB.db.Package.count())
        .then((packageCount) => assert.strictEqual(packageCount, 1))
        .then(() => workbenchDB.db.Email.count())
        .then((emailCount) => assert.strictEqual(emailCount, 5))
        .then(() => workbenchDB.db.Url.count())
        .then((urlCount) => assert.strictEqual(urlCount, 30));
    });
    it('should get header information from a legacy scan file', () => {
      const test_file = __dirname + '/data/workbenchDB/legacy-header.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.Header.findOne({where: {id: 1}}))
        .then((header) => {
          assert.strictEqual(header.scancode_version, '2.9.2');
          assert.isNotNull(header.scancode_notice);
          assert.isNotNull(header.scancode_options);
        });
    });
    it('should get header information from a v2.9.8 scan file', () => {
      const test_file = __dirname + '/data/workbenchDB/2.9.8-header.json';
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.db.File.count())
        .then((rowCount) => assert.strictEqual(rowCount, 0))
        .then(() => workbenchDB.addFromJson(test_file))
        .then(() => workbenchDB.db.Header.findOne({where: {id: 1}}))
        .then((header) => {
          assert.strictEqual(header.scancode_version, '2.9.8');
          assert.isNotNull(header.scancode_notice);
          assert.isNotNull(header.scancode_options);
        });
    });
  });

  describe('getDuplicatePaths', () => {
    it('should throw SequelizeUniqueConstraintError error for duplicate path', () => {
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.addFromJson(DUPLICATE_PATH_FILE))
        .then(() => assert.fail(true, true, 'This code should not be called!'))
        .catch((e) => assert.equal(e.name, 'SequelizeUniqueConstraintError'));
    });
  });

  describe('findAll', () => {
    const results = JSON.parse(fs.readFileSync(SCANCODE_FILE, 'utf8'));
    it('should return all rows', () => {
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.addFromJson(SCANCODE_FILE))
        .then(() => workbenchDB.findAll({}))
        .then((rows) => {
          rows = rows.map((row) => row.toJSON());
          assert.containSubset(rows, results.files.splice(1,3));
        });
    });
  });

  describe('findOne', () => {
    const results = JSON.parse(fs.readFileSync(SCANCODE_FILE, 'utf8'));
    it('should return one', () => {
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.addFromJson(SCANCODE_FILE))
        .then(() => workbenchDB.findOne({
          where: { path: 'samples/JGroups/src'}
        }))
        .then((row) => {
          row = row.toJSON();
          assert.containSubset(row, results.files[1]);
        });
    });
  });

  describe('findAllJSTree', () => {
    it('should format ScanCode results to jsTree Format', () => {
      const workbenchDB = new WorkbenchDB();
      const expectedJSTreeFormat = [
        {
          id: 'samples/README',
          text: 'README',
          parent: 'samples',
          type: 'packageFile',
          children: false
        },
        {
          id: 'samples/JGroups/src',
          text: 'src',
          parent: 'samples/JGroups',
          type: 'directory',
          children: true
        },
        {
          children: true,
          id: 'samples',
          parent: '#',
          text: 'samples',
          type: 'directory'
        }
      ];

      return workbenchDB.sync
        .then(() => workbenchDB.addFromJson(SCANCODE_FILE))
        .then(() => workbenchDB.findAllJSTree())
        .then((results) => assert.deepEqual(expectedJSTreeFormat, results));
    });
  });

  describe('setConclusion', () => {
    it('should create a conclusion in Component Table', () => {
      const workbenchDB = new WorkbenchDB();
      const conclusion = {
        'license_expression': 'apache-1.1',
        'copyright': '(c) 2004 by Henrik Ravn',
        'copyrights': [
          {
            'statements': [
              '(c) 2004 by Henrik Ravn'
            ]
          }
        ],
        'path': 'samples',
        'review_status': 'attention',
        'name': 'samples',
        'version': '1.0',
        'owner': 'Jean-loup Gailly, Brian Raiter',
        'homepage_url': 'http://www.jboss.org/',
        'programming_language': 'C',
        'notes': ''
      };

      const conclusion2 = {
        'license_expression': 'zlib',
        'copyright': 'Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler',
        'copyrights': [
          {
            'statements': [
              'Copyright (c) 1995-2013 Jean-loup Gailly and Mark Adler'
            ]
          }
        ],
        'path': 'samples/zlib',
        'review_status': 'analyzed',
        'name': 'zlib',
        'version': '1.0',
        'owner': 'Jean-loup Gailly and Mark Adler',
        'homepage_url': 'http://www.zlib.net/',
        'programming_language': 'C#',
        'notes': ''
      };

      return workbenchDB.sync
        .then(() => workbenchDB.setConclusion(conclusion))
        .then(() => workbenchDB.db.Conclusion.count())
        .then((rowCount) => assert.strictEqual(rowCount, 1))
        .then(() => workbenchDB.findConclusion({
          where: { path: 'samples'}
        }))
        .then((row) => assert.containSubset(row.toJSON(), conclusion))
        .then(() => workbenchDB.setConclusion(conclusion2))
        .then(() => workbenchDB.db.Conclusion.count())
        .then((rowCount) => assert.strictEqual(rowCount, 2));
    });
  });

  describe('getFileCount', () => {
    it('should return the ScanCode files_count', () => {
      const workbenchDB = new WorkbenchDB();

      return workbenchDB.sync
        .then(() => workbenchDB.addFromJson(SCANCODE_FILE))
        .then(() => workbenchDB.getFileCount())
        .then((value) => {
          assert.strictEqual(value, 43);
        });
    });
  });
});
