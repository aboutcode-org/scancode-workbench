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

function NodeView(config) {
    var that = this;
    this.config = config;
    this.nodeData = config.data;
    this.w = config.width - config.margin.right - config.margin.left
    this.h = config.height - config.margin.top - config.margin.bottom;
    this.nextId = 0;
    this.o = NodeView.orientation(config.orientation, this.w, this.h);

    var x = d3.scale.linear();
    var y = d3.scale.linear();
    var zoom = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0.5, 10]) // scale between 0.5x and 10x of original
        .on("zoom", function () {
            that.container.attr("transform",
                "translate("+ d3.event.translate + ")" +
                    "scale(" + d3.event.scale + ")"
            );
        });

    this.svg = d3.select(config.selector).append("svg")
        .attr("width", config.width)
        .attr("height", config.height)
        .call(zoom);

    this.container = this.svg.append("g")
        .attr("transform", "translate(" +
            config.margin.left + "," +
            config.margin.top + ")");

    this.tree = d3.layout.tree()
        .nodeSize([config.nodeWidth, config.nodeHeight]);

    this.diagonal = d3.svg.diagonal().projection(function (d) {
        return [that.o.x(d), that.o.y(d)];
    });

    this.setData(config.data);
}

NodeView.orientation = function(orientKey, width, height) {
    if (orientKey === "top-to-bottom") {
        return {
            size: [width, height],
            x: function(d) { return d.x; },
            y: function(d) { return d.y; }
        };
    } else if ( orientKey === "left-to-right") {
        return {
            size: [height, width],
            x: function(d) { return d.y; },
            y: function(d) { return d.x; }
        }
    }
}

NodeView.prototype = {
    update: function (rootId, toggleId) {
        var prevPos = this._pos(this.findNode(toggleId || this.currentId));
        var newRoot = this.findNode(rootId);

        this.currentId = rootId;
        var nodeData = this.tree.nodes(newRoot);

        var currPos = this._pos(this.findNode(toggleId || this.currentId));

        // Handle nodes
        var nodes = this.container.selectAll("g.node")
            .data(nodeData, function (d) {
                return d.id || (d.id = that.nextId++);
            });
        this._updateNodes(nodes);
        this._addNodes(nodes.enter(), prevPos);
        this._removeNodes(nodes.exit(), currPos);

        // Handle links
        var linkData = this.tree.links(nodeData);
        var links = this.container.selectAll("path.link")
            .data(linkData, function (d) {
                return d.target.id;
            });
        this._updateLinks(links);
        this._addLinks(links.enter(), prevPos);
        this._removeLinks(links.exit(), currPos);
    },
    findNode: function (id) {
        return this.nodeData[id]
    },
    setData: function (data) {
        if (data == undefined) return;

        this.nodeData = data.reduce(function(file, item) {
            file[item.id] = item;
            item._children = item.children;
            item.children = [];
            return file;
        }, {})
        this.currentId = data[0].id;
        data[0].children = data[0]._children;
    },
    reset: function () {
        $.each(this.nodeData, function (id, node) {
            node.children = [];
        });
    },
    expand: function (id) {
        this.nodeData[id].children = this.nodeData[id]._children;
        this.update(this.currentId, id);
    },
    collapse: function (id) {
        this.nodeData[id].children = [];
        this.update(this.currentId, id);
    },
    toggle: function (id) {
        if (this.nodeData[id].children !== this.nodeData[id]._children) {
            this.expand(id);
        } else {
            this.collapse(id);
        }
    },
    data: function () {
        return this.nodeData;
    },
    translate: function (d) {
        return "translate(" + this.o.x(d) + "," + this.o.y(d) + ")";
    },
    _pos: function (d) {
        return {x: d.x || 0, y: d.y || 0};
    },
    _addNodes: function (node, pos) {
        var that = this;
        // create Node group
        nodeGroup = node.append("g").attr("class", "node")
            // Starting position
            .attr("transform", function (d) {
                return that.translate(pos);
            })
            .style("opacity", 0);

        // Add custom elements
        this.config.addNode(nodeGroup)
        this._updateNodes(nodeGroup);
    },
    _updateNodes: function (nodes) {
        that = this;
        // Animate Node group open
        nodes.transition().duration(this.config.duration)
            .attr("transform", function (d) {
                return that.translate(that._pos(d));
            })
            .style("opacity", 1)

        // Update custom elements
        this.config.updateNode(nodes)
    },
    _removeNodes: function (nodes, pos) {
        // Transition exiting nodes to the clicked source's position.
        var startPos = this.translate(pos)
        nodes.transition().duration(this.config.duration)
            .attr("transform", function (d) {
                return startPos; })
            .style("opacity", 0)
            .remove();

        // Transition exiting nodes radius to 0
        nodes.select("circle").transition().duration(this.config.duration)
            .attr("r", 0);
    },
    _addLinks: function (link, pos) {
        var diagonal = this.diagonal({source: pos, target: pos});
        linkGroup = link.insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) { return diagonal; });

        this._updateLinks(linkGroup);
    },
    _updateLinks: function (links) {
        // Transition links to their new position.
        links.transition().duration(this.config.duration)
            .attr("d", this.diagonal)
            .style("opacity", 1);
    },
    _removeLinks: function (links, pos) {
        var diagonal = this.diagonal({source: pos, target: pos});
        // Transition exiting nodes to the parent's new position.
        links.transition().duration(this.config.duration)
            .attr("d", function (d) { return diagonal; })
            .style("opacity", 0)
            .remove()
    },
    redraw: function () {
        // Update position data
        var root = this.findNode(this.currentId);
        this.tree.nodes(root);

        // Update nodes
        var nodes = this.container.selectAll("g.node");
        this._updateNodes(nodes);

        // Update links
        var links = this.container.selectAll("path.link");
        this._updateLinks(links);
    },
    // Resize the spacing between nodes
    resize: function (nodeWidth, nodeHeight) {
        this.tree.nodeSize([nodeWidth, nodeHeight]);
        this.redraw();
    }
}