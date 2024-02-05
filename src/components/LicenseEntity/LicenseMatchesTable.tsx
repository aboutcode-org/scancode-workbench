import React from "react";
import { Button, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  LicenseClueMatch,
  LicenseDetectionMatch,
} from "../../services/importedJsonTypes";
import MatchedTextRenderer from "./LicenseMatchCells/MatchedText";
import MatchLicenseExpressionRenderer from "./LicenseMatchCells/MatchLicenseExpression";
import { MatchedTextProvider } from "./MatchedTextContext";
import MatchRuleDetails from "./MatchRuleDetails";
import CoreLink from "../CoreLink/CoreLink";
import { useWorkbenchDB } from "../../contexts/dbContext";

interface LicenseMatchProps {
  showLIcenseText?: boolean;
  matches: LicenseClueMatch[] | LicenseDetectionMatch[];
}
const LicenseMatchesTable = (props: LicenseMatchProps) => {
  const { matches, showLIcenseText } = props;
  const { goToFileInTableView } = useWorkbenchDB();

  return (
    <MatchedTextProvider>
      <div>
        {matches.map((match, idx) => (
          <div
            className="matches-table-container"
            key={match.license_expression + "_" + idx}
          >
            <Table size="sm" bordered>
              <tbody>
                <tr>
                  <td colSpan={2}>License Expression</td>
                  <td colSpan={7}>
                    <MatchLicenseExpressionRenderer
                      matchInfo={{
                        match: match,
                        spdxLicense: false,
                      }}
                    />
                  </td>
                </tr>
                {match.spdx_license_expression && (
                  <tr>
                    <td colSpan={2}>License Expression SPDX</td>
                    <td colSpan={7}>
                      <MatchLicenseExpressionRenderer
                        matchInfo={{
                          match: match,
                          spdxLicense: true,
                        }}
                      />
                    </td>
                  </tr>
                )}
                {match.from_file && (
                  <tr>
                    <td colSpan={2}>Matched file</td>
                    <td colSpan={7}>
                      <CoreLink
                        onClick={() => goToFileInTableView(match.from_file)}
                      >
                        {match.from_file}
                      </CoreLink>
                    </td>
                  </tr>
                )}
                {showLIcenseText && (
                  <tr className="matched-text-row">
                    <td colSpan={2}>Matched Text</td>
                    <td colSpan={7}>
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
                  <td colSpan={2}>Start Line</td>
                  <td colSpan={3}>{match.start_line}</td>
                  <td colSpan={2}>End Line</td>
                  <td colSpan={2}>{match.end_line}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Matched length</td>
                  <td colSpan={3}>{match.matched_length}</td>
                  <td colSpan={2}>Match Coverage</td>
                  <td colSpan={2}>{match.match_coverage}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Score</td>
                  <td colSpan={3}>{match.score}</td>
                  <td colSpan={2}>Rule Rele ance</td>
                  <td colSpan={2}>{match.rule_relevance}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Rule</td>
                  <td colSpan={3}>
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
                  <td colSpan={2}>Matcher</td>
                  <td colSpan={2}>{match.matcher}</td>
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
