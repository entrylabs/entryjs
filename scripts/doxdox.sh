# doxdox 'src/class/container.js' --layout markdown --output documentation/src/class/container.md
# doxdox 'src/class/dialog.js' --layout markdown --output documentation/src/class/dialog.md
# doxdox 'src/class/doneProject.js' --layout markdown --output documentation/src/class/doneProject.md
# doxdox 'src/class/engine.js' --layout markdown --output documentation/src/class/engine.md
# doxdox 'src/class/entity.js' --layout markdown --output documentation/src/class/entity.md
# doxdox 'src/class/Expansion.js' --layout markdown --output documentation/src/class/Expansion.md
# doxdox 'src/class/function.js' --layout markdown --output documentation/src/class/function.md
# doxdox 'src/class/helper.js' --layout markdown --output documentation/src/class/helper.md
# doxdox 'src/class/hw_monitor.js' --layout markdown --output documentation/src/class/hw_monitor.md
# doxdox 'src/class/hw.js' --layout markdown --output documentation/src/class/hw.md
# doxdox 'src/class/intro.js' --layout markdown --output documentation/src/class/intro.md
# doxdox 'src/class/moduleManager.js' --layout markdown --output documentation/src/class/moduleManager.md
# doxdox 'src/class/object.js' --layout markdown --output documentation/src/class/object.md
# doxdox 'src/class/painter.js' --layout markdown --output documentation/src/class/painter.md
# doxdox 'src/class/pdf.js' --layout markdown --output documentation/src/class/pdf.md
# doxdox 'src/class/playground.js' --layout markdown --output documentation/src/class/playground.md
# doxdox 'src/class/popup_helper.js' --layout markdown --output documentation/src/class/popup_helper.md
# doxdox 'src/class/popup_list.js' --layout markdown --output documentation/src/class/popup_list.md
# doxdox 'src/class/popup.js' --layout markdown --output documentation/src/class/popup.md
# doxdox 'src/class/project.js' --layout markdown --output documentation/src/class/project.md
# doxdox 'src/class/property_panel.js' --layout markdown --output documentation/src/class/property_panel.md

cwd = $pwd

chmod 777 *
for file in src/class/*
do
    echo "$("$file")"
done