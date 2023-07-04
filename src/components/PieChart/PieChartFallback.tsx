import React from "react";
import { TailSpin } from "react-loader-spinner";

import CoreLink from "../CoreLink/CoreLink";

export interface PieChartFallbackProps {
  notOpted?: boolean;
  notOptedText: string;
  notOptedLink: string;
  noDataText?: string;
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
          {props.noDataText || "No Data"} <br />
          <br />
          {props.notOpted && (
            <CoreLink href={props.notOptedLink} external>
              {props.notOptedText}
            </CoreLink>
          )}
        </div>
      )}
    </div>
  );
};
