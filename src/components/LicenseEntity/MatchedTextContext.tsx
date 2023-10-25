import { Alert, Col, Modal, Row } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  BelongsIndicator,
  DiffComponents,
  diffStrings,
  splitDiffIntoLines,
} from "../../utils/text";
import { ScanOptionKeys } from "../../utils/parsers";
import { SYNTHETIC_RULE_PREFIXES } from "../../constants/licenseRules";

import "./matchedText.css";

interface MatchedTextContextProperties {
  showDiffWindow: boolean;
  openDiffWindow: (
    newMatchedText: string,
    ruleRefIdentifier: string,
    start_line: number,
    coverage: number
  ) => void;
}

export const defaultMatchedTextContextValue: MatchedTextContextProperties = {
  showDiffWindow: false,
  openDiffWindow: () => null,
};

const MatchedTextContext = createContext<MatchedTextContextProperties>(
  defaultMatchedTextContextValue
);

export const MatchedTextProvider = (
  props: React.PropsWithChildren<Record<string, unknown>>
) => {
  const { db, scanInfo } = useWorkbenchDB();
  const [showDiffWindow, setShowDiffWindow] = useState(false);
  const [ruleDiffLines, setRuleDiffLines] = useState<DiffComponents[][] | null>(
    null
  );
  const [modifiedDiffLines, setModifiedDiffLines] = useState<
    DiffComponents[][] | null
  >(null);
  const [matchDetails, setMatchDetails] = useState<{
    identifier: string | null;
    matched_text: string | null;
    start_line: number;
    coverage: number;
  }>({
    identifier: null,
    matched_text: null,
    start_line: 1,
    coverage: 0,
  });

  const [ruleDetails, setRuleDetails] = useState<{
    ruleText: string | null;
    processing: boolean;
  }>({ ruleText: "", processing: false });

  useEffect(() => {
    if (!matchDetails.identifier) return;
    setRuleDetails((prev) => ({ ...prev, processing: true }));

    db.getLicenseRuleReference(matchDetails.identifier, ["text"]).then(
      (ruleRef) => {
        if (!ruleRef) {
          return setRuleDetails({
            processing: false,
            ruleText: null,
          });
        }

        const ruleText = ruleRef.getDataValue("text") || "";
        const matchedText = matchDetails.matched_text;

        const diffs = diffStrings(ruleText, matchedText);
        const newRuleTextLines = splitDiffIntoLines(
          diffs.filter(
            (diff) =>
              diff.belongsTo === BelongsIndicator.BOTH ||
              diff.belongsTo === BelongsIndicator.ORIGINAL
          )
        );
        const newModifiedTextLines = splitDiffIntoLines(
          diffs.filter(
            (diff) =>
              diff.belongsTo === BelongsIndicator.BOTH ||
              diff.belongsTo === BelongsIndicator.MODIFIED
          )
        );

        setRuleDiffLines(newRuleTextLines);
        setModifiedDiffLines(newModifiedTextLines);
        setRuleDetails({
          processing: false,
          ruleText,
        });
      }
    );
  }, [matchDetails]);

  function closeDiffWindow() {
    setShowDiffWindow(false);
    // Hiding diff winodw first, ensures fallbacks inside modal are hidden during the transition
    setTimeout(() => {
      setRuleDiffLines(null);
      setModifiedDiffLines(null);
      setMatchDetails({
        matched_text: null,
        identifier: null,
        start_line: 0,
        coverage: 0,
      });
      setRuleDetails({
        ruleText: null,
        processing: false,
      });
    }, 100);
  }

  const isSyntheticRule =
    matchDetails.identifier &&
    SYNTHETIC_RULE_PREFIXES.some((prefix) =>
      matchDetails.identifier.startsWith(prefix)
    );

  return (
    <MatchedTextContext.Provider
      value={{
        showDiffWindow,
        openDiffWindow: (
          matched_text: string,
          rule_identifier: string,
          start_line: number,
          coverage: number
        ) => {
          if (!matched_text) return;
          setMatchDetails({
            identifier: rule_identifier,
            matched_text: matched_text,
            start_line,
            coverage: coverage,
          });
          setShowDiffWindow(true);
        },
      }}
    >
      {props.children}

      <Modal
        size="xl"
        // size={ruleDetails.ruleText?.length > 150 ? "xl" : "lg"}
        centered
        backdrop={true}
        show={showDiffWindow}
        onHide={closeDiffWindow}
      >
        <Modal.Header closeButton>
          <Modal.Title>Matched text diff</Modal.Title>
        </Modal.Header>
        <Modal.Body className="matched-text-diff-modal">
          {ruleDetails.processing ? (
            <h5 className="text-center">
              Fetching rule data
              <TailSpin
                height={30}
                width={30}
                color="#3898fc"
                ariaLabel="fetching ..."
                wrapperClass="d-inline-block mx-4"
              />
            </h5>
          ) : matchDetails.matched_text && ruleDetails.ruleText ? (
            ruleDiffLines &&
            modifiedDiffLines && (
              <>
                <h6>Coverage: {matchDetails.coverage} %</h6>
                <Row>
                  <Col sm={12} md={6} className="rule-text-section">
                    <table className="diff-table">
                      <thead>
                        <tr>
                          <th>Rule Text</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ruleDiffLines.map((diffLine, idx) => (
                          // @TODO - Better key for this
                          <tr
                            key={diffLine.length + ":" + idx}
                            className="diff-line"
                          >
                            <td className="line-content">
                              <pre className="line-text">
                                {diffLine.map((diff, diffIdx) => {
                                  return (
                                    <span
                                      key={diff.value + diffIdx}
                                      className={
                                        diff.diffComponent === "removed"
                                          ? "removed-snippet"
                                          : ""
                                      }
                                    >
                                      {diff.value}
                                    </span>
                                  );
                                })}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                  <Col sm={12} md={6} className="matched-text-section">
                    <table className="diff-table">
                      <thead>
                        <tr>
                          <th>Matched Text</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modifiedDiffLines.map((diffLine, idx) => (
                          // @TODO - Better key for this
                          <tr
                            key={diffLine.length + ":" + idx}
                            className="diff-line"
                          >
                            <td className="line-number">
                              {matchDetails.start_line + idx}.
                            </td>
                            <td className="line-content">
                              <pre className="line-text">
                                {diffLine.map((diff, diffIdx) => {
                                  return (
                                    <span
                                      key={diff.value + diffIdx}
                                      className={
                                        diff.diffComponent === "added"
                                          ? "added-snippet"
                                          : ""
                                      }
                                    >
                                      {diff.value}
                                    </span>
                                  );
                                })}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </>
            )
          ) : (
            <div>
              <h6>Coverage: {matchDetails.coverage} %</h6>
              <h6>Matched Text:</h6>
              <pre>{matchDetails.matched_text}</pre>
              {isSyntheticRule ? (
                <Alert variant="primary">
                  Rule text is not available for synthetic rules <br />
                  Current rule - {matchDetails.identifier}
                </Alert>
              ) : scanInfo.optionsMap.get(ScanOptionKeys.LICENSE_REFERENCES) ? (
                <Alert variant="danger">
                  {/*
                  Unable to find reference, although license-references option is enabled in scan
                  (Edge case - If there's a bug in sct or detecting synthetic prefixes)
                  */}
                  Couldn't find License Rule Reference for specified identifier
                  - {matchDetails.identifier}
                </Alert>
              ) : (
                <Alert variant="primary">
                  Please use{" "}
                  <Alert.Link
                    href="https://scancode-toolkit.readthedocs.io/en/stable/cli-reference/scan-options-post.html#license-references-option"
                    className="text-decoration-underline"
                  >
                    --license-references
                  </Alert.Link>{" "}
                  CLI option with your scan to see the rule text, and the diff
                  between rule/matched text
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </MatchedTextContext.Provider>
  );
};

export const useMatchedTextContext = () => useContext(MatchedTextContext);
