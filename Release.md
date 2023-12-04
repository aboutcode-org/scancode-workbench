## Major changes

- Ported to React + Typescript variant !!
  Under GSoC by @OmkarPh
- Support for scancode-toolkit v32.x output format v3.0.0
- Updated Tableview library & columns
- New sections: License Detections explorer, Packages explorer, ScanInfo, About
- Support for multiple windows
- Maintain history of imports
- Updated dependencies
- Created UI to support top level packages-deps obtained in latest scans
- Support for Drag & drop JSON/SQLite files
- Github actions to create automated releases
  Exception: macos arm64 is not yet support by Github actions yet, needs manual build & upload
- Retain column order & states https://github.com/nexB/scancode-workbench/pull/568
- License clues section in Licenses explorer https://github.com/nexB/scancode-workbench/pull/570
- Go to specific file from licenses & packages explorer https://github.com/nexB/scancode-workbench/pull/572
- Diff modal for Matched text & Rule text in Matches table https://github.com/nexB/scancode-workbench/pull/577
- Working indicator for queries https://github.com/nexB/scancode-workbench/pull/583
- Dashboard updates https://github.com/nexB/scancode-workbench/pull/585
- Close file & cleanup https://github.com/nexB/scancode-workbench/pull/600
- Unit tests https://github.com/nexB/scancode-workbench/pull/591
- Dependency Info dashboard updates https://github.com/nexB/scancode-workbench/pull/594
- Updated documentation https://github.com/nexB/scancode-workbench/pull/602

## ScanCode Toolkit Compatibility

This v4.0.0 of ScanCode Workbench is compatible with scans from any [ScanCode Toolkit](https://github.com/nexB/scancode-toolkit/) releases at or after [`v32.0.0`](https://github.com/nexB/scancode-toolkit/releases/tag/v32.0.0rc4) and also from the latest develop, but using the latest `v32.x` stable releases is recommended: [latest SCTK release](https://github.com/nexB/scancode-toolkit/releases/latest).

## Bug fixes

- Prevent crashes on unsupported scans
- Provision for header-less scans (Test scans)
- Table column fixes
- Fixed UI anomalies
- Invalid path query fix (Data for files with similar prefix were colliding)
- window title update & occasional sqlite error for packages https://github.com/nexB/scancode-workbench/pull/560
- license detection parser issues, trimmed filter options, hide empty 'other dependencies' https://github.com/nexB/scancode-workbench/pull/569
- Refined UX including consistent scrollbars, tooltips, Search in licenses, filters for dependencies https://github.com/nexB/scancode-workbench/pull/587
- Updated piechart tooltip https://github.com/nexB/scancode-workbench/pull/582
- Automatic height for tables https://github.com/nexB/scancode-workbench/pull/606
- Fixed Empty directory being shown with file icon https://github.com/nexB/scancode-workbench/pull/604
- Fix irregular scroll behavior for files in deeply nested FileTree https://github.com/nexB/scancode-workbench/pull/599
