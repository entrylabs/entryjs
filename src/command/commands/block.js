/*
 *
 */
"use strict";

goog.require("Entry.Command");

Entry.Command.addBlock = function(block) {
    block.doAdd();
    console.log(block.toJSON());
};
Entry.Command.addBlock.type = 101;
Entry.Command.addBlock.undo = function() {

};
