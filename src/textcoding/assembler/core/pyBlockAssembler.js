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
    	
    	if(expression) {
    		var expressionData = this[expression.type](expression);

    		structure.type = expressionData.type;
    		structure.params = expressionData.params;
    			
    		result = structure;
    		
    	}

    	var operator = expression.operator;
    	if(operator) {
    		result = this.binaryTestExpression(expression);
    	}

    	var value = expression.value;
    	if(value == true || value == false) {
    		result = this.unaryTestExpression(expression);
    	}

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
    		var syntax = String(calleeData.object.object).concat('.').concat(String(calleeData.object.property))
    							.concat('.').concat(String(calleeData.property));

    	console.log("CallExpression syntax", syntax);

    	var type = this.getBlockType(syntax);

    	 console.log("CallExpression type1", type);
    	
    	if(!type) {
    		type = Entry.AssemblerTypeConvertor.prototype.convert(syntax);
    	}

        console.log("CallExpression type2", type);

    	var blockParams = Entry.block[type].params;
    	console.log("CallExpression blockParams", blockParams);
    	var blockDefParams = Entry.block[type].def.params;
    	console.log("CallExpression blockDefParams", blockDefParams);

    	var arguments = component.arguments;
    	var params = [];
    	for(var i in arguments) {
    		var argument = arguments[i];
    		var arg = this[argument.type](argument);
    		console.log("CallExpression arg", arg);
    		for(var j in blockParams){
    			var blockParamsType = blockParams[j].type;
    			
    			if(!blockDefParams[j])
					continue;

    			var blockDefParamsType = '';
    			if(blockDefParams[j] != null && blockDefParams[j].type != undefined) 
    					blockDefParamsType = blockDefParams[j].type
    			
    				
    			var paramType = String(blockParamsType).concat(blockDefParamsType);

    			console.log("CallExpression paramType", paramType);

    			var paramData = this[paramType](blockParams[j], blockDefParams[j], arg);

    			console.log("CallExpression paramData", paramData);
    			if(!paramData)
    				params.push(null);
    			else {
    				params.push(paramData);
    			}
        	}
        	
        }

        console.log("CallExpression params", params);
 		
 		data.type = type;
 		data.params = params;

		result = data;

		console.log("CallExpression result", result);
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

    p.Literal = function(component) {
		console.log("Literal component", component);
		var result;
		
		var value = component.value;
		

		


		result = value;
		console.log("Literal result", result);
		
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
    	
    	var targetSyntax = String("while True:\n$1");
        var blockType = this.getBlockType(targetSyntax);
       

    	var test = component.test;
        var params = [];
        var param = this.assemble(test);
    	params.push(param);

        var statements = [];
        var body = component.body.body;
        
        for(var index in body) {
        	var b = body[index];
        	var component = this.assemble(b);
        	statements.push(component);
        }

        result = { type: blockType, statements: [statements] };
        
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

       	var arg;
       	if(test != null){
        	arg = this[test.type](test);
        	console.log("IfStatement arg", arg);
        }

        var blockParams = Entry.block[type].params;
    	console.log("IfStatement blockParams", blockParams);
    	var blockDefParams = Entry.block[type].def.params;
    	console.log("IfStatement blockDefParams", blockDefParams);
  
		console.log("IfStatement arg", arg);
		for(var j in blockParams){
			var blockParamsType = blockParams[j].type;
			
			if(!blockDefParams[j])
				continue;

			var blockDefParamsType = '';
			console.log("shit", blockDefParams[j]);
			
			if(blockDefParams[j] != null && blockDefParams[j].type !== undefined)
				blockDefParamsType = blockDefParams[j].type
			
				
			var paramType = String(blockParamsType).concat(blockDefParamsType);

			console.log("IfStatement paramType", paramType);

			var paramData = this[paramType](blockParams[j], blockDefParams[j], arg);

			console.log("IfStatement paramData", paramData);

			if(!paramData) {
				params.push(null);
			}
			else {
				params.push(paramData);
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

	p.DropdownDynamic = function(blockParam, blockDefParam, arg) {
    	var result;
    	var param;
    	var options = blockParam.options;
		for(var i in options) {
			console.log("options", options);
			if(arg == options[i][0]){
				console.log("options[i][0]", options[i][0]);
				param = options[i][1];
				break;
			}
		}
		console.log("param", param);
		
		result = param;

		return result;
    };

    p.Keyboard = function(blockParam, blockDefParam, arg) {
    	var result;
    	result = Entry.KeyboardCodeMap.prototype.keyCharToCode[arg];

    	return result;
    };

    p.Blocktext = function(blockParam, blockDefParam, arg) {
    	var result;
    	var type = blockDefParam.type;
    	var params = [];
    	var param = arg;

    	params.push(param);

		result = { type : type, params: params };
		
		return result;
    };

    p.Blocknumber = function(blockParam, blockDefParam, arg) {
    	var result;
    	var type = blockDefParam.type;
    	var params = [];
    	var param = arg;

    	params.push(param);

		result = { type : type, params: params };
		
		return result;
    };

    p.BlockTrue = function(blockParam, blockDefParam, arg) {
    	var result;
    	var type = blockDefParam.type;
    	var params = [];
    	var param = arg;

    	params.push(param);

		result = { type : type };

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

    	var targetSyntax = String("break");
    	var blockType = this.getBlockType(targetSyntax);

    	result = { type: blockType };

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

    p.BinaryExpression = function(component) {
    	console.log("BinaryExpression component", component);
    	var result;
    	var structure = {};

    	var params = [];
    	var param;
    	   
        var left = component.left;
		if(left.type) {
			param = this[left.type](left);
			if(param) 
				params.push(param);
			
			console.log("BinaryExpression param", param);
		} else {
			left = component.left;
			this(left);
		}

		var operator = component.operator;
		if(operator) {
			console.log("BinaryExpression operator", operator);
			param = String(operator);
			if(param)
				params.push(param);
		}

		var right = component.right;
		if(left.type) {
			param = this[right.type](right);
			if(param) 
				params.push(param);
			
			console.log("BinaryExpression param", param);
		} else {
			right = component.right;
			this(right);
		}


		console.log("BinaryExpression params", params);
		//result = { type: blockType, params: params };
		result = params;
    	
    	console.log("BinaryExpression result", result);
    	return result;
    };


    p.binaryTestExpression = function(expression) {
    	var result;
    	var operator = expression.operator;
    	if(operator && operator != null) {
    		console.log("operator", operator);

    		if(operator == "&&") {
    			var targetSyntax = "%1 and %3";
    		} else if(operator == "||") {
    			var targetSyntax = "%1 or %3";
    		} else {
    			var targetSyntax = "%1 %2 %3";
    		}

    		var blockType = this.getBlockType(targetSyntax);
	        //var blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(blockType);
	        //var blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(blockType);
    		//var blockParamIndex = 0;
            var params = [];
            var param;
            console.log("blockType", blockType);
            console.log("expression ex", expression);
            

            var leftExpression = expression.left;
    		if(leftExpression.left) {
    			param = this.binaryTestExpression(leftExpression);
    			if(param) {
    				params.push(param);
    			}
    		} else if(leftExpression.type) {
    			blockParamIndex = 0;
    			param = this.assemble(leftExpression, blockType);
    			params.push(param);
    		} 

    		console.log("before cv operator", operator);
    		if(operator.length != 0) {
    			console.log("opoopop", operator);
    			operator = String(operator);
    			operator = Entry.AssemblerValueConvertor.prototype.binaryOperatorValueConvertor(operator);
    			console.log("cv operator", operator);
    			param = operator;
    			params.push(param);
    		}

    		var rightExpression = expression.right;
    		if(rightExpression.left) {
    			param = this.binaryTestExpression(rightExpression);
    			if(param) {
    				params.push(param);
    			}
    		} else if(rightExpression.type) {
    			blockParamIndex = 2;
    			param = this.assemble(rightExpression);
    			console.log("rightExpression", param);
    			
    			params.push(param);
    		}

    		result = { type: blockType, params: params };
    	}

    	return result;
    };

    p.unaryTestExpression = function(expression) {
    	var value = expression.value;

    	console.log("if value", value);

    	var targetSyntax;

		//var blockType ;
    	//var blockParamsType;
    	//var blockDefParamsType;
		//var blockParamIndex = 0;
		var param;
		var params = [];
    	
		if(value == true) {
			targetSyntax = "True";

			blockType = this.getBlockType(targetSyntax);
        	//blockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(uTestBlockType);
        	//blockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(uTestBlockType);
			//blockParamIndex = 0;
			params = [];

			param = this.assemble(expression);
			
			params.push(param);
			
		} else if(value == false) {
			targetSyntax = "False";

			//uTestBlockType = this.getBlockType(targetSyntax);
        	//uTestBlockParamsType = Entry.BlockMetaExtractor.prototype.getParamsType(uTestBlockType);
        	//uTestBlockDefParamsType = Entry.BlockMetaExtractor.prototype.getDefParamsType(uTestBlockType);
			//uTestBlockParamIndex = 0;
			params = [];

			param = this.assemble(expression);
		
			params.push(param);
		} 
		return params;
    };



    p.arguments = function(component) {
    	console.log("arguments component", component);
    	var result;

    	var params = [];
    	var param;
    	
    	var arguments = component.arguments;

        for(var index in arguments) {
            if(blockParamsType[index] == "Indicator"){
            	param = null;
            	arguments.splice(index, 0, param);
            }
            else if(blockParamsType[index] == "Block") {
            	blockParamIndex = index;
            	param = this.assemble(arguments[index]);
            }
            else if(blockParamsType[index] == "Keyboard") {
            	 param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
            }
            else {	
            	var arg = arguments[index].value;

            	var isParticularBlock = Entry.ParticularBlockProcessing.prototype.isParticularBlock(blockType);
	            if(isParticularBlock) {
	            	params.push(null);
	            	params.push(param);
	            	params.push(null);
	            	break;
	            } 
            	
            }
	        params.push(param);     
        }
		return params;
	}

    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };


















































    //old
    /*(function(p){
	p.assemble = function(component) {
		console.log("component", component);
        var result;
        switch(component.type) {
            case 'ExpressionStatement' : {
            	console.log("ExpressionStatement component", component);
            	var reusult;

            	var expression = component.expression;
            	
            	if(expression) {
            		result = this.assemble(expression);
            	}

            	var operator = expression.operator;
            	if(operator && operator != null) {
            		result = this.binaryTestExpression(expression);
            	}

	        	var value = expression.value;
	        	if(value == true || value ==false) {
	        		result = this.unaryTestExpression(expression);
	        	}

                console.log("ExpressionStatement result", result);
                break;
            }
            case 'CallExpression' : {
            	console.log("CallExpression component", component);
            	var result;

            	var callee = component.callee;

            	var syntax = this.assemble(callee);
            	var type = this.getBlockType(syntax);
            	
		        console.log("CallExpression type", type);
            	
            	var paramsSchema = Entry.block[type].params;
            	console.log("paramsSchema", paramsSchema);
            	var defParams = Entry.block[type].def.params;
            	console.log("defParams", defParams);

            	var arguments = component.arguments;
            	var params = [];
            	for(var i in arguments) {
            		var argument = this.assemble(arguments[i]);
            		for(var j in paramsSchema){
	            		if(paramsSchema[j].type == "DropdownDynamic") {
	            			var options = paramsSchema[j].options;
	            			for(var k in options) {
	            				console.log("options", options);
	            				if(argument == options[k][0]){
	            					console.log("options[k][0]", options[k][0]);
	            					var param = options[k][1];
	            					break;
	            				}
	            			}
	            			console.log("param", param);
	            			params.push(param);
	            		} else if(paramsSchema[j].type == "Block") {
	            				var dParams = defParams[j].params;
	            				for(var k in dParams) {
	            					var dParam = dParams[k];
	            					
	            				}
	            				var param = {type : defParams[j].type, params: }

	            		}
	            	}
	            	
	            }



            	   
        		result = { type: blockType, params: params };

        		console.log("CallExpression result", result);
            	break;
            }
            case 'MemberExpression' : {
            	console.log("MemberExpression component", component);

            	var result;
            	var objectName = this.assemble(component.object);
            	var propertyName = this.assemble(component.property);
            	
            	result = String(objectName).concat(".").concat(propertyName);
            	
            	
            	

            	console.log("MemberExpression result", result);
		       

            	break;
            }
            case 'Literal' : {
            	console.log("Literal component", component);
            	var result;
            	
            	var value = component.value;
            	



            	result = value;
            	console.log("Literal result", result);
            	
            	break;
            }
            case 'Identifier' : {
            	console.log("Identifiler component", component);
            	var result;
            	result = component.name;

            	break;
            }
            case 'WhileStatement' : {
            	console.log("WhileStatement component", component);
            	
            	var targetSyntax = String("while True:\n$1");
		        var blockType = this.getBlockType(targetSyntax);
		        
            	var test = component.test;
                var params = [];
                var param = this.assemble(test);
            	params.push(param);

		        var statements = [];
		        var body = component.body.body;
		        
		        for(var index in body) {
		        	var b = body[index];
		        	var component = this.assemble(b);
		        	statements.push(component);
		        }

		        result = { type: blockType, statements: [statements] };
		        
		        console.log("WhileStatement result", result); 
                break;
            }
            case 'BlockStatement' : {
            	console.log("BlockStatement component", component);
            	var init = component.body[0].declarations[0].init;
		        if(init) {
		        	result = this.assemble(init);
		        	console.log("result", result);
            	}
		
            	var consequent = component.body[1].consequent;
            	var body = consequent.body[0].body;
            	body.shift();
            	var statements = [];
            	for(var index in body) {
            		console.log("body[index].type", body[index].type);
            		var component = this.assemble(body[index]);
            		statements.push(component);
            	}

            	var statementsArr = [];
            	statementsArr.push(statements);

		        result.statements = statementsArr;

		        console.log("BlockStatement result", result);
                break;
            }
        	case 'IfStatement' : {
            	console.log("IfStatement component", component);
            	var consequent = component.consequent;
		        var alternate = component.alternate;
            	var test = component.test;
            	
                var params = [];

                if(alternate == null) {
		    		var targetSyntax = String("if %1:\n$1");
		        	var blockType = this.getBlockType(targetSyntax);
		       	} else {
		       		var targetSyntax = String("if %1:\n$1\nelse:\n$2");
		        	var blockType = this.getBlockType(targetSyntax);
		       	}

		       	var operator = expression.operator;
            	if(operator && operator != null) {
            		params = this.binaryTestExpression(expression);
            	}

	        	var value = test.value;
	        	if(value == true || value ==false) {
	        		params = this.unaryTestExpression(test);
	        	}

		        var ifStatements = [];
		        var elseStatements = [];
		        if(consequent != null) {
		        	var body = consequent.body;
	            	for(var index in body) {
	            		var component = this.assemble(body[index]);
	            		ifStatements.push(component);
	            	}
	            	result = { type: blockType, params: params, statements: [ifStatements] };
	            }

            	if(alternate != null) {
            		var body = alternate.body;
	            	for(var index in body) {
	            		var component = this.assemble(body[index]);
	            		elseStatements.push(component);
	            	}
	            	result = { type: blockType, params: params, statements: [ifStatements, elseStatements] };
	            }

		        console.log("IfStatement result", result);
		        break;
        	} 
        	case 'BreakStatement' : {
            	console.log("BreakStatement component", component);

            	var targetSyntax = String("break");
            	var blockType = this.getBlockType(targetSyntax);

            	result = { type: blockType };

            	console.log("BreakStatement result", result);
            	break;
            }
            case 'UnaryExpression' : {
            	console.log("UnaryExpression component", component, blockType, paramsType, paramIndex);
            	
            	var blockType;
            	var param;
            	var arg;
            	if(component.prefix){
		        	arg = component.operator.concat(component.argument.value);
            	}

				if(paramIndex) {
	            	blockType = paramsType[paramIndex];

	            	var paramType = Entry.BlockObjectMap.prototype.getDropdownDynamicType[blockType];
	            	console.log("literal variable convertor", arg, paramType);

	            	param = Entry.AssemblerObjectConvertor.prototype.convert(paramType, arg);
	            } else {
	            	blockType = "text";
	            	param = arg;
	            }

				result = { type: type, params: [param] };

            	console.log("UnaryExpression result", result);
	           	
            	break;
            }
        }
        	
        return result;
    };

    p.binaryTestExpression = function(expression) {
    	var result;
    	var operator = expression.operator;
    	if(operator && operator != null) {
    		console.log("operator", operator);

    		if(operator == "&&") {
    			var targetSyntax = "%1 and %3";
    		} else if(operator == "||") {
    			var targetSyntax = "%1 or %3";
    		} else {
    			var targetSyntax = "%1 %2 %3";
    		}

    		var blockType = this.getBlockType(targetSyntax);
	        
            var params = [];
            var param;
            console.log("blockType", blockType);
            console.log("expression ex", expression);
            

            var leftExpression = expression.left;
    		if(leftExpression.left) {
    			param = this.binaryTestExpression(leftExpression);
    			if(param) {
    				params.push(param);
    			}
    		} else if(leftExpression.type) {
    			blockParamIndex = 0;
    			param = this.assemble(leftExpression, blockType);
    			params.push(param);
    		} 

    		console.log("before cv operator", operator);
    		if(operator.length != 0) {
    			console.log("opoopop", operator);
    			operator = String(operator);
    			operator = Entry.AssemblerValueConvertor.prototype.binaryOperatorValueConvertor(operator);
    			console.log("cv operator", operator);
    			param = operator;
    			params.push(param);
    		}

    		var rightExpression = expression.right;
    		if(rightExpression.left) {
    			param = this.binaryTestExpression(rightExpression);
    			if(param) {
    				params.push(param);
    			}
    		} else if(rightExpression.type) {
    			blockParamIndex = 2;
    			param = this.assemble(rightExpression);
    			console.log("rightExpression", param);
    			
    			params.push(param);
    		}

    		result = { type: blockType, params: params };
    	}

    	return result;
    };

    p.unaryTestExpression = function(expression) {
    	var value = expression.value;

    	console.log("if value", value);

    	var targetSyntax;

		
		var param;
		var params = [];
    	
		if(value == true) {
			targetSyntax = "True";

			blockType = this.getBlockType(targetSyntax);
        	
			params = [];

			param = this.assemble(expression);
			
			params.push(param);
			
		} else if(value == false) {
			targetSyntax = "False";

			
			params = [];

			param = this.assemble(expression);
		
			params.push(param);
		} 
		return params;
    };

    p.arguments = function(component) {
    	console.log("arguments component", component);
    	var result;

    	var params = [];
    	var param;
    	
    	var arguments = component.arguments;

        for(var index in arguments) {
            if(blockParamsType[index] == "Indicator"){
            	param = null;
            	arguments.splice(index, 0, param);
            }
            else if(blockParamsType[index] == "Block") {
            	blockParamIndex = index;
            	param = this.assemble(arguments[index]);
            }
            else if(blockParamsType[index] == "Keyboard") {
            	 param = Entry.KeyboardCodeMap.prototype.keyCharToCode[arguments[index].value];	
            }
            else {	
            	var arg = arguments[index].value;

            	var isParticularBlock = Entry.ParticularBlockProcessing.prototype.isParticularBlock(blockType);
	            if(isParticularBlock) {
	            	params.push(null);
	            	params.push(param);
	            	params.push(null);
	            	break;
	            } 
            	
            }
	        params.push(param);     
        }
		return params;
	}

    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };*/
    
})(Entry.PyBlockAssembler.prototype);