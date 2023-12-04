import React from "react";
import {
  LicenseClueMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";
import { Button, OverlayTrigger, Popover, Table } from "react-bootstrap";
import MatchedTextRenderer from "./LicenseMatchCells/MatchedText";
import MatchLicenseExpressionRenderer from "./LicenseMatchCells/MatchLicenseExpression";
import { LicenseTypes } from "../../services/workbenchDB.types";
import { MatchedTextProvider } from "./MatchedTextContext";
import MatchRuleDetails from "./MatchRuleDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import CoreLink from "../CoreLink/CoreLink";

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
                  <td colSpan={3}>
                    <MatchLicenseExpressionRenderer
                      matchInfo={{
                        match: match,
                        spdxLicense: false,
                      }}
                    />
                  </td>
                </tr>
                {matchesInfo.licenseType === LicenseTypes.DETECTION &&
                  (match as LicenseDetectionMatch)?.license_expression_spdx && (
                    <tr>
                      <td>License Expression SPDX</td>
                      <td colSpan={3}>
                        <MatchLicenseExpressionRenderer
                          matchInfo={{
                            match: match,
                            spdxLicense: true,
                          }}
                        />
                      </td>
                    </tr>
                  )}
                {showLIcenseText && (
                  <tr className="matched-text-row">
                    <td>Matched Text</td>
                    <td colSpan={3}>
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
                  <td>Matched length</td>
                  <td>{match.matched_length}</td>
                  <td>Match Coverage</td>
                  <td>{match.match_coverage}</td>
                </tr>
                <tr>
                  <td>Score</td>
                  <td>{match.score}</td>
                  <td>Rule Relevance</td>
                  <td>{match.rule_relevance}</td>
                </tr>
                <tr>
                  <td>Rule</td>
                  <td>
                    <span>
                      <span>
                        {match.rule_url ? (
                          <CoreLink external href={match.rule_url || null}>
                            {match.rule_identifier}
                          </CoreLink>
                        ) : (
                          match.rule_identifier
                        )}
                      </span>
                      <OverlayTrigger
                        trigger={["click"]}
                        placement="right"
                        rootClose
                        transition={false}
                        delay={{ show: 200, hide: 300 }}
                        overlay={
                          <Popover className="rule-popover">
                            <Popover.Body>
                              <MatchRuleDetails match={match} />
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Button className="ms-3 p-0 border-0 bg-transparent cursor-pointer rule-info-button">
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td>Matcher</td>
                  <td>{match.matcher}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </MatchedTextProvider>
  );
};

export default LicenseMatchesTable;
