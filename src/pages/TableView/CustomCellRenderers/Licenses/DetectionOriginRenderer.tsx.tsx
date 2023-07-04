import React from "react";
import { faBoxOpen, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DetectionOriginRendererProps {
  value: boolean;
  data: unknown;
}

const DetectionOriginRenderer = (props: DetectionOriginRendererProps) => {
  const { value } = props;

  return (
    // <OverlayTrigger
    //   placement="right"
    //   trigger={["focus", "hover"]}
    //   overlay={() => (
    //     <Tooltip id="button-tooltip" {...props}>
    //       {value ? "Structured package manifest" : "Plain file"}
    //     </Tooltip>
    //   )}
    // >
      <FontAwesomeIcon
        icon={value ? faBoxOpen : faFileLines}
        size="lg"
        color="#035228"
      />
    // </OverlayTrigger>
  );
};

export default DetectionOriginRenderer;
