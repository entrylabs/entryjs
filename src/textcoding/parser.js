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
goog.require("Entry.Console")


Entry.Parser = function(mode, type, cm, syntax) {
    this._mode = mode; // maze ai workspace
    this.syntax = {}; //for maze
    this.codeMirror = cm;

    this._lang = syntax || "blockPy";
    this._type = type;
    this.availableCode = [];
    this._syntax_cache = {};
    this._pyThreadCount = 1;
    this._pyBlockCount = {};

    Entry.Parser.PARSE_GENERAL = 1;
    Entry.Parser.PARSE_SYNTAX = 2;
    Entry.Parser.PARSE_VARIABLE = 3;

    this._onError = false;
    this._onRunError = false;
    /*Entry.Parser.BLOCK_SKELETON_BASIC = "basic";
    Entry.Parser.BLOCK_SKELETON_BASIC_LOOP = "basic_loop";
    Entry.Parser.BLOCK_SKELETON_BASIC_DOUBLE_LOOP = "basic_double_loop";*/

    /*this.syntax.js = this.mappingSyntaxJs(mode);
    this.syntax.py = this.mappingSyntaxPy(mode);*/

    this._console = new Entry.Console();

    switch (this._lang) {
        case "js":
            this._execParser = new Entry.JsToBlockParser(this.syntax);

            var syntax = this.syntax;
            var assistScope = {};

            for(var key in syntax.Scope ) {
                assistScope[key + '();\n'] = syntax.Scope[key];
            }

            if('BasicIf' in syntax) {
                assistScope['front'] = 'BasicIf';
            }
            break;
        case "py":
            this._execParser = new Entry.PyToBlockParser(this.syntax);

            var syntax = this.syntax;
            var assistScope = {};

            for(var key in syntax.Scope ) {
                assistScope[key + '();\n'] = syntax.Scope[key];
            }

            if('BasicIf' in syntax) {
                assistScope['front'] = 'BasicIf';
            }
            break;

        case "blockJs":
            this._execParser = new Entry.BlockToJsParser(this.syntax, this);
            var syntax = this.syntax;
            break;

        case "blockPy":
            this._execParser = new Entry.BlockToPyParser(this.syntax);
            var syntax = this.syntax;
            break;
    }
};

(function(p) {
    p.setParser = function(mode, type, cm) {
        if (this._mode === mode && this._type === type)
            return;
        console.log("setParser this._type", this._type, "type", type);
        this._mode = mode;
        this._type = type;
        this._cm = cm;

        /*if (mode === Entry.Vim.MAZE_MODE) {
            this._stageId = Number(Ntry.configManager.getConfig('stageId'));
            var configCode = NtryData.config[this._stageId].availableCode;
            var playerCode = NtryData.player[this._stageId].code;
            this.setAvailableCode(configCode, playerCode);
        }*/

        this.syntax = this.mappingSyntax(mode);

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                this._execParser = new Entry.JsToBlockParser(this.syntax);

                this._execParserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;

                break;

            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                this._execParser = new Entry.PyToBlockParser(this.syntax);

                this._execParserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                this._execParser = new Entry.BlockToJsParser(this.syntax, this);

                var syntax = this.syntax;
                var assistScope = {};

                for(var key in syntax.Scope) {
                    assistScope[key + '();\n'] = syntax.Scope[key];
                }

                //if('BasicIf' in syntax) {
                    //assistScope['front'] = 'BasicIf';
                //}

                cm.on("keydown", function (cm, event) {
                    var keyCode = event.keyCode;
                    if ((keyCode >= 65 && keyCode <= 95) ||
                        keyCode == 167 || (!event.shiftKey && keyCode == 190)) {
                        CodeMirror.showHint(cm, null, {
                            completeSingle: false, globalScope:assistScope
                        });
                    }
                });

                this._execParserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                this._execParser = new Entry.BlockToPyParser(this.syntax);
                cm.setOption("mode", {name: "python", globalVars: true});
                //cm.markText({line: 0, ch: 0}, {line: 3, ch: 0}, {readOnly: true});
                this._execParserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;

                break;
        }
    };

    p.parse = function(code, parseMode) {
        console.log("this.syntax", this.syntax);
        console.log("this._syntax_cache", this._syntax_cache);
        var type = this._type;
        console.log("parser type", type, "this._type", this._type);
        var result = "";

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    //var astTree = acorn.parse(code);
                    //var threads = code.split('\n\n');
                    //console.log("code", code);
                    var threads = [];
                    threads.push(code);
                    var astArray = [];

                    for(var index in threads) {
                        var thread = threads[index];
                        thread = thread.trim();
                        var ast = acorn.parse(thread);
                        //if(ast.type == "Program" && ast.body.length != 0)
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
                            /*annotation = {
                                from: {line: error.loc.line - 1, ch: error.loc.column - 2},
                                to: {line: error.loc.line - 1, ch: error.loc.column + 1}
                            }*/
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

                        if(error.title)
                            var errorTitle = error.title;
                        else
                            var errorTitle = '문법 오류';

                        if(error.type == 2 && error.message)
                            var errorMsg = error.message;
                        else if(error.type == 2 && !error.message)
                            var errorMsg = '자바스크립트 코드를 확인해주세요.';
                        else  if(error.type == 1)
                            var errorMsg = '자바스크립트 문법을 확인해주세요.';

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
                    //console.log("threads", threads);

                    var astArray = [];
                    var threadCount = 0;
                    var ast;
                    for(var index = 0; index < threads.length; index++) {
                        var thread = threads[index];
                        //console.log("thread", thread, "thread.length", thread.length);
                        if(thread.length == 0)
                            continue;
                        thread = thread.replace(/\t/gm, '    ');
                        ast = pyAstGenerator.generate(thread);
                        if(!ast)
                            continue;
                        this._pyThreadCount = threadCount++;
                        this._pyBlockCount[threadCount] = thread.split("\n").length-1;
                        if(ast.body.length != 0)
                            astArray.push(ast);
                    }
                    result = this._execParser.Program(astArray);
                    this._onError = false;
                    //this._execParser._variableMap.clear();
                    break;
                } catch(error) {
                    this._onError = true;
                    result = [];
                    /*var ws = Entry.getMainWS();
                    if(ws){
                        this._onError = true;
                        var sObject = ws.vimBoard._currentObject;
                        var sScene = ws.vimBoard._currentScene;
                        Entry.container.selectObject(sObject.id, sScene);  

                        var board = ws.board;
                        if(board) board.code.clear();
                    }*/

                    if (this.codeMirror) {
                        var line;
                        console.log("main error", error);
                        if (error instanceof SyntaxError) {
                            var err = this.findSyntaxError(error, threadCount);
                            var annotation = {
                                from: {line: err.from.line-1, ch: err.from.ch},
                                to: {line: err.to.line-1, ch: err.to.ch}
                            }
                            error.type = "syntax";
                        } else {
                            var err = this.findConvError(error);
                            var annotation = {
                                from: {line: err.from.line-1, ch: err.from.ch},
                                to: {line: err.to.line-1, ch: err.to.ch}
                            }
                            error.type = "converting"
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
                            console.log("error.keyword", error.keyword);
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
                /*var textArr = textCode.match(/(.*{.*[\S|\s]+?}|.+)/g);
                ////console.log("textCode", textCode);
                if(Array.isArray(textArr)) {
                    result = textArr.reduce(function (prev, current, index) {
                        var temp = '';
                        if(index === 1) {
                            prev = prev + '\n';
                        }
                        if(current.indexOf('function') > -1) {
                            temp = current + prev;
                        } else {
                            temp = prev + current;
                        }
                        return temp + '\n';
                    });
                } else {
                    result = '';
                }*/

                console.log("js textcode", textCode);
                result = textCode;

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                Entry.getMainWS().blockMenu.renderText();
                result = "";
                var textCode = this._execParser.Code(code, parseMode);
                if (!this._pyHinter)
                    this._pyHinter = new Entry.PyHint(this.syntax);


                if(parseMode == Entry.Parser.PARSE_GENERAL) {
                    if(!this._onError && !this._onRunError) {
                      if(!this.py_variableDeclaration) {
                            var vd = Entry.TextCodingUtil.generateVariablesDeclaration();
                            this.py_variableDeclaration = vd;
                            if(vd)
                                result += vd;
                        }

                        if(!this.py_listDeclaration) {
                            var ld = Entry.TextCodingUtil.generateListsDeclaration();
                            this.py_listDeclaration = ld;
                            if(ld)
                                result += ld;
                        }

                        if(vd || ld)
                            result += "\n";

                        if(!this.py_funcDeclaration) {
                            var funcDefMap = this._execParser._funcDefMap;
                            var fd = "";

                            for(var f in funcDefMap) {
                                var funcDef = funcDefMap[f];
                                fd += funcDef + '\n\n';
                            }
                            this.py_funcDeclaration = fd;
                            if(fd)
                                result += fd;
                        }
                    }
                }
                if(textCode)
                    result += textCode.trim();
                result = result.replace(/\t/g, "    ");

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
        console.log("this._syntax_cache[mode]", this._syntax_cache[mode]);
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
            }
            else {
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
                            if(tokens[0].length != 0)
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
        console.log("error.loc", error.loc, "error.pos", error.pos, "error.raisedAt", error.raisedAt, "error.message", error.message);
        var err = {};
        err.from = {};
        err.to = {}

        var errorLine = error.loc.line;
        var errorColumn = error.loc.column;
        var errorPos = error.pos;
        var errorRaisedAt = error.raisedAt;
        var errorMessage = error.message;

        console.log("this._pyThreadCount", this._pyThreadCount, "this._pyBlockCount", this._pyBlockCount);

        var contents = this.codeMirror.getValue();
        var contentsArr = contents.split("\n");
        var currentThreadCount = 0;
        var currentLineCount = 0;

        for(var key in this._pyBlockCount) {
            var count = parseInt(this._pyBlockCount[key]);
            currentLineCount += count;
        }

        var targetLine = errorLine + currentLineCount + 3;
        if(targetLine > contentsArr.length)
            targetLine = contentsArr.length;
        var targetText = contentsArr[targetLine-1];

        err.from.line = targetLine;
        err.from.ch = 0;
        err.to.line = targetLine;
        err.to.ch = targetText.length;

        console.log("findSyntaxError err", err);
        return err;

    };

    p.findConvError = function(error) {
        console.log("error123", error);
        var err = {};
        err.from = {};
        err.to = {}

        var errorLine = error.line-1;
        var contents = this.codeMirror.getValue();
        var contentsArr = contents.split("\n");
        console.log("contentsArr", contentsArr);
        var currentLineCount = 0;
        var emptyLineCount = 0;
        var currentText;
        var targetLine;

        for(var i = 3; i < contentsArr.length; i++) {
            currentText = contentsArr[i];

            var length = currentText.trim().length;
            if(length == 0)
                emptyLineCount++;

            console.log("errorLine", errorLine, "emptyLineCount", emptyLineCount, "i", i);

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

        console.log("findConvError err", err);
        return err;
    };

    p.makeThreads = function(text) {
        console.log("makeThreads text", text);
        var textArr = text.split("\n");
        var thread = "";
        var threads = [];

        var optText = "";
        var onEntryEvent = false;
        
        for(var i = 3; i < textArr.length; i++) {
            var textLine = textArr[i] + "\n";
            console.log("textLine", textLine, "length", textLine.length, "[0]", textLine.charAt(0));
            textLine = textLine.replace(/\t/gm, '    ');
            if(Entry.TextCodingUtil.isEntryEventFuncByFullText(textLine)) {  
                textLine = this.entryEventParamConverter(textLine);
                if(optText.length != 0) {
                    threads.push(optText); 
                }

                optText = "";
                optText += textLine; 
                onEntryEvent = true;
            }
            else {
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
        console.log("makeThreads result", threads);
        return threads;

    };

    p.entryEventParamConverter = function(text) {  
        var startIndex = text.indexOf("(");
        var endIndex = text.indexOf(")");

        var stmt = text.substring(0, startIndex);
        var param = text.substring(startIndex+1, endIndex);
        console.log("filter stmt", stmt, "param", param);
        param = param.replace(/\"/g, "");
        
        if(param) {
            if(isNaN(param)) {
                param = param.replace(/ /g, "_space_");
            }
            else {
                param = 'num' + param;
            }

            if(param == 'None')
                param = 'none';
        }

        
        text = stmt + "(" + param + "):\n";
        


        console.log("entryEventFilter text", text);
        return text;
    }

    p.makeSyntaxErrorDisplay = function(subject, keyword, message, line) {
        console.log("subject", subject, "keyword", keyword, "message", message, "line", line);
        var contents;
        if(keyword)
            var kw = "\'" + keyword + "\' ";
        else
            var kw = '';

        contents = '[' + subject + ']' + ' ' + kw + ' : ' +
                    message + ' ' + '(line ' + line + ')';

        return contents;
    }

})(Entry.Parser.prototype);
