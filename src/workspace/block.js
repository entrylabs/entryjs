-/*
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

    this.setThread(thread);
    this.load(block);

    var code = this.getCode();

    code.registerBlock(this);
    var events = this.events.dataAdd;
    if (events && code.object) {
        events.forEach(function(fn) {
            if (Entry.Utils.isFunction(fn)) fn(that);
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
        events: {}
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.loadSchema();
    };

    p.changeSchema = function(diff) {
        this.set({params: []});
        this.loadSchema();
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
            var value = (thisParams[i] === undefined || thisParams[i] === null ) ?
                    params[i].value : thisParams[i];

            var paramInjected = thisParams[i] || i<thisParams.length;

            if (value && (params[i].type === 'Output' || params[i].type === 'Block'))
                value = new Entry.Block(value, this.thread);

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
        this.set({view: null});
    };

    p.clone = function(thread) {
        return new Entry.Block(
            this.toJSON(true),
            thread
        );
    };

    p.toJSON = function(isNew) {
        var json = this._toJSON();
        delete json.view;
        delete json.thread;
        delete json.events;

        if (isNew) delete json.id;

        json.params = json.params.map(function(p) {
            if (p instanceof Entry.Block)
                p = p.toJSON(isNew);
            return p;
        });

        json.statements = json.statements.map(
            function(s) {return s.toJSON(isNew);}
        );

        json.x = this.x;
        json.y = this.y;

        json.movable = this.movable;
        json.deletable = this.deletable;
        json.readOnly = this.readOnly;
        return json;
    };

    p.destroy = function(animate, next) {
        var that = this;
        var params = this.params;
        if (params) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                if (param instanceof Entry.Block) {
                    param.doNotSplice = true;
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

        this.getCode().unregisterBlock(this);
        var thread = this.getThread();
        if (this._schema.event)
            thread.unregisterEvent(this, this._schema.event);
        if (nextBlock) {
            if (next) nextBlock.destroy(animate, next);
            else {
                if (!prevBlock) {
                    var parent = this.getThread().view.getParent();
                    if (parent.constructor === Entry.FieldStatement) {
                        nextBlock.view.bindPrev(parent);
                        parent.insertTopBlock(nextBlock);
                    } else if (parent.constructor === Entry.FieldStatement) {
                        nextBlock.replace(parent._valueBlock);
                    } else nextBlock.view._toGlobalCoordinate();
                } else nextBlock.view.bindPrev(prevBlock);
            }
        }
        if (!this.doNotSplice) thread.spliceBlock(this);
        else delete this.doNotSplice;
        if (this.view) this.view.destroy(animate);
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();

        var events = this.events.dataDestroy;
        if (events && this.getCode().object) {
            events.forEach(function(fn) {
                if (Entry.Utils.isFunction(fn)) fn(that);
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
        return this.deletable === Entry.Block.DELETABLE_TRUE;
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

    p.doSeparate = function() {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        this.separate();
    };

    p.doInsert = function(targetBlock) {
        if (this.getBlockType() === "basic")
            this.insert(targetBlock);
        else
            this.replace(targetBlock);
    };

    p.doDestroy = function(animate) {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        this.destroy(animate);
        this.getCode().changeEvent.notify();
        return this;
    };

    p.doDestroyBelow = function(animate) {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        console.log(
            "destroyBelow",
            id,
            positionX,
            positionY
        );
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
        } else
            cloned.push(this.toJSON(true));

        var pos = this.view.getAbsoluteCoordinate();
        var block = cloned[0];
        block.x = pos.x + 15;
        block.y = pos.y + 15;
        block.id = Entry.Utils.generateId();

        return cloned;
    };

    p.copyToClipboard = function() {Entry.clipboard = this.copy();};

    p.separate = function(count) {
        this.thread.separate(this, count);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

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
        if (!pointer)
            pointer = [];
        return this.thread.pointer(pointer, this);
    };

    p.targetPointer = function() {
        var pointer =  this.thread.pointer([], this);
        if (pointer.length === 4 && pointer[3] === 0)
            pointer.pop();
        return pointer;
    };

    p.getBlockList = function(excludePrimitive) {
        var blocks = [];

        if (!this._schema)
            return [];

        if (excludePrimitive && this._schema.isPrimitive)
            return blocks;

        blocks.push(this);

        var params = this.params;
        for (var k = 0; k < params.length; k++) {
            var param = params[k];
            if (param && param.constructor == Entry.Block) {
                blocks = blocks.concat(param.getBlockList(excludePrimitive));
            }
        }

        var statements = this.statements;
        if (statements) {
            for (var j = 0; j < statements.length; j++) {
                blocks = blocks.concat(statements[j].getBlockList(excludePrimitive));
            }
        }
        return blocks;
    };

    p.stringify = function() {
        return JSON.stringify(this.toJSON());
    };

})(Entry.Block.prototype);
