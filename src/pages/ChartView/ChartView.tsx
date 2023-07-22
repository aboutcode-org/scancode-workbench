import {
  FindAttributeOptions,
  FindOptions,
  Op,
  Sequelize,
  WhereOptions,
} from "sequelize";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { BAR_CHART_COLUMN_GROUPS } from "../../constants/barChartColumns";

import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  formatBarchartData,
  getValidatedAttributeValues,
} from "../../utils/bar";
import { FlatFileAttributes } from "../../services/models/flatFile";
import { trimStringWithEllipsis } from "../../utils/text";

import "./chartView.css";

const BAR_HEIGHT = 30;
const directoryAttributes = [
  "type",
  "package_data_type",
  "package_data_name",
  "package_data_primary_language",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartView = () => {
  const { importedSqliteFilePath, db, initialized, currentPath } =
    useWorkbenchDB();
  const [selectedAttribute, setSelectedAttribute] = useState<string>(
    BAR_CHART_COLUMN_GROUPS.Copyright.cols[0].field
  );
  const [formattedBarchartData, setFormattedBarchartData] = useState({
    counts: [10],
    labels: ["Chart data"],
    noValueEntriesCount: 0,
  });

  useEffect(() => {
    if (!initialized || !db || !currentPath) return;

    const where: WhereOptions<FlatFileAttributes> = {
      path: {
        [Op.or]: [
          { [Op.like]: `${currentPath}` }, // Matches a file / directory.
          { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
        ],
      },
    };

    if (!directoryAttributes.includes(selectedAttribute)) {
      where.type = {
        [Op.ne]: "directory",
      };
    }
    // const attr: [typeof literal | typeof fn, ...string[]] = [Sequelize.fn('TRIM', Sequelize.col(selectedAttribute)), selectedAttribute];
    const query: FindOptions<FlatFileAttributes> = {
      where: where,
      attributes: [
        Sequelize.fn("TRIM", Sequelize.col(selectedAttribute)),
        selectedAttribute,
      ] as FindAttributeOptions,
      // attributes: [Sequelize.fn('TRIM', Sequelize.col(selectedAttribute)), selectedAttribute],
    };

    db.sync
      .then((db) => db.FlatFile.findAll(query))
      .then((values) => getValidatedAttributeValues(values, selectedAttribute))
      .then((values) => {
        const { noValueEntriesCount, formattedChartData } =
          formatBarchartData(values);
        setFormattedBarchartData({
          noValueEntriesCount,
          labels: formattedChartData.map((entry) => entry.label),
          counts: formattedChartData.map((entry) => entry.value),
        });
        return values;
      });
  }, [importedSqliteFilePath, currentPath, selectedAttribute]);

  return (
    <div className="barchartContainer">
      <div>
        <h5>
          Total Files Scanned: <span className="total-files"></span>
        </h5>
        <select
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
          className="form-control select-chart-attribute"
        >
          {Object.values(BAR_CHART_COLUMN_GROUPS).map((colGroup) => (
            <optgroup label={colGroup.label} key={colGroup.key}>
              {colGroup.cols.map((column) => (
                <option key={column.field} value={column.field}>
                  {column.headerName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="chartWrapper">
        <div
          style={{
            minHeight: BAR_HEIGHT + 50,
            height: BAR_HEIGHT * formattedBarchartData.counts.length + 50,
          }}
        >
          <Bar
            options={{
              maintainAspectRatio: false,
              indexAxis: "y",
              scales: {
                x: {
                  grid: {
                    drawTicks: false,
                    display: false,
                  },
                },
                y: {
                  grid: {
                    drawTicks: true,
                    display: false,
                  },
                },
              },
              elements: {
                bar: {
                  borderWidth: 2,
                },
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: `${selectedAttribute} (No values detected: ${formattedBarchartData.noValueEntriesCount})`,
                },
                tooltip: {
                  callbacks: {
                    title: (rawTitle) =>
                      trimStringWithEllipsis(rawTitle[0].label, 200),
                  },
                },
              },
            }}
            data={{
              labels: formattedBarchartData.labels,
              datasets: [
                {
                  backgroundColor: "#3498db",
                  borderColor: "#bbe7fc",
                  borderWidth: 1,
                  hoverBackgroundColor: "#0a81d1",
                  hoverBorderColor: "#80c8e9",
                  data: formattedBarchartData.counts,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartView;
