/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require('Entry.Thread');
goog.require('Entry.Utils');
goog.require('Entry.Model');
goog.require("Entry.skeleton");

/*
 *
 */
Entry.Block = function(block, thread) {
    var that = this;
    Entry.Model(this, false);
    this._schema = null;

    if (block._backupParams)
        this._backupParams = block._backupParams;

    this.setThread(thread);
    this.load(block);

    var category = block.category;
    if (category) {
        this.category = category;
        if (Entry.block[this.type])
            Entry.block[this.type].isFor =
                ['category_' + category];
    }

    var code = this.getCode();

    if (block.display !== undefined)
        this.display = block.display;

    code.registerBlock(this);
    var events = this.events.dataAdd;
    if (events && code.object) {
        events.forEach(function(fn) {
            if (Entry.Utils.isFunction(fn)) fn(that);
        });
    }

    events = this.events.viewAdd;
    var board = code.board;
    if (events && (Entry.getMainWS() && Entry.isTextMode) &&
        (!board || (board && board.constructor !== Entry.BlockMenu))) {
        events.forEach(function(fn) {
            if (Entry.Utils.isFunction(fn))
                fn.apply(that, [that]);
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
        readOnly: null,
        copyable: true,
        events: {},
        extensions: []
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.loadSchema();
    };

    p.changeSchema = function(diff, changeData) {
        var params = [];

        if (changeData) {
            if (changeData.isRestore) {
                params = this._backupParams || [];
                delete this._backupParams;
            } else {
                var changeType = changeData.type;

                switch (changeData.type){
                    case 'noChange':
                        params = this.params;
                        break;
                    case 'cut':
                        var pos = changeData.pos;
                        this.params.splice(pos);
                        params = this.params;
                        break;
                    case 'insert':
                        var startPos = changeData.startPos;
                        var endPos = changeData.endPos;
                        var schemaParams = Entry.block[this.type].params;
                        params = new Array(schemaParams.length);

                        for (var i=0; i<startPos; i++)
                            params[i] = this.params[i];

                        var adjust = endPos - startPos + 1;
                        for (i=endPos+1; i<schemaParams.length; i++)
                            params[i] = this.params[i-adjust];
                        break;
                }
            }
        }

        params.forEach(function(p) {
            if (p instanceof Entry.Block) {
                p.destroyView();
            }
        });

        this.set({params: params});

        this.loadSchema();
        this.view && this.view.changeType();
    };

    p.getSchema = function() { // for lazy loading
        if (!this._schema)
            this.loadSchema();
        return this._schema;
    };

    p.loadSchema = function() {
        var that = this;
        this._schema = Entry.block[this.type];

        if (!this._schema) return;

        if (!this._schemaChangeEvent && this._schema.changeEvent)
            this._schemaChangeEvent = this._schema.changeEvent.attach(
                this, this.changeSchema);

        if (!this._paramsBackupEvent && this._schema.paramsBackupEvent) {
            this._paramsBackupEvent = this._schema.paramsBackupEvent.attach(
                this, this.paramsBackup);

        }

        if (!this._destroyParamsBackupEvent && this._schema.destroyParamsBackupEvent)
            this._destroyParamsBackupEvent = this._schema.destroyParamsBackupEvent.attach(
                this, this.destroyParamsBackup);

        var events = this._schema.events;
        if (events) {
            for (var key in events) {
                if (!this.events[key]) this.events[key] = [];
                var funcs = events[key];
                for (var i=0; i<funcs.length; i++) {
                    var func = funcs[i];
                    if (!func) continue;
                    var index = this.events[key].indexOf(func);
                    if (index < 0) this.events[key].push(func);
                }
            }
        }

        if (this._schema.event)
            this.thread.registerEvent(this, this._schema.event);
        var thisParams = this.params;

        var params = this._schema.params;
        for (var i = 0; params && i < params.length; i++) {
            var value = (thisParams[i] === undefined || thisParams[i] === null) ?
                params[i].value : thisParams[i];

            var paramInjected = thisParams[i] || i<thisParams.length;

            if (value && (params[i].type === 'Output' || params[i].type === 'Block')) {
                if (typeof value !== "object")
                    value = {type: "number", params: [value]};
                value = new Entry.Block(value, this.thread);
            }

            if (paramInjected) thisParams.splice(i, 1, value);
            else thisParams.push(value);
        }

        var statements = this._schema.statements;
        if (statements) {
            for (var i = 0; i < statements.length; i++) {
                this.statements.splice(
                    i, 1,
                    new Entry.Thread(this.statements[i], that.getCode(), this)
                );
            }
        }
    };

    p.changeType = function(type) {
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
        if (this._backupEvent)
            this._backupEvent.destroy();
        if (this._destroyBackupEvent)
            this._destroyBackupEvent.destroy();

        this.set({type: type});
        this.loadSchema();
        if (this.view)
            this.view.changeType(type);
    };

    p.setThread = function(thread) {
        this.set({thread: thread});
    };

    p.getThread = function() {
        return this.thread;
    };

    p.insertAfter = function(blocks) {
        this.thread.insertByBlock(this, blocks);
    };

    p._updatePos = function() {
        if (this.view)
            this.set({
                x: this.view.x,
                y: this.view.y
            });
    };

    p.moveTo = function(x, y) {
        if (this.view)
            this.view._moveTo(x, y);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.createView = function(board, mode) {
        board = board || this.getCode().view.board;
        if (!this.view) {
            this.set({view: new Entry.BlockView(
                this,
                board,
                mode)
            });
            this._updatePos();
        }
    };

    p.destroyView = function() {
        this.view && this.view.destroy();
    };

    p.clone = function(thread) {
        return new Entry.Block(
            this.toJSON(true),
            thread
        );
    };

    p.toJSON = function(isNew, excludeData, option) {
        var json = this._toJSON();
        delete json.view;
        delete json.thread;
        delete json.events;

        option = option || {};

        if (isNew) delete json.id;

        for (var i = 0; i < json.params.length; i++) {
            var p = json.params[i];
            if (p instanceof Entry.Block)
                p = p.toJSON(isNew, excludeData, option);
            else if (option.captureDynamic &&
                     this.view.getParam(i) instanceof Entry.FieldDropdownDynamic) {
                p = this.view.getParam(i).getTextValue();
            }
            json.params[i] = p;
        }

        json.statements = json.statements.map(
            function(s) {return s.toJSON(isNew, undefined, excludeData, option);}
        );

        json.x = this.x;
        json.y = this.y;

        json.movable = this.movable;
        json.deletable = this.deletable;
        json.readOnly = this.readOnly;
        if (this._backupParams) {
            json._backupParams = this._backupParams.map(function(p) {
                if (p instanceof Entry.Block)
                    return p.toJSON();
                else return p;
            });
        }

        if (excludeData && excludeData instanceof Array) {
            excludeData.forEach(function(i) { delete json[i]; });
        }

        return json;
    };

    p.destroy = function(animate, next, isNotForce) {
        if (isNotForce && !this.isDeletable())
            return;

        var that = this;
        var params = this.params;
        if (params) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                if (param instanceof Entry.Block) {
                    param.doNotSplice =
                        !(param.thread instanceof Entry.FieldOutput);
                    param.destroy(animate);
                }
            }
        }

        var statements = this.statements;
        if (statements) {
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i];
                statement.destroy(animate);
            }
        }

        var prevBlock = this.getPrevBlock();
        var nextBlock = this.getNextBlock();
        var code = this.getCode();

        code.unregisterBlock(this);
        var thread = this.getThread();
        if (this._schema && this._schema.event)
            thread.unregisterEvent(this, this._schema.event);
        if (nextBlock) {
            if (next) nextBlock.destroy(animate, next);
            else {
                if (!prevBlock) {
                    if (thread.view) {
                        var parent = thread.view.getParent();
                        if (parent.constructor === Entry.FieldStatement) {
                            nextBlock.view && nextBlock.view.bindPrev(parent);
                            parent.insertTopBlock(nextBlock);
                        } else if (parent.constructor === Entry.FieldStatement) {
                            nextBlock.replace(parent._valueBlock);
                        } else nextBlock.view._toGlobalCoordinate();
                    }
                } else nextBlock.view && nextBlock.view.bindPrev(prevBlock, true);
            }
        }

        var notSpliced = this.doNotSplice;
        if (!this.doNotSplice && thread.spliceBlock)
            thread.spliceBlock(this);
        else delete this.doNotSplice;

        if (this.view) this.view.destroy(animate);
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
        if (this._paramsBackupEvent)
            this._paramsBackupEvent.destroy();
        if (this._destroyParamsBackupEvent)
            this._destroyParamsBackupEvent.destroy();

        var events = this.events.dataDestroy;
        if (events && code.object) {
            events.forEach(function(fn) {
                if (Entry.Utils.isFunction(fn))
                    fn.apply(that, [that, notSpliced]);
            });
        }

        events = this.events.viewDestroy;
        var board = this.getCode().board;
        if (events && (Entry.getMainWS() && Entry.isTextMode) &&
            (!board || (board && board.constructor !== Entry.BlockMenu))) {
            events.forEach(function(fn) {
                if (Entry.Utils.isFunction(fn))
                    fn.apply(that, [that, notSpliced]);
            });
        }
    };

    p.getView = function() {return this.view;};

    p.setMovable = function(movable) {
        if (this.movable == movable) return;
        this.set({movable: movable});
    };

    p.setCopyable = function(copyable) {
        if (this.copyable == copyable) return;
        this.set({copyable: copyable});
    };

    p.isMovable = function() {return this.movable;};

    p.isCopyable = function() {return this.copyable;};

    p.setDeletable = function(deletable) {
        if (this.deletable == deletable) return;
        this.set({deletable: deletable});
    };

    p.isDeletable = function() {
        return this.deletable === Entry.Block.DELETABLE_TRUE ||
            this.deletable === true;
    };

    p.isReadOnly = function() {return this.readOnly;};

    p.getCode = function() {return this.thread.getCode();};


    // command func
    p.doAdd = function() {
        var id = this.id;
        this.getCode().changeEvent.notify();
    };

    p.doMove = function() {
        var id = this.id;
        var moveX = this.view.x - this.x;
        var moveY = this.view.y - this.y;

        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.doInsert = function(targetBlock) {
        if (this.getBlockType() === "basic")
            this.insert(targetBlock);
        else
            this.replace(targetBlock);
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
        var thread = this.getThread();
        var cloned = [];
        if (thread instanceof Entry.Thread) {
            var index = thread.getBlocks().indexOf(this);
            var json = thread.toJSON(true, index);
            for (var i=0; i<json.length; i++) cloned.push(json[i]);
        } else cloned.push(this.toJSON(true));

        var pos = this.view.getAbsoluteCoordinate();
        var block = cloned[0];
        block.x = pos.x + 15;
        block.y = pos.y + 15;
        block.id = Entry.Utils.generateId();

        return cloned;
    };

    p.copyToClipboard = function() {Entry.clipboard = this.copy();};

    p.separate = function(count, index) {
        this.thread.separate(this, count, index);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.doSeparate = p.separate;

    p.insert = function(targetBlock) {
        var blocks = this.thread.cut(this);
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

    p.getOutputBlock = function() {
        var params = this._schema.params;
        for (var i = 0; params && i < params.length; i++) {
            var paramDef = params[i];
            if (paramDef.type === "Output")
                return this.params[i];
        }
        return null;
    };

    p.getTerminateOutputBlock = function() {
        var block = this;
        while (true) {
            var outputBlock = block.getOutputBlock();
            if (!outputBlock)
                return block;
            block = outputBlock;
        }
    };

    p.getBlockType = function() {
        if (!this.view)
            return null;
        var skeleton = Entry.skeleton[this._schema.skeleton]
        var magnet = skeleton.magnets(this.view);
        if (magnet.next || magnet.previous)
            return "basic";
        else if (magnet.boolean || magnet.string)
            return "field";
        else if (magnet.output)
            return "output";
        else
            return null;
    };

    p.indexOfStatements = function(statement) {
        return this.statements.indexOf(statement);

    };

    p.pointer = function(pointer) {
        return this.thread.pointer(pointer || [], this);
    };

    p.targetPointer = function() {
        var pointer =  this.thread.pointer([], this);
        if (pointer.length === 4 && pointer[3] === 0) {
            pointer.pop();
        } else if (pointer[pointer.length - 2] > -1){
            if (pointer[pointer.length - 1] === 0)
                pointer.pop();
            else
                pointer[pointer.length - 1] = pointer[pointer.length - 1] - 1;
        }
        return pointer;
    };

    p.getDataByPointer = function(pointer) {
        pointer = pointer.concat();
        var data = this.params[pointer.shift()];
        if (pointer.length)
            if (data.getDataByPointer)
                return data.getDataByPointer(pointer);
            else
                return null;
        else
            return data;
    };

    p.getBlockList = function(excludePrimitive, type) {
        var blocks = [];
        var currentType = type || this.type;

        if (!this._schema)
            return [];

        if (excludePrimitive && this._schema.isPrimitive)
            return blocks;

        currentType === this.type && blocks.push(this);

        var params = this.params;
        for (var k = 0; k < params.length; k++) {
            var param = params[k];
            if (param && param.constructor == Entry.Block) {
                blocks = blocks.concat(param.getBlockList(excludePrimitive, type));
            }
        }

        var statements = this.statements;
        if (statements) {
            for (var j = 0; j < statements.length; j++) {
                var statement = statements[j];
                if (statement.constructor !== Entry.Thread)
                    continue;
                blocks = blocks.concat(statement.getBlockList(excludePrimitive, type));
            }
        }
        return blocks;
    };

    p.stringify = function(excludeData) {
        return JSON.stringify(this.toJSON(false, excludeData));
    };

    p.isInOrigin = function() {
        return this.x === 0 && this.y === 0;
    };

    p.isSameParamWith = function(target) {
        if (target.type.substr(0,8) === "wildcard" ||
            this.type.substr(0,8) === "wildcard")
            return true;
        if (target.type !== this.type)
            return false;
        for (var i = 0; i < this.params.length; i++) {
            var param = this.params[i];
            if (param instanceof Entry.Block) {
                if (!param.isSameParamWith(target.params[i]))
                    return false;
            } else {
                var l = this.params[i], r = target.params[i];
                l = typeof l === "number" ? l + "" : l;
                r = typeof r === "number" ? r + "" : r;
                if (l !== r)
                    return false;
            }
        }
        return true;
    };

    p.paramsBackup = function() {
        //do not backup params for blockMenu block
        if (this.view && this.view.isInBlockMenu)
            return;

        this._backupParams = this.params.slice();
    };

    p.destroyParamsBackup = function() {
        this._backupParams = null;
    };

    p.getDom = function(query) {
        if (query.length > 0) {
            var key = query.shift();
            if (key === "magnet")
                return this.view.getMagnet(query);
        }
        return this.view.svgGroup;
    };

    p.getParam = function(index) {
        return this.params[index];
    };
})(Entry.Block.prototype);
