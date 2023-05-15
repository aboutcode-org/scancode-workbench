import { toast } from "react-toastify";
import React, { DragEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useWorkbenchDB } from "../../contexts/dbContext";

const lastLogs: { [key: string]: number } = {};
export const CustomLogger = (id: string, ...args: unknown[]) => {
  const currentTime = new Date().getTime();
  if (!(lastLogs[id] && currentTime < lastLogs[id] + 1000)) {
    console.log(id, ...args);
    lastLogs[id] = currentTime;
  }
};

const DropZone = (props: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const { sqliteParser, importJsonFile } = useWorkbenchDB();

  function DragOverHandler(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    // CustomLogger("Drag detected", e, e.dataTransfer.files);
  }
  function DropHandler(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const regex = {
      json: /\.(json)+$/i,
      sqlite: /\.(sqlite)+$/i,
    };

    const validFiles = Array.from(e.dataTransfer.files)
      .filter(
        (file) => file.name.match(regex.json) || file.name.match(regex.sqlite)
      )
      .filter((file) => file !== null);
    const fileToImport = validFiles[0];

    console.log("Dropped files:", e, e.dataTransfer.files);
    console.log("Valid files:", validFiles);

    if (!validFiles.length) {
      return toast.error("Only json/sqlite file can be imported !", {
        style: { width: 320 },
      });
    }

    if (validFiles.length > 1) {
      toast.warn(`Only 1 json/sqlite file can be imported at a time`, {
        style: { width: 375 },
      });
    }

    if (regex.sqlite.test(fileToImport.name)) {
      console.log("Parsing sqlite file:", fileToImport.name);
      sqliteParser(fileToImport.path);
    } else {
      console.log("Parsing json file:", fileToImport.name);
      importJsonFile(fileToImport.path);
    }
  }

  return (
    <div onDragOver={DragOverHandler} onDrop={DropHandler}>
      {props.children}
    </div>
  );
};

export default DropZone;
