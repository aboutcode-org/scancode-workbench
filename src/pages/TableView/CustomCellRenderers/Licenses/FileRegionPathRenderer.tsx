import React from "react";
import { useWorkbenchDB } from "../../../../contexts/dbContext";
import CoreLink from "../../../../components/CoreLink/CoreLink";

interface FileRegionPathRendererProps {
  value: string;
}

const FileRegionPathRenderer = (
  props: FileRegionPathRendererProps
) => {
  const { value } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  return (
    <CoreLink
      className='deps-link'
      key={value}
      onClick={() => goToFileInTableView(value)}
    >
      { value }
    </CoreLink>
  );
};

export default FileRegionPathRenderer