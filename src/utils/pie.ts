import * as $ from 'jquery';
import { StringDataType } from "sequelize";
import { LEGEND_LIMIT } from "../constants/data";


export type FormattedEntry = [string, number];

const ascendingComparatorFunction = (a: FormattedEntry, b: FormattedEntry) => (a[1] > b[1]) ? 1 : -1;
const descendingComparatorFunction = (a: FormattedEntry, b: FormattedEntry) => (a[1] < b[1]) ? 1 : -1;

// Limit data to n-highest values in the chart
function limitChartData(data: FormattedEntry[], limit: number) {
  if(data.length <= limit)
    return data.sort(ascendingComparatorFunction);

  // Bring larger entries to the top
  const limitedData = data.sort(descendingComparatorFunction);
  
  // Sum up the entries to be excluded
  let otherCount = 0;
  for(let i=limit-1; i<limitedData.length; i++)
    otherCount += limitedData[i][1];
  
  // Exclude entries
  limitedData.length = limit - 1;

  // Add entry 'other' representing sum of excluded entries
  if(otherCount > 0)
    limitedData.unshift(['other', otherCount]);
  
  return limitedData.sort(ascendingComparatorFunction);
}

// Formats data suitable for Pie chart
export function formatChartData(
  names: (string | StringDataType)[],
  chartKey?: string,
  limit?: number,
): {
  chartData: FormattedEntry[],
  untrimmedLength: number,
} {
  // Sum the total number of times the name appears
  const count = new Map<string, number>();

  $.each(names, (i, name) => {
    count.set(name.toString({}), (count.get(name.toString({})) || 0) + 1);
  });

  const chartData = Array.from(count.entries());
  const untrimmedLength = chartData.length;
  const chartDataLimit = limit || LEGEND_LIMIT;

  return {
    chartData: limitChartData(chartData, chartDataLimit),
    untrimmedLength,
  }
}