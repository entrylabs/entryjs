/*
 *
 */
"use strict";

goog.provide("Entry.ParticularBlock");

goog.require("Entry.BlockToPyParser");

Entry.ParticularBlock = function() {
	this.blockToPyParser = new Entry.BlockToPyParser();    
};
(function(p){
	p.isParticularBlock = function(block) {
		if(block.data.type == "repeat_while_true")
			return true;
		else
			return false;
	};

	p.repeat_while_true = function(block) {
		console.log("particular block", block);

		var syntax = block._schema.syntax.py[0];
        if(!syntax || syntax == null)
            return "";
        
        var conditionIndex = syntax.indexOf("'''condition'''");
        var whileIndex = syntax.indexOf("'''boolean'''");

        var schemaParams = block._schema.params;
        var dataParams = block.data.params;
        
        result += syntax.substring(0, conditionIndex);
        for(var index in schemaParams) {
	        if(schemaParams[index].type == "Indicator") {
	            index++;    
	        }
	        if(schemaParams[index].type == "Block") {
	            result += this.blockToPyParser.Block(dataParams[index]);
	        } 
	        else {
	            if(schemaParams[index].type == "DropdownDynamic"){
	                console.log("data param", dataParams[index]);
	                if(dataParams[index] == "null")
	                    var param = "none";
	                else 
	                    var param = this.dropdownDynamicValueConvertor(dataParams[index], schemaParams[index]);
	            }
	            else {
	                var param = this['Field' + schemaParams[index].type](dataParams[index]);

	                if(param == null) {
	                    if(schemaParams[index].text)
	                        param = schemaParams[index].text;
	                    else
	                        param = null;
	                }
	            } 
	            result += param;
	        }
	    }
        return result;
	};
})(Entry.ParticularBlock.prototype);