import RcTree from 'rc-tree';
import { DataNode } from 'rc-tree/lib/interface';
import React, { useEffect, useState } from 'react';
import { useWorkbenchDB } from '../../contexts/workbenchContext';

import SwitcherIcon from './SwitcherIcon';
import defaultTreeData from './dummyTreeData';

import './FileTree.css';

const FileTree = (props: React.HTMLProps<HTMLDivElement>) => {
  const workbenchDB = useWorkbenchDB();
  const { db, initialized, importedSqliteFilePath, updateCurrentPath } = workbenchDB;

  const [treeData, setTreeData] = useState<DataNode[]>(defaultTreeData);

  useEffect(() => {
    if(!initialized || !db || !importedSqliteFilePath)
      return;
    
    db.sync
      .then(() => {
        db.findAllJSTree()
          .then((treeData) => {
            setTreeData(treeData as unknown as DataNode[]);
          });
    })
  }, [importedSqliteFilePath]);

  function selectPath(path: string){
    if(!initialized)
      return;
    // console.log("selected path:", path);
    updateCurrentPath(path);
  }

  return (
    <div className="file-tree-container" {...props}>
      <RcTree
        showLine
        treeData={treeData}
        switcherIcon={SwitcherIcon}
        onActiveChange={selectPath}
        onSelect={keys => {
          if(keys && keys[0])
            selectPath(keys[0].toString())
        }}

        // For UI testing with dummy data
        defaultExpandedKeys={['0', '0-0', '0-0-0', '0-0-0-0']}
        
        motion={{
          motionName: 'node-motion',
          motionAppear: false,
          onAppearStart: () => ({ height: 0 }),
          onAppearActive: (node: HTMLElement) => ({ height: node.scrollHeight }),
          onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
          onLeaveActive: () => ({ height: 0 }),
        }}
      />
    </div>
  )
}

export default FileTree