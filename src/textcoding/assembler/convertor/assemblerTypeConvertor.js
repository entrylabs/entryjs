/*
 *
 */
"use strict";

goog.provide("Entry.AssemblerTypeConvertor");

Entry.AssemblerTypeConvertor = function() {

};

(function(p) {
	p.convert = function(syntax) {
        console.log("AssemblerTypeConvertor", syntax);
        var result;
        switch(syntax) {
            case '__pythonRuntime.functions.range': {
            	result = String("repeat_basic");
            	break;
            }
            default: {
            	result = syntax;
                break;
            }
    	}
    	return result;
	};
})(Entry.AssemblerTypeConvertor.prototype);