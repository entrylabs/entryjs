#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

export NODE_ENV=production
#git clone -b build "${GH_REPO}" build
rm -rf build/**/* || exit 0
npm run dist
cp -r dist build/
cp -r extern build/
cp -r images build/
cp -r weights build/
rsync -R src/playground/block_entry.js build
rsync -R src/playground/block_entry_mini.js build
rsync -r -R src/playground/blocks/ build
rsync -rR package.json build
ls -al
ls -al build
