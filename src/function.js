/*
 * @fileoverview Func object for entry function.
 */
'use strict';

goog.require("Entry.Utils");

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.Func = function(func) {
    this.id = func ? func.id : Entry.generateHash();
    this.content = func ? new Entry.Code(func.content) : new Entry.Code([
        [
            {
                type: "function_create",
                x: 40, y: 40
            }
        ]
    ]);
    this.block = null;
    this.hashMap = {};

    this.paramMap = {};

    var blockSchema = function () {};
    blockSchema.prototype = Entry.block.function_general;
    blockSchema = new blockSchema();
    blockSchema.changeEvent = new Entry.Event();

    Entry.block["func_" + this.id] = blockSchema;

    Entry.Func.registerFunction(this);
};

Entry.Func.threads = {};

Entry.Func.registerFunction = function(func) {
    var blockMenu = Entry.playground.mainWorkspace.getBlockMenu();
    var menuCode = blockMenu.getCategoryCodes("func");
    this._targetFuncBlock = menuCode.createThread([{
        type: "func_" + func.id
    }]);
};

Entry.Func.executeFunction = function(threadHash) {
    var script = this.threads[threadHash];
    script = Entry.Engine.computeThread(script.entity, script);
    if (script) {
        this.threads[threadHash] = script;
        return true;
    } else {
        delete this.threads[threadHash];
        return false;
    }
};

Entry.Func.clearThreads = function() {
    this.threads = {};
};

Entry.Func.prototype.init = function(model) {
    this.id = model.id;
    this.content = Blockly.Xml.textToDom(model.content);
    var xmlText = '<xml>' + model.block + '</xml>';
    this.block = Blockly.Xml.textToDom(xmlText).childNodes[0];
};

Entry.Func.edit = function(func) {
    this.cancelEdit();
    this.targetFunc = func;
    this.initEditView(func.content);
    this.bindFuncChangeEvent();
    this.updateMenu();
};

Entry.Func.initEditView = function(content) {
    if (!this.menuCode)
        this.setupMenuCode();
    var workspace = Entry.playground.mainWorkspace;
    workspace.setMode(Entry.Workspace.MODE_OVERLAYBOARD);
    workspace.changeOverlayBoardCode(content);
    this._workspaceStateEvent = workspace.changeEvent.attach(this, this.endEdit);
};

Entry.Func.endEdit = function(message) {
    this._funcChangeEvent.destroy();
    this._workspaceStateEvent.destroy();
    delete this._workspaceStateEvent;
    switch(message){
        case "save":
            this.save();
        case "cancelEdit":
            this.cancelEdit();
    }
}

Entry.Func.save = function() {
    this.targetFunc.generateBlock(true);
    Entry.variableContainer.saveFunction(this.targetFunc);
};

Entry.Func.cancelEdit = function() {
    if (!this.targetFunc)
        return;
    Entry.Func.isEdit = false;
    if (!this.targetFunc.block) {
        this._targetFuncBlock.destroy();
        delete Entry.variableContainer.functions_[this.targetFunc.id];
        delete Entry.variableContainer.selected;
    }
    delete this.targetFunc;
    this.updateMenu();
    Entry.variableContainer.updateList();
};

Entry.Func.getMenuXml = function() {
    var blocks = [];
    if (!this.targetFunc)
        blocks = blocks.concat(this.createBtn);
    if (this.targetFunc) {
        var fieldXml = this.FIELD_BLOCK;
        fieldXml = fieldXml.replace('#1', Entry.generateHash());
        fieldXml = fieldXml.replace('#2', Entry.generateHash());
        var xml = Blockly.Xml.textToDom(fieldXml).childNodes;
        blocks = blocks.concat(Entry.nodeListToArray(xml));
    }
    for (var i in Entry.variableContainer.functions_) {
        var func = Entry.variableContainer.functions_[i];
        if (func === this.targetFunc) {
            var block = Entry.Func.generateBlock(
                this.targetFunc,
                Blockly.Xml.workspaceToDom(Entry.Func.workspace),
                func.id).block;
            blocks.push(block);
        } else
            blocks.push(func.block);
    }
    return blocks;
};

Entry.Func.syncFunc = function() {
    var func = Entry.Func;
    if (!func.targetFunc)
        return;
    var fieldText = func.workspace.topBlocks_[0].toString();
    var workspaceLength = func.workspace.topBlocks_.length;
    if ((func.fieldText != fieldText ||
        func.workspaceLength != workspaceLength) &&
            Blockly.Block.dragMode_ < 1) {
        func.updateMenu();
        func.fieldText = fieldText;
        func.workspaceLength = workspaceLength;
    }
};

Entry.Func.setupMenuCode = function() {
    var blockMenu = Entry.playground.mainWorkspace.getBlockMenu();
    var menuCode = blockMenu.getCategoryCodes("func");
    this._fieldLabel = menuCode.createThread([{
        type: "function_field_label"
    }]).getFirstBlock();
    this._fieldString = menuCode.createThread([{
        type: "function_field_string",
        params: [
            {type: this.requestParamBlock("string")}
        ]
    }]).getFirstBlock();
    this._fieldBoolean = menuCode.createThread([{
        type: "function_field_boolean",
        params: [
            {type: this.requestParamBlock("boolean")}
        ]
    }]).getFirstBlock();
    this.menuCode = menuCode;
}

Entry.Func.refreshMenuCode = function() {
    var stringType = this._fieldString.params[0].type;
    var referenceCount = Entry.block[stringType].changeEvent._listeners.length;
    if (referenceCount > 2) // check new block type is used
        this._fieldString.params[0].changeType(this.requestParamBlock("string"));
    var booleanType = this._fieldBoolean.params[0].type;
    referenceCount = Entry.block[booleanType].changeEvent._listeners.length;
    if (referenceCount > 2)
        this._fieldBoolean.params[0].changeType(this.requestParamBlock("boolean"));
};

Entry.Func.requestParamBlock = function(type) {
    var id = Entry.generateHash();
    var blockPrototype;
    switch (type) {
        case "string":
            blockPrototype = Entry.block.function_param_string;
            break;
        case "boolean":
            blockPrototype = Entry.block.function_param_boolean;
            break;
        default:
            return null;
    }

    var blockSchema = function () {};
    blockSchema.prototype = blockPrototype;
    blockSchema = new blockSchema();
    blockSchema.changeEvent = new Entry.Event();

    var blockType = type + "Param_" + id;
    Entry.block[blockType] = blockSchema;
    this.targetFunc.hashMap[blockType] = true;
    return blockType;
};

Entry.Func.updateMenu = function() {
    var blockMenu = Entry.playground.mainWorkspace.getBlockMenu();
    if (this.targetFunc) {
        if (!this.menuCode)
            this.setupMenuCode();
        blockMenu.banClass("functionInit");
        blockMenu.unbanClass("functionEdit");
    } else {
        blockMenu.unbanClass("functionInit");
        blockMenu.banClass("functionEdit");
    }
};

Entry.Func.prototype.edit = function() {
    if (Entry.Func.isEdit)
        return;
    Entry.Func.isEdit = true;
    if (!Entry.Func.svg)
        Entry.Func.initEditView();
    else {
        this.parentView.appendChild(this.svg);
    }
};

Entry.Func.generateBlock = function(func) {
    var blockSchema = Entry.block["func_" + func.id];
    var block = {
        template: blockSchema.template,
        params: blockSchema.params
    }
    return {block: block, description: blockSchema.template};
};

Entry.Func.prototype.generateBlock = function(toSave) {
    var generatedInfo = Entry.Func.generateBlock(this);
    this.block = generatedInfo.block;
    this.description = generatedInfo.description;
};

Entry.Func.generateWsBlock = function() {
    var defBlock = this.targetFunc.content.getEventMap("funcDef")[0];
    var outputBlock = defBlock.params[0];
    var booleanIndex = 0;
    var stringIndex = 0;
    var schemaParams = [];
    var schemaTemplate = "";
    var hashMap = this.targetFunc.hashMap;
    var paramMap = this.targetFunc.paramMap;
    this.unbindFuncChangeEvent();
    while(outputBlock) {
        var value = outputBlock.params[0];
        switch(outputBlock.type) {
            case 'function_field_label':
                schemaTemplate = schemaTemplate + " " + value;
                break;
            case 'function_field_boolean':
                Entry.Mutator.mutate(value.type, {
                    template: Lang.Blocks.FUNCTION_logical_variable +
                        " " + (booleanIndex ? booleanIndex : "")
                });
                hashMap[value.type] = false;
                paramMap[value.type] = booleanIndex + stringIndex;
                booleanIndex++;
                schemaParams.push({
                    type: "Block",
                    accept: "booleanMagnet"
                });
                schemaTemplate += " %" + (booleanIndex + stringIndex);
                break;
            case 'function_field_string':
                Entry.Mutator.mutate(value.type, {
                    template: Lang.Blocks.FUNCTION_character_variable +
                        " " + (stringIndex ? stringIndex : "")
                });
                hashMap[value.type] = false;
                paramMap[value.type] = booleanIndex + stringIndex;
                stringIndex++;
                schemaTemplate += " %" + (booleanIndex + stringIndex);
                schemaParams.push({
                    type: "Block",
                    accept: "stringMagnet"
                });
                break;
        }
        outputBlock = outputBlock.getOutputBlock();
    }
    Entry.Mutator.mutate(
        "func_" + this.targetFunc.id,
        {params: schemaParams, template: schemaTemplate}
    );

    for (var key in hashMap) {
        var state = hashMap[key];
        if (state) {
            var text;
            if (key.indexOf("string") > -1)
                text = Lang.Blocks.FUNCTION_character_variable;
            else
                text = Lang.Blocks.FUNCTION_logical_variable;
            Entry.Mutator.mutate(key, {
                template: text
            });
        } else {
            hashMap[key] = true;
        }
    }

    this.refreshMenuCode();

    this.bindFuncChangeEvent();
};

Entry.Func.bindFuncChangeEvent = function() {
    if (!this._funcChangeEvent)
        this._funcChangeEvent = this.targetFunc.content
            .getEventMap("funcDef")[0].view._contents[1]
            .changeEvent.attach(this, this.generateWsBlock);
};

Entry.Func.unbindFuncChangeEvent = function() {
    if (this._funcChangeEvent)
        this._funcChangeEvent.destroy();
    delete this._funcChangeEvent;
};
