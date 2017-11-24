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


// Uses DejaCode API to create a component
function createComponent (productComponentUrl, component, apiKey) {
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
function uploadComponents(host, components, apiKey) {
    let errorMessages = {};
    let requests = [];

    // Make individual requests to DejaCode to create each component
    $.each(components, function( index, component) {
        let request = $.Deferred();
        requests.push(request);
        createComponent(host, component, apiKey)
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

module.exports = {
  uploadComponents: uploadComponents
};