#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

git config --local user.email "entrydev@nts-corp.com"
git config --local user.name "Entry Dev"

rm .gitignore
branchName=${GITHUB_REF##*/}
deployName="dist/$branchName"

DATEFMT=`date "+%Y%m%d"`
# echo "$DATEFMT: My message"
cd build
git config user.name "Entry Dev"
git config user.email "entrydev@nts-corp.com"

echo "target branch's name is $branchName"

if [ "$branchName" = "master" ]
then
    echo "deploy to build branch"
    git add .
    git commit -m "Entry Js PUBLISH by v3.$DATEFMT.${GITHUB_RUN_NUMBER}"
    git tag -a "v3.$DATEFMT.${GITHUB_RUN_NUMBER}" -m "build v3.$DATEFMT.${TRAVIS_BUILD_NUMBER}"
#    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" build --tags
else
    echo "deploy branch's name is $deployName"
    #git checkout -b "$deployName"
    #git push --delete "https://${GH_TOKEN}@${GH_REF}" "$deployName"
    git add .
    git commit -m "Entry Js deploy $deployName"
    #git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" "$deployName"
fi
#curl -d '{"tag_name": "v$DATEFMT","target_commitish": "build","name": "v$DATEFMT","body": "Description of the release","draft": false,"prerelease": false}' -X POST "https://developer.github.com/v3/repos/kimokim/entryjs/releases"
