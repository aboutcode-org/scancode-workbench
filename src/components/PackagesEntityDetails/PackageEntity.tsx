import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { DependencyDetails, PackageDetails } from '../../pages/Packages/packageDefinitions'

import './entityCommonStyles.css'
import './packageEntity.css'

interface PackageEntityProps {
  package: PackageDetails,
  goToDependency: (dependency: DependencyDetails) => void,
}
const PackageEntity = (props: PackageEntityProps) => {
  const { goToDependency, package: activePackage} = props;

  if(!activePackage){
    return (
      <div>
        <h5>
          No package data found !!
        </h5>
      </div>
    )
  }
  return (
    <div className='package-entity'>
      <h5>
        { activePackage.name }
        { activePackage.version ? '@' + activePackage.version : ''}
        &nbsp; ( { activePackage.type } )
        <br/>
      </h5>
      <div className='entity-properties'>
        {
          [
            [
              <>
                { activePackage.package_uid }
                <br/>
              </>,
              ""
            ],
            [ "Type:", activePackage.type || "NA" ],
            [ "Namespace:", activePackage.namespace || "NA" ],
            [ "Name:", activePackage.name || "NA" ],
            [ "Version:", activePackage.version || "NA" ],
            [ "Subpath:", activePackage.subpath || "NA" ],
            [ "Primary Language:", activePackage.primary_language || "NA" ],
            [ "Homepage URL:", activePackage.homepage_url || "NA" ],
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
      <b>
        {
          activePackage.dependencies.length === 0 ? "No Dependencies !"
          : activePackage.dependencies.length === 1 ? "1 Dependency:"
          : `${activePackage.dependencies.length} Dependencies:`
        } 
      </b>
      <br/>
      <div className='deps-list'>
        {
          activePackage.dependencies.map(dependency => (
            <a
              className='deps-link'
              key={dependency.dependency_uid}
              onClick={() => goToDependency(dependency)}
            >
              { dependency.purl }
            </a>
          ))
        }
      </div>
      <br/>
      
      {/* <br/>
      <br/>
      <br/>
      <br/> */}
      
      Raw package:
      <ReactJson
        src={activePackage}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  )
}

export default PackageEntity