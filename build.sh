#!/bin/bash


# Run this script to build AboutCode Manager

VERSION=`git describe --tags`
APP_NAME="AboutCode-Manager"
ARCH=x64
ELECTRON_VERSION=1.4.0
BUILD_DIR=dist
ASAR=true
PLATFORM=$1

if [ "$PLATFORM" == "linux" ]; then
    ICON="png/aboutcode_512x512.png"
fi
if [ "$PLATFORM" == "darwin" ]; then
    ICON="mac/aboutcode.icns"
fi
if [ "$PLATFORM" == "win32" ]; then
    ICON="win/aboutcode_256x256.ico"
fi

echo '=> BUILDING AboutCode App release'

rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

$(npm bin)/electron-packager . $APP_NAME \
    --prune \
    --ignore=thirdparty/* \
    --ignore=dist/* \
    --ignore=/\\.idea \
    --ignore=/\\.gitignore \
    --ignore=/\test \
    --ignore=/\bower.json \
    --platform=$PLATFORM \
    --arch=$ARCH \
    --icon=assets/app-icon/$ICON \
    --version=$ELECTRON_VERSION \
    --out=$BUILD_DIR \
    --asar=$ASAR \
    --overwrite=true

RELEASE="${APP_NAME}-${PLATFORM}-${ARCH}"
RELEASE_VERSION="${RELEASE}-${VERSION}"
cd $BUILD_DIR
mv $RELEASE $RELEASE_VERSION
tar -czf $RELEASE_VERSION.tar.gz $RELEASE_VERSION
cd ..
ls -al $BUILD_DIR
