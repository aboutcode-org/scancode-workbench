import assert from "assert";
import {
  PieFormatDataSamples,
  PieLimitDataSamples,
} from "./pie.test.data";
import { formatPieChartData, limitPieChartData } from "../src/utils/pie";

describe("Pie chart - Limit values to be shown in chart", () => {
  it.each(PieLimitDataSamples)(
    "Limit entries from $data.length => $limited.length",
    ({ data, chartDataLimit, limited }) =>
      assert.deepEqual(limitPieChartData(data, chartDataLimit), limited)
  );
});

describe("Pie chart - Count & format value occurences in given list of values", () => {
  it.each(PieFormatDataSamples)(
    "Format chart values of length $entries.length",
    ({ entries, limit, formatted }) =>
      assert.deepEqual(formatPieChartData(entries, limit), formatted)
  );
});
