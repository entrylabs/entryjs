/*
 *
 */
'use strict';

/*
 *
 */
Entry.Block = function(block, thread) {
    const that = this;
    Entry.Model(this, false);
    this._schema = null;
    this.valueType = block.valueType;

    if (block._backupParams) {
        this._backupParams = block._backupParams;
    }

    this.setThread(thread);
    this.load(block);

    const category = block.category;
    if (category) {
        this.category = category;
        const entryBlock = Entry.block[this.type];
        if (entryBlock) {
            entryBlock.isFor = [`category_${category}`];
        }
    }

    const code = this.getCode();

    if (block.display !== undefined) {
        this.display = block.display;
    }

    code.registerBlock(this);
    if (code.object) {
        (this.events.dataAdd || []).forEach((fn) => {
            if (_.isFunction(fn)) {
                fn(that);
            }
        });
    }

    const board = code.board;
    if (
        Entry.getMainWS() &&
        Entry.isTextMode &&
        (!board || (board && board.constructor !== Entry.BlockMenu))
    ) {
        (this.events.viewAdd || []).forEach((fn) => {
            if (_.isFunction(fn)) {
                fn.apply(that, [that]);
            }
        });
    }
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

Entry.Block.DELETABLE_TRUE = 1;
Entry.Block.DELETABLE_FALSE = 2;
Entry.Block.DELETABLE_FALSE_LIGHTEN = 3;

(function(p) {
    p.schema = {
        id: null,
        x: 0,
        y: 0,
        type: null,
        params: [],
        statements: [],
        view: null,
        thread: null,
        movable: null,
        deletable: Entry.Block.DELETABLE_TRUE,
        emphasized: false,
        readOnly: null,
        copyable: true,
        comment: {
            x: 0,
            y: 0,
            title: 'dasdasdsa',
            value: 'dasdsa',
        },
        events: {},
        extensions: [],
    };

    p.load = function(block) {
        if (!block.id) {
            block.id = Entry.Utils.generateId();
        }

        this.set(block);
        this.loadSchema();
    };

    p.changeSchema = function(diff, changeData) {
        let params = [];

        if (changeData) {
            if (changeData.isRestore) {
                params = this._backupParams || [];
                delete this._backupParams;
            } else {
                switch (changeData.type) {
                    case 'noChange':
                        params = this.params;
                        break;
                    case 'cut': {
                        const pos = changeData.pos;
                        this.params.splice(pos);
                        params = this.params;
                        break;
                    }
                    case 'insert': {
                        const startPos = changeData.startPos;
                        const endPos = changeData.endPos;
                        const schemaParams = Entry.block[this.type].params;
                        params = new Array(schemaParams.length);

                        for (let i = 0; i < startPos; i++) {
                            params[i] = this.params[i];
                        }

                        const adjust = endPos - startPos + 1;
                        for (let i = endPos + 1; i < schemaParams.length; i++) {
                            params[i] = this.params[i - adjust];
                        }
                        break;
                    }
                }
            }
        }

        params.forEach((p) => {
            if (p instanceof Entry.Block) {
                p.destroyView();
            }
        });

        this.set({ params });

        this.loadSchema();
        this.view && this.view.changeType();
    };

    p.getSchema = function() {
        // for lazy loading
        if (!this._schema) {
            this.loadSchema();
        }
        return this._schema;
    };

    p.loadSchema = function() {
        const that = this;
        this._schema = Entry.block[this.type];

        if (!this._schema) {
            return;
        }

        const { changeEvent, paramsBackupEvent, destroyParamsBackupEvent } = this._schema;

        if (!this._schemaChangeEvent && changeEvent) {
            this._schemaChangeEvent = changeEvent.attach(this, this.changeSchema);
        }

        if (!this._paramsBackupEvent && paramsBackupEvent) {
            this._paramsBackupEvent = paramsBackupEvent.attach(this, this.paramsBackup);
        }

        if (!this._destroyParamsBackupEvent && destroyParamsBackupEvent) {
            this._destroyParamsBackupEvent = destroyParamsBackupEvent.attach(
                this,
                this.destroyParamsBackup
            );
        }

        const events = this._schema.events;
        if (events) {
            for (const key in events) {
                if (!this.events[key]) {
                    this.events[key] = [];
                }
                const funcs = events[key];
                for (let i = 0; i < funcs.length; i++) {
                    const func = funcs[i];
                    if (!func) {
                        continue;
                    }
                    if (this.events[key].indexOf(func) < 0) {
                        this.events[key].push(func);
                    }
                }
            }
        }

        if (this._schema.event) {
            this.thread.registerEvent(this, this._schema.event);
        }
        const thisParams = this.params;

        const params = this._schema.params;
        for (let i = 0; params && i < params.length; i++) {
            let value =
                thisParams[i] === undefined || thisParams[i] === null
                    ? params[i].value
                    : thisParams[i];

            const paramInjected = thisParams[i] || i < thisParams.length;

            if (value && (params[i].type === 'Output' || params[i].type === 'Block')) {
                if (typeof value !== 'object') {
                    value = {
                        type: 'number',
                        params: [value],
                    };
                }
                value = new Entry.Block(value, this.thread);
            }

            if (paramInjected) {
                thisParams.splice(i, 1, value);
            } else {
                thisParams.push(value);
            }
        }

        const statements = this._schema.statements || [];
        for (let i = 0; i < statements.length; i++) {
            this.statements.splice(
                i,
                1,
                new Entry.Thread(this.statements[i], that.getCode(), this)
            );
        }

        return true;
    };

    p.changeType = function(type) {
        const _destroyFunc = _.partial(_.result, _, 'destroy');

        _destroyFunc(this._schemaChangeEvent);
        _destroyFunc(this._backupEvent);
        _destroyFunc(this._destroyBackupEvent);

        this.set({ type });
        this.loadSchema();
        if (this.view) {
            this.view.changeType(type);
        }
    };

    p.setThread = function(thread) {
        this.set({ thread });
    };

    p.getThread = function() {
        return this.thread;
    };

    p.insertAfter = function(blocks) {
        this.thread.insertByBlock(this, blocks);
    };

    p._updatePos = function() {
        if (!this.view) {
            return;
        }
        if (this._comment) {
            this._comment.updatePos();
        }
        this.set({
            x: this.view.x,
            y: this.view.y,
        });
    };

    p.moveTo = function(x, y) {
        if (this.view) {
            this.view._moveTo(x, y);
        }
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.createView = function(board, mode) {
        board = board || this.getCode().view.board;
        if (!this.view) {
            this.set({
                view: new Entry.BlockView(this, board, mode),
            });
            // this._comment = new Entry.Comment(this, board);
            this._updatePos();
        }
    };

    p.destroyView = function() {
        _.result(this.view, 'destroy');
    };

    p.clone = function(thread) {
        return new Entry.Block(this.toJSON(true), thread);
    };

    p.toJSON = function(isNew, excludeData, option = {}) {
        excludeData = excludeData || [];
        const jsonBlackList = ['view', 'thread', 'events'];
        const json = this._toJSON();
        const view = this.view;

        if (isNew) {
            jsonBlackList.push('id');
        }

        json.params = json.params.map((p, i) => {
            if (p instanceof Entry.Block) {
                return p.toJSON(isNew, excludeData, option);
            } else if (
                option.captureDynamic &&
                view.getParam(i) instanceof Entry.FieldDropdownDynamic
            ) {
                return view.getParam(i).getTextValue();
            } else {
                return p;
            }
        });

        const params = [isNew, undefined, excludeData, option];
        json.statements = json.statements.map((s) => {
            return s.toJSON(...params);
        });

        if (this._backupParams) {
            json._backupParams = this._backupParams.map(function(p) {
                if (p instanceof Entry.Block) {
                    return p.toJSON();
                } else {
                    return p;
                }
            });
        }

        return Object.assign(
            _.omit(json, [...jsonBlackList, ...excludeData]),
            _.pick(this, ['x', 'y', 'movable', 'deletable', 'emphasized', 'readOnly'])
        );
    };

    p.destroy = function(animate, next, isNotForce) {
        if (isNotForce && !this.isDeletable()) {
            return;
        }

        const blockType = this.getBlockType();

        if (blockType === 'output' && !next) {
            const prevOutput = this.getPrevOutputBlock();
            const nextOutput = this.getOutputBlock();

            if (prevOutput) {
                this.separate(1);

                if (nextOutput) {
                    nextOutput.separate();
                    nextOutput.doInsert(prevOutput.view._contents[1]);
                }
            } else if (nextOutput) {
                _.result(nextOutput.view, '_toGlobalCoordinate');
                nextOutput.doInsert(this.getThread());
            }
        }

        const that = this;
        const params = this.params || [];
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if (param instanceof Entry.Block) {
                param.doNotSplice = !(param.thread instanceof Entry.FieldOutput);
                param.destroy(animate);
            }
        }

        const statements = this.statements || [];
        for (let i = 0; i < statements.length; i++) {
            statements[i].destroy(animate);
        }

        const code = this.getCode();

        code.unregisterBlock(this);

        const thread = this.getThread();
        if (this._schema && this._schema.event) {
            thread.unregisterEvent(this, this._schema.event);
        }

        if (blockType === 'basic') {
            const prevBlock = this.getPrevBlock();
            const nextBlock = this.getNextBlock();
            if (nextBlock) {
                if (next) {
                    nextBlock.destroy(animate, next);
                } else {
                    const nextBlockView = nextBlock.view;
                    if (!prevBlock) {
                        if (thread.view) {
                            const parent = thread.view.getParent();
                            const pConstructor = parent.constructor;
                            if (pConstructor === Entry.FieldStatement) {
                                nextBlockView && nextBlockView.bindPrev(parent);
                                parent.insertTopBlock(nextBlock);
                            } else if (pConstructor === Entry.FieldStatement) {
                                nextBlock.replace(parent._valueBlock);
                            } else {
                                nextBlockView && nextBlockView._toGlobalCoordinate();
                            }
                        }
                    } else {
                        nextBlockView && nextBlockView.bindPrev(prevBlock, true);
                    }
                }
            }
        }

        const notSpliced = this.doNotSplice;
        if (!this.doNotSplice && thread.spliceBlock) {
            thread.spliceBlock(this);
        } else {
            delete this.doNotSplice;
        }

        this.view && this.view.destroy(animate);

        const _destroyFunc = _.partial(_.result, _, 'destroy');

        _destroyFunc(this._schemaChangeEvent);
        _destroyFunc(this._paramsBackupEvent);
        _destroyFunc(this._destroyParamsBackupEvent);

        let events = [];
        if (code.object) {
            events = events.concat(this.events.dataDestroy || []);
        }

        const board = this.getCode().board;
        if (
            Entry.getMainWS() &&
            Entry.isTextMode &&
            (!board || (board && board.constructor !== Entry.BlockMenu))
        ) {
            events = events.concat(this.events.viewDestroy || []);
        }

        events.forEach((fn) => {
            if (_.isFunction(fn)) {
                fn.apply(that, [that, notSpliced]);
            }
        });
    };

    p.getView = function() {
        return this.view;
    };

    p.getComment = function() {
        return this._comment;
    };

    p.setMovable = function(movable) {
        if (this.movable == movable) {
            return;
        }
        this.set({ movable });
    };

    p.setCopyable = function(copyable) {
        if (this.copyable == copyable) {
            return;
        }
        this.set({ copyable });
    };

    p.isMovable = function() {
        return this.movable;
    };

    p.isCopyable = function() {
        return this.copyable;
    };

    p.setDeletable = function(deletable) {
        if (this.deletable == deletable) {
            return;
        }
        this.set({ deletable });
    };

    p.isDeletable = function() {
        const deletable = this.deletable;
        return deletable === Entry.Block.DELETABLE_TRUE || deletable === true;
    };

    p.isReadOnly = function() {
        return this.readOnly;
    };

    p.getCode = function() {
        return this.thread.getCode();
    };

    // command func
    p.doAdd = function() {
        this.getCode().changeEvent.notify();
    };

    p.doMove = function() {
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.doInsert = function(targetBlock) {
        if (this.getBlockType() === 'basic') {
            this.insert(targetBlock);
        } else {
            this.replace(targetBlock);
        }
    };

    p.doDestroy = function(animate) {
        this.destroy(animate);
        this.getCode().changeEvent.notify();
        return this;
    };

    p.doDestroyBelow = function(animate) {
        this.destroy(animate, true);
        this.getCode().changeEvent.notify();
        return this;
    };

    p.copy = function() {
        const thread = this.getThread();
        const cloned = [];
        if (thread instanceof Entry.Thread) {
            const index = thread.getBlocks().indexOf(this);
            const json = thread.toJSON(true, index);
            for (let i = 0; i < json.length; i++) {
                cloned.push(json[i]);
            }
        } else {
            cloned.push(this.toJSON(true));
        }

        const { x, y } = this.view.getAbsoluteCoordinate();
        const block = cloned[0];
        block.x = x + 15;
        block.y = y + 15;
        block.id = Entry.Utils.generateId();

        return cloned;
    };

    p.copyToClipboard = function() {
        Entry.clipboard = this.copy();
    };

    p.separate = function(count, index) {
        this.thread.separate(this, count, index);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.doSeparate = p.separate;

    p.insert = function(targetBlock) {
        const blocks = this.thread.cut(this);
        if (targetBlock instanceof Entry.Thread) {
            targetBlock.insertByBlock(null, blocks);
        } else {
            targetBlock.insertAfter(blocks);
        }
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.replace = function(targetBlock) {
        this.thread.cut(this);
        targetBlock.getThread().replace(this);
        this.getCode().changeEvent.notify();
    };

    p.getPrevBlock = function() {
        return this.thread.getPrevBlock(this);
    };

    p.getNextBlock = function() {
        return this.thread.getNextBlock(this) || null;
    };

    p.getLastBlock = function() {
        return this.thread.getLastBlock();
    };

    p.getPrevOutputBlock = function() {
        const thread = this.thread;
        if (thread instanceof Entry.FieldOutput) {
            return thread._block;
        }
        return null;
    };

    p.getOutputBlock = function() {
        const params = this._schema.params;
        for (let i = 0; params && i < params.length; i++) {
            const paramDef = params[i];
            if (paramDef.type === 'Output') {
                return this.params[i];
            }
        }
        return null;
    };

    p.getTerminateOutputBlock = function() {
        let block = this;
        while (true) {
            const outputBlock = block.getOutputBlock();
            if (!outputBlock) {
                return block;
            }
            block = outputBlock;
        }
    };

    p.getOutputBlockCount = function(count = 0) {
        const outputBlock = this.getOutputBlock();
        if (outputBlock) {
            return outputBlock.getOutputBlockCount(count + 1);
        } else {
            return count;
        }
    };

    p.getBlockType = function() {
        if (!this.view) {
            return null;
        }
        const skeleton = Entry.skeleton[this._schema.skeleton];

        if (!skeleton.magnets) {
            return null;
        }

        const magnet = skeleton.magnets(this.view);
        if (magnet.next || magnet.previous) {
            return 'basic';
        } else if (magnet.boolean || magnet.string) {
            return 'field';
        } else if (magnet.output || magnet.param) {
            return 'output';
        } else {
            return null;
        }
    };

    p.indexOfStatements = function(statement) {
        return this.statements.indexOf(statement);
    };

    p.pointer = function(pointer = []) {
        return this.thread.pointer(pointer, this);
    };

    p.targetPointer = function() {
        const pointer = this.thread.pointer([], this);
        if (pointer.length === 4 && pointer[3] === 0) {
            pointer.pop();
        } else if (pointer[pointer.length - 2] > -1) {
            if (pointer[pointer.length - 1] === 0) {
                pointer.pop();
            } else {
                pointer[pointer.length - 1] = pointer[pointer.length - 1] - 1;
            }
        }
        return pointer;
    };

    p.getDataByPointer = function(pointer) {
        pointer = pointer.concat();
        const data = this.params[pointer.shift()];
        if (pointer.length) {
            if (data.getDataByPointer) {
                return data.getDataByPointer(pointer);
            } else {
                return null;
            }
        } else {
            return data;
        }
    };

    p.getBlockList = function(excludePrimitive, type) {
        const blocks = [];
        const currentType = type || this.type;

        if (!this._schema && !this.loadSchema()) {
            return blocks;
        }

        if (excludePrimitive && this._schema.isPrimitive) {
            return blocks;
        }

        currentType === this.type && blocks.push(this);

        return [...this.params, ...this.statements].reduce((blocks, value) => {
            const constructor = value && value.constructor;
            if (constructor !== Entry.Block && constructor !== Entry.Thread) {
                return blocks;
            }

            return blocks.concat(value.getBlockList(excludePrimitive, type));
        }, blocks);
    };

    p.stringify = function(excludeData) {
        return JSON.stringify(this.toJSON(false, excludeData));
    };

    p.isInOrigin = function() {
        return this.x === 0 && this.y === 0;
    };

    p.isSameParamWith = function(target) {
        if (target.type.substr(0, 8) === 'wildcard' || this.type.substr(0, 8) === 'wildcard') {
            return true;
        }

        const targetType = target.type;
        const thisType = this.type;

        if (
            (targetType === 'number' && thisType === 'positive_number') ||
            (targetType === 'number' && thisType === 'negative_number') ||
            (targetType === 'angle' && thisType === 'text') ||
            (targetType === 'text' && thisType === 'angle')
        ) {
        } else if (targetType !== thisType) {
            return false;
        }
        for (let i = 0; i < this.params.length; i++) {
            const param = this.params[i];
            if (param instanceof Entry.Block) {
                if (!param.isSameParamWith(target.params[i])) {
                    return false;
                }
            } else {
                let l = this.params[i];
                let r = target.params[i];
                l = typeof l === 'number' ? `${l}` : l;
                r = typeof r === 'number' ? `${r}` : r;
                if (l === 'positive') {
                    return r > 0;
                } else if (l === 'negative') {
                    return r < 0;
                } else if (l !== r) {
                    return false;
                }
            }
        }
        return true;
    };

    p.paramsBackup = function() {
        //do not backup params for blockMenu block
        if (_.result(this.view, 'isInBlockMenu')) {
            return;
        }

        this._backupParams = this.params.slice();
    };

    p.destroyParamsBackup = function() {
        this._backupParams = null;
    };

    p.getDom = function(query = []) {
        if (_.isEmpty(query)) {
            return this.view.svgGroup;
        }

        query = [...query];

        const key = query.shift();
        if (key === 'magnet') {
            return this.view.getMagnet(query);
        }
    };

    p.getParam = function(index) {
        return this.params[index];
    };

    p.isParamBlockType = function() {
        return /^(basic_string_field|basic_boolean_field)$/.test(this._schema.skeleton);
    };

    p.getFuncId = function() {
        const ret = /func_(.*)/.exec(this.type);
        if (!ret) {
            return;
        }
        return ret[1];
    };

    p.getRootBlock = function() {
        let block = this;

        while (block) {
            const thread = block.getThread();
            const parent = thread.parent;

            if (!parent) {
                //field block
                block = thread._block;
            } else if (parent instanceof Entry.Code) {
                //thread
                block = thread.getFirstBlock();
                break;
            } else if (parent instanceof Entry.Block) {
                //statement
                block = thread.parent;
            } else {
                block = undefined;
            }
        }

        return block;
    };
})(Entry.Block.prototype);
