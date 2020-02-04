import { debounce } from 'lodash';

Entry.Vim = function(dom, textType) {
    //Definition For Textmode
    if (typeof dom === 'string') {
        dom = $(`#${dom}`);
    } else {
        dom = $(dom);
    }

    if (dom.prop('tagName') !== 'DIV') {
        return console.error('Dom is not div element');
    }

    this._parentView = dom;
    this.createDom(dom);

    this._parser = new Entry.Parser(null, null, this.codeMirror);

    Entry.addEventListener('hwChanged', (e) => {
        if (Entry.hw.hwModule) {
            let name = Entry.hw.hwModule.name;
            name = name[0].toUpperCase() + name.slice(1);
            if (name == 'ArduinoExt') {
                name = 'Arduino';
            }
            Entry.Vim.PYTHON_IMPORT_HW = `\nimport ${name}\n`;
            Entry.Vim.INEDITABLE_LINE_PY = 4;
        } else {
            Entry.Vim.PYTHON_IMPORT_HW = '';
            Entry.Vim.INEDITABLE_LINE_PY = 3;
        }
    });
};

Entry.Vim.MAZE_MODE = 1;
Entry.Vim.WORKSPACE_MODE = 2;

Entry.Vim.TEXT_TYPE_JS = 0;
Entry.Vim.TEXT_TYPE_PY = 1;

Entry.Vim.PARSER_TYPE_JS_TO_BLOCK = 0;
Entry.Vim.PARSER_TYPE_PY_TO_BLOCK = 1;
Entry.Vim.PARSER_TYPE_BLOCK_TO_JS = 2;
Entry.Vim.PARSER_TYPE_BLOCK_TO_PY = 3;

Entry.Vim.INEDITABLE_LINE_PY = 3;

Entry.Vim.PYTHON_IMPORT_ENTRY = 'import Entry';
Entry.Vim.PYTHON_IMPORT_HW = '';

(function(p) {
    p.createDom = function(dom) {
        let parent;
        let _self;
        let target;
        parent = dom;
        this.view = Entry.Dom('div', {
            parent,
            class: 'entryVimBoard',
        });

        const that = this;

        this.codeMirror = CodeMirror(this.view[0], {
            lineNumbers: true,
            value: '',
            mode: { name: 'javascript', globalVars: true },
            theme: 'default',
            indentUnit: 4,
            indentWithTabs: true,
            styleActiveLine: true,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                Tab(cm) {
                    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                    cm.replaceSelection(spaces);
                },
            },
            //gutters: ["CodeMirror-linenumbers", "breakpoints"],
            lint: true,
            viewportMargin: 10,
        });

        const dShowHint = debounce(() => {
            if (Entry.isTextMode) {
                this.codeMirror.showHint({
                    completeSingle: false,
                    globalScope: this._getAssistScope(),
                });
            }
        }, 250);

        this.codeMirror.on('keydown', (cm, event) => {
            if (Entry && Entry.keyPressed) {
                Entry.keyPressed.notify(event, true);
            }
            if (event.key.length === 1) {
                dShowHint();
            }
        });

        const dClear = debounce(() => {
            const input =
                this.codeMirror.display && this.codeMirror.display.input
                    ? this.codeMirror.display.input
                    : undefined;
            if (input && input.composing) {
                input.poll();
                input.composing.range.clear();
                input.composing = null;
            }
        }, 250);

        this.codeMirror.on('keyup', (cm, event) => {
            //i.e composition bug
            dClear();

            if (event.key === 'Backspace') {
                dShowHint();
            }
        });

        this.doc = this.codeMirror.getDoc();

        _self = this;
        target = this.view[0];

        function eventDragEnd(e) {
            const block = e.block;

            if (!block) {
                return;
            }

            const codeMirror = _self.codeMirror;
            const textCode = _self.getCodeToText(block, Entry.Parser.PARSE_BLOCK);

            codeMirror.display.dragFunctions.leave(e);
            codeMirror.display.scroller.dispatchEvent(Entry.Utils.createMouseEvent('mousedown', e));

            const testArr = textCode.split('\n');
            const max = testArr.length - 1;
            let statementCursorLine = _self.doc.getCursor().line;
            testArr.forEach((text, i) => {
                if (i != max) {
                    text += '\n';
                }
                codeMirror.replaceSelection(text);
            });

            //set cursor for statement block
            if (block.statements && block.statements.length) {
                statementCursorLine++;
                codeMirror.setCursor(statementCursorLine);
                if (codeMirror.getLine(statementCursorLine)) {
                    codeMirror.replaceSelection('\n');
                    codeMirror.setCursor(statementCursorLine);
                }
                CodeMirror.commands.indentAuto(codeMirror);
            }

            codeMirror.display.scroller.dispatchEvent(Entry.Utils.createMouseEvent('mouseup', e));
        }

        function eventDragOver(e) {
            _self.codeMirror.display.dragFunctions.over(e);
        }

        target.removeEventListener('dragEnd', eventDragEnd);
        target.removeEventListener('dragOver', eventDragOver);
        target.addEventListener('dragEnd', eventDragEnd);
        target.addEventListener('dragOver', eventDragOver);
    };

    p.hide = function() {
        this.view.addClass('entryRemove');
        this.view.remove();
    };

    p.show = function() {
        this.view.removeClass('entryRemove');
        this._parentView.append(this.view);
    };

    p.clearText = function() {
        this.codeMirror.setValue('');
    };

    p.textToCode = function(textType) {
        const type = textType;
        if (type === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if (type === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        let textCode = this.codeMirror.getValue();
        const cursor = this.doc.getCursor();
        textCode = textCode.replace(/\t/gm, '    ');
        this.codeMirror.setValue(textCode);
        this.doc.setCursor(cursor);
        const code = this._parser.parse(textCode);
        return code;
    };

    p.codeToText = function(code, mode) {
        let codeDescription;
        if (mode) {
            this._mode = mode.runType;
        }

        const textType = mode.textType;
        this._oldParserType = mode.textType;

        if (textType === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
            if (this._oldParserType != this._parserType) {
                this._parser.setParser(this._mode, this._parserType, this.codeMirror);
            }
            this._oldParserType = this._parserType;
        } else if (textType === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
            if (this._oldParserType != this._parserType) {
                this._parser.setParser(this._mode, this._parserType, this.codeMirror);
            }
            this._oldParserType = this._parserType;
        }

        if (Entry.playground) {
            this._currentObject = Entry.playground.object;
        }

        this._parser._hasDeclaration = false;

        if (textType == Entry.Vim.TEXT_TYPE_PY) {
            if (this._currentObject) {
                codeDescription = `# ${this._currentObject.name}${Lang.TextCoding.python_code}`;
                var textCode = this._parser.parse(code, Entry.Parser.PARSE_GENERAL);

                if (textType === Entry.Vim.TEXT_TYPE_PY) {
                    textCode = codeDescription
                        .concat('\n\n')
                        .concat(Entry.Vim.PYTHON_IMPORT_ENTRY)
                        .concat(Entry.Vim.PYTHON_IMPORT_HW)
                        .concat('\n\n')
                        .concat(textCode);
                }
                this.codeMirror.setValue(textCode);
                if (textType == Entry.Vim.TEXT_TYPE_PY) {
                    this.codeMirror
                        .getDoc()
                        .markText(
                            { line: 0, ch: 0 },
                            { line: Entry.Vim.INEDITABLE_LINE_PY, ch: 0 },
                            { readOnly: true, inclusiveLeft: true }
                        );
                }

                var doc = this.codeMirror.getDoc();
                doc.setCursor({ line: doc.lastLine() - 1 });
            } else {
                this.clearText();
            }
        } else if (textType == Entry.Vim.TEXT_TYPE_JS) {
            var textCode = this._parser.parse(code, Entry.Parser.PARSE_GENERAL);
            this.codeMirror.setValue(textCode);
            var doc = this.codeMirror.getDoc();
            doc.setCursor({ line: doc.lastLine() - 1 });
        }

        if (Entry.isTextMode) {
            this._parser._onRunError = false;
        }
    };

    p.getCodeToText = function(code, parseType) {
        const textType = this.workspace.oldTextType;

        if (textType === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if (textType === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        return parseType
            ? this._parser.parse(code, parseType)
            : this._parser.parse(code, Entry.Parser.PARSE_SYNTAX);
    };

    p.setParserAvailableCode = function(blockMenuCode, boardCode) {
        this._parser.setAvailableCode(blockMenuCode, boardCode);
    };

    p.getBlockSyntax = function(datum) {
        let syntax = null;
        const textType = this.workspace.oldTextType;
        if (textType === Entry.Vim.TEXT_TYPE_JS) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_JS;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if (textType === Entry.Vim.TEXT_TYPE_PY) {
            this._parserType = Entry.Vim.PARSER_TYPE_BLOCK_TO_PY;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        if (this._parser._execParser) {
            syntax = this._parser._execParser.searchSyntax(datum);
        }

        return syntax;
    };

    p._getAssistScope = function() {
        const execParser = this._parser._execParser;
        if (execParser && execParser.getAssistScope) {
            return execParser.getAssistScope();
        }
    };
})(Entry.Vim.prototype);
