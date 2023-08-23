import React from "react";
import { useWorkbenchDB } from "../../../../contexts/dbContext";
import CoreLink from "../../../../components/CoreLink/CoreLink";

interface FilePathRendererProps {
  value: string;
}

const FilePathRenderer = (props: FilePathRendererProps) => {
  const { value } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  return (
    <CoreLink key={value} onClick={() => goToFileInTableView(value)}>
      {value}
    </CoreLink>
  );
};

export default FilePathRenderer;
