import React from "react";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TickRendererProps {
  value: boolean;
  data: unknown;
}

const TickRenderer = (props: TickRendererProps) => {
  const { value } = props;

  const icon = value ? faCheck : faX;
  const color = value ? "#03ba00" : "#ff2b2b";

  return (
    <>
      <span>
        <FontAwesomeIcon
          icon={icon}
          size="lg"
          style={{
            color,
          }}
        />
      </span>
    </>
  );
};

export default TickRenderer;
