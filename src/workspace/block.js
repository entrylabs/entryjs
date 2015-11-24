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
        values: {},
        prev: null,
        next: null,
        view: null,
        thread: null,
        movable: true,
        deletable: true
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.getSchema();
    };

    p.getSchema = function() {
        this._schema = Entry.block[this.type];
        if (this._schema.event)
            this.thread.registerEvent(this, this._schema.event);
        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];

            if (!this.values[content.key] && content.value)
                this.values[content.key] = content.value;

            if (content.type == "Statement") {
                this.values[content.key] = new Entry.Thread(
                    this.values[content.key], this.getCode());
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

    p.createView = function(board) {
        if (!this.view) {
            this.set({view: new Entry.BlockView(
                this,
                board)
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
        var values = {};
        for (var key in json.values) {
            values[key] = json.values[key];
        }
        json.values = values;
        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (content.type == "Statement") {
                json.values[content.key] =
                    this.values[content.key].toJSON(isNew);
            }
        }
        return json;
    };

    p.destroy = function(animate) {
        if (this.view) this.view.destroy(animate);
        if (!this.prev || this.prev instanceof Entry.DummyBlock)
            this.thread.destroy();

        var statement = this.values.STATEMENT;
        if (statement) {
            var block = statement.getFirstBlock();
            if (block instanceof Entry.DummyBlock)
                block = block.next;
            if (block) block.destroy(animate);
        }

        if (this.next) this.next.destroy(animate);
    };

    p.getView = function() {return this.view;};

    p.setMovable = function(movable) {
        this.set({movable: movable});
    };

    p.isMovable = function() {return this.movable;};

    p.setDeletable = function(deletable) {
        this.set({deletable: deletable});
    };

    p.isDeletable = function() {return this.deletable;};

    p.getCode = function() {return this.thread.getCode();};


    // command func
    p.doAdd = function() {
        var id = this.id;
        console.log("doAdd", id);
        if (Entry.activityReporter) {
            var data = [
                {blockId:id},
                {code:this.getCode().stringify()}
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
                {blockId:id},
                {moveX:moveX},
                {moveY:moveY},
                {code:this.getCode().stringify()}
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
        this.thread.separate(this);
        this._updatePos();
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                {blockId:id},
                {positionX:positionX},
                {positionY:positionY},
                {code:this.getCode().stringify()}
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
        var blocks = this.thread.cut(this);
        targetBlock.insertAfter(blocks);
        this._updatePos();
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                {targetBlockId:targetId},
                {blockId:id},
                {positionX:positionX},
                {positionY:positionY},
                {code:this.getCode().stringify()}
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
                {blockId:id},
                {positionX:positionX},
                {positionY:positionY},
                {code:this.getCode().stringify()}
            ];
            Entry.activityReporter.add(new Entry.Activity('destroyBlock', data));
        }
    };

})(Entry.Block.prototype);
