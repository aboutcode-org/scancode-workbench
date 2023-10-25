import RcTree from "rc-tree";
import { Key } from "rc-tree/lib/interface";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Element } from "react-scroll";
import scrollIntoView from "scroll-into-view-if-needed";

import EllipticLoader from "../EllipticLoader";
import SwitcherIcon from "./SwitcherIcon";
import { PathType, useWorkbenchDB } from "../../contexts/dbContext";
import { FileDataNode } from "../../services/workbenchDB";

import "./FileTree.css";

const FOCUS_ATTEMPT_DELAY = 500;

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

  useLayoutEffect(() => {
    if (currentPath.length === 0) return;

    // Show working indicator while the FileTree Node is being rendered and focused
    startProcessing();

    setExpandedKeys((keys) => {
      return [...keys, currentPath.substring(0, currentPath.lastIndexOf("/"))];
    });

    function scrollTreeNode(targetNode: HTMLElement) {
      scrollIntoView(targetNode, {
        scrollMode: "if-needed",
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }

    // Timeout ensures that targetNode is accessed only after its rendered
    let pendingScrollerTimeoutId: NodeJS.Timeout;

    const alreadyRenderedTargetNode =
      document.getElementsByName(currentPath)[0];
      
    if (alreadyRenderedTargetNode) {
      // Immediate scroll possible
      scrollTreeNode(alreadyRenderedTargetNode);
      endProcessing();
    } else {
      // Wait for target node to render
      pendingScrollerTimeoutId = setTimeout(() => {
        const targetNode = document.getElementsByName(currentPath)[0];

        if (targetNode) {
          pendingScrollerTimeoutId = setTimeout(() => {
            scrollTreeNode(targetNode);
          }, FOCUS_ATTEMPT_DELAY);

          // Hide working indicator after the FileTree Node is focused
          endProcessing();
        }
      });
    }

    return () => {
      clearTimeout(pendingScrollerTimeoutId);
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
          <Element key={key} name={key} className="filetree-node-wrapper">
            <span>{String(node.title)}</span>
          </Element>
        );
        node.children?.forEach(wrapNode);
      }
      treeData.forEach(wrapNode);
      setTreeData(treeData);
    });
  }, [importedSqliteFilePath]);

  function selectPath(path: string, pathType: PathType) {
    if (!initialized) return;
    updateCurrentPath(path, pathType);
  }

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
            selectPath(keys[0].toString(), info.node.type as PathType);
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
