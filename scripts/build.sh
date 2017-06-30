#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

git clone -b build "${GH_REPO}"
# rm -rf site/**/* || exit 0
./node_modules/grunt-cli/bin/grunt build