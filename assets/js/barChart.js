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

class BarChart {
    constructor(chartData, chartOptions, chartSelector) {

        $(chartSelector).empty();

        let formattedData = BarChart.formatChartData(chartData);

        this.chartSelector = chartSelector;

        this.margin = {
            left: chartOptions.margin + this.maxNameWidth(formattedData),
            top: chartOptions.margin,
            right: chartOptions.margin + this.maxValueWidth(formattedData),
            bottom: chartOptions.margin
        };

        // The chart height is bar height * the number of licenses in the data
        let chartHeight = chartOptions.barHeight * formattedData.length;

        // Build up the chart (Sum of chart + margin top + margin bottom)
        let boundHeight = chartHeight + this.margin.top + this.margin.bottom;

        // Create bounds of chart
        let bounds = d3.select(chartSelector).attr('height', boundHeight);

        // The chart sits within the bounds starting at (margin.left , margin.top)
        let chart = bounds.append('g')
            .attr('transform', 'translate('+ this.margin.left + ',' + this.margin.top + ')');

        // Create scaling for x that converts formattedData values to pixels
        this.xScale = d3.scale.linear()
            // Find the max val in formattedData
            .domain([0, d3.max(formattedData, function(d) { return d.val; })]);

        // Create scaling for y that converts formattedData names to pixels
        let yScale = d3.scale.ordinal()
            .domain(formattedData.map(function(d) {return d.name; }))
            .rangeRoundBands([0, chartHeight], 0.1 /* white space percentage */);

        // Creates a d3 axis given a scale (takes care of tick marks and labels)
        let xAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom');

        // Creates a d3 axis given a scale (takes care of tick marks and labels)
        let yAxis = d3.svg.axis()
            .scale(yScale)
            // Limit label length to 50 characters plus ellipses.
            .tickFormat(function(d) {
                return d.substring(0, 50) + (d.length > 50 ? " ..." : "");
            })
            .orient('left');

        // Creates a graphic tag (<g>) for each bar in the chart
        let bars = chart.selectAll('g')
            .data(formattedData)
            .enter().append('g');

        this.rects = bars.append('rect')
            .attr('y', function(d) { return yScale(d.name); })
            .attr('height', yScale.rangeBand())
            // Add a tooltip to the bar.
            .on("mouseover", function (d) { tooltip.style("display", "inline-block"); })
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html((d.name.replace('<', '&lt;') + ' (' + d.val + ')'));
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });

        // Clear tooltip div created when inadvertently triggered during dropdown selection.
        $( ".toolTip" ).remove();

        let tooltip = d3.select("body").append("div").attr("class", "toolTip");

        this.texts = bars.append('text')
            .attr('y', function (d) { return yScale(d.name); })
            .attr('dy', '1.2em')
            .text(function (d) { return '(' + d.val + ')'; })
            .style('text-anchor', 'start');

        // Adds the y-axis to the chart if data exists
        if (formattedData.length > 0) {
            chart.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        }

        // Add a tooltip to the y-axis labels.
        let summaryData = formattedData;
        chart.selectAll(".y.axis .tick")
            .on("mouseover", function (d) { tooltip.style("display", "inline-block"); })
            .on("mousemove", function (d) {
                let id = d;
                let displayValue = '';
                let result = $.grep(summaryData, function (e) { return e.name === id; });
                displayValue = (result.length === 1 ? ' (' + result[0].val + ')' : '');
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html((d.replace('<', '&lt;') + displayValue));
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });

        this.draw();
    }

    // Redraws chart and sets width based on available chart width.
    // User needs to call this function whenever the width of the chart changes.
    draw() {
        let boundWidth = $(this.chartSelector).width();

        let chartWidth = boundWidth - this.margin.left - this.margin.right;

        if (chartWidth > 0) {
            this.xScale.range([0, chartWidth]);

            const that = this;
            this.rects.attr('width', function (d) {
                return that.xScale(d.val);
            });
            this.texts.attr('x', function (d) {
                return that.xScale(d.val) + 2;
            });
        }
    }

    // Appends a span element with that name to the DOM. Gets the width in
    // pixels. Removes the appended span element from the DOM and returns the
    // width.
    strPixelWidth(str) {
        let tmp = $('<span></span>').text(str);
        $('body').append(tmp);
        let width = tmp.width();
        tmp.remove();
        return width;
    }

    // Returns the pixel width of the string with the longest length
    maxNameWidth(data) {
        let names = data.map(function(d) { return d.trimName; });

        let maxStr = '';
        $.each(names, function(i, name) {
            if(name.length > maxStr.length){
                maxStr = name;
            }
        });

        return this.strPixelWidth(maxStr);
    }

    // Returns the pixel width of the value with the longest length
    maxValueWidth(data) {
        let maxValue = d3.max(data, function(d) { return d.val; });
        return this.strPixelWidth('(' + maxValue + ')');
    }

    static formatChartData(names) {

        // Sum the total number of times the name appears
        let count = {};
        $.each(names, function(i, name){
            count[name] = count[name] + 1 || 1;
        });

        // Transform license count into array of objects with license name & count
        let chartData = $.map(count, function(val, key) {
            let trimName = "";
            trimName = key.substring(0, 50) + (key.length > 50 ? " ..." : "");
            return {
                name: key,
                trimName: trimName,
                val: val
            };
        });

        // Sorts the data highest value to lowest value
        chartData.sort(function(a,b){
            if (a.val === b.val) {
                return a.name.localeCompare(b.name);
            } else {
                return a.val > b.val ? -1 : 1;
            }
        });
        return chartData;
    }
}