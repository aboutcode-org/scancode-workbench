#!/bin/bash
# halt script on error
set -e
# Build locally, and then check links
sphinx-build -E -W -b linkcheck ./docs/source ./docs/build