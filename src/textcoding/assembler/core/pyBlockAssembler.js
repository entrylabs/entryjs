/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockAssembler");

goog.require("Entry.KeyboardCodeMap");
goog.require("Entry.AssemblerObjectConvertor");
goog.require("Entry.BlockVariableMap");

Entry.PyBlockAssembler = function(blockSyntax) {
    this.blockSyntax = blockSyntax;
};

(function(p){
	p.assemble = function(unit, rootBlockType, paramsType, paramIndex) {
		console.log("unit", unit);
        var result;
        switch(unit.type) {
            case 'ExpressionStatement' : {
            	console.log("ExpressionStatement unit", unit, rootBlockType, paramsType, paramIndex)

            	var callee = unit.expression.callee;
		        if(callee.object.name && callee.property.name)
		        	var targetSyntax = String(callee.object.name).concat(".").concat(callee.property.name);
		        else if(String(callee.object.object.name) == '__pythonRuntime' && String(callee.object.property.name) == 'functions')
		       		var targetSyntax = String(callee.property.name);
		       	
		        var blockType = this.getBlock(targetSyntax);
		        var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
		        var blockParamIndex = 0;
            	var params = [];
            	var arguments = unit.expression.arguments;

            	console.log("argument origin", arguments);
     
     			if(arguments && arguments.length){
		            for(var index = 0; index < arguments.length; index++) {
		            	console.log("meta", index, arguments[index], blockParamsType[index], blockDefParamsType[index]);
		                if(blockParamsType[index] == "Indicator"){
			            	var param = null;
			            	arguments.splice(index, 0, param);
			            }
			            else if(blockParamsType[index] == "Block") {
			            	blockParamIndex = index;
			            	var param = this.assemble(arguments[index], blockType, blockDefParamsType, blockParamIndex);
			            }
			            else if(blockParamsType[index] == "Keyboard") {
			            	var param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
			            }
			            else {	
			            	var arg = arguments[index].value;

			            	if(!rootBlockType || rootBlockType == null)
			            		rootBlockType = blockType;

			            	var paramType = Entry.BlockVariableMap.prototype.getDropdownDynamicType[rootBlockType];
			            	console.log("variable convertor", arg, paramType);

			            	var param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, arg);
			            	
			            }

			 			/*var defParamType = blockDefParamsType[index];
			 			console.log("defParamType", defParamType);
			 			var convertedBlockType = Entry.BlockTypeConvertor.prototype.convert(defParamType);
			 			param.type = convertedBlockType;

			 			console.log("convertedBlockType", convertedBlockType);
			 			console.log("blockType", blockType);
			 			if(convertedBlockType == "get_pictures") {
			 				param.params[0] = Entry.AssemblerObjectConvertor.prototype.convert("picture", param.params[0]);
			 			}
*/
			            console.log("param", param);

		            	params.push(param);
		            }
        		}

                result = { type: blockType, params: params };
                console.log("ExpressionStatement result", result);
                break;
            }
            case 'WhileStatement' : {
            	console.log("WhileStatement unit", unit);
            	
            	var targetSyntax = String("while True:\n$1");
		        var blockType = this.getBlock(targetSyntax);
		        var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
		        var blockParamIndex = 0;

            	var test = unit.test;
                var params = [];
                var param = this.assemble(test, blockType, blockDefParamsType, blockParamIndex);
            	params.push(param);

		        var statements = [];
		        var body = unit.body.body;
		        
		        for(var index in body) {
		        	var b = body[index];
		        	var unit = this.assemble(b);
		        	statements.push(unit);
		        }

		        result = { type: blockType, statements: [statements] };
		        
		        console.log("WhileStatement result", result);
                break;
            }
            case 'BlockStatement' : {
            	console.log("BlockStatement unit", unit);
            	var property = unit.body[0].declarations[0].init.callee.property;
		        if(property.name == 'range') {
		        	var targetSyntax = String("for i in range");
            	}
            	var blockType = this.getBlock(targetSyntax);
            	var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
		        var blockParamIndex = 0;
            	var params = [];
            	var arguments = unit.body[0].declarations[0].init.arguments;

            	if(arguments && arguments.length){
		            for(var index = 0; index < arguments.length; index++) {
		                if(blockParamsType[index] == "Indicator"){
			            	var param = null;
			            	arguments.splice(index, 0, param);
			            }
			            else if(blockParamsType[index] == "Block") {
			            	blockParamIndex = index;
			            	var param = this.assemble(arguments[index], blockType, blockDefParamsType, blockParamIndex);
			            }
			            else if(blockParamsType[index] == "Keyboard") {
			            	var param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
			            }
			            else {	
			            	var param = arguments[index].value;
			            	var paramType = Entry.ParamTypeMap.prototype.getDropdownDynamicType[block];
			            	
			            	param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, param);
			            }

		            	params.push(param);
		            }
        		}
		
            	var consequent = unit.body[1].consequent;
            	var body = consequent.body[0].body;
            	body.shift();
            	var statements = [];
            	for(var index in body) {
            		var unit = this.assemble(body[index]);
            		statements.push(unit);
            	}

		        result = { type: blockType, params: params, statements: [statements] };

		        console.log("BlockStatement result", result);
                break;
            }
        	case 'IfStatement' : {
            	console.log("IfStatement unit", unit);
            	var consequent = unit.consequent;
		        var alternate = unit.alternate;
            	var test = unit.test;
            	
                var params = [];

                if(alternate == null) {
		    		var targetSyntax = String("if %1:\n$1");
		        	var blockType = this.getBlock(targetSyntax);
		       	} else {
		       		var targetSyntax = String("if %1:\n$1\nelse:\n$2");
		        	var blockType = this.getBlock(targetSyntax);
		       	}
		       	console.log("if block type", blockType);

                var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
		        var blockParamIndex = 0;
                var param = this.assemble(test, blockType, defParamsType, blockParamIndex);
            	params.push(param);
    
		        var ifStatements = [];
		        var elseStatements = [];
		        if(consequent != null) {
		        	var body = consequent.body;
	            	for(var index in body) {
	            		var unit = this.assemble(body[index]);
	            		ifStatements.push(unit);
	            	}
	            	result = { type: blockType, params: params, statements: [ifStatements] };
	            }

            	if(alternate != null) {
            		var body = alternate.body;
	            	for(var index in body) {
	            		var unit = this.assemble(body[index]);
	            		elseStatements.push(unit);
	            	}
	            	result = { type: blockType, params: params, statements: [ifStatements, elseStatements] };
	            }

		        console.log("IfStatement result", result);
		        break;
        	} 
        	case 'BreakStatement' : {
            	console.log("BreakStatement unit", unit);

            	var targetSyntax = String("break");
            	var blockType = this.getBlock(targetSyntax);

            	result = { type: blockType };

            	console.log("BreakStatement result", result);
            	break;
            }
            case 'Literal' : {
            	console.log("Literal unit", unit, rootBlockType, paramsType, paramIndex);
            	var blockType = paramsType[paramIndex];
            	var arg = unit.value;
            	console.log("arg", arg);

            	if(!rootBlockType || rootBlockType == null)
			    	rootBlockType = blockType;

            	var paramType = Entry.BlockVariableMap.prototype.getDropdownDynamicType[rootBlockType];
            	console.log("literal variable convertor", arg, paramType);

            	var param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, arg);

            	result = { type: blockType, params: [param] };

            	console.log("Literal result", result);

            	/*if(arg === true) {
            		var targetSyntax = String("True");
            		var blockType = this.getBlock(targetSyntax);
            		result = { type: blockType };
            	}
            	else if(arg === false) {
            		var targetSyntax = String("False"); 
            		var blockType = this.getBlock(targetSyntax);
            		result = { type: blockType};
            	}
            	else if(typeof arg === 'string'){
	           		var targetSyntax = String("\"%1\"");
	           		var blockType = this.getBlock(targetSyntax);
	           		result = { type: blockType, params: [arg] };
            	}
	        	else {
	           		var targetSyntax = String("%1");
	           		var blockType = this.getBlock(targetSyntax);
	           		result = { type: blockType, params: [arg] };
	        	}*/
            	
            	//console.log("targetSyntax", targetSyntax);
	            
            	
            	break;
            }
            case 'UnaryExpression' : {
            	console.log("UnaryExpression unit", unit, rootBlockType, paramsType, paramIndex);
            	var blockType = paramsType[paramIndex];
            	
            	if(unit.prefix){
		        	var arg = unit.operator.concat(unit.argument.value);
            	}

            	if(!rootBlockType || rootBlockType == null)
			    	rootBlockType = blockType;

            	var paramType = Entry.BlockVariableMap.prototype.getDropdownDynamicType[rootBlockType];
            	console.log("literal variable convertor", arg, paramType);

            	var param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, arg);

				result = { type: blockType, params: [param] };

            	console.log("UnaryExpression result", result);
            	

            	/*if(typeof arg === 'string'){
	           		var targetSyntax = String("\"%1\"");
            	}
	        	else {
	           		var targetSyntax = String("%1");
	        	}

	           	var block = this.getBlock(targetSyntax);*/

	           	
            	break;
            }
        }
        	
        return result;
    };

    p.getBlock = function(syntax) {
        return this.blockSyntax[syntax];
    };
    
})(Entry.PyBlockAssembler.prototype);