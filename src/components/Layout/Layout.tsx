import React from 'react'
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line import/namespace
import { Allotment } from 'allotment';

import Navbar from '../Navbar/Navbar';
import FileTree from '../FileTree/FileTree'
import ImportFallback from '../ImportFallback/ImportFallback';

import { useWorkbenchDB } from '../../contexts/workbenchContext';
import { FILE_TREE_ROUTES, IMPORT_FALLBACK_ROUTES } from '../../constants/routes';

import './layout.css';
import "allotment/dist/style.css";


const Layout = (props: React.PropsWithChildren) => {
  const { pathname } = useLocation();
  const { initialized } = useWorkbenchDB();
  
  const isImportFallbackRoute = IMPORT_FALLBACK_ROUTES.find(route => pathname.includes(route)) !== undefined;
  const showFileTree = FILE_TREE_ROUTES.find(route => pathname.includes(route)) !== undefined;
  
  return (
    <div className='d-flex flex-row'>
      <Navbar />

      <Allotment className='pane-container'>
        <Allotment.Pane
          visible={showFileTree && initialized}
          minSize={120}
          maxSize={400}
          className="file-tree-pane overflow-scroll"
          preferredSize="20%"
        >
          <FileTree style={{ minHeight: "100vh" }} />
        </Allotment.Pane>
        <Allotment.Pane className='overflow-scroll content-pane'>
          <div className='content-container'>
            { isImportFallbackRoute && !initialized ?<ImportFallback /> : props.children }
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

export default Layout