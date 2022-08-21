## Major changes
- Ported to React + Typescript variant !!
- Updated dependencies
- Updated Tableview library
- Maintain history of imports
- Github actions to create release automatically
  Exception: macos arm64 is not yet support by Github actions yet, needs manual build & upload

## Bug fixes
- Table column fixes
- Invalid path query fix (Data for files with similar prefix were colliding)