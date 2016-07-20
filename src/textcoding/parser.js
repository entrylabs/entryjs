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

            var syntax = this.syntax;

            var assistScope = {};

            for(var key in syntax.Scope ) {
                assistScope[key + '();\n'] = syntax.Scope[key];
            }

            if('BasicIf' in syntax) {
                assistScope['front'] = 'BasicIf';
            }

            cm.on("keyup", function (cm, event) {
                if ((event.keyCode >= 65 && event.keyCode <= 95) ||
                    event.keyCode == 167 || event.keyCode == 190) {
                    CodeMirror.showHint(cm, null, {completeSingle: false, globalScope:assistScope});
                }
            });
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

                for(var key in syntax.Scope ) {
                    assistScope[key + '();\n'] = syntax.Scope[key];
                }

                if('BasicIf' in syntax) {
                    assistScope['front'] = 'BasicIf';
                }

                //cm.setOption("mode", {name: "javascript", globalVars: true});

                cm.on("keyup", function (cm, event) {
                    if ((event.keyCode >= 65 && event.keyCode <= 95) ||
                        event.keyCode == 167 || event.keyCode == 190) {
                        CodeMirror.showHint(cm, null, {completeSingle: false, globalScope:assistScope});
                    }
                });

                this._parserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;

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

        //console.log("parse type", type);

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    var astTree = acorn.parse(code);
                    result = this._parser.Program(astTree);
                } catch (error) {
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
                            this.codeMirror.markText(
                                annotation.from, annotation.to, {
                                className: "CodeMirror-lint-mark-error",
                                __annotation: annotation,
                                clearOnEnter: true
                            });
                        }

                        Entry.toast.alert('Error', error.message);
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                try {
                    var pyAstGenerator = new Entry.PyAstGenerator();
                    //console.log("code", code);

                    //Entry.TextCodingUtil.prototype.makeThreads(code);
                    var threads = code.split('\n\n');
                    //console.log("threads", threads);

                    for(var i in threads) {
                        //console.log("thread", threads[i]);
                        //console.log("search", threads[i].search("import"));
                        var thread = threads[i];
                        if(thread.search("import") != -1) {
                            threads[i] = "";
                            continue;
                        }

                        thread = Entry.TextCodingUtil.prototype.entryEventFuncFilter(thread);
                        threads[i] = thread;
                    }

                    //console.log("threads", threads);
                    var astArray = [];

                    for(var index in threads) {
                        var thread = threads[index];
                        var ast = pyAstGenerator.generate(thread);
                        if(ast.type == "Program" && ast.body.length != 0)
                            astArray.push(ast);
                    }

                    //console.log("astArray", astArray);

                    result = this._parser.Program(astArray);

                    this._parser._variableMap.clear();

                    //console.log("result", result);
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
                            annotation = this.getLineNumber(error.node.start,
                                                               error.node.end);
                            annotation.message = error.message;
                            annotation.severity = "error";
                            this.codeMirror.markText(
                                annotation.from, annotation.to, {
                                className: "CodeMirror-lint-mark-error",
                                __annotation: annotation,
                                clearOnEnter: true
                            });
                        }
                        //throw error;
                        Entry.toast.alert('[텍스트코딩(파이썬) 오류]', error.message);
                        document.getElementById("entryCodingModeSelector").value = '2';
                        throw error;
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                var textCode = this._parser.Code(code);
                var textArr = textCode.match(/(.*{.*[\S|\s]+?}|.+)/g);
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
                }

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

})(Entry.Parser.prototype);
