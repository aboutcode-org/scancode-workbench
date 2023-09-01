import electron from "electron";
import * as electronFs from "fs";
import moment from "moment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import packageJson from "../../package.json";
import {
  IMPORT_REPLY_CHANNEL,
  JSON_IMPORT_REPLY_FORMAT,
  NAVIGATION_CHANNEL,
  NAVIGATION_CHANNEL_MESSAGE,
  OPEN_DIALOG_CHANNEL,
  OPEN_ERROR_DIALOG_CHANNEL,
  SAVE_REPLY_CHANNEL,
  SQLITE_IMPORT_REPLY_FORMAT,
  SQLITE_PATH_FOR_JSON_REQUEST_FORMAT,
  SQLITE_SAVE_REPLY_FORMAT,
  UTIL_CHANNEL,
} from "../constants/IpcConnection";
import { DEFAULT_ROUTE_ON_IMPORT, ROUTES } from "../constants/routes";
import { AddEntry, GetHistory, RemoveEntry } from "../services/historyStore";
import { WorkbenchDB } from "../services/workbenchDB";
import { isSqliteSchemaOutdated } from "../utils/checks";
import { ScanInfo, parseScanInfo } from "../utils/parsers";

const { version: workbenchVersion } = packageJson;
const { ipcRenderer } = electron;

export type PathType = "file" | "directory";
interface BasicValueState {
  db: WorkbenchDB | null;
  initialized: boolean;
  importedSqliteFilePath: string | null;
  scanInfo: ScanInfo | null;
}
interface WorkbenchContextProperties extends BasicValueState {
  currentPath: string | null;
  currentPathType: PathType;
  loadingStatus: null | number;
  processingQuery: boolean;
  startImport: () => void;
  abortImport: () => void;
  closeFile: () => void,
  startProcessing: () => void;
  endProcessing: () => void;
  sqliteParser: (sqliteFilePath: string, preventNavigation?: boolean) => void;
  jsonParser: (
    jsonFilePath: string,
    sqliteFilePath: string,
    preventNavigation?: boolean
  ) => void;
  importJsonFile: (jsonFilePath: string) => void;
  updateLoadingStatus: React.Dispatch<React.SetStateAction<number | null>>;
  updateCurrentPath: (newPath: string, type: PathType) => void;
  goToFileInTableView: (path: string) => void;
}

export const defaultWorkbenchContextValue: WorkbenchContextProperties = {
  db: null,
  initialized: false,
  importedSqliteFilePath: null,
  scanInfo: null,
  loadingStatus: null,
  currentPath: null,
  currentPathType: "directory",
  processingQuery: false,
  jsonParser: () => null,
  sqliteParser: () => null,
  importJsonFile: () => null,
  updateLoadingStatus: () => null,
  startImport: () => null,
  abortImport: () => null,
  closeFile: () => null,
  startProcessing: () => null,
  endProcessing: () => null,
  updateCurrentPath: () => null,
  goToFileInTableView: () => null,
};

const WorkbenchContext = createContext<WorkbenchContextProperties>(
  defaultWorkbenchContextValue
);

export const WorkbenchDBProvider = (
  props: React.PropsWithChildren<Record<string, unknown>>
) => {
  const navigate = useNavigate();

  const [loadingStatus, updateLoadingStatus] = useState<number | null>(null);
  const [processingQuery, setProcessingQuery] = useState<boolean>(null);
  const [value, setValue] = useState<BasicValueState>({
    db: null,
    initialized: false,
    importedSqliteFilePath: null,
    scanInfo: null,
  });
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentPathType, setCurrentPathType] = useState<PathType>("directory");

  function updateCurrentPath(path: string, pathType: PathType) {
    setCurrentPath(path);
    setCurrentPathType(pathType);
  }

  function changeRouteOnImport() {
    navigate(DEFAULT_ROUTE_ON_IMPORT);
  }

  function goToFileInTableView(path: string) {
    updateCurrentPath(path, "file");
    navigate("/" + ROUTES.TABLE_VIEW);
  }

  const startImport = () => {
    updateLoadingStatus(0);
    setProcessingQuery(false);
    setValue({
      db: null,
      initialized: false,
      importedSqliteFilePath: null,
      scanInfo: null,
    });
  };

  const abortImport = () => updateLoadingStatus(null);

  const closeFile = () => {
    updateLoadingStatus(null);
    setProcessingQuery(false);
    setValue({
      db: null,
      initialized: false,
      importedSqliteFilePath: null,
      scanInfo: null,
    });
    navigate(ROUTES.HOME)
  }

  const updateWorkbenchDB = async (db: WorkbenchDB, sqliteFilePath: string) => {
    updateLoadingStatus(100);
    setValue({
      db,
      initialized: true,
      importedSqliteFilePath: sqliteFilePath,
      scanInfo: parseScanInfo(await db.getScanInfo()),
    });
  };

  function sqliteParser(sqliteFilePath: string, preventNavigation?: boolean) {
    startImport();

    // Create connection to existing database when importing a sqlite file
    const newWorkbenchDB = new WorkbenchDB({
      dbName: "workbench_db",
      dbStoragePath: sqliteFilePath,
    });

    updateLoadingStatus(25);

    // Check that that the database schema matches current schema.
    newWorkbenchDB
      .getScanInfo()
      .then((infoHeader) => {
        // Check that the database has the correct header information.
        if (!infoHeader) {
          const errTitle = "Invalid SQLite file";
          const errMessage =
            "Invalid SQLite file: " +
            sqliteFilePath +
            "\n" +
            "The SQLite file is invalid. Try re-importing the ScanCode JSON " +
            "file and creating a new SQLite file.";

          console.error("Handled invalid sqlite import", {
            title: errTitle,
            message: errMessage,
          });

          ipcRenderer.send(OPEN_ERROR_DIALOG_CHANNEL, {
            title: errTitle,
            message: errMessage,
          });

          abortImport();
          return;
        }

        updateLoadingStatus(50);

        const dbVersion = infoHeader.getDataValue("workbench_version");
        if (!dbVersion || isSqliteSchemaOutdated(dbVersion, workbenchVersion)) {
          const errTitle = "Old SQLite schema found";
          const errMessage =
            "Old SQLite schema found at file: " +
            sqliteFilePath +
            "\n" +
            "The SQLite schema has been updated since the last time you loaded this file. \n\n" +
            "Some features may not work correctly until you re-import the original" +
            "ScanCode JSON file to create an updated SQLite database.";

          console.error(
            "Handled schema mismatch error when importing sqlite file ",
            {
              title: errTitle,
              message: errMessage,
            }
          );

          ipcRenderer.send(OPEN_ERROR_DIALOG_CHANNEL, {
            title: errTitle,
            message: errMessage,
          });
          abortImport();
          return;
        }

        updateLoadingStatus(75);

        newWorkbenchDB.sync
          .then((db) => db.File.findOne({ where: { parent: "#" } }))
          .then(async (root) => {
            if (!root) {
              console.error("Root path not found !!!!", root);
              return;
            }

            const defaultPath = root.getDataValue("path");

            AddEntry({
              sqlite_path: sqliteFilePath,
              opened_at: moment().format(),
            });

            await updateWorkbenchDB(newWorkbenchDB, sqliteFilePath);

            if (defaultPath) {
              updateCurrentPath(
                defaultPath,
                root.getDataValue("type") as PathType
              );
            }

            // Update window title
            const newlyImportedFileName = sqliteFilePath
              .split("\\")
              .pop()
              .split("/")
              .pop();
            ipcRenderer.send(
              UTIL_CHANNEL.SET_CURRENT_FILE_TITLE,
              newlyImportedFileName
            );

            if (!preventNavigation) changeRouteOnImport();
          })
          .catch((err) => {
            const foundInvalidHistoryItem = GetHistory().find(
              (historyItem) => historyItem.sqlite_path === sqliteFilePath
            );
            if (foundInvalidHistoryItem) {
              RemoveEntry(foundInvalidHistoryItem);
            }
            console.error("Err trying to import sqlite:");
            console.error(err);
            toast.error(
              `Unexpected error while importing json \nPlease check console for more info`
            );
            abortImport();
          });
      })
      .catch((err) => {
        const foundInvalidHistoryItem = GetHistory().find(
          (historyItem) => historyItem.sqlite_path === sqliteFilePath
        );
        if (foundInvalidHistoryItem) {
          RemoveEntry(foundInvalidHistoryItem);
        }
        console.error("Err trying to import sqlite:");
        console.error(err);
        toast.error(
          `Unexpected error while finalising json import \nPlease check console for more info`
        );
        abortImport();
      });
  }

  function jsonParser(
    jsonFilePath: string,
    sqliteFilePath: string,
    preventNavigation?: boolean
  ) {
    if (!sqliteFilePath || !jsonFilePath) {
      console.error("Sqlite or json file path isn't valid:", sqliteFilePath);
      return;
    }

    startImport();

    // Create a new database when importing a json file (Delete any existing data in the sqlite file)
    const newWorkbenchDB = new WorkbenchDB({
      dbName: "workbench_db",
      dbStoragePath: sqliteFilePath,
      deleteExisting: true,
    });

    newWorkbenchDB.sync
      .then(() =>
        newWorkbenchDB.addFromJson(jsonFilePath, (progress: number) => {
          updateLoadingStatus(progress);
        })
      )
      .then(() => {
        console.log("JSON parsing completed");

        AddEntry({
          json_path: jsonFilePath,
          sqlite_path: sqliteFilePath,
          opened_at: moment().format(),
        });

        newWorkbenchDB.sync
          .then((db) => db.File.findOne({ where: { parent: "#" } }))
          .then(async (root) => {
            if (!root) {
              console.error("Root path not found !!!!");
              console.error("Root:", root);
              abortImport();
              return;
            }
            const defaultPath = root.getDataValue("path");

            await updateWorkbenchDB(newWorkbenchDB, sqliteFilePath);

            if (defaultPath) {
              updateCurrentPath(
                defaultPath,
                root.getDataValue("type") as PathType
              );
            }

            // Update window title
            const newlyImportedFileName = jsonFilePath
              .split("\\")
              .pop()
              .split("/")
              .pop();
            ipcRenderer.send(
              UTIL_CHANNEL.SET_CURRENT_FILE_TITLE,
              newlyImportedFileName
            );

            if (!preventNavigation) changeRouteOnImport();
          });
      })
      .catch((err) => {
        abortImport();
        console.error(
          "Some error parsing data (caught in workbenchContext) !!",
          err
        );
        toast.error(
          "Some error parsing data !! \nPlease check console for more info"
        );
      });
  }

  function importJsonFile(jsonFilePath: string) {
    const payload: SQLITE_PATH_FOR_JSON_REQUEST_FORMAT = { jsonFilePath };
    ipcRenderer.send(OPEN_DIALOG_CHANNEL.SQLITE_PATH_FOR_JSON, payload);
  }

  function removeIpcListeners() {
    ipcRenderer.removeAllListeners(IMPORT_REPLY_CHANNEL.JSON);
    ipcRenderer.removeAllListeners(IMPORT_REPLY_CHANNEL.SQLITE);
    ipcRenderer.removeAllListeners(SAVE_REPLY_CHANNEL.SQLITE);
    ipcRenderer.removeAllListeners(NAVIGATION_CHANNEL);
  }

  useEffect(() => {
    removeIpcListeners();

    ipcRenderer.on(
      NAVIGATION_CHANNEL,
      (_, message: NAVIGATION_CHANNEL_MESSAGE) => navigate(message)
    );
    ipcRenderer.on(
      IMPORT_REPLY_CHANNEL.JSON,
      (_, message: JSON_IMPORT_REPLY_FORMAT) => {
        try {
          jsonParser(message.jsonFilePath, message.sqliteFilePath);
        } catch (err) {
          console.log(
            `some error importing json - ${message.jsonFilePath}`,
            err
          );
          abortImport();
          toast.error(
            `Unexpected error while importing json \nPlease check console for more info`
          );
        }
      }
    );
    ipcRenderer.on(
      IMPORT_REPLY_CHANNEL.SQLITE,
      (_, message: SQLITE_IMPORT_REPLY_FORMAT) => {
        try {
          sqliteParser(message.sqliteFilePath);
        } catch (err) {
          console.log(
            `some error importing sqlite - ${message.sqliteFilePath}`,
            err
          );
          abortImport();
          toast.error(
            `Unexpected error while importing sqlite \nPlease check console for more info`
          );
        }
      }
    );
    ipcRenderer.on(
      SAVE_REPLY_CHANNEL.SQLITE,
      (_, message: SQLITE_SAVE_REPLY_FORMAT) => {
        if (!value.db || !value.initialized) {
          return toast.error(
            "No JSON/Sqlite imported to save as new SQLite file",
            {
              type: "error",
              style: { width: 400 },
            }
          );
        }
        console.log(
          "Save sqlite with info",
          message,
          value,
          value.db?.sequelize
        );

        const newFileName = message?.sqliteFilePath;
        const oldFileName = (
          value.db?.sequelize as unknown as { options: { storage: string } }
        ).options.storage;

        if (newFileName && oldFileName) {
          const reader = electronFs.createReadStream(oldFileName);
          const writer = electronFs.createWriteStream(newFileName);
          reader.pipe(writer);
          reader.on("end", () => {
            console.log("Saved", newFileName);
            toast.success("Saved sqlite file, loading from new file");
            sqliteParser(newFileName, true);
          });
        }
      }
    );
    ipcRenderer.on(
      UTIL_CHANNEL.CLOSE_FILE,
      closeFile
    )

    // Remove all listeners on window unmount
    return () => {
      removeIpcListeners();
    };
  }, [value]);

  return (
    <WorkbenchContext.Provider
      value={{
        ...value,
        currentPath,
        currentPathType,
        loadingStatus,
        processingQuery,
        updateLoadingStatus,
        jsonParser,
        sqliteParser,
        importJsonFile,
        startImport,
        abortImport,
        closeFile,
        startProcessing: () => setProcessingQuery(true),
        endProcessing: () => setProcessingQuery(false),
        updateCurrentPath,
        goToFileInTableView,
      }}
    >
      {props.children}
    </WorkbenchContext.Provider>
  );
};

export const useWorkbenchDB = () => useContext(WorkbenchContext);
