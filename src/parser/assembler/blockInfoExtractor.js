/*
 *
 */
"use strict";

goog.provide("Entry.BlockInfoExtractor");

Entry.BlockInfoExtractor = function(blockType) {
    
};

(function(p){
	p.getParamsType = function(blockType) {
		var targetBlock =  Entry.block[blockType];
		var params = targetBlock.params;
		var paramsType = [];

		for(var index in params) {
			var param = params[index];
			paramsType.push(param.type);
		}

		return paramsType;
	}

})(Entry.BlockInfoExtractor.prototype);