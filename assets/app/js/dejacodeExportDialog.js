/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # http://nexb.com and https://github.com/nexB/scancode-toolkit/
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

class DejaCodeExportDialog {
    constructor(dialogId, aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;

        // Get product name and version
        this.dialog = $(dialogId);
        this.productName = this.dialog.find("#product-name");
        this.productVersion = this.dialog.find("#product-version");
        this.apiUrl = this.dialog.find("#apiURLDejaCode");
        this.apiKey = this.dialog.find("#apiKey");
        this.submitButton = this.dialog.find("button#componentSubmit");
        this.submitButton.click(() => this._exportComponents());
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    show() {
        this.dialog.modal('show');
    }

    // Submit components to a DejaCode Product via ProductComponent API
    // TODO (@jdaguil): DejaCode doesn't require any field, but we probably
    // want to require name, version, and owner
    _exportComponents() {
        // Get product name and version
        const productName = this.productName.val();
        const productVersion = this.productVersion.val();
        const productNameVersion = productName.concat(":", productVersion);
        const apiUrl = this.apiUrl.val();
        const apiKey = this.apiKey.val();
        // Test whether any form field is empty
        if (productName === "" || productVersion === "" || apiUrl === "" || apiKey === "") {
            // TODO: change this to throw an error instead
            alert("Please make sure you complete all fields in the upload form.");
            return;
        }
        this.aboutCodeDB
            .findAllComponents({})
            .then(components => {
                // Converts array of components from AboutCode Manager to
                // DejaCode component format
                const dejaCodeComponents = $.map(components, component => {
                    return {
                        name: component.name,
                        version: component.version,
                        owner: component.owner,
                        license_expression: component.license_expression,
                        copyright: component.copyright,
                        homepage_url: component.homepage_url,
                        primary_language: component.programming_language,
                        reference_notes: component.notes,
                        product: productNameVersion
                    };
                });
                this._uploadComponents(apiUrl, apiKey, dejaCodeComponents);
            });
        this.dialog.modal('hide');
    }

    // Uses DejaCode API to create a component
    _createComponent(productComponentUrl, apiKey, component) {
        let headers = {
            'Authorization': 'Token ' + apiKey,
            'Accept': 'application/json; indent=4'
        };

        return $.ajax({
            type: 'POST',
            headers: headers,
            url: productComponentUrl,
            data: component
        });
    }


    // Upload created Components to a Product in DejaCode using the API
    _uploadComponents(host, apiKey, components) {
        let errorMessages = {};
        let requests = [];

        // Make individual requests to DejaCode to create each component
        $.each(components, function( index, component) {
            let request = $.Deferred();
            requests.push(request);
            this._createComponent(host, apiKey, component)
                .done(function (data) {
                    console.log('Successfully exported: ' + JSON.stringify(data));
                })
                .fail(function(error) {
                    console.log(error);
                    errorMessages[component.name] = error.responseText;
                })
                .complete(function () {
                    request.resolve();
                });
        });

        // This will be called when all requests finish.
        $.when.apply($, requests)
            .done(function () {
                if (Object.keys(errorMessages).length > 0) {
                    let msg = $.map(errorMessages, function(errorMessage, component) {
                        return component + ": " + errorMessage;
                    });
                    alert("The following errors occurred:\n" + msg.join("\n\n"));
                } else {
                    alert("Components submitted to DejaCode");
                }
            });
    }
}

module.exports = DejaCodeExportDialog;