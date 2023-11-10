import React, { useEffect, useState } from "react";
import { Allotment } from "allotment";
import {
  Badge,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import LicenseEntity from "../../components/LicenseEntity/LicenseEntity";
import NoDataFallback from "../../components/NoDataSection";
import { QUERY_KEYS } from "../../constants/params";
import { useWorkbenchDB } from "../../contexts/dbContext";
import {
  ActiveLicenseEntity,
  LicenseClueDetails,
  LicenseDetectionDetails,
  TodoDetails,
  REVIEW_STATUS_OPTIONS,
  ReviewOption,
} from "./licenseDefinitions";
import { LicenseTypes } from "../../services/workbenchDB.types";
import { parseIfValidJson } from "../../utils/parsers";

import "./Licenses.css";

const LicenseDetections = () => {
  const [searchParams] = useSearchParams();
  const [activeLicense, setActiveLicense] =
    useState<ActiveLicenseEntity | null>(null);
  const [searchedLicense, setSearchedLicense] = useState("");
  const [reviewFilter, setReviewFilter] = useState<ReviewOption>(
    REVIEW_STATUS_OPTIONS.ALL
  );
  const [reviewedLicenses, setReviewedLicenses] = useState<Set<string>>(
    new Set()
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
  const [todos, setTodos] = useState<Map<string, TodoDetails>>(new Map());
  const { db, startProcessing, endProcessing } = useWorkbenchDB();

  useEffect(() => {
    startProcessing();

    (async () => {
      const newLicenseDetections: LicenseDetectionDetails[] = (
        await db.getAllLicenseDetections()
      ).map((detection) => ({
        id: Number(detection.getDataValue("id")),
        reviewed: detection.getDataValue("vetted"),
        detection_count: Number(detection.getDataValue("detection_count")),
        identifier: detection.getDataValue("identifier") || null,
        license_expression: detection.getDataValue("license_expression"),
        detection_log: JSON.parse(
          detection.getDataValue("detection_log") || "[]"
        ),
        matches: JSON.parse(detection.getDataValue("matches") || "[]"),
        file_regions: JSON.parse(
          detection.getDataValue("file_regions") || "[]"
        ),
      }));
      setLicenseDetections(newLicenseDetections);

      const newLicenseClues: LicenseClueDetails[] = (
        await db.getAllLicenseClues()
      ).map((clue) => {
        return {
          id: Number(clue.getDataValue("id")),
          // @TODO - Find better way to have unique identifier for each clue
          identifier: `clue-${
            clue.getDataValue("license_expression") || ""
          }-${Number(clue.getDataValue("id"))}`,
          reviewed: clue.getDataValue("vetted"),
          fileId: Number(clue.getDataValue("fileId")),
          filePath: clue.getDataValue("filePath") || "",
          fileClueIdx: Number(clue.getDataValue("fileClueIdx")),
          score:
            clue.getDataValue("score") !== null
              ? Number(clue.getDataValue("score"))
              : null,
          license_expression: clue.getDataValue("license_expression") || null,
          rule_identifier: clue.getDataValue("rule_identifier") || null,
          matches: JSON.parse(clue.getDataValue("matches") || "[]"),
          file_regions: JSON.parse(clue.getDataValue("file_regions") || "[]"),
        };
      });
      setLicenseClues(newLicenseClues);

      const newVettedLicenses = new Set<string>();
      newLicenseDetections.forEach((detection) => {
        if (detection.reviewed) {
          newVettedLicenses.add(detection.identifier);
        }
      });
      newLicenseClues.forEach((clue) => {
        if (clue.reviewed) {
          newVettedLicenses.add(clue.identifier);
        }
      });
      setReviewedLicenses(newVettedLicenses);

      const newTodos = new Map<string, TodoDetails>();
      await db.getAllTodos().then((todosList) =>
        todosList.forEach((todo) =>
          newTodos.set(todo.getDataValue("detection_id"), {
            id: Number(todo.getDataValue("id")),
            detection_id: todo.getDataValue("detection_id"),
            issues: parseIfValidJson(todo.getDataValue("issues")) || {},
          })
        )
      );
      setTodos(newTodos);

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

  const handleItemToggle = (
    license: LicenseDetectionDetails | LicenseClueDetails,
    licenseType: LicenseTypes,
    newVettedStatus: boolean
  ) => {
    function updateVettedLicenseStatus(identifier: string, newStatus: boolean) {
      setReviewedLicenses((prevVettedLicenses) => {
        const newVettedLicenses = new Set(prevVettedLicenses);
        if (newStatus) newVettedLicenses.add(identifier);
        else newVettedLicenses.delete(identifier);
        return newVettedLicenses;
      });
    }

    // const newVettedStatus = !vettedLicenses.has(license.identifier);
    db.toggleLicenseVettedStatus(
      license.id,
      licenseType,
      newVettedStatus
    ).catch((err) => {
      // Revert vetted status in UI if DB update fails
      updateVettedLicenseStatus(license.identifier, !newVettedStatus);
      console.log("Error updating vetted status: ", err);
      toast.error("Couldn't update vetted license status!");
    });

    updateVettedLicenseStatus(license.identifier, newVettedStatus);
  };

  const shownByVetFilter = (
    license: LicenseDetectionDetails | LicenseClueDetails
  ) => {
    if (reviewFilter === REVIEW_STATUS_OPTIONS.ALL) return true;
    if (reviewFilter === REVIEW_STATUS_OPTIONS.REVIEWED)
      return reviewedLicenses.has(license.identifier);
    if (reviewFilter === REVIEW_STATUS_OPTIONS.UNREVIEWED)
      return !reviewedLicenses.has(license.identifier);
    return true;
  };

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
  const DEFAULT_SECTION_HEIGHT_CAP = 0.75;
  const capSectionSize = (ratio: number) => {
    return (
      Math.max(
        1 - DEFAULT_SECTION_HEIGHT_CAP,
        Math.min(DEFAULT_SECTION_HEIGHT_CAP, ratio)
      ) *
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
      <Allotment className="license-container">
        <Allotment.Pane
          snap
          minSize={200}
          preferredSize="30%"
          className="licenses-navigator-container"
        >
          <div className="filter-group">
            <Select
              defaultValue={REVIEW_STATUS_OPTIONS.ALL}
              onChange={(newVetFilter) => setReviewFilter(newVetFilter)}
              isMulti={false}
              options={Object.values(REVIEW_STATUS_OPTIONS)}
            />
            <InputGroup className="search-box">
              <Form.Control
                aria-label="Search"
                type="search"
                placeholder="Search licenses"
                onChange={(e) => setSearchedLicense(e.target.value)}
              />
            </InputGroup>
          </div>
          <Allotment vertical snap={false} minSize={90}>
            <Allotment.Pane
              preferredSize={licenseDetectionsSectionSize}
              className="licenses-navigator-pane pb-2"
            >
              <div className="licenses-navigator-pane-title">
                <span>
                  {licenseDetections.length > 0
                    ? "License Detections"
                    : "No license detections"}
                </span>
                <OverlayTrigger
                  placement="left"
                  trigger="click"
                  overlay={
                    <Tooltip>
                      Tick the checkboxes below to mark licenses as reviewed
                    </Tooltip>
                  }
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    width={200}
                    className="info-icon"
                  />
                </OverlayTrigger>
              </div>
              <ListGroup
                hidden={licenseDetections.length === 0}
                className="licenses-list"
              >
                {licenseDetections.map((licenseDetection) => {
                  const isLicenseDetectionActive =
                    activeLicense &&
                    activeLicense.type === "detection" &&
                    activeLicense.license === licenseDetection;
                  const showDetection =
                    shownByVetFilter(licenseDetection) &&
                    licenseDetection.license_expression
                      .toLowerCase()
                      .includes(searchedLicense.toLowerCase());

                  return (
                    <ListGroupItem
                      onClick={() => activateLicenseDetection(licenseDetection)}
                      key={licenseDetection.identifier}
                      className="license-group-item"
                      style={{
                        display: showDetection ? "block" : "none",
                      }}
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
                        {todos.has(licenseDetection.identifier) && (
                          <div className="todo-indicator">
                            <FontAwesomeIcon icon={faExclamation} />
                          </div>
                        )}
                        <div className="license-count">
                          <Badge
                            pill
                            bg="light"
                            text="dark"
                            className="license-count"
                          >
                            {licenseDetection.detection_count}
                          </Badge>
                        </div>
                        <div className="vet-toggle">
                          <Form.Check
                            type="checkbox"
                            checked={reviewedLicenses.has(
                              licenseDetection.identifier
                            )}
                            onChange={(e) =>
                              handleItemToggle(
                                licenseDetection,
                                LicenseTypes.DETECTION,
                                e.target.checked
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          ></Form.Check>
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
              <ListGroup
                hidden={licenseClues.length === 0}
                className="licenses-list"
              >
                {licenseClues.map((licenseClue) => {
                  const isLicenseClueActive =
                    activeLicense &&
                    activeLicense.type === "clue" &&
                    activeLicense.license === licenseClue;
                  const showClue =
                    shownByVetFilter(licenseClue) &&
                    licenseClue.license_expression
                      .toLowerCase()
                      .includes(searchedLicense.toLowerCase());

                  return (
                    <ListGroupItem
                      onClick={() => activateLicenseClue(licenseClue)}
                      key={licenseClue.identifier}
                      className="license-group-item"
                      style={{
                        display: showClue ? "block" : "none",
                      }}
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
                        {todos.has(licenseClue.identifier) && (
                          <div className="todo-indicator">
                            <FontAwesomeIcon icon={faExclamation} />
                          </div>
                        )}
                        <div className="vet-toggle">
                          <Form.Check
                            type="checkbox"
                            checked={reviewedLicenses.has(
                              licenseClue.identifier
                            )}
                            onChange={(e) =>
                              handleItemToggle(
                                licenseClue,
                                LicenseTypes.CLUE,
                                e.target.checked
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          ></Form.Check>
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane snap minSize={500} className="license-entity-pane">
          <LicenseEntity
            activeLicenseEntity={activeLicense}
            activeLicenseTodo={todos.get(activeLicense?.license.identifier)}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default LicenseDetections;
