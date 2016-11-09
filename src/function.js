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
                copyable: false,
                deletable: false,
                x: 40, y: 40
            }
        ]
    ]);
    this.block = null;
    this.blockMenuBlock = null;
    this._backupContent = null;
    this.hashMap = {};

    this.paramMap = {};

    Entry.generateFunctionSchema(this.id);

    if (func) {
        var blockMap = this.content._blockMap;
        for (var key in blockMap) {
            Entry.Func.registerParamBlock(blockMap[key].type);
        }
        Entry.Func.generateWsBlock(this);
    }

    Entry.Func.registerFunction(this);

    Entry.Func.updateMenu();
};

Entry.Func.threads = {};

Entry.Func.registerFunction = function(func) {
    if (!Entry.playground) return;
    var workspace = Entry.playground.mainWorkspace;
    if (!workspace) return;
    var blockMenu = workspace.getBlockMenu();
    var menuCode = blockMenu.code;
    this._targetFuncBlock = menuCode.createThread([{
        type: "func_" + func.id,
        category: 'func',
        display: false
    }]);
    func.blockMenuBlock = this._targetFuncBlock;
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

Entry.Func.prototype.destroy = function() {
    this.blockMenuBlock.destroy();
};

Entry.Func.edit = function(func) {
    this.cancelEdit();
    this.targetFunc = func;
    this.initEditView(func.content);
    this.bindFuncChangeEvent();
    this.updateMenu();
    setTimeout(function() {
        this._backupContent = func.content.stringify();
    }.bind(this), 0);
};

Entry.Func.initEditView = function(content) {
    if (!this.menuCode)
        this.setupMenuCode();
    var workspace = Entry.playground.mainWorkspace;
    workspace.setMode(Entry.Workspace.MODE_OVERLAYBOARD);
    workspace.changeOverlayBoardCode(content);
    content.recreateView();
    workspace.changeOverlayBoardCode(content);
    this._workspaceStateEvent = workspace.changeEvent.attach(this, this.endEdit);
    content.view.reDraw();
    content.view.board.alignThreads();
};

Entry.Func.endEdit = function(message) {
    this.unbindFuncChangeEvent();
    this._workspaceStateEvent.destroy();
    delete this._workspaceStateEvent;
    switch(message){
        case "save":
            this.save();
            break;
        case "cancelEdit":
            this.cancelEdit();
            break;
    }
    this._backupContent = null;
    Entry.playground.mainWorkspace.setMode(Entry.Workspace.MODE_BOARD);
    delete this.targetFunc;
    this.updateMenu();
}

Entry.Func.save = function() {
    this.targetFunc.generateBlock(true);
    Entry.variableContainer.saveFunction(this.targetFunc);
};

Entry.Func.syncFuncName = function(dstFName) {
    var index = 0;
    var dstFNameTokens = [];
    dstFNameTokens = dstFName.split(' ');
    var name ="";
    var blocks = [];
    blocks =  Blockly.mainWorkspace.getAllBlocks();
    for(var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if(block.type === "function_general") {
            var iList = [];
            iList = block.inputList;
            for(var j=0; j < iList.length; j++) {
                var input = iList[j];
                if(input.fieldRow.length > 0 && (input.fieldRow[0] instanceof Blockly.FieldLabel) && (input.fieldRow[0].text_ != undefined)) {
                    name+=input.fieldRow[0].text_;
                    name+=" ";
                }
            }
            name = name.trim();
            if(name === this.srcFName && (this.srcFName.split(' ').length == dstFNameTokens.length)) {
                for(var k=0; k < iList.length; k++) {
                    var input = iList[k];
                    if(input.fieldRow.length > 0 && (input.fieldRow[0] instanceof Blockly.FieldLabel) && (input.fieldRow[0].text_ != undefined)) {
                        if(dstFNameTokens[index] === undefined) {
                            iList.splice(k,1);
                            break;
                        }
                        else {
                           input.fieldRow[0].text_ = dstFNameTokens[index];
                        }

                        index++;
                    }
                }
            }
            name = '';
            index = 0;
        }
    }
    var updatedDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, updatedDom);
};

Entry.Func.cancelEdit = function() {
    if (!this.targetFunc) return;

    if (!this.targetFunc.block) {
        this._targetFuncBlock.destroy();
        delete Entry.variableContainer.functions_[this.targetFunc.id];
        delete Entry.variableContainer.selected;
    } else {
        if (this._backupContent) {
            this.targetFunc.content.load(this._backupContent);
            Entry.generateFunctionSchema(this.targetFunc.id);
            Entry.Func.generateWsBlock(this.targetFunc);
        }
    }
    Entry.variableContainer.updateList();
    Entry.Func.isEdit = false;
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
    var workspace = Entry.playground.mainWorkspace;
    if (!workspace) return;
    var blockMenu = workspace.getBlockMenu();
    var menuCode = blockMenu.code;
    var CATEGORY = 'func';
    this._fieldLabel = menuCode.createThread([{
        type: "function_field_label",
        category: CATEGORY
    }]).getFirstBlock();
    this._fieldString = menuCode.createThread([{
        type: "function_field_string",
        category: CATEGORY,
        params: [
            {type: this.requestParamBlock("string")}
        ]
    }]).getFirstBlock();
    this._fieldBoolean = menuCode.createThread([{
        type: "function_field_boolean",
        category: CATEGORY,
        params: [
            {type: this.requestParamBlock("boolean")}
        ]
    }]).getFirstBlock();
    this.menuCode = menuCode;
}

Entry.Func.refreshMenuCode = function() {
    var workspace = Entry.playground.mainWorkspace;
    if (!workspace) return;
    if (!this.menuCode)
        this.setupMenuCode();
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

    var blockType = type + "Param_" + id;
    var blockSchema = Entry.Func.createParamBlock(blockType, blockPrototype, type);
    Entry.block[blockType] = blockSchema;
    return blockType;
};

Entry.Func.registerParamBlock = function(type) {
    if (type.indexOf("stringParam") > -1) {
        Entry.Func.createParamBlock(type, Entry.block.function_param_string, type);
    } else if (type.indexOf("booleanParam") > -1 ) {
        Entry.Func.createParamBlock(type, Entry.block.function_param_boolean, type);
    }
};

Entry.Func.createParamBlock = function(type, blockPrototype, originalType) {
    var blockSchema = function () {};
    originalType = originalType === "string" ? "function_param_string" : "function_param_boolean";
    blockSchema.prototype = blockPrototype;
    blockSchema = new blockSchema();
    blockSchema.changeEvent = new Entry.Event();
    blockSchema.template = Lang.template[originalType];

    Entry.block[type] = blockSchema;
    return blockSchema;
}

Entry.Func.updateMenu = function() {
    if (!Entry.playground || !Entry.playground.mainWorkspace) return;
    var workspace = Entry.playground.mainWorkspace;
    var blockMenu = workspace.getBlockMenu();
    if (this.targetFunc) {
        if (!this.menuCode)
            this.setupMenuCode();
        blockMenu.banClass("functionInit", true);
        blockMenu.unbanClass("functionEdit", true);
    } else {
        blockMenu.unbanClass("functionInit", true);
        blockMenu.banClass("functionEdit", true);
    }
    blockMenu.align();
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

    var reg = /(%\d)/mi;
    var templateParams = blockSchema.template.split(reg);
    var description = "";
    var booleanIndex = 0;
    var stringIndex = 0;
    for (var i in templateParams) {
        var templateChunk = templateParams[i];
        if (reg.test(templateChunk)) {
            var paramIndex = Number(templateChunk.split('%')[1]) - 1;
            var param = blockSchema.params[paramIndex];
            if (param.type === "Indicator") {
            } else if (param.accept === "boolean") {
                description +=
                    Lang.template.function_param_boolean +
                    (booleanIndex ? booleanIndex : "");
                booleanIndex++;
            } else {
                description += Lang.template.function_param_string +
                    (stringIndex ? stringIndex : "");
                stringIndex++;
            }
        } else {
            description += templateChunk
        }

    }

    return {block: block, description: description};
};

Entry.Func.prototype.generateBlock = function(toSave) {
    var generatedInfo = Entry.Func.generateBlock(this);
    this.block = generatedInfo.block;
    this.description = generatedInfo.description;
};

Entry.Func.generateWsBlock = function(targetFunc) {
    this.unbindFuncChangeEvent();
    targetFunc = targetFunc ? targetFunc : this.targetFunc;
    var defBlock = targetFunc.content.getEventMap("funcDef")[0];
    var outputBlock = defBlock.params[0];
    var booleanIndex = 0;
    var stringIndex = 0;
    var schemaParams = [];
    var schemaTemplate = "";
    var hashMap = targetFunc.hashMap;
    var paramMap = targetFunc.paramMap;
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
                    accept: "boolean"
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
                    accept: "string"
                });
                break;
        }
        outputBlock = outputBlock.getOutputBlock();
    }
    booleanIndex++;
    schemaTemplate += " %" + (booleanIndex + stringIndex);
    schemaParams.push({
        "type": "Indicator",
        "img": "block_icon/function_03.png",
        "size": 12
    });

    var funcName = "func_" + targetFunc.id;
    var originSchema = Entry.block[funcName];

    var shouldFuncMutate = false;

    if (originSchema.template !== schemaTemplate)
        shouldFuncMutate = true;
    else if (originSchema.params.length === schemaParams.length) {
        for (var i=0; i<originSchema.params.length-1; i++) {
            var originParam = originSchema.params[i];
            var newParam = schemaParams[i];
            if (originParam.type === newParam.type &&
                originParam.accept === newParam.accept)
                continue;
            else {
                shouldFuncMutate = true;
                break;
            }
        }
    }

    if (shouldFuncMutate) {
        Entry.Mutator.mutate(
            funcName,
            {
                params: schemaParams,
                template: schemaTemplate
            }
        );
    }

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

    this.bindFuncChangeEvent(targetFunc);
};

Entry.Func.bindFuncChangeEvent = function(targetFunc) {
    targetFunc = targetFunc ? targetFunc : this.targetFunc;
    if (!this._funcChangeEvent && targetFunc.content.getEventMap("funcDef")[0].view)
        this._funcChangeEvent = targetFunc.content
            .getEventMap("funcDef")[0].view._contents[1]
            .changeEvent.attach(this, this.generateWsBlock);
};

Entry.Func.unbindFuncChangeEvent = function() {
    if (this._funcChangeEvent)
        this._funcChangeEvent.destroy();
    delete this._funcChangeEvent;
};

