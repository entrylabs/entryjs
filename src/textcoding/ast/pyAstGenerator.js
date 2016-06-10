/*
 *
 */
"use strict";

goog.provide("Entry.PyAstGenerator");

Entry.PyAstGenerator = function() {
    
};

(function(p){
    p.generate = function(code) {
    	var filbertParse = filbert.parse;
        var ranges = false;
        var locations = false;
        var options = { locations: locations, ranges: ranges };
        var astTree;
        try {
            astTree = filbertParse(code, options);
            console.log("astTree", astTree);
            return astTree;
        }
        catch (error) {
            error.message = "  파이썬 문법을 확인해주세요";
            throw error;

            //Entry.toast.alert('에러(Error)', error.message);
            console.log("AST Error", error.toString());
        }
    }
})(Entry.PyAstGenerator.prototype);