import React, { ReactElement } from "react";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  customIcon?: ReactElement;
  fontawesomeIcon?: IconProp;
}
const CoreLink = (props: LinkProps) => {
  const { external, customIcon, fontawesomeIcon, children, ...anchorProps } =
    props;

  return (
    <a {...anchorProps}>
      {children}
      &nbsp;
      {customIcon ? (
        customIcon
      ) : fontawesomeIcon ? (
        <FontAwesomeIcon icon={fontawesomeIcon} />
      ) : (
        external && <FontAwesomeIcon icon={faUpRightFromSquare} />
      )}
    </a>
  );
};

export default CoreLink;
