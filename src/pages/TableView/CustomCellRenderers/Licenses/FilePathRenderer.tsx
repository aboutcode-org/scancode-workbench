import React from "react";
import { useWorkbenchDB } from "../../../../contexts/dbContext";
import CoreLink from "../../../../components/CoreLink/CoreLink";

interface FilePathRendererProps {
  value: string;
  iconComponent?: React.ReactNode;
}

const FilePathRenderer = (props: FilePathRendererProps) => {
  const { value, iconComponent } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  return (
    <CoreLink key={value} onClick={() => goToFileInTableView(value)}>
      {value} {iconComponent || <></>}
    </CoreLink>
  );
};

export default FilePathRenderer;
