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
Entry.Func = function() {
    this.id = Entry.generateHash();
    this.content = new Entry.Code([
        [
            {
                type: "function_create",
                x: 40, y: 40
            }
        ]
    ]);
    this.block = null;
    this.stringHash = {};
    this.booleanHash = {};
};

Entry.Func.threads = {};

Entry.Func.registerFunction = function(functionHash, entity) {
    var threadHash = Entry.generateHash();
    var func = Entry.variableContainer.getFunction(functionHash);
    var script = new Entry.Script(entity);
    script.init(func.content.childNodes[0]);
    this.threads[threadHash] = script;
    return threadHash;
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

Entry.Func.CREATE_BTN =
    '<xml><btn text="Lang.Workspace.create_function" ' +
    'onclick="Entry.variableContainer.createFunction()"></btn></xml>';

Entry.Func.createBtn = Entry.nodeListToArray(
    Blockly.Xml.textToDom(Entry.Func.CREATE_BTN).childNodes);

Entry.Func.FIELD_BLOCK =
    '<xml><block type="function_field_label"></block>' +
    '<block type="function_field_string"><value name="PARAM">' +
    '<block type="function_param_string"><mutation hashid="#1"/></block></value></block>' +
    '<block type="function_field_boolean"><value name="PARAM">' +
    '<block type="function_param_boolean"><mutation hashid="#2"/></block></value></block>' +
    '</xml>';

Entry.Func.fieldBlocks = Entry.nodeListToArray(
    Blockly.Xml.textToDom(Entry.Func.FIELD_BLOCK).childNodes);

Entry.Func.CREATE_BLOCK =
    '<xml><block type="function_create" deletable="false" x="28" y="28">' +
    '</block></xml>';

Entry.Func.edit = function(func) {
    this.cancelEdit();
    if (this.workspace)
        this.workspace.visible = true;
    this.initEditView();
    this.targetFunc = func;
    Entry.playground.mainWorkspace.changeOverlayBoardCode(func.content);
    this.updateMenu();
    return;
    this.workspace.clear();
    Blockly.Xml.domToWorkspace(this.workspace, func.content);
    this.position_();
};

Entry.Func.initEditView = function() {
    Entry.playground.mainWorkspace.setMode(Entry.Workspace.MODE_OVERLAYBOARD);
    var blockMenu = Entry.playground.mainWorkspace.getBlockMenu();
};

Entry.Func.save = function() {
    this.targetFunc.content = Blockly.Xml.workspaceToDom(this.workspace);
    this.targetFunc.generateBlock(true);
    Entry.variableContainer.saveFunction(this.targetFunc);
    this.cancelEdit();
};

Entry.Func.cancelEdit = function() {
    if (!this.svg || !this.targetFunc)
        return;
    this.workspace.visible = false;
    this.parentView.removeChild(this.svg);
    Entry.Func.isEdit = false;
    Blockly.mainWorkspace.blockMenu.targetWorkspace = Blockly.mainWorkspace;
    if (!this.targetFunc.block) {
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

Entry.Func.updateMenu = function() {
    var blockMenu = Entry.playground.mainWorkspace.getBlockMenu();
    if (!this.menuCode) {
        var menuCode = blockMenu.getCategoryCodes("func");
        menuCode.createThread([ { type: "function_field_label" } ]);
        menuCode.createThread([ { type: "function_field_string" } ]);
        menuCode.createThread([ { type: "function_field_boolean" } ]);
        this.menuCode = menuCode;
    }
    blockMenu.banClass("functionInit");
    blockMenu.unbanClass("functionEdit");
    return;
    if (Entry.playground.selectedMenu == 'func') {
        Entry.playground.blockMenu.hide();
        Entry.playground.blockMenu.show(Entry.Func.getMenuXml());
        if (!Blockly.WidgetDiv.field_ && Entry.Func.targetFunc) {
            var target = Entry.Func.targetFunc;
            var xml = Blockly.Xml.workspaceToDom(Entry.Func.workspace);
            var generals = xml.getElementsByClassName("function_general");
            var hash = target.id;
            var block;
            generals = Entry.nodeListToArray(generals);
            var currentGenerals = [];
            var otherGenerals = {};

            generals.map(function(b) {
                var functionHash = b.getElementsByTagName("mutation")[0]
                            .getAttribute('hashid');
                if (functionHash == hash) currentGenerals.push(b);
                else {
                    if (!otherGenerals[functionHash])
                        otherGenerals[functionHash] = [];
                    otherGenerals[functionHash].push(b);
                }
            });
            currentGenerals.map(function(b) {
                block = Entry.Func.generateWsBlock(xml,
                    Blockly.Xml.workspaceToDom(Entry.Func.workspace),
                    hash).block;
                var remainBlocks = [];
                var flag = false;
                while (b.firstChild) {
                    var child = b.firstChild;
                    var xmlTag = child.tagName;
                    if (flag || xmlTag == 'NEXT') {
                        flag = true;
                        remainBlocks.push(child);
                    }
                    b.removeChild(child);
                }
                while (block.firstChild)
                    b.appendChild(block.firstChild);
                while(remainBlocks.length)
                    b.appendChild(remainBlocks.shift());
            });

            for (var hashKey in otherGenerals) {
                var otherBlocks = otherGenerals[hashKey];
                var funcContent = Entry.variableContainer.getFunction(hashKey).content;
                otherBlocks.map(function(b) {
                    block = Entry.Func.generateWsBlock(xml,
                        funcContent,
                        hashKey).block;
                    var remainBlocks = [];
                    var flag = false;
                    while (b.firstChild) {
                        var child = b.firstChild;
                        var xmlTag = child.tagName;
                        if (flag || xmlTag == 'NEXT') {
                            flag = true;
                            remainBlocks.push(child);
                        }
                        b.removeChild(child);
                    }
                    while (block.firstChild)
                        b.appendChild(block.firstChild);
                    while(remainBlocks.length)
                        b.appendChild(remainBlocks.shift());
                });
            }

            Entry.Func.workspace.clear();
            Blockly.Xml.domToWorkspace(Entry.Func.workspace, xml);
        }
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

Entry.Func.generateBlock = function(func, content, id) {
    var topBlocks = Entry.nodeListToArray(content.childNodes);
    var createBlock;
    for (var i in topBlocks)
        if (topBlocks[i].getAttribute('type') == 'function_create')
            createBlock = topBlocks[i];
    var script = new Entry.Script();
    script.init(createBlock);
    var field = script;
    if (field.values)
        field = script.values.FIELD;
    var mutationXml = '<mutation hashid="' + id + '">';
    var fieldXml = '';
    var description = '';
    var stringCount = 0;
    var booleanCount = 0;
    func.stringHash = {};
    func.booleanHash = {};
    while(true) {
        var type = field.type;
        switch (type) {
            case 'function_field_label':
                mutationXml += '<field type="label" content="' +
                    field.fields.NAME.replace("<", "&lt;").replace(">", "&gt;") + '"></field>';
                description += field.fields.NAME;
                break;
            case 'function_field_boolean':
                var hash = field.values.PARAM.hashId;
                mutationXml += '<field type="boolean" hashid="' + hash +
                               '"></field>';
                fieldXml += '<value name="' + hash + '"><block type="True">' +
                    '</block></value>';
                func.booleanHash[hash] = booleanCount;
                booleanCount++;
                description += '논리값' + booleanCount;
                break;
            case 'function_field_string':
                var hash = field.values.PARAM.hashId;
                mutationXml += '<field type="string" hashid="' + hash +
                               '"></field>';
                fieldXml += '<value name="' + hash + '"><block type="text">' +
                    '<field name="NAME">10</field></block></value>';
                func.stringHash[hash] = stringCount;
                stringCount++;
                description += '문자값' + stringCount;
                break;
        }
        if (field.values && field.values.NEXT) field = field.values.NEXT;
        else break;
        description += ' ';
    }
    mutationXml += '</mutation>';
    var blockText = '<xml><block type="function_general">' + mutationXml +
        fieldXml + '</block></xml>';
    var block = Blockly.Xml.textToDom(blockText).childNodes[0];
    if (!description) description = "함수";
    return {block: block, description: description};
};

Entry.Func.prototype.generateBlock = function(toSave) {
    var generatedInfo = Entry.Func.generateBlock(this, this.content, this.id);
    this.block = generatedInfo.block;
    this.description = generatedInfo.description;
};

Entry.Func.position_ = function() {
    var metrics = this.workspace.getMetrics();
    if (!metrics || !this.workspace.visible) {
      // There are no metrics available (workspace is probably not visible).
        return;
    }
    var wrapper = this.btnWrapper;
    wrapper.setAttribute('transform', 'translate(30, 501)');

    if (Blockly.RTL) {
        //I didn't code here anything
        this.left_ = this.MARGIN_SIDE_;
    } else {
        wrapper.left_ = metrics.viewWidth/2 + metrics.absoluteLeft - 60;
    }
    wrapper.top_ = metrics.viewHeight + metrics.absoluteTop - 200;
    wrapper.setAttribute('transform',
        'translate(' + wrapper.left_ + ',' + wrapper.top_ + ')');
};

Entry.Func.positionBlock_ = function(block) {
    var metrics = this.workspace.getMetrics();
    if (!metrics || !this.workspace.visible)
        return;

    var originRoot = block.getSvgRoot();
    var originXY = Blockly.getSvgXY_(originRoot);

    var hw = block.getHeightWidth();
    var targetX = metrics.viewWidth/2 - 80;
    var targetY = metrics.viewHeight/2 - 50;
    block.moveBy(targetX-originXY.x, targetY-originXY.y);
};

Entry.Func.generateWsBlock = function(func, content, id) {
    var topBlocks = content.childNodes;
    var createBlock;
    for (var i in topBlocks) {
        if (topBlocks[i].getAttribute('type') == 'function_create') {
            createBlock = topBlocks[i];
            break;
        }
    }
    var script = new Entry.Script();
    script.init(createBlock);
    var field = script;
    if (field.values)
        field = script.values.FIELD;
    var mutationXml = '<mutation hashid="' + id + '">';
    var fieldXml = '';
    var description = '';
    var stringCount = 0;
    var booleanCount = 0;
    func.stringHash = {};
    func.booleanHash = {};
    while(true) {
        switch (field.type) {
            case 'function_field_label':
                mutationXml += '<field type="label" content="' +
                    field.fields.NAME.replace("<", "&lt;").replace(">", "&gt;") + '"></field>';
                description += field.fields.NAME;
                break;
            case 'function_field_boolean':
                var hash = field.values.PARAM.hashId;
                mutationXml += '<field type="boolean" hashid="' + hash +
                               '"></field>';
                fieldXml += '<value name="' + hash + '"><block type="function_param_boolean">' +
                    '<mutation hashid="'+ hash +'"></mutation></block></value>';
                func.booleanHash[hash] = booleanCount;
                booleanCount++;
                description += '논리값' + booleanCount;
                break;
            case 'function_field_string':
                var hash = field.values.PARAM.hashId;
                mutationXml += '<field type="string" hashid="' + hash +
                               '"></field>';
                fieldXml += '<value name="' + hash + '"><block type="function_param_string">' +
                    '<mutation hashid="'+ hash +'"></mutation></block></value>';
                func.stringHash[hash] = stringCount;
                stringCount++;
                description += '문자값' + stringCount;
                break;
        }
        if (field.values && field.values.NEXT)
            field = field.values.NEXT;
        else break;
        description += ' ';
    }
    mutationXml += '</mutation>';
    var blockText = '<xml><block type="function_general">' +
        mutationXml + fieldXml + '</block></xml>';
    if (!description) description = "함수";
    return {
        block: Blockly.Xml.textToDom(blockText).childNodes[0],
        description: description
    };
};
