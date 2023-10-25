import React from "react";

export const FontAwesomeTreeNodeStyles: React.CSSProperties = {
  cursor: 'pointer',
  backgroundColor: 'white',
  fontSize: 14,
  width: 16,
  height: 16,
  verticalAlign: '-.125em',
}
export  const arrowPath =
  'M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z';


export const getTreeNodeIconFromSvgPath = (path: string, iStyle = {}, style = {}) => (
  <i style={iStyle}>
    <svg
      viewBox="0 0 320 512"
      width="1em"
      height="1em"
      fill="currentColor"
      style={{
        verticalAlign: '-.125em',
        ...style
      }}
    >
      <path d={path} />
    </svg>
  </i>
);

// export const getTreeNodeIconIclass = (className: string) => {
//   return (
//     <i
//       style={{
//         width: 16,
//         height: 16,
//         fontSize: 14,
//         cursor: 'pointer',
//         verticalAlign: '-.125em',
//         backgroundColor: 'white',
//       }}
//       className={className}
//     />
//   );
// }

export const getTreeNodeIconCustomComponent = (Component: React.FunctionComponent<React.SVGAttributes<SVGElement>>) => {
  return <i style={{ cursor: 'pointer', backgroundColor: 'white', fontSize: 14 }}>
    <Component
      style={{
        width: 16,
        height: 16,
        verticalAlign: '-.125em',
      }}
    />
  </i>;
}