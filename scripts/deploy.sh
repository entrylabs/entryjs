#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

rm .gitignore

DATEFMT=`date "+%Y%m%d%H%M%S"`
# echo "$DATEFMT: My message"

git config user.name "JY KIM"
echo "1"
git config user.email "kimorkim@gmail.com"
echo "2"
git add dist/*
echo "3"
git commit -m "Entry Js Update"
echo "4"
git tag -fa "$DATEFMT"
echo "5"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" build
echo "6"
