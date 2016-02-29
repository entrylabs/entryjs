/**
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
    this.content = Blockly.Xml.textToDom(Entry.Func.CREATE_BLOCK);
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
    this.srcFName = "";
    var fieldElement = $(func.content.innerHTML).find('field');

    for(var i = 0; i < fieldElement.length; i++)
        if($(fieldElement[i]).attr('name') === "NAME") {
            this.srcFName+=$(fieldElement[i]).text();
            this.srcFName+=' ';
        }
    this.srcFName = this.srcFName.trim();
    
    this.cancelEdit(); 
    if (this.workspace)
        this.workspace.visible = true;
    this.initEditView();
    this.targetFunc = func;
    this.workspace.clear();
    Blockly.Xml.domToWorkspace(this.workspace, func.content);
    this.updateMenu();
    this.position_();
};

Entry.Func.initEditView = function() {
    this.parentView = Entry.playground.blocklyView_;
    if (!this.svg) {
        this.svg = Blockly.createSvgElement('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:html': 'http://www.w3.org/1999/xhtml',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'version': '1.1',
            'class': 'blocklySvg entryFunctionEdit'
        });
        this.workspace = new Blockly.Workspace();
        this.workspace.visible = true;
        var func = this;

        this.generateButtons();

        this.svg.appendChild(this.workspace.createDom());
        this.workspace.scrollbar = new Blockly.ScrollbarPair(
            this.workspace);
        var scrollbar = this.workspace.scrollbar;
        scrollbar.resize();

        this.workspace.addTrashcan();

        Blockly.bindEvent_(window, 'resize', scrollbar, scrollbar.resize);
        document.addEventListener("blocklyWorkspaceChange", this.syncFunc, false);

        var workspace = this.workspace;
        Blockly.bindEvent_(this.svg, 'mousedown', null, function(e) {
            workspace.dragMode = true;
            workspace.startDragMouseX = e.clientX;
            workspace.startDragMouseY = e.clientY;
            workspace.startDragMetrics = workspace.getMetrics();
            workspace.startScrollX = workspace.scrollX;
            workspace.startScrollY = workspace.scrollY;
        });
        Blockly.bindEvent_(this.svg, 'mousemove', null, function(e) {
            var hScroll = scrollbar.hScroll;
            var vScroll = scrollbar.hScroll;
            hScroll.svgGroup_.setAttribute('opacity', '1');
            vScroll.svgGroup_.setAttribute('opacity', '1');
            if (workspace.dragMode) {
              Blockly.removeAllRanges();
              var dx = e.clientX - workspace.startDragMouseX;
              var dy = e.clientY - workspace.startDragMouseY;
              var metrics = workspace.startDragMetrics;
              var x = workspace.startScrollX + dx;
              var y = workspace.startScrollY + dy;
              x = Math.min(x, -metrics.contentLeft);
              y = Math.min(y, -metrics.contentTop);
              x = Math.max(x, metrics.viewWidth - metrics.contentLeft -
                           metrics.contentWidth);
              y = Math.max(y, metrics.viewHeight - metrics.contentTop -
                           metrics.contentHeight);

              // Move the scrollbars and the page will scroll automatically.
              scrollbar.set(-x - metrics.contentLeft,
                                      -y - metrics.contentTop);
            }
        });
        Blockly.bindEvent_(this.svg, 'mouseup', null, function(e) {
            workspace.dragMode = false;
        });
    }

    Blockly.mainWorkspace.blockMenu.targetWorkspace = this.workspace;

    this.doWhenInit();
    this.parentView.appendChild(this.svg);
};

Entry.Func.save = function() {
    var dstFName = "";
    this.targetFunc.content = Blockly.Xml.workspaceToDom(this.workspace);
    this.targetFunc.generateBlock(true);
    Entry.variableContainer.saveFunction(this.targetFunc);
    var fieldElement = $(this.targetFunc.content.innerHTML).find('field');

    for(var i = 0; i < fieldElement.length; i++)
        if($(fieldElement[i]).attr('name') === "NAME") {
            
            dstFName+=$(fieldElement[i]).text();
            dstFName+=' ';
        }
    dstFName = dstFName.trim();
    this.syncFuncName(dstFName);

    this.cancelEdit();
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
    this.doWhenCancel();
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

/**
 * Update view when window resizing
 * @private
 */
Entry.Func.prototype.syncViewSize_ = function() {
  var rect = this.parentView.getBoundingClientRect();
  this.svg.style.width = rect.width;
  this.svg.style.height = rect.height;
};

Entry.Func.generateButtons = function() {
    var func = this;
    var btnWrapper = Blockly.createSvgElement('g', {}, this.svg);
    this.btnWrapper = btnWrapper;
    var saveText = Blockly.createSvgElement('text', {
      'x': '27',
      'y': '33',
      'class': 'entryFunctionButtonText'
      }, btnWrapper);
    var saveTextNode = document.createTextNode(Lang.Buttons.save);
    saveText.appendChild(saveTextNode);

    var cancelText = Blockly.createSvgElement('text', {
      'x': '102.5',
      'y': '33',
      'class': 'entryFunctionButtonText'
      }, btnWrapper);
    var cancelTextNode = document.createTextNode(Lang.Buttons.cancel);
    cancelText.appendChild(cancelTextNode);
    var saveButton = Blockly.createSvgElement('circle', {
        'cx': '27.5',
        'cy': '27.5',
        'r': '27.5',
        'class': 'entryFunctionButton'
    }, btnWrapper);
    var cancelButton = Blockly.createSvgElement('circle', {
        'cx': '102.5',
        'cy': '27.5',
        'r': '27.5',
        'class': 'entryFunctionButton'
    }, btnWrapper);

    saveButton.onclick = function(e) { func.save(); };
    saveText.onclick = function(e) { func.save(); };

    cancelButton.onclick = function(e) { func.cancelEdit(); };
    cancelText.onclick = function(e) { func.cancelEdit(); };
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

Entry.Func.doWhenInit = function() {
    var svg = this.svg;
    svg.appendChild(Blockly.fieldKeydownDom);
    svg.appendChild(Blockly.fieldDropdownDom);
    svg.appendChild(Blockly.contextMenu);
    Blockly.bindEvent_(window, 'resize', this, this.position_);
    Blockly.bindEvent_(svg, 'mousedown', null, Blockly.onMouseDown_);
    Blockly.bindEvent_(svg, 'contextmenu', null, Blockly.onContextMenu_);
};

Entry.Func.doWhenCancel = function() {
    //Blockly.clipboard_ = null;
    var svg = Blockly.svg;
    svg.appendChild(Blockly.fieldKeydownDom);
    svg.appendChild(Blockly.fieldDropdownDom);
    svg.appendChild(Blockly.contextMenu);
    Blockly.unbindEvent_(window, 'resize', this, this.position_);
    Blockly.unbindEvent_(svg, 'mousedown', null, Blockly.onMouseDown_);
    Blockly.unbindEvent_(svg, 'contextmenu', null, Blockly.onContextMenu_);
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

