'use strict';

Entry.Xml = {};

Entry.Xml.isTypeOf = function(typeName, script) {
    return script.getAttribute("type") == typeName;
};

Entry.Xml.getNextBlock = function(script) {
    var childrens = script.childNodes;
    for (var i = 0; i<childrens.length; i++) {
        if (childrens[i].tagName.toUpperCase() == "NEXT") {
            return childrens[i].children[0];
        }
    }
    return null;
};

Entry.Xml.getStatementBlock = function(statementName, script) {
    var statements = script.getElementsByTagName("statement");
    if (!statements.length)
        return script;
    for (var i in statements) {
        if (statements[i].getAttribute("name") == statementName)
            return statements[i].children[0];
    }
    return null;
};

Entry.Xml.getParentLoop = function(script) {
    while (true) {
        if (!script)
            return null;
        script = script.parentNode;
        if (script && script.tagName.toUpperCase() == "STATEMENT") {
            return script.parentNode
        } else if (script) {
            script = script.parentNode;
        } else {
            return null;
        }
    }
};

Entry.Xml.getParentIterateLoop = function(script) {
    while (true) {
        if (!script)
            return null;
        script = script.parentNode;
        if (script && script.getAttribute("type") &&
            script.getAttribute("type").toUpperCase().substr(0,6) == "REPEAT") {
            return script;
        } else if (script) {
            script = script;
        } else {
            return null;
        }
    }
};

Entry.Xml.getParentBlock = function(script) {
    var parent = script.parentNode;
    if (parent) {
        return parent.parentNode
    }
    return null;
};

Entry.Xml.callReturn = function(script) {
    var nextBlock = Entry.Xml.getNextBlock(script);
    if (nextBlock) {
        return nextBlock;
    } else {
        var parentBlock =  Entry.Xml.getParentLoop(script);
        return parentBlock;
    }
};

Entry.Xml.isRootBlock = function(script) {
};

Entry.Xml.getValue = function(valueName, script) {
    var childrens = script.childNodes;
    if (!childrens.length)
        return null;
    for (var i in childrens) {
        if (childrens[i].tagName.toUpperCase() == "VALUE" &&
            childrens[i].getAttribute("name") == valueName)
            return childrens[i].children[0];
    }
    return null;
};

Entry.Xml.getNumberValue = function(sprite, valueName, script) {
    var childrens = script.childNodes;
    if (!childrens.length)
        return null;
    for (var i in childrens) {
        if (childrens[i].tagName && childrens[i].tagName.toUpperCase() == "VALUE" &&
            childrens[i].getAttribute("name") == valueName)
            return Number(Entry.Xml.operate(sprite, childrens[i].children[0]));
    }
    return null;
};

Entry.Xml.getField = function(valueName, script) {
    var childrens = script.childNodes;
    if (!childrens.length)
        return null;
    for (var i in childrens) {
        /*
        if (childrens[i].tagName.toUpperCase() == "FIELD" &&
            childrens[i].getAttribute("name") == valueName)
            return childrens[i].textContent;
            */
        if (childrens[i].tagName && childrens[i].tagName.toUpperCase() == "FIELD" &&
            childrens[i].getAttribute("name") == valueName)
            return childrens[i].textContent;
    }
};

Entry.Xml.getNumberField = function(valueName, script) {
    var childrens = script.childNodes;
    if (!childrens.length)
        return null;
    for (var i in childrens) {
        if (childrens[i].tagName.toUpperCase() == "FIELD" &&
            childrens[i].getAttribute("name") == valueName)
            return Number(childrens[i].textContent);
    }
};

Entry.Xml.getBooleanValue = function(sprite, valueName, script) {
    var values = script.getElementsByTagName("value");
    var valueBlock;
    if (!values.length)
        return null;
    for (var i in values) {
        if (values[i].getAttribute("name") == valueName)
            return Entry.Xml.operate(sprite, values[i].children[0]);
    }
    if (!valueBlock)
        return null;
};

Entry.Xml.operate = function (sprite, script) {
    return Entry.block[script.getAttribute("type")](sprite, script);
};

Entry.Xml.cloneBlock = function (block, linkNode, type) {
    var clonedBlock = block.cloneNode();
    if (block.parentNode && block.parentNode.tagName != 'xml') {
        Entry.Xml.cloneBlock(block.parentNode, clonedBlock, 'parent');
    }
    for (var i = 0; i < block.childNodes.length; i++) {
        var child = block.childNodes[i];
        if (child instanceof Text) {
            clonedBlock.textContent = child.textContent;
            continue;
        }
        if (type == 'parent')
            clonedBlock.appendChild(linkNode);
        else
            clonedBlock.appendChild(Entry.Xml.cloneBlock(
                child, clonedBlock, 'child'));
    }
    return clonedBlock;
};
