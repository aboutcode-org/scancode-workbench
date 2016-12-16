/*
 #
 # Copyright (c) 2016 nexB Inc. and others. All rights reserved.
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


// Converts array of components from AboutCode Manager to DejaCode component
// format
toDejaCodeFormat = function(components) {
    return $.map(components, function(component, index) {
        var name = component['name'];

        if (!name) {
            throw new Error('Name required for component.');
        }

        var owner = component['party']['name'];

        if (!owner) {
            throw new Error('Owner required for component: ' + name);
        }

        var license_expression = component['license_expression'];

        if (!license_expression) {
            throw new Error('License expression required for component: '
                + name);
        }

        var newComponent = {
            name: name,
            version: component['version'],
            license_expression: license_expression,
            owner: owner,
            // DejaCode API expects a single copyright
            copyright: component['copyrights'].join('\n')
        };

        if ('homepage_url' in component) {
            newComponent.homepage_url = component['homepage_url'];
        }

        if ('programming_language' in component) {
            newComponent.primary_language = component['programming_language'];
        }

        if ('notes' in component) {
            newComponent.reference_notes = component['notes'];
        }
        return newComponent;
    })
}

module.exports = toDejaCodeFormat;


// Uses DejaCode API to create a component
function createComponent (productComponentUrl, component, apiKey) {
    var headers = {
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
function uploadComponents(host, components, apiKey, productNameVersion) {
    var dejaCodeComponents = toDejaCodeFormat(components);

    $.each(dejaCodeComponents, function (index, component) {
       component['product'] = productNameVersion;
    })

    $.each(dejaCodeComponents, function( index, component ) {
        createComponent(host, component, apiKey)
            .done(function (data) {
                console.log('Successfully exported: ' + JSON.stringify(data));
            })
            .fail(function(error) {
                console.log(error);
            });
    });
}