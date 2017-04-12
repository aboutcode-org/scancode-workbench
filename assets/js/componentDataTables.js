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

class ComponentDataTable {
    constructor(tableID, aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
        this.dataTable = this._createDataTable(tableID);
        this.dataTable.buttons().container().attr({
            "id": "show-components",
            "data-toggle": "modal",
            "data-placement": "right",
            "title": "Upload Components to DejaCode",
            "data-target": "#componentExportModal"
        });
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    reload() {
        this.aboutCodeDB.findAllComponents({})
            .then((components) => {
                this.dataTable.clear();
                this.dataTable.rows.add(components);
                this.dataTable.draw();
            });
    }

    _createDataTable(tableID) {
        return $(tableID).DataTable({
            columns: ComponentDataTable.COLUMNS,
            dom: // Needed to keep datatables buttons and search inline
            "<'row'<'col-sm-9'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            buttons: [{
                name: "uploadDeja",
                text: '<i class=" fa fa-cloud-upload"></i> Upload Components'
            }],
            "language": {
                "emptyTable": "No Components created."
            }
        });
    }

    static get COLUMNS() {
        return [
            {
                data: "review_status",
                title: "Status",
                name: "status"
            },
            {
                data: "path",
                title: "Path",
                name: "path"
            },
            {
                data: "name",
                title: "Name",
                name: "name"
            },
            {
                data: "version",
                title: "Version",
                name: "version"
            },
            {
                data: "owner",
                title: "Owner",
                name: "owner",
                defaultContent: ""
            },
            {
                data: "licenses[<hr/>].short_name",
                title: "License",
                name: "license_expression",
                defaultContent: ""
            },
            {
                "data": "copyrights[<hr/>].statements[]",
                "title": "Copyright",
                "name": "copyright_statements"
            },
            {
                data: "programming_language",
                title: "Programming Language",
                name: "programming_language",
                defaultContent: ""
            },
            {
                "data": "homepage_url",
                "title": "Homepage URL",
                "name": "homepage_url",
                "defaultContent": "",
                "render": (href) => {
                    `<a href='${href}' target="_blank"> ${href}</a>`
                }
            },
            {
                data: "notes",
                title: "Notes",
                name: "notes",
                defaultContent: ""
            }
        ];
    }
}

module.exports = ComponentDataTable;
