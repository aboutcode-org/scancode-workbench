import ReactDiffViewer, {
  DiffMethod,
  ReactDiffViewerStylesOverride,
} from "react-diff-viewer-continued";
import { diffWords, Change } from "diff";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useWorkbenchDB } from "../../contexts/dbContext";
import { normalizeString, splitDiffIntoLines } from "../../utils/text";

interface MatchedTextContextProperties {
  showDiffWindow: boolean;
  openDiffWindow: (
    newMatchedText: string,
    ruleRefIdentifier: string,
    start_line: number,
    score: number
  ) => void;
}

export const defaultMatchedTextContextValue: MatchedTextContextProperties = {
  showDiffWindow: false,
  openDiffWindow: () => null,
};

const MatchedTextContext = createContext<MatchedTextContextProperties>(
  defaultMatchedTextContextValue
);

const DIFF_VIEWER_STYLES: ReactDiffViewerStylesOverride = {
  diffRemoved: {
    backgroundColor: "#e8faff",
  },
  diffAdded: {
    backgroundColor: "#f8fff1",
  },
  diffChanged: {
    backgroundColor: "#f8fff1",
  },
  variables: {
    light: {
      codeFoldGutterBackground: "#6F767E",
      codeFoldBackground: "#E2E4E5",
    },
  },
};

export const MatchedTextProvider = (
  props: React.PropsWithChildren<Record<string, unknown>>
) => {
  const { db } = useWorkbenchDB();
  const [showDiffWindow, setShowDiffWindow] = useState(false);
  const [diffs, setDiffs] = useState<Change[] | null>(null);
  const [diffLines, setDiffLines] = useState<Change[][] | null>(null);
  const [matchDetails, setMatchDetails] = useState<{
    identifier: string | null;
    matched_text: string | null;
    start_line: number;
    score: number;
  }>({
    identifier: null,
    matched_text: null,
    start_line: 1,
    score: 0,
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
        // console.log(`For ${matchDetails.identifier}, Found ref:`, ruleRef);

        if (!ruleRef) {
          return setRuleDetails({
            processing: false,
            ruleText: null,
          });
        }

        const ruleText = ruleRef.getDataValue("text")?.toString({}) || "";
        const matchedText = matchDetails.matched_text;
        const diffsDetected = diffWords(ruleText, matchedText, {
          ignoreCase: true,
          ignoreWhitespace: true,
        });

        console.log("Raw diff", diffsDetected);
        const normalizedDiffs: Change[] = diffsDetected.map((diff) => {
          {
            const changeDetected = Boolean(diff.added || diff.removed);
            const normalizedValue = normalizeString(diff.value);

            // No change / Trivial diff
            if (!changeDetected || normalizedValue.length === 0) {
              return {
                value: diff.value,
                count: diff.count,
              };
            }

            return {
              ...(diff.added
                ? { added: true }
                : diff.removed
                ? { removed: true }
                : {}),
              value: diff.value,
              count: diff.count,
              trimmedValue: normalizedValue,
            };
          }
        });
        const normalizedDiffLines = splitDiffIntoLines(normalizedDiffs);
        setDiffs(normalizedDiffs);
        setDiffLines(normalizedDiffLines);

        const additions = normalizedDiffs.filter((diff) => diff.added).length;
        const deletions = normalizedDiffs.filter((diff) => diff.removed).length;
        console.log(
          `Normalized diff with ${additions} additions & ${deletions} deletions \n`,
          {
            normalizedDiffs,
            diffLines: normalizedDiffLines,
          }
        );

        setRuleDetails({
          processing: false,
          ruleText: ruleRef.getDataValue("text").toString({}),
        });
      }
    );
  }, [matchDetails]);

  function closeDiffWindow() {
    setMatchDetails({
      matched_text: null,
      identifier: null,
      start_line: 0,
      score: 0,
    });
    setRuleDetails({
      ruleText: null,
      processing: false,
    });
    setShowDiffWindow(false);
    setDiffs(null);
  }

  return (
    <MatchedTextContext.Provider
      value={{
        showDiffWindow,
        openDiffWindow: (
          matched_text: string,
          rule_identifier: string,
          start_line: number,
          score: number
        ) => {
          if (!matched_text) return;
          setMatchDetails({
            identifier: rule_identifier,
            matched_text: matched_text,
            start_line,
            score,
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
          ) : (
            matchDetails.matched_text &&
            (diffs ? (
              <>
                <h6>Score: {matchDetails.score} %</h6>
                <Row>
                  <Col sm={12} md={6}>
                    <pre>
                      {diffs.map((diff, diffIdx) => {
                        return (
                          <span
                            key={diff.value + diffIdx}
                            className={
                              "snippet " + (diff.removed && "removed-snippet")
                            }
                          >
                            {diff.added ? "" : diff.value}
                          </span>
                        );
                      })}
                    </pre>
                  </Col>
                  <Col sm={12} md={6}>
                    <pre>
                      {diffs.map((diff, diffIdx) => {
                        return (
                          <span
                            key={diff.value + diffIdx}
                            className={
                              "snippet " + (diff.added && "added-snippet")
                            }
                          >
                            {diff.removed ? "" : diff.value}
                          </span>
                        );
                      })}
                    </pre>
                  </Col>
                </Row>
                <h6>New lined</h6>
                <Row>
                  <Col sm={12} md={6}>
                    {diffLines.map((diffLine, idx) => (
                      // @TODO - Better key for this
                      <p
                        key={diffLine.length + ":" + idx}
                        className="diff-line"
                      >
                        {diffLine.map((diff, diffIdx) => {
                          return (
                            <span
                              key={diff.value + diffIdx}
                              className={
                                "snippet " + (diff.removed && "removed-snippet")
                              }
                            >
                              {diff.added ? "" : diff.value}
                            </span>
                          );
                        })}
                      </p>
                    ))}
                  </Col>
                  <Col sm={12} md={6}>
                    {diffLines.map((diffLine, idx) => (
                      // @TODO - Better key for this
                      <p
                        key={diffLine.length + ":" + idx}
                        className="diff-line"
                      >
                        {diffLine.map((diff, diffIdx) => {
                          return (
                            <span
                              key={diff.value + diffIdx}
                              className={
                                "snippet " + (diff.added && "added-snippet")
                              }
                            >
                              {diff.removed ? "" : diff.value}
                            </span>
                          );
                        })}
                      </p>
                    ))}
                  </Col>
                </Row>
                <ReactDiffViewer
                  oldValue={ruleDetails.ruleText}
                  newValue={matchDetails.matched_text}
                  linesOffset={matchDetails.start_line - 1}
                  splitView={true}
                  compareMethod={DiffMethod.WORDS}
                  styles={DIFF_VIEWER_STYLES}
                  extraLinesSurroundingDiff={0}
                  leftTitle="Rule Text"
                  rightTitle="Matched Text"
                />
              </>
            ) : (
              <div>
                <h6>Score: {matchDetails.score} %</h6>
                <h6>Matched Text:</h6>
                <pre>{matchDetails.matched_text}</pre>
                <Alert variant="danger">
                  Couldn't find License Rule Reference for specified identifier
                  - {matchDetails.identifier}
                </Alert>
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </MatchedTextContext.Provider>
  );
};

export const useMatchedTextContext = () => useContext(MatchedTextContext);
