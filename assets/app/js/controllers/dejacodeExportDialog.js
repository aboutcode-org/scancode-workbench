/*
 #
 # Copyright (c) 2019 nexB Inc. and others. All rights reserved.
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

const Progress = require('../helpers/progress');
const Controller = require('./controller');
const dialog = require('electron').remote.dialog;

/**
 * The view responsible for displaying the DejaCode Conclusion Export dialog
 */
class DejaCodeExportDialog extends Controller {
  constructor(dialogId, workbenchDB) {
    super(dialogId, workbenchDB);

    // Get product name and version
    this.dialog = this.element();
    this.productName = this.dialog.find('#product-name');
    this.productVersion = this.dialog.find('#product-version');
    this.apiUrl = this.dialog.find('#apiURLDejaCode');
    this.apiKey = this.dialog.find('#apiKey');
    this.submitButton = this.dialog.find('button#conclusionSubmit');
    this.submitButton.click(() => this._exportConclusions());
    this.progressBar = new Progress('#tab-conclusion .conclusions-table-container',
      {
        title: 'Uploading Conclusions ... ',
        size: 100
      });
  }

  show() {
    this.dialog.modal('show');
  }

  // Submit conclusions to a DejaCode Product via ProductComponent API
  // TODO (@jdaguil): DejaCode doesn't require any field, but we probably
  // want to require name, version, and owner
  _exportConclusions() {
    this.progressBar.showIndeterminate();
    return this.db().sync
      .then(() => this.db().findAllConclusions({}))
      .then((conclusions) => {
        // Get product name and version
        const productName = this.productName.val();
        const productVersion = this.productVersion.val();
        const productNameVersion = productName.concat(':', productVersion);
        const apiUrl = this.apiUrl.val();
        const apiKey = this.apiKey.val().trim();

        // Test whether any form field is empty
        if (productName === '' || apiUrl === '' || apiKey === '') {
          throw new Error('Please make sure you complete all fields in the upload form.');
        }

        this.dialog.modal('hide');

        // Converts array of conclusions from ScanCode Workbench to
        // DejaCode component format
        const dejaCodeComponents = $.map(conclusions, (conclusion) => {
          return {
            name: conclusion.name,
            version: conclusion.version,
            owner: conclusion.owner,
            // Fix for #403. TODO: clean this up
            license_expression: conclusion.license_expression.shift().license_expression,
            copyright: conclusion.copyright,
            is_deployed: conclusion.is_deployed,
            is_modified: conclusion.is_modified,
            homepage_url: conclusion.homepage_url,
            primary_language: conclusion.programming_language,
            reference_notes: conclusion.notes,
            feature: conclusion.feature,
            purpose: conclusion.purpose,
            product: productNameVersion
          };
        });
        return this._uploadConclusions(apiUrl, apiKey, dejaCodeComponents);
      })
      .then(() => this.progressBar.hide())
      // TODO: throw an exception and handle this in render with
      // dialog.showErrorBox
      .then(() => alert('Conclusions submitted to DejaCode'))
      .catch((err) => {
        this.progressBar.hide();
        console.log(err);
        dialog.showErrorBox('Dejacode Upload Error', err.toString());
        throw err;
      });
  }

  // Upload created Components to a Product in DejaCode using the API
  _uploadConclusions(host, apiKey, components) {
    const errors = [];

    // Make individual requests to DejaCode to create each component
    const requests = $.map(components, (component) => {
      return this._createComponent(host, apiKey, component)
        .catch((err) => {
          errors.push(JSON.stringify({
            component_name: component.name,
            error_status: `${err.status} (${err.statusText})`,
            error: err.responseJSON
          }, null, 2));
        });
    });

    // This will be called when all requests finish.
    return Promise.all(requests)
      .then(() => {
        if (Object.keys(errors).length > 0) {
          throw new Error(
            'The following errors occurred:\n' + errors.join('\n\n'));
        }
      });
  }

  // Uses DejaCode API to create a component
  _createComponent(productComponentUrl, apiKey, component) {
    const headers = {
      'Authorization': 'Token ' + apiKey,
      'Accept': 'application/json; indent=4'
    };

    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        headers: headers,
        url: productComponentUrl,
        data: component,
      })
        .done((data) => resolve(data))
        .fail((err) => reject(err));
    });
  }
}

module.exports = DejaCodeExportDialog;
