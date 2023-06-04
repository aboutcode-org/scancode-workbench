import React from "react";
import { useMatchedTextContext } from "../../../../components/LicenseEntity/MatchedTextContext";

interface MatchedTextRendererProps {
  value: string;
  data: any;
}

const MatchedTextRenderer = (props: MatchedTextRendererProps) => {
  const { value, data } = props;
  const { openDiffWindow } = useMatchedTextContext();

  return (
    <a
      key={value}
      onClick={() =>
        value &&
        openDiffWindow(value, data.rule_identifier, data.start_line, data.score)
      }
    >
      {value}
    </a>
  );
};

export default MatchedTextRenderer;