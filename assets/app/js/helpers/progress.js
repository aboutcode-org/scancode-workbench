/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
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

class Progress {
  constructor(elementId, options) {
    this.id = elementId;
    this.container = $(elementId);
    this.options = options || {};
  }

  showIndeterminate() {
    this._show(this._createProgressElement('indeterminate'));
  }

  showDeterminate() {
    this._show(this._createProgressElement('determinate'));
    this.progressBar = new ProgressBar
      .Circle(`${this.id} .determinate`, {
        color: '#3D7AFC',
        strokeWidth: 4,
        trailWidth: 1,
        step: function(state, circle) {
          const value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(`${value}%`);
          }
        }
      });
  }

  update(progress) {
    if (this.progressBar) {
      this.progressBar.animate(progress);
    }
  }

  hide() {
    if (this.progressContainer && this.container.parent().has(this.progressContainer)) {
      this.progressContainer.remove();
      this.progressContainer = null;
      this.container.removeClass('div-invisible');
    }
  }

  _show(progressBar) {
    if (!this.progressContainer) {
      this.progressContainer =
                this.container.clone().empty().append(progressBar);
      this.container.before(this.progressContainer);
      this.container.addClass('div-invisible');
    }
  }

  _createProgressElement(progressbarClass) {
    const progressElement = $(`<div class='progress'></div>`);
    if (this.options.title) {
      progressElement.append(
        `<h4 class='title'>${this.options.title || ''}</h4>
                 <div class='progressbar ${progressbarClass}'></div>`);
    } else {
      progressElement.append(
        `<div class='progressbar ${progressbarClass}'></div>`);
    }

    if (this.options.size) {
      progressElement.find('.progressbar').css({
        'width': `${this.options.size}px`,
        'height': `${this.options.size}px`
      });
    }
    return progressElement;
  }
}

module.exports = Progress;
