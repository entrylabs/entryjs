/*
 * @fileoverview Func object for entry function.
 */
'use strict';

/**
 * doxdox 'src/class/function.js' --layout markdown --output documentation/src/class/function.md
 *
 * Block variable constructor
 *
 * ```javascript
 * this = {
 *      threads,
 *      blockMenuBlock
 *      targetFunc
 *      menuCode
 *      _workspaceStateEvent
 *      _backupContent
 *      _fieldLabel
 *      _fieldString
 *      _fieldBoolean
 *      parentView
 *      block
 *      description
 *      _funcChangeEvent
 * }
 * ```
 *
 * @param {variable.model} variable
 * @constructor
 */
Entry.Func = function(func) {
    this.id = func && func.id ? func.id : Entry.generateHash();
    let content;
    //inspect empty content
    if (func && func.content && func.content.length > 4) {
        content = func.content;
    }
    this.content = content
        ? new Entry.Code(content)
        : new Entry.Code([
              [
                  {
                      type: 'function_create',
                      copyable: false,
                      deletable: false,
                      x: 40,
                      y: 40,
                  },
              ],
          ]);
    this.block = null;
    this.blockMenuBlock = null;
    this._backupContent = null;
    this.hashMap = {};

    this.paramMap = {};

    Entry.generateFunctionSchema(this.id);

    if (func && func.content) {
        const blockMap = this.content._blockMap;
        for (const key in blockMap) {
            Entry.Func.registerParamBlock(blockMap[key].type);
        }
        Entry.Func.generateWsBlock(this);
    }

    Entry.Func.registerFunction(this);

    Entry.Func.updateMenu();
};
/**
 * EmptyFunction
 */
Entry.Func.threads = {};

/**
 * 함수/값 등록
 * @param {variable.model} Function
 */
Entry.Func.registerFunction = function(func) {
    if (!Entry.playground) {
        return;
    }
    const workspace = Entry.playground.mainWorkspace;
    if (!workspace) {
        return;
    }
    const blockMenu = workspace.getBlockMenu();
    const menuCode = blockMenu.code;

    this._targetFuncBlock = menuCode.createThread([
        {
            type: `func_${func.id}`,
            category: 'func',
            x: -9999,
        },
    ]);
    func.blockMenuBlock = this._targetFuncBlock;
};

/**
 * 함수/값 실행
 * @param {hashValue} threadHash
 * @return {Boolean} didScriptRan
 */
Entry.Func.executeFunction = function(threadHash) {
    let script = this.threads[threadHash];
    script = Entry.Engine.computeThread(script.entity, script);
    if (script) {
        this.threads[threadHash] = script;
        return true;
    } else {
        delete this.threads[threadHash];
        return false;
    }
};

/**
 * 쓰레드 전체 비우기
 */
Entry.Func.clearThreads = function() {
    this.threads = {};
};

/**
 * 함수/값 전체 삭제
 */
Entry.Func.prototype.destroy = function() {
    this.blockMenuBlock && this.blockMenuBlock.destroy();
};

/**
 * 함수/값 수정, 인자로 받은 함수/값 으로 현재 함수/값을 수정
 * @param {variable.model} Function
 */
Entry.Func.edit = function(func) {
    if (!func) {
        return;
    }

    if (typeof func === 'string') {
        func = Entry.variableContainer.getFunction(/(func_)?(.*)/.exec(func)[2]);
    }

    this.unbindFuncChangeEvent();
    this.unbindWorkspaceStateChangeEvent();

    this.cancelEdit();

    this.targetFunc = func;
    if (this.initEditView(func.content) === false) {
        return;
    } // edit fail
    Entry.Func.isEdit = true;
    this.bindFuncChangeEvent(func);
    this.updateMenu();
    setTimeout(
        function() {
            const schema = Entry.block[`func_${func.id}`];
            if (schema && schema.paramsBackupEvent) {
                schema.paramsBackupEvent.notify();
            }

            this._backupContent = func.content.stringify();
        }.bind(this),
        0
    );
};

/**
 * 인자로 받은 수정 컨텐츠코드에 해당하는 부분 보여주는 뷰를 Init
 * @param {String.BoardCode} content
 */
Entry.Func.initEditView = function(content) {
    if (!this.menuCode) {
        this.setupMenuCode();
    }
    const workspace = Entry.getMainWS();
    if (workspace.setMode(Entry.Workspace.MODE_OVERLAYBOARD) === false) {
        this.endEdit('cancelEdit');
        return false;
    }
    workspace.changeOverlayBoardCode(content);

    this._workspaceStateEvent = workspace.changeEvent.attach(this, (message = 'cancelEdit') => {
        this.endEdit(message);
        if (workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
            workspace.blockMenu.banClass('functionInit');
        }
    });
    content.board.alignThreads();
};

/**
 * 인자로 받은 message 를 통해 현재 수정 단계를 끝맻음, cancelEdit / save
 * @param {String} message
 */
Entry.Func.endEdit = function(message) {
    this.unbindFuncChangeEvent();
    this.unbindWorkspaceStateChangeEvent();
    const targetFuncId = this.targetFunc.id;

    if (this.targetFunc && this.targetFunc.content) {
        this.targetFunc.content.destroyView();
    }

    switch (message) {
        case 'save':
            this.save();
            break;
        case 'cancelEdit':
            this.cancelEdit();
            break;
    }

    this._backupContent = null;

    delete this.targetFunc;
    const blockSchema = Entry.block[`func_${targetFuncId}`];
    if (blockSchema && blockSchema.destroyParamsBackupEvent) {
        blockSchema.destroyParamsBackupEvent.notify();
    }
    this.updateMenu();
    Entry.Func.isEdit = false;
};

/**
 * 수정 하던 함수/값 저장합니다.
 */
Entry.Func.save = function() {
    this.targetFunc.generateBlock(true);
    Entry.variableContainer.saveFunction(this.targetFunc);

    const ws = Entry.getMainWS();
    if (ws && ws.overlayModefrom === Entry.Workspace.MODE_VIMBOARD) {
        const mode = {};
        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
        mode.textType = Entry.Vim.TEXT_TYPE_PY;
        mode.runType = Entry.Vim.WORKSPACE_MODE;
        Entry.getMainWS().setMode(mode);
        Entry.variableContainer.functionAddButton_.addClass('disable');
    }
};

/**
 * 수정 하던 것을 그만둡니다
 */
Entry.Func.cancelEdit = function() {
    if (!this.targetFunc) {
        return;
    }

    if (!this.targetFunc.block) {
        this._targetFuncBlock.destroy();
        delete Entry.variableContainer.functions_[this.targetFunc.id];
        delete Entry.variableContainer.selected;
    } else {
        if (this._backupContent) {
            this.targetFunc.content.load(this._backupContent);
            Entry.generateFunctionSchema(this.targetFunc.id);
            Entry.Func.generateWsBlock(this.targetFunc, true);
        }
    }
    Entry.variableContainer.updateList();

    const ws = Entry.getMainWS();
    if (ws && ws.overlayModefrom === Entry.Workspace.MODE_VIMBOARD) {
        const mode = {};
        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
        mode.textType = Entry.Vim.TEXT_TYPE_PY;
        mode.runType = Entry.Vim.WORKSPACE_MODE;
        Entry.getMainWS().setMode(mode);
        Entry.variableContainer.functionAddButton_.addClass('disable');
    }
};

/**
 * 메뉴에 들어가야하는 부분에 대한 코드를 다시 생성합니다
 */
Entry.Func.setupMenuCode = function() {
    debugger;
    const workspace = Entry.playground.mainWorkspace;
    if (!workspace) {
        return;
    }
    const blockMenu = workspace.getBlockMenu();
    const menuCode = blockMenu.code;
    const CATEGORY = 'func';
    this._fieldLabel = menuCode
        .createThread([
            {
                type: 'function_field_label',
                copyable: false,
                category: CATEGORY,
                x: -9999,
            },
        ])
        .getFirstBlock();

    this._fieldString = menuCode
        .createThread([
            {
                type: 'function_field_string',
                category: CATEGORY,
                x: -9999,
                copyable: false,
                params: [{ type: this.requestParamBlock('string') }],
            },
        ])
        .getFirstBlock();

    this._fieldBoolean = menuCode
        .createThread([
            {
                type: 'function_field_boolean',
                copyable: false,
                category: CATEGORY,
                x: -9999,
                params: [{ type: this.requestParamBlock('boolean') }],
            },
        ])
        .getFirstBlock();

    this.menuCode = menuCode;
    blockMenu.align();
};

/**
 * 메뉴에 들어가야하는 부분에 대한 코드를 다시 세팅합니다 문제가 있다면 다시 생성합니다
 */
Entry.Func.refreshMenuCode = function() {
    if (!Entry.playground.mainWorkspace) {
        return;
    }
    if (!this.menuCode) {
        this.setupMenuCode();
    }

    this._fieldString.params[0].changeType(this.requestParamBlock('string'));
    this._fieldBoolean.params[0].changeType(this.requestParamBlock('boolean'));
};

/**
 * 값 블록을 요청합니다. type에 맞는 기본 값 블록을 리턴합니다.
 * @param {String} type
 * @return {Entry.block} String/Boolean 블록
 */
Entry.Func.requestParamBlock = function(type) {
    let blockPrototype;
    switch (type) {
        case 'string':
            blockPrototype = Entry.block.function_param_string;
            break;
        case 'boolean':
            blockPrototype = Entry.block.function_param_boolean;
            break;
        default:
            return null;
    }

    const blockType = `${type}Param_${Entry.generateHash()}`;
    Entry.block[blockType] = Entry.Func.createParamBlock(blockType, blockPrototype, type);
    return blockType;
};

/**
 * 값 블록을 등록합니다. type에 맞는 타입으로 등록합니다.
 * @param {String} type
 */
Entry.Func.registerParamBlock = function(type) {
    if (!type) {
        return;
    }

    let blockPrototype;
    if (type.indexOf('stringParam') > -1) {
        blockPrototype = Entry.block.function_param_string;
    } else if (type.indexOf('booleanParam') > -1) {
        blockPrototype = Entry.block.function_param_boolean;
    }

    //not a function param block
    if (!blockPrototype) {
        return;
    }

    Entry.Func.createParamBlock(type, blockPrototype, type);
};

/**
 * 값 블록을 생성합니다. type에 맞는 타입으로 등록합니다.
 * originalType 에 맞는 Lang Template 을 가져오며, blockPrototype 을 이용하여 만들어진 블럭을 type 에 맞게 등록하여 리턴합니다.
 * @param {String} type
 * @param {String} blockPrototype
 * @param {String} originalType
 * @return {Entry.block} blockSchema
 */
Entry.Func.createParamBlock = function(type, blockPrototype, originalType) {
    originalType = /string/gi.test(originalType)
        ? 'function_param_string'
        : 'function_param_boolean';
    let blockSchema = function() {};
    blockSchema.prototype = blockPrototype;
    blockSchema = new blockSchema();
    blockSchema.changeEvent = new Entry.Event();
    blockSchema.template = Lang.template[originalType];
    blockSchema.fontColor = blockPrototype.fontColor || '#FFF';

    Entry.block[type] = blockSchema;
    return blockSchema;
};

/**
 * 메뉴창을 갱신합니다.
 */
Entry.Func.updateMenu = function() {
    const workspace = Entry.getMainWS();
    if (!workspace) {
        return;
    }
    const blockMenu = workspace.getBlockMenu();
    if (this.targetFunc) {
        !this.menuCode && this.setupMenuCode();
        blockMenu.banClass('functionInit', true);
        blockMenu.unbanClass('functionEdit', true);
    } else {
        !workspace.isVimMode() && blockMenu.unbanClass('functionInit', true);
        blockMenu.banClass('functionEdit', true);
    }
    blockMenu.lastSelector === 'func' && blockMenu.align();
};

/**
 * 함수/값 수정에 대한 기본 베이스 함수
 */
Entry.Func.prototype.edit = function() {
    if (Entry.Func.isEdit) {
        return;
    }
    Entry.Func.isEdit = true;
    if (!Entry.Func.svg) {
        Entry.Func.initEditView();
    } else {
        this.parentView.appendChild(this.svg);
    }
};

/**
 * 인자로 받은 함수/값을 블록에 넣어서 생성
 * @param {variable.model} Function
 * @return {Object} block && description in singleObject
 */
Entry.Func.generateBlock = function(func) {
    const blockSchema = Entry.block[`func_${func.id}`];
    const block = {
        template: blockSchema.template,
        params: blockSchema.params,
    };

    const reg = /(%\d)/im;
    const templateParams = blockSchema.template.split(reg);
    let description = '';
    let booleanIndex = 0;
    let stringIndex = 0;
    for (const i in templateParams) {
        const templateChunk = templateParams[i];
        if (reg.test(templateChunk)) {
            const paramIndex = Number(templateChunk.split('%')[1]) - 1;
            const param = blockSchema.params[paramIndex];
            if (param.type === 'Indicator') {
            } else if (param.accept === 'boolean') {
                description +=
                    Lang.template.function_param_boolean + (booleanIndex ? booleanIndex : '');
                booleanIndex++;
            } else {
                description +=
                    Lang.template.function_param_string + (stringIndex ? stringIndex : '');
                stringIndex++;
            }
        } else {
            description += templateChunk;
        }
    }

    return { block, description };
};

/**
 * 블록 생성에 대한 기본 베이스 함수
 * @param {UNKNOWN} UNKNOWN
 */
Entry.Func.prototype.generateBlock = function(toSave) {
    const generatedInfo = Entry.Func.generateBlock(this);
    this.block = generatedInfo.block;
    this.description = generatedInfo.description;
};

/**
 * 워크스페이스 블럭 생성, 사용할 함수/값과, 복원인지 여부를 인자로 받음.
 * @param {variable.model} targetFunc
 * @param {Boolean} isRestore
 */
Entry.Func.generateWsBlock = function(targetFunc, isRestore) {
    this.unbindFuncChangeEvent();
    targetFunc = targetFunc ? targetFunc : this.targetFunc;
    const defBlock = targetFunc.content.getEventMap('funcDef')[0];

    if (!defBlock) {
        return;
    }

    let outputBlock = defBlock.params[0];
    let booleanIndex = 0;
    let stringIndex = 0;
    const schemaParams = [];
    let schemaTemplate = '';
    const hashMap = targetFunc.hashMap;
    const paramMap = targetFunc.paramMap;
    const blockIds = [];

    while (outputBlock) {
        const value = outputBlock.params[0];
        const valueType = value.type;
        switch (outputBlock.type) {
            case 'function_field_label':
                schemaTemplate = `${schemaTemplate} ${value}`;
                break;
            case 'function_field_boolean':
                Entry.Mutator.mutate(valueType, {
                    template: `${Lang.Blocks.FUNCTION_logical_variable} ${booleanIndex + 1}`,
                });
                hashMap[valueType] = false;
                paramMap[valueType] = booleanIndex + stringIndex;
                booleanIndex++;
                schemaParams.push({
                    type: 'Block',
                    accept: 'boolean',
                });
                schemaTemplate += ` %${booleanIndex + stringIndex}`;
                blockIds.push(outputBlock.id);
                break;
            case 'function_field_string':
                Entry.Mutator.mutate(valueType, {
                    template: `${Lang.Blocks.FUNCTION_character_variable} ${stringIndex + 1}`,
                });
                hashMap[valueType] = false;
                paramMap[valueType] = booleanIndex + stringIndex;
                stringIndex++;
                schemaTemplate += ` %${booleanIndex + stringIndex}`;
                schemaParams.push({
                    type: 'Block',
                    accept: 'string',
                });
                blockIds.push(outputBlock.id);
                break;
        }
        outputBlock = outputBlock.getOutputBlock();
    }

    schemaTemplate += ` %${booleanIndex + stringIndex + 1}`;
    schemaParams.push({
        type: 'Indicator',
        img: 'block_icon/func_icon.svg',
        size: 12,
    });

    const funcName = `func_${targetFunc.id}`;
    const block = Entry.block[funcName];

    const originParams = block.params.slice(0, block.params.length - 1);
    const newParams = schemaParams.slice(0, schemaParams.length - 1);
    const originParamsLength = originParams.length;
    const newParamsLength = newParams.length;

    let changeData = {};

    if (newParamsLength > originParamsLength) {
        const outputBlockIds = targetFunc.outputBlockIds;
        if (outputBlockIds) {
            let startPos = 0;
            while (outputBlockIds[startPos] === blockIds[startPos]) {
                startPos++;
            }

            let endPos = 0;
            while (
                outputBlockIds[outputBlockIds.length - endPos - 1] ===
                blockIds[blockIds.length - endPos - 1]
            ) {
                endPos++;
            }

            endPos = blockIds.length - endPos - 1;
            changeData = {
                type: 'insert',
                startPos,
                endPos,
            };
        }
    } else if (newParamsLength < originParamsLength) {
        changeData = {
            type: 'cut',
            pos: newParamsLength,
        };
    } else {
        changeData = { type: 'noChange' };
    }

    changeData.isRestore = isRestore;

    targetFunc.outputBlockIds = blockIds;

    Entry.Mutator.mutate(
        funcName,
        {
            params: schemaParams,
            template: schemaTemplate,
        },
        changeData
    );

    for (const key in hashMap) {
        const state = hashMap[key];
        if (state) {
            const text = /string/.test(key)
                ? Lang.Blocks.FUNCTION_character_variable
                : Lang.Blocks.FUNCTION_logical_variable;

            Entry.Mutator.mutate(key, { template: text });
        } else {
            hashMap[key] = true;
        }
    }

    this.bindFuncChangeEvent(targetFunc);
};

/**
 * 함수/값 변경 이벤트에 대한 이벤트 리스너 함수를 인자로 받아서 부착
 * @param {variable.model} targetFunc
 */
Entry.Func.bindFuncChangeEvent = function(targetFunc) {
    targetFunc = targetFunc ? targetFunc : this.targetFunc;
    if (!this._funcChangeEvent && targetFunc.content.getEventMap('funcDef')[0].view) {
        this._funcChangeEvent = targetFunc.content
            .getEventMap('funcDef')[0]
            .view._contents[1].changeEvent.attach(this, this.generateWsBlock);
    }
};

/**
 * 함수/값 변경에 대한 이벤트를 제거
 */
Entry.Func.unbindFuncChangeEvent = function() {
    if (!this._funcChangeEvent) {
        return;
    }
    this._funcChangeEvent.destroy();
    delete this._funcChangeEvent;
};

/**
 * 워크스페이스 상태 변경에 대한 이벤트를 제거
 */
Entry.Func.unbindWorkspaceStateChangeEvent = function() {
    const event = this._workspaceStateEvent;
    if (!event) {
        return;
    }

    event.destroy();
    delete this._workspaceStateEvent;
};
