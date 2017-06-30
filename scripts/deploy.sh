#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

rm .gitignore

DATEFMT=`date "+%Y%m%d%H%M%S"`
# echo "$DATEFMT: My message"

git config user.name "JY KIM"
git config user.email "kimorkim@gmail.com"
git add dist/*
git commit -m "Entry Js Update"
git tag -fa "$DATEFMT"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" build



