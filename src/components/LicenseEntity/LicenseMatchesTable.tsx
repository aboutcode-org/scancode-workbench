import React from "react";
import {
  LicenseClueMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";
import { Table } from "react-bootstrap";
import MatchedTextRenderer from "./LicenseMatchCells/MatchedText";
import MatchLicenseExpressionRenderer from "./LicenseMatchCells/MatchLicenseExpression";
import CoreLink from "../CoreLink/CoreLink";
import { LicenseTypes } from "../../services/workbenchDB.types";
import { MatchedTextProvider } from "./MatchedTextContext";

interface LicenseMatchProps {
  showLIcenseText?: boolean;
  matchesInfo:
    | {
        licenseType: LicenseTypes.DETECTION;
        matches: LicenseDetectionMatch[];
      }
    | {
        licenseType: LicenseTypes.CLUE;
        matches: LicenseClueMatch[];
      };
}
const LicenseMatchesTable = (props: LicenseMatchProps) => {
  const { matchesInfo, showLIcenseText } = props;

  return (
    <MatchedTextProvider>
      <div>
        {matchesInfo.matches.map((match, idx) => (
          <div
            className="matches-table-container"
            key={match.license_expression + "_" + idx}
          >
            <Table size="sm" bordered>
              <tbody>
                <tr>
                  <td>License Expression</td>
                  <td>
                    <MatchLicenseExpressionRenderer
                      matchInfo={{
                        match: match,
                        spdxLicense: false,
                      }}
                    />
                  </td>
                </tr>
                {showLIcenseText && (
                  <tr className="matched-text-row">
                    <td>Matched Text</td>
                    <td>
                      <div>
                        <MatchedTextRenderer
                          match={match}
                          value={match.matched_text}
                        />
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Score</td>
                  <td>{match.score}</td>
                </tr>
                <tr>
                  <td>Matched length</td>
                  <td>{match.matched_length}</td>
                </tr>
                <tr>
                  <td>Match Coverage</td>
                  <td>{match.match_coverage}</td>
                </tr>
                <tr>
                  <td>Matcher</td>
                  <td>{match.matcher}</td>
                </tr>
                <tr>
                  <td>Rule URL</td>
                  <td>
                    <CoreLink href={match.rule_url} external>
                      {match.rule_identifier}
                    </CoreLink>
                  </td>
                </tr>
                {matchesInfo.licenseType === LicenseTypes.DETECTION && (
                  <tr>
                    <td>License Expression SPDX</td>
                    <td>
                      <MatchLicenseExpressionRenderer
                        matchInfo={{
                          match: match,
                          spdxLicense: true,
                        }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </MatchedTextProvider>
  );
};

export default LicenseMatchesTable;
