import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// For previous react versions
// import * as ReactDOM from 'react-dom';
// export function renderReactApp() {
//   console.log("Setting up react using older method");
//   const container = document.getElementById('app');
//   ReactDOM.render(<App />, container);
// }

// For react 18 onwards
export function renderReactApp() {
  const container = document.getElementById('app');
  if(container){
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.log("Container for react app not found :(");
    console.log("Container:", container);
  }
}