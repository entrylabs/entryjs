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
goog.require("Entry.PyHint");
goog.require("Entry.Console")


Entry.Parser = function(mode, type, cm, syntax) {
    this._mode = mode; // maze ai workspace
    this.syntax = {}; //for maze
    this.codeMirror = cm;
    this._lang = syntax || "js"; //for maze
    this._type = type;
    this.availableCode = [];

    Entry.Parser.PARSE_GENERAL = 0;
    Entry.Parser.PARSE_SYNTAX = 1;
    Entry.Parser.PARSE_VARIABLE = 2;

    Entry.Parser.BLOCK_SKELETON_BASIC = "basic";
    Entry.Parser.BLOCK_SKELETON_BASIC_LOOP = "basic_loop";
    Entry.Parser.BLOCK_SKELETON_BASIC_DOUBLE_LOOP = "basic_double_loop";

    /*this.syntax.js = this.mappingSyntaxJs(mode);
    this.syntax.py = this.mappingSyntaxPy(mode);*/

    //console.log("py syntax", this.syntax.py);
    this._console = new Entry.Console();

    switch (this._lang) {
        case "js":
            this._parser = new Entry.JsToBlockParser(this.syntax);
            break;
        case "py":
            this._parser = new Entry.PyToBlockParser(this.syntax);

            var syntax = this.syntax;

            var assistScope = {};

            for(var key in syntax.Scope ) {
                assistScope[key + '();\n'] = syntax.Scope[key];
            }

            if('BasicIf' in syntax) {
                assistScope['front'] = 'BasicIf';
            }

            CodeMirror.commands.javascriptComplete = function (cm) {
                CodeMirror.showHint(cm, null, {globalScope:assistScope});
            }

            cm.on("keyup", function (cm, event) {
                if ((event.keyCode >= 65 && event.keyCode <= 95) ||
                    event.keyCode == 167 || event.keyCode == 190) {
                    CodeMirror.showHint(cm, null, {completeSingle: false, globalScope:assistScope});
                }
            });
            break;

        case "blockJs":
            this._parser = new Entry.BlockToJsParser(this.syntax);
            var syntax = this.syntax;
            break;

        case "blockPy":
            this._parser = new Entry.BlockToPyParser(this.syntax);
            var syntax = this.syntax;
            break;
    }
};

(function(p) {
    p.setParser = function(mode, type, cm) {
        this._mode = mode;
        this._type = type;
        this._cm = cm;

        this.syntax = this.mappingSyntax(mode);

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                this._parser = new Entry.JsToBlockParser(this.syntax);

                this._parserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;

                break;

            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                this._parser = new Entry.PyToBlockParser(this.syntax);

                this._parserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                this._parser = new Entry.BlockToJsParser(this.syntax);

                var syntax = this.syntax;
                var assistScope = {};

                for(var key in syntax.Scope) {
                    assistScope[key + '();\n'] = syntax.Scope[key];
                }

                if('BasicIf' in syntax) {
                    assistScope['front'] = 'BasicIf';
                }

                cm.on("keydown", function (cm, event) {
                    var keyCode = event.keyCode;

                    if ((keyCode >= 65 && keyCode <= 95) ||
                        keyCode == 167 || (!event.shiftKey && keyCode == 190)) {
                        CodeMirror.showHint(cm, null, {
                            completeSingle: false, globalScope:assistScope
                        });
                    }
                });

                this._parserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                this._parser = new Entry.BlockToPyParser(this.syntax);

                cm.setOption("mode", {name: "python", globalVars: true});
                cm.markText({line: 0, ch: 0}, {line: 5}, {readOnly: true});

                this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;

                break;
        }
    };

    p.parse = function(code, parseMode) {
        var type = this._type;
        var result = null;

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    //var astTree = acorn.parse(code);
                    //var threads = code.split('\n\n');
                    var threads = [];
                    threads.push(code);

                    //console.log("threads", threads);

                    var astArray = [];

                    for(var index in threads) {
                        var thread = threads[index];
                        thread = thread.trim();
                        var ast = acorn.parse(thread);
                        //if(ast.type == "Program" && ast.body.length != 0)
                        astArray.push(ast);
                    }

                    result = this._parser.Program(astArray);
                } catch (error) {
                    if (this.codeMirror) {
                        var annotation;
                        if (error instanceof SyntaxError) {
                            annotation = {
                                from: {line: error.loc.line - 1, ch: error.loc.column - 2},
                                to: {line: error.loc.line - 1, ch: error.loc.column + 1}
                            }
                            error.message = "문법(Syntax) 오류입니다.";
                            error.type = 1;
                        } else {
                            annotation = this.getLineNumber(error.node.start, error.node.end);
                            annotation.message = error.message;
                            annotation.severity = "error";

                            var errorInfo = this.findErrorInfo(error);
                            annotation.from.line = errorInfo.lineNumber;
                            annotation.from.ch = errorInfo.location.start;
                            annotation.to.line = errorInfo.lineNumber;
                            annotation.to.ch = errorInfo.location.end;  
                            

                            error.type = 2;
                        }

                        this.codeMirror.markText(
                            annotation.from, annotation.to, {
                            className: "CodeMirror-lint-mark-error",
                            __annotation: annotation,
                            clearOnEnter: true 
                        });

                        if(error.title) {
                            var errorTitle = error.title;
                        }
                        else {
                            var errorTitle = '문법 오류'; 
                        }

                        if(error.type == 2 && error.message) {
                            var errorMsg = error.message;
                        }
                        else if(error.type == 2 && !error.message) {
                            var errorMsg = '자바스크립트 코드를 확인해주세요.';
                        }
                        else  if(error.type == 1) {
                            var errorMsg = '자바스크립트 문법을 확인해주세요.';
                        }

                        Entry.toast.alert(errorTitle, errorMsg);
                        var mode = {};
                        mode.boardType = Entry.Workspace.MODE_BOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_JS; 
                        mode.runType = Entry.Vim.MAZE_MODE;
                        Ntry.dispatchEvent("textError", mode);
                        throw new Error("text_js_error");
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                try {
                    var pyAstGenerator = new Entry.PyAstGenerator();

                    //Entry.TextCodingUtil.prototype.makeThreads(code);
                    var threads = code.split('\n\n');

                    for(var i in threads) {
                        var thread = threads[i];
                        if(thread.search("import") != -1) {
                            threads[i] = "";
                            continue;
                        }

                        thread = Entry.TextCodingUtil.prototype.entryEventFuncFilter(thread);
                        threads[i] = thread;
                    }

                    var astArray = [];
                    for(var index in threads) {
                        var thread = threads[index];
                        var ast = pyAstGenerator.generate(thread);
                        if(ast.type == "Program" && ast.body.length != 0)
                            astArray.push(ast);
                    }

                    result = this._parser.Program(astArray);
                    this._parser._variableMap.clear();

                    break;
                } catch(error) {
                    if (this.codeMirror) {
                        var annotation;
                        if (error instanceof SyntaxError) {
                            annotation = {
                                from: {line: error.loc.line - 1, ch: error.loc.column - 2},
                                to: {line: error.loc.line - 1, ch: error.loc.column + 1}
                            }
                            error.message = "문법 오류입니다.";
                        } else {
                            annotation = this.getLineNumber(error.node.start, error.node.end);
                            annotation.message = error.message;
                            annotation.severity = "error";
                            
                        }

                        var line = parseInt(annotation.to.line) + 1;
                        annotation.from.line = line-1;
                        annotation.to.line = line;

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

                        if(error.message && line)
                            var errorMsg = error.message + ' (line: ' + line + ')';
                        else
                            var errorMsg = '파이썬 코드를 확인해주세요';
                        Entry.toast.alert(errorTitle, errorMsg);
                        throw error;
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                var textCode = this._parser.Code(code, parseMode);
                /*var textArr = textCode.match(/(.*{.*[\S|\s]+?}|.+)/g);
                console.log("textCode", textCode);
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
                result = textCode;

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                var textCode = this._parser.Code(code, parseMode);

                if (!this._pyHinter)
                    this._pyHinter = new Entry.PyHint();

                result = textCode;
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
        var types = Object.keys(Entry.block);
        var syntax = {};

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var block = Entry.block[type];

            if(mode === Entry.Vim.MAZE_MODE) {
                if(this.availableCode.indexOf(type) > -1) {
                    var syntaxArray = block.syntax;
                    if (!syntaxArray) continue;

                    var syntaxTemp = syntax;
                    //console.log("syntaxArray", syntaxArray);
                    for (var j = 0; j < syntaxArray.length; j++) {
                        var key = syntaxArray[j];
                        var index = key.indexOf("(");
                        if(index > -1) {
                            key = key.substring(0, index);
                        }
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
                    var blockList = Entry.block;

                    for (var key in blockList) {
                        var pyBlockSyntax = {};
                        var block = blockList[key];
                        var pySyntax = null;

                        if(block.syntax && block.syntax.py) {
                            pySyntax = block.syntax.py;
                            //console.log("syntax", syntax);
                        }

                        if (!pySyntax)
                            continue;

                        pySyntax = String(pySyntax);
                        var tokens = pySyntax.split('(');
                        if(tokens[0].length != 0)
                            pySyntax = tokens[0];

                        syntax[pySyntax] = key;
                    }
                }
            }
        }

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

    p.findErrorInfo = function(error) {
        var contents = this.codeMirror.getValue();
        var lineNumber = 0;
        var blockCount = 0;
        var textArr = contents.split('\n');
        
        for(var i in textArr) {
            var text = textArr[i].trim();
           
            lineNumber++;
            if(text.length == 0 || text.length == 1 || text.indexOf("else") > -1) {
                continue;
            }
            else {
                blockCount++;
            }

            if(blockCount == error.blockCount)
                break;
           
        }

        return {lineNumber: lineNumber, location: error.node}
    };

})(Entry.Parser.prototype);
