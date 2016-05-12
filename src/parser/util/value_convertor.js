/*
 *
 */
"use strict";

goog.provide("Entry.ValueConvertor");

Entry.ValueConvertor = function() {

};

(function(p) {
	p.convertText = function(text) {
		console.log("text", text);
		var result = "";
    	switch(text) {
    		case 'none':
    			result = null;
    			break;
    		default:
    			result = text;
    	}

    	return result;
	};
})(Entry.ValueConvertor.prototype);