#!/usr/bin/env bash
set -e # 에러 발생 시 스크립트 중단

git config --global user.name "Entry Dev";
git config --global user.email "entrydev@nts-corp.com";

branchName=${GITHUB_REF##*/}
deployName="dist/$branchName"

export NODE_ENV=production

#if [ "$branchName" = "master" ]
#then
    #git clone -b build "https://github.com/$GITHUB_REPOSITORY" build
#else     
    #git clone "https://github.com/$GITHUB_REPOSITORY" build
    #if git show-ref --quiet refs/remotes/origin/"$deployName"; then
    #    git clone -b "$deployName" "https://github.com/$GITHUB_REPOSITORY" build
    #else 
    #    git clone "https://github.com/$GITHUB_REPOSITORY" build
    #    git checkout -b "$deployName"
    #fi
#fi

git clone -b build "https://github.com/$GITHUB_REPOSITORY" build
rm -rf build/**/* || exit 0
cp -r dist build/
cp -r extern build/
cp -r images build/
cp -r weights build/
rsync -R src/playground/block_entry.js build
rsync -R src/playground/block_entry_mini.js build
rsync -r -R src/playground/blocks/ build
ls -al
ls -al build
