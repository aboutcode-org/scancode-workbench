// import sqlite3 from 'sqlite3'
import moment from 'moment'
import electron from 'electron'
import * as electronFs from "fs"
import * as electronOs from "os"
import { toast } from 'react-toastify'
import React, { useMemo, useState } from 'react'
// import remote from '@electron/remote'
// import remoteMain from '@electron/remote/main'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faFileImport, faFloppyDisk, faFolder } from '@fortawesome/free-solid-svg-icons'

import { useWorkbenchDB } from '../../contexts/workbenchContext'
import CoreButton from '../../components/CoreButton/CoreButton';

import { GetHistory, HistoryItem, RemoveEntry } from '../../services/historyStore'

import { OPEN_DIALOG_CHANNEL } from '../../constants/IpcConnection';

import './home.css'
import ProgressLoader from '../../components/ProgressLoader/ProgressLoader'

const { ipcRenderer } = electron;

console.log("Deps:", {
  electron,
  electronFs,
  electronOs,
  ipcRenderer,
  platform: electronOs.platform(),
  // remote,
  // sqlite3,
  // remoteMain,
});

// const electronDialog = electron.dialog;
// console.log('electron.dialog', electronDialog);

// const sqlite3Window = window.require('sqlite3');
// console.log("Sqlite 3 required", sqlite3Window);
// console.log("Sqlite 3 imported === required", sqlite3Window === sqlite3);


const Home = () => {
  const {
    db,
    loadingStatus,
    initialized,
    jsonParser,
    sqliteParser,
    importedSqliteFilePath,
  } = useWorkbenchDB();
  
  const [historyRefreshToken, setRefreshToken] = useState(0);
  const refreshHistory = () => setRefreshToken(Math.random());
  const history = useMemo(GetHistory, [importedSqliteFilePath, db, historyRefreshToken]);

  function ReportInvalidEntry(entry: HistoryItem, entryType: string){
    toast(`Selected ${entryType} file doesn't exist`, { type: 'error' });
    RemoveEntry(entry);
    refreshHistory();
  }

  function historyItemParser(historyItem: HistoryItem){
    if(historyItem.json_path){
      if (!electronFs.existsSync(historyItem.json_path)) {
        return ReportInvalidEntry(historyItem, "JSON");
      }
      jsonParser(historyItem.json_path, historyItem.sqlite_path);
    } else {
      if (!electronFs.existsSync(historyItem.sqlite_path)) {
        return ReportInvalidEntry(historyItem, "SQLite");
      }
      sqliteParser(historyItem.sqlite_path)
    }
  }

  // Import a ScanCode JSON file and create a SQLite database
  const openJsonFile = () => ipcRenderer.send(OPEN_DIALOG_CHANNEL.JSON);

  // Import already created SQLite database
  const openSqliteFile = () => ipcRenderer.send(OPEN_DIALOG_CHANNEL.SQLITE);

  // Copy already created/imported sqlite file to new sqlite file, and
  // update path of workbench DB to new sqlite DB
  const saveSqliteFile = () => ipcRenderer.send(OPEN_DIALOG_CHANNEL.SAVE_SQLITE);

  if(!initialized && loadingStatus !== null){
    return <ProgressLoader progress={loadingStatus} />
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
                <FontAwesomeIcon
                  icon={faFolder}
                  className="quickActionIcon"
                />
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
            <div className="history">
              <br/>
              <h4>Recent files </h4>
              <table>
                <tbody>
                {
                  history.map((historyItem, idx) => (
                    <tr key={historyItem.json_path + idx}>
                      <td>
                        <CoreButton onClick={() => historyItemParser(historyItem)}>
                          Import
                          <FontAwesomeIcon icon={faFileImport} />
                        </CoreButton>
                      </td>

                      <td className='file-path'>
                        { historyItem.json_path || historyItem.sqlite_path }
                      </td>

                      <td>
                        <span style={{ marginLeft: 20 }}>
                          {moment(historyItem.opened_at).fromNow()}
                        </span>
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
            <div className="quicklinks">
              <br/>
              <h4>Quick Links </h4>
              <div
                className="btn-group-horizontal"
                role="group"
              >
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
}

export default Home;