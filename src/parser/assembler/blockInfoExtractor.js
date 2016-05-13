/*
 *
 */
"use strict";

goog.provide("Entry.BlockInfoExtractor");

Entry.BlockInfoExtractor = function() {
    
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
	};

	p.getDefParamsType = function(blockType) {
		var targetBlock =  Entry.block[blockType];
		var params = targetBlock.def.params;
		var paramsType = [];

		for(var index in params) {
			var param = params[index];
			console.log("def p", param);
			if(param === null) {
				paramsType.push(null);
				continue;
			}
			paramsType.push(param.type);
		}

		console.log("final def p", paramsType);

		return paramsType; 
	};

})(Entry.BlockInfoExtractor.prototype);