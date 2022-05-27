class EntryFunc {
    static isEdit = false;
    static threads = {};

    static registerFunction(func) {
        const workspace = Entry && Entry.getMainWS();
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
    }

    static clearThreads() {
        this.threads = {};
    }

    static edit(func) {
        let funcElement = func;
        if (typeof func === 'string') {
            funcElement = Entry.variableContainer.getFunction(/(func_)?(.*)/.exec(func)[2]);
        }
        if (!funcElement) {
            console.error('no function');
            return;
        }
        this.unbindFuncChangeEvent();
        this.unbindWorkspaceStateChangeEvent();

        this.cancelEdit();

        this.targetFunc = funcElement;
        EntryFunc.isEdit = true;
        Entry.getMainWS().blockMenu.deleteRendered('variable');
        if (this.initEditView(funcElement.content) === false) {
            EntryFunc.isEdit = false;
            return;
        } // edit fail
        this.bindFuncChangeEvent(funcElement);
        this.updateMenu();
        setTimeout(() => {
            const schema = Entry.block[`func_${funcElement.id}`];
            if (schema && schema.paramsBackupEvent) {
                schema.paramsBackupEvent.notify();
            }

            this._backupContent = funcElement.content.stringify();
        }, 0);
    }

    static initEditView(content) {
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
        return true;
    }

    static endEdit(message) {
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
        EntryFunc.isEdit = false;
        Entry.getMainWS().blockMenu.deleteRendered('variable');
        const blockSchema = Entry.block[`func_${targetFuncId}`];
        if (blockSchema && blockSchema.destroyParamsBackupEvent) {
            blockSchema.destroyParamsBackupEvent.notify();
        }
        this.updateMenu();
    }

    static save() {
        this.targetFunc.generateBlock(true);
        Entry.variableContainer.saveFunction(this.targetFunc);

        this._restoreBoardToVimBoard();
    }

    static cancelEdit() {
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
                this._generateFunctionSchema(this.targetFunc.id);
                this.generateWsBlock(this.targetFunc, true);
            }
        }
        Entry.variableContainer.updateList();

        this._restoreBoardToVimBoard();
    }

    static setupMenuCode() {
        const workspace = Entry.getMainWS();
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

        this.menuCode = menuCode; // TODO Destroy 혹은 cleanProject 같은 로직이 동작했을때 삭제 필요
        blockMenu.align();
    }

    static refreshMenuCode() {
        if (!Entry.playground.mainWorkspace) {
            return;
        }
        if (!this.menuCode) {
            this.setupMenuCode();
        }

        this._fieldString.params[0].changeType(this.requestParamBlock('string'));
        this._fieldBoolean.params[0].changeType(this.requestParamBlock('boolean'));
    }

    static requestParamBlock(type) {
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
        Entry.block[blockType] = EntryFunc.createParamBlock(blockType, blockPrototype, type);
        return blockType;
    }

    static registerParamBlock(type) {
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

        EntryFunc.createParamBlock(type, blockPrototype, type);
    }

    static createParamBlock(type, blockPrototype, originalType) {
        const originalTypeFullName = /string/gi.test(originalType)
            ? 'function_param_string'
            : 'function_param_boolean';
        let BlockSchema = function() {};
        BlockSchema.prototype = blockPrototype;
        BlockSchema = new BlockSchema();
        BlockSchema.changeEvent = new Entry.Event();
        BlockSchema.template = Lang.template[originalTypeFullName];
        BlockSchema.fontColor = blockPrototype.fontColor || '#FFF';

        Entry.block[type] = BlockSchema;
        return BlockSchema;
    }

    static updateMenu() {
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
    }

    static generateBlock(func) {
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
                if (param.accept === 'boolean') {
                    description +=
                        Lang.template.function_param_boolean + (booleanIndex ? booleanIndex : '');
                    booleanIndex++;
                } else if (param.type !== 'Indicator') {
                    description +=
                        Lang.template.function_param_string + (stringIndex ? stringIndex : '');
                    stringIndex++;
                }
            } else {
                description += templateChunk;
            }
        }

        return { block, description };
    }

    static generateWsBlock(target, isRestore) {
        this.unbindFuncChangeEvent();
        const targetFunc = target ? target : this.targetFunc;
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
    }

    static bindFuncChangeEvent(targetFunc) {
        const selectedTargetFunc = targetFunc ? targetFunc : this.targetFunc;
        if (!this._funcChangeEvent && selectedTargetFunc.content.getEventMap('funcDef')[0].view) {
            this._funcChangeEvent = selectedTargetFunc.content
                .getEventMap('funcDef')[0]
                .view._contents[1].changeEvent.attach(this, this.generateWsBlock);
        }
    }

    static unbindFuncChangeEvent() {
        if (!this._funcChangeEvent) {
            return;
        }
        this._funcChangeEvent.destroy();
        delete this._funcChangeEvent;
    }

    static unbindWorkspaceStateChangeEvent() {
        const event = this._workspaceStateEvent;
        if (!event) {
            return;
        }

        event.destroy();
        delete this._workspaceStateEvent;
    }

    static reset() {
        if (this.isEdit) {
            this.endEdit();
        }
        this.menuCode = undefined;
    }

    static _generateFunctionSchema(functionId) {
        const prefixedFunctionId = `func_${functionId}`;
        if (Entry.block[prefixedFunctionId]) {
            return;
        }
        let BlockSchema = function() {};
        BlockSchema.prototype = Entry.block.function_general;
        BlockSchema = new BlockSchema();
        BlockSchema.changeEvent = new Entry.Event();
        BlockSchema.template = Lang.template.function_general;

        Entry.block[prefixedFunctionId] = BlockSchema;
    }

    /**
     * 이전 워크스페이스 보드 형태가 VIMBOARD 였던 경우면 VIMBOARD 로 돌린다.
     * @private
     */
    static _restoreBoardToVimBoard() {
        const ws = Entry.getMainWS();
        if (ws && ws.overlayModefrom === Entry.Workspace.MODE_VIMBOARD) {
            ws.setMode({
                boardType: Entry.Workspace.MODE_VIMBOARD,
                textType: Entry.Vim.TEXT_TYPE_PY,
                runType: Entry.Vim.WORKSPACE_MODE,
            });
            Entry.variableContainer.functionAddButton_.addClass('disable');
        }
    }

    constructor(func) {
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
        this.hashMap = {};
        this.paramMap = {};

        EntryFunc._generateFunctionSchema(this.id);

        if (func && func.content) {
            const blockMap = this.content._blockMap;
            for (const key in blockMap) {
                EntryFunc.registerParamBlock(blockMap[key].type);
            }
            EntryFunc.generateWsBlock(this);
        }

        EntryFunc.registerFunction(this);

        EntryFunc.updateMenu();
    }

    destroy() {
        this.blockMenuBlock && this.blockMenuBlock.destroy();
    }

    edit() {
        if (EntryFunc.isEdit) {
            return;
        }
        EntryFunc.isEdit = true;
        Entry.getMainWS().blockMenu.deleteRendered('variable');
        if (!EntryFunc.svg) {
            EntryFunc.isEdit = EntryFunc.initEditView();
        } else {
            this.parentView.appendChild(this.svg);
        }
    }

    generateBlock() {
        const generatedInfo = EntryFunc.generateBlock(this);
        this.block = generatedInfo.block;
        this.description = generatedInfo.description;
    }
}

Entry.Func = EntryFunc;
