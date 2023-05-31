// eslint-disable-next-line import/namespace
import { Allotment } from "allotment";
import React, { useEffect, useState } from "react";
import { Badge, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import { ThreeDots } from "react-loader-spinner";
import { useSearchParams } from "react-router-dom";

import RightArrowIcon from "../../assets/icons/rightArrow.svg";
import NoDataFallback from "../../components/NoDataSection";
import DependencyEntity from "../../components/PackagesEntityDetails/DependencyEntity";
import PackageEntity from "../../components/PackagesEntityDetails/PackageEntity";
import { QUERY_KEYS } from "../../constants/params";
// import { PackageURL } from 'packageurl-js';
import { useWorkbenchDB } from "../../contexts/dbContext";
import { DEPENDENCY_SCOPES } from "../../services/models/dependencies";
import {
  DependencyDetails,
  PackageDetails,
  PackageTypeGroupDetails,
} from "./packageDefinitions";

import "./packages.css";

const Packages = () => {
  const workbenchDB = useWorkbenchDB();
  const { db, initialized, currentPath, startProcessing, endProcessing } =
    workbenchDB;
  const [searchParams] = useSearchParams();
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [packagesWithDeps, setPackagesWithDeps] = useState<
    PackageDetails[] | null
  >(null);
  const [packageGroups, setPackageGroups] = useState<
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

  const activatePackage = (packageInfo: PackageDetails) => {
    setActiveDependency(null);
    setActivePackage(packageInfo);
    setActiveEntityType("package");
  };
  const activatePackageByUID = (package_uid: string) => {
    const targetPackage = packagesWithDeps?.find(
      (packageInfo) => packageInfo.package_uid === package_uid
    );
    if (package_uid && targetPackage) {
      activatePackage(targetPackage);
    }
    return targetPackage;
  };
  useEffect(() => {
    const queriedPackageUid = searchParams.get(QUERY_KEYS.PACKAGE);
    if (!queriedPackageUid) return;
    if (packagesWithDeps && packagesWithDeps.length)
      activatePackageByUID(queriedPackageUid);
  }, [searchParams]);

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
    if (!initialized || !db || !currentPath) return;

    startProcessing();
    db.sync
      .then(async () => {
        const packages = await db.getAllPackages();
        const deps = await db.getAllDependencies();
        console.log("Raw Packages & deps", packages, deps);
        if (!packages.length && !deps.length) {
          console.log("No package or deps available");
          setPackageGroups([]);
          return;
        }

        // const type_other = 'type-other';
        const packageMapping = new Map<string, PackageDetails>(
          packages.map((packageInfo): [string, PackageDetails] => [
            packageInfo.getDataValue("package_uid").toString({}),
            {
              package_uid: packageInfo.getDataValue("package_uid").toString({}),
              name: packageInfo.getDataValue("name").toString({}),
              type: packageInfo.getDataValue("type").toString({}),
              dependencies: [],
              namespace:
                packageInfo.getDataValue("namespace")?.toString({}) || null,
              version:
                packageInfo.getDataValue("version")?.toString({}) || null,
              qualifiers: JSON.parse(
                packageInfo.getDataValue("qualifiers").toString({})
              ),
              subpath:
                packageInfo.getDataValue("subpath")?.toString({}) || null,
              primary_language:
                packageInfo.getDataValue("primary_language")?.toString({}) ||
                null,
              description:
                packageInfo.getDataValue("description")?.toString({}) || null,
              release_date:
                packageInfo.getDataValue("release_date")?.toString({}) || null,
              parties: JSON.parse(
                packageInfo.getDataValue("parties").toString({})
              ),
              keywords: JSON.parse(
                packageInfo.getDataValue("keywords").toString({})
              ),
              homepage_url:
                packageInfo.getDataValue("homepage_url")?.toString({}) || null,
              download_url:
                packageInfo.getDataValue("download_url")?.toString({}) || null,
              size: packageInfo.getDataValue("size")?.toString({}) || null,
              sha1: packageInfo.getDataValue("sha1")?.toString({}) || null,
              md5: packageInfo.getDataValue("md5")?.toString({}) || null,
              sha256: packageInfo.getDataValue("sha256")?.toString({}) || null,
              sha512: packageInfo.getDataValue("sha512")?.toString({}) || null,
              bug_tracking_url:
                packageInfo.getDataValue("bug_tracking_url")?.toString({}) ||
                null,
              code_view_url:
                packageInfo.getDataValue("code_view_url")?.toString({}) || null,
              vcs_url:
                packageInfo.getDataValue("vcs_url")?.toString({}) || null,
              copyright:
                packageInfo.getDataValue("copyright")?.toString({}) || null,
              declared_license_expression:
                packageInfo
                  .getDataValue("declared_license_expression")
                  ?.toString({}) || null,
              declared_license_expression_spdx:
                packageInfo
                  .getDataValue("declared_license_expression_spdx")
                  ?.toString({}) || null,
              other_license_expression:
                packageInfo
                  .getDataValue("other_license_expression")
                  ?.toString({}) || null,
              other_license_expression_spdx:
                packageInfo
                  .getDataValue("other_license_expression_spdx")
                  ?.toString({}) || null,
              extracted_license_statement:
                packageInfo
                  .getDataValue("extracted_license_statement")
                  ?.toString({})
                  .replace(/(^"|"$)/g, "") || null,
              notice_text:
                packageInfo.getDataValue("notice_text")?.toString({}) || null,
              source_packages: JSON.parse(
                packageInfo.getDataValue("source_packages").toString({})
              ),
              extra_data: JSON.parse(
                packageInfo.getDataValue("extra_data").toString({})
              ),
              repository_homepage_url:
                packageInfo
                  .getDataValue("repository_homepage_url")
                  ?.toString({}) || null,
              repository_download_url:
                packageInfo
                  .getDataValue("repository_download_url")
                  ?.toString({}) || null,
              api_data_url:
                packageInfo.getDataValue("api_data_url")?.toString({}) || null,
              datafile_paths:
                JSON.parse(
                  packageInfo.getDataValue("datafile_paths")?.toString({}) ||
                    "[]"
                ) || [],
              datasource_ids:
                JSON.parse(
                  packageInfo.getDataValue("datasource_ids")?.toString({}) ||
                    "[]"
                ) || [],
              purl: packageInfo.getDataValue("purl").toString({}),
            },
          ])
        );
        const MISC_DEPS = "others";
        const MISC_PACKAGE: PackageDetails = {
          package_uid: "misc",
          name: "Misc dependencies",
          type: "Other",
          dependencies: [],
          namespace: "",
          version: null,
          qualifiers: {},
          subpath: null,
          primary_language: null,
          description: null,
          release_date: null,
          parties: {},
          keywords: {},
          homepage_url: null,
          download_url: null,
          size: null,
          sha1: null,
          md5: null,
          sha256: null,
          sha512: null,
          bug_tracking_url: null,
          code_view_url: null,
          vcs_url: null,
          copyright: null,
          declared_license_expression: null,
          declared_license_expression_spdx: null,
          other_license_expression: null,
          other_license_expression_spdx: null,
          extracted_license_statement: null,
          notice_text: null,
          source_packages: {},
          extra_data: {},
          repository_homepage_url: null,
          repository_download_url: null,
          api_data_url: null,
          datafile_paths: [],
          datasource_ids: [],
          purl: null,
        };
        packageMapping.set(MISC_DEPS, MISC_PACKAGE);

        // Group dependencies in their respective packages
        deps.forEach((dependencyInfo) => {
          const targetPackageUid: string | null = dependencyInfo
            .getDataValue("for_package_uid")
            ?.toString({});
          packageMapping.get(targetPackageUid || MISC_DEPS).dependencies.push({
            // ...dependencyInfo,     // For debugging
            purl: dependencyInfo.getDataValue("purl").toString({}),
            extracted_requirement:
              dependencyInfo
                .getDataValue("extracted_requirement")
                ?.toString({}) || "",
            scope: dependencyInfo
              .getDataValue("scope")
              .toString({}) as DEPENDENCY_SCOPES,
            is_runtime: dependencyInfo.getDataValue("is_runtime"),
            is_optional: dependencyInfo.getDataValue("is_optional"),
            is_resolved: dependencyInfo.getDataValue("is_resolved"),
            resolved_package: JSON.parse(
              dependencyInfo.getDataValue("resolved_package").toString({})
            ),
            dependency_uid: dependencyInfo
              .getDataValue("dependency_uid")
              .toString({}),
            for_package_uid:
              dependencyInfo.getDataValue("for_package_uid")?.toString({}) ||
              null,
            datafile_path: dependencyInfo
              .getDataValue("datafile_path")
              .toString({}),
            datasource_id: dependencyInfo
              .getDataValue("datasource_id")
              .toString({}),
          });
        });

        // Ignore misc package if no misc dependencies found
        if (!MISC_PACKAGE.dependencies.length) {
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
        setPackageGroups(parsedPackageGroups);
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
  }, [currentPath]);

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

  if (!packageGroups) {
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

  if (!packageGroups.length) return <NoDataFallback text="No packages :/" />;

  return (
    <div className="packages-main-container">
      <h4 className="page-title">Packages & Dependencies explorer</h4>
      <Allotment className="packages-container">
        <Allotment.Pane
          snap
          minSize={200}
          preferredSize="35%"
          className="packages-panes p-2"
        >
          <ListGroup>
            {packageGroups.map((packageGroup) => (
              <ListGroupItem
                key={packageGroup.type}
                className="package-group-list"
              >
                {packageGroup.type} - {packageGroup.packages.length}
                <ListGroup className="package-list">
                  {packageGroup.packages.map((packageWithDep) => {
                    const isPackageActive =
                      activeEntityType === "package" &&
                      activePackage === packageWithDep;
                    const isPackageExpanded = expandedPackages.includes(
                      packageWithDep.package_uid
                    );
                    let packageTitle = [
                      packageWithDep.type,
                      packageWithDep.namespace,
                      packageWithDep.name,
                    ]
                      .filter(
                        (val) => val !== null && val !== undefined && val.length
                      )
                      .join(" - ");
                    if (packageWithDep.version) {
                      packageTitle += "@" + packageWithDep.version;
                    }

                    return (
                      <ListGroupItem
                        key={packageWithDep.package_uid}
                        style={{ cursor: "pointer" }}
                        className={
                          (isPackageActive ? "selected-entity " : "") +
                          "entity dependency-list"
                        }
                      >
                        <div
                          onClick={() => activatePackage(packageWithDep)}
                          className="entity-info"
                        >
                          <div>
                            <div
                              className="expand-package"
                              onClick={(e) =>
                                (isPackageExpanded
                                  ? collapsePackage
                                  : expandPackage)(
                                  packageWithDep.package_uid,
                                  e
                                )
                              }
                            >
                              <RightArrowIcon
                                className={
                                  (isPackageExpanded && "expanded-icon") || ""
                                }
                              />
                            </div>
                            <div className="entity-name">
                              {packageTitle}
                              {/* {
                                isPackageActive && 
                                <span>
                                  <Badge pill>selected</Badge>
                                </span>
                              } */}
                            </div>
                          </div>
                          <div className="total-deps">
                            <Badge pill>
                              {packageWithDep.dependencies.length}
                            </Badge>
                          </div>
                        </div>
                        <Collapse
                          in={isPackageExpanded}
                          className="collapsed-body"
                        >
                          <ListGroup>
                            {packageWithDep.dependencies.map((dependency) => {
                              const isDependencyActive =
                                activeEntityType === "dependency" &&
                                activeDependency === dependency;
                              return (
                                <ListGroupItem
                                  key={dependency.dependency_uid}
                                  className={
                                    (isDependencyActive
                                      ? "selected-entity "
                                      : "") + "entity"
                                  }
                                  onClick={() => activateDependency(dependency)}
                                >
                                  <div className="entity-info">
                                    <div>
                                      <div>
                                        {dependency.purl.replace("pkg:", "")}
                                        {!dependency.is_runtime}
                                      </div>
                                    </div>
                                    <div className="entity-type-badge">
                                      <Badge
                                        pill
                                        bg={
                                          dependency.is_runtime
                                            ? "primary"
                                            : dependency.is_optional
                                            ? "light"
                                            : dependency.is_resolved
                                            ? "success"
                                            : "light"
                                        }
                                        text={
                                          dependency.is_runtime
                                            ? "light"
                                            : dependency.is_optional
                                            ? "dark"
                                            : dependency.is_resolved
                                            ? "light"
                                            : "dark"
                                        }
                                      >
                                        {dependency.is_optional
                                          ? "Optional"
                                          : dependency.is_runtime
                                          ? "Runtime"
                                          : dependency.is_resolved
                                          ? "Resolved"
                                          : ""}
                                      </Badge>
                                    </div>
                                  </div>
                                </ListGroupItem>
                              );
                            })}
                          </ListGroup>
                        </Collapse>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={200}
          className="packages-panes details-pane p-4"
        >
          {activeEntityType === "package"
            ? activePackage && (
                <PackageEntity
                  package={activePackage}
                  goToDependency={activateDependency}
                />
              )
            : activeDependency && (
                <DependencyEntity
                  dependency={activeDependency}
                  goToPackageByUID={activatePackageByUID}
                />
              )}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default Packages;
