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

function AboutCodeNodeView(scanData, onNodeClicked){
    this.scanData = scanData;
    console.log(this.scanData);
    this.nodeView = createNodeView(scanData, onNodeClicked);
    this.nodeView.setData(scanData.nodeViewData);
    // Node view width
//    $("svg").attr("width", "100%")
}

module.exports = AboutCodeNodeView;

AboutCodeNodeView.prototype = {
    resize: function(dx, dy) {
        return this.nodeView.resize(dx, dy);
    },
    redraw: function() {
        return this.nodeView.redraw();
    },
    update: function(id) {
        return this.nodeView.update(id);
    }
}

// Create a node view
function createNodeView(scanData, onNodeClick) {
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

        // Update the nodes when data changes
        addNode: function (nodes, nodeView) {
            var circle = nodes.append("circle")
                .on("click", function (d) {
                    nodeView.toggle(d.id)
                });

            // Setup directory nodes
            nodes.filter(function (d) {
                return d.scanData.type === "directory";
            })
                .attr("class", "node dir")
                .append("text")
                .attr("x", 10)
                .attr("alignment-baseline", "central")
                .text(function (d) {
                    var file_count = d.scanData.files_count;
                    var clue_count = 0;
                    ScanData.forEachNode(d, "_children", function(node) {
                        clue_count += (node.scanData.licenses || []).length;
                        clue_count += (node.scanData.copyrights || []).length;
                    })
                    return d.name +
                        " (" + file_count +
                        ", " + clue_count + ")";
                })
                .on("click", onNodeClick);

            // Setup file nodes
            nodes.filter(function (d) {
                return d.scanData.type !== "directory";
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
                    var review_status = scanData.getComponent(d.id).review_status;
                    if (review_status !== "") return review_status;
                    d = d.parent;
                }
            })

            var fileNodes = nodes.filter(function (d) {
                return d.scanData.type !== "directory";
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
                        return $.map(data.scanData.licenses, function(license, i) {
                            return license.short_name;
                        }).join(", ");
                    } else if (d === "copyright") {
                        return $.map(data.scanData.copyrights, function(copyright, i) {
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