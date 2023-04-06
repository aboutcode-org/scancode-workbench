import React from 'react'
import { version } from '../../../package.json'

import './about.css';

const About = () => {
  return (
    <div className='help'>
      <h1>
        About ScanCode Workbench
        <span className='app-version'>
          v{version}
        </span>
      </h1>
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
      <h3>Workbench notice:</h3>
      <p>
        Provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. <br/>
        No content created from ScanCode Workbench should be considered or used as legal advice. Consult an Attorney for any legal advice. <br />
        ScanCode Workbench is a free software analysis application from nexB Inc. and others. <br/>
        Visit<a href='https://github.com/nexB/scancode-workbench'>https://github.com/nexB/scancode-workbench</a> for support and download.
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