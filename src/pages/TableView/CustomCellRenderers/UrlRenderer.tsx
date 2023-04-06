import React, { useMemo } from 'react'

interface UrlRendererProps {
  value: string,
  data: any,
  customTextField?: string,
  customHrefField?: string,
}

const UrlRenderer = (props: UrlRendererProps) => {
  const { value, data, customTextField, customHrefField } = props;

  const hasHref = Boolean(customHrefField ? data[customHrefField] : value);
  const hasText = Boolean(customTextField ? data[customTextField] : value);
  
  if(!(hasHref || hasText))
    return <></>;

  return (
    <>
      {
        hasText && !hasHref ?
        <>
          { customTextField ? data[customTextField] || value : value }
        </>
        :
        <a href={ customHrefField ? data[customHrefField] || value : value }>
          { customTextField ? data[customTextField] || value : value }
        </a>
      }
    </>
  )
}

export default UrlRenderer