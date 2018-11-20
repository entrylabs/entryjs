/*
 *
 */
'use strict';

Entry.BlockToPyParser = class {
    constructor() {
        this._type = 'BlockToPyParser';
        this._funcParamMap = new Entry.Map();
        this._funcDefMap = {};

        this._variableDeclaration = null;
        this._listDeclaration = null;
        this._forIdCharIndex = 0;
    }

    Code(code, parseMode) {
        this._parseMode = parseMode;
        if (!code) return;
        if (code instanceof Entry.Thread) return this.Thread(code);
        if (code instanceof Entry.Block) return this.Block(code);

        const resultTextCode = [];
        const threads = code.getThreads();

        for (let i = 0; i < threads.length; i++) {
            this._forIdCharIndex = 0;
            const thread = threads[i];

            resultTextCode.push(this.Thread(thread));
        }

        return resultTextCode.join('\n').trim();
    }

    Thread(thread) {
        if (thread instanceof Entry.Block) return this.Block(thread);
        const blocks = thread.getBlocks();

        if (this._parseMode === Entry.Parser.PARSE_SYNTAX) {
            return blocks
                .map((block) => { return this.Block(block) + '\n'; })
                .trim();
        } else if (this._parseMode === Entry.Parser.PARSE_GENERAL) {
            let rootResult = '';
            let contentResult = '';

            blocks.forEach((block, index) => {
                if (index === 0 && Entry.TextCodingUtil.isEventBlock(block)) {
                    rootResult = this.Block(block) + '\n';
                } else {
                    contentResult += this.Block(block) + '\n';
                }
            });

            if (rootResult !== '') {
                contentResult = Entry.TextCodingUtil.indent(contentResult);
            }

            return (rootResult + contentResult).trim() + '\n';
        }
    }

    Block(block) {
        if (!block || !(block instanceof Entry.Block)) return '';
        !block._schema && block.loadSchema();

        let result = '';
        const results = [];
        let syntaxObj, syntax;

        syntaxObj = this.searchSyntax(block);
        if (syntaxObj) {
            syntax = syntaxObj.syntax;
        }

        // User Function
        if (this.isFunc(block)) {
            if (!this._funcDefMap[block.data.type]) {
                this._rootFuncId = block.data.type;
                this._funcDefMap[block.data.type] = this.makeFuncDef(block, this._hasRootFunc);
                this._hasRootFunc = false;
            }
            if (this.isRegisteredFunc(block))
                syntax = this.makeFuncSyntax(block);
            if (this._parseMode === Entry.Parser.PARSE_SYNTAX) return syntax;
        } else if (this.isFuncStmtParam(block)) {
            results.push(block.data.type);
        }

        if (!syntax && !this.isFuncStmtParam(block)) {
            const error = new Error();
            error.block = block;
            throw error;
        }

        const _blockTokens = syntax.split(/[\r\n]/);

        const _blockParamRegex = /%\d/gim;
        const _blockStatementRegex = /\$\d/gim;

        _blockTokens.forEach((token) => {
            const paramsTemplate = token.match(_blockParamRegex);
            const statements = token.match(_blockStatementRegex);

            // %1 과 같은 템플릿 값이 있는 경우
            if (paramsTemplate) {
                const paramsValue = paramsTemplate.map((template) => {
                    const [, templateIndex] = template.split('%');

                    if (templateIndex) {
                        return this._getParamsValue(templateIndex, block);
                    }
                    return '';
                });

                results.push(
                    token.replace(/%(\d)/gim, (_, groupMatch) => {
                        return paramsValue[groupMatch - 1];
                    })
                );
            }

            // $1 과 같이 statement 를 포함하는 경우
            if (statements) {
                statements.forEach((_, index) => {
                    results.push(Entry.TextCodingUtil.indent(
                        this.Thread(block.statements[index])
                    ));
                });
            }

            if (!statements && !paramsTemplate) {
                results.push(token);
            }
        });

/*        const blockReg = /(%.)/im;
        const statementReg = /(\$.)/im;
        const blockTokens = syntax.split(blockReg);

        for (let i = 0; i < blockTokens.length; i++) {
            let blockToken = blockTokens[i];
            if (blockToken.length === 0) continue;
            if (blockToken === '% ') {
                result += blockToken;
                continue;
            }
            if (blockReg.test(blockToken)) {
                const blockParamIndex = blockToken.split('%')[1];
                result += this._getParamsValue(blockParamIndex, block);
            } else if (statementReg.test(blockToken)) {
                const statements = blockToken.split(statementReg);
                for (let j = 0; j < statements.length; j++) {
                    const statementToken = statements[j];
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        const index = Number(statementToken.split('$')[1]) - 1;
                        result += Entry.TextCodingUtil.indent(
                            this.Thread(block.statements[index])
                        );
                    } else result += statementToken;
                }
            } else {
                TODO 여기를 아직 처리안했음, 반복의 반복 & substring
                if (syntaxObj && syntaxObj.key === 'repeat_basic' && i === 0) {
                    const forStmtTokens = blockToken.split(' ');
                    forStmtTokens[1] = Entry.TextCodingUtil.generateForStmtIndex(this._forIdCharIndex++);
                    blockToken = forStmtTokens.join(' ');
                }
                if (syntaxObj && syntaxObj.key === 'substring' && i === 2 && Entry.Utils.isNumber(result)) {
                    result = '"' + result + '"';
                }

                result += blockToken;
            }
        }*/

        return results.join('\n');
    }

    // templateIndex 는 1부터 시작한다.
    _getParamsValue(templateIndex, block) {
        const index = Number(templateIndex) - 1;
        const schemaParams = block._schema.params;
        const dataParams = block.data.params;

        let result = '';
        const syntaxObj = this.searchSyntax(block);
        const textParams = syntaxObj.textParams && syntaxObj.textParams;

        if (schemaParams[index]) {
            switch (schemaParams[index].type) {
                case 'Indicator': {
                    break;
                }
                case 'Block': {
                    let param = this.Block(dataParams[index]).trim();
                    const funcParam = this._funcParamMap.get(param);
                    const textParam = textParams && textParams[index];

                    if (funcParam) {
                        param = funcParam;
                    } else {
                        const funcParamTokens = param.split('_');
                        const prefix = funcParamTokens[0];
                        if (funcParamTokens.length === 2) {
                            if (prefix === 'stringParam') {
                                param = 'string_param';
                            } else if (prefix === 'booleanParam') {
                                param = 'boolean_param';
                            }
                        }
                    }

                    if (textParam && textParam.paramType === 'index') {
                        if (Entry.Utils.isNumber(param)) param = param - 1;
                        else {
                            const tokens = param.split('+');
                            if (tokens[tokens.length - 1] === ' 1)') {
                                delete tokens[tokens.length - 1];
                                param = tokens.join('+');
                                param = param.substring(1, param.length - 2);
                            } else {
                                param += ' - 1';
                            }
                        }
                    }

                    if (textParam && textParam.paramType === 'integer') {
                        if (Entry.Utils.isNumber(param) && Entry.isFloat(param)) {
                            result = result.replace('randint', 'uniform');
                        }
                    }

                    result += param;
                    break;
                }
                default: {
                    const textParam = textParams && textParams[index];

                    const param = this['Field' + schemaParams[index].type](dataParams[index], textParam);

                    // 필드 블록이 아닌 블록에 내재된 파라미터 처리
                    if (!Entry.Utils.isNumber(param) && block.type === 'when_some_key_pressed') {
                        result += '"' + param + '"';
                    } else {
                        result += param;
                    }

                    if (syntaxObj && syntaxObj.key === 'repeat_while_true') {
                        result = Entry.TextCodingUtil.assembleRepeatWhileTrueBlock(block, result);
                    }

                    break;
                }
            }
        }
        return result;
    }

    searchSyntax(datum) {
        let schema;
        let appliedParams;
        if (datum instanceof Entry.BlockView) {
            schema = datum.block._schema;
            appliedParams = datum.block.data.params;
        } else if (datum instanceof Entry.Block) {
            schema = datum._schema;
            appliedParams = datum.params;
        } else schema = datum;

        if (schema && schema.syntax) {
            const syntaxes = schema.syntax.py.concat();
            while (syntaxes.length) {
                let isFail = false;
                const syntax = syntaxes.shift();
                if (typeof syntax === 'string')
                    return { syntax: syntax, template: syntax };

                if (syntax.params) {
                    for (let i = 0; i < syntax.params.length; i++) {
                        if (
                            syntax.params[i] &&
                            syntax.params[i] !== appliedParams[i]
                        ) {
                            isFail = true;
                            break;
                        }
                    }
                }
                if (!syntax.template) syntax.template = syntax.syntax;
                if (isFail) {
                    continue;
                }
                return syntax;
            }
        }
        return null;
    }

    FieldAngle(dataParam, textParam) {
        if (textParam && textParam.converter)
            dataParam = textParam.converter(dataParam);

        return dataParam;
    }

    FieldColor(dataParam, textParam) {
        if (textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);
        return dataParam;
    }

    FieldDropdown(dataParam, textParam) {
        if (typeof dataParam == 'object') return 'None'.replace(/\"/gm, '');

        if (textParam && textParam.converter && textParam.options) {
            var options = textParam.options;
            for (var i in options) {
                var key = options[i][0];
                var value = options[i][1];
                if (dataParam == value) {
                    return (dataParam = textParam.converter(key, value));
                }
            }
            dataParam = textParam.converter(dataParam, dataParam);
        }

        return dataParam;
    }

    FieldDropdownDynamic(dataParam, textParam) {
        if (typeof dataParam == 'object') return 'None'.replace(/\"/gm, '');

        if (textParam && textParam.converter && textParam.options) {
            var options = textParam.options;
            for (var i in options) {
                var key = options[i][0];
                var value = options[i][1];
                if (dataParam == value) {
                    var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                        value,
                        textParam.menuName
                    );
                    if (name) key = name;
                    return (dataParam = textParam.converter(key, value));
                }
            }
            var value = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                dataParam,
                textParam.menuName
            );
            if (value) dataParam = textParam.converter(value, value);
            else dataParam = textParam.converter(dataParam, dataParam);

            var reg = /None/;
            if (reg.test(dataParam)) {
                dataParam = dataParam.replace(/\"/gm, '');
            }
        }

        return dataParam;
    }

    FieldImage(dataParam, textParam) {
        if (textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    }

    FieldIndicator(dataParam, textParam) {
        return dataParam;
    }

    FieldKeyboard(dataParam, textParam) {
        var reg = /None/;
        if (reg.test(dataParam)) {
            return dataParam.replace(/\"/gm, '');
        }

        var map = Entry.KeyboardCode.map;
        for (var key in map) {
            var value = map[key];
            if (value == dataParam) {
                dataParam = key;
                break;
            }
        }

        if (textParam && textParam.converter)
            dataParam = textParam.converter(dataParam, null);

        dataParam = dataParam.toLowerCase();
        return dataParam;
    }

    FieldOutput(dataParam, textParam) {
        return dataParam;
    }

    FieldText(dataParam, textParam) {
        if (textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    }

    FieldTextInput(dataParam, textParam) {
        if (typeof dataParam != 'number') {
            dataParam = dataParam.replace('\t', '    ');
            var spaces = dataParam.split(/ /);

            if (dataParam.length == spaces.length - 1)
                dataParam = '"()"'.replace('()', dataParam);
        }

        if (textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    }

    FieldNumber(dataParam, textParam) {
        if (textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    }

    isFunc(block) {
        if (!block || !block.data || !block.data.type) return false;

        const tokens = block.data.type.split('_');
        const prefix = tokens[0];

        return prefix === 'func';
    }

    /**
     * 워크스페이스에 실제로 등록되어있는 함수인지 확인한다.
     * @param block
     * @returns {boolean}
     */
    isRegisteredFunc(block) {
        const tokens = block.data.type.split('_');
        const funcId = tokens[1];
        return !!Entry.variableContainer.functions_[funcId];
    }

    isFuncStmtParam(block) {
        if (!block || !block.data || !block.data.type) return false;
        const blockType = block.data.type;
        const tokens = blockType.split('_');
        const prefix = tokens[0];

        return prefix === 'stringParam' || prefix === 'booleanParam';
    }

    makeFuncSyntax(funcBlock) {
        var syntax = '';
        if (funcBlock && funcBlock._schema)
            if (funcBlock._schema.template)
                var schemaTemplate = funcBlock._schema.template.trim();
            else if (funcBlock._schema.params)
                var schemaParams = funcBlock._schema.params;
            else if (funcBlock && !funcBlock._schema) {
                if (this._hasRootFunc) {
                    var rootFunc = Entry.block[this._rootFuncId];
                    var schemaParams = rootFunc.block.params;
                    var schemaTemplate = rootFunc.block.template;
                }
            }

        var paramReg = /(%.)/im;
        if (schemaTemplate)
            var funcTokens = schemaTemplate.trim().split(paramReg);

        var funcName = '';
        var funcParams = '';

        for (var f in funcTokens) {
            var funcToken = funcTokens[f].trim();
            if (paramReg.test(funcToken)) {
                var num = funcToken.split('%')[1];
                if (num == 1) continue;
                else num -= 1;
                var index = num - 1;
                if (
                    schemaParams &&
                    schemaParams[index] &&
                    schemaParams[index].type == 'Indicator'
                )
                    continue;

                funcParams += '%'.concat(num).concat(', ');
            } else {
                var funcTokenArr = funcToken.split(' ');
                funcName += funcTokenArr.join('__');
            }
        }

        var index = funcParams.lastIndexOf(',');
        funcParams = funcParams.substring(0, index);

        syntax = funcName
        .trim()
        .concat('(')
        .concat(funcParams.trim())
        .concat(')');

        return syntax;
    }

    makeFuncDef(funcBlock, exp) {
        if (!this.isRegisteredFunc(funcBlock)){
            return;
        }

        let result = '';
        const func = this.getFuncInfo(funcBlock);

        if (func){
            result += func.name;
        } else {
            return;
        }

        let paramResult = '';
        if (func.params && func.params.length !== 0) {
            paramResult = func.params.join(', ').trim();
        }
        result = result
            .concat('(')
            .concat(paramResult)
            .concat(')');

        if (exp) {
            return result;
        } else {
            result = 'def ' + result;
        }

        this._hasRootFunc = true;

        result = result.concat(':\n');
        if (func.statements && func.statements.length) {
            let stmtResult = '';
            for (let s in func.statements) {
                const block = func.statements[s];

                if (this.getFuncInfo(block)) {
                    stmtResult += this.makeFuncDef(block, true).concat('\n');
                } else {
                    stmtResult += this.Block(block).concat('\n');
                }
            }
            result += Entry.TextCodingUtil.indent(stmtResult).concat('\n');
        }

        return result.trim();
    }

    getFuncInfo(funcBlock) {
        const result = {};
        const funcId = funcBlock.getFuncId();

        const func = funcId && Entry.variableContainer.getFunction(funcId);
        if (!func) return null;

        const funcName = func.block.template
            .split(/%\d/)[0]
            .trim()
            .split(' ')
            .join('__');

        Entry.TextCodingUtil.initQueue();

        const funcContents = func.content
            .getEventMap('funcDef')[0]
            .getThread()
            .getBlocks();
        const defBlock = funcContents.shift();

        Entry.TextCodingUtil.gatherFuncDefParam(defBlock.getParam(0));

        const that = this;
        const funcParams = [];

        if (!this._hasRootFunc) {
            const funcDefParams = [];
            let param;
            while ((param = Entry.TextCodingUtil._funcParamQ.dequeue()))
                funcDefParams.push(param);

            funcDefParams.forEach(function(value, index) {
                if (/(string|boolean)Param/.test(value)) {
                    index += 1;
                    const name = 'param' + index;
                    funcParams.push(name);
                    that._funcParamMap.put(value, name);
                }
            });
        } else {
            funcBlock.params
                .filter(function(p) {
                    return p instanceof Entry.Block;
                })
                .forEach(function(p) {
                    let paramText = that.Block(p);
                    if (!paramText) return;
                    paramText = that._funcParamMap.get(paramText) || paramText;
                    funcParams.push(paramText);
                });
        }

        Entry.TextCodingUtil.clearQueue();

        if (funcName) result.name = funcName;
        if (funcParams.length !== 0) result.params = funcParams;
        if (funcContents.length !== 0) result.statements = funcContents;

        return result;
    }
};
