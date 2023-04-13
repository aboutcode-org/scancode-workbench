import React, { FunctionComponent, PropsWithChildren } from 'react'

interface EntryProps {
  name: string;
  show?: boolean;
}
const InfoEntry: FunctionComponent<PropsWithChildren<EntryProps>> = (props) => {
  if(!props.show || !props.children)
    return <></>
  return (
    <tr>
      <td>
        { props.name }
      </td>
      <td>
        { props.children }
      </td>
    </tr>
  )
}

InfoEntry.defaultProps = {
  show: true
};
export default InfoEntry