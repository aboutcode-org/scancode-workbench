import assert from "assert";
import {
  PieFormatDataSamples,
  PieLimitDataSamples,
} from "./test-data/pie-data";
import { formatPieChartData, limitPieChartData } from "./pie";

test("Pie chart values - Limit Entries", () => {
  PieLimitDataSamples.forEach((sample) =>
    assert.deepEqual(
      limitPieChartData(sample.data, sample.chartDataLimit),
      sample.limited
    )
  );
});

test("Pie chart values - Formatting", () => {
  PieFormatDataSamples.forEach((sample) =>
    assert.deepEqual(
      formatPieChartData(sample.entries, sample.limit),
      sample.formatted
    )
  );
});
