import React from 'react'
import { Badge } from 'react-bootstrap';
import ReactJson from '@microlink/react-json-view';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCogs } from '@fortawesome/free-solid-svg-icons';

import { DependencyDetails } from '../../pages/Packages/packageDefinitions'
import { DependencyScopeMapping } from './dependencyScopeMapper';

import './entityCommonStyles.css'
import './dependencyEntity.css'

interface DependencyEntityProps {
  dependency: DependencyDetails,
  goToPackageByUID: (package_uid: string) => void,
}
const DependencyEntity = (props: DependencyEntityProps) => {
  const { goToPackageByUID, dependency: activeDependency} = props;

  if(!activeDependency){
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
        { activeDependency.purl }
      </h5>
      {
        activeDependency.is_runtime ?
          <Badge pill bg="primary">
            <FontAwesomeIcon icon={faCogs} />
            { ' ' } Runtime
          </Badge>
        : activeDependency.is_optional ?
          <Badge pill bg="dark">
            {
              DependencyScopeMapping[activeDependency.scope] ?
              <>
                <FontAwesomeIcon
                  icon={DependencyScopeMapping[activeDependency.scope].icon}
                />
                { " " } { DependencyScopeMapping[activeDependency.scope].text}
              </>
              : "Optional"
            }
          </Badge>
        : ""
      }
      {
        activeDependency.is_resolved && 
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
              <a onClick={() => goToPackageByUID(activeDependency.for_package_uid)}>
                { activeDependency.for_package_uid || "NA" }
              </a>
            ],
            [ "Scope:", activeDependency.scope || "NA" ],
            [ "Extracted requirement:", activeDependency.extracted_requirement || "NA" ],
            [ "Data file:", activeDependency.datafile_path || "NA" ],
            [ "Data source ID", activeDependency.datasource_id || "NA" ],
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
        activeDependency.is_resolved && activeDependency.resolved_package &&
        <div>
          Resolved package:
          <ReactJson
            src={activeDependency.resolved_package as Record<string, unknown>}
            enableClipboard={false}
            displayDataTypes={false}
            collapsed={0}
          />
        </div>
      }
      <br/>
      Raw package:
      <ReactJson
        src={activeDependency || {}}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  )
}

export default DependencyEntity