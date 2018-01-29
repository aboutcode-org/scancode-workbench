/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/aboutcode-manager/
 # The AboutCode Manager software is licensed under the Apache License version 2.0.
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


const globby = require('globby');
const { CLIEngine } = require('eslint');
const { assert } = require('chai');

// Runs over all of the ABCM JavaScript files
const files = globby.sync([
  __dirname + '/../assets/app/js/**/*.js',
  __dirname + '/**/*.js'
]);

const engine = new CLIEngine({
  envs: ['node', 'mocha'],
  useEslintrc: true,
});

const esLintResults = engine.executeOnFiles(files).results;

// Runs ESLint over all AboutCode Manager files and test files and outputs an
// for each failure
describe('ESLint', () => esLintResults.forEach(({ filePath, messages }) => {
  it(`validates ${filePath}`, () => {
    if (messages) {
      assert.fail(false, true, messages.map(formatError).join('\n'));
    }
  });
}));

function formatError(error) {
  return `${error.line}:${error.column} ${error.message.slice(0, -1)} - ${error.ruleId}`;
}