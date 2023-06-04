import RcTree from "rc-tree";
import { DataNode, Key } from "rc-tree/lib/interface";
import React, { useEffect, useState } from "react";
import { Element, scroller } from "react-scroll";

import EllipticLoader from "../EllipticLoader";
import { PathType, useWorkbenchDB } from "../../contexts/dbContext";

import SwitcherIcon from "./SwitcherIcon";
import { scrollToDomElement } from "../../utils/dom";

import "./FileTree.css";

const FileTree = (props: React.HTMLProps<HTMLDivElement>) => {
  const workbenchDB = useWorkbenchDB();
  const {
    db,
    initialized,
    importedSqliteFilePath,
    currentPath,
    updateCurrentPath,
  } = workbenchDB;

  const [treeData, setTreeData] = useState<DataNode[] | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  useEffect(() => {
    setExpandedKeys((keys) => {
      // console.log(
      //   "Adding",
      //   currentPath.substring(0, currentPath.lastIndexOf("/")),
      //   [...keys, currentPath.substring(0, currentPath.lastIndexOf("/"))]
      // );
      return [...keys, currentPath.substring(0, currentPath.lastIndexOf("/"))];
    });
    if (currentPath.length) {
      setTimeout(() => {
        const targetNode = document.getElementsByName(currentPath)[0];
        if (targetNode) {
          // scrollToDomElement(targetNode, { yOffset: -50 });
          targetNode.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        }
        // scroller.scrollTo(currentPath, {
        //   duration: 0,
        //   delay: 30,
        //   smooth: "easeInOutQuart",
        // });
      }, 500);
    }
  }, [currentPath]);

  useEffect(() => {
    if (!initialized || !db || !importedSqliteFilePath) return;

    db.sync.then(() => {
      db.findAllJSTree().then((treeData) => {
        console.log("Filetree data", treeData);

        // Wrap with react-scroll wrapper
        function wrapNode(node: DataNode) {
          const key = String(node.key);
          node.title = (
            <Element
              key={key}
              name={key}
              className="filetree-node-wrapper"
            >
              <span>{String(node.title)}</span>
              {/* <span id={key}>{String(node.title)}</span> */}
            </Element>
          );
          node.children?.forEach(wrapNode);
        }
        treeData.forEach(wrapNode);
        setTreeData(treeData as unknown as DataNode[]);
      });
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

  // console.log("Filetree", {
  //   currentPath,
  //   selectedKeys: [currentPath],
  //   defaultExpanded: [currentPath.substring(0, currentPath.lastIndexOf("/"))],
  // });

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
            console.log("On collapse keys", newKeys);
            setExpandedKeys(newKeys);
          } else {
            console.log("New expanded", keys);
            setExpandedKeys(keys);
          }
        }}
        selectedKeys={[currentPath]}
        onSelect={(keys, info) => {
          if (keys && keys[0]) {
            selectPath(keys[0].toString(), (info.node as any).dataValues.type);
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
