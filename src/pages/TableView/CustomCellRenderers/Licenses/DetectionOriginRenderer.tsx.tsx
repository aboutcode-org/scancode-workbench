import React from "react";
import { faBoxOpen, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CoreLink from "../../../../components/CoreLink/CoreLink";
import { useWorkbenchDB } from "../../../../contexts/dbContext";
import { LicenseFileRegion } from "../../../../services/importedJsonTypes";

interface DetectionOriginRendererProps {
  value: string | null;
  data: LicenseFileRegion;
}

enum ORIGIN {
  FILE = "file",
  PACKAGE_DATA = "package_data",
}

const DetectionOriginRenderer = (props: DetectionOriginRendererProps) => {
  const { value, data } = props;
  const { goToFileInTableView, goToPackage } = useWorkbenchDB();

  const origin = value && value.length ? ORIGIN.PACKAGE_DATA : ORIGIN.FILE;
  
  return (
    <OverlayTrigger
      placement="left"
      delay={{ show: 200, hide: 50 }}
      overlay={
        <Tooltip style={{ position: "fixed" }}>
          {origin === ORIGIN.PACKAGE_DATA
            ? "Structured package manifest"
            : "Plain file"}
        </Tooltip>
      }
    >
      <div className="text-center">
        <CoreLink
          onClick={() =>
            origin === ORIGIN.PACKAGE_DATA
              ? goToPackage(data.from_package)
              : goToFileInTableView(data.path)
          }
        >
          <FontAwesomeIcon
            icon={origin === ORIGIN.PACKAGE_DATA ? faBoxOpen : faFileLines}
            size="lg"
            color="#0d6efd"
          />
        </CoreLink>
      </div>
    </OverlayTrigger>
  );
};

export default DetectionOriginRenderer;
