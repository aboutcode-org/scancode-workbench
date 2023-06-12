import React from "react";
import { useWorkbenchDB } from "../../../../contexts/dbContext";

interface FileRegionPathRendererProps {
  value: string;
}

const FileRegionPathRenderer = (
  props: FileRegionPathRendererProps
) => {
  const { value } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  return (
    <a
      className='deps-link'
      key={value}
      onClick={() => goToFileInTableView(value)}
    >
      { value }
    </a>
  );
};

export default FileRegionPathRenderer