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
    textCode = "# object code\n\nimport Entry\n\n" + textCode;
    var parser = new Entry.Parser();
    parser.setParser(Entry.Vim.WORKSPACE_MODE, Entry.Vim.PARSER_TYPE_PY_TO_BLOCK);

    var blockOutput = parser.parse(textCode);

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
                if (!obj || !targetObj)
                    return false;
                var testResult = this.objectSimilarCheck(obj[key], targetObj[key]);
                if (!testResult)
                    return false;
                break;
            case "string":
            case "number":
                if (value + "" !== targetObj[key] + "")
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
