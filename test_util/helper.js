"use strict";

var Test = {};

Test.randomString = function() {
    return Math.random().toString(36).substring(
        Math.floor(Math.random()*13 + 2)
    );
};

Test.randomNumber = function() {
    return Math.floor(Math.random() * 100);
};

Test.parsePython = function(textCode) {
    var parser = new Entry.Parser(Entry.Vim.WORKSPACE_MODE);
    var syntax = parser.mappingSyntax(Entry.Vim.WORKSPACE_MODE);
    var pyToBlockParser = new Entry.PyToBlockParser(syntax);
    var options = { locations: true, ranges: true };

    var blockOutput = pyToBlockParser.processPrograms(
        [filbert.parse(textCode, options)]);

    return blockOutput;
};


Test.pythonToBlock = function(textCode, block) {
    var blockOutput = this.parsePython(textCode);
    var result = Test.objectSimilarCheck(block, blockOutput);
    if (!result){
        console.log(JSON.stringify(blockOutput));
    }
    return result;
}

Test.objectSimilarCheck = function(obj, targetObj) {
    for (var key in obj) {
        var value = obj[key];
        switch (typeof value) {
            case "object":
            case "array":
                var testResult = this.objectSimilarCheck(obj[key], targetObj[key]);
                if (!testResult)
                    return false;
                break;
            default:
                if (value !== targetObj[key])
                    return false;
                break;
        }
    }
    return true;
};


window.Test = Test;
