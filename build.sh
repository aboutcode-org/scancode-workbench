#!/bin/bash


# Run this script to build the AboutCode Manager

VERSION=v1.0.0-beta.1
APP_NAME="AboutCode-Manager"
ARCH=x64
ELECTRON_VERSION=1.2.0
BUILD_DIR=dist
ASAR=true

echo '=> BUILDING AboutCode App release'

rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR
for params in "darwin mac/aboutcode.icns" "linux png/aboutcode_512x512.png" "win32 win/aboutcode_256x256.ico"
do
    # parses $params into $1 and $2
    set -- $params
    $(npm bin)/electron-packager . $APP_NAME \
        --ignore=node_modules/* \
        --ignore=bower_components/* \
        --ignore=thirdparty/* \
        --ignore=dist/* \
        --ignore=/\\.idea \
        --ignore=/\\.gitignore \
        --ignore=/\test \
        --ignore=/\bower.json \
        --platform=$1 --arch=$ARCH \
        --icon=assets/app-icon/$2 \
        --version=$ELECTRON_VERSION \
        --out=$BUILD_DIR --asar=$ASAR --overwrite=true
    RELEASE="${APP_NAME}-${1}-${ARCH}"
    RELEASE_VERSION="${RELEASE}-${VERSION}"
    cd $BUILD_DIR
    mv $RELEASE $RELEASE_VERSION
    tar -czf $RELEASE_VERSION.tar.gz $RELEASE_VERSION
    zip -rq $RELEASE_VERSION.zip $RELEASE_VERSION
    cd ..
done