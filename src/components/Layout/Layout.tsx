import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line import/namespace
import { Allotment } from "allotment";

import Navbar from "../Navbar/Navbar";
import FileTree from "../FileTree/FileTree";
import ImportFallback from "../ImportFallback/ImportFallback";

import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  FILE_TREE_ROUTES,
  IMPORT_FALLBACK_ROUTES,
} from "../../constants/routes";
import ProgressLoader from "../ProgressLoader/ProgressLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import "allotment/dist/style.css";
import "./layout.css";

const Layout = (props: React.PropsWithChildren) => {
  const { pathname } = useLocation();
  const { initialized, loadingStatus, processingQuery } = useWorkbenchDB();

  const isImportFallbackRoute =
    IMPORT_FALLBACK_ROUTES.find((route) => pathname.includes(route)) !==
    undefined;
  const showFileTree =
    FILE_TREE_ROUTES.find((route) => pathname.includes(route)) !== undefined;

  // useEffect(() => {
  //   console.log("Loader status", processingQuery ? "Showing" : "Hiding");
  // }, [processingQuery]);

  return (
    <div className="d-flex flex-row">
      <Navbar />
      <Allotment className="pane-container">
        <Allotment.Pane
          visible={showFileTree && initialized}
          minSize={10}
          maxSize={600}
          className="file-tree-pane"
          preferredSize="20%"
        >
          <FileTree style={{ minHeight: "100vh" }} />
        </Allotment.Pane>
        <Allotment.Pane className="content-pane">
          <div className="content-container">
            {isImportFallbackRoute && !initialized ? (
              loadingStatus !== null ? (
                <ProgressLoader progress={loadingStatus} />
              ) : (
                <ImportFallback />
              )
            ) : (
              props.children
            )}
            {processingQuery && (
              <div className="query-processing-indicator">
                Processing <FontAwesomeIcon icon={faGear} spin />
              </div>
            )}
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default Layout;
