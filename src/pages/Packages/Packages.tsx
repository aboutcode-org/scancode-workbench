// eslint-disable-next-line import/namespace
import { Allotment } from "allotment";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Collapse,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import MultiSelect from "react-select";
import makeAnimated from "react-select/animated";
import { ThreeDots } from "react-loader-spinner";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  DatasourceFilter,
  DepFilterTag,
  DepFilterTags,
  DepFilterTagsList,
} from "./filters";
import { MISC_DEPS, getMiscPackage } from "./miscPackage";
import { generatePackagesMapping } from "./packageParsers";
import NoDataFallback from "../../components/NoDataSection";
import DependencyEntity from "../../components/PackagesEntityDetails/DependencyEntity";
import PackageEntity from "../../components/PackagesEntityDetails/PackageEntity";
import { QUERY_KEYS } from "../../constants/params";
import { useWorkbenchDB } from "../../contexts/dbContext";
import { DEPENDENCY_SCOPES } from "../../services/models/dependencies";
import {
  DependencyDetails,
  PackageDetails,
  PackageTypeGroupDetails,
} from "./packageDefinitions";
import { throttledScroller } from "../../utils/throttledScroll";

import "./packages.css";

const animatedComponents = makeAnimated();

const Packages = () => {
  const workbenchDB = useWorkbenchDB();
  const {
    db,
    initialized,
    goToFileInTableView,
    startProcessing,
    endProcessing,
  } = workbenchDB;
  const [searchParams] = useSearchParams();
  const [dataSourceIDs, setDataSourceIDs] = useState<DatasourceFilter[]>([]);
  const [selectedDataSourceIDs, setSelectedDataSourceIDs] = useState<
    DatasourceFilter[]
  >([]);
  const [selectedDepFilters, setSelectedDepFilters] = useState<DepFilterTag[]>(
    []
  );

  const [expandedPackageTypes, setExpandedPackageTypes] = useState<string[]>(
    []
  );
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [packagesWithDeps, setPackagesWithDeps] = useState<
    PackageDetails[] | null
  >(null);
  const [allPackageGroups, setAllPackageGroups] = useState<
    PackageTypeGroupDetails[] | null
  >(null);

  const [activePackage, setActivePackage] = useState<PackageDetails | null>(
    null
  );
  const [activeDependency, setActiveDependency] =
    useState<DependencyDetails | null>(null);
  const [activeEntityType, setActiveEntityType] = useState<
    "package" | "dependency" | null
  >(null);

  function expandPackageType(packageType: string) {
    setExpandedPackageTypes((prevTypes) => [...prevTypes, packageType]);
  }
  function collapsePackageType(packageType: string) {
    setExpandedPackageTypes((prevTypes) =>
      prevTypes.filter((pkgType) => pkgType != packageType)
    );
  }
  function toggleDepTagFilter(depFilter: DepFilterTag, e: React.MouseEvent) {
    if (selectedDepFilters.includes(depFilter))
      setSelectedDepFilters((prevDepFilters) =>
        prevDepFilters.filter((dep) => dep != depFilter)
      );
    else
      setSelectedDepFilters((prevDepFilters) => [...prevDepFilters, depFilter]);
    if (e) e.preventDefault();
  }

  function collapsePackage(target_package_uid: string, e?: React.MouseEvent) {
    setExpandedPackages((prevPackages) =>
      prevPackages.filter((package_uid) => package_uid !== target_package_uid)
    );
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  function expandPackage(target_package_uid: string, e?: React.MouseEvent) {
    setExpandedPackages((prevPackages) => [
      ...prevPackages,
      target_package_uid,
    ]);
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const activatePackage = (packageInfo: PackageDetails) => {
    setActiveDependency(null);
    setActivePackage(packageInfo);
    setActiveEntityType("package");
    expandPackageType(packageInfo.type);
  };
  const activatePackageByUID = (package_uid: string) => {
    const targetPackage = packagesWithDeps?.find(
      (packageInfo) => packageInfo.package_uid === package_uid
    );
    if (package_uid && targetPackage) {
      activatePackage(targetPackage);
    }
  };
  const activateDependency = (dependency: DependencyDetails) => {
    setActivePackage(null);
    setActiveDependency(dependency);
    setActiveEntityType("dependency");
    // Ensure package of target dependency is expanded too
    const parentPackage = packagesWithDeps.find((packageDetails) =>
      packageDetails.dependencies.find((dep) => dep === dependency)
    );
    expandPackage(parentPackage.package_uid);
  };

  useEffect(() => {
    if (!activePackage && !activeDependency) return;
  
    const clearThrottledScroll = throttledScroller(
      activePackage
        ? `[data-package-uid="${activePackage.package_uid}"]`
        : `[data-dependency-uid="${activeDependency.dependency_uid}"]`
    );

    return () => {
      // Clear any pending scroll timeout
      clearThrottledScroll();
    };
  }, [activePackage, activeDependency]);

  useEffect(() => {
    const queriedPackageUid = searchParams.get(QUERY_KEYS.PACKAGE);
    if (!queriedPackageUid) return;
    if (packagesWithDeps && packagesWithDeps.length)
      activatePackageByUID(queriedPackageUid);
  }, [searchParams]);

  useEffect(() => {
    if (!initialized || !db) return;

    startProcessing();
    db.sync
      .then(async () => {
        const packages = await db.getAllPackages();
        const deps = await db.getAllDependencies();
        // console.log("Raw Packages & deps", packages, deps);
        if (!packages.length && !deps.length) {
          console.log("No package or deps available");
          setAllPackageGroups([]);
          return;
        }

        const packageMapping = generatePackagesMapping(packages);
        packageMapping.set(MISC_DEPS, getMiscPackage());

        const uniqueDataSourceIDs = new Set(
          deps.map((dep) => dep.getDataValue("datasource_id"))
        );
        setDataSourceIDs(
          Array.from(uniqueDataSourceIDs.values()).map((dataSourceID) => ({
            label: dataSourceID,
            value: dataSourceID,
          }))
        );

        // Group dependencies in their respective packages
        deps.forEach((dependencyInfo) => {
          const targetPackageUid: string | null =
            dependencyInfo.getDataValue("for_package_uid");
          packageMapping.get(targetPackageUid || MISC_DEPS).dependencies.push({
            // ...dependencyInfo,     // For debugging
            purl: dependencyInfo.getDataValue("purl"),
            extracted_requirement:
              dependencyInfo.getDataValue("extracted_requirement") || "",
            scope: dependencyInfo.getDataValue("scope") as DEPENDENCY_SCOPES,
            is_runtime: dependencyInfo.getDataValue("is_runtime"),
            is_optional: dependencyInfo.getDataValue("is_optional"),
            is_resolved: dependencyInfo.getDataValue("is_resolved"),
            resolved_package: JSON.parse(
              dependencyInfo.getDataValue("resolved_package") || "{}"
            ),
            dependency_uid: dependencyInfo.getDataValue("dependency_uid"),
            for_package_uid:
              dependencyInfo.getDataValue("for_package_uid") || null,
            datafile_path: dependencyInfo.getDataValue("datafile_path"),
            datasource_id: dependencyInfo.getDataValue("datasource_id"),
          });
        });

        // Ignore misc deps if none found
        if (!packageMapping.get(MISC_DEPS).dependencies.length) {
          packageMapping.delete(MISC_DEPS);
        }

        const parsedPackageWithDeps = Array.from(packageMapping.values());
        // @TODO - What are qualifiers ?
        parsedPackageWithDeps.forEach((pkg) => {
          if (Object.keys(pkg.qualifiers).length)
            console.log("Qualifying:", pkg);
        });
        // console.log("Packages with deps:", parsedPackageWithDeps);
        setPackagesWithDeps(parsedPackageWithDeps);

        // Group packages in their respective package type group
        const packageGroupMapping = new Map<string, PackageDetails[]>();
        parsedPackageWithDeps.forEach((packageDetails) => {
          if (!packageGroupMapping.has(packageDetails.type)) {
            packageGroupMapping.set(packageDetails.type, []);
          }
          packageGroupMapping.get(packageDetails.type).push(packageDetails);
        });
        const parsedPackageGroups = Array.from(
          packageGroupMapping.entries()
        ).map(
          ([type, packages]): PackageTypeGroupDetails => ({
            type,
            packages,
          })
        );
        setAllPackageGroups(parsedPackageGroups);
        // console.log("Package groups", parsedPackageGroups);
        setExpandedPackages([]);

        // Select package based on query or default
        const queriedPackageUid = searchParams.get(QUERY_KEYS.PACKAGE);
        const queriedPackage = parsedPackageWithDeps.find(
          (packageInfo) => packageInfo.package_uid === queriedPackageUid
        );
        if (queriedPackage) {
          activatePackage(queriedPackage);
          console.log(
            `Activate queried package(${queriedPackageUid}): `,
            queriedPackage
          );
        } else {
          activatePackage(parsedPackageWithDeps[0]);
        }
      })
      .then(endProcessing);
  }, []);

  const [filteredPackageGroups, setFilteredPackageGroups] =
    useState<PackageTypeGroupDetails[]>(null);

  useEffect(() => {
    if (
      !allPackageGroups?.length ||
      (!selectedDepFilters.length && !selectedDataSourceIDs.length)
    ) {
      return setFilteredPackageGroups(
        allPackageGroups?.sort((a, b) => b.packages.length - a.packages.length)
      );
    }

    const allowedDepFlags = selectedDepFilters.length
      ? selectedDepFilters.map((tag) => tag.flag)
      : DepFilterTagsList.map((tag) => tag.flag);

    const allowedDataSourceIDs = selectedDataSourceIDs.length
      ? selectedDataSourceIDs.map((datasourceOption) => datasourceOption.value)
      : dataSourceIDs.map((datasourceOption) => datasourceOption.value);

    const newFilteredPackageGroups = allPackageGroups.map(
      (packageGroup): PackageTypeGroupDetails => ({
        ...packageGroup,
        packages: packageGroup.packages.flatMap((packageDetails) => {
          const filteredDeps = packageDetails.dependencies.filter(
            (dep) =>
              allowedDepFlags.find((flag) => dep[flag] === true) &&
              allowedDataSourceIDs.includes(dep.datasource_id)
          );

          return filteredDeps.length
            ? { ...packageDetails, dependencies: filteredDeps }
            : [];
        }),
      })
    );

    setFilteredPackageGroups(
      newFilteredPackageGroups.sort(
        (a, b) => b.packages.length - a.packages.length
      )
    );

    const isDependencyAllowed = (dep: DependencyDetails) =>
      allowedDepFlags.find((flag) => dep[flag]);

    if (
      activePackage &&
      !activePackage.dependencies.find(isDependencyAllowed)
    ) {
      setActivePackage(null);
      setActiveEntityType(null);
    }
    if (activeDependency && !isDependencyAllowed(activeDependency)) {
      setActiveDependency(null);
      setActiveEntityType(null);
    }
  }, [allPackageGroups, selectedDepFilters, selectedDataSourceIDs]);

  if (!filteredPackageGroups) {
    return (
      <ThreeDots
        height={150}
        width={150}
        radius={30}
        color="#3D7BFF"
        ariaLabel="three-dots-loading"
        wrapperClass="packages-loader"
        visible={true}
      />
    );
  }

  if (!filteredPackageGroups?.length)
    return <NoDataFallback text="No packages :/" />;

  return (
    <div>
      <Allotment className="packages-container">
        <Allotment.Pane snap minSize={200} preferredSize="35%">
          <div className="h-100 d-flex flex-column">
            <MultiSelect
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              placeholder="Filter data sources"
              value={selectedDataSourceIDs}
              onChange={setSelectedDataSourceIDs}
              options={dataSourceIDs}
              className="packages-filter-bar mb-2"
            />
            <MultiSelect
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              placeholder="Filter dependency flag"
              value={selectedDepFilters}
              onChange={setSelectedDepFilters}
              options={DepFilterTagsList}
              className="packages-filter-bar mb-2"
            />
            <ListGroup className="packages-list-container">
              {filteredPackageGroups.map((packageGroup) => {
                const isPackageTypeExpanded = expandedPackageTypes.includes(
                  packageGroup.type
                );

                return (
                  <ListGroupItem
                    key={packageGroup.type}
                    className="package-group-list"
                  >
                    <div
                      className="package-type"
                      onDoubleClick={() => {
                        if (isPackageTypeExpanded)
                          collapsePackageType(packageGroup.type);
                        else expandPackageType(packageGroup.type);
                        window.getSelection().empty();
                      }}
                      onClick={() =>
                        isPackageTypeExpanded
                          ? collapsePackageType(packageGroup.type)
                          : expandPackageType(packageGroup.type)
                      }
                    >
                      <div
                        className="expand-indicator"
                        style={{
                          display: packageGroup.packages.length
                            ? "inline-block"
                            : "none",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={"chevron-right"}
                          className={
                            isPackageTypeExpanded ? "fa-rotate-90" : ""
                          }
                        />
                      </div>
                      <span className="label">
                        {packageGroup.type} ({packageGroup.packages.length}{" "}
                        packages)
                      </span>
                    </div>
                    <Collapse
                      in={isPackageTypeExpanded}
                      className="collapsed-body"
                    >
                      <ListGroup className="package-list">
                        {packageGroup.packages.map((packageWithDep) => {
                          const isPackageActive =
                            activePackage &&
                            activeEntityType === "package" &&
                            activePackage.package_uid ===
                              packageWithDep.package_uid;
                          const isPackageExpanded = expandedPackages.includes(
                            packageWithDep.package_uid
                          );

                          return (
                            <ListGroupItem
                              key={packageWithDep.package_uid}
                              data-package-uid={packageWithDep.package_uid}
                              className={
                                (isPackageActive ? "selected-entity " : "") +
                                "entity package-entry"
                              }
                            >
                              <div
                                onClick={() => activatePackage(packageWithDep)}
                                onDoubleClick={(e) => {
                                  activatePackage(packageWithDep);
                                  (isPackageExpanded
                                    ? collapsePackage
                                    : expandPackage)(
                                    packageWithDep.package_uid,
                                    e
                                  );
                                  // @TODO - Better way to achieve this ?
                                  // Handle text selecion occuring as a side-effect of doubleClick
                                  window.getSelection().empty();
                                }}
                                className="entity-info"
                              >
                                <div>
                                  <div
                                    className="expand-indicator"
                                    style={{
                                      display: packageWithDep.dependencies
                                        .length
                                        ? "block"
                                        : "none",
                                    }}
                                    onClick={(e) =>
                                      (isPackageExpanded
                                        ? collapsePackage
                                        : expandPackage)(
                                        packageWithDep.package_uid,
                                        e
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={"chevron-right"}
                                      className={
                                        isPackageExpanded ? "fa-rotate-90" : ""
                                      }
                                    />
                                  </div>
                                  <div className="entity-name">
                                    {packageWithDep.purl}
                                  </div>
                                </div>
                                <div className="total-deps">
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={
                                      <Tooltip>
                                        {packageWithDep.dependencies.length}{" "}
                                        dependencies
                                      </Tooltip>
                                    }
                                  >
                                    <Badge pill bg="light" text="dark">
                                      {packageWithDep.dependencies.length}
                                    </Badge>
                                  </OverlayTrigger>
                                </div>
                              </div>
                              <Collapse
                                in={isPackageExpanded}
                                className="collapsed-body"
                              >
                                <ListGroup>
                                  {packageWithDep.dependencies.map(
                                    (dependency) => {
                                      const isDependencyActive =
                                        activeDependency &&
                                        activeEntityType === "dependency" &&
                                        activeDependency.dependency_uid ===
                                          dependency.dependency_uid;
                                      return (
                                        <ListGroupItem
                                          key={dependency.dependency_uid}
                                          data-dependency-uid={
                                            dependency.dependency_uid
                                          }
                                          className={
                                            (isDependencyActive
                                              ? "selected-entity "
                                              : "") + "entity"
                                          }
                                          onClick={() =>
                                            activateDependency(dependency)
                                          }
                                        >
                                          <div className="entity-info">
                                            <div>
                                              <div>
                                                {dependency.purl.replace(
                                                  "pkg:",
                                                  ""
                                                )}
                                              </div>
                                            </div>

                                            <OverlayTrigger
                                              placement="right"
                                              delay={{ show: 300, hide: 200 }}
                                              overlay={
                                                <Tooltip>
                                                  Click to filter
                                                </Tooltip>
                                              }
                                            >
                                              <div className="entity-type-badges">
                                                {dependency.is_runtime && (
                                                  <Badge
                                                    pill
                                                    bg="primary"
                                                    onClick={(e) =>
                                                      toggleDepTagFilter(
                                                        DepFilterTags.RUNTIME,
                                                        e
                                                      )
                                                    }
                                                  >
                                                    Runtime
                                                  </Badge>
                                                )}
                                                {dependency.is_optional && (
                                                  <Badge
                                                    pill
                                                    bg="warning"
                                                    text="dark"
                                                    onClick={(e) =>
                                                      toggleDepTagFilter(
                                                        DepFilterTags.OPTIONAL,
                                                        e
                                                      )
                                                    }
                                                  >
                                                    Optional
                                                  </Badge>
                                                )}
                                                {dependency.is_resolved && (
                                                  <Badge
                                                    pill
                                                    bg="success"
                                                    onClick={(e) =>
                                                      toggleDepTagFilter(
                                                        DepFilterTags.RESOLVED,
                                                        e
                                                      )
                                                    }
                                                  >
                                                    Resolved
                                                  </Badge>
                                                )}
                                              </div>
                                            </OverlayTrigger>
                                          </div>
                                        </ListGroupItem>
                                      );
                                    }
                                  )}
                                </ListGroup>
                              </Collapse>
                            </ListGroupItem>
                          );
                        })}
                      </ListGroup>
                    </Collapse>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </div>
        </Allotment.Pane>
        <Allotment.Pane snap minSize={200} className="details-pane">
          {activeEntityType ? (
            activeEntityType === "package" && activePackage ? (
              <PackageEntity
                activePackage={activePackage}
                goToDependency={activateDependency}
              />
            ) : activeEntityType === "dependency" && activeDependency ? (
              <DependencyEntity
                dependency={activeDependency}
                goToPackageByUID={activatePackageByUID}
                goToFileInTableView={goToFileInTableView}
              />
            ) : (
              <div>
                <h5>
                  Please select a package or dependency to view more details
                </h5>
              </div>
            )
          ) : (
            <div>
              <h5>
                Please select a package or dependency to view more details
              </h5>
            </div>
          )}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default Packages;
