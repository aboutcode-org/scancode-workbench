interface Column {
  title: string,
  key: string,
  data?: string,
  visible?: boolean,
  bar_chart_class?: string,
}

export const LOCATION_COLUMN: Column[] = [
  {
    title: 'Path',
    key: 'path',
  }
];

export const COPYRIGHT_COLUMNS: Column[] = [
  {
    title: 'Copyright Statement',
    key: 'copyright_statements',
    bar_chart_class: 'bar-chart-copyrights',
  },
  {
    title: 'Copyright Holder',
    key: 'copyright_holders',
    bar_chart_class: 'bar-chart-copyrights',
  },
  {
    title: 'Copyright Author',
    key: 'copyright_authors',
    bar_chart_class: 'bar-chart-copyrights',
  },
  {
    data: 'copyright_start_line[<hr/>]',
    title: 'Copyright Start Line',
    key: 'copyright_start_line',
  },
  {
    title: 'Copyright End Line',
    key: 'copyright_end_line',
  }
];

export const LICENSE_COLUMNS: Column[] = [
  {
    title: 'License Policy',
    key: 'license_policy',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_expressions[<hr/>]',
    title: 'License Expression',
    key: 'license_expressions',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_key[<hr/>]',
    title: 'License Key',
    key: 'license_key',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_score[<hr/>]',
    title: 'License Score',
    key: 'license_score',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_short_name[<hr/>]',
    title: 'License Short Name',
    key: 'license_short_name',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_category[<hr/>]',
    title: 'License Category',
    key: 'license_category',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_owner[<hr/>]',
    title: 'License Owner',
    key: 'license_owner',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_homepage_url',
    title: 'License Homepage URL',
    key: 'license_homepage_url',
  },
  {
    data: 'license_text_url',
    title: 'License Text URL',
    key: 'license_text_url',
  },
  {
    data: 'license_reference_url',
    title: 'License Reference URL',
    key: 'license_reference_url',
  },
  {
    data: 'license_spdx_key[<hr/>]',
    title: 'SPDX License Key',
    key: 'license_spdx_key',
    bar_chart_class: 'bar-chart-licenses',
  },
  {
    data: 'license_start_line[<hr/>]',
    title: 'License Start Line',
    key: 'license_start_line',
  },
  {
    data: 'license_end_line[<hr/>]',
    title: 'License End Line',
    key: 'license_end_line',
  }
];

export const EMAIL_COLUMNS: Column[] = [
  {
    title: 'Email',
    key: 'email',
    bar_chart_class: 'bar-chart-emails',
  },
  {
    title: 'Email Start Line',
    key: 'email_start_line',
  },
  {
    title: 'End Start Line',
    key: 'email_start_line',
  }
];

export const URL_COLUMNS: Column[] = [
  {
    title: 'URL',
    key: 'url',
  },
  {
    title: 'URL Start Line',
    key: 'url_start_line',
  },
  {
    title: 'URL End Line',
    key: 'url_end_line',
  }
];

export const FILE_COLUMNS: Column[] = [
  {
    data: 'type',
    title: 'Type',
    key: 'type',
    bar_chart_class: 'bar-chart-file-infos',
    'visible': true
  },
  {
    data: 'name',
    title: 'File Name',
    key: 'name',
    'visible': true
  },
  {
    data: 'extension',
    title: 'File Extension',
    key: 'extension',
    bar_chart_class: 'bar-chart-file-infos',
    'visible': true
  },
  {
    data: 'date',
    title: 'File Date',
    key: 'date',
  },
  {
    data: 'size',
    title: 'File Size',
    key: 'size',
    'visible': true
  },
  {
    data: 'sha1',
    title: 'SHA1',
    key: 'sha1',
  },
  {
    data: 'md5',
    title: 'MD5',
    key: 'md5',
  },
  {
    data: 'file_count',
    title: 'File Count',
    key: 'file_count',
  },
  {
    data: 'mime_type',
    title: 'MIME Type',
    key: 'mime_type',
    'visible': true
  },
  {
    data: 'file_type',
    title: 'File Type',
    key: 'file_type',
    bar_chart_class: 'bar-chart-file-infos',
    'visible': true
  },
  {
    data: 'programming_language',
    title: 'Language',
    key: 'programming_language',
    bar_chart_class: 'bar-chart-file-infos',
    'visible': true
  },
  {
    data: 'is_binary',
    title: 'Binary',
    key: 'is_binary',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'is_text',
    title: 'Text File',
    key: 'is_text',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'is_archive',
    title: 'Archive File',
    key: 'is_archive',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'is_media',
    title: 'Media File',
    key: 'is_media',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'is_source',
    title: 'Source File',
    key: 'is_source',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'is_script',
    title: 'Script File',
    key: 'is_script',
    bar_chart_class: 'bar-chart-file-infos',
  },
  {
    data: 'scan_errors',
    title: 'Scan Error',
    key: 'scan_errors',
    bar_chart_class: 'bar-chart-file-infos',
    'visible': true
  }
];

export const PACKAGE_COLUMNS: Column[] = [
  {
    data: 'package_data_type',
    title: 'Package Type',
    key: 'package_data_type',
    bar_chart_class: 'bar-chart-package-infos',
  },
  {
    data: 'package_data_name',
    title: 'Package Name',
    key: 'package_data_name',
    bar_chart_class: 'bar-chart-package-infos',
  },
  {
    data: 'package_data_version',
    title: 'Package Version',
    key: 'package_data_version',
  },
  {
    data: 'package_data_license_expression[<hr/>]',
    title: 'Package License Expression',
    key: 'package_data_license_expression',
  },
  {
    data: 'package_data_primary_language',
    title: 'Package Primary Language',
    key: 'package_data_primary_language',
    bar_chart_class: 'bar-chart-package-infos',
  },
  // add package parties
  {
    data: 'package_data_homepage_url',
    title: 'Package Homepage URL',
    key: 'package_data_homepage_url',
  },
  {
    data: 'package_data_download_url',
    title: 'Package Download URL',
    key: 'package_data_download_url',
  },
  {
    data: 'package_data_purl',
    title: 'Package URL',
    key: 'package_data_purl',
  },
];

// interface BAR_CHART_GROUP {
//   label: string,
//   key: string,
//   cols: Column[],
// }

// interface BAR_CHART_COLUMNS_STRUCTURE {

// }
export const BAR_CHART_COLUMNS = {
  Copyright: {
    label: "Copyright columns",
    key: 'copyright_columns',
    cols: COPYRIGHT_COLUMNS
  },
  License : {
    label: "License columns",
    key: 'license_columns',
    cols: LICENSE_COLUMNS
  },
  Email: {
    label: "Email columns",
    key: 'email_columns',
    cols: EMAIL_COLUMNS
  },
  Url: {
    label: "URL columns",
    key: 'url_columns',
    cols: URL_COLUMNS
  },
  File: {
    label: "File columns",
    key: 'file_columns',
    cols: FILE_COLUMNS
  },
  Package: {
    label: "Package columns",
    key: 'package_columns',
    cols: PACKAGE_COLUMNS
  },
}


export const FILEINFO_COLUMN_NAMES = 
[
'name',
'extension',
'size',
'type',
'mime_type', 
'file_type',
'programming_language'
];

export const ORIGIN_COLUMN_NAMES = [
  'copyright_statements',
  'license_short_name',
  'license_policy',
  'license_category',
  'email',
  'url',
  'mime_type',
  'file_type',
  'programming_language'
];

export const LICENSE_COLUMN_NAMES = 
[
  'license_policy',
  'license_expressions',
  'license_key',
  'license_score',
  'license_short_name', 
  'license_category',
  'license_owner',
  'license_spdx_key',
  'license_start_line',
  'license_end_line'
];

export const PACKAGE_COLUMN_NAMES = 
[
  'package_data_type',
  'package_data_name',
  'package_data_version',
  'package_data_license_expression',
  'package_data_primary_language',
  'package_data_purl'
];