/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockAssembler");

goog.require("Entry.KeyboardCodeMap");

Entry.PyBlockAssembler = function(blockSyntax) {
    this.blockSyntax = blockSyntax;
};

(function(p){
	p.assemble = function(unit) {
		console.log("unit", unit);
        var result;
        switch(unit.type) {
            case 'ExpressionStatement' : {
            	console.log("ExpressionStatement unit", unit);

            	var callee = unit.expression.callee;
		        if(callee.object.name && callee.property.name)
		        	var targetSyntax = String(callee.object.name).concat(".").concat(callee.property.name);
		        else if(String(callee.object.object.name) == '__pythonRuntime' && String(callee.object.property.name) == 'functions')
		       		var targetSyntax = String(callee.property.name);
		       	
		        var block = this.getBlock(targetSyntax);
		        var paramsType = Entry.BlockInfoExtractor.prototype.getParamsType(block);
            	var params = [];
            	var arguments = unit.expression.arguments;

            	console.log("argument origin", arguments);
     
     			if(arguments && arguments.length){
		            for(var index = 0; index < arguments.length; index++) {
		            	console.log("index arg", index, arguments[index]);
		                if(paramsType[index] == "Indicator"){
			            	var param = null;
			            	arguments.splice(index, 0, param);
			            }
			            else if(paramsType[index] == "Block")
			            	var param = this.assemble(arguments[index]);
			            else if(paramsType[index] == "Keyboard")
			            	var param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
			            else	
			            	var param = arguments[index].value;

		            	params.push(param);
		            }
        		}

                result = { type: block, params: params };
                console.log("ExpressionStatement result", result);
                break;
            }
            case 'WhileStatement' : {
            	console.log("WhileStatement unit", unit);
            	
            	var test = unit.test;
                var params = [];
                var param = this.assemble(test);
            	params.push(param);

		    	var targetSyntax = String("while True:\n$1\n");
		        var block = this.getBlock(targetSyntax);
		        var statements = [];
		        var body = unit.body.body;
		        
		        for(var index in body) {
		        	var b = body[index];
		        	var unit = this.assemble(b);
		        	statements.push(unit);
		        }

		        result = { type: block, statements: [statements] };
		        
		        console.log("WhileStatement result", result);
                break;
            }
            case 'BlockStatement' : {
            	console.log("BlockStatement unit", unit);
            	var property = unit.body[0].declarations[0].init.callee.property;
		        if(property.name == 'range') {
		        	var targetSyntax = String("for i in range");
            	}
            	var block = this.getBlock(targetSyntax);
            	var paramsType = Entry.BlockInfoExtractor.prototype.getParamsType(block);
            	var params = [];
            	var arguments = unit.body[0].declarations[0].init.arguments;

            	if(arguments && arguments.length){
		            for(var index = 0; index < arguments.length; index++) {
		                if(paramsType[index] == "Indicator"){
			            	var param = null;
			            	arguments.splice(index, 0, param);
			            }
			            else if(paramsType[index] == "Block")
			            	var param = this.assemble(arguments[index]);
			            else if(paramsType[index] == "Keyboard")
			            	var param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
			            else	
			            	var param = arguments[index].value;

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

		        result = { type: block, params: params, statements: [statements] };

		        console.log("BlockStatement result", result);
                break;
            }
        	case 'IfStatement' : {
            	console.log("IfStatement unit", unit);
            	
            	var test = unit.test;
                var params = [];
                var param = this.assemble(test);
            	params.push(param);
                		            
              	var consequent = unit.consequent;
		        var alternate = unit.alternate;

		        if(alternate == null) {
		    		var targetSyntax = String("if %1:\n$1");
		        	var block = this.getBlock(targetSyntax);
		       	} else {
		       		var targetSyntax = String("if %1:\n$1\nelse:\n$2");
		        	var block = this.getBlock(targetSyntax);
		       	}
		        
		        var ifStatements = [];
		        var elseStatements = [];
		        if(consequent != null) {
		        	var body = consequent.body;
	            	for(var index in body) {
	            		var unit = this.assemble(body[index]);
	            		ifStatements.push(unit);
	            	}
	            	result = { type: block, params: params, statements: [ifStatements] };
	            }

            	if(alternate != null) {
            		var body = alternate.body;
	            	for(var index in body) {
	            		var unit = this.assemble(body[index]);
	            		elseStatements.push(unit);
	            	}
	            	result = { type: block, params: params, statements: [ifStatements, elseStatements] };
	            }

		        console.log("IfStatement result", result);
		        break;
        	} 
        	case 'BreakStatement' : {
            	console.log("BreakStatement unit", unit);

            	var targetSyntax = String("break");
            	var block = this.getBlock(targetSyntax);

            	result = { type: block };

            	console.log("BreakStatement result", result);
            	break;
            }
            case 'Literal' : {
            	console.log("Literal unit", unit);
            	
            	var arg = unit.value;
            	console.log("arg", arg);
            	if(arg === true) {
            		var targetSyntax = String("True");
            		var block = this.getBlock(targetSyntax);
            		result = { type: block };
            	}
            	else if(arg === false) {
            		var targetSyntax = String("False"); 
            		var block = this.getBlock(targetSyntax);
            		result = { type: block};
            	}
            	else if(typeof arg === 'string'){
	           		var targetSyntax = String("\"%1\"");
	           		var block = this.getBlock(targetSyntax);
	           		result = { type: block, params: [arg] };
            	}
	        	else {
	           		var targetSyntax = String("%1");
	           		var block = this.getBlock(targetSyntax);
	           		result = { type: block, params: [arg] };
	        	}
            	
            	console.log("targetSyntax", targetSyntax);
	            
            	console.log("Literal result", result);
            	break;
            }
            case 'UnaryExpression' : {
            	console.log("UnaryExpression unit", unit);
            	
            	if(unit.prefix){
		        	var arg = unit.operator.concat(unit.argument.value);
            	}

            	if(typeof arg === 'string')
	           		var targetSyntax = String("\"%1\"");
	        	else
	           		var targetSyntax = String("%1");

	           	var block = this.getBlock(targetSyntax);

	           	result = { type: block, params: [arg] };

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