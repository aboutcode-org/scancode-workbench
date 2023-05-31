import { Allotment } from "allotment";
import React, { useEffect, useState } from "react";
import { Badge, ListGroup, ListGroupItem } from "react-bootstrap";
import { ThreeDots } from "react-loader-spinner";
import { useSearchParams } from "react-router-dom";

import LicenseEntity from "../../components/LicenseEntity/LicenseEntity";
import NoDataFallback from "../../components/NoDataSection";
import { QUERY_KEYS } from "../../constants/params";
import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  ActiveLicense,
  LicenseClueDetails,
  LicenseDetectionDetails,
} from "./licenseDefinitions";

import "./Licenses.css";

const LicenseDetections = () => {
  const [searchParams] = useSearchParams();
  const [activeLicense, setActiveLicense] = useState<ActiveLicense | null>(
    null
  );
  function activateLicenseDetection(licenseDetection: LicenseDetectionDetails) {
    if (!licenseDetection) return;
    setActiveLicense({
      type: "detection",
      license: licenseDetection,
    });
  }
  function activateLicenseClue(licenseClue: LicenseClueDetails) {
    if (!licenseClue) return;
    setActiveLicense({
      type: "clue",
      license: licenseClue,
    });
  }

  const [licenseDetections, setLicenseDetections] = useState<
    LicenseDetectionDetails[] | null
  >(null);
  const [licenseClues, setLicenseClues] = useState<LicenseClueDetails[] | null>(
    null
  );
  const { db, startProcessing, endProcessing } = useWorkbenchDB();

  useEffect(() => {
    startProcessing();

    (async () => {
      const newLicenseDetections: LicenseDetectionDetails[] = (
        await db.getAllLicenseDetections()
      ).map((detection) => ({
        detection_count: Number(detection.getDataValue("detection_count")),
        identifier: detection.getDataValue("identifier")?.toString({}) || null,
        license_expression: detection
          .getDataValue("license_expression")
          ?.toString({}),
        detection_log: JSON.parse(
          detection.getDataValue("detection_log")?.toString({}) || "[]"
        ),
        matches: JSON.parse(
          detection.getDataValue("matches")?.toString({}) || "[]"
        ),
        file_regions: JSON.parse(
          detection.getDataValue("file_regions")?.toString({}) || "[]"
        ),
      }));
      setLicenseDetections(newLicenseDetections);

      const newLicenseClues: LicenseClueDetails[] = (
        await db.getAllLicenseClues()
      ).map((clue) => {
        return {
          id: Number(clue.getDataValue("id")),
          fileId: Number(clue.getDataValue("fileId")),
          filePath: clue.getDataValue("filePath").toString({}) || "",
          fileClueIdx: Number(clue.getDataValue("fileClueIdx")),
          score:
            clue.getDataValue("score") !== null
              ? Number(clue.getDataValue("score"))
              : null,
          license_expression:
            clue.getDataValue("license_expression")?.toString({}) || null,
          rule_identifier:
            clue.getDataValue("rule_identifier")?.toString({}) || null,
          matches: JSON.parse(
            clue.getDataValue("matches")?.toString({}) || "[]"
          ),
          file_regions: JSON.parse(
            clue.getDataValue("file_regions")?.toString({}) || "[]"
          ),
        };
      });
      setLicenseClues(newLicenseClues);

      const queriedDetectionIdentifier: string | null = searchParams.get(
        QUERY_KEYS.LICENSE_DETECTION
      );
      const queriedClueExpression = searchParams.get(
        QUERY_KEYS.LICENSE_CLUE_EXPRESSION
      );
      const queriedClueFilePath = searchParams.get(
        QUERY_KEYS.LICENSE_CLUE_FILE_PATH
      );
      const queriedClueFileIdx = Number(
        searchParams.get(QUERY_KEYS.LICENSE_CLUE_FILE_CLUE_IDX) || 0
      );

      if (queriedDetectionIdentifier) {
        const queriedDetection: LicenseDetectionDetails | null =
          queriedDetectionIdentifier
            ? newLicenseDetections.find(
                (detection) =>
                  detection.identifier == queriedDetectionIdentifier
              )
            : null;
        if (queriedDetection) {
          console.log(
            `Activate queried detection (${queriedDetectionIdentifier}): `,
            queriedDetection
          );
          activateLicenseDetection(queriedDetection);
        }
      } else if (queriedClueExpression && queriedClueFilePath) {
        const queriedClue = newLicenseClues.find(
          (clue) =>
            clue.license_expression === queriedClueExpression &&
            clue.filePath === queriedClueFilePath &&
            clue.fileClueIdx === queriedClueFileIdx
        );
        // console.log(
        //   "Queried",
        //   {
        //     queriedClueExpression,
        //     queriedClueFilePath,
        //     queriedClueFileIdx,
        //   },
        //   "Found",
        //   { foundClue: queriedClue }
        // );
        if (queriedClue) {
          console.log(
            `Activate queried clue (${queriedClueExpression}, ${queriedClueFilePath}): `,
            queriedClue
          );
          activateLicenseClue(queriedClue);
        }
      } else {
        if (newLicenseDetections.length > 0) {
          activateLicenseDetection(newLicenseDetections[0]);
        } else if (newLicenseClues.length > 0) {
          activateLicenseClue(newLicenseClues[0]);
        }
      }
    })().then(endProcessing);
  }, []);

  if (!licenseDetections || !licenseClues) {
    return (
      <ThreeDots
        height={150}
        width={150}
        radius={30}
        color="#3D7BFF"
        ariaLabel="three-dots-loading"
        wrapperClass="license-detections-loader"
        visible={true}
      />
    );
  }

  const totalLicenses = licenseDetections.length + licenseClues.length;
  const MAX_SECTION_HEIGHT = 0.75;
  const capSectionSize = (ratio: number) => {
    return (
      Math.max(1 - MAX_SECTION_HEIGHT, Math.min(MAX_SECTION_HEIGHT, ratio)) *
        100 +
      "%"
    );
  };
  const licenseDetectionsSectionSize = capSectionSize(
    licenseDetections.length / totalLicenses
  );

  if (!licenseDetections.length && !licenseClues.length)
    return (
      <NoDataFallback text="No license detections or clues available :/" />
    );

  return (
    <div>
      <h4 className="license-detections-title">License Detections</h4>

      <Allotment className="license-container">
        <Allotment.Pane
          snap
          minSize={200}
          preferredSize="25%"
          className="licenses-navigator-container"
        >
          <Allotment vertical>
            <Allotment.Pane
              preferredSize={licenseDetectionsSectionSize}
              className="licenses-navigator-pane pb-2"
            >
              <div className="licenses-navigator-pane-title">
                {licenseDetections.length > 0
                  ? "License Detections"
                  : "No license detections"}
              </div>
              <ListGroup hidden={licenseDetections.length === 0}>
                {licenseDetections.map((licenseDetection) => {
                  const isLicenseDetectionActive =
                    activeLicense &&
                    activeLicense.type === "detection" &&
                    activeLicense.license === licenseDetection;
                  return (
                    <ListGroupItem
                      onClick={() => activateLicenseDetection(licenseDetection)}
                      key={licenseDetection.identifier}
                      className="license-group-item"
                    >
                      <div
                        className={
                          "license-item " +
                          (isLicenseDetectionActive ? "selected-license " : "")
                        }
                      >
                        <div className="expression">
                          {licenseDetection.license_expression}
                        </div>
                        <div className="license-count">
                          <Badge pill className="license-count">
                            {licenseDetection.detection_count}
                          </Badge>
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Allotment.Pane>
            <Allotment.Pane className="licenses-navigator-pane pt-2">
              <div className="licenses-navigator-pane-title">
                {licenseClues.length > 0 ? "License Clues" : "No License Clues"}
              </div>
              <ListGroup hidden={licenseClues.length === 0}>
                {licenseClues.map((licenseClue) => {
                  const isLicenseClueActive =
                    activeLicense &&
                    activeLicense.type === "clue" &&
                    activeLicense.license === licenseClue;
                  return (
                    <ListGroupItem
                      onClick={() => activateLicenseClue(licenseClue)}
                      key={licenseClue.id}
                      className="license-group-item"
                    >
                      <div
                        className={
                          "license-item " +
                          (isLicenseClueActive ? "selected-license" : "")
                        }
                      >
                        <div className="expression">
                          {licenseClue.license_expression}
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={500}
          className="license-entity-panes p-4 overflow-scroll"
        >
          <LicenseEntity activeLicense={activeLicense} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default LicenseDetections;
