'use strict';

goog.provide("Entry.Vim");

goog.require("Entry.TextCodingUtil");

Entry.Vim = function(dom, textType) {
    //Definition For Textmode
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    this.createDom(dom);
    //this._parser = new Entry.Parser("maze", "js", this.codeMirror);
    //this._blockParser = new Entry.Parser("maze", "block");

    this._mode = Entry.Vim.WORKSPACE_MODE;
    this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
    this._parser = new Entry.Parser(this._mode, this._parserType, this.codeMirror);

    //this._pyBlockParser = new Entry.Parser("ws", "blockPy", this.codeMirror);
    //this._jsParser = new Entry.Parser("ws", "js", this.codeMirror);
    //this._pyParser = new Entry.Parser("ws", "py", this.codeMirror);

    Entry.Model(this, false);
    window.eventset = [];
};

Entry.Vim.MAZE_MODE = 1;
Entry.Vim.WORKSPACE_MODE = 2;

Entry.Vim.TEXT_TYPE_JS = 0;
Entry.Vim.TEXT_TYPE_PY = 1;

Entry.Vim.PARSER_TYPE_JS_TO_BLOCK = 0;
Entry.Vim.PARSER_TYPE_PY_TO_BLOCK = 1;
Entry.Vim.PARSER_TYPE_BLOCK_TO_JS = 2;
Entry.Vim.PARSER_TYPE_BLOCK_TO_PY = 3;

Entry.Vim.PYTHON_IMPORT_ENTRY = "import Entry";
Entry.Vim.PYTHON_IMPORT_HW = "import Arduino, Hamster, Albert, Bitbrick, Codeino, Dplay" +
                                " \n\t   Neobot, Nemoino, Robotis, Sensorboard, Xbot from Hw";


(function(p) {
    p.createDom = function (dom) {
        var parent, _self, target;
        parent = dom;
        this.view = Entry.Dom('div', {
            parent:parent,
            class: 'entryVimBoard'
        });

        var that = this;

        this.codeMirror = CodeMirror(this.view[0], {
            lineNumbers: true,
            value: "",
            mode:  {name:"javascript", globalVars: true},
            theme: "default",
            indentUnit: 4,
            indentWithTabs: true,
            styleActiveLine: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-[": function(e) { 
                    if(!Entry.playground.object) {
                            var message = "오브젝트가 존재하지 않습니다. 오브젝트를 추가한 후 시도해주세요.";
                            alert(message);
                            return;
                    }
                    var message =Entry.TextCodingUtil.isNamesIncludeSpace()
                    if(message) {
                        alert(message);
                        return;
                    }
                    var mode = {};
                    mode.boardType = Entry.Workspace.MODE_BOARD;
                    mode.textType = -1;
                    that.workspace.setMode(mode);
                    $('.entryModeSelector span ul li:eq(0)').triggerHandler('click');
                },
                "Ctrl-]": function(e) { 
                    var message =Entry.TextCodingUtil.isNamesIncludeSpace()
                    if(message) {
                        alert(message);
                        return;
                    }
                    var mode = {};
                    mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                    mode.textType = Entry.Vim.TEXT_TYPE_PY;
                    mode.runType = Entry.Vim.WORKSPACE_MODE;
                    Entry.dispatchEvent("changeMode", mode);
                    $('.entryModeSelector span ul li:eq(1)').triggerHandler('click');
                },
                "Alt-[": function() {
                    var currentScene = Entry.scene.selectedScene;
                    var currentObject = Entry.playground.object;
                    var option = "prev";

                    Entry.TextCodingUtil.selectObjectForShortCut(currentScene, currentObject, option);
                    console.log("Alt-[ shortcut", currentScene, currentObject, option);

                },
                "Alt-]": function() {
                    var currentScene = Entry.scene.selectedScene;
                    var currentObject = Entry.playground.object;
                    var option = "next";

                    Entry.TextCodingUtil.selectObjectForShortCut(currentScene, currentObject, option);
                    console.log("Alt-] shortcut", currentScene, currentObject, option);
                },
                "Tab": function(cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces); 
                } 
            },
            // gutters: ["CodeMirror-lint-markers"],
            lint: true,
            viewportMargin: 10
        });

        this.doc = this.codeMirror.getDoc();

        _self = this;
        target = this.view[0];
        function eventDragEnd(e) {
            console.log("drag");
            var textCode = _self.getCodeToText(e.block, Entry.Parser.PARSE_GENERAL);
            _self.codeMirror.display.dragFunctions.leave(e);
            var mousedown = Entry.Utils.createMouseEvent('mousedown', e);
            _self.codeMirror.display.scroller.dispatchEvent(mousedown);
            var testArr = textCode.split('\n');
            var max = testArr.length - 1;
            var lastLine = 0;
            testArr.forEach(function (text, i) {
                _self.codeMirror.replaceSelection(text);
                var cursor = _self.doc.getCursor();
                lastLine = cursor.line;
                /*if(!Entry.TextCodingUtil.isEntryEventFuncByFullText(text))
                    _self.codeMirror.indentLine(lastLine);*/
                if(i === 0 || max !== i) {
                    _self.codeMirror.replaceSelection('\n');
                }
            });
            var mouseup = Entry.Utils.createMouseEvent('mouseup', e);
            _self.codeMirror.display.scroller.dispatchEvent(mouseup);
        }

        function eventDragOver(e) {
            _self.codeMirror.display.dragFunctions.over(e);
        }

        target.removeEventListener("dragEnd", eventDragEnd);
        target.removeEventListener("dragOver", eventDragOver);
        target.addEventListener('dragEnd', eventDragEnd);
        target.addEventListener('dragOver', eventDragOver);
    };

    p.hide = function() {
        this.view.addClass('entryRemove');
    };

    p.show = function() {
        this.view.removeClass('entryRemove');
    };

    p.clearText = function() {
        this.codeMirror.setValue("");
    };

    p.textToCode = function(textType) {
        console.log("textToCode", textType);
        var type = textType;
        if (type === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if(type === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        var textCode = this.codeMirror.getValue();
        console.log("textCode 111", textCode);
        console.log("type", type);
        var code = this._parser.parse(textCode);
        //console.log("code", code);
        /*if(code.length === 0) {
            throw {
                message : '지원되지 않는 표현식을 포함하고 있습니다.',
            };
        }*/
        return code;
    };

    p.codeToText = function(code, mode) {
        console.log("mode", mode);
        var object;
        var codeDescription;
        if(mode)
            this._mode = mode.runType;

        if(Entry.playground) {
            object = Entry.playground.object;
            codeDescription = "# " + object.name + " 오브젝트의 파이썬 코드";
        }

        ////console.log("codeToText mode", mode);

        var textType = mode.textType;

        if (textType === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if(textType === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        var textCode = this._parser.parse(code, Entry.Parser.PARSE_GENERAL);

        if(textType === Entry.Vim.TEXT_TYPE_PY) {
            textCode = codeDescription
            .concat("\n\n")
            .concat(Entry.Vim.PYTHON_IMPORT_ENTRY)
            //.concat("\n")
            //.concat(Entry.Vim.PYTHON_IMPORT_HW)
            .concat("\n\n")
            .concat(textCode);
        }
        textCode += '\n';
        this.codeMirror.setValue(textCode);
        if(textType == Entry.Vim.TEXT_TYPE_PY)
            this.codeMirror.getDoc().markText({line:0, ch:0}, {line: 4, ch:0}, {readOnly: true});

        var doc = this.codeMirror.getDoc();
        doc.setCursor({ line: doc.lastLine() - 1});
    };

    p.getCodeToText = function(code, parseType) {
        var textType = this.workspace.oldTextType;

        if (textType === Entry.Vim.TEXT_TYPE_JS){
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if(textType === Entry.Vim.TEXT_TYPE_PY){
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        if(parseType)
            var textCode = this._parser.parse(code, parseType);
        else
            var textCode = this._parser.parse(code, Entry.Parser.PARSE_SYNTAX);

        return textCode;
    };

    p.setParserAvailableCode = function(blockMenuCode, boardCode) {
        this._parser.setAvailableCode(blockMenuCode, boardCode);
    };

})(Entry.Vim.prototype);
