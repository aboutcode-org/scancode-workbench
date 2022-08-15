import React from 'react'

import './about.css';

const About = () => {
  return (
    <div className='help'>
      <h1>About ScanCode Workbench</h1>
      <br/>
      <h3>Overview</h3>
      <p>
          ScanCode Workbench allows you take the scan results
          from the ScanCode and evaluate it using charts
          <br/>
          For more details, see our
          <a href="https://github.com/nexB/scancode-workbench/">GitHub Repository</a>.
      </p>
      <br/>
      <h3>Learn More:</h3>
      <p>
          Check out the ScanCode-Workbench
          <a href="https://scancode-workbench.readthedocs.io">Documentation</a>.
      </p>
      <br/>
      <h3>Having Trouble?</h3>
      <p>
          Report a bug or request a feature on the ScanCode-Workbench.
          <a href="https://github.com/nexB/scancode-workbench/issues/new">Report an issue</a>.
      </p>
    </div>
  )
}

export default About