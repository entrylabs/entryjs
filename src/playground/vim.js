import { debounce } from 'lodash';

class Vim {
    static MAZE_MODE = 1;
    static WORKSPACE_MODE = 2;

    static TEXT_TYPE_JS = 0;
    static TEXT_TYPE_PY = 1;

    static PARSER_TYPE_JS_TO_BLOCK = 0;
    static PARSER_TYPE_PY_TO_BLOCK = 1;
    static PARSER_TYPE_BLOCK_TO_JS = 2;
    static PARSER_TYPE_BLOCK_TO_PY = 3;

    static INEDITABLE_LINE_PY = 3;

    static PYTHON_IMPORT_ENTRY = 'import Entry';
    static PYTHON_IMPORT_HW = '';

    constructor(dom) {
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
                if (name === 'ArduinoExt') {
                    name = 'Arduino';
                }
                Vim.PYTHON_IMPORT_HW = `\nimport ${name}\n`;
                Vim.INEDITABLE_LINE_PY = 4;
            } else {
                Vim.PYTHON_IMPORT_HW = '';
                Vim.INEDITABLE_LINE_PY = 3;
            }
        });
    }

    createDom(dom) {
        const parent = dom;

        this.view = Entry.Dom('div', {
            parent,
            class: 'entryVimBoard',
        });

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
                    globalScope: this.#getAssistScope(),
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

        const target = this.view[0];
        target.removeEventListener('dragEnd', this.#handleDragEnd);
        target.removeEventListener('dragOver', this.#handleDragOver);
        target.addEventListener('dragEnd', this.#handleDragEnd);
        target.addEventListener('dragOver', this.#handleDragOver);
    }

    hide() {
        this.view.addClass('entryRemove');
        this.view.remove();
    }

    show() {
        this.view.removeClass('entryRemove');
        this._parentView.append(this.view);
    }

    clearText() {
        this.codeMirror.setValue('');
    }

    textToCode(textType) {
        const type = textType;
        if (type === Vim.TEXT_TYPE_JS) {
            this._parserType = Vim.PARSER_TYPE_JS_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if (type === Vim.TEXT_TYPE_PY) {
            this._parserType = Vim.PARSER_TYPE_PY_TO_BLOCK;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }

        let textCode = this.codeMirror.getValue();
        const cursor = this.doc.getCursor();
        textCode = textCode.replace(/\t/gm, '    ');
        this.codeMirror.setValue(textCode);
        this.doc.setCursor(cursor);
        return this._parser.parse(textCode);
    }

    codeToText(code, mode) {
        let doc;
        let textCode;
        let codeDescription;
        if (mode) {
            this._mode = mode.runType;
        }

        const textType = mode.textType;
        this._oldParserType = mode.textType;

        if (textType === Vim.TEXT_TYPE_JS) {
            this._parserType = Vim.PARSER_TYPE_BLOCK_TO_JS;
            if (this._oldParserType !== this._parserType) {
                this._parser.setParser(this._mode, this._parserType, this.codeMirror);
            }
            this._oldParserType = this._parserType;
        } else if (textType === Vim.TEXT_TYPE_PY) {
            this._parserType = Vim.PARSER_TYPE_BLOCK_TO_PY;
            if (this._oldParserType !== this._parserType) {
                this._parser.setParser(this._mode, this._parserType, this.codeMirror);
            }
            this._oldParserType = this._parserType;
        }

        if (Entry.playground) {
            this._currentObject = Entry.playground.object;
        }

        this._parser._hasDeclaration = false;

        if (textType === Vim.TEXT_TYPE_PY) {
            if (this._currentObject) {
                codeDescription = `# ${this._currentObject.name}${Lang.TextCoding.python_code}`;
                textCode = this._parser.parse(code, Entry.Parser.PARSE_GENERAL);

                if (textType === Vim.TEXT_TYPE_PY) {
                    textCode = codeDescription
                        .concat('\n\n')
                        .concat(Vim.PYTHON_IMPORT_ENTRY)
                        .concat(Vim.PYTHON_IMPORT_HW)
                        .concat('\n\n')
                        .concat(textCode);
                }
                this.codeMirror.setValue(textCode);
                if (textType === Vim.TEXT_TYPE_PY) {
                    this.codeMirror
                        .getDoc()
                        .markText(
                            { line: 0, ch: 0 },
                            { line: Vim.INEDITABLE_LINE_PY, ch: 0 },
                            { readOnly: true, inclusiveLeft: true }
                        );
                }

                doc = this.codeMirror.getDoc();
                doc.setCursor({ line: doc.lastLine() - 1 });
            } else {
                this.clearText();
            }
        } else if (textType === Vim.TEXT_TYPE_JS) {
            textCode = this._parser.parse(code, Entry.Parser.PARSE_GENERAL);
            this.codeMirror.setValue(textCode);
            doc = this.codeMirror.getDoc();
            doc.setCursor({ line: doc.lastLine() - 1 });
        }

        if (Entry.isTextMode) {
            this._parser._onRunError = false;
        }
    }

    getCodeToText(code, parseType) {
        this.#setParserUsingOldTextType();

        return parseType
            ? this._parser.parse(code, parseType)
            : this._parser.parse(code, Entry.Parser.PARSE_SYNTAX);
    }

    setParserAvailableCode(blockMenuCode, boardCode) {
        this._parser.setAvailableCode(blockMenuCode, boardCode);
    }

    getBlockSyntax(datum) {
        let syntax = null;
        this.#setParserUsingOldTextType();

        if (this._parser._execParser) {
            syntax = this._parser._execParser.searchSyntax(datum);
        }

        return syntax;
    }

    #getAssistScope() {
        const execParser = this._parser._execParser;
        if (execParser && execParser.getAssistScope) {
            return execParser.getAssistScope();
        }
    }

    #setParserUsingOldTextType() {
        const textType = this.workspace.oldTextType;

        if (textType === Vim.TEXT_TYPE_JS) {
            this._parserType = Vim.PARSER_TYPE_BLOCK_TO_JS;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        } else if (textType === Vim.TEXT_TYPE_PY) {
            this._parserType = Vim.PARSER_TYPE_BLOCK_TO_PY;
            this._parser.setParser(this._mode, this._parserType, this.codeMirror);
        }
    }

    #handleDragEnd = (e) => {
        const block = e.block;

        if (!block) {
            return;
        }

        const codeMirror = this.codeMirror;
        const textCode = this.getCodeToText(block, Entry.Parser.PARSE_BLOCK);

        codeMirror.display.dragFunctions.leave(e);
        codeMirror.display.scroller.dispatchEvent(Entry.Utils.createMouseEvent('mousedown', e));

        const testArr = textCode.split('\n');
        const max = testArr.length - 1;
        let statementCursorLine = this.doc.getCursor().line;
        testArr.forEach((text, i) => {
            if (i !== max) {
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
    };

    #handleDragOver = (e) => {
        this.codeMirror.display.dragFunctions.over(e);
    };
}

Entry.Vim = Vim;
