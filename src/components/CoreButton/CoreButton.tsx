import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

import './coreButton.css';

interface CoreButtonProps extends ButtonProps {
  small?: boolean
  large?: boolean
}

const CoreButton = (props: CoreButtonProps) => {
  const { large, small, className, variant, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      size={large ? 'lg' : small ? 'sm' : null}
      variant={variant || 'light'}
      className={(className || '') + ' core-button'}
    >
      { props.children }
    </Button>
  )
}

export default CoreButton