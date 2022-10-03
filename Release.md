## Major changes
- Ported to React + Typescript variant !!
  Under GSoC by @OmkarPh 
- Updated Tableview library
- Maintain history of imports
- Updated dependencies
- Created UI to support top level packages-deps obtained in latest scans
- Scan Info page to present header info
- Support for Drag & drop JSON/SQLite files
- Github actions to create automated releases
  Exception: macos arm64 is not yet support by Github actions yet, needs manual build & upload

## Bug fixes
- Table column fixes
- Fixed UI anomalies
- Invalid path query fix (Data for files with similar prefix were colliding)