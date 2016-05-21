/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockAssembler");

goog.require("Entry.KeyboardCodeMap");
goog.require("Entry.AssemblerObjectConvertor");
goog.require("Entry.AssemblerValueConvertor");
goog.require("Entry.BlockObjectMap");
goog.require("Entry.ParticularBlockProcessing");
goog.require("Entry.TextCodingUtil");

Entry.PyBlockAssembler = function(blockSyntax) {
    this.blockSyntax = blockSyntax;
    this._blockStatmentIndex = 0;
    this._blockStatments = [];
};

(function(p){
	p.ExpressionStatement = function(component) {    
    	console.log("ExpressionStatement component", component);
    	var reusult;
    	var structure = {};

    	var expression = component.expression;
    	
    	if(expression.type == "Literal") {
    		var paramMeta = { type: "Block", accept: "booleanMagnet" };
    		var expressionData = this[expression.type](paramMeta, expression);

    		structure.type = expressionData.type;

    		result = structure;
    		console.log("ExpressionStatement type literal", result);
    	}
    	else {
    		var expressionData = this[expression.type](expression);

    		structure.type = expressionData.type;
    		structure.params = expressionData.params;
    			
    		result = structure;
    		console.log("ExpressionStatement type not literal", result);
    	} 

    	
/*
    	if(expression.operator)
    	{	
    		var operator = expression.operator;
    		console.log("ExpressionStatement expression operator", expression, operator);
    	}*/
    	/*if(operator) {
    		result = this.binaryTestExpression(expression);
    	}

    	var value = expression.value;
    	if(value == true || value == false) {
    		result = this.unaryTestExpression(expression);
    	}*/

        console.log("ExpressionStatement result", result);
        return result;
    };

    

    p.CallExpression = function(component) {
    	console.log("CallExpression component", component);
    	var result;
    	var data = {};

    	var callee = component.callee;

    	var calleeData = this[callee.type](callee);

    	console.log("CallExpression calleeData", calleeData, "calleeData typeof", typeof calleeData);

    	if(typeof calleeData.object != "object")
    		var syntax = String(calleeData.object).concat('.').concat(String(calleeData.property));
    	else 
    		var syntax = String(calleeData.object.object).concat('.')
    						.concat(String(calleeData.object.property))
    						.concat('.').concat(String(calleeData.property));

    	console.log("CallExpression syntax", syntax);

    	var type = this.getBlockType(syntax);

    	console.log("CallExpression type1", type);
    	
    	if(!type) {
    		type = Entry.AssemblerTypeConvertor.prototype.convert(syntax);
    	}

        console.log("CallExpression type2", type);

    	var paramsMeta = Entry.block[type].params;
    	console.log("CallExpression paramsMeta", paramsMeta);
    
    	var arguments = component.arguments;
    	
    	var params = [];
    	
    	//if(Array.isArray(arguments)){
    	for(var i in arguments) {
    		var argument = arguments[i];
    		console.log("CallExpression argument", argument);
    		
    		if(argument.type == "Literal") {
    			
    			var paramMeta = paramsMeta[i];
    			if(paramMeta.type == "Indicator") {
    				var param = null;
    				params.push(param);	
    				i--;
    			}
    			else {
    				var param = this[argument.type](paramMeta, argument);
    				params.push(param);	
    			}

    			if(i == (arguments.length-1)) {
    				console.log("CallExpression in1" );
    				if(i < paramsMeta.length) {
    					console.log("CallExpression in2");
    					params.push(null);
    				}
    			}
    				
    				
    			 
    			 console.log("CallExpression i", i);
	    		   		
    		}
    		else {
    			//To Do : when argument.type is not "Literal"
    		}
    	}
	  
        console.log("CallExpression params", params);
 		
 		data.type = type;
 		data.params = params;

		result = data;

		console.log("CallExpression result", result);
    	return result;
    };

    p.ParamColor = function(paramMeta, value) {
    	console.log("ParamColor paramMeta value", paramMeta, value);
    	var result;
    	
		result = value;
		
		console.log("ParamColor result", result);

		return result;
    };

    p.ParamDropdown = function(paramMeta, value) {
    	console.log("ParamDropdown paramMeta value", paramMeta, value);
    	var result;
    	
		result = value;
		
		console.log("ParamDropdownDynamic result", result);

		return result;
    };

    p.ParamDropdownDynamic = function(paramMeta, value) {
    	console.log("ParamDropdownDynamic paramMeta value", paramMeta, value);
    	var result;

    	if(value == "mouse"){
    		result = "mouse";
    		return result;
    	}
    	
    	var options = paramMeta.options;
		for(var i in options) {
			console.log("options", options);
			if(value == options[i][0]){
				console.log("options[i][0]", options[i][0]);
				result = options[i][1];
				break;
			}
		}
		
		
		console.log("ParamDropdownDynamic result", result);

		return result;
    };

    p.ParamKeyboard = function(paramMeta, value) {
    	console.log("ParamKeyboard paramMeta value", paramMeta, value);
    	var result;
    	result = Entry.KeyboardCodeMap.prototype.keyCharToCode[value];

    	console.log("ParamKeyboard result", result);

    	return result;
    };

    p.ParamBlock = function(paramMeta, value) {
    	console.log("ParamBlock paramMeta value", paramMeta, value);
    	var result;
    	var structure = {};
		
		var type;
		var params = [];

		

		var valueType = typeof value;
		console.log("ParamBlock valueType", valueType);
		switch(valueType) {
			case 'number':
				structure.type = "number";
				params.push(value);
				structure.params = params;
				break;
			case 'boolean': 
				if(value == true) {
					structure.type = "True";
				}
				else if(value == false) {
					structure.type = "False";
				}
				break;
			default: 
				structure.type = "text";
				params.push(value);
				structure.params = params;		
		}

		result = structure;

		console.log("ParamBlock result", result);

		return result;

    };

    p.Indicator = function(blockParam, blockDefParam, arg) {
    	var result;

    	return result;
    };

    

    p.MemberExpression = function(component) {
    	console.log("MemberExpression component", component);

    	var result;
    	var data = {}
    	var object = component.object;
    	var property = component.property;
    	var objectData = this[object.type](object);
    	var propertyData = this[property.type](property);

    	console.log("MemberExpression objectData", objectData);
    	console.log("MemberExpression structure", propertyData);
    	
    	data.object = objectData;
    	data.property = propertyData;

        result = data;

        console.log("MemberExpression result", result);

    	return result;
    };

    
    
    p.Identifier = function(component) {
    	console.log("Identifiler component", component);
    	var result;
    	var value = component.name;
    	
    	result = value;

    	console.log("Identifiler result", result);
    	return result;
    };

    p.WhileStatement = function(component) {
    	console.log("WhileStatement component", component);
    	var result;
    	var structure = {};
    	
    	var test = component.test;
        
        var syntax;
        var type;

       
       	if(test.value == true) {
       		syntax = String("while True:\n$1");
        	type = this.getBlockType(syntax);
       	} else if(test.value == false) {

       	} else {

       	}

       	console.log("WhileStatement type", type);

   		var paramsMeta = Entry.block[type].params;
    	console.log("WhileStatement paramsMeta", paramsMeta);
    	    	
    	var params = [];
    	if(test) {
			if(test.type = "Literal") {
				var paramMeta = paramsMeta[0];
				if(paramMeta.type == "Indicator") {
					var param = null;
				}
				else {
					var param = this[test.type](paramMeta, test);
				}
				params.push(param);	 
	    		   		
			}
			else {
				//To Do : when argument.type is not "Literal"
			}
    	}
				
        var statements = [];
        var bodies = component.body.body;
        
        for(var index in bodies) {
        	var body = bodies[index];
        	var bodyData = this[body.type](body);
        	statements.push(bodyData);
        }

        structure.type = type;
        structure.params = params;
        structure.statements = [];
        structure.statements.push(statements);

        result = structure;
        
        console.log("WhileStatement result", result); 
        return result;
    };

    p.BlockStatement = function(component) {
    	console.log("BlockStatement component", component);
    	this._blockStatmentIndex = 0;
    	this._blockStatments = [];
    	var result;
    	var structure = {};
    	
    	var bodies = component.body;
    	for(var i in bodies) {
    		var body = bodies[i];

    		console.log("BlockStatement body", body, "i", i);
    		
    		var bodyData = this[body.type](body);


    		console.log("BlockStatement bodyData", bodyData, "i", i);

    		if(bodyData.declarations) {
    			console.log("BlockStatement statements type params bodyData", i, bodyData);
    			var declarations = bodyData.declarations;
	    		for(var j in declarations){
	    			var declaration = declarations[j];
	    			if(declaration.init.type) {
		    			structure.type = declaration.init.type;
	    			}
		    		if(declaration.init.params) {
		    			console.log("BlockStatement params", declaration.init.params);
		    			structure.params = declaration.init.params;
		    		}

		    		console.log("BlockStatement structure", structure, "j", j);
		    	}
		    } else {
		    	if(this._blockStatmentIndex == 0) {
		    		this._blockStatments.push(bodyData);
		    	}
		    }

    	}

    	structure.statements = [this._blockStatments];
        result = structure;

        console.log("BlockStatement result", result);

        this._blockStatmentIndex++;

        return result;
    };

    p.Literal = function(paramMeta, component) {
		console.log("Literal paramMeta component", paramMeta, component);
		var result;

		var value = component.value;
		
		var param = this['Param'+paramMeta.type](paramMeta, value);
		
		/*else if (component.operator) {
			var left = this[component.left.type](component.left);
			var operator = component.operator;
			var right = this[component.right.type](component.right);

			var param = String(left).concat(String(operator)).concat(String(right));
		}*/


		result = param;

		console.log("Literal result", result);
		
		return result;
	};

    p.IfStatement = function(component) {
    	console.log("IfStatement component", component);
    	var result;
    	var structure = {};

    	var type;
    	var params = [];
    	var consequentStatements = [];
    	var alternateStatements = [];
    	var statements = [];

		var test = component.test;
    	var alternate = component.alternate;
    	var consequent = component.consequent;
    	

    	if(alternate == null) {
    		var syntax = String("if %1:\n$1");
        	var type = this.getBlockType(syntax);
       	} else {
       		var syntax = String("if %1:\n$1\nelse:\n$2");
        	var type = this.getBlockType(syntax);
       	}


       	if(test != null){
       		var paramsMeta = Entry.block[type].params;
	    	console.log("IfStatement paramsMeta", paramsMeta);
	    	    	
	    	var params = [];

    		if(test.type = "Literal") {
    			var paramMeta = paramsMeta[0];
    			if(paramMeta.type == "Indicator") {
    				var param = null;
    			}
    			else {
    				var param = this[test.type](paramMeta, test);
    			}
    			params.push(param);	 
	    		   		
    		}
    		else {
    			//To Do : when argument.type is not "Literal"
    		}		
	    }

    	if(consequent != null) {
	    	for(var i in consequent.body) {
	    		var body = consequent.body[i];
	    		var bodyData = this[body.type](body);
	    		console.log("IfStatement consequent bodyData", bodyData);
	    		consequentStatements.push(bodyData);

	    	}
	    } 

    	if(alternate != null) {
	    	for(var i in alternate.body) {
	    		var body = alternate.body[i];
	    		var bodyData = this[body.type](body);
	    		console.log("IfStatement alternate bodyData", bodyData);
	    		alternateStatements.push(bodyData);

	    	}
	    }

	    if(consequentStatements.length != 0)
	    	statements.push(consequentStatements);
	    if(alternateStatements.length != 0)
	    	statements.push(alternateStatements);


        structure.type = type;
        if(params.length != 0)
        	structure.params = params;
        if(statements.length != 0)
        	structure.statements = statements;

        result = structure;

        console.log("IfStatement result", result);
        return result;
	};

    p.VariableDeclaration = function(component) {
    	console.log("VariableDeclaration component", component);
    	var result;
    	var data = {};
    	var declarationArr = [];

    	var declarations = component.declarations;
    	
    	for(var i in declarations) {

    		var declaration = declarations[i];
    		var declarationData = this[declaration.type](declaration);

    		console.log("VariableDeclaration declarationData", declarationData);
    		declarationArr.push(declarationData);
    	}

    	data.declarations = declarationArr;

    	result = data;

    	console.log("VariableDeclaration result", result);

    	return result;

    };

    p.VariableDeclarator = function(component) {
    	console.log("VariableDeclarator component", component);
		
		var result;
		var data = {};
		
		var id = component.id;
		var idData = this[id.type](id);
		console.log("VariableDeclarator idData", idData);

		var init = component.init;
		var initData = this[init.type](init);

		console.log("VariableDeclarator initData", initData);

		data.id = id;
		data.init = initData;

		result = data;

		console.log("VariableDeclarator result", result);
		return result;

    };

	
	p.BreakStatement = function(component) {
    	console.log("BreakStatement component", component);
    	var result;
    	var structure = {};

    	var syntax = String("break");
    	var type = this.getBlockType(syntax);

    	structure.type = type;
    	result = structure;

    	console.log("BreakStatement result", result);
    	return result;
    };
    
    p.UnaryExpression = function(component) {
    	console.log("UnaryExpression component", component);
    	
    	var params = [];
    	var param;
    	if(component.prefix){
        	var arg = component.operator.concat(component.argument.value);
        	param  = arg;
        	params.push(param);
    	}

    	result.params = params;

    	console.log("UnaryExpression result", result);
       	
    	return result;
    };

    p.LogicalExpression = function(component) {
    	console.log("LogicalExpression component", component);
    	var result;
    	var structure = {};

		var operator = String(component.operator);

		switch(operator){
            case '&&': 
                var syntax = String("%1 and %3");
                break;
            case '||': 
                var syntax = String("%1 or %3");
                break;
            default: 
                var syntax = String("%1 and %3");
                break;
        }
    	

    	var type = this.getBlockType(syntax);

       	var paramsMeta = Entry.block[type].params;
       	console.log("LogicalExpression paramsMeta", paramsMeta);


    	var params = [];
    	var param;
    	   
        var left = component.left;
		if(left.type) {
			if(left.type == "Literal") {
				param = this[left.type](paramsMeta[0], left);
				console.log("LogicalExpression left Literal param", param);
				if(param) 
					params.push(param);
			} else {
				param = this[left.type](left);
				if(param) 
					params.push(param);
			}
			console.log("LogicalExpression left param", param);
		} else {
			left = component.left;
			this[left.type](left);
		}

		operator = String(component.operator);
		console.log("LogicalExpression operator", operator);
		if(operator) {
			operator = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
			param = operator;
			params.push(param);
		}

		var right = component.right;
		if(right.type) {
			if(right.type == "Literal") {
				param = this[right.type](paramsMeta[2], right);
				console.log("LogicalExpression right Literal param", param);
				if(param) 
					params.push(param);
			} else {
				param = this[right.type](right);
				if(param) 
					params.push(param);
			}
			
			console.log("LogicalExpression right param", param);
		} else {
			right = component.right;
			this[right.type](right);
		}

        structure.type = type;
        structure.params = params;

		/*if(left.left) {
			var param = this.binaryTestExpression(left);
			if(param) {
				params.push(param);
			}
		} else if(left.type) {
			blockParamIndex = 0;
			var param = this.assemble(left, type);
			params.push(param);
		} 

		if(operator.length != 0) {
			operator = Entry.TextCodingUtil.prototype.binaryOperatorValueConvertor(operator);
			var param = operator;
			params.push(param);
		}

		var right = expression.right;
		if(right.left) {
			var param = this.binaryTestExpression(right);
			if(param) {
				params.push(param);
			}
		} else if(right.type) {
			blockParamIndex = 2;
			var param = this.assemble(right);
			if(param)
				params.push(param);
		}*/
    	
    	result = structure;

    	console.log("LogicalExpression result", result);

    	return result;
    };

    p.BinaryExpression = function(component) {
    	console.log("BinaryExpression component", component);
    	
    	var result;
    	var structure = {};
    	structure.params = [];

		var operator = String(component.operator);

		console.log("BinaryExpression operator", operator);
		if(operator)
        	var syntax = String("(%1 %2 %3)");
        
        
        console.log("BinaryExpression syntax", syntax);

    	var type = this.getBlockType(syntax);

    	console.log("BinaryExpression type", type);

       	var paramsMeta = Entry.block[type].params;
       	console.log("BinaryExpression paramsMeta", paramsMeta);


    	var params = [];
    	var param;
    	   
        var left = component.left;
		if(left.type) {
			if(left.type == "Literal") {
				param = this[left.type](paramsMeta[0], left);
				console.log("BinaryExpression left Literal param", param);
				if(param) 
					params.push(param);
			} else {
				param = this[left.type](left);
				if(param) 
					params.push(param);
			}
			console.log("BinaryExpression left param", param);
		} else {
			left = component.left;
			this[left.type](left);
		}

		operator = String(component.operator);
		if(operator) {
			console.log("BinaryExpression operator", operator);
			operator = Entry.TextCodingUtil.prototype.binaryOperatorConvert(operator);
			param = operator;
			if(param)
				params.push(param);
		}

		var right = component.right;
		if(right.type) {
			if(right.type == "Literal") {
				param = this[right.type](paramsMeta[2], right);
				console.log("BinaryExpression right Literal param", param);
				if(param) 
					params.push(param);
			} else {
				param = this[right.type](right);
				if(param) 
					params.push(param);
			}
			
			console.log("BinaryExpression right param", param);
		} else {
			right = component.right;
			this[right.type](right);
		}

		console.log("BinaryExpression params", params);
		//result = { type: blockType, params: params };

		structure.type = type;
		structure.params = params;

		result = structure;
    	
    	console.log("BinaryExpression result", result);
    	return result;
    };


    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };
    
    
})(Entry.PyBlockAssembler.prototype);