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
        var locations = true;
        var ranges = true;
        var options = { locations: locations, ranges: ranges };
        try {
            var astTree = filbertParse(code, options);
            return astTree;
        }
        catch (error) {
            console.log("ast error", error);
            throw error;
        }
    }
})(Entry.PyAstGenerator.prototype);