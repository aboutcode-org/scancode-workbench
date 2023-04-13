import React, { useEffect } from 'react'
import { Badge } from 'react-bootstrap';
import ReactJson from '@microlink/react-json-view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCogs } from '@fortawesome/free-solid-svg-icons';

import { DependencyDetails } from '../../pages/Packages/packageDefinitions'
import { DependencyScopeMapping } from './dependencyScopeMapper';

import '../../styles/entityCommonStyles.css';
import './dependencyEntity.css'

interface DependencyEntityProps {
  dependency: DependencyDetails,
  goToPackageByUID: (package_uid: string) => void,
}
const DependencyEntity = (props: DependencyEntityProps) => {
  const { goToPackageByUID, dependency: dependency} = props;

  useEffect(() => {
    console.log("Active dep", dependency);
  }, [dependency])

  if(!dependency){
    return (
      <div>
        <h5>
          No dependency data found !!
        </h5>
      </div>
    )
  }
  return (
    <div className='dependency-entity'>
      <h5>
        { dependency.purl }
      </h5>
      {
        dependency.is_runtime ?
          <Badge pill bg="primary">
            <FontAwesomeIcon icon={faCogs} />
            { ' ' } Runtime
          </Badge>
        : dependency.is_optional ?
          <Badge pill bg="dark">
            {
              DependencyScopeMapping[dependency.scope] ?
              <>
                <FontAwesomeIcon icon={DependencyScopeMapping[dependency.scope].icon} />
                { " " } { DependencyScopeMapping[dependency.scope].text}
              </>
              : dependency.scope || "Optional"
            }
          </Badge>
        : ""
      }
      {
        dependency.is_resolved && 
        <Badge pill bg="success">
          <FontAwesomeIcon icon={faCheck} />
          { ' ' } Resolved
        </Badge>
      }
      <br/>
      <br/>
      <div className='entity-properties'>
        {
          [
            [
              "For:", 
              dependency.for_package_uid ?
              <a onClick={() => goToPackageByUID(dependency.for_package_uid)}>
                { dependency.for_package_uid || "NA" }
              </a>
              : <>NA</>
            ],
            [ "Scope:", dependency.scope || "NA" ],
            [ "Extracted requirement:", dependency.extracted_requirement || "NA" ],
            [ "Data file:", dependency.datafile_path || "NA" ],
            [ "Data source ID", dependency.datasource_id || "NA" ],
          ].map(entry => (
            <React.Fragment key={entry[0].toString()}>
              <span className='property'>
                { entry[0] || "" }
              </span>
              <span className='value'>
                { entry[1] || "" }
              </span>
              <br/>
            </React.Fragment>
          ))
        }
      </div>
      <br/>
      {
        dependency.is_resolved && dependency.resolved_package &&
        <div>
          Resolved package:
          <ReactJson
            src={dependency.resolved_package as Record<string, unknown>}
            enableClipboard={false}
            displayDataTypes={false}
            collapsed={0}
          />
        </div>
      }
      <br/>
      Raw package:
      <ReactJson
        src={dependency || {}}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  )
}

export default DependencyEntity