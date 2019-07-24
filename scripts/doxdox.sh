mkdir -p documentation/markdown/src/class
mkdir -p documentation/markdown/src/class/hardware
mkdir -p documentation/markdown/src/class/maxrect-packer
mkdir -p documentation/markdown/src/class/pixi/atlas
mkdir -p documentation/markdown/src/class/pixi/etc
mkdir -p documentation/markdown/src/class/pixi/handle
mkdir -p documentation/markdown/src/class/pixi/helper
mkdir -p documentation/markdown/src/class/pixi/init
mkdir -p documentation/markdown/src/class/pixi/mesh
mkdir -p documentation/markdown/src/class/pixi/plugins
mkdir -p documentation/markdown/src/class/pixi/text
mkdir -p documentation/markdown/src/class/pixi/utils
mkdir -p documentation/markdown/src/class/variable

mkdir -p documentation/bootstrap/src/class
mkdir -p documentation/bootstrap/src/class/hardware
mkdir -p documentation/bootstrap/src/class/maxrect-packer
mkdir -p documentation/bootstrap/src/class/pixi/atlas
mkdir -p documentation/bootstrap/src/class/pixi/etc
mkdir -p documentation/bootstrap/src/class/pixi/handle
mkdir -p documentation/bootstrap/src/class/pixi/helper
mkdir -p documentation/bootstrap/src/class/pixi/init
mkdir -p documentation/bootstrap/src/class/pixi/mesh
mkdir -p documentation/bootstrap/src/class/pixi/plugins
mkdir -p documentation/bootstrap/src/class/pixi/text
mkdir -p documentation/bootstrap/src/class/pixi/utils
mkdir -p documentation/bootstrap/src/class/variable

for file in $(find src/class/* -name '*.js'); do  
    doxdox "$file" --layout markdown --output documentation/markdown/"$file".md 
    doxdox "$file" --layout bootstrap --output documentation/bootstrap/"$file".html
echo "$file"done; done

# for file in src/class/*
# do
#     if [ -d "$file" ]
#     then
#         for ff in $file/*
#         do      
#             doxdox "$file" --layout markdown --output documentation/markdown/"$file".md
#             doxdox "$file" --layout bootstrap --output documentation/bootstrap/"$file".html
#             echo "$file"done
#         done
#     else
#         doxdox "$file" --layout markdown --output documentation/markdown/"$file".md
#         doxdox "$file" --layout bootstrap --output documentation/bootstrap/"$file".html
#         echo "$file"done
#     fi
# done