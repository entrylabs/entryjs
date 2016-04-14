/*
 *
 */
"use strict";

goog.require("Entry.Command");

(function(c) {
    c.addBlock = function(block) {
        block.doAdd();
    };
    c.addBlock.type = 101;
    c.addBlock.state = function(block) {
        return [block.id];
    };
    c.addBlock.log = function(block) {
        return [block.id, block.toJSON()];
    };
    c.addBlock.undo = function(blockId) {
        Entry.playground.mainWorkspace.board.findById(blockId).destroy();
    };




})(Entry.Command)

