import { StringDataType } from "sequelize";
import { LEGEND_LIMIT } from "../constants/data";

export type FormattedEntry = [string, number];

const ascendingFrequencyComparator = (a: FormattedEntry, b: FormattedEntry) =>
  a[1] == b[1] ? (a[0] < b[0] ? -1 : 1) : a[1] < b[1] ? -1 : 1;

const descendingFrequencyComparator = (a: FormattedEntry, b: FormattedEntry) =>
  a[1] == b[1] ? (a[0] < b[0] ? -1 : 1) : a[1] < b[1] ? 1 : -1;

// Limit data to n-highest values in the chart
export function limitPieChartData(data: FormattedEntry[], limit: number) {
  if (data.length <= limit) return data.sort(ascendingFrequencyComparator);

  // Bring larger entries to the top
  const limitedData = data.sort(descendingFrequencyComparator);

  // Sum up the entries to be excluded
  let otherCount = 0;
  for (let i = limit - 1; i < limitedData.length; i++)
    otherCount += limitedData[i][1];

  // Exclude entries
  limitedData.length = limit - 1;

  // Add entry 'other' representing sum of excluded entries
  if (otherCount > 0) limitedData.unshift(["other", otherCount]);
  return limitedData.sort(ascendingFrequencyComparator);
}

// Formats data suitable for Pie chart
export function formatPieChartData(
  entries: (string | StringDataType)[],
  limit?: number
): {
  chartData: FormattedEntry[];
  untrimmedLength: number;
} {
  // Sum the total number of times the entry appears
  const count = new Map<string, number>();

  entries.forEach((entry) =>
    count.set(
      entry?.toString({}) || (entry as string),
      (count.get(entry.toString({})) || 0) + 1
    )
  );

  const chartData = Array.from(count.entries());
  const untrimmedLength = chartData.length;
  const chartDataLimit = limit || LEGEND_LIMIT;

  return {
    chartData: limitPieChartData(chartData, chartDataLimit),
    untrimmedLength,
  };
}
