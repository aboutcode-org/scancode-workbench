import React, { useMemo } from "react";
import { useMatchedTextContext } from "../../../../components/LicenseEntity/MatchedTextContext";
import { trimStringWithEllipsis } from "../../../../utils/text";
import CoreLink from "../../../../components/CoreLink/CoreLink";

interface MatchedTextRendererProps {
  value: string;
  data: any;
}

const MatchedTextRenderer = (props: MatchedTextRendererProps) => {
  const { value, data } = props;
  const { openDiffWindow } = useMatchedTextContext();

  const trimmedText = useMemo(
    () => trimStringWithEllipsis(value || "", 30),
    [value]
  );

  return (
    <CoreLink
      key={value}
      onClick={() =>
        value &&
        openDiffWindow(
          value,
          data.rule_identifier,
          data.start_line,
          data.match_coverage
        )
      }
    >
      {trimmedText}
    </CoreLink>
  );
};

export default MatchedTextRenderer;
