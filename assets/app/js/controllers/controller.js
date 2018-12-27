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

/**
 * Handles basic logic for a controller
 *
 * @param elementId The id of the associated html element
 * @param workbenchDB The initial database used for the view
 */
class Controller {
  constructor(elementId, workbenchDB) {
    this._id = elementId;
    this._element = $(elementId);
    this._workbenchDB = this.db(workbenchDB);

    this._handlers = {};
  }

  /**
   * Returns the id of the HTML element
   */
  id() {
    return this._id;
  }

  /**
   * Returns the HTML element as a jQuery object
   */
  element() {
    return this._element;
  }

  /**
   * Sets a handler for an event.
   *
   * @param event the event name
   * @param handler the function that handles the event
   */
  on(event, handler) {
    this._handlers[event] = handler;
    return this;
  }

  /**
   * Returns the handler for the event
   *
   * @param event the event name
   */
  getHandler(event) {
    return this._handlers[event] || (() => {});
  }

  /**
   * Returns the WorkbenchDB for this view or sets the WorkbenchDB if passed
   * in as a parameter
   *
   * @param workbenchDB the WorkbenchDB instance to set (optional)
   */
  db(workbenchDB) {
    if (workbenchDB !== undefined) {
      this._workbenchDB = workbenchDB;
      this.needsReload(true);
    }

    return this._workbenchDB;
  }

  /**
   * Returns the selected file path associated with this view or sets the
   * selected path if passed in as a parameter
   *
   * @param path the selected path to set
   */
  selectedPath(path) {
    if (path !== undefined) {
      this._selectedPath = path;
      this.needsReload(true);
    }
    return this._selectedPath;
  }

  /**
   * Returns true if the view needs to be reloaded or sets the boolean if
   * passed in as parameter
   *
   * @param value the boolean value to set the needs reload flag
   */
  needsReload(value) {
    if (value !== undefined) {
      this._needsReload = value;
    }
    return this._needsReload;
  }
}

module.exports = Controller;
