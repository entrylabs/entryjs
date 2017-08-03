/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.TextCodingError");

Entry.PyToBlockParser = function(blockSyntax) {
    this._type ="PyToBlockParser";
    this.dic = blockSyntax["#dic"];
    this.blockSyntax = blockSyntax;

    this._funcMap = {};
};

(function(p){
    p.util = Entry.TextCodingUtil;

    p.binaryOperator = {
        '==': "EQUAL",
        '>': "GREATER",
        '<': "LESS",
        '>=': "GREATER_OR_EQUAL",
        '<=': "LESS_OR_EQUAL"
    };

    p.arithmeticOperator = {
        '+': "PLUS",
        '-': "MINUS",
        '*': "MULTI",
        '/': "DIVIDE"
    };

    p.divideOperator = {
        '//': "QUOTIENT",
        '%': "MOD"
    };

    p.Programs = function(astArr) {
        try {
            return this.processPrograms(astArr);
        } catch(error) {
            var err = {};
            err.title = error.title;
            err.message = error.message;
            err.line = error.line;
            throw err;
        }
    };

    p.processPrograms = function(astArr) {
        return astArr.map(this.Node, this)
    };

    p.Program = function(component) {
        var thread = component.body.map(this.Node, this);

        if(thread[0].constructor == Array)
            return thread[0];
        else
            return thread;
    };

    p.ExpressionStatement = function(component) {
        return this.Node(component.expression);
    };

    p.CallExpression = function(component) {
        var callee = component.callee;
        var property = component.property;
        var name = property.name;
        var args = component.arguments;
        var params = [];
        var obj = this.Node(callee);

        if (callee.type === "Identifier") { // global function
            this.assert(!(obj.type === "get_variable"), "variable is not function", callee)
            this.assert(!(obj.type === "get_list"), "list is not function", callee)
            this.assert(typeof obj === "string", "error", callee);

            var blockInfo = this.blockSyntax[obj];
            this.assert(blockInfo && blockInfo.key, "function is not defined", callee);
            obj = this.Block({}, blockInfo);
        }

        if (obj.preParams) {
            component.arguments = obj.preParams.concat(component.arguments);
            delete obj.preParams;
        }

        if(component.arguments) {
            obj.params = this.Arguments(
                obj.type,
                component.arguments,
                obj.params
            )
        }

        return obj;
    };

    p.Identifier = function(component) {
        var name = component.name;

        var variable = Entry.variableContainer.getVariableByName(name);
        if (variable)
            return {
                type: "get_variable",
                params: [ variable.id_ ]
            };

        var list = Entry.variableContainer.getListByName(name);
        if (list)
            return {
                type: "get_list",
                params: [ list.id_ ]
            };
        return name;
    };

    p.VariableDeclaration = function(component) {
        return component.declarations.map(this.Node , this);
    };

    p.VariableDeclarator = function(component) {
        if(component.init && component.init.arguments) {
            return component.init.arguments.map(this.Node , this);
        }
        return [];
    };

    p.AssignmentExpression = function(component) {};

    p.Literal = function(component, paramSchema, paramDef) {
        var value = component.value;
        switch(typeof value) {
            case "boolean":
                return { type: value ? "True" : "False" }
            default:
        }
        var paramType = paramSchema ? paramSchema.type : "Block";
        switch(paramType) {
            case "DropdownDynamic":
                return this.DropdownDynamic(value, paramSchema);
            case "Block":
                if (paramDef && paramDef.type) { // process primitive block
                    return {
                        type: paramDef.type,
                        params: this.Arguments(
                            paramDef.type,
                            [ component ]
                        )
                    }
                }
                return {
                    type: 'number',
                    params : [ value ]
                }
            default:
                return value;
        }
    };

    p.MemberExpression = function(component) {
        var obj;
        var result = {};
        if (component.object.type === "Literal") { // string member
            obj = "%2";
            result.preParams = [ component.object ];
        } else
            obj = this.Node(component.object);
        if (typeof obj === "object") { // list member
            result.preParams = [ obj.params[0] ];
            obj = "%2"
        }
        var property = component.property;

        var blockInfo = this.blockSyntax[obj][property.name];

        this.Block(result, blockInfo);

        return result;
    };

    p.WhileStatement = function(component) {
        var blocks = component.body.body;
        var obj = {
            statements: [this.setParams(blocks)]
        };
        if('operator' in component.test){
            obj.type = "repeat_while_true";
            obj.params = [this.Node(component.test.argument)];
        } else {
            obj.type = "repeat_inf";
        }

        return obj;
    };

    p.BlockStatement = function(component) {
        var db = component.body.map(this.Node, this);

        if(db.constructor == Array && db[0].length) {
            if(db.length > 0){
                db[db.length-1][0].params = db[0][0][0].params;
            }

            db = db[db.length-1][0];
        }

        return db;
    };

    p.IfStatement = function(component) {
        var arr = [],
            alternate,
            blocks,
            pararms;

        if('alternate' in component && component.alternate){
            alternate = component.alternate.body.map(this.Node , this);
            blocks = component.consequent.body[0].body.body;
            alternate[0].statements.push(this.setParams(blocks));
        } else {
            alternate = {
                type : '_if',
                statements : [this.setParams(component.consequent.body)],
                params : [this.Node(component.test)]
            };
        }

        return alternate;
    };

     p.ForStatement = function(component) {
        var body = component.body.body;
        return this.Node(body[body.length-1]);
     };

    p.ForInStatement = function(component) {
        var  expression = component.body.body[0] && 'expression' in component.body.body[0] ?
                            component.body.body[0].expression.arguments.map(this.Node , this) : null;


        var obj =  {
            "type" : "repeat_basic",
            "params": [],
            "statements" : []
        }
        return obj;
    };


    p.BreakStatement = function(component) {
        return {
            type: this.blockSyntax.break.key
        }
    };

    p.UnaryExpression = function(component) {
        switch(component.operator) {
            case "!":
                return {
                    type: "boolean_not",
                    params: [
                        undefined,
                        this.Node(component.argument)
                    ]
                }
            case "-":
            case "+":
                var result = this.Node(component.argument);
                this.assert(result.type === "number", "Can't convert this operation")
                result.params = ["-" + result.params[0]];
                return result;
            default:
                throw new Error("Unary operator " + component.operator + " is not supported");
        }
    };

    p.LogicalExpression = function(component) {
        return {
            type: this.dic[component.operator],
            params: [
                this.Node(component.left),
                undefined,
                this.Node(component.right)
            ]
        }
    };

    p.BinaryExpression = function(component) {
        var operator = component.operator,
            blockType;
        if (this.binaryOperator[operator]) {
            blockType = "boolean_basic_operator";
            operator = this.binaryOperator[operator];
        } else if (this.arithmeticOperator[operator]) {
            blockType = "calc_basic";
            operator = this.arithmeticOperator[operator];
        } else if (this.divideOperator[operator]) {
            return {
                type: "quotient_and_mod",
                params: [
                    undefined,
                    this.Node(component.left),
                    undefined,
                    this.Node(component.right),
                    undefined,
                    this.divideOperator[operator]
                ]
            };
        } else {
            throw new Error("Not supported operator " + component.operator);
        }
        return {
            type: blockType,
            params: [
                this.Node(component.left),
                operator,
                this.Node(component.right)
            ]
        };
    };

    // p.UpdateExpression = function(component) {};

    p.FunctionDeclaration = function(component) {
        var blockName = this.Node(component.id);
        var blockInfo = this.blockSyntax['def '+blockName];
        var type = {};
        var threadArr = [type];
        threadArr[0].blocks = [];
        var blocks = component.body.body[0].argument.callee.object.body.body;
        var definedBlocks = this.setParams(blocks);


        if(blockInfo){
            type.type = blockInfo.key;
        }

        for(var i=0; i < definedBlocks.length; i++) {
             threadArr[0].blocks.push(definedBlocks[i]);
             threadArr.push(definedBlocks[i]);
        }

        return threadArr;
    };

    p.FunctionExpression = function(component) {
        var a =  this.Node(component.body);
        return a;

    };

    p.ReturnStatement = function(component) {
        return component.argument.arguments.map(this.Node , this );
    };

    // p.ThisExpression = function(component) {};

    // p.NewExpression = function(component) {};

    /**
     * util Function
     */

    p.Arguments = function(blockType, args, defaultParams) {
        var blockSchema = Entry.block[blockType];
        var syntax = this.PySyntax(blockSchema, defaultParams);

        var indexes = syntax.match( /%\d+/g, '');
        if (!indexes)
            return []
        var sortedArgs = defaultParams || new Array();

        for(var i=0; i < indexes.length; i++) {
            var idx = parseInt(indexes[i].substring(1))-1;
            sortedArgs[idx] = args[i];
        }
        var defParams = (blockSchema.def && blockSchema.def.params) ? blockSchema.def.params : undefined;

        var results = sortedArgs.map(function(arg, index) {
            if (arg && arg.type) {
                var paramSchema = blockSchema.params[index];
                var param = this.Node(
                    arg,
                    (arg.type === "Literal") ? paramSchema : undefined,
                    (arg.type === "Literal" && defParams) ? defParams[index] : undefined
                );

                if (paramSchema.type !== "Block" && param && param.params) // for list and variable dropdown
                    param = param.params[0];
                else if (paramSchema.type === "Block" && paramSchema.isListIndex)
                    param = this.ListIndex(param);

                return param;
            } else
                return arg; // default params
        }, this);

        return results;
    };

    p.DropdownDynamic = function(value, paramSchema) {
        switch(paramSchema.menuName) {
            case 'sprites':
            case 'spritesWithMouse':
            case 'spritesWithSelf':
            case 'collision':
                break;
            case 'pictures':
                var picture = Entry.playground.object.getPicture(value);
                return picture ? picture.id : undefined;
            case 'messages':
                break;
            case 'variables':
                var variable = Entry.variableContainer.getVariableByName(value);
                return variable ? variable.id_ : undefined;
            case 'lists':
                var list = Entry.variableContainer.getListByName(value);
                return list ? list.id_ : undefined;
            case 'scenes':
                break;
            case 'sounds':
                if (value)
                    var sound = Entry.playground.object.getSound(value);
                return sound ? sound.id : undefined;
            case 'clone':
            case 'objectSequence':
        }
    };

    p.Node = function(nodeType, node) {
        var hasType = false;
        if (typeof nodeType === "string" && nodeType !== node.type)
            throw new Error("Not expected node type");
        else if (typeof nodeType === "string")
            hasType = true;

        var args = Array.prototype.slice.call(arguments);
        if (hasType) args.shift();

        node = args[0];

        if (!this[node.type])
            throw new Error(node.type + " is not supported");
        return this[node.type].apply(this, args);
    };


    p.PySyntax = function(blockSchema, defaultParams) {
        if (defaultParams) {
            var syntaxes = blockSchema.syntax.py.filter(function(s) {
                if (!s.params)
                    return false;
                var isSame = true;
                s.params.map(function(p, index) {
                    if (p != defaultParams[index])
                        isSame = false;
                })
                return isSame;
            });
            if (syntaxes.length)
                return syntaxes[0].syntax;
        }
        var syntaxObj = blockSchema.syntax.py[0];
        return syntaxObj.syntax || syntaxObj;
    };

    p.Block = function(result, blockInfo) {
        result.type = blockInfo.key;

        if (blockInfo.params)
            result.params = blockInfo.params.concat();
        return result;
    };

    p.ListIndex = function(param) {
        if (this.isParamPrimitive(param)) { // literal
            param.params = [ param.params[0] + 1 ];
        } else if (param.type === "calc_basic" && // x - 1
                   param.params[1] === "MINUS" &&
                   this.isParamPrimitive(param.params[2]) &&
                   param.params[2].params[0] + "" === "1") {
            param = param.params[0];
        } else {
            param = {
                type: "calc_basic",
                params: [
                    param,
                    "PLUS",
                    {
                        type: "text",
                        params: [ 1 ]
                    }
                ]
            }
        }
        return param;
    };

    p.isParamPrimitive = function(param) {
        return param && (param.type === "number" || param.type === "text");
    };

    p.assert = function(data, message, errorNode) {
        if (!data)
            throw new Error(message);
    };

    p.setParams = function(params) {
        var definedBlocks = params.length ? params.map(this.Node , this) : [];
        for(var i=0; i<definedBlocks.length; i++){
            var db = definedBlocks[i];

            if(db.constructor == Array && db[0].length) {
                if(db.length > 0){
                    db[db.length-1][0].params = db[0][0][0].params;
                    definedBlocks[i] = db[db.length-1][0];
                } else {
                    definedBlocks[i] = db[0][0];
                }
            }
        }

        return definedBlocks;
    }

    /**
     * Not Supported
     */

    // p.RegExp = function(component) {};

    // p.Function = function(component) {};

    // p.EmptyStatement = function(component) {};

    // p.DebuggerStatement = function(component) {};

    // p.WithStatement = function(component) {};

    // p.LabeledStatement = function(component) {};

    // p.ContinueStatement = function(component) {};

    // p.SwitchStatement = function(component) {};

    // p.SwitchCase = function(component) {};

    // p.ThrowStatement = function(component) {};

    // p.TryStatement = function(component) {};

    // p.CatchClause = function(component) {};

    // p.DoWhileStatement = function(component) {
    //     return component.body.map(this.Node,  this);
    // };

    // p.ArrayExpression = function(component) {};

    // p.ObjectExpression = function(component) {};

    // p.Property = function(component) {};

    // p.ConditionalExpression = function(component) {};

    // p.SequenceExpression = function(component) {};

})(Entry.PyToBlockParser.prototype);
