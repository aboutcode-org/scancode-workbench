import React from "react";

interface RegionLinesRendererProps {
  data: {
    start_line: number;
    end_line: number;
  };
}

const RegionLinesRenderer: React.FunctionComponent<RegionLinesRendererProps> = (
  props
) => {
  const { data } = props;
  return (
    <span>
      {data.start_line}
      {data.end_line !== data.start_line && <>&nbsp; - {data.end_line}</>}
    </span>
  );
};

export default RegionLinesRenderer;
