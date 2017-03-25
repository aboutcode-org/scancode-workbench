/*
 #
 # Copyright (c) 2017 nexB Inc. and others. All rights reserved.
 # http://nexb.com and https://github.com/nexB/aboutcode-manager/
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

function AboutCodeNodeView(aboutCodeDB, onNodeClicked){
    this.aboutCodeDB = aboutCodeDB;

    // Clear the nodeview DOM element if one already exists.
    $("#nodeview").empty();
    this.nodeView = createNodeView(aboutCodeDB, onNodeClicked);
}

module.exports = AboutCodeNodeView;

AboutCodeNodeView.prototype = {
    resize: function(dx, dy) {
        return this.nodeView.resize(dx, dy);
    },
    redraw: function() {
        return this.nodeView.redraw();
    },

    // Set the root of the node view to the given rootId. This will call
    // the database if the root's data is not found in the node view.
    setRoot: function(rootId) {
        if (rootId in this.nodeView.nodeData) {
            this.nodeView.setRoot(this.nodeView.nodeData[rootId]);
        } else {
            var that = this;
            this.aboutCodeDB.findOne({ where: {path: rootId } })
                .then(function(file) {
                    that.nodeView.setRoot(fileToNode(file));
                });
        }
    },
    update: function(id) {
        return this.nodeView.update(id);
    }
}

// Map a scanned file to a node view data object.
function fileToNode(file) {
    return {
        id: file.path,
        name: file.name,
        type: file.type,
        licenses: file.licenses,
        copyrights: file.copyrights,
        children: []
    };
}

// Create a node view
function createNodeView(aboutCodeDB, onNodeClick) {
    return new NodeView({
        selector: "#nodeview",
        orientation: "left-to-right",
        width: 800,
        height: 800,
        nodeWidth: 25,
        nodeHeight: 160,
        margin: {
            top: 80, bottom: 30,
            left: 100, right: 200
        },
        duration: 1000,
        // Gets the children for a particular node. This should only be
        // called the first time a node is expanded.
        getChildren: function(id) {
            return aboutCodeDB.findAll({ where: { parent : id } })
                .then(function(files) {
                    return $.map(files, function(file, i) {
                        return fileToNode(file);
                    });
                });
        },

        // Update the nodes when data changes
        addNode: function (nodes, nodeView) {
            var circle = nodes.append("circle")
                .on("click", function (d) {
                    nodeView.toggle(d.id)
                });

            // Setup directory nodes
            nodes.filter(function (d) {
                return d.type === "directory";
            })
                .attr("class", "node dir")
                .append("text")
                .attr("x", 10)
                .attr("alignment-baseline", "central")
                .text(function (d) {
                    var file_count = d.files_count;
                    var clue_count = "?";
                    // TODO: Calculate clue count.
                    return d.name +
                        " (" + file_count +
                        ", " + clue_count + ")";
                })
                .on("click", onNodeClick);

            // Setup file nodes
            nodes.filter(function (d) {
                return d.type !== "directory";
            })
                .attr("class", "node file")
                .append("g")
                .attr("class", "clues")
                .attr("x", 10)
                .on("click", onNodeClick);
        },
        updateNode: function(nodes) {

            // Update circles
            nodes.select("circle").attr("class", function (d) {
                while (d != undefined) {
                    // TODO: Read review_status from db
                    var review_status = "";
                    if (review_status !== "") return review_status;
                    d = d.parent;
                }
            })

            var fileNodes = nodes.filter(function (d) {
                return d.type !== "directory";
            });

            // Get the selected values
            var selected = $("#node-drop-down").val();

            // Select old clues
            var clueGroup = fileNodes.selectAll("g.clues");
            var clueNodes = clueGroup.selectAll("g")
                .data(selected, function (d) { return d; });

            // Create new clues
            var newClueNodes = clueNodes.enter()
                .append("g")
                .attr("class", function (d) { return "clue-" + d; })
                .style("opacity", 0);

            // Append clue rect
            var newRectNode = newClueNodes.append("rect");

            // Append clue text
            newClueNodes.append("text")
                .attr("alignment-baseline", "central")
                .text(function (d,i,j) {

                    var data = newClueNodes[j].parentNode.__data__;

                    if (d === "filename") {
                        return data.name
                    } else if (d === "license") {
                        return $.map(data.licenses, function(license, i) {
                            return license.short_name;
                        }).join(", ");
                    } else if (d === "copyright") {

                        // TODO: Add copyright statements
                        return $.map([], function(copyright, i) {
                            return copyright.statements.join(" ");
                        }).join(", ");
                    }
                });

            // Update rect size (has to be done after text is added)
            clueNodes.select("rect")
                .attr("y", function(d) {
                    return -this.parentNode.getBBox().height/2;
                })
                .attr("width", function(d) {
                    return this.parentNode.getBBox().width;
                })
                .attr("height", function(d) {
                    return this.parentNode.getBBox().height;
                });

            // Update each clue's translation and set opacity to 1
            clueNodes.transition().duration(1000)
                .style("opacity", 1)
                .each("end", function (d) {
                    d3.select(this).style("opacity", "inherit")
                })
                .attr("transform", function (d, i) {
                    return "translate("+10+","+(25*i)+")"
                })

            // Update removed clues
            clueNodes.exit().transition().duration(1000)
                .style("opacity", 0)
                .remove();

            nodes.select("g.dir-node").transition().duration(1000)
                .attr("transform", "translate(10,0)");
        }
    });
}