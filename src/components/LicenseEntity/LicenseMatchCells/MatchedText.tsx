import React from "react";
import { useMatchedTextContext } from "../MatchedTextContext";
import CoreLink from "../../CoreLink/CoreLink";
import { LicenseMatch } from "../../../services/importedJsonTypes";

interface MatchedTextRendererProps {
  value: string;
  match: LicenseMatch;
}

const MatchedTextRenderer = (props: MatchedTextRendererProps) => {
  const { value, match } = props;
  const { openDiffWindow } = useMatchedTextContext();

  const trimmedText = value;

  return (
    <CoreLink
      key={value}
      onClick={() =>
        value &&
        openDiffWindow(
          value,
          match.rule_identifier,
          match.start_line,
          match.match_coverage
        )
      }
    >
      {trimmedText}
    </CoreLink>
  );
};

export default MatchedTextRenderer;
