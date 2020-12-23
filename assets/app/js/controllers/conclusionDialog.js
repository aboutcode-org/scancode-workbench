/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-toolkit/
 # The ScanCode software is licensed under the Apache License version 2.0.
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

const Controller = require('./controller');

/**
 * The view responsible for displaying the Conclusion modal dialog
 */
class ConclusionDialog extends Controller {
  constructor(dialogId, workbenchDB) {
    super(dialogId, workbenchDB);

    // Define DOM element constants for the modal dialog.
    // TODO: Use nested ids to avoid collisions, e.g. #nodeModal .nodeModalLabel
    this.dialog = this.element();
    this.title = this.dialog.find('.modal-title');
    this.status = this.dialog.find('#conclusion-status');
    this.name = this.dialog.find('#conclusion-name');
    this.license_expression = this.dialog.find('#conclusion-license-expression');
    this.owner = this.dialog.find('#conclusion-owner');
    this.copyright = this.dialog.find('#conclusion-copyright');
    this.deployed = this.dialog.find('input[name=conclusion-deployed]');
    this.modified = this.dialog.find('input[name=conclusion-modified]');
    this.codeType = this.dialog.find('#conclusion-code-type');
    this.notes = this.dialog.find('#conclusion-notes');
    this.feature = this.dialog.find('#conclusion-feature');
    this.purpose = this.dialog.find('#conclusion-purpose');
    this.language = this.dialog.find('#conclusion-language');
    this.version = this.dialog.find('#conclusion-version');
    this.homepageUrl = this.dialog.find('#conclusion-homepage-url');
    this.downloadUrl = this.dialog.find('#conclusion-download-url');
    this.licenseUrl = this.dialog.find('#conclusion-license-url');
    this.noticeUrl = this.dialog.find('#conclusion-notice-url');
    this.packageUrl = null;
    this.saveButton = this.dialog.find('button#conclusion-save');
    this.deleteButton = this.dialog.find('button#conclusion-delete');

    // Define the buttons that can be used to close the dialog.
    this.exitButton = this.dialog.find('button#conclusion-exit');
    this.closeButton = this.dialog.find('button#conclusion-close');

    // Make node view modal box draggable
    this.dialog.draggable({ handle: '.modal-header' });
    this.handlers = {};
    this.saveButton.click(() => this._saveConclusion());
    this.deleteButton.click(() => this._deleteConclusion());

    // Link each close button's click event to a method that checks for unsaved edits.
    this.exitButton.click(() => this._closeConclusion());
    this.closeButton.click(() => this._closeConclusion());

    // Enables tooltips for conclusion field labels
    $('[data-toggle="tooltip"]').tooltip();
  }

  // Check whether the user has made any new edits.
  _closeConclusion() {
    // Retrieve the current form values, i.e., including edits not yet saved.
    this.currentSerialization = this.dialog.find('form').serialize();

    if (this.initialSerialization !== this.currentSerialization) {
      return confirm('Your new changes haven\'t been saved.  \n\n' +
                'Are you sure you want to exit without saving?');
    }
  }

  _saveConclusion() {
    const path = this.title.text();
    this._conclusion(path)
      .then((conclusion) => {
        return this.db().db.File
          .findOne({
            attributes: ['id'],
            where: { path: { $eq: path } }
          })
          .then((row) => {
            // Set the file id on the conclusion.
            conclusion.fileId = row.id;
            return conclusion;
          });
      })
      .then((conclusion) => {
        const modifiedValue = $('input[name=conclusion-modified]:checked').val();
        const deployedValue = $('input[name=conclusion-deployed]:checked').val();

        return {
          path: path,
          fileId: conclusion.fileId,
          review_status: this.status.val(),
          name: this.name.val(),
          license_expression: $.map(this.license_expression.val() || [], (license_expression) => {
            return { license_expression: license_expression };
          }),
          copyrights: $.map(this.copyright.val() || [], (copyright) => {
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
          purl: this.packageUrl,
          programming_language: (this.language.val() || [null])[0],
          notes: this.notes.val()
        };
      })
      .then((conclusion) => this.db().setConclusion(conclusion))
      .then((conclusion) => this.getHandler('save')(conclusion));
    this.dialog.modal('hide');
    $('.jstree').jstree(true).refresh(true);
  }

  // Delete a created Conclusion inside the Conclusion Modal
  _deleteConclusion() {
    const id = this.title.text();
    this.db().findConclusion({ where: { path: id }})
      .then((conclusion) => {
        if (conclusion !== null) {
          return conclusion.destroy()
            .then(() => this.getHandler('delete')(conclusion));
        }
      });
    $('.jstree').jstree(true).refresh(true);
  }

  // Populate modal input fields with suggestions from ScanCode results
    show(path) {
        this._conclusion(path)
            .then((conclusion) => {
                this.title.text(path);
                return Promise.all([
                    this._setupStatus(conclusion),
                    this._setupName(conclusion),
                    this._setupVersion(conclusion),
                    this._setupLicenseExpression(conclusion),
                    this._setupCopyrights(conclusion),
                    this._setupOwners(conclusion),
                    this._setupLanguage(conclusion),
                    this._setupHomepageUrl(conclusion),
                    this._setupFeature(conclusion),
                    this._setupPurpose(conclusion),
                    this._setupCodeType(conclusion),
                    this._setupModified(conclusion),
                    this._setupDeployed(conclusion),
                    this._setupDownloadUrl(conclusion),
                    this._setupLicenseUrl(conclusion),
                    this._setupNoticeUrl(conclusion),
                    this._setupPackageUrl(conclusion),
                    this._setupNotes(conclusion)
                ]);
            })
            .then(() => {
                // Notify only select2 of changes
                $('select').trigger('change.select2');

                // Disable the ability to close the dialog by clicking outside
                // the dialog or pressing the escape key.
                this.dialog.modal({ backdrop: 'static', keyboard: false });

                // Retrieve any previously-saved values -- use below in _closeConclusion()
                // to compare with any new edits before closing the dialog.
                this.initialSerialization = this.dialog.find('form').serialize();

                this.dialog.modal('show');
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
  }

  _conclusion(path) {
    return this.db()
      .findConclusion({ where: { path: path } })
    // if the conclusion doesn't exist return an object with only the path
      .then((conclusion) => conclusion ? conclusion : { path: path });
  }

  _setupLicenseExpression(conclusion) {
    const saved = (conclusion.license_expression || []).map((license_expression) => license_expression);
    return this._licenseExpressionQuery(conclusion.path, 'license_expression')
      .then((license_expressions) => license_expressions.concat(saved))
      .then((license_expressions) => {
        this.license_expression.html('').select2({
          data: $.unique(license_expressions),
          multiple: true,
          placeholder: 'Enter Expression',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any license expressions in the scan that applies to ${conclusion.path}`);
              }
          }
        }, true);
        this.license_expression.val(saved);
      });
  }

  _setupCopyrights(conclusion) {
    const saved = $.map((conclusion.copyrights || []), (copyright) => {
      return copyright.statements;
    });
    return this._copyrightQuery(conclusion.path, 'statements')
      .then((copyright_statements) => copyright_statements.concat(saved))
      .then((copyright_statements) => {
        this.copyright.html('').select2({
          data: $.unique(copyright_statements),
          multiple: true,
          placeholder: 'Enter copyright',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any copyright statements in the scan pertaining to ${conclusion.path}`);
              }
          }
        }, true);
        this.copyright.val(saved);
      });
  }

  _setupOwners(conclusion) {
    const saved = conclusion.owner || [];
    return this._copyrightQuery(conclusion.path, 'holders')
      .then((owners) => owners.concat(saved))
      .then((owners) => {
        this.owner.html('').select2({
          data: $.unique(owners),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter owner',
          tags: true,
          language: {
                "noResults": function () {
                    return (`SCWB did not find any owners in the scan for ${conclusion.path}`);
                }
           }
        }, true);
        this.owner.val(saved);
      });
  }

  _setupLanguage(conclusion) {
    const saved = conclusion.programming_language || [];
    return this.db()
      .findAllUnique(conclusion.path, 'programming_language')
      .then((languages) => languages.concat(saved))
      .then((languages) => {
        this.language.html('').select2({
          data: $.unique(languages),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter language',
          tags: true,
          language: {
               "noResults": function () {
                   return (`SCWB did not find any primary programming languages in the scan associated with ${conclusion.path}`);
               }
          }
        }, true);
        this.language.val(saved);
      });
  }

  _setupCodeType(conclusion) {
    const saved = conclusion.code_type || [] ;
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

  _setupHomepageUrl(conclusion) {
    const saved = conclusion.homepage_url || [];
    return this._urlQuery(conclusion.path, 'url')
      .then((homepage_urls) => homepage_urls.concat(saved))
      .then((homepage_urls) => {
        this.homepageUrl.html('').select2({
          data: $.unique(homepage_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Homepage URL',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any Homepage URL in the scan for ${conclusion.path}`);
              }
          }
        }, true);
        this.homepageUrl.val(saved);
      });
  }

  _setupDownloadUrl(conclusion) {
    const saved = conclusion.download_url || [];
    return Promise.all([
      this._urlQuery(conclusion.path, 'url'),
      this._packageQuery(conclusion.path, 'download_url'),
    ])
      .then((rows) => $.map(rows, (row) => row))
      .then((download_urls) => download_urls.concat(saved))
      .then((download_urls) => {
        this.downloadUrl.html('').select2({
          data: $.unique(download_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Download URL',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any download URL in the scan for obtaining ${conclusion.path}`);
              }
          }
        }, true);
        this.downloadUrl.val(saved);
      });
  }

  _setupLicenseUrl(conclusion) {
    const saved = conclusion.license_url || [];
    return Promise.all([
      this._licenseQuery(conclusion.path, 'homepage_url'),
      this._licenseQuery(conclusion.path, 'text_url'),
      this._licenseQuery(conclusion.path, 'reference_url'),
      this._licenseQuery(conclusion.path, 'spdx_url')
    ])
      .then((rows) => $.map(rows, (row) => row))
      .then((licenese_urls) => licenese_urls.concat(saved))
      .then((licenese_urls) => {
        this.licenseUrl.html('').select2({
          data: $.unique(licenese_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter License URL',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any License url in the scan for ${conclusion.path}`);
              }
          }
        }, true);
        this.licenseUrl.val(saved);
      });
  }

  _setupNoticeUrl(conclusion) {
    const saved = conclusion.notice_url || [];
    return this._licenseQuery(conclusion.path, 'text_url')
      .then((notice_urls) => notice_urls.concat(saved))
      .then((notice_urls) => {
        this.noticeUrl.html('').select2({
          data: $.unique(notice_urls),
          multiple: true,
          maximumSelectionLength: 1,
          placeholder: 'Enter Notice URL',
          tags: true,
          language: {
              "noResults": function () {
                  return (`SCWB did not find any Notice URL in the scan for ${conclusion.path}`);
              }
          }
        }, true);
        this.noticeUrl.val(saved);
      });
  }

  _setupPackageUrl(conclusion) {
    return this.db().sync
      .then((db) => db.File.findOne({where: {path: conclusion.path}}))
      .then((file) => this.db().sync
        .then((db) => db.Package.findOne({where: {fileId: file.id}}))
        .then((pkg) => {
          if (pkg) {
            this.packageUrl = pkg.purl;
          }
        }));
  }

  _setupModified(conclusion) {
    if (conclusion.is_modified !== null && conclusion.is_modified !== undefined) {
      const modifiedValue = conclusion.is_modified ? 'yes' : 'no';
      $(`input[name=conclusion-modified][value='${modifiedValue}']`)
        .prop('checked', true);
    } else {
      this.modified.prop('checked', false);
    }
  }

  _setupDeployed(conclusion) {
    if (conclusion.is_deployed !== null && conclusion.is_deployed !== undefined) {
      const deployedValue = conclusion.is_deployed ? 'yes' : 'no';
      $(`input[name=conclusion-deployed][value='${deployedValue}']`)
        .prop('checked', true);
    } else {
      this.deployed.prop('checked', false);
    }
  }

  _setupStatus(conclusion) {
    this.status.val(conclusion.review_status || '');
  }

  _setupName(conclusion) {
    this.name.val(conclusion.name || '');
  }

  _setupVersion(conclusion) {
    this.version.val(conclusion.version || '');
  }

  _setupFeature(conclusion) {
    this.feature.val(conclusion.feature || '');
  }

  _setupPurpose(conclusion) {
    this.purpose.val(conclusion.purpose || '');
  }

  _setupNotes(conclusion) {
    this.notes.val(conclusion.notes || '');
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

  _licenseExpressionQuery(path, field) {
    return this.db().findAllUnique(path, field, this.db().db.LicenseExpression);
  }
}

module.exports = ConclusionDialog;