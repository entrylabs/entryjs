/*
 *
 */
"use strict";

goog.provide("Entry.BlockTemplate");

Entry.BlockTemplate = function(blockType) {
    
};

(function(p){
	p.getParamsType = function(blockType) {
		var targetBlock =  Entry.block[blockType];
		console.log("targetBlock", targetBlock);

		var params = targetBlock.params;
		var paramsType = [];

		for(var index in params) {
			var param = params[index];
			paramsType.push(param.type);
		}

		return paramsType;
	}

})(Entry.BlockTemplate.prototype);