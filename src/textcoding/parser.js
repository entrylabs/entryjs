/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JsAstGenerator");
goog.require("Entry.PyAstGenerator");

goog.require("Entry.BlockToJsParser");
goog.require("Entry.BlockToPyParser");
goog.require("Entry.JsToBlockParser");
goog.require("Entry.PyToBlockParser");

goog.require("Entry.TextCodingUtil");
goog.require("Entry.TextCodingError");
goog.require("Entry.PyHint");
goog.require("Entry.Console");


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

    this._console = new Entry.Console();
};

(function(p) {
    p.setParser = function(mode, type, cm) {
        if (this._mode === mode && this._type === type)
            return;

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
                cm.setOption("mode", {name: "python", globalVars: true});
                this._execParserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
                break;
        }
    };

    p.parse = function(code, parseMode) {
        var type = this._type;
        var result = "";

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    var threads = [];
                    threads.push(code);
                    var astArray = [];

                    for(var index in threads) {
                        var thread = threads[index];
                        thread = thread.trim();
                        var ast = acorn.parse(thread);
                        astArray.push(ast);
                    }

                    result = this._execParser.Program(astArray);
                } catch (error) {
                    if (this.codeMirror) {
                        var annotation;
                        if (error instanceof SyntaxError) {
                            annotation = {
                                from: {line: error.loc.line - 1, ch: 0},
                                to: {line: error.loc.line - 1, ch: error.loc.column}
                            }
                            error.message = "문법(Syntax) 오류입니다.";
                            error.type = 1;
                        } else {
                            annotation = this.getLineNumber(error.node.start, error.node.end);
                            annotation.message = error.message;
                            annotation.severity = "converting error";
                            error.type = 2;
                        }

                        this.codeMirror.markText(
                            annotation.from, annotation.to, {
                            className: "CodeMirror-lint-mark-error",
                            __annotation: annotation,
                            clearOnEnter: true
                        });

                        var errorTitle;
                        if(error.title)
                            errorTitle = error.title;
                        else
                            errorTitle = '문법 오류';

                        var errorMsg;
                        if(error.type == 2 && error.message)
                            errorMsg = error.message;
                        else if(error.type == 2 && !error.message)
                            errorMsg = '자바스크립트 코드를 확인해주세요.';
                        else  if(error.type == 1)
                            errorMsg = '자바스크립트 문법을 확인해주세요.';

                        Entry.toast.alert(errorTitle, errorMsg);

                        var mode = {};
                        mode.boardType = Entry.Workspace.MODE_BOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_JS;
                        mode.runType = Entry.Vim.MAZE_MODE;
                        Ntry.dispatchEvent("textError", mode);
                        throw error;
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                try {
                    this._pyBlockCount = {};
                    this._pyThreadCount = 1;

                    var pyAstGenerator = new Entry.PyAstGenerator();
                    var threads = this.makeThreads(code);

                    var astArray = [];
                    var threadCount = 0;
                    var ast;
                    for(var index = 0; index < threads.length; index++) {
                        var thread = threads[index];
                        if(thread.length === 0)
                            continue;
                        thread = thread.replace(/\t/gm, '    ');
                        ast = pyAstGenerator.generate(thread);
                        if(!ast)
                            continue;
                        this._pyThreadCount = threadCount++;
                        this._pyBlockCount[threadCount] = thread.split("\n").length-1;
                        if (ast.body.length !== 0)
                            astArray.push(ast);
                    }
                    result = this._execParser.Program(astArray);
                    this._onError = false;
                    break;
                } catch(error) {
                    this._onError = true;
                    result = [];

                    if (this.codeMirror) {
                        var line;
                        if (error instanceof SyntaxError) {
                            var err = this.findSyntaxError(error, threadCount);
                            var annotation = {
                                from: {line: err.from.line-1, ch: err.from.ch},
                                to: {line: err.to.line-1, ch: err.to.ch}
                            };
                            error.type = "syntax";
                        } else {
                            var err = this.findConvError(error);
                            var annotation = {
                                from: {line: err.from.line-1, ch: err.from.ch},
                                to: {line: err.to.line-1, ch: err.to.ch}
                            };
                            error.type = "converting";
                        }

                        var option = {
                            className: "CodeMirror-lint-mark-error",
                            __annotation: annotation,
                            clearOnEnter: true,
                            inclusiveLeft: true,
                            inclusiveRigth: true,
                            clearWhenEmpty: false
                        };

                        this._marker = this.codeMirror.markText(
                            annotation.from, annotation.to, option);

                        if(error.type == "syntax") {
                            var title = error.title;
                            var message = this.makeSyntaxErrorDisplay(error.subject, error.keyword, error.message, err.from.line);
                        }
                        else if(error.type == "converting") {
                            var title = error.title;
                            var message = error.message;

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
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                Entry.getMainWS().blockMenu.renderText();
                result = "";

                if (parseMode === Entry.Parser.PARSE_BLOCK &&
                   code.type.substr(0, 5) === "func_") {
                    var funcKeysBackup = Object.keys(this._execParser._funcDefMap);
                }

                var textCode = this._execParser.Code(code, parseMode);
                if (!this._pyHinter)
                    this._pyHinter = new Entry.PyHint(this.syntax);

                if(!this._hasDeclaration)
                    this.initDeclaration();

                if(parseMode == Entry.Parser.PARSE_GENERAL) {
                    if(this.py_variableDeclaration)
                        result += this.py_variableDeclaration;

                    if(this.py_listDeclaration)
                        result += this.py_listDeclaration;

                    if(this.py_variableDeclaration || this.py_listDeclaration)
                        result += '\n';

                    var funcDefMap = this._execParser._funcDefMap;
                    var fd = "";

                    for(var f in funcDefMap) {
                        var funcDef = funcDefMap[f];
                        fd += funcDef + '\n\n';
                    }
                    result += fd;
                } else if (parseMode === Entry.Parser.PARSE_BLOCK) {
                    if (funcKeysBackup && funcKeysBackup.indexOf(code.type) < 0) {
                        result += this._execParser._funcDefMap[code.type] + '\n\n';
                    }
                }
                if(textCode)
                    result += textCode.trim();

                result = result.replace(/\t/g, "    ");
                if(this._hasDeclaration)
                    this.removeDeclaration();

                break;
        }

        return result;
    };

    p.getLineNumber = function (start, end) {
        var value = this.codeMirror.getValue();
        var lines = {
            'from' : {},
            'to' : {}
        };

        var startline = value.substring(0, start).split(/\n/gi);
        lines.from.line = startline.length - 1;
        lines.from.ch = startline[startline.length - 1].length;

        var endline = value.substring(0, end).split(/\n/gi);
        lines.to.line = endline.length - 1;
        lines.to.ch = endline[endline.length - 1].length;

        return lines;
    };

    p.mappingSyntax = function(mode) {
        if (this._syntax_cache[mode])
            return this._syntax_cache[mode];

        var types = Object.keys(Entry.block);
        var syntax = {};

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var block = Entry.block[type];

            if(mode === Entry.Vim.MAZE_MODE) {
                if(this.availableCode.indexOf(type) > -1) {
                    var syntaxArray = block.syntax;
                    if (!syntaxArray)
                        continue;

                    if(block.syntax.py)
                        continue;

                    var syntaxTemp = syntax;

                    for (var j = 0; j < syntaxArray.length; j++) {
                        var key = syntaxArray[j];
                        if (j === syntaxArray.length - 2 &&
                            typeof syntaxArray[j + 1] === "function") {
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
                }
            } else {
                if(mode === Entry.Vim.WORKSPACE_MODE) {
                    var key = type;
                    var pySyntax = null;

                    if(block.syntax && block.syntax.py)
                        pySyntax = block.syntax.py;

                    if (!pySyntax)
                        continue;

                    pySyntax.map(function(s) {
                        var result, tokens;
                        if (typeof s === "string") {
                            var bs = {};
                            result = bs;
                            tokens = s;
                            bs.key = key;
                            bs.syntax = s;
                            bs.template = s;
                        } else {
                            result = s;
                            tokens = s.syntax;
                            s.key = key;
                            if(!s.template)
                                result.template = s.syntax;
                        }

                        tokens = tokens.split('(');

                        if(tokens[1] && tokens[1].indexOf('%') > -1) {
                            if(tokens[0].length !== 0)
                                tokens = tokens[0];
                            else
                                tokens = tokens.join('(');
                        } else {
                            tokens = tokens.join('(');
                        }

                        tokens = tokens.replace("():", "");
                        tokens = tokens.replace("()", "");

                        if(s.keyOption)
                            tokens += "#" + s.keyOption;

                        tokens = tokens.split(".");

                        var newTokens = [];
                        newTokens.push(tokens.shift());
                        var restToken = tokens.join('.');
                        if(restToken != '')
                            newTokens.push(restToken);
                        tokens = newTokens;

                        var syntaxPointer = syntax;
                        for (var i = 0; i < tokens.length; i++) {
                            var syntaxKey = tokens[i];
                            if (i === tokens.length - 1) {
                                syntaxPointer[syntaxKey] = result;
                                break;
                            }
                            if (!syntaxPointer[syntaxKey]) syntaxPointer[syntaxKey] = {};
                            syntaxPointer = syntaxPointer[syntaxKey];
                        }
                    });
                }
            }
        }
        this._syntax_cache[mode] = syntax;
        return syntax;
    };

    p.setAvailableCode = function (configCode, playerCode) {
        var availableList = [];
        var blocks;
        if (configCode instanceof Entry.Code)
            blocks = configCode.getBlockList();
        else {
            configCode.forEach(function (items, i) {
                blocks.concat(items);
            });
        }

        blocks.forEach(function (item) {
            availableList.push(item.type);
        });

        blocks = [];
        if (playerCode instanceof Entry.Code)
            blocks = playerCode.getBlockList();
        else {
            playerCode.forEach(function (items, i) {
                blocks.concat(items);
            });
        }

        blocks.forEach(function(item) {
            if(availableList.indexOf(item.type) === -1)
                availableList.push(item.type);
        });

        this.availableCode = this.availableCode.concat(availableList);
    };

    p.findSyntaxError = function(error, threadCount) {
        var err = {};
        err.from = {};
        err.to = {};

        var errorLine = error.loc.line;
        var errorColumn = error.loc.column;
        var errorPos = error.pos;
        var errorRaisedAt = error.raisedAt;
        var errorMessage = error.message;

        var contents = this.codeMirror.getValue();
        var contentsArr = contents.split("\n");
        var currentThreadCount = 0;
        var currentLineCount = 0;

        for (var key in this._pyBlockCount) {
            var count = parseInt(this._pyBlockCount[key]);
            currentLineCount += count;
        }

        var targetLine = errorLine + currentLineCount + 3;
        if (targetLine > contentsArr.length)
            targetLine = contentsArr.length;
        var targetText = contentsArr[targetLine-1];

        err.from.line = targetLine;
        err.from.ch = 0;
        err.to.line = targetLine;
        err.to.ch = targetText.length;

        return err;
    };

    p.findConvError = function(error) {
        var err = {};
        err.from = {};
        err.to = {};

        var errorLine = error.line-1;
        var contents = this.codeMirror.getValue();
        var contentsArr = contents.split("\n");
        var currentLineCount = 0;
        var emptyLineCount = 0;
        var currentText;
        var targetLine;

        for (var i = 3; i < contentsArr.length; i++) {
            currentText = contentsArr[i];

            var length = currentText.trim().length;
            if(length === 0)
                emptyLineCount++;


            if(errorLine + emptyLineCount + 3 == i) {
                targetLine = i+1;
                break;
            }
        }

        if(targetLine > contentsArr.length)
            targetLine = contentsArr.length;

        err.from.line = targetLine;
        err.from.ch = 0;
        err.to.line = targetLine;
        err.to.ch = currentText.length;

        return err;
    };

    p.makeThreads = function(text) {
        var textArr = text.split("\n");
        var thread = "";
        var threads = [];

        var optText = "";
        var onEntryEvent = false;

        for(var i = 3; i < textArr.length; i++) {
            var textLine = textArr[i] + "\n";
            textLine = textLine.replace(/\t/gm, '    ');
            if(Entry.TextCodingUtil.isEntryEventFuncByFullText(textLine)) {
                textLine = this.entryEventParamConverter(textLine);
                if(optText.length !== 0) {
                    threads.push(optText);
                }

                optText = "";
                optText += textLine;
                onEntryEvent = true;
            } else {
                if(Entry.TextCodingUtil.isEntryEventFuncByFullText(textLine.trim()))
                    textLine = this.entryEventParamConverter(textLine);
                if(textLine.length == 1 && !onEntryEvent) { //empty line
                    threads.push(optText);
                    optText = "";
                }
                else if(textLine.length != 1 && textLine.charAt(0) != ' ' && onEntryEvent) { //general line
                    threads.push(optText);
                    optText = "";
                    onEntryEvent = false;
                }

                optText += textLine;
            }
        }
        threads.push(optText);
        return threads;
    };

    p.entryEventParamConverter = function(text) {
        var startIndex = text.indexOf("(");
        var endIndex = text.indexOf(")");

        var stmt = text.substring(0, startIndex);
        var param = text.substring(startIndex+1, endIndex);
        param = param.replace(/\"/g, "");

        if(param) {
            if(!Entry.Utils.isNumber(param))
                if(Entry.Utils.isNumber(param.charAt(0)))
                    param = 'num' + param;
                else
                    param = param.replace(/ /g, "_space_");
            else
                param = 'num' + param;

            if(param == 'None')
                param = 'none';
        }

        text = stmt + "(" + param + "):\n";

        return text;
    };

    p.makeSyntaxErrorDisplay = function(subject, keyword, message, line) {
        var kw;
        if(keyword) kw = "\'" + keyword + "\' ";
        else kw = '';

        return '[' + subject + ']' + ' ' + kw + ' : ' +
                    message + ' ' + '(line ' + line + ')';
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
})(Entry.Parser.prototype);
