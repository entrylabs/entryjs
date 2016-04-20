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
        catch (e) {
            console.log("parsing error", e.toString());
        }
    }
})(Entry.PyAstGenerator.prototype);