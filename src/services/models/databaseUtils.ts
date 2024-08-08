/*
 #
 # Copyright (c) nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/aboutcode-org/scancode-workbench/
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
// Store an object as a json string in DB, but expose as an object to APIs
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
