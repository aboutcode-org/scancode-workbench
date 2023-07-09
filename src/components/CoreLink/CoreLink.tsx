import React from "react";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}
const CoreLink = (props: LinkProps) => {
  const { external, children, ...anchorProps } = props;

  return (
    <a {...anchorProps}>
      {children} {external && <FontAwesomeIcon icon={faUpRightFromSquare} />}
    </a>
  );
};

export default CoreLink;
