/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockAssembler");

goog.require("Entry.KeyboardCodeMap");
goog.require("Entry.AssemblerObjectConvertor");
goog.require("Entry.AssemblerValueConvertor");
goog.require("Entry.BlockVariableMap");
goog.require("Entry.ParticularBlockProcessing");

Entry.PyBlockAssembler = function(blockSyntax) {
    this.blockSyntax = blockSyntax;
};

(function(p){
	p.assemble = function(unit, rootBlockType, paramsType, paramIndex) {
		console.log("unit", unit);
        var result;
        switch(unit.type) {
            case 'ExpressionStatement' : {
            	console.log("ExpressionStatement unit", unit, rootBlockType, paramsType, paramIndex);

            	var expression = unit.expression;
            	
            	var callee = expression.callee;

            	if(callee) {
            		var params = this.assemble(expression);
            	}

	        	var operator = expression.operator;
	        	if(operator && operator != null) {
	        		console.log("operator", operator);

	        		if(operator == "&&") {
	        			var targetSyntax = "(%1) and (%3)";
	        		} else if(operator == "||") {
	        			var targetSyntax = "(%1) or (%3)";
	        		} else {
	        			var targetSyntax = "(%1 %2 %3)";
	        		}

	        		var blockType = this.getBlock(targetSyntax);
			        var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
			        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
	        		var blockParamIndex = 0;
		            var params = [];

		            console.log("blockType", blockType);

		            var leftExpression = expression.left;
	        		if(leftExpression) {
	        			blockParamIndex = 0;
	        			var param = this.assemble(leftExpression, blockType, blockDefParamsType, blockParamIndex);
	        			console.log("leftExpression", param);
	        			params.push(param);
	        		}

	        		console.log("before cv operator", operator);
	        		if(operator.length != 0) {
	        			console.log("opoopop", operator);
	        			operator = String(operator);
	        			operator = Entry.AssemblerValueConvertor.prototype.binaryOperatorValueConvertor(operator);
	        			console.log("cv operator", operator);
	        			var param = operator;
	        			params.push(param);
	        		}

	        		var rightExpression = expression.right;
	        		if(rightExpression) {
	        			blockParamIndex = 2;
	        			var param = this.assemble(rightExpression, blockType, blockDefParamsType, blockParamIndex);
	        			console.log("rightExpression", param);
	        			params.push(param);
	        		}
	        	}

	        	var value = expression.value;
	        	
        		if(value == true) {
        			var targetSyntax = "True";

        			var blockType = this.getBlock(targetSyntax);
		        	var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        	var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
        			var blockParamIndex = 0;

        			result = this.assemble(expression, blockType, blockDefParamsType, blockParamIndex);
        			break;
        		} else if(value == false) {
        			var targetSyntax = "False";

        			var blockType = this.getBlock(targetSyntax);
		        	var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        	var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
        			var blockParamIndex = 0;

        			result = this.assemble(expression, blockType, blockDefParamsType, blockParamIndex);
        			break;
        		} 

                result = { type: blockType, params: params };
                console.log("ExpressionStatement result", result);
                break;
            }
            case 'CallExpression' : {
            	console.log("CallExpression unit", unit, rootBlockType, paramsType, paramIndex);

            	var callee = unit.callee;

            	var targetSyntax = this.assemble(callee);
		       	
		        var blockType = this.getBlock(targetSyntax);
		        var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
		        var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
		        var blockParamIndex = 0;
            	
            	var params = [];
            	var arguments = expression.arguments;
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

			            	var isParticularBlock = Entry.ParticularBlockProcessing.prototype.isParticularBlock(blockType);
				            if(isParticularBlock) {
				            	params.push(null);
				            	params.push(param);
				            	params.push(null);
				            	break;
				            } 
			            	
			            }
			            console.log("param", param);

				        params.push(param);     
		            }
        		}

        		result = params;

            	break;
            }
            case 'MemberExpression' : {
            	console.log("MemberExpression unit", unit, rootBlockType, paramsType, paramIndex);

            	if(unit.object.name && unit.property.name)
		        	var targetSyntax = String(unit.object.name).concat(".").concat(unit.property.name);
		        else if(String(unit.object.object.name) == '__pythonRuntime' && String(unit.object.property.name) == 'functions')
		       		var targetSyntax = String(unit.property.name);

		       	result = targetSyntax;
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
            	if(rootBlockType == "True" || rootBlockType == "False") {
            		result = { type: rootBlockType };
            		break;
            	}

            	var blockType = paramsType[paramIndex];
            	console.log("literal block type", blockType);
            	var arg = unit.value;
            	console.log("arg", arg);

            	if(!rootBlockType || rootBlockType == null)
			    	rootBlockType = blockType;

            	var paramType = Entry.BlockVariableMap.prototype.getDropdownDynamicType[rootBlockType];
            	console.log("literal variable convertor", arg, paramType);

            	var param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, arg);
            	console.log("literal param result", param);



            	if(param == true)
            		result = { type: blockType };
            	else	
            		result = { type: blockType, params: [param] };

            	console.log("Literal result", result);
            	
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
	           	
            	break;
            }
        }
        	
        return result;
    };

    p.getBlock = function(syntax) {
        return this.blockSyntax[syntax];
    };
    
})(Entry.PyBlockAssembler.prototype);