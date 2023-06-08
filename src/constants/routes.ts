export const ROUTES = {
  HOME: "/",
  MAIN_WINDOW: "/main_window",
  ABOUT: "about",
  TABLE_VIEW: "table-view",
  FILE_DASHBOARD: "file-dashboard",
  LICENSE_DASHBOARD: "license-dashboard",
  PACKAGE_DASHBOARD: "package-dashboard",
  LICENSES: "licenses",
  PACKAGES: "packages",
  CHART_SUMMARY: "chart-summary",
  SCAN_INFO: "scan-info",
};

export const FILE_TREE_ROUTES = [
  ROUTES.TABLE_VIEW,
  ROUTES.FILE_DASHBOARD,
  ROUTES.LICENSE_DASHBOARD,
  ROUTES.PACKAGE_DASHBOARD,
  ROUTES.CHART_SUMMARY,
];

export const IMPORT_FALLBACK_ROUTES = [
  ROUTES.TABLE_VIEW,
  ROUTES.FILE_DASHBOARD,
  ROUTES.LICENSE_DASHBOARD,
  ROUTES.PACKAGES,
  ROUTES.PACKAGE_DASHBOARD,
  ROUTES.LICENSES,
  ROUTES.CHART_SUMMARY,
  ROUTES.SCAN_INFO,
];

export const DEFAULT_ROUTE_ON_IMPORT = ROUTES.LICENSES;