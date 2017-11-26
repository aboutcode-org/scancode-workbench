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

class Progress {
    constructor(elementId, options) {
        this.container = $(elementId);
        this.options = options;
    }

    show() {
        if (!this.progressContainer) {
            this.progress = $("<div>", {
                class: "progress"
            });
            this.progressTitle = $("<h4>", {
                text: this.options.title,
                class: "title"
            });
            this.progressIndicator = $("<div>", {
                class: "indicator"
            });

            this.progress
                .append(this.progressTitle)
                .append(this.progressIndicator);

            this.progressContainer =
                this.container.clone().empty().append(this.progress);

            this.container.before(this.progressContainer);
        }
    }

    hide() {
        if (this.progressContainer) {
            this.progressContainer.remove();
            this.progressContainer = null;
        }
    }
}

module.exports = Progress;