#/bin/bash

#!/bin/usr/env bash

currDir=`pwd`
srcFolder="/mnt/c/Projects/GES/src/odoo/get-lms/entryjs/entryjs-core"
srcFiles=(
[0]=src/playground/blocks/hardwareLite/block_whalesbot_drone_lite.js
[1]=src/playground/blocks/hardwareLite/metadata_whalesbot_drone_lite.json
)

for file in  "${srcFiles[@]}"
do 
#ls -al $srcFolder/$file
echo "Copy $srcFolder/$file -> $currDir/$file"
rsync -av $srcFolder/$file $currDir/$file
done 