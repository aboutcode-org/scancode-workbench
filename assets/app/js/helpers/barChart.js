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

class BarChart {
  constructor(chartData, chartOptions, chartSelector) {
    $(chartSelector).empty();

    const formattedData = BarChart.formatChartData(chartData);

    this.chartSelector = chartSelector;

    this.margin = {
      left: chartOptions.margin + this.maxNameWidth(formattedData),
      top: chartOptions.margin,
      right: chartOptions.margin + BarChart.maxValueWidth(formattedData),
      bottom: chartOptions.margin
    };

    // The chart height is bar height * the number of licenses in the data
    const chartHeight = chartOptions.barHeight * formattedData.length;

    // Build up the chart (Sum of chart + margin top + margin bottom)
    const boundHeight = chartHeight + this.margin.top + this.margin.bottom;

    // Create bounds of chart
    const bounds = d3.select(chartSelector).attr('height', boundHeight);

    // The chart sits within the bounds starting at (margin.left , margin.top)
    const chart = bounds.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Create scaling for x that converts formattedData values to pixels
    this.xScale = d3.scale.linear()
      // Find the max val in formattedData
      .domain([0, d3.max(formattedData, (d) => { return d.val; })]);

    // Create scaling for y that converts formattedData names to pixels
    const yScale = d3.scale.ordinal()
      .domain(formattedData.map((d) => {return d.name; }))
      .rangeRoundBands([0, chartHeight], 0.1 /* white space percentage */);

    // Creates a d3 axis given a scale (takes care of tick marks and labels)
    d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom');

    // Creates a d3 axis given a scale (takes care of tick marks and labels)
    const yAxis = d3.svg.axis()
      .scale(yScale)
      // Limit label length to 50 characters plus ellipses.
      .tickFormat(BarChart.trimName)
      .orient('left');

    // Creates a graphic tag (<g>) for each bar in the chart
    const bars = chart.selectAll('g')
      .data(formattedData)
      .enter().append('g');

    // Clear tooltip div created when inadvertently triggered during dropdown selection.
    $('.toolTip').remove();

    const tooltip = d3.select('body').append('div').attr('class', 'toolTip');

    this.rects = bars.append('rect')
      .attr('y', (d) => { return yScale(d.name); })
      .attr('height', yScale.rangeBand())
      .attr('data-value', (d) => {
        return d.name;
      })
      // Add a tooltip to the bar.
      .on('mouseover', () => { tooltip.style('display', 'inline-block'); })
      .on('mousemove', (d) => {
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .text((d.name + ' (' + d.val + ')'));
      })
      .on('mouseout', () => { tooltip.style('display', 'none'); });

    this.texts = bars.append('text')
      .attr('y', (d) => { return yScale(d.name); })
      .attr('dy', '1.2em')
      .text((d) => { return '(' + d.val + ')'; })
      .style('text-anchor', 'start');

    // Adds the y-axis to the chart if data exists
    if (formattedData.length > 0) {
      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }

    // Add a tooltip to the y-axis labels.
    chart.selectAll('.y.axis .tick')
      .on('mouseover', () => { tooltip.style('display', 'inline-block'); })
      .on('mousemove', (d) => {
        const result = $.grep(formattedData, (e) => { return e.name === d; });
        const displayValue = ' (' + result[0].val + ')';
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .text((d + displayValue));
      })
      .on('mouseout', () => { tooltip.style('display', 'none'); })
      .attr('data-value', (d) => {
        return d;
      });

    this.redraw();
  }

  static trimName(name) {
    return name.substring(0, 50) + (name.length > 50 ? ' ...' : '');
  }

  // Redraws chart and sets width based on available chart width.
  // User needs to call this function whenever the width of the chart changes.
  redraw() {
    const boundWidth = $(this.chartSelector).width();

    const chartWidth = boundWidth - this.margin.left - this.margin.right;

    if (chartWidth > 0) {
      this.xScale.range([0, chartWidth]);

      const that = this;
      this.rects.attr('width', (d) => {
        return that.xScale(d.val);
      });
      this.texts.attr('x', (d) => {
        return that.xScale(d.val) + 2;
      });
    }
  }

  // Appends a span element with that name to the DOM. Gets the width in
  // pixels. Removes the appended span element from the DOM and returns the
  // width.
  static strPixelWidth(str) {
    const tmp = $('<span></span>').text(str);
    $('body').append(tmp);
    const width = tmp.width();
    tmp.remove();
    return width;
  }

  // Returns the pixel width of the string with the longest length
  maxNameWidth(data) {
    const names = data.map((d) => { return d.trimmedName; });

    let maxStr = '';
    $.each(names, (i, name) => {
      if (name.length > maxStr.length) {
        maxStr = name;
      }
    });

    return BarChart.strPixelWidth(maxStr);
  }

  // Returns the pixel width of the value with the longest length
  static maxValueWidth(data) {
    const maxValue = d3.max(data, (d) => { return d.val; });
    return BarChart.strPixelWidth('(' + maxValue + ')');
  }

  static formatChartData(names) {
    // Sum the total number of times the name appears
    const count = {};
    $.each(names, (i, name) => {
      count[name] = count[name] + 1 || 1;
    });

    // Transform license count into array of objects with license name & count
    const chartData = $.map(count, (val, key) => {
      return {
        name: key,
        trimmedName: BarChart.trimName(key),
        val: val
      };
    });

    // Sorts the data highest value to lowest value
    chartData.sort((a,b) => {
      if (a.val === b.val) {
        return a.name.localeCompare(b.name);
      } else {
        return a.val > b.val ? -1 : 1;
      }
    });
    return chartData;
  }
}

module.exports = BarChart;
