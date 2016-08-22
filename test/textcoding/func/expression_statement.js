function ExpressionStatement(component) {
    var reusult;
    var structure = {};

    var expression = component.expression;
    
    if(expression.type) {
        var expressionData = this[expression.type](expression);

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

    console.log("ExpressionStatement result", result);
    return result;
}