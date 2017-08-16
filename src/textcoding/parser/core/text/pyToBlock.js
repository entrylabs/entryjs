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

    this._funcParamMap = {};
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
        this._funcParamMap = {};
        this._funcMap = {};
        try {
            var result;
            var astArrBody = astArr[0].body;
            var hasVariable = astArrBody &&
                              astArrBody[0] &&
                              astArrBody[0].type === 'ExpressionStatement' &&
                              astArrBody[0].expression.type === "AssignmentExpression";

            if(hasVariable) {
                var variableArr = this.getVariables(astArr[0]);
                astArr.splice(0,1);
                var contentArr = this.processPrograms(astArr);

                result = variableArr.concat(contentArr);
            }  else {

                result = astArr.map(this.Node, this)
            }
            return result.filter(function(t) {
                return t.length > 0
            });
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

        var thread = component.body.map(this.Node ,this);

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

        if (typeof obj === "string" && callee.type === "MemberExpression" && this[obj])
            return this[obj](component);

        if (callee.type === "Identifier") { // global function
            this.assert(!(obj.type === "get_variable"), "variable is not function", callee)
            this.assert(!(obj.type === "get_list"), "list is not function", callee)

            if (this._funcMap[obj]) {
                var funcType = this._funcMap[obj][args.length];
                obj = {
                    type: "func_" + funcType
                }
            } else if (this[obj]) {// special block like len
                return this[obj](component);
            } else {
                var blockInfo = this.blockSyntax[obj];
                this.assert(blockInfo && blockInfo.key, "function is not defined", callee);
                obj = this.Block({}, blockInfo);
            }
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

        if (this._funcParamMap[name])
            return {
                type: "stringParam_" + this._funcParamMap[name]
            };

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
        var results = component.declarations.map(this.Node, this);

        return results;
    };

    p.VariableDeclarator = function(component) {
        if(component.init && component.init.arguments) {
            return component.init.arguments.map(this.Node , this);
        } else {
            return [];
        }
    };

    p.AssignmentExpression = function(component) {
        var result = { params: [] };
        var leftVar;
        switch(component.left.type) {
            case "MemberExpression":
                result.type = 'change_value_list_index';
                leftVar = Entry.variableContainer.getListByName(component.left.object.name)
                this.assert(leftVar, "list not exist", component.left);
                result.params.push(leftVar.id_);
                result.params.push(
                    this.ListIndex(this.Node(component.left.property.arguments[1]))
                );
                break;
            case "Identifier":
                result.type = 'set_variable';
                leftVar = Entry.variableContainer.getVariableByName(component.left.name)
                this.assert(leftVar, "variable not exist", component.left);
                result.params.push(leftVar.id_);
                break;
            default:
                this.assert(false, "left hand must be list or variable", component.left)
        }

        var rightHand = this.Node(component.right);

        switch (component.operator) {
            case "+=":
                result.type = 'change_variable';
                break;
            case "-=": // TODO
            case "/=": // TODO
            case "*=": // TODO
            case "=":
        }
        result.params.push(rightHand);
        return result;
    };

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
                    params : [ value + "" ]
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
        } else {
            obj = this.Node(component.object);
        }

        if (typeof obj === "object") { // list member
            result.preParams = [ obj.params[0] ];
            obj = "%2"
        }
        var property = component.property;
        var blockInfo;

        if (property.type === "CallExpression") {
            return this.SubscriptIndex(component);
        } else if (property.name === "_pySlice") {
            blockInfo = this.blockSyntax["%2[%4:%6]"];
        } else {
            if (this.blockSyntax[obj] && this.blockSyntax[obj][property.name])
                blockInfo = this.blockSyntax[obj][property.name];
            else
                return obj + "." + property.name; // block syntax not exist. pass to special
        }

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
            if(db.length > 0)
                db[db.length-1][0].params.push(db[0][0][0]);

            db = db[db.length-1][0];
        }

        return db;
    };

    p.IfStatement = function(component) {
        var arr = [],
            alternate,
            blocks,
            pararms;

        var tempAlt = component.alternate;
        var isForState = tempAlt &&
                         tempAlt.body &&
                         tempAlt.body[0] &&
                         'type' in tempAlt.body[0] &&
                         tempAlt.body[0].type === 'ForInStatement';
        var consequent = component.consequent;

        if(isForState){
            alternate = component.alternate.body.map(this.Node , this);
            blocks = component.consequent.body[0].body.body;
            alternate[0].statements.push(this.setParams(blocks));

        } else if(!('alternate' in component) || !component.alternate){
            alternate = {
                type : '_if',
                statements : [this.setParams(component.consequent.body)],
                params : [this.Node(component.test)]
            };
        } else {


            var consequents = component.consequent ? component.consequent.body.map(this.Node , this) : [];
            var alternates = component.alternate ? component.alternate.body.map(this.Node , this) : [];
            alternate = {
                type : 'if_else',
                statements : [ consequents, alternates ],
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
                            this.Node(component.body.body[0].expression) : null;
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
        var funcName = this.Node(component.id);
        var startBlock = {};
        var blocks = component.body.body[0].argument.callee.object.body.body;

        var blockInfo = this.blockSyntax['def '+ funcName];
        var threadArr;
        if(blockInfo){ // event block
            startBlock.type = blockInfo.key;
            var definedBlocks = this.setParams(blocks);

            threadArr = [startBlock];
            threadArr[0].blocks = [];

            definedBlocks.unshift(startBlock)
            return definedBlocks;
        } else {
            this.createFunction(component, funcName, blocks);
            return [];
        }
    };

    p.FunctionExpression = function(component) {
        var a =  this.Node(component.body);
        return a;

    };

    p.ReturnStatement = function(component) {
        return component.argument.arguments.map(this.Node , this );
    };

    // p.ThisExpression = function(component) {};

    p.NewExpression = function(component) {
        var callee = component.callee;
        var args = component.arguments;

        return this.Node(callee)

    };

    p.SubscriptIndex = function(component) {
        var obj = this.Node(component.object);
        var blockInfo;

        if (this.isParamPrimitive(obj)) { // list
            blockInfo = this.blockSyntax["%2[%4]#char_at"];
        } else { // string
            this.assert(obj.type === "get_list", "Subscript index can be use to array", component);
            blockInfo = this.blockSyntax["%2[%4]"];
        }
        var result = this.Block({}, blockInfo);
        result.params = this.Arguments(
            result.type,
            component.property.arguments
        );
        return result;
    };

    /**
     * util Function
     */

    p.Arguments = function(blockType, args, defaultParams) {
        var defParams, sortedArgs, blockSchema;
        blockSchema = Entry.block[blockType];
        if ((blockType && blockType.substr(0, 5) === "func_") || !blockSchema) {// function block, etc
            sortedArgs = args;
        } else {
            var syntax = this.PySyntax(blockSchema, defaultParams);
            var indexes = syntax.match( /%\d+/g, '');
            if (!indexes)
                return []
            sortedArgs = defaultParams || new Array();

            for(var i=0; i < indexes.length; i++) {
                var idx = parseInt(indexes[i].substring(1))-1;
                sortedArgs[idx] = args[i];
            }
            defParams = (blockSchema.def && blockSchema.def.params) ? blockSchema.def.params : undefined;
        }
        var results = sortedArgs.map(function(arg, index) {
            if (arg && arg.type) {
                var paramSchema = blockSchema ? blockSchema.params[index] : null;
                var param = this.Node(
                    arg,
                    (arg.type === "Literal") ? paramSchema : undefined,
                    (arg.type === "Literal" && defParams) ? defParams[index] : undefined
                );

                if (!paramSchema)
                    param = param;
                else if (paramSchema.type !== "Block" && param && param.params) // for list and variable dropdown
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
                    var object;

                    if(value == 'self') {
                        object = value;
                    } else {
                        var objects = Entry.container.objects_.filter(function(obj){
                            return obj.name === value;
                        });

                        object = objects[0].id;
                    }

                return object;

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
            param.params = [ Number(param.params[0]) + 1 ];
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
            } else if(db.constructor == Array && db[0].constructor == Object){
                definedBlocks[i] = db[0];
            }
        }

        return definedBlocks;
    }

    p.getVariables = function(program) {
        var nodes = program.body;

        nodes.map(function(n){
            n = n.expression;
            var left = n.left;
            var right = n.right;
            var name;
            var object = false;
            var type = 'variables_';
            var id = Entry.generateHash();
            var obj = {
                variableType : 'variable',
                name : '',
                visible : true,
                object : {}
            };
            if (n.operator != '=')
                return;
            
            if('name' in n.left) {
                name = left.name;
            }  else {
                object = Entry.getMainWS().data.selectedBoard.data.code.object;
                name = left.property.name;
                object = object.id;
            }

            if(right.type === "NewExpression" && right.callee.property.name == 'list'){
                type = 'lists_';
                var temp = right.arguments.map(this.Node , this);
               
                temp = temp.map(function(m){
                    if(m.constructor === Object && 'params' in m)
                        return {data : m.params[0]};
                    else 
                        return {data : m};
                });
                obj.array = temp;
            }

            var functionType =  'add'+ type[0].toUpperCase() + type.slice(1,type.length-2);
            var existVar = this.variableExist(name , type);

            if(existVar) {
                if(type == 'lists_'){
                    existVar.array_ = obj.array;
                    return;
                }
                existVar.value_ = right.value;
                return;
            }


            obj.variableType = type.slice(0,length-2);
            obj.name = name;
            obj.object = object;

            Entry.variableContainer[functionType](obj);

        } , this);


        return [];
    };

    p.variableExist = function(name , type){
        var variables_ = Entry.variableContainer[type];
        variables_ = variables_.map(function(v){
            return v.name_;
        });

        if(variables_.indexOf(name)  > -1)
            return Entry.variableContainer[type][variables_.indexOf(name)];
        return false;
    }

    /**
     * Special Blocks
     */

    p.len = function(component) {
        var param = this.Node(component.arguments[0]);

        if (this.isParamPrimitive(param)) { // string len
            return {
                type: "length_of_string",
                params: [ undefined, param ]
            }
        } else { // array len
            return {
                type: "length_of_list",
                params: [ undefined, param.params[0] ]
            }
        }
    };

    p["Hamster.line_tracer_mode"] = function(component) {
        return this.Special(component, "Hamster", "line_tracer_mode");
    };

    p["Hamster.io_mode_a"] = function(component) {
        return this.Special(component, "Hamster", "io_mode_a");
    };

    p["Hamster.io_mode_b"] = function(component) {
        return this.Special(component, "Hamster", "io_mode_b");
    };

    p["Hamster.io_modes"] = function(component) {
        return this.Special(component, "Hamster", "io_modes");
    };

    p["Hamster.leds"] = function(component) {
        return this.Special(component, "Hamster", "leds");
    };

    p["Hamster.left_led"] = function(component) {
        return this.Special(component, "Hamster", "left_led");
    };

    p["Hamster.right_led"] = function(component) {
        return this.Special(component, "Hamster", "right_led");
    };

    p.Special = function(component, name, key) {
        var result = {};
        var param = this.Node(component.arguments[0]);
        if (this.isParamPrimitive(param))
            param = param.params[0];
        var blockInfo = this.blockSyntax[name][
            key + "(" + param + ")"
        ];

        this.Block(result, blockInfo);
        return result;
    };

    p.createFunction = function(component, funcName, blocks) {
        var params = component.arguments ? component.arguments.map(this.Node, this) : [];
        var functions = Entry.variableContainer.functions_;

        this.assert(!this.blockSyntax[funcName], "function name duplicate")
        var funcId = Entry.generateHash();
        for (var key in functions) {
            var funcSchema = Entry.block["func_" + key];
            if ((funcSchema.params.length === params.length + 1) &&
                (funcSchema.template.trim().split(" ")[0].trim() === funcName)) {
                funcId = key;
                break;
            }
        }

        var funcParamPointer = {
            type: "function_field_label",
            params: [
                funcName
            ]
        }
        var func = {
            id: funcId,
            content: [[{
                type: "function_create",
                params: [
                    funcParamPointer
                ]
            }]]
        };

        if (!this._funcMap[funcName])
            this._funcMap[funcName] = {};
        this._funcMap[funcName][params.length] = func.id;

        while (params.length) { // generate param
            var param = params.shift();
            var paramId = Entry.generateHash();
            var newFuncParam = {
                type: "function_field_string",
                params: [
                    {
                        type: "stringParam_" + paramId
                    }
                ]
            }
            this._funcParamMap[param] = paramId;
            funcParamPointer.params.push(newFuncParam);
            funcParamPointer = newFuncParam;
        }

        var definedBlocks = this.setParams(blocks); // function content
        this._funcParamMap = {};

        func.content[0] = func.content[0].concat(definedBlocks);

        func.content = JSON.stringify(func.content);
        if (functions[funcId]) {
            var targetFunc = functions[funcId];
            targetFunc.content = new Entry.Code(func.content);
            targetFunc.generateBlock(true);
        } else {
            Entry.variableContainer.setFunctions([func]);
        }
    };

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

    p.searchSyntax = function(datum) { //legacy
        var schema;
        var appliedParams;
        var doNotCheckParams = false;

        if (datum instanceof Entry.BlockView) {
            schema = datum.block._schema;
            appliedParams = datum.block.data.params;
        } else if (datum instanceof Entry.Block) {
            schema = datum._schema;
            appliedParams = datum.params;
        } else {
            schema = datum;
            doNotCheckParams = true;
        }

        if (schema && schema.syntax) {
            var syntaxes = schema.syntax.py.concat();
            while (syntaxes.length) {
                var isFail = false;
                var syntax = syntaxes.shift();
                if (typeof syntax === "string")
                    return {syntax: syntax, template: syntax};
                if (syntax.params) {
                    for (var i = 0; i < syntax.params.length; i++) {
                        if (doNotCheckParams !== true && syntax.params[i] &&
                            syntax.params[i] !== appliedParams[i]) {
                            isFail = true;
                            break;
                        }
                    }
                }
                if (!syntax.template)
                    syntax.template = syntax.syntax;
                if (isFail) {
                    continue;
                }
                return syntax;
            }
        }
        return null;
    };

})(Entry.PyToBlockParser.prototype);
