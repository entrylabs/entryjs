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

    block.thread = thread;
    this.load(block);
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

Entry.Block.HIDDEN = 0;
Entry.Block.SHOWN = 1;
Entry.Block.MOVE = 2;
Entry.Block.FOLLOW = 3;

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
        thread: null
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
            if (content.value)
                this.values[content.key] = content.value;
            if (content.type == "Statement") {
                this.values[content.key] = new Entry.Thread(
                    this.values[content.key], this.thread._code);
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
        this.set({prev: block});
    };

    p.setNext = function(block) {
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
                json.values[content.key] = this.values[content.key].toJSON(isNew);
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

    p.getView = function() {
        return this.view;
    };

    // command func
    p.doAdd = function() {
        console.log("doAdd", this.id);
    };

    p.doMove = function() {
        console.log(
            "doMove",
            this.id,
            this.view.x - this.x,
            this.view.y - this.y);
        this._updatePos();
    };

    p.doSeparate = function() {
        console.log(
            "separate",
            this.id,
            this.x,
            this.y
        );
        this.thread.separate(this);
        this._updatePos();
    };

    p.doInsert = function(targetBlock) {
        console.log(
            "insert",
            this.id,
            targetBlock.id,
            this.x,
            this.y
        );
        var blocks = this.thread.cut(this);
        targetBlock.insertAfter(blocks);
        this._updatePos();
    };

    p.doDestroy = function(animate) {
        console.log(
            "destroy",
            this.id,
            this.x,
            this.y
        );
        this.destroy(animate);
    };

})(Entry.Block.prototype);
