import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { ROUTES } from "../../constants/routes";

import "./importFallback.css";

const ImportFallback = () => {
  return (
    <div className="import-fallback">
      <div className="position-absolute">
        <Link to={ROUTES.HOME} className="fallback-icon">
          <FontAwesomeIcon icon={faFileCirclePlus} />
        </Link>
        <h2>
          Please {"  "}
          <Link to={ROUTES.HOME}>import a scan</Link>
        </h2>
      </div>
    </div>
  );
};

export default ImportFallback;
