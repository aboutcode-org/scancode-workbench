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

 import Sequelize, { AbstractDataType } from 'sequelize';
import { parse } from 'license-expressions';

// Stores an object as a json string internally, but as an object externally
export type JSON_Type = AbstractDataType;
export function jsonDataType(attributeName: string) {
  return {
    type: Sequelize.STRING,
    get: function() {
      return JSON.parse(this.getDataValue(attributeName));
    },
    set: function(val: any) {
      return this.setDataValue(attributeName, JSON.stringify(val));
    }
  };
}

export function parentPath(path: string) {
  const splits = path.split('/');
  return splits.length === 1 ? '#' : splits.slice(0, -1).join('/');
}

export const LICENSE_EXPRESSIONS_CONJUNCTIONS = ['AND', 'OR', 'WITH'];

// @TODO - Needs more testing
export const parseSubExpressions = (expression: string) => {
  if(!expression || !expression.length)
    return [];
  const tokens = expression.split(/( |\(|\))/);
  const result = [];
  let currSubExpression = "";
  let popTokens = 0;
  for(const token of tokens){
    if(token === '('){
      if(popTokens)
        currSubExpression += '(';
      popTokens++;
    }
    else if(token === ')'){
      popTokens--;
      if(popTokens){
        currSubExpression += ')';
      }
      else {
        result.push(currSubExpression);
        currSubExpression = '';
      }
    } else {
      if(popTokens)
        currSubExpression += token;
      else {
        if(token.trim().length)
          result.push(token);
      }
    }
  }

  return result.filter(
    subExpression => subExpression.trim().length && 
      !LICENSE_EXPRESSIONS_CONJUNCTIONS.includes(subExpression.trim())
  );
};


// Test parseSubExpressions
// [
//   'apache-2.0 AND (mit AND json) AND (apache-2.0 AND bsd-simplified AND bsd-new AND cc0-1.0 AND cddl-1.0) AND (cddl-1.0 AND bsd-new) AND (bsd-new AND epl-2.0 AND elastic-license-v2) AND (bsd-new AND json AND lgpl-2.0 AND mit AND gpl-2.0 AND universal-foss-exception-1.0)',
//   'apache-2.0 AND cc0-1.0 AND mit AND (lgpl-2.1 AND bsd-new AND unknown-license-reference) AND bsd-new AND (mit AND apache-2.0 AND bsd-new) AND (ofl-1.1 AND mit AND cc-by-3.0) AND (mit AND cc0-1.0) AND (mit AND apache-2.0) AND (mit AND gpl-3.0) AND ((mit OR gpl-3.0) AND mit AND gpl-3.0) AND ofl-1.1 AND (ofl-1.1 AND proprietary-license) AND isc AND (bsd-new AND bsd-simplified) AND unknown AND (apache-2.0 AND isc) AND (apache-2.0 AND mit) AND ((gpl-2.0 WITH font-exception-gpl OR ofl-1.1) AND apache-2.0) AND (apache-2.0 AND bsd-new AND bsd-simplified AND cc-by-3.0 AND cc0-1.0 AND gpl-3.0 AND isc AND lgpl-2.1 AND mit AND ofl-1.1 AND unknown-license-reference AND other-copyleft AND other-permissive AND unknown)',
//   '(gpl-2.0 WITH font-exception-gpl OR ofl-1.1) AND apache-2.0',
//   'apache OR apache-2.0',
//   '(mit OR gpl-3.0) AND mit AND gpl-3.0',
//   'apache-2.0 AND (mit AND json)'
// ].map(key => {
//   console.log(key, parseSubExpressions(key), "\n");
// })



export function parseTokensFromExpression(expression: string){
  if(!expression)
    expression="";
  // const tokens = `(${expression})`.split(/( |\(|\))/);
  const tokens = expression.split(/( |\(|\))/);
  return tokens;
}

export function parseTokenKeysFromExpression(expression: string){
  if(!expression)
    expression="";
  const AVOID_KEYWORDS = new Set(['WITH', 'OR', 'AND', '(', ')']);
  const tokens = parseTokensFromExpression(expression);
  return tokens.filter(token => token.trim().length && token.length && !AVOID_KEYWORDS.has(token.trim()));
}
export function filterSpdxKeys(keys: string[]){
  const ignoredPrefixes = ["License-scancode-", "LicenseRef-scancode-"];
  return keys.filter(key => {
    for(let prefix of ignoredPrefixes){
      if(key.includes(prefix))
        return false;
    }
    return true;
  });
}



// To test 'license-expressions' library
function flattenIntoLicenseKeysUtil(parsedExpression: any, licenses: string[]){
  // LicenseInfo & ConjunctionInfo & LicenseRef
  if (parsedExpression.license){
    licenses.push(parsedExpression.license);
  }
  if(parsedExpression.licenseRef){
    licenses.push(parsedExpression.licenseRef);
  }
  if(parsedExpression.exception){
    licenses.push(parsedExpression.exception);
  }
  
  if (parsedExpression.conjunction) {
    flattenIntoLicenseKeysUtil(parsedExpression.left, licenses);
    if (parsedExpression.conjunction === 'or' || parsedExpression.conjunction === 'and') {
        flattenIntoLicenseKeysUtil(parsedExpression.right, licenses);
    }
  }
}
function parseKeysFromLibraryExpression(expression: string){
  const keys: string[] = [];
  flattenIntoLicenseKeysUtil(parse(expression, { upgradeGPLVariants: false, strictSyntax: false }), keys);
  return keys;
}


const TEST_LICENSE_EXPRESSIONS_PARSER = false;
const testCases = [
  "GPL-3.0+", "MIT OR (Apache-2.0 AND 0BSD)", "gpl-2.0-plus WITH ada-linking-exception",
  "zlib", "lgpl-2.1", "apache-1.1"   // not compatible for our use case
]
if(TEST_LICENSE_EXPRESSIONS_PARSER){
  testCases.forEach(expression => {
    // console.log(expression, { tokens: parseTokensFromExpression(expression), keys: parseTokenKeysFromExpression(expression)});
    console.log("Parsers", {
      expectedKeys: parseTokenKeysFromExpression(expression),
      parsedKeysUsingLibraryParser: parseKeysFromLibraryExpression(expression)
    });
  })
  // console.log(parse('GPL-3.0+'));
  // console.log(parse('apache-1.1', { strictSyntax: false, upgradeGPLVariants: false }));
  // console.log(parse('lgpl-2.1'));
}

