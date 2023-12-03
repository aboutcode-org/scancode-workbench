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

import Sequelize from "sequelize";
// eslint-disable-next-line import/no-unresolved
import { parseIfValidJson } from "../../utils/parsers";

// @TODO
// Store an object as a json string internally, but as an object externally
export type JSON_Type = string;
export function jsonDataType(attributeName: string, defaultValue: unknown) {
  return {
    type: Sequelize.STRING,
    defaultValue: JSON.stringify(defaultValue),
    get: function () {
      return parseIfValidJson(this.getDataValue(attributeName));
    },
    set: function (val: unknown) {
      return this.setDataValue(attributeName, JSON.stringify(val));
    },
  };
}

export function parentPath(path: string) {
  const splits = path.split("/");
  return splits.length === 1 ? "#" : splits.slice(0, -1).join("/");
}

export const LICENSE_EXPRESSIONS_CONJUNCTIONS = ["AND", "OR", "WITH"];

// @TODO - Needs more testing
export const parseSubExpressions = (expression: string) => {
  if (!expression || !expression.length) return [];
  const tokens = expression.split(/( |\(|\))/);
  const result = [];
  let currSubExpression = "";
  let popTokens = 0;
  for (const token of tokens) {
    if (token === "(") {
      if (popTokens) currSubExpression += "(";
      popTokens++;
    } else if (token === ")") {
      popTokens--;
      if (popTokens) {
        currSubExpression += ")";
      } else {
        result.push(currSubExpression);
        currSubExpression = "";
      }
    } else {
      if (popTokens) currSubExpression += token;
      else {
        if (token.trim().length) result.push(token);
      }
    }
  }

  return result.filter(
    (subExpression) =>
      subExpression.trim().length &&
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

export function parseTokensFromExpression(expression: string) {
  if (!expression) expression = "";
  const tokens = expression.split(/( |\(|\))/);
  return tokens;
}

export function parseTokenKeysFromExpression(expression: string) {
  if (!expression) expression = "";
  const AVOID_KEYWORDS = new Set(["WITH", "OR", "AND", "(", ")"]);
  const tokens = parseTokensFromExpression(expression);
  return tokens.filter(
    (token) =>
      token.trim().length && token.length && !AVOID_KEYWORDS.has(token.trim())
  );
}
export function filterSpdxKeys(keys: string[]) {
  const ignoredPrefixes = ["License-scancode-", "LicenseRef-scancode-"];
  return keys.filter((key) => {
    for (const prefix of ignoredPrefixes) {
      if (key.includes(prefix)) return false;
    }
    return true;
  });
}
