import { Op } from "sequelize";
import { WorkbenchDB } from "../../services/workbenchDbMinimal";
import { FlatFileAttributes } from "../../services/models/flatFile";

export enum MESSAGE_KEY {
  PARSE = "PARSE",
  ABORT = "ABORT",
  DONE = "DONE",
}
export interface DB_QUERY_WORKER_REQUEST_MESSAGE {
  key: MESSAGE_KEY;
  dbStorage: string;
}
export interface DB_QUERY_WORKER_RESPONSE_MESSAGE {
  key: MESSAGE_KEY;
  result: unknown;
}
export interface TABLEVIEW_WORKER_REQUEST_MESSAGE
  extends DB_QUERY_WORKER_REQUEST_MESSAGE {
  currentPath: string;
  columnKeys: string[];
  DEFAULT_EMPTY_VALUES: string[];
  SET_FILTERED_COLUMNS: string[];
}
export interface ColumnFilterValue {
  key: string;
  values: string[];
}
export interface TABLEVIEW_WORKER_RESPONSE_MESSAGE
  extends DB_QUERY_WORKER_RESPONSE_MESSAGE {
  result: {
    files: FlatFileAttributes[];
    longestPathLength: number;
    uniqueColumnFilterValues: ColumnFilterValue[];
  };
}

function tableDataParser(
  workbenchDB: WorkbenchDB,
  params: TABLEVIEW_WORKER_REQUEST_MESSAGE
) {
  const {
    DEFAULT_EMPTY_VALUES,
    SET_FILTERED_COLUMNS,
    columnKeys,
    currentPath,
  } = params;

  // Update table data whenever new db is loaded or path is changed
  const DataProcessorPromise = workbenchDB.sync
    .then((db) =>
      db.FlatFile.findAll({
        where: {
          path: {
            [Op.or]: [
              { [Op.like]: `${currentPath}` }, // Matches a file / directory.
              { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
            ],
          },
        },
      })
    )
    .then((fileModels) => {
      let longestPathLength = 20;
      console.log(fileModels);

      const files = fileModels.map((file) => {
        const len = file.getDataValue("path").length;
        if (len > longestPathLength) {
          longestPathLength = len;
        }
        return file.dataValues;
      });
      return { files, longestPathLength };
    });

  // Update set filters whenever new db is loaded or path is changed
  const FilterProcessorPromise = workbenchDB.sync.then((db) => {
    const filterPromises: Promise<ColumnFilterValue>[] = [];

    columnKeys.forEach((columnKey) => {
      // Prepare filters only for eligible columns
      if (!SET_FILTERED_COLUMNS.includes(columnKey)) return;

      // Aggregator
      const filterPromise = db.FlatFile.aggregate(
        columnKey as keyof FlatFileAttributes,
        "DISTINCT",
        {
          plain: false,
          where: {
            path: {
              [Op.or]: [
                { [Op.like]: `${currentPath}` }, // Matches a file / directory.
                { [Op.like]: `${currentPath}/%` }, // Matches all its children (if any).
              ],
            },
          },
        }
      ).then((uniqueValues: { DISTINCT: string }[]): ColumnFilterValue => {
        const parsedUniqueValues = uniqueValues.map((val) => val.DISTINCT);
        if (!parsedUniqueValues[0]) parsedUniqueValues[0] = "";

        if (!DEFAULT_EMPTY_VALUES.includes(parsedUniqueValues[0]))
          parsedUniqueValues.unshift("");

        return { key: columnKey, values: parsedUniqueValues };
      });
      filterPromises.push(filterPromise);
    });

    return Promise.all(filterPromises);
  });

  return Promise.all([DataProcessorPromise, FilterProcessorPromise]).then(
    ([{ files, longestPathLength }, uniqueColumnFilterValues]) => {
      return new Promise((resolve) => {
        const response: TABLEVIEW_WORKER_RESPONSE_MESSAGE = {
          key: MESSAGE_KEY.DONE,
          result: {
            files,
            longestPathLength,
            uniqueColumnFilterValues,
          },
        };
        resolve(response);
      });
    }
  );
}

self.addEventListener("message", async (event) => {
  const message: TABLEVIEW_WORKER_REQUEST_MESSAGE = event.data;
  console.log("Tableview worker event listener", message);

  if (
    message.key === MESSAGE_KEY.PARSE &&
    message.dbStorage &&
    message.currentPath
  ) {
    const workbenchDB = new WorkbenchDB({
      dbName: "demo_schema",
      dbStorage: message.dbStorage,
    });
    const response = await tableDataParser(workbenchDB, message);
    self.postMessage(response);
  }
});
