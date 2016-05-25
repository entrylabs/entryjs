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

Entry.Parser = function(mode, type, cm) {
    this._mode = mode; // maze ai workspace
    this.syntax = {}; //for maze
    this.codeMirror = cm;
    this._lang = syntax || "js"; //for maze
    this._type = type;
    this.availableCode = [];

    if (mode === 'maze') {
        this._stageId = Number(Ntry.configManager.getConfig('stageId'));
        var configCode = NtryData.config[this._stageId].availableCode;
        var playerCode = NtryData.player[this._stageId].code;
        this.setAvailableCode(configCode, playerCode);
    } else if (mode === Entry.Vim.WORKSPACE_MODE) {
        this.mappingSyntax(Entry.Vim.WORKSPACE_MODE); 
    }

    this.syntax.js = this.mappingSyntaxJs(mode);
    this.syntax.py = this.mappingSyntaxPy(mode);

    console.log("py syntax", this.syntax.py);

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

            CodeMirror.commands.javascriptComplete = function (cm) {
                CodeMirror.showHint(cm, null, {globalScope:assistScope});
            }

            cm.on("keyup", function (cm, event) {
                if (!cm.state.completionActive &&  (event.keyCode >= 65 && event.keyCode <= 95))  {
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
                if (!cm.state.completionActive &&  (event.keyCode >= 65 && event.keyCode <= 95))  {
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
        if (mode === Entry.Vim.MAZE_MODE) {
            this._stageId = Number(Ntry.configManager.getConfig('stageId'));
            var configCode = NtryData.config[this._stageId].availableCode;
            var playerCode = NtryData.player[this._stageId].code;
            this.setAvailableCode(configCode, playerCode);
        } else if (mode === Entry.Vim.WORKSPACE_MODE) {
            //To Do for ws
        }

        this.mappingSyntax(mode);
        this._type = type;

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                this._parser = new Entry.JsToBlockParser(this.syntax.js);

                break;

            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                this._parser = new Entry.PyToBlockParser(this.syntax.py);

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

                cm.setOption("mode", {name: "javascript", globalVars: true});

                CodeMirror.commands.autoCompletion = function (cm) {
                    CodeMirror.showHint(cm, null, {globalScope:assistScope});
                }

                cm.on("keyup", function (cm, event) {
                    if (!cm.state.completionActive &&  (event.keyCode >= 65 && event.keyCode <= 95))  {
                        CodeMirror.showHint(cm, null, {completeSingle: false, globalScope:assistScope});
                    }
                });

                break;

            case Entry.Vim.PARSER_TYPE_BLOCK_TO_PY:
                this._parser = new Entry.BlockToPyParser();

                var syntax = this.syntax.py;
                var assistScope = {};

                for(var key in syntax) {
                    assistScope[key + '();\n'] = syntax[key];
                }

                console.log("assistScope", assistScope);

                cm.setOption("mode", {name: "python", globalVars: true});

                CodeMirror.commands.autocomplete = function (cm) {
                    CodeMirror.showHint(cm, null, {globalScope:assistScope});
                }

                cm.on("keyup", function (cm, event) {
                    if (!cm.state.completionActive &&  (event.keyCode >= 65 && event.keyCode <= 95))  {
                        CodeMirror.showHint(cm, null, {completeSingle: false});
                    }

                    if(!cm.state.completionActive &&  (event.keyCode == 46)) {
                        CodeMirror.showHint(cm, null, {completeSingle: false, globalScope:assistScope});
                    }
                });
                
                break;
        }
    };

    p.parse = function(code) {
        console.log("PARSER TYPE", this._type);
        
        var type = this._type;
        var result = null;

        switch (type) {
            case Entry.Vim.PARSER_TYPE_JS_TO_BLOCK:
                try {
                    var jsAstGenerator = new Entry.JsAstGenerator();
                    var astTree = jsAstGenerator.generate(code);
                    result = this._parser.Program(astTree);
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

                        Entry.toast.alert('Error', error.message);
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_PY_TO_BLOCK:
                try {
                    var pyAstGenerator = new Entry.PyAstGenerator();
                    console.log("code", code);
                    var threaded = code.split('\n\n');
                    threaded.splice(threaded.length-1, 1);
                    console.log("threaded", threaded);
                    var astArr = [];
                    for(var index in threaded) {
                        var astTree = pyAstGenerator.generate(threaded[index]);
                        astArr.push(astTree);
                    }

                    console.log("astArr", astArr);

                    result = this._parser.Program(astArr);
                    console.log("result", result);
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

                        Entry.toast.alert('Error', error.message);
                    }
                    result = [];
                }
                break;
            case Entry.Vim.PARSER_TYPE_BLOCK_TO_JS:
                this._parser = new Entry.BlockToJsParser(this.syntax.js);
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
                var textCode = this._parser.Code(code);
                //var textArr = textCode.match(/(.*{.*[\S|\s]+?}|.+)/g);
               /* var textArr = textCode.split("\n\n");

                console.log("textArr", textArr);*/

                result = textCode;

                /*if(Array.isArray(textArr)) {
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

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            
            var block = Entry.block[type];

            if (block.mode === mode && this.availableCode.indexOf(type) > -1) {
                var syntaxArray = block.syntax;
                if (!syntaxArray)
                    continue;
                var syntax = this.syntax;
                for (var j = 0; j < syntaxArray.length; j++) {
                    var key = syntaxArray[j];
                    if (j === syntaxArray.length - 2 &&
                       typeof syntaxArray[j + 1] === "function") {
                        syntax[key] = syntaxArray[j + 1];
                        break;
                    }
                    if (!syntax[key]) {
                        syntax[key] = {};
                    }
                    if (j === syntaxArray.length - 1) {
                        syntax[key] = type;
                    } else {
                        syntax = syntax[key];
                    }
                }
            }
        }
    };

    p.setAvailableCode = function (configCode, playerCode) {
        var availableList = [];
        configCode.forEach(function (items, i) {
            items.forEach(function (item, i) {
                availableList.push(item.type);
            });
        });

        if (playerCode instanceof Entry.Code) {
            var blocks = playerCode.getBlockList();
            blocks.forEach(function(item){
                if(item.type !== NtryData.START && availableList.indexOf(item.type) === -1)
                    availableList.push(item.type);
            });
        } else {
            playerCode.forEach(function (items, i) {
                items.forEach(function (item, i) {
                    if(item.type !== NtryData.START && availableList.indexOf(item.type) === -1) {
                        availableList.push(item.type);
                    }
                });
            });
        }

        this.availableCode = this.availableCode.concat(availableList);
    };

    
    p.mappingSyntaxJs = function(mode) {
        var types = Object.keys(Entry.block);

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            
            var block = Entry.block[type];

            if (block.mode === mode && this.availableCode.indexOf(type) > -1) {
                var syntaxArray = block.syntax;
                if (!syntaxArray)
                    continue;
                var syntax = this.syntax;
                for (var j = 0; j < syntaxArray.length; j++) {
                    var key = syntaxArray[j];
                    if (j === syntaxArray.length - 2 &&
                       typeof syntaxArray[j + 1] === "function") {
                        syntax[key] = syntaxArray[j + 1];
                        break;
                    }
                    if (!syntax[key]) {
                        syntax[key] = {};
                    }
                    if (j === syntaxArray.length - 1) {
                        syntax[key] = type;
                    } else {
                        syntax = syntax[key];
                    }
                }
            }
        }
        return syntax;
    };

    p.mappingSyntaxPy = function(mode) {
        if(mode != Entry.Vim.WORKSPACE_MODE) return;

        var syntaxList = {};
        var blockList = Entry.block;

        for (var key in blockList) {
            var pyBlockSyntax = {};
            var block = blockList[key];
            var syntax = null;

            if(block.syntax && block.syntax.py)
                syntax = block.syntax.py;
            if (!syntax)
                continue;

            syntax = String(syntax);
            if(syntax.match(/.*\..*\)/)) {
                var index = syntax.indexOf('(');
                
                syntax = syntax.substring(0, index);
            }
            syntaxList[syntax] = key;
        }
        return syntaxList;
    };

})(Entry.Parser.prototype);
