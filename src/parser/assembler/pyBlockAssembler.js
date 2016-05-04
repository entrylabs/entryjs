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
		        
		        for(var index in args) {
		            var arg = args[index];
		            if(typeof arg === 'string')
		            	var type = 'text';
		            else
		            	var type = 'number'
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
            	
		        result = { type: block, statements: [statements] };

		        console.log("BlockStatement result", result);
                break;
            }
        }
        return result;
    };

    p.getBlock = function(syntax) {
        return this.blockSyntax[syntax];
    };
    
})(Entry.PyBlockAssembler.prototype);