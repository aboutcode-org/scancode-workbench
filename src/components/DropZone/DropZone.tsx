import { toast } from "react-toastify";
import React, { DragEvent } from "react";

import { useWorkbenchDB } from "../../contexts/dbContext";
import { filterValidFiles, getFileType } from "../../utils/files";

const DropZone = (props: React.PropsWithChildren) => {
  const { sqliteParser, importJsonFile } = useWorkbenchDB();

  function DragOverHandler(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    // TimeThrottledLogger("Drag detected", e, e.dataTransfer.files);
  }

  function DropHandler(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const validFiles = filterValidFiles(e.dataTransfer.files);
    const fileToImport = validFiles[0];

    console.log({
      validFiles,
      droppedFiles: e.dataTransfer.files,
      fileToImport,
    });

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

    const fileType = getFileType(fileToImport);

    if (fileType === "sqlite") {
      console.log("Parsing sqlite file:", fileToImport.name);
      sqliteParser(fileToImport.path);
    } else if (fileType === "json") {
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
