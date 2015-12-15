/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JSParser");

Entry.Parser = {};

Entry.Parser.ThisObject = {};

Entry.Parser.jsToBlock = function(code) {
    var astTree = acorn.parse(code),
        block = null;

    block = Entry.JSParser.Program(astTree);
    console.log(astTree);

    return block;
};

Entry.Parser.pythonToBlock = function(code) {

};
