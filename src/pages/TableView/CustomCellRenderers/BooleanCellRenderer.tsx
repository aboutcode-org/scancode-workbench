import React from "react";

interface BooleanCellRendererProps {
  value: boolean;
}
const BooleanCellRenderer: React.FunctionComponent<BooleanCellRendererProps> = (
  props
) => {
  return props.value ? "Yes" : "No";
};

export default BooleanCellRenderer;
