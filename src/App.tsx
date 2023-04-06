import React from 'react'
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import { ROUTES } from './constants/routes';
import { WorkbenchDBProvider } from './contexts/workbenchContext';

import Layout from './components/Layout/Layout';
import DropZone from './components/DropZone/DropZone';

import Home from './pages/Home/Home'
import TableView from './pages/TableView/TableView';
import FileInfoDash from './pages/FileInfoDash/FileInfoDash';
import LicenseInfoDash from './pages/LicenseInfoDash/LicenseInfoDash';
import PackageInfoDash from './pages/PackageInfoDash/PackageInfoDash';
import Packages from './pages/Packages/Packages';
import ChartView from './pages/ChartView/ChartView';
import ScanInfo from './pages/ScanInfo/ScanInfo';
import About from './pages/About/About';
import PageNotFound from './pages/PageNotFound';

import './fontawesome';
import 'rc-tree/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tooltip/dist/react-tooltip.css'

import './app.css';
import './dashStyles.css';
import './customFaColors.css';
import LicenseDetections from './pages/LicenseDetections/LicenseDetections';

const App = () => {
  return (
    <HashRouter>
      <WorkbenchDBProvider>
        <DropZone>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME}>
                <Route index element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.TABLE_VIEW} element={<TableView />} />
                <Route path={ROUTES.FILE_DASHBOARD} element={<FileInfoDash />} />
                <Route path={ROUTES.LICENSE_DASHBOARD} element={<LicenseInfoDash />} />
                <Route path={ROUTES.PACKAGE_DASHBOARD} element={<PackageInfoDash />} />
                <Route path={ROUTES.LICENSE_DETECTIONS} element={<LicenseDetections />} />
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
            position='bottom-center'
          />
        </DropZone>
      </WorkbenchDBProvider>
    </HashRouter>
  )
}

export default App