/*
 *
 */
'use strict';

require('./util/console');
require('./parser/core/text/pyToBlock');
require('./parser/core/text/jsToBlock');
require('./parser/core/block/blockToPy');
require('./parser/core/block/blockToJs');

Entry.Parser = function(mode, type, cm, syntax) {
    this._mode = mode; // maze ai workspace
    this.syntax = {}; //for maze
    this.codeMirror = cm;

    this._lang = syntax;
    this._type = type;
    this.availableCode = [];
    this._syntax_cache = {};
    this._pyThreadCount = 1;
    this._pyBlockCount = {};

    Entry.Parser.PARSE_GENERAL = 1;
    Entry.Parser.PARSE_SYNTAX = 2;
    Entry.Parser.PARSE_VARIABLE = 3;
    Entry.Parser.PARSE_BLOCK = 4;

    this._onError = false;
    this._onRunError = false;

    if (Entry.type === 'workspace') {
        this._console = new Entry.Console();

        const hwFunc = function() {
            const _mode = this._mode;
            if (_mode === null) {
                return;
            }
            this.setAvailableCode();

            delete this._syntax_cache[_mode];
            this.syntax = this.mappingSyntax(_mode);
            this._pyHinter && this._pyHinter.setSyntax(this.syntax);
        }.bind(this);

        //after hw code generated update syntax for this
        //and update python hinter syntax
        Entry.addEventListener('hwCodeGenerated', hwFunc);
    }
};

(function(p) {
    const SYNTAX_MAP = {
        'Hamster.LINE_TRACER_MODE_OFF': '0',
        'Hamster.LINE_TRACER_MODE_BLACK_LEFT_SENSOR': '1',
        'Hamster.LINE_TRACER_MODE_BLACK_RIGHT_SENSOR': '2',
        'Hamster.LINE_TRACER_MODE_BLACK_BOTH_SENSORS': '3',
        'Hamster.LINE_TRACER_MODE_BLACK_TURN_LEFT': '4',
        'Hamster.LINE_TRACER_MODE_BLACK_TURN_RIGHT': '5',
        'Hamster.LINE_TRACER_MODE_BLACK_MOVE_FORWARD': '6',
        'Hamster.LINE_TRACER_MODE_BLACK_UTURN': '7',
        'Hamster.LINE_TRACER_MODE_WHITE_LEFT_SENSOR': '8',
        'Hamster.LINE_TRACER_MODE_WHITE_RIGHT_SENSOR': '9',
        'Hamster.LINE_TRACER_MODE_WHITE_BOTH_SENSORS': '10',
        'Hamster.LINE_TRACER_MODE_WHITE_TURN_LEFT': '11',
        'Hamster.LINE_TRACER_MODE_WHITE_TURN_RIGHT': '12',
        'Hamster.LINE_TRACER_MODE_WHITE_MOVE_FORWARD': '13',
        'Hamster.LINE_TRACER_MODE_WHITE_UTURN': '14',

        'Hamster.LED_OFF': '0',
        'Hamster.LED_BLUE': '1',
        'Hamster.LED_GREEN': '2',
        'Hamster.LED_CYAN': '3',
        'Hamster.LED_RED': '4',
        'Hamster.LED_MAGENTA': '5',
        'Hamster.LED_YELLOW': '6',
        'Hamster.LED_WHITE': '7',

        'Hamster.IO_MODE_ANALOG_INPUT': '0',
        'Hamster.IO_MODE_DIGITAL_INPUT': '1',
        'Hamster.IO_MODE_SERVO_OUTPUT': '8',
        'Hamster.IO_MODE_PWM_OUTPUT': '9',
        'Hamster.IO_MODE_DIGITAL_OUTPUT': '10',
    };

    p.setParser = function(mode, type, cm) {
        if (this._mode === mode && this._type === type) {
            return;
        }

        this._mode = mode;
        this._type = type;
        this._cm = cm;

        this.syntax = this.mappingSyntax(mode);

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                this._execParser = new Entry.JsToBlockParser(this.syntax, this);
                this._execParserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                this._execParser = new Entry.PyToBlockParser(this.syntax);
                this._execParserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                this._execParser = new Entry.BlockToJsParser(this.syntax, this);
                this._execParserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                this._execParser = new Entry.BlockToPyParser(this.syntax);
                cm && cm.setOption('mode', { name: 'python', globalVars: true });
                this._execParserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
                break;
        }
    };

    p.parse = function(code, parseMode) {
        const type = this._type;
        let result = '';

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    const threads = [];
                    threads.push(code);
                    const astArray = [];

                    for (const index in threads) {
                        let thread = threads[index];
                        thread = thread.trim();
                        const ast = acorn.parse(thread);
                        astArray.push(ast);
                    }

                    result = this._execParser.Program(astArray);
                } catch (error) {
                    if (this.codeMirror) {
                        let annotation;
                        if (error instanceof SyntaxError) {
                            annotation = {
                                from: { line: error.loc.line - 1, ch: 0 },
                                to: { line: error.loc.line - 1, ch: error.loc.column },
                            };
                            error.message = '문법(Syntax) 오류입니다.';
                            error.type = 1;
                        } else {
                            const { node = {} } = error || {};
                            const { start = 0, end = 0 } = node;
                            annotation = this.getLineNumber(start, end);
                            annotation.message = error.message;
                            annotation.severity = 'converting error';
                            error.type = 2;
                        }

                        this.codeMirror.markText(annotation.from, annotation.to, {
                            className: 'CodeMirror-lint-mark-error',
                            __annotation: annotation,
                            clearOnEnter: true,
                        });

                        let errorTitle;
                        if (error.title) {
                            errorTitle = error.title;
                        } else {
                            errorTitle = '문법 오류';
                        }

                        let errorMsg;
                        if (error.type == 2 && error.message) {
                            errorMsg = error.message;
                        } else if (error.type == 2 && !error.message) {
                            errorMsg = '자바스크립트 코드를 확인해주세요.';
                        } else if (error.type == 1) {
                            errorMsg = '자바스크립트 문법을 확인해주세요.';
                        }

                        Entry.toast.alert(errorTitle, errorMsg);

                        const mode = {};
                        mode.boardType = Entry.Workspace.MODE_BOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_JS;
                        mode.runType = Entry.Vim.MAZE_MODE;
                        Ntry.dispatchEvent('textError', mode);
                        throw error;
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                try {
                    this._pyBlockCount = {};
                    this._pyThreadCount = 1;

                    const pyAstGenerator = new Entry.PyAstGenerator();
                    const threads = this.makeThreads(code);

                    const astArray = [];
                    let threadCount = 0;
                    let ast;
                    for (let index = 0; index < threads.length; index++) {
                        let thread = threads[index];
                        if (thread.length === 0) {
                            continue;
                        }
                        thread = thread.replace(/\t/gm, '    ');
                        ast = pyAstGenerator.generate(thread);
                        if (!ast) {
                            continue;
                        }
                        this._pyThreadCount = threadCount++;
                        this._pyBlockCount[threadCount] = thread.split('\n').length - 1;
                        if (ast.body.length !== 0) {
                            astArray.push(ast);
                        }
                    }
                    result = this._execParser.Programs(astArray);
                    this._onError = false;
                    break;
                } catch (error) {
                    this._onError = true;
                    result = [];

                    let annotation;
                    if (this.codeMirror) {
                        let err;
                        if (error instanceof SyntaxError) {
                            err = this.findSyntaxError(error);
                            if (err) {
                                annotation = {
                                    from: { line: err.from.line - 1, ch: err.from.ch },
                                    to: { line: err.to.line - 1, ch: err.to.ch },
                                };
                            }

                            error.type = 'syntax';
                        } else {
                            err = error.line;
                            if (err) {
                                // 3 == 최초주석 및 import 구문
                                annotation = {
                                    from: { line: err.start.line + 3, ch: err.start.column },
                                    to: { line: err.end.line + 3, ch: err.end.column },
                                };
                            }

                            error.type = 'converting';
                        }

                        if (annotation) {
                            const option = {
                                className: 'CodeMirror-lint-mark-error',
                                __annotation: annotation,
                                clearOnEnter: true,
                                inclusiveLeft: true,
                                inclusiveRight: true,
                                clearWhenEmpty: false,
                            };

                            this._marker = this.codeMirror.markText(
                                annotation.from,
                                annotation.to,
                                option
                            );
                        }

                        let title = '';
                        let message = '';
                        if (error.type === 'syntax') {
                            title = error.title;
                            message = this.makeSyntaxErrorDisplay(
                                error.subject,
                                error.keyword,
                                error.message,
                                err.from.line
                            );
                        } else if (error.type === 'converting') {
                            title = error.title;
                            message = error.message;
                        }

                        Entry.toast.alert(title, message);
                        throw error;
                    }
                }

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                var textCode = this._execParser.Code(code, parseMode);
                result = textCode;
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY: {
                try {
                    Entry.getMainWS().blockMenu.renderText();
                    result = '';
                    let funcKeysBackup;

                    if (
                        parseMode === Entry.Parser.PARSE_BLOCK &&
                        code.type.substr(0, 5) === 'func_'
                    ) {
                        funcKeysBackup = Object.keys(this._execParser.funcDefMap);
                    }

                    const textCode = this._execParser.Code(code, parseMode);
                    if (!this._pyHinter) {
                        this._pyHinter = new Entry.PyHint(this.syntax);
                    }

                    if (!this._hasDeclaration) {
                        this.initDeclaration();
                    }

                    if (parseMode === Entry.Parser.PARSE_GENERAL) {
                        if (this.py_variableDeclaration) {
                            result += this.py_variableDeclaration;
                        }

                        if (this.py_listDeclaration) {
                            result += this.py_listDeclaration;
                        }

                        if (this.py_variableDeclaration || this.py_listDeclaration) {
                            result += '\n';
                        }

                        // Global Comment Append
                        const globalCommentList = this._execParser.globalCommentList;
                        if (globalCommentList.length > 0) {
                            result += `${globalCommentList.join('\n')}\n\n`;
                        }

                        // function Declaration
                        const funcDefMap = this._execParser.funcDefMap;
                        let fd = '';
                        for (const funcKey in funcDefMap) {
                            fd += `${funcDefMap[funcKey]}\n\n`;
                        }

                        result += fd;
                    } else if (parseMode === Entry.Parser.PARSE_BLOCK) {
                        if (funcKeysBackup && funcKeysBackup.indexOf(code.type) < 0) {
                            result += `${this._execParser.funcDefMap[code.type]}\n\n`;
                        }
                    }
                    if (textCode) {
                        result += textCode.trim();
                    }

                    result = result.replace(/\t/g, '    ');
                    if (this._hasDeclaration) {
                        this.removeDeclaration();
                    }
                } catch (e) {
                    console.error(e);
                    if (e.block) {
                        Entry.toast.alert(
                            Lang.TextCoding.title_converting,
                            Lang.TextCoding.alert_legacy_no_support
                        );
                    }
                    throw e;
                }

                break;
            }
        }

        return result;
    };

    p.getLineNumber = function(start, end) {
        const value = this.codeMirror.getValue();
        const lines = {
            from: {},
            to: {},
        };

        const startline = value.substring(0, start).split(/\n/gi);
        lines.from.line = startline.length - 1;
        lines.from.ch = startline[startline.length - 1].length;

        const endline = value.substring(0, end).split(/\n/gi);
        lines.to.line = endline.length - 1;
        lines.to.ch = endline[endline.length - 1].length;

        return lines;
    };

    p.mappingSyntax = function(mode) {
        const that = this;
        if (this._syntax_cache[mode]) {
            return this._syntax_cache[mode];
        }

        const types = Object.keys(Entry.block);
        const availables = this.setAvailableCode();
        const syntax = {};
        if (mode === Entry.Vim.WORKSPACE_MODE) {
            syntax['#dic'] = {};
        }

        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            //if (Entry.type !== 'invisible' && (availables && (availables.indexOf(type) < 0)))
            //continue;

            if (mode === Entry.Vim.MAZE_MODE && availables && availables.indexOf(type) < 0) {
                continue;
            }

            const block = Entry.block[type];

            if (mode === Entry.Vim.MAZE_MODE) {
                const syntaxArray = block.syntax;
                if (!syntaxArray) {
                    continue;
                }

                if (block.syntax.py) {
                    continue;
                }

                let syntaxTemp = syntax;

                for (let j = 0; j < syntaxArray.length; j++) {
                    var key = syntaxArray[j];
                    if (j === syntaxArray.length - 2 && typeof syntaxArray[j + 1] === 'function') {
                        syntaxTemp[key] = syntaxArray[j + 1];
                        break;
                    }
                    if (!syntaxTemp[key]) {
                        syntaxTemp[key] = {};
                    }
                    if (j === syntaxArray.length - 1) {
                        syntaxTemp[key] = type;
                    } else {
                        syntaxTemp = syntaxTemp[key];
                    }
                }
            } else if (mode === Entry.Vim.WORKSPACE_MODE) {
                var key = type;
                const pySyntax = block.syntax && block.syntax.py;

                if (!pySyntax) {
                    continue;
                }

                pySyntax.map((s, i) => {
                    let result;
                    let tokens;

                    if (typeof s === 'string') {
                        result = {};
                        tokens = s;
                        result.key = key;
                        result.syntax = s;
                        result.template = s;
                    } else {
                        result = s;
                        tokens = s.syntax;
                        s.key = key;
                        if (!s.template) {
                            result.template = s.syntax;
                        }
                        if (s.dic) {
                            syntax['#dic'][s.dic] = key;
                        }
                    }
                    if (i === 0) {
                        result.isDefault = true;
                    }
                    if (!tokens) {
                        return;
                    }
                    tokens = tokens.split('(');

                    if (/%/.test(tokens[1])) {
                        if (tokens[0].length) {
                            tokens = tokens[0];
                        } else {
                            tokens = tokens.join('(');
                        }
                    } else {
                        tokens = tokens.join('(');
                    }

                    tokens = tokens.replace(/\(\):?/, '');

                    if (s.keyOption) {
                        tokens += `#${s.keyOption}`;
                    }

                    tokens = tokens.split('.');

                    const newTokens = [];
                    newTokens.push(tokens.shift());
                    const restToken = tokens.join('.');
                    if (restToken !== '') {
                        newTokens.push(restToken);
                    }
                    tokens = newTokens;

                    let syntaxPointer = syntax;
                    for (var i = 0; i < tokens.length; i++) {
                        const syntaxKey = tokens[i];
                        if (i === tokens.length - 1) {
                            syntaxPointer[syntaxKey] = result;
                            const anotherKey = that._getAnotherSyntaxKey(syntaxKey);
                            if (anotherKey) {
                                syntaxPointer[anotherKey] = result;
                            }
                            break;
                        }
                        if (!syntaxPointer[syntaxKey]) {
                            syntaxPointer[syntaxKey] = {};
                        }
                        syntaxPointer = syntaxPointer[syntaxKey];
                    }
                });
            }
        }
        this._syntax_cache[mode] = syntax;
        return syntax;
    };

    p.setAvailableCode = function() {
        const WS = Entry.getMainWS();
        if (!WS) {
            return;
        }

        const blockMenu = WS.blockMenu;
        const board = WS.board;
        const container = Entry.conatainer;

        let blocks = [];

        if (blockMenu && blockMenu.code) {
            blocks = blocks.concat(blockMenu.code.getBlockList());
        }

        if (container) {
            blocks = blocks.concat(container.getBlockList());
        } else if (!container && board && board.code) {
            blocks = blocks.concat(board.code.getBlockList());
        }

        blocks = blocks.map((b) => b.type);
        blocks = blocks.filter((b, index) => blocks.indexOf(b) === index);

        this.availableCode = blocks;

        return blocks;
    };

    p.findSyntaxError = function(error, threadCount) {
        const loc = error.loc;
        loc.line = loc.line + 2;
        return {
            from: { line: loc.line, ch: loc.column },
            to: { line: loc.line, ch: loc.column + error.tokLen },
        };
    };

    p.makeThreads = function(text) {
        const textArr = text.split('\n');
        const threads = [];

        let optText = '';
        let onEntryEvent = false;

        let startLine = 0;

        // # 엔트리봇 ~ import Entry 제외
        for (let i = 4; i < textArr.length; i++) {
            const textLine = `${textArr[i]}\n`;

            if (textLine.trim().startsWith('#')) {
                threads.push(`${textLine.trim()}\n`);
            } else if (Entry.TextCodingUtil.isEntryEventFuncByFullText(textLine.trim())) {
                if (optText.length !== 0) {
                    threads.push(makeLine(optText));
                    startLine = i - 2;
                }

                optText = '';
                optText += textLine;
                onEntryEvent = true;
            } else {
                if (textLine.length === 1 && !onEntryEvent) {
                    //empty line
                    threads.push(makeLine(optText));
                    startLine = i - 2;
                    optText = '';
                } else if (textLine.length !== 1 && textLine.charAt(0) !== ' ' && onEntryEvent) {
                    //general line
                    threads.push(makeLine(optText));
                    startLine = i - 2;
                    optText = '';
                    onEntryEvent = false;
                }
                optText += textLine;
            }
        }

        threads.push(makeLine(optText));
        function makeLine(text) {
            return new Array(startLine + 1).join('\n') + text;
        }
        return threads;
    };

    p.makeSyntaxErrorDisplay = function(subject, keyword, message, line) {
        let kw;
        if (keyword) {
            kw = `'${keyword}' `;
        } else {
            kw = '';
        }

        return `[${subject}]` + ` ${kw} : ${message} ` + `(line ${line})`;
    };

    p.initDeclaration = function() {
        this.py_variableDeclaration = Entry.TextCodingUtil.generateVariablesDeclaration();
        this.py_listDeclaration = Entry.TextCodingUtil.generateListsDeclaration();
        this._hasDeclaration = true;
    };

    p.removeDeclaration = function() {
        this.py_variableDeclaration = null;
        this.py_listDeclaration = null;
    };

    p._getAnotherSyntaxKey = function(syntax) {
        let replaced = false;
        for (const key in SYNTAX_MAP) {
            if (syntax.indexOf(key) > -1) {
                replaced = true;
                syntax = syntax.replace(new RegExp(key, 'gm'), SYNTAX_MAP[key]);
            }
        }

        if (replaced) {
            return syntax;
        }
    };
})(Entry.Parser.prototype);
