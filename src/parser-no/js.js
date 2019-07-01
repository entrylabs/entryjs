/*
 *
 */
'use strict';

Entry.JSParser = function(syntax) {
    this.syntax = syntax;

    this.scopeChain = [];
    this.scope = null;
};

(function(p) {
    p.Program = function(node) {
        var code = [];
        var block = [];
        var body = node.body;

        //block statement

        block.push({
            type: this.syntax.Program,
        });

        var separatedBlocks = this.initScope(node);

        block = block.concat(this.BlockStatement(node));

        this.unloadScope();

        code.push(block);
        code = code.concat(separatedBlocks);
        return code;
    };

    p.Identifier = function(node, scope) {
        if (scope) return scope[node.name];
        else return this.scope[node.name];
    };

    // Statement
    p.ExpressionStatement = function(node) {
        var expression = node.expression;
        return this[expression.type](expression);
    };

    p.ForStatement = function(node) {
        var init = node.init,
            test = node.test,
            update = node.update,
            body = node.body;

        var contents = '';

        var blockType = this.syntax.ForStatement;

        if (!blockType) {
            body = this[body.type](body);

            var startVal = init.declarations[0].init.value;
            var test = test;
            var op = test.operator;
            var endVal = test.right.value;
            var updateOp = update.operator;

            var res = 0;
            if (!(updateOp == '++')) {
                var temp = startVal;
                var startVal = endVal;
                var endVal = temp;
            }

            switch (op) {
                case '<':
                    res = endVal - startVal;
                    break;

                case '<=':
                    res = endVal + 1 - startVal;
                    break;

                case '>':
                    res = startVal - endVal;
                    break;

                case '>=':
                    res = startVal + 1 - endVal;
                    break;
            }

            return this.BasicIteration(node, res, body);
        } else {
            throw {
                message: '지원하지 않는 표현식 입니다.',
                node: node,
            };
        }
    };

    p.BlockStatement = function(node) {
        var blocks = [];
        var body = node.body;

        for (var i = 0; i < body.length; i++) {
            var childNode = body[i];

            var block = this[childNode.type](childNode);
            if (!block) {
                continue;
            } else if (block.type === undefined) {
                throw {
                    message: '해당하는 블록이 없습니다.',
                    node: childNode,
                };
            } else if (block) blocks.push(block);
        }

        return blocks;
    };

    p.EmptyStatement = function(node) {
        throw {
            message: 'empty는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.DebuggerStatement = function(node) {
        throw {
            message: 'debugger는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.WithStatement = function(node) {
        var object = node.object,
            body = node.body;

        throw {
            message: 'with는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    //control flow
    p.ReturnStaement = function(node) {
        var args = node.arguments;

        throw {
            message: 'return은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.LabeledStatement = function(node) {
        var label = node.label,
            body = node.body;

        throw {
            message: 'label은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.BreakStatement = function(node) {
        var label = node.label;

        throw {
            message: 'break는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.ContinueStatement = function(node) {
        var label = node.label;

        throw {
            message: 'continue는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.IfStatement = function(node) {
        var test = node.test,
            consequent = node.consequent,
            alternate = node.alternate;

        var blockType = this.syntax.IfStatement;
        if (!blockType) {
            return this.BasicIf(node);
        } else {
            throw {
                message: 'if는 지원하지 않는 표현식 입니다.',
                node: node,
            };
        }
    };

    p.SwitchStatement = function(node) {
        var discriminant = node.discriminant,
            cases = node.cases;

        throw {
            message: 'switch는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.SwitchCase = function(node) {
        var test = node.test,
            consequent = node.consequent;

        throw {
            message: 'switch ~ case는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    //throwstatement

    p.ThrowStatement = function(node) {
        var args = node.arguments;

        throw {
            message: 'throw는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.TryStatement = function(node) {
        var block = node.block,
            handler = node.handler,
            finalizer = node.finalizer;

        throw {
            message: 'try는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.CatchClause = function(node) {
        var param = node.param,
            body = node.body;

        throw {
            message: 'catch는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.WhileStatement = function(node) {
        var test = node.test,
            body = node.body;
        var blockType = this.syntax.WhileStatement;
        body = this[body.type](body);

        if (!blockType) {
            return this.BasicWhile(node, body);
        } else {
            throw {
                message: 'while은 지원하지 않는 표현식 입니다.',
                node: node,
            };
        }
    };

    p.DoWhileStatement = function(node) {
        var body = node.body,
            test = node.test;

        throw {
            message: 'do ~ while은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.ForInStatement = function(node) {
        var left = node.left,
            right = node.right,
            body = node.body;

        throw {
            message: 'for ~ in은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    //Declaration

    p.FunctionDeclaration = function(node) {
        var id = node.id;

        var blockType = this.syntax.FunctionDeclaration;

        if (!blockType) {
            return null;
        } else {
            throw {
                message: 'function은 지원하지 않는 표현식 입니다.',
                node: node,
            };
        }
    };

    p.VariableDeclaration = function(node) {
        var declaration = node.declarations,
            kind = node.kind;

        throw {
            message: 'var은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    // Expression
    p.ThisExpression = function(node) {
        return this.scope.this;
    };

    p.ArrayExpression = function(node) {
        var elements = node.elements;

        throw {
            message: 'array는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.ObjectExpression = function(node) {
        var property = node.property;

        throw {
            message: 'object는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.Property = function(node) {
        var key = node.key,
            value = node.value,
            kind = node.kind;

        throw {
            message: 'init, get, set은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.FunctionExpression = function(node) {
        throw {
            message: 'function은 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };
    // unary expression

    p.UnaryExpression = function(node) {
        var operator = node.operator,
            prefix = node.prefix,
            args = node.argument;

        throw {
            message: operator + '은(는) 지원하지 않는 명령어 입니다.',
            node: node,
        };
    };

    p.UnaryOperator = function() {
        return ['-', '+', '!', '~', 'typeof', 'void', 'delete'];
    };

    p.updateOperator = function() {
        return ['++', '--'];
    };

    //Binary expression
    p.BinaryOperator = function() {
        return [
            '==',
            '!=',
            '===',
            '!==',
            '<',
            '<=',
            '>',
            '>=',
            '<<',
            '>>',
            '>>>',
            '+',
            '-',
            '*',
            '/',
            '%',
            ',',
            '^',
            '&',
            'in',
            'instanceof',
        ];
    };

    p.AssignmentExpression = function(node) {
        var operator = node.operator,
            left = node.left,
            right = node.right;

        throw {
            message: operator + '은(는) 지원하지 않는 명령어 입니다.',
            node: node,
        };
    };

    p.AssignmentOperator = function() {
        return [
            '=',
            '+=',
            '-=',
            '*=',
            '/=',
            '%=',
            '<<=',
            '>>=',
            '>>>=',
            ',=',
            '^=',
            '&=',
        ];
    };

    p.LogicalExpression = function(node) {
        var operator = node.operator,
            left = node.left,
            right = node.right;
        throw {
            message: operator + '은(는) 지원하지 않는 명령어 입니다.',
            node: node,
        };
    };

    p.LogicalOperator = function() {
        return ['||', '&&'];
    };

    p.MemberExpression = function(node) {
        var object = node.object,
            property = node.property,
            computed = node.computed;

        console.log(object.type);
        object = this[object.type](object);
        console.log(object);

        property = this[property.type](property, object);

        if (
            !(
                Object(object) === object &&
                Object.getPrototypeOf(object) === Object.prototype
            )
        ) {
            throw {
                message: object + '은(는) 잘못된 멤버 변수입니다.',
                node: node,
            };
        }

        var blockType = property;
        if (!blockType) {
            throw {
                message: property + '이(가) 존재하지 않습니다.',
                node: node,
            };
        }
        return blockType;
    };

    p.ConditionalExpression = function(node) {
        var test = node.test,
            alternate = node.alternate,
            consequent = node.consequent;

        throw {
            message: '지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.UpdateExpression = function(node) {
        var operator = node.operator,
            args = node.argument,
            prefix = node.prefix;

        throw {
            message: operator + '은(는) 지원하지 않는 명렁어 입니다.',
            node: node,
        };
    };

    p.CallExpression = function(node) {
        var callee = node.callee,
            args = node.arguments;
        var blockType = this[callee.type](callee);
        return {
            type: blockType,
        };
    };

    p.NewExpression = function(node) {
        throw {
            message: 'new는 지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    p.SequenceExpression = function(node) {
        var expressions = node.expressions;

        throw {
            message: '지원하지 않는 표현식 입니다.',
            node: node,
        };
    };

    // scope method
    p.initScope = function(node) {
        if (this.scope === null) {
            var scoper = function() {};
            scoper.prototype = this.syntax.Scope;
            this.scope = new scoper();
        } else {
            var scoper = function() {};
            scoper.prototype = this.scope;
            this.scope = new scoper();
        }
        this.scopeChain.push(this.scope);
        return this.scanDefinition(node);
    };

    p.unloadScope = function() {
        this.scopeChain.pop();
        if (this.scopeChain.length)
            this.scope = this.scopeChain[this.scopeChain.length - 1];
        else this.scope = null;
    };

    p.scanDefinition = function(node) {
        var body = node.body;
        var separatedBlocks = [];
        for (var i = 0; i < body.length; i++) {
            var childNode = body[i];
            if (childNode.type === 'FunctionDeclaration') {
                this.scope[childNode.id.name] = this.scope.promise;
                if (this.syntax.BasicFunction) {
                    var childBody = childNode.body;
                    separatedBlocks.push([
                        {
                            type: this.syntax.BasicFunction,
                            statements: [this[childBody.type](childBody)],
                        },
                    ]);
                }
            }
        }
        return separatedBlocks;
    };

    p.BasicFunction = function(node, body) {
        return null;
    };

    // custom node parser
    p.BasicIteration = function(node, iterCount, body) {
        var blockType = this.syntax.BasicIteration;
        if (!blockType)
            throw {
                message: '지원하지 않는 표현식 입니다.',
                node: node,
            };
        return {
            params: [iterCount],
            type: blockType,
            statements: [body],
        };
    };

    p.BasicWhile = function(node, body) {
        var raw = node.test.raw;
        if (this.syntax.BasicWhile[raw]) {
            return {
                type: this.syntax.BasicWhile[raw],
                statements: [body],
            };
        } else {
            throw {
                message: '지원하지 않는 표현식 입니다.',
                node: node.test,
            };
        }
    };

    p.BasicIf = function(node) {
        var consequent = node.consequent;
        consequent = this[consequent.type](consequent);
        try {
            var test = '';
            var operator =
                node.test.operator === '===' ? '==' : node.test.operator;

            if (
                node.test.left.type === 'Identifier' &&
                node.test.right.type === 'Literal'
            ) {
                test =
                    node.test.left.name +
                    ' ' +
                    operator +
                    ' ' +
                    node.test.right.raw;
            } else if (
                node.test.left.type === 'Literal' &&
                node.test.right.type === 'Identifier'
            ) {
                test =
                    node.test.right.name +
                    ' ' +
                    operator +
                    ' ' +
                    node.test.left.raw;
            } else {
                throw new Error();
            }

            if (this.syntax.BasicIf[test]) {
                if (
                    !Array.isArray(consequent) &&
                    typeof consequent === 'object'
                )
                    consequent = [consequent];
                return {
                    type: this.syntax.BasicIf[test],
                    statements: [consequent],
                };
            } else {
                throw new Error();
            }
        } catch (e) {
            throw {
                message: '지원하지 않는 표현식 입니다.',
                node: node.test,
            };
        }
    };
})(Entry.JSParser.prototype);
