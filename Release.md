## Major changes

- Support for To-do items by @OmkarPh in #593
- Track & filter reviewed licenses by @OmkarPh in #571
- Build filetree with missing directories to support `--only-findings` scans by @OmkarPh #624
- Sort the files in tableview by their depth in directory tree by @OmkarPh in #625

## ScanCode Toolkit Compatibility

This v4.0.0 of ScanCode Workbench is compatible with scans from any [ScanCode Toolkit](https://github.com/nexB/scancode-toolkit/) releases at or after [`v32.0.0`](https://github.com/nexB/scancode-toolkit/releases/tag/v32.0.0rc4) and also from the latest develop, but using the latest `v32.x` stable releases is recommended: [latest SCTK release](https://github.com/nexB/scancode-toolkit/releases/latest).

## Bug fixes

- Fixed Irregular auto-scroll to target path by @OmkarPh in #610
- Fixed all vulnerabilities & updated packages by @OmkarPh in #611
- Restore old app name by @dotarjun in #615
- Fixed compund SPDX expression resolution in detection & clue matches by @OmkarPh in #619
- Reduce release build size by removing redundant `node_modules` dependencies & include metadata in release archive by @OmkarPh in #623
- Fixed Boolean cell renderer, refactored renderers, hidden license text for directories by @OmkarPh in #627

## Framework

- Electorn [v28.1.0](https://releases.electronjs.org/release/v28.1.0)
- Chromium [v120.0.6099.109](https://source.chromium.org/chromium/chromium/src/+/refs/tags/120.0.6099.109:)

# New Contributors

- @dotarjun made his first contribution in #615