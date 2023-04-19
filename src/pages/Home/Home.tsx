import moment from "moment";
import electron from "electron";
import * as electronFs from "fs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";

import {
  faCogs,
  faDatabase,
  faFileCode,
  faFloppyDisk,
  faFolder,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useWorkbenchDB } from "../../contexts/workbenchContext";
import CoreButton from "../../components/CoreButton/CoreButton";
import ProgressLoader from "../../components/ProgressLoader/ProgressLoader";

import { OPEN_DIALOG_CHANNEL } from "../../constants/IpcConnection";
import {
  GetHistory,
  HistoryItem,
  RemoveEntry,
} from "../../services/historyStore";

import "./home.css";

const { ipcRenderer } = electron;

const Home = () => {
  const {
    db,
    loadingStatus,
    initialized,
    jsonParser,
    sqliteParser,
    importedSqliteFilePath,
  } = useWorkbenchDB();

  const navigate = useNavigate();
  const [historyRefreshToken, setRefreshToken] = useState(0);
  const refreshHistory = () => setRefreshToken(Math.random());
  const history = useMemo(GetHistory, [
    importedSqliteFilePath,
    db,
    historyRefreshToken,
  ]);

  function deleteEntry(entry: HistoryItem, showToast = true) {
    RemoveEntry(entry);
    refreshHistory();
    if (showToast) toast.success("Removed item");
  }
  function reportInvalidEntry(entry: HistoryItem, entryType: string) {
    toast.error(`Selected ${entryType} file doesn't exist`);
    deleteEntry(entry, false);
  }

  function historyItemParser(historyItem: HistoryItem) {
    if (historyItem.json_path) {
      if (!electronFs.existsSync(historyItem.json_path)) {
        return reportInvalidEntry(historyItem, "JSON");
      }
      jsonParser(historyItem.json_path, historyItem.sqlite_path);
    } else {
      if (!electronFs.existsSync(historyItem.sqlite_path)) {
        return reportInvalidEntry(historyItem, "SQLite");
      }
      sqliteParser(historyItem.sqlite_path);
    }
  }

  // Import a ScanCode JSON file and create a SQLite database
  const openJsonFile = () => ipcRenderer.send(OPEN_DIALOG_CHANNEL.JSON);

  // Import already created SQLite database
  const openSqliteFile = () => ipcRenderer.send(OPEN_DIALOG_CHANNEL.SQLITE);

  // Copy already created/imported sqlite file to new sqlite file, and
  // update path of workbench DB to new sqlite DB
  const saveSqliteFile = () =>
    ipcRenderer.send(OPEN_DIALOG_CHANNEL.SAVE_SQLITE);

  if (!initialized && loadingStatus !== null) {
    return <ProgressLoader progress={loadingStatus} />;
  }

  return (
    <div className="home-page">
      <div className="tab-pane" id="tab-welcomepage">
        <div>
          <div id="welcomepage-title">
            <h2>ScanCode Workbench</h2>
            {/* <h2 className="logo">
              <span className="strong-logo">Scan</span>
              Code Workbench
            </h2> */}
          </div>
          <div id="welcomepage-view">
            <div className="quickActions">
              <div onClick={openJsonFile}>
                <FontAwesomeIcon icon={faCogs} className="quickActionIcon" />
                <h5>Import ScanCode JSON</h5>
              </div>
              <div onClick={openSqliteFile}>
                <FontAwesomeIcon icon={faFolder} className="quickActionIcon" />
                <h5>Open SQLite File</h5>
              </div>
              <div onClick={saveSqliteFile}>
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  className="quickActionIcon"
                />
                <h5>Save SQLite File</h5>
              </div>
            </div>
            <div className="drop-instruction">
              <h5>
                OR Simply drop your json / sqlite file anywhere in the app !!
              </h5>
            </div>
            <div className="history">
              <br />
              <h4>Recent files </h4>
              <table>
                <tbody>
                  {history.map((historyItem, idx) => (
                    <tr
                      key={
                        historyItem.json_path || historyItem.sqlite_path + idx
                      }
                    >
                      <td className="import-column">
                        <CoreButton
                          onClick={() => historyItemParser(historyItem)}
                        >
                          {historyItem.json_path ? "Import" : "Open  "}
                          <FontAwesomeIcon
                            icon={
                              historyItem.json_path ? faFileCode : faDatabase
                            }
                          />
                        </CoreButton>
                      </td>

                      <td className="file-path">
                        {historyItem.json_path || historyItem.sqlite_path}
                      </td>

                      <td>
                        <span style={{ marginLeft: 20 }}>
                          {moment(historyItem.opened_at).fromNow()}
                        </span>
                      </td>

                      <td className="delete-col">
                        <span
                          data-tip="Remove this item?"
                          className="delete-action"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteEntry(historyItem)}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="quicklinks">
              <br />
              <h4>Quick Links </h4>
              <div className="btn-group-horizontal" role="group">
                <CoreButton
                  large
                  href="https://github.com/nexB/scancode-workbench/"
                >
                  GitHub Repository
                </CoreButton>
                <CoreButton
                  large
                  href="https://scancode-workbench.readthedocs.io/"
                >
                  Getting Started with Scancode Workbench
                </CoreButton>
                <CoreButton
                  large
                  href="https://github.com/nexB/scancode-workbench/issues"
                >
                  Report a Bug or Request a Feature
                </CoreButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
