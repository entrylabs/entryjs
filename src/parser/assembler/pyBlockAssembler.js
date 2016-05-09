/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockAssembler");

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
            	var args = [];
            	var params = [];
            	var arguments = unit.expression.arguments;

            	console.log("arguments", arguments);
     
     			if(arguments && arguments.length){
		            for(var index in arguments) {
		                var arg = arguments[index];
		                var a;
		                if(arg.type == 'UnaryExpression') {
		                	if(arg.prefix)
		                		a = arg.operator.concat(arg.argument.value)
		                } else if(arg.type == 'Literal') {
		                	a = arg.value;
		                }

		                args.push(a);
		            }
        		}

        		console.log("arg", arg);
		        
		        for(var index in args) {
		            var arg = args[index];
		            if(typeof arg === 'string')
		            	var type = 'text';
		            else
		            	var type = 'number';

		            console.log("type", type);
		            var param = {type: type, params: [arg]};
		            params.push(param);
		        }

		        var callee = unit.expression.callee;
            	var targetSyntax = String(callee.object.name).concat(".").concat(callee.property.name);
		        var block = this.getBlock(targetSyntax);
                
                result = { type: block, params: params };
                console.log("ExpressionStatement result", result);
                break;
            }
            case 'WhileStatement' : {
            	console.log("WhileStatement unit", unit);
            	var test = unit.test;
                if(test.type == 'Literal') {
		            if(test.value)
		            	var targetSyntax = String("while True:\n$1\n");
		        }

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

            	console.log("block", block);
            	
            	var args = [];
            	var params = [];
            	var arguments = unit.body[0].declarations[0].init.arguments;

            	if(arguments && arguments.length){
		            for(var index in arguments) {
		                var arg = arguments[index];
		                var a;
		                if(arg.type == 'UnaryExpression') {
		                	if(arg.prefix)
		                		a = arg.operator.concat(arg.argument.value)
		                } else if(arg.type == 'Literal') {
		                	a = arg.value;
		                }

		                args.push(a);
		            }
        		}

        		console.log("arg", arg);
		        
		        for(var index in args) {
		            var arg = args[index];
		            if(typeof arg === 'string')
		            	var type = 'text';
		            else
		            	var type = 'number';

		            console.log("type", type);
		            var param = {type: type, params: [arg]};
		            params.push(param);
		        }

            	var consequent = unit.body[1].consequent;
            	console.log("consequent", consequent);
            	var body = consequent.body[0].body;
            	console.log("body", body);
            	body.shift();
            	var statements = [];
            	for(var index in body) {
            		console.log("body[index]", body[index]);
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
                if(test.type == 'Literal') {
		            if(test.value)
		            	var targetSyntax = String("if %1:\n$1\n");
		        }
		        var block = this.getBlock(targetSyntax);
		        console.log("block", block);

		        var consequent = unit.consequent;
		        var body = consequent.body;

		        var statements = [];
            	for(var index in body) {
            		var unit = this.assemble(body[index]);
            		statements.push(unit);
            	}

		        result = { type: block, params: params, statements: [statements] };

		        console.log("IfStatement result", result);

        	} 
        	case 'BreakStatement' : {
            	console.log("BreakStatement unit", unit);

            	var targetSyntax = String("break\n");

            	var block = this.getBlock(targetSyntax);

            	console.log("block", block);

            	result = { type: block };

            	console.log("BreakStatement result", result);
            }
        }
        	
        return result;
    };

    p.getBlock = function(syntax) {
        return this.blockSyntax[syntax];
    };
    
})(Entry.PyBlockAssembler.prototype);