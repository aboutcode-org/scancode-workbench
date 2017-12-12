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

class ComponentDialog {
    constructor(dialogId, aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;

        // Define DOM element constants for the modal dialog.
        // TODO: Use nested ids to avoid collisions, e.g. #nodeModal .nodeModalLabel
        this.dialog = $("#componentDialog");
        this.title = this.dialog.find(".modal-title");
        this.status = this.dialog.find("#component-status");
        this.name = this.dialog.find("#component-name");
        this.license = this.dialog.find("#component-license");
        this.owner = this.dialog.find("#component-owner");
        this.copyright = this.dialog.find("#component-copyright");
        this.deployed = this.dialog.find($("input[name=component-deployed]:checked").val());
        this.modified = this.dialog.find($("input[name=component-modified]:checked").val());
        this.codeType = this.dialog.find("#component-code-type");
        this.notes = this.dialog.find("#component-notes");
        this.feature = this.dialog.find("#component-feature");
        this.purpose = this.dialog.find("#component-purpose");
        this.language = this.dialog.find("#component-language");
        this.version = this.dialog.find("#component-version");
        this.homepageUrl = this.dialog.find("#component-homepage-url");
        this.downloadUrl = this.dialog.find("#component-download-url");
        this.licenseUrl = this.dialog.find("#component-license-url");
        this.noticeUrl = this.dialog.find("#component-notice-url");
        this.saveButton = this.dialog.find("button#component-save");
        this.deleteButton = this.dialog.find("button#component-delete");

        // Define the buttons that can be used to close the dialog.
        this.exitButton = this.dialog.find("button#component-exit");
        this.closeButton = this.dialog.find("button#component-close");

        // Make node view modal box draggable
        this.dialog.draggable({ handle: ".modal-header" });
        this.handlers = {};
        this.saveButton.click(() => this._saveComponent());
        this.deleteButton.click(() => this._deleteComponent());

        // Link each close button's click event to a method that checks for unsaved edits.
        this.exitButton.click(() => this._closeComponent());
        this.closeButton.click(() => this._closeComponent());
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    // Populate modal input fields with suggestions from ScanCode results
    show(componentId) {
        Promise.all(
            [
                this._component(componentId), this._licenses(componentId),
                this._copyrights(componentId), this._owners(componentId),
                this._language(componentId), this._homepageUrl(componentId)
            ])
            .then(([component, licenses, copyrights, owners, programming_languages, urls]) => {
                this._showDialog(component, {
                    id: componentId,
                    licenses: licenses,
                    copyrights: copyrights,
                    owners: owners,
                    programming_languages: programming_languages,
                    urls: urls
                });
            });
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
        return this;
    }

    on(event, handler) {
        this.handlers[event] = handler;
        return this;
    }

    _showDialog(component, data) {
        // Add clue data to the select menu options
        let licenses = data.licenses;
        let copyrights = data.copyrights;
        let owners = data.owners;
        let programming_languages = data.programming_languages;
        let urls = data.urls;

        // Add saved data to the select menu options
        licenses = licenses.concat(component.licenses || []);
        copyrights = copyrights.concat(component.copyrights || []);
        owners = owners.concat(component.owner || []);
        programming_languages = $.unique(programming_languages.concat(
            component.programming_language || []));
        urls =  $.unique(urls.concat(
            component.homepage_url || []));

        // update select2 selectors for node view component
        this.license.html('').select2({
            data: $.unique($.map(licenses, (license, i) => {
                return license.key;
            })),
            multiple: true,
            placeholder: "Enter license",
            tags: true
        }, true);

        this.owner.html('').select2({
            data: $.unique(owners),
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter owner",
            tags: true
        }, true);

        this.copyright.html('').select2({
            data: $.unique($.map(copyrights, (copyright, i) => {
                return copyright.statements;
            })),
            multiple: true,
            placeholder: "Enter copyright",
            tags: true
        }, true);

        this.codeType.html('').select2({
            data: component.code_type ? [component.code_type] : [],
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter code type",
            tags: true
        }, true);

        this.language.html('').select2({
            data: programming_languages,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter language",
            tags: true
        }, true);

        this.homepageUrl.html('').select2({
            data: urls,
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter Homepage URL",
            tags: true
        }, true);

        this.downloadUrl.html('').select2({
            data: component.download_url ? [component.download_url] : [],
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter Download URL",
            tags: true
        }, true);

        this.licenseUrl.html('').select2({
            data: component.license_url ? [component.license_url] : [],
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter License URL",
            tags: true
        }, true);

        this.noticeUrl.html('').select2({
            data: component.notice_url ? [component.notice_url] : [],
            multiple: true,
            maximumSelectionLength: 1,
            placeholder: "Enter Notice URL",
            tags: true
        }, true);

        this.status.val(component.review_status || "");
        this.name.val(component.name || "");
        this.version.val(component.version || "");
        this.license.val((component.licenses || [])
            .map((license) => license.key));
        this.owner.val(component.owner || []);
        this.copyright.val((component.copyrights || [])
            .map((copyright) => copyright.statements.join("\n")));
        this.codeType.val(component.code_type);
        if (component.is_modified !== null && component.is_modified !== undefined) {
            const modifiedValue = component.is_modified ? 'yes' : 'no';
            $(`input[name=component-modified][value='${modifiedValue}']`).prop("checked", true);
        } else {
            $("input[name=component-modified]").prop("checked", false);
        }
        if (component.is_deployed !== null && component.is_deployed !== undefined) {
            const deployedValue = component.is_deployed ? 'yes' : 'no';
            $(`input[name=component-deployed][value='${deployedValue}']`).prop("checked", true);
        } else {
            $("input[name=component-deployed]").prop("checked", false);
        }
        this.feature.val(component.feature);
        this.purpose.val(component.purpose);
        this.language.val(component.programming_language || []);
        this.homepageUrl.val(component.homepage_url || "");
        this.downloadUrl.val(component.download_url || "");
        this.licenseUrl.val(component.license_url || "");
        this.noticeUrl.val(component.notice_url || "");
        this.notes.val(component.notes || "");

        // Notify only select2 of changes
        $('select').trigger('change.select2');

        this.title.text(data.id);

        // Disable the ability to close the dialog by clicking outside
        // the dialog or pressing the escape key.
        this.dialog.modal({ backdrop: "static", keyboard: false });

        // Retrieve any previously-saved values -- use below in _closeComponent()
        // to compare with any new edits before closing the dialog.
        this.initialSerialization = this.dialog.find("form").serialize();

        this.dialog.modal('show');
    }

    // Check whether the user has made any new edits.
    _closeComponent() {
        // Retrieve the current form values, i.e., including edits not yet saved.
        this.currentSerialization = this.dialog.find("form").serialize();

        if (this.initialSerialization !== this.currentSerialization) {
            return confirm('Your new changes haven\'t been saved.  \n\nAre you sure you want to exit without saving?')
        }
    }

    _saveComponent() {
        let id = this.title.text();
        this._component(id)
            .then(component => {
                // Set the file id on the component.
                return this.aboutCodeDB.File
                    .findOne({
                        attributes: ["id"],
                        where: { path: { $eq: id } }
                    })
                    .then(row => {
                        component.fileId = row.id;
                        return component;
                    });
            })
            .then(component => {
                const modifiedValue = $("input[name=component-modified]:checked").val();
                const deployedValue = $("input[name=component-deployed]:checked").val();

                return {
                    path: id,
                    fileId: component.fileId,
                    review_status: this.status.val(),
                    name: this.name.val(),
                    licenses: $.map(this.license.val() || [], license => {
                        return { key: license };
                    }),
                    copyrights: $.map(this.copyright.val() || [], copyright => {
                        return { statements: copyright.split("\n") };
                    }),
                    code_type: (this.codeType.val() || [null])[0],
                    is_modified: modifiedValue ? (modifiedValue === "yes") : null,
                    is_deployed: deployedValue ? (deployedValue === "yes") : null,
                    version: this.version.val(),
                    owner: (this.owner.val() || [null])[0],
                    feature: this.feature.val(),
                    purpose: this.purpose.val(),
                    homepage_url: (this.homepageUrl.val() || [null])[0],
                    download_url: (this.downloadUrl.val() || [null])[0],
                    license_url: (this.licenseUrl.val() || [null])[0],
                    notice_url: (this.noticeUrl.val() || [null])[0],
                    programming_language: (this.language.val() || [null])[0],
                    notes: this.notes.val()
                };
            })
            .then(component => this.aboutCodeDB.setComponent(component))
            .then(component => this.handlers.save(component));
        this.dialog.modal('hide');
    }

    // Delete a created Component inside the Component Modal
    _deleteComponent() {
        let id = this.title.text();
        this.aboutCodeDB.findComponent({ where: { path: id }})
            .then(component => {
                if (component !== null) {
                    return component.destroy()
                        .then(() => this.handlers.delete(component));
                }
            });
    }

    _component(componentId) {
        return this.aboutCodeDB
            .findComponent({where: {path: componentId}})
            .then((component) => component ? component : {});
    }

    _licenses(componentId) {
        return this.aboutCodeDB.db
            .then(() => {
                return this.aboutCodeDB.File
                    .findAll({
                        attributes: [],
                        group: ['licenses.key'],
                        where: { path: {$like: `${componentId}%`}},
                        include: [{
                            model: this.aboutCodeDB.License,
                            attributes: ['key'],
                            where: {key: {$ne: null}}
                        }]
                    });
            })
            .then(rows => $.map(rows, row => row.licenses));
    }

    _copyrights(componentId) {
        return this.aboutCodeDB.db
            .then(() => {
                return this.aboutCodeDB
                    .File.findAll({
                        attributes: [],
                        group: ['copyrights.statements'],
                        where: {path: {$like: `${componentId}%`}},
                        include: [{
                            model: this.aboutCodeDB.Copyright,
                            attributes: ['statements'],
                            where: {statements: {$ne: null}}
                        }]
                    });
            })
            .then(rows => $.map(rows, row => row.copyrights));
    }

    _owners(componentId) {
        return this.aboutCodeDB.db
            .then(() => {
                return this.aboutCodeDB
                    .File.findAll({
                        attributes: [],
                        group: ['copyrights.holders'],
                        where: {path: {$like: `${componentId}%`}},
                        include: [{
                            model: this.aboutCodeDB.Copyright,
                            attributes: ['holders'],
                            where: {holders: {$ne: null}}
                        }]
                    });
            })
            .then(rows =>
                $.map(rows, row =>
                    $.map(row.copyrights, copyright => copyright.holders)));
    }

    _language(componentId) {
        return this.aboutCodeDB.db
            .then(() => {
                return this.aboutCodeDB
                    .File.findAll({
                        attributes: ["programming_language"],
                        group: ['programming_language'],
                        where: {
                            path: {$like: `${componentId}%`},
                            programming_language: {$ne: null}
                        }
                    });
            })
            .then(rows => $.map(rows, row => row.programming_language));
    }

    _homepageUrl(componentId) {
        return this.aboutCodeDB.db
            .then(() => {
                return this.aboutCodeDB
                    .File.findAll({
                        attributes: [],
                        group: ['urls.url'],
                        where: {path: {$like: `${componentId}%`}},
                        include: [{
                            model: this.aboutCodeDB.Url,
                            attributes: ['url'],
                            where: {url: {$ne: null}}
                        }]
                    });
            })
            .then(rows => $.map(rows, row => $.map(row.urls, url => url.url)));
    }
}

module.exports = ComponentDialog;