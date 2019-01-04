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

class Splitter {
  constructor(leftContainerId, rightContainerId) {
    this.handlers = {};

    this.splitSizes = [20, 80];
    this.splitter = Split(
      [leftContainerId, rightContainerId],
      {
        sizes: this.splitSizes,
        minSize: 200,
        gutterSize: 5,
        elementStyle: function (dimension, size, gutterSize) {
          const width = window.outerWidth * (size / 100);
          return {'flex-basis': `${width - gutterSize}px`};
        },
        gutterStyle: (dimension, gutterSize) => {
          return {'flex-basis': `${gutterSize}px`};
        },
        onDragEnd: () => {
          this.splitSizes = this.splitter.getSizes();
          this.handlers['drag-end']();
        }
      });
  }

  show() {
    this.splitter.setSizes(this.splitSizes);
    $('.gutter-horizontal').removeClass('div-hide').addClass('div-show');
  }

  hide() {
    $('.gutter-horizontal').removeClass('div-show').addClass('div-hide');
    this.splitter.collapse(0);
  }

  on(event, handler) {
    this.handlers[event] = handler;
    return this;
  }
}

module.exports = Splitter;
