/*
 *
 */
"use strict";

goog.provide("Entry.BlockTypeConvertor");

Entry.BlockTypeConvertor = function() {
    
};

(function(p){
	p.convert = function(type) {
		console.log("type convertor", type);
		var result = type;
		switch(type) {
            case 'angle': {
				result = "angle";
				break;
			}
			case 'get_pictures': {
				result = "get_pictures";
				break;
			}

			default: break;
		}
		return result;
	};

})(Entry.BlockTypeConvertor.prototype);