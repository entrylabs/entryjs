/*
on*
 */
"use strict";

goog.provide("Entry.Block");

goog.require('Entry.Utils');
goog.require('Entry.Model');
goog.require("Entry.BoxModel");
goog.require("Entry.skeleton");

/*
 *
 */
Entry.Block = function(block, thread) {
    Entry.Model(this, false);
    this._schema = null;

    this.setThread(thread);
    this.load(block);
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

(function(p) {
    p.schema = {
        id: null,
        name: null,
        x: 0,
        y: 0,
        type: null,
        params: [],
        statements: [],
        prev: null,
        next: null,
        view: null,
        thread: null,
        movable: true,
        deletable: true,
        readOnly: false
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.getSchema();
    };

    p.getSchema = function() {
        var that = this;
        this._schema = Entry.block[this.type];
        if (this._schema.event)
            this.thread.registerEvent(this, this._schema.event);

        var params = this._schema.params;
        for (var i = 0; i < params.length; i++) {
            this.params.push(params[i].value);
        }

        var statements = this._schema.statements;
        if (statements) {
            for (var i = 0; i < statements.length; i++) {
                this.statements.splice(
                    i, 1,
                    new Entry.Thread(this.statements[i], that.getCode())
                );
            }
        }
    };

    p.setThread = function(thread) {
        this.set({thread: thread});
    };

    p.getThread = function() {
        return this.thread;
    };

    p.setPrev = function(block) {
        if (block === this)
            return;
        this.set({prev: block});
    };

    p.setNext = function(block) {
        if (block === this)
            return;
        this.set({next: block});
    };

    p.next = function() {
        return this.next;
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
        if (this.next)
            this.next._updatePos();
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

    p.clone = function(thread) {
        return new Entry.Block(
            this.toJSON(true),
            thread
        );
    };

    p.toJSON = function(isNew) {
        var json = this._toJSON();
        delete json.prev;
        delete json.next;
        delete json.view;
        delete json.thread;
        if (isNew)
            delete json.id;

        json.params = json.params.map(function(p) {return p;});

        json.statements = json.statements.map(
            function(s) {return s.toJSON(isNew);}
        );
        return json;
    };

    p.destroy = function(animate) {
        if (this.view) this.view.destroy(animate);
        if (!this.prev || this.prev instanceof Entry.DummyBlock)
            this.thread.destroy(animate, false);

        var statements = this.statements;

        if (statements) {
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i];
                var block = statement.getFirstBlock();
                if (block instanceof Entry.DummyBlock)
                    block = block.next;
                if (block) block.destroy(animate);
            }
        }

        if (this._schema.event)
            this.thread.unregisterEvent(this, this._schema.event);

        if (this.next) this.next.destroy(animate);
    };

    p.destroyAlone = function(animate) {
        if (this.view) this.view.destroy(animate);
        this.getThread().spliceBlock(this);
        if (this._schema.event)
            this.thread.unregisterEvent(this, this._schema.event);
    };

    p.getView = function() {return this.view;};

    p.setMovable = function(movable) {
        if (this.movable == movable) return;
        this.set({movable: movable});
    };

    p.isMovable = function() {return this.movable;};

    p.setDeletable = function(deletable) {
        if (this.deletable == deletable) return;
        this.set({deletable: deletable});
    };

    p.isDeletable = function() {return this.deletable;};

    p.isReadOnly = function() {return this.readOnly;};

    p.getCode = function() {return this.thread.getCode();};


    // command func
    p.doAdd = function() {
        var id = this.id;
        console.log("doAdd", id);
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('addBlock', data));
        }
        this.getCode().changeEvent.notify();
    };

    p.doMove = function() {
        var id = this.id;
        var moveX = this.view.x - this.x;
        var moveY = this.view.y - this.y;
        console.log(
            "doMove",
            id,
            moveX,
            moveY);
        this._updatePos();
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['moveX',moveX],
                ['moveY',moveY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('moveBlock', data));
        }
    };

    p.doSeparate = function() {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;
        console.log(
            "separate",
            id,
            positionX,
            positionY
        );
        this.separate();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('seperateBlock', data));
        }
    };

    p.doInsert = function(targetBlock) {
        var id = this.id;
        var targetId = targetBlock.id;
        var positionX = this.x;
        var positionY = this.y;
        console.log(
            "insert",
            id,
            targetId,
            positionX,
            positionY
        );
        this.insert(targetBlock);
        if (Entry.activityReporter) {
            var data = [
                ['targetBlockId',targetId],
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('insertBlock', data));
        }
    };

    p.doDestroy = function(animate) {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        console.log(
            "destroy",
            id,
            positionX,
            positionY
        );
        this.destroy(animate);
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('destroyBlock', data));
        }
    };

    p.doDestroyAlone = function(animate) {
        if (!this.isDeletable()) return;
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        console.log(
            "destroy alone",
            id,
            positionX,
            positionY
        );
        this.destroyAlone(animate);
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('destroyBlockAlone', data));
        }
        return true;
    };

    p.copy = function() {
        var thread = this.getThread();
        var index = thread.getBlocks().indexOf(this);
        var json = thread.toJSON(true, index);
        var cloned = [];
        var newThread = new Entry.Thread([], this.getCode());
        for (var i=0; i<json.length; i++)
            cloned.push(new Entry.Block(json[i], newThread));

        var matrix = this.view.svgGroup.transform().globalMatrix;
        cloned[0].set({
            x: matrix.e + 20,
            y: matrix.f + 20
        });
        return cloned;
    };

    p.copyToClipboard = function() {Entry.clipboard = this.copy();};

    p.separate = function() {
        this.thread.separate(this);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.insert = function(targetBlock) {
        var blocks = this.thread.cut(this);
        targetBlock.insertAfter(blocks);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };



})(Entry.Block.prototype);
