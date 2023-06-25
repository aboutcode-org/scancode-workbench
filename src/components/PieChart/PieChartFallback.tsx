import React from "react";
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export interface PieChartFallbackProps {
  noDataText: string;
  noDataLink: string;
  loading?: boolean;
}

export const PieChartFallback = (props: PieChartFallbackProps) => {
  return (
    <div className="fallback-container">
      {props.loading ? (
        <TailSpin
          radius={5}
          height={100}
          width={100}
          color="#3898fc"
          ariaLabel="loading-chart"
        />
      ) : (
        <div>
          No Data <br />
          <br />
          <a href={props.noDataLink}>
            {props.noDataText}
            &nbsp;
            <FontAwesomeIcon icon={faUpRightFromSquare} />
          </a>
        </div>
      )}
    </div>
  );
};
