import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import DropZone from "./components/DropZone/DropZone";
import Layout from "./components/Layout/Layout";
import { ROUTES } from "./constants/routes";
import { WorkbenchDBProvider } from "./contexts/dbContext";
import { WorkbenchStateProvider } from "./contexts/stateContext";
import About from "./pages/About/About";
import ChartView from "./pages/ChartView/ChartView";
import FileInfoDash from "./pages/FileInfoDash/FileInfoDash";
import Home from "./pages/Home/Home";
import Licenses from "./pages/Licenses/Licenses";
import LicenseInfoDash from "./pages/LicenseInfoDash/LicenseInfoDash";
import CopyrightInfoDash from "./pages/CopyrightInfoDash/CopyrightInfoDash";
import PackageInfoDash from "./pages/PackageInfoDash/PackageInfoDash";
import DependencyInfoDash from "./pages/DependencyInfoDash/DependencyInfoDash";
import Packages from "./pages/Packages/Packages";
import PageNotFound from "./pages/PageNotFound";
import ScanInfo from "./pages/ScanInfo/ScanInfo";
import TableView from "./pages/TableView/TableView";

import "./utils/ensureRendererDeps";
import "./fontawesome";

import "rc-tree/assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css";
import "./styles/app.css";
import "./styles/toastify.css";
import "./styles/dashStyles.css";
import "./styles/customFaColors.css";

const App = () => {
  return (
    <HashRouter basename="/">
      <WorkbenchStateProvider>
        <WorkbenchDBProvider>
          <DropZone>
            <Layout>
              <Routes>
                <Route path={ROUTES.HOME}>
                  <Route index element={<Home />} />
                  <Route path={ROUTES.ABOUT} element={<About />} />
                  <Route path={ROUTES.TABLE_VIEW} element={<TableView />} />
                  <Route
                    path={ROUTES.FILE_DASHBOARD}
                    element={<FileInfoDash />}
                  />
                  <Route
                    path={ROUTES.LICENSE_DASHBOARD}
                    element={<LicenseInfoDash />}
                  />
                  <Route
                    path={ROUTES.COPYRIGHT_DASHBOARD}
                    element={<CopyrightInfoDash />}
                  />
                  <Route
                    path={ROUTES.PACKAGE_DASHBOARD}
                    element={<PackageInfoDash />}
                  />
                  <Route
                    path={ROUTES.DEPENDENCY_DASHBOARD}
                    element={<DependencyInfoDash />}
                  />
                  <Route path={ROUTES.LICENSES} element={<Licenses />} />
                  <Route path={ROUTES.PACKAGES} element={<Packages />} />
                  <Route path={ROUTES.CHART_SUMMARY} element={<ChartView />} />
                  <Route path={ROUTES.SCAN_INFO} element={<ScanInfo />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Layout>

            {/* Provider for toasts */}
            <ToastContainer
              limit={1}
              draggable
              closeOnClick
              hideProgressBar={false}
              autoClose={2000}
              position="bottom-center"
            />
          </DropZone>
        </WorkbenchDBProvider>
      </WorkbenchStateProvider>
    </HashRouter>
  );
};

export default App;
