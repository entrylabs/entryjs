#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

export NODE_ENV=production
git clone -b build "${GH_REPO}" build
rm -rf build/**/* || exit 0
npm run dist
cp -r dist build/
cp -r extern build/
cp -r images build/
cp -r src/playground/blocks/ build/
mkdir -p build/src/playground
cp src/playground/block_entry.js src/playground/block_entry_mini.js build/src/playground/
ls -al
ls -al build
