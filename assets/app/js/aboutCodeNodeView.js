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

class AboutCodeNodeView {
    constructor(nodeViewId, aboutCodeDB) {
        this.nodeView = new NodeView(
            {
                selector: nodeViewId,
                orientation: "left-to-right",
                nodeWidth: 25,
                nodeHeight: 160,
                duration: 1000
            })
            .on('add-nodes', (nodes) => this._addNodes(nodes))
            .on('update-nodes', (nodes) => this._updateNodes(nodes))
            .on('prune-nodes', (rootNode) => this._pruneNodes(rootNode))
            .on('get-children', (nodeId) => this._getChildren(nodeId));

        this.aboutCodeDB = aboutCodeDB;
        this.handlers = {};

        // By default, do not prune any nodes
        this.isNodePruned = () => false;

        // Center and reset node view
        $("#reset-zoom").click(() => this.centerNode());

        this.nodeDropdown = $("#node-drop-down");
        this.nodeDropdown.select2({
            closeOnSelect: false,
            placeholder: "select me"
        });

        // Resize the nodes based on how many clues are selected
        this.nodeDropdown
            .change(() => {
                if (this.nodeDropdown.val()) {
                    this.nodeView.resize(
                        (this.nodeDropdown.val() || []).length * 30, 180);
                } else {
                    this.nodeView.resize(30, 180);
                }
            });

        const selectedStatuses = ["Analyzed", "Attention", "Original", "NR"];

        $(".status-dropdown-menu a").on("click", event => {
            const target = $(event.currentTarget);
            const value = target.attr("data-value");
            const input = target.find("input");
            const index = selectedStatuses.indexOf(value);

            if (index > -1) {
                selectedStatuses.splice(index, 1);
                // setTimeout is needed for checkbox to show up
                setTimeout(() =>  input.prop("checked", false), 0);
            } else {
                selectedStatuses.push(value);
                setTimeout(() => input.prop("checked", true), 0);
            }
            $(event.target).blur();

            this._setIsNodePruned((node) => {
                return selectedStatuses.indexOf(
                    node.review_status) < 0 && node.review_status !== "";
            });

            this.redraw();
            return false;
        });
    }

    on(event, handler) {
        this.handlers[event] = handler;
        return this;
    }

    database(aboutCodeDB) {
        this.aboutCodeDB = aboutCodeDB;
    }

    reload() {
        this.nodeView.reload();
    }

    redraw() {
        this.nodeView.redraw();
    }

    centerNode() {
        this.nodeView.centerNode();
    }

    nodeData() {
        return this.nodeView.nodeData;
    }

    // Set the root of the node view to the given rootId. This will call
    // the database if the root's data is not found in the node view.
    setRoot(rootId) {
        if (rootId in this.nodeData()) {
            this.nodeView.setRoot(this.nodeData()[rootId]);
        } else {
            let splits = rootId.split("/");
            let rootIds = $.map(splits, (split, index) => {
                return { path: splits.slice(0, index + 1).join("/") };
            });

            this.aboutCodeDB.findAll({where: { $or: rootIds } })
                .then((files) => {
                    $.each(files, (index, file) => {
                        this.nodeData()[file.path] =
                            AboutCodeNodeView.fileToNode(file);
                        console.log(file.path);
                        console.log(this.nodeData()[file.path]);
                    });
                })
                .then(() => this.nodeView.setRoot(this.nodeData()[rootId]))
                .catch((err) => console.error(err));
        }
    }

    // Gets the children for a particular node from the DB.
    _getChildren(id) {
        return this.aboutCodeDB
            .findAll({where: {parent: id}})
            .then((files) =>
                files.map((file) => AboutCodeNodeView.fileToNode(file)))
            .catch((err) => console.error(err));
    }

    // Define the visuals of a node when it's added
    _addNodes(nodes) {
        const circle = nodes.append("circle")
            .on("click", (d) => this.nodeView.toggle(d.id));

        // Setup directory nodes
        nodes.filter((d) => d.type === "directory")
            .attr("class", "node dir")
            .append("text")
            .attr("x", 10)
            .attr("alignment-baseline", "central")
            .text(function (d) {
                // TODO: Calculate clue count from DB when loading node data.
                // return `${d.name} (${d.files_count}, ${d.clues_count})`;
                return `${d.name} (${d.files_count})`;
            })
            .on("click", node => this.handlers['node-clicked'](node));

        // Setup file nodes
        nodes.filter((d) => d.type !== "directory")
            .attr("class", "node file")
            .append("g")
            .attr("class", "clues")
            .attr("x", 10)
            .on("click", node => this.handlers['node-clicked'](node));
    }

    // Update the nodes when data changes
    _updateNodes(nodes) {
        // Update circles
        nodes.select("circle").attr("class", d => d.review_status);

        // Get the selected values
        const selected = this.nodeDropdown.val();

        if (selected) {
            // Select all clue nodes
            const fileNodes = nodes.filter((d) => d.type !== "directory");
            const clueGroup = fileNodes.selectAll("g.clues");
            const clueNodes = clueGroup.selectAll("g").data(selected, d => d);
            AboutCodeNodeView._updateClueNodes(clueNodes);
            AboutCodeNodeView._addClueNodes(clueNodes.enter());
            AboutCodeNodeView._removeClueNodes(clueNodes.exit());
        }

        nodes.select("g.dir-node").transition().duration(1000)
            .attr("transform", "translate(10,0)");
    }

    // Prune nodes when status is checked in drop down menu
    _pruneNodes(rootNode) {
        const q = [{
            parent: null,
            child: rootNode
        }];

        // Perform a breadth first traversal of the nodes.
        while (q.length > 0) {
            const {parent, child} = q.pop();

            child.review_status = this._getReviewStatus(child);

            // Reset the displayed children to empty
            child.children = [];

            // If the parent is opened, and the child is not pruned, add it.
            if (child === rootNode && this.isNodePruned(child)) {
                // If the root node is pruned just return null because no nodes should be shown
                return null;
            } else if (parent && parent.isOpened && !this.isNodePruned(child)) {
                parent.children.unshift(child);
            }

            // Add all child's children to the queue (breadth first search)
            if (child._children) {
                $.each(child._children, (index, grandchild) => {
                    q.push({
                        parent: child,
                        child: grandchild
                    });
                });
            }
        }

        return rootNode;
    }

    /**
     * Sets the prune function, which should return true if a node should be
     * pruned.
     */
    _setIsNodePruned(isNodePruned) {
        this.isNodePruned = isNodePruned;
    }

    _getReviewStatus(node) {
        if (node) {
            if (node.component) {
                // use this node component's review_status
                return node.component.review_status;
            } else if (node.parent) {
                // use the parent node's inherited review status
                return node.parent.review_status;
            } else if (node.parentId) {
                // the parent node is not drawn so get the node from nodeData
                return this._getReviewStatus(this.nodeData()[node.parentId]);
            }
        }

        return "";
    }

    // Map a scanned file to a node view data object.
    static fileToNode(file) {
        return {
            id: file.path,
            fileId: file.id,
            parentId: file.parent,
            name: file.name,
            type: file.type,
            licenses: file.licenses,
            copyrights: file.copyrights,
            files_count: file.files_count,
            component: file.component,
            children: []
        };
    }

    // Create new visual for any new clues
    static _addClueNodes(node) {
        const newClueNodes = node.append("g")
            .attr("class", (name) => `clue-${name}`)
            .style("opacity", 0);

        // Append clue rect
        newClueNodes.append("rect");

        // Append clue text
        newClueNodes.append("text")
            .attr("alignment-baseline", "central")
            .text((d, i, j) => {
                const data = newClueNodes[j].parentNode.__data__;

                if (d === "filename") {
                    return data.name;
                } else if (d === "license") {
                    return data.licenses
                        .map((license) => license.short_name)
                        .join(", ");
                } else if (d === "copyright") {
                    return data.copyrights
                        .map((copyright) => copyright.statements.join(" "))
                        .join(", ");
                }
            });

        this._updateClueNodes(newClueNodes);
    }

    // Update rect size (has to be done after text is added)
    static _updateClueNodes(nodes) {
        nodes.select("rect")
            .attr("y", function() {
                return -this.parentNode.getBBox().height/2;
            })
            .attr("width", function() {
                return this.parentNode.getBBox().width;
            })
            .attr("height", function() {
                return this.parentNode.getBBox().height;
            });

        // Update each clue's translation and set opacity to 1
        nodes.transition().duration(1000)
            .style("opacity", 1)
            .each("end", function () {
                d3.select(this).style("opacity", "inherit");
            })
            .attr("transform", (d, i) => `translate(10, ${25*i})`);
    }

    // Update removed clues
    static _removeClueNodes(nodes) {
        nodes.transition().duration(1000)
            .style("opacity", 0)
            .remove();
    }
}

module.exports = AboutCodeNodeView;