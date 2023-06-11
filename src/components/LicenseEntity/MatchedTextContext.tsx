import { diffWords, Change } from "diff";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  BelongsText,
  DiffInfo,
  normalizeAndCategorizeDiffs,
  splitDiffIntoLines,
} from "../../utils/text";

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
  const { db } = useWorkbenchDB();
  const [showDiffWindow, setShowDiffWindow] = useState(false);
  const [ruleDiffLines, setRuleDiffLines] = useState<Change[][] | null>(null);
  const [modifiedDiffLines, setModifiedDiffLines] = useState<Change[][] | null>(
    null
  );
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

        const ruleText = ruleRef.getDataValue("text")?.toString({}) || "";
        const matchedText = matchDetails.matched_text;
        const rawDiffs = diffWords(ruleText, matchedText, {
          ignoreCase: true,
          ignoreWhitespace: true,
        });

        const normalizedDiffs: DiffInfo[] =
          normalizeAndCategorizeDiffs(rawDiffs);

        const normalizedRuleTextLines = splitDiffIntoLines(
          normalizedDiffs.filter(
            (diff) =>
              diff.belongsTo === BelongsText.BOTH ||
              diff.belongsTo === BelongsText.ORIGINAL
          )
        );

        const normalizedModifiedTextLines = splitDiffIntoLines(
          normalizedDiffs.filter(
            (diff) =>
              diff.belongsTo === BelongsText.BOTH ||
              diff.belongsTo === BelongsText.MODIFIED
          )
        );

        setRuleDiffLines(normalizedRuleTextLines);
        setModifiedDiffLines(normalizedModifiedTextLines);
        setRuleDetails({
          processing: false,
          ruleText: ruleRef.getDataValue("text").toString({}),
        });
      }
    );
  }, [matchDetails]);

  function closeDiffWindow() {
    setShowDiffWindow(false);
    // Prevents showing fallbacks inside modal, for the transition period
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
    }, 200);
  }

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
                              <pre className="snippet">
                                {diffLine.map((diff, diffIdx) => {
                                  return (
                                    <span
                                      key={diff.value + diffIdx}
                                      className={
                                        "snippet " +
                                        (diff.removed && "removed-snippet")
                                      }
                                    >
                                      <span>{diff.value}</span>
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
                              <pre className="snippet">
                                {diffLine.map((diff, diffIdx) => {
                                  return (
                                    <span
                                      key={diff.value + diffIdx}
                                      className={
                                        diff.added ? "added-snippet" : ""
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
              <Alert variant="danger">
                Couldn't find License Rule Reference for specified identifier -{" "}
                {matchDetails.identifier}
              </Alert>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </MatchedTextContext.Provider>
  );
};

export const useMatchedTextContext = () => useContext(MatchedTextContext);
