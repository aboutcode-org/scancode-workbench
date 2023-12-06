import RcTree from "rc-tree";
import { Key } from "rc-tree/lib/interface";
import { Element } from "react-scroll";
import React, { useEffect, useState } from "react";

import SwitcherIcon from "./SwitcherIcon";
import EllipticLoader from "../EllipticLoader";
import { throttledScroller } from "../../utils/throttledScroll";
import { FileDataNode } from "../../services/workbenchDB";
import { PathType, useWorkbenchDB } from "../../contexts/dbContext";

import "./FileTree.css";

const FileTree = (props: React.HTMLProps<HTMLDivElement>) => {
  const {
    db,
    initialized,
    importedSqliteFilePath,
    currentPath,
    startProcessing,
    endProcessing,
    updateCurrentPath,
  } = useWorkbenchDB();

  const [treeData, setTreeData] = useState<FileDataNode[] | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (currentPath.length === 0) return;

    // Show working indicator while the FileTree Node is being rendered and focused
    startProcessing();

    setExpandedKeys((keys) => {
      return [...keys, currentPath.substring(0, currentPath.lastIndexOf("/"))];
    });

    // Scroll to selected filetree node
    // Hide working indicator after the FileTree Node is focused
    const clearThrottledScroll = throttledScroller(
      `[data-tree-node-id="${currentPath}"]`,
      () => endProcessing()
    );

    return () => {
      // Clear any pending scroll timeout
      clearThrottledScroll();
    };
  }, [currentPath]);

  useEffect(() => {
    if (!initialized || !db || !importedSqliteFilePath) {
      setTreeData(null);
      return;
    }

    db.findAllJSTree().then((treeData) => {
      // Wrap with react-scroll wrapper
      function wrapNode(node: FileDataNode) {
        const key = String(node.key);
        node.title = (
          <Element
            key={key}
            name={key}
            className="filetree-node-wrapper"
            data-tree-node-id={key}
          >
            <span>{String(node.title)}</span>
          </Element>
        );
        node.children?.forEach(wrapNode);
      }
      treeData.forEach(wrapNode);
      setTreeData(treeData);
    });
  }, [importedSqliteFilePath]);

  if (!treeData) {
    return (
      <div className="file-tree-loader">
        <div>
          Processing File Tree
          <br />
          <EllipticLoader radius={1} wrapperClass="loader" />
        </div>
      </div>
    );
  }

  return (
    <div className="file-tree-container" {...props}>
      <RcTree
        showLine
        treeData={treeData}
        switcherIcon={SwitcherIcon}
        autoExpandParent
        defaultExpandParent
        expandedKeys={expandedKeys}
        onExpand={(keys, { node, expanded }) => {
          if (!expanded) {
            const newKeys = keys.filter(
              (key) => !String(key).startsWith(String(node.key))
            );
            setExpandedKeys(newKeys);
          } else {
            setExpandedKeys(keys);
          }
        }}
        selectedKeys={[currentPath]}
        onSelect={(keys, info) => {
          if (keys && keys[0]) {
            updateCurrentPath(keys[0].toString(), info.node.type as PathType);
          }
        }}
        motion={{
          motionName: "node-motion",
          motionAppear: true,
          onAppearStart: () => ({ height: 0 }),
          onAppearActive: (node: HTMLElement) => ({
            height: node.scrollHeight,
          }),
          onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
          onLeaveActive: () => ({ height: 0 }),
        }}
      />
    </div>
  );
};

export default FileTree;
