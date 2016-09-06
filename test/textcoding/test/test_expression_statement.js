var expect = chai.expect;

describe('ExpressionStatement Suite', function() {
	var component = {};
	var result;
	before(function() {
		var expression = {};
		expression.type = "ExpressionStatement";
		expression.arguments = [];
		
		var argument = {raw: "10", type: "Literal", value: 10};
		expression.arguments.push(argument);
		
		var callee = {};
		callee.computed = false;
		
		var object = {};
		object.name = "Entry";
		object.type = "Identifier";
		callee.object = object;

		var property = {};
		property.name = "move";
		property.type = "Identifier";
		callee.property = property;

		expression.callee = callee;
		component.expression = expression;
	});

	after(function() {

	});

	beforeEach(function() {

	});

	afterEach(function() {

	});

	describe('#ExpressionStatment Unit', function() {
		it('ExpressionStatment Logic', function() {
			var structure = {};
	        var expression = component.expression;
	        
	        if(expression.type) {
	            var expressionData = CallExpression(expression);
	            
	            if(expressionData.type && expressionData.params) {
	                structure.type = expressionData.type;
	                structure.params = expressionData.params;

	                result = structure;
	            }
	            else if(expressionData.type) {
	                structure.type = expressionData.type;
	                    
	                result = structure;
	            } else {
	                structure = expressionData;

	                result = structure; 
	            }
	        } 
	        return result;
		});
	});
});