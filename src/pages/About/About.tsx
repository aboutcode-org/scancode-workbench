import React from "react";
import CoreLink from "../../components/CoreLink/CoreLink";
import { WORKBENCH_VERSION } from "../../constants/general";

import "./about.css";

const About = () => {
  return (
    <div className="about">
      <h3>
        About ScanCode Workbench
        <span className="app-version">v{WORKBENCH_VERSION}</span>
      </h3>
      <br />
      <h4>Overview</h4>
      <p>
        ScanCode Workbench allows you take the scan results from the ScanCode
        and evaluate it using charts
        <br />
        For more details, see our
        <CoreLink
          href="https://github.com/aboutcode-org/scancode-workbench/"
          external
        >
          GitHub Repository
        </CoreLink>
        .
      </p>
      <br />
      <h4>Learn More:</h4>
      <p>
        Check out the ScanCode-Workbench
        <CoreLink
          href="https://scancode-workbench.readthedocs.io/en/latest"
          external
        >
          Documentation
        </CoreLink>
        .
      </p>
      <br />
      <h4>Workbench notice:</h4>
      <p>
        Provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
        KIND, either express or implied. <br />
        No content created from ScanCode Workbench should be considered or used
        as legal advice. Consult an Attorney for any legal advice. <br />
        ScanCode Workbench is a free software analysis application from nexB
        Inc. and others. <br />
        Visit
        <CoreLink
          href="https://github.com/aboutcode-org/scancode-workbench"
          external
        >
          https://github.com/aboutcode-org/scancode-workbench
        </CoreLink>{" "}
        for support and download.
      </p>
      <br />
      <h4>Having Trouble?</h4>
      <p>
        Report a bug or request a feature on the ScanCode-Workbench.
        <CoreLink
          href="https://github.com/aboutcode-org/scancode-workbench/issues/new"
          external
        >
          Report an issue
        </CoreLink>
        .
      </p>
    </div>
  );
};

export default About;
