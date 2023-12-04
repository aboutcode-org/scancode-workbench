import React from "react";

interface NoDataFallbackProps {
  text: string;
}
const NoDataFallback = (props: NoDataFallbackProps) => {
  return (
    <div className="text-center p-5 m-5">
      <h2>{props.text || "No Data"}</h2>
    </div>
  );
};

export default NoDataFallback;
