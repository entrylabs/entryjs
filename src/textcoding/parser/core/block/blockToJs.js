/*
 *
 */
'use strict';

Entry.BlockToJsParser = function(syntax, parentParser) {
    this._type = 'BlockToJsParser';
    this.syntax = syntax;

    this._parentParser = parentParser;

    this._iterVariableCount = 0;
    this._iterVariableChunk = ['i', 'j', 'k'];
};

(function(p) {
    p.Code = function(code, parseMode) {
        this._parseMode = parseMode;
        /*if (code instanceof Entry.Thread)
            return this.Thread(code);*/
        if (code instanceof Entry.Block) return this.Block(code);

        var textCode = '',
            threads = code._data;

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            textCode += this.Thread(thread);
        }

        return textCode.trim();
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block) return this.Block(thread);
        var code = '',
            blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (i != blocks.length - 1) {
                var block = this.Block(block);
                if (this._parseMode == Entry.Parser.PARSE_GENERAL) {
                    code += block + '\n';
                } else if (this._parseMode == Entry.Parser.PARSE_SYNTAX) {
                    code = block + '\n';
                }
            } else {
                var block = this.Block(block);
                if (this._parseMode == Entry.Parser.PARSE_GENERAL) {
                    code += block;
                } else if (this._parseMode == Entry.Parser.PARSE_SYNTAX) {
                    code = block;
                }
            }
        }
        return code + '\n';
    };

    p.Block = function(block) {
        if (block._schema.syntax.js) var syntax = block._schema.syntax.js;
        else var syntax = block._schema.syntax;

        if (!syntax) return '';
        var syntaxType = syntax[0];
        var block = this[syntaxType](block);
        return block;
    };

    p.Program = function(block) {
        return '';
    };

    p.Scope = function(block) {
        var notParenthesis = false;
        var result = '';
        var paramReg = /(%.)/im;
        if (block._schema.syntax.js) {
            var syntax = block._schema.syntax.js.concat();
            notParenthesis = true;
        } else {
            var syntax = block._schema.syntax.concat();
        }

        syntax.shift();
        var syntaxTokens = syntax[0].split(paramReg);

        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        for (var i = 0; i < syntaxTokens.length; i++) {
            var syntaxToken = syntaxTokens[i];
            if (syntaxToken.length === 0 || syntaxToken === 'Scope') continue;
            if (syntaxToken === 'Judge') {
                notParenthesis = true;
                continue;
            }
            if (paramReg.test(syntaxToken)) {
                var paramIndex = syntaxToken.split('%')[1];
                var index = parseInt(paramIndex) - 1;
                if (schemaParams[index]) {
                    if (schemaParams[index].type == 'Image') {
                        index++;
                    } else if (schemaParams[index].type == 'Block') {
                        var param = this.Block(dataParams[index]);
                        result += param;
                    } else {
                        result += this[schemaParams[index].type](
                            dataParams[index],
                            schemaParams[index]
                        );
                    }
                }
            } else {
                result += syntaxToken;
            }
        }

        if (result.charAt(result.length - 1) == '#') {
            notParenthesis = true;
            result = result.substring(0, result.length - 1);
            result = result.trim();
        }

        if (!notParenthesis) result += '();';

        result = Entry.TextCodingUtil.jsAdjustSyntax(block, result);

        return result;

        //return syntax.splice(1, syntax.length - 1).join(".") + "();\n";
    };

    p.BasicFunction = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var code =
            'function promise() {\n' + this.indent(statementCode).trim() + '}';
        return code;
    };

    p.BasicIteration = function(block) {
        var iterateNumber = block.params[0];
        var iterVariable = this.publishIterateVariable();
        var statementCode = this.Thread(block.statements[0]);
        this.unpublishIterateVariable();
        var code =
            'for (var ' +
            iterVariable +
            ' = 0; ' +
            iterVariable +
            ' < ' +
            iterateNumber +
            '; ' +
            iterVariable +
            '++) {\n' +
            this.indent(statementCode) +
            '}';
        return code;
    };

    p.BasicIf = function(block) {
        var code;
        if (block.data.statements.length == 2) {
            var statementCode1 = this.Thread(block.statements[0]);
            var statementCode2 = this.Thread(block.statements[1]);
            var syntax = block._schema.syntax.concat();

            var paramBlock = block.data.params[0];

            if (paramBlock && paramBlock.data.type == 'True') {
                var param = syntax[1];
            } else {
                if (paramBlock === undefined) var param = syntax[1];
                else var param = this.Block(paramBlock);
            }

            code =
                'if (' +
                param +
                ') {\n' +
                this.indent(statementCode1) +
                '}\n' +
                'else {\n' +
                this.indent(statementCode2) +
                '}\n';
        } else {
            var statementCode1 = this.Thread(block.statements[0]);
            var syntax = block._schema.syntax.concat();

            var paramBlock = block.data.params[0];

            if (paramBlock && paramBlock.data.type == 'True') {
                var param = syntax[1];
            } else {
                if (paramBlock === undefined) var param = syntax[1];
                else var param = this.Block(paramBlock);
            }

            code =
                'if (' + param + ') {\n' + this.indent(statementCode1) + '}\n';
        }

        return code;
    };

    p.BasicWhile = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var syntax = block._schema.syntax.concat();
        var code =
            'while (' +
            syntax[1] +
            ') {\n' +
            this.indent(statementCode) +
            '}\n';
        return code;
    };

    p.indent = function(textCode) {
        var result = '';
        var indentedCode = textCode.split('\n');

        for (var i in indentedCode) {
            var item = indentedCode[i];

            if (item.length == 0) continue;

            result += '\t' + item + '\n';
        }

        return result;
    };

    // iterate variable
    p.publishIterateVariable = function() {
        var iterVariable = '';
        var iterVariableCount = this._iterVariableCount;
        do {
            var chunk = this._iterVariableChunk[iterVariableCount % 3];
            iterVariable = chunk + iterVariable;
            iterVariableCount = parseInt(iterVariableCount / 3) - 1;
            if (iterVariableCount === 0)
                iterVariable = this._iterVariableChunk[0] + iterVariable;
        } while (iterVariableCount > 0);
        this._iterVariableCount++;
        return iterVariable;
    };

    p.unpublishIterateVariable = function() {
        if (this._iterVariableCount) this._iterVariableCount--;
    };

    p.Dropdown = function(dataParam) {
        var value = dataParam;
        if (value == 'OBSTACLE') value = 'stone';
        else if (value == 'ITEM') value = value.toLowerCase();
        else if (value == 'WALL') value = value.toLowerCase();

        var result = "'" + value + "'";

        return result;
    };

    p.TextInput = function(dataParam) {
        var result = dataParam;

        return result;
    };

    p.DropdownDynamic = function(dataParam, schemaParam) {
        var object = Entry.playground.object;

        if (dataParam == 'null') {
            dataParam = 'none';
        } else {
            dataParam = Entry.TextCodingUtil.dropdownDynamicValueConvertor(
                dataParam,
                schemaParam
            );
        }

        return dataParam;
    };

    p.searchSyntax = function(datum) {
        if (datum instanceof Entry.BlockView) datum = datum.block;
        return this._parentParser.parse(datum, Entry.Parser.PARSE_SYNTAX);
    };

    p.getAssistScope = function() {
        if (this._assist) return this._assist;

        var assist = {};
        for (var key in this.syntax.Scope) {
            if (key.indexOf('%') < 0)
                assist[key + '();\n'] = this.syntax.Scope[key];
        }
        this._assist = assist;
        return assist;
    };
})(Entry.BlockToJsParser.prototype);
