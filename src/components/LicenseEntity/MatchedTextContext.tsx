import ReactDiffViewer, {
  DiffMethod,
  ReactDiffViewerStylesOverride,
} from "react-diff-viewer-continued";
import { Alert, Modal } from "react-bootstrap";
import { TailSpin } from "react-loader-spinner";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useWorkbenchDB } from "../../contexts/dbContext";

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
        console.log(`For ${matchDetails.identifier}, Found ref:`, ruleRef);

        if (!ruleRef) {
          return setRuleDetails({
            processing: false,
            ruleText: null,
          });
        }

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
        size={ruleDetails.ruleText?.length > 150 ? "xl" : "lg"}
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
            (ruleDetails.ruleText ? (
              <>
                <h6>Score: {matchDetails.score} %</h6>
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
