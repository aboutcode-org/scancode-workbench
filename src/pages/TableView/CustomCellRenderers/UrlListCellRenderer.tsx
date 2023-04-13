import React, { FunctionComponent, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom';

interface UrlListCellRendererProps {
  value: string,
  routerLink?: boolean,
  urlPrefix?: string,
  customUrlField?: string,
  customUrlFieldFallback?: string,
  customDisplayTextField?: string,
  customDisplayTextFieldFallback?: string,
  data: any,
}
const UrlListCellRenderer: FunctionComponent<UrlListCellRendererProps> = (props) => {
  // console.log("Got custom text field", data[customDisplayTextField]);
  const { data, value, customUrlField, customUrlFieldFallback, customDisplayTextField, customDisplayTextFieldFallback, routerLink, urlPrefix } = props;
  // console.log(`Props for ${value}:`, props);

  const parsedValue: string[][] | string[] | string = useMemo(() => {
    if(Array.isArray(value))
      return value;

    try {
      const parsed = JSON.parse(value)
      
      return parsed
    } catch(err) {
      console.log("Err parsing url list cell, showing value as it is:", value);
      return value
    }
  }, [value]);

  useEffect(() => {
    if(customUrlField)
      console.log("Parsed: ", parsedValue, data[customUrlField][0]);
  }, [customUrlField])
  
  if(!parsedValue)
    return <></>;
  
  if(!Array.isArray(parsedValue))
    return <>{ value }</>;

  return (
    <>
      {
        Array.isArray(parsedValue) ?
        parsedValue.map((subValue, i) => (
          <span key={i}>
            {
              Array.isArray(subValue) ?
              subValue.map((value, j) => (
                <span key={j}>
                  <LinkComponent
                    routerLink={routerLink}
                    urlPrefix={urlPrefix}
                    value={
                      data[customUrlField] ? data[customUrlField][i] ? data[customUrlField][i][j] : ""
                      : data[customUrlFieldFallback] ? data[customUrlFieldFallback][i] ? data[customUrlFieldFallback][i][j] : ""
                      : value
                    }
                    customDisplayText={
                      data[customDisplayTextField] ? data[customDisplayTextField][i] ? data[customDisplayTextFieldFallback][i][j] : ""
                      : data[customDisplayTextFieldFallback] ? data[customDisplayTextFieldFallback][i] ? data[customDisplayTextFieldFallback][i][j] : ""
                      : value
                    }
                  />
                  <br/>
                </span>
              ))
              :
              <LinkComponent
                routerLink={routerLink}
                urlPrefix={urlPrefix}
                value={
                  data[customUrlField] ? data[customUrlField][i]
                  : data[customUrlFieldFallback] ? data[customUrlFieldFallback][i]
                  : subValue
                }
                customDisplayText={
                  data[customDisplayTextField] ? data[customDisplayTextField][i]
                  : data[customDisplayTextFieldFallback] ? data[customDisplayTextFieldFallback][i]
                  : subValue
                }
              />
            }
            <br/>
          </span>
        ))
        : 
        <LinkComponent
          routerLink={routerLink}
          urlPrefix={urlPrefix}
          value={value}
        />
      }
      <br/>
    </>
  )
}
export default UrlListCellRenderer;





interface ListComponentProps {
  value: string,
  routerLink?: boolean,
  urlPrefix?: string,
  urlSuffix?: string,
  customDisplayText?: string,
}
const LinkComponent: FunctionComponent<ListComponentProps> = (props) => {
  const { value, routerLink, urlPrefix, urlSuffix, customDisplayText } = props;
  const URL = (urlPrefix || "") + value + (urlSuffix || "");

  return (
    <>
      {
        routerLink ?
        <Link to={URL}>
          { customDisplayText || value }
        </Link>
        :
        <a href={URL}>
          { customDisplayText || value }
        </a>
      }
    </>
  )
}