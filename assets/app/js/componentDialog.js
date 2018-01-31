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

const View = require('./helpers/view');

/**
 * The view responsible for displaying the Component modal dialog
 */
class ComponentDialog extends View {
  constructor(dialogId, aboutCodeDB) {
    super(dialogId, aboutCodeDB);

    // Define DOM element constants for the modal dialog.
    // TODO: Use nested ids to avoid collisions, e.g. #nodeModal .nodeModalLabel
    this.dialog = this.element();
    this.title = this.dialog.find('.modal-title');
    this.status = this.dialog.find('#component-status');
    this.name = this.dialog.find('#component-name');
    this.license = this.dialog.find('#component-license');
    this.owner = this.dialog.find('#component-owner');
    this.copyright = this.dialog.find('#component-copyright');
    this.deployed = this.dialog.find('input[name=component-deployed]');
    this.modified = this.dialog.find('input[name=component-modified]');
    this.codeType = this.dialog.find('#component-code-type');
    this.notes = this.dialog.find('#component-notes');
    this.feature = this.dialog.find('#component-feature');
    this.purpose = this.dialog.find('#component-purpose');
    this.language = this.dialog.find('#component-language');
    this.version = this.dialog.find('#component-version');
    this.homepageUrl = this.dialog.find('#component-homepage-url');
    this.downloadUrl = this.dialog.find('#component-download-url');
    this.licenseUrl = this.dialog.find('#component-license-url');
    this.noticeUrl = this.dialog.find('#component-notice-url');
    this.saveButton = this.dialog.find('button#component-save');
    this.deleteButton = this.dialog.find('button#component-delete');

    // Define the buttons that can be used to close the dialog.
    this.exitButton = this.dialog.find('button#component-exit');
    this.closeButton = this.dialog.find('button#component-close');

    // Make node view modal box draggable
    this.dialog.draggable({ handle: '.modal-header' });
    this.handlers = {};
    this.saveButton.click(() => this._saveComponent());
    this.deleteButton.click(() => this._deleteComponent());

    // Link each close button's click event to a method that checks for unsaved edits.
    this.exitButton.click(() => this._closeComponent());
    this.closeButton.click(() => this._closeComponent());

    // Enables tooltips for component field labels
    $('[data-toggle="tooltip"]').tooltip();
  }

  // Check whether the user has made any new edits.
  _closeComponent() {
    // Retrieve the current form values, i.e., including edits not yet saved.
    this.currentSerialization = this.dialog.find('form').serialize();

    if (this.initialSerialization !== this.currentSerialization) {
      return confirm('Your new changes haven\'t been saved.  \n\n' +
                'Are you sure you want to exit without saving?');
    }
  }

  _saveComponent() {
    const path = this.title.text();
    this._component(path)
      .then(component => {
        return this.db().db.File
          .findOne({
            attributes: ['id'],
            where: { path: { $eq: path } }
          })
          .then(row => {
            // Set the file id on the component.
            component.fileId = row.id;
            return component;
          });
      })
      .then(component => {
        const modifiedValue = $('input[name=component-modified]:checked').val();
        const deployedValue = $('input[name=component-deployed]:checked').val();

        return {
          path: path,
          fileId: component.fileId,
          review_status: this.status.val(),
          name: this.name.val(),
          licenses: $.map(this.license.val() || [], license => {
            return { key: license };
          }),
          copyrights: $.map(this.copyright.val() || [], copyright => {
            return { statements: copyright.split('\n') };
          }),
          code_type: (this.codeType.val() || [null])[0],
          is_modified: modifiedValue ? (modifiedValue === 'yes') : null,
          is_deployed: deployedValue ? (deployedValue === 'yes') : null,
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
      .then(component => this.db().setComponent(component))
      .then(component => this.getHandler('save')(component));
    this.dialog.modal('hide');
  }

  // Delete a created Component inside the Component Modal
  _deleteComponent() {
    const id = this.title.text();
    this.db().findComponent({ where: { path: id }})
      .then(component => {
        if (component !== null) {
          return component.destroy()
            .then(() => this.getHandler('delete')(component));
        }
      });
  }

  // Populate modal input fields with suggestions from ScanCode results
  show(path) {
    this._component(path)
      .then(component => {
        this.title.text(path);
        return Promise.all([
          this._setupStatus(component),
          this._setupName(component),
          this._setupVersion(component),
          this._setupLicenses(component),
          this._setupCopyrights(component),
          this._setupOwners(component),
          this._setupLanguage(component),
          this._setupHomepageUrl(component),
          this._setupFeature(component),
          this._setupPurpose(component),
          this._setupCodeType(component),
          this._setupModified(component),
          this._setupDeployed(component),
          this._setupDownloadUrl(component),
          this._setupLicenseUrl(component),
          this._setupNoticeUrl(component),
          this._setupNotes(component)
        ]);
      })
      .then(() => {
        // Notify only select2 of changes
        $('select').trigger('change.select2');

        // Disable the ability to close the dialog by clicking outside
        // the dialog or pressing the escape key.
        this.dialog.modal({ backdrop: 'static', keyboard: false });

        // Retrieve any previously-saved values -- use below in _closeComponent()
        // to compare with any new edits before closing the dialog.
        this.initialSerialization = this.dialog.find('form').serialize();

        this.dialog.modal('show');
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  }

  _component(path) {
    return this.db()
      .findComponent({ where: { path: path } })
    // if the component doesn't exist return an object with only the path
      .then(component => component ? component : { path: path });
  }

  _setupLicenses(component) {
    const saved = (component.licenses || []).map(license => license.key);
    return this._licenseQuery(component.path, 'key')
      .then(license_keys => license_keys.concat(saved))
      .then(license_keys => {
        this.license.html('').select2({
          data: $.unique(license_keys),
          multiple: true,
          placeholder: 'Enter license',
          tags: true
        }, true);
        this.license.val(saved);
      });
  }

  _setupCopyrights(component) {
    const saved = $.map((component.copyrights || []), copyright => {
      return copyright.statements;
    });
    return this._copyrightQuery(component.path, 'statements')
      .then(copyright_statements => copyright_statements.concat(saved))
      .then(copyright_statements => {
        this.copyright.html('').select2({
          data: $.unique(copyright_statements),
          multiple: true,
          placeholder: 'Enter copyright',
          tags: true
        }, true);
        this.copyright.val(saved);
      });
  }

  _setupOwners(component) {
    const saved = component.owner || [];
    return this._copyrightQuery(component.path, 'holders')
      .then(owners => owners.concat(saved))
      .then(owners => {
        this.owner.html('').select2({
          data: $.unique(owners),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter owner',
          tags: true
        }, true);
        this.owner.val(saved);
      });
  }

  _setupLanguage(component) {
    const saved = component.programming_language || [];
    return this.db()
      .findAllUnique(component.path, 'programming_language')
      .then(languages => languages.concat(saved))
      .then(languages => {
        this.language.html('').select2({
          data: $.unique(languages),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter language',
          tags: true
        }, true);
        this.language.val(saved);
      });
  }

  _setupCodeType(component) {
    const saved = component.code_type || [] ;
    const codeTypes = ['Source', 'Binary', 'Mixed', 'Document'].concat(saved);
    this.codeType.html('').select2({
      data: $.unique(codeTypes),
      multiple: true,
      maximumSelectionLength: 1,
      placeholder: 'Enter code type',
      tags: true
    }, true);
    this.codeType.val(saved);
  }

  _setupHomepageUrl(component) {
    const saved = component.homepage_url || [];
    return this._urlQuery(component.path, 'url')
      .then(homepage_urls => homepage_urls.concat(saved))
      .then(homepage_urls => {
        this.homepageUrl.html('').select2({
          data: $.unique(homepage_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Homepage URL',
          tags: true
        }, true);
        this.homepageUrl.val(saved);
      });
  }

  _setupDownloadUrl(component) {
    const saved = component.download_url || [];
    return Promise.all([
      this._urlQuery(component.path, 'url'),
      this._packageQuery(component.path, 'download_urls'),
    ])
      .then(rows => $.map(rows, row => row))
      .then(download_urls => download_urls.concat(saved))
      .then(download_urls => {
        this.downloadUrl.html('').select2({
          data: $.unique(download_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Download URL',
          tags: true
        }, true);
        this.downloadUrl.val(saved);
      });
  }

  _setupLicenseUrl(component) {
    const saved = component.license_url || [];
    return Promise.all([
      this._licenseQuery(component.path, 'homepage_url'),
      this._licenseQuery(component.path, 'text_url'),
      this._licenseQuery(component.path, 'reference_url'),
      this._licenseQuery(component.path, 'spdx_url')
    ])
      .then(rows => $.map(rows, row => row))
      .then(licenese_urls => licenese_urls.concat(saved))
      .then(licenese_urls => {
        this.licenseUrl.html('').select2({
          data: $.unique(licenese_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter License URL',
          tags: true
        }, true);
        this.licenseUrl.val(saved);
      });
  }

  _setupNoticeUrl(component) {
    const saved = component.notice_url || [];
    return this._licenseQuery(component.path, 'text_url')
      .then(notice_urls => notice_urls.concat(saved))
      .then(notice_urls => {
        this.noticeUrl.html('').select2({
          data: $.unique(notice_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Notice URL',
          tags: true
        }, true);
        this.noticeUrl.val(saved);
      });
  }

  _setupModified(component) {
    if (component.is_modified !== null && component.is_modified !== undefined) {
      const modifiedValue = component.is_modified ? 'yes' : 'no';
      $(`input[name=component-modified][value='${modifiedValue}']`)
        .prop('checked', true);
    } else {
      this.modified.prop('checked', false);
    }
  }

  _setupDeployed(component) {
    if (component.is_deployed !== null && component.is_deployed !== undefined) {
      const deployedValue = component.is_deployed ? 'yes' : 'no';
      $(`input[name=component-deployed][value='${deployedValue}']`)
        .prop('checked', true);
    } else {
      this.deployed.prop('checked', false);
    }
  }

  _setupStatus(component) {
    this.status.val(component.review_status || '');
  }

  _setupName(component) {
    this.name.val(component.name || '');
  }

  _setupVersion(component) {
    this.version.val(component.version || '');
  }

  _setupFeature(component) {
    this.feature.val(component.feature || '');
  }

  _setupPurpose(component) {
    this.purpose.val(component.purpose || '');
  }

  _setupNotes(component) {
    this.notes.val(component.notes || '');
  }

  _copyrightQuery(path, field) {
    return this.db().findAllUnique(path, field, this.db().db.Copyright);
  }

  _urlQuery(path, field) {
    return this.db().findAllUnique(path, field, this.db().db.Url);
  }

  _packageQuery(path, field) {
    return this.db().findAllUnique(path, field, this.db().db.Package);
  }

  _licenseQuery(path, field) {
    return this.db().findAllUnique(path, field, this.db().db.License);
  }
}

module.exports = ComponentDialog;