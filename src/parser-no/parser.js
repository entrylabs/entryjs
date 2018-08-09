/*
 *
 */
'use strict';

Entry.Parser = function(mode, syntax, cm) {
    this._mode = mode; // maze ai workspace
    this.syntax = {};
    this.codeMirror = cm;
    this._lang = syntax || 'js';
    this.availableCode = [];

    if (mode === 'maze') {
        this._stageId = Number(Ntry.configManager.getConfig('stageId'));
        if (typeof NtryData == 'object') {
            var configCode = NtryData.config[this._stageId].availableCode;
            var playerCode = NtryData.player[this._stageId].code;
            this.setAvailableCode(configCode, playerCode);
        }
    }
    this.mappingSyntax(mode);

    switch (this._lang) {
        case 'js':
            this._parser = new Entry.JSParser(this.syntax);

            var syntax = this.syntax;

            var assistScope = {};

            for (var key in syntax.Scope) {
                assistScope[key + '();\n'] = syntax.Scope[key];
            }

            if ('BasicIf' in syntax) {
                assistScope['front'] = 'BasicIf';
            }

            CodeMirror.commands.javascriptComplete = function(cm) {
                CodeMirror.showHint(cm, null, { globalScope: assistScope });
            };

            cm.on('keyup', function(cm, event) {
                if (
                    !cm.state.completionActive &&
                    (event.keyCode >= 65 && event.keyCode <= 95)
                ) {
                    CodeMirror.showHint(cm, null, {
                        completeSingle: false,
                        globalScope: assistScope,
                    });
                }
            });

            break;
        case 'block':
            this._parser = new Entry.BlockParser(this.syntax);
            break;
    }
};

(function(p) {
    p.parse = function(code) {
        var result = null;

        switch (this._lang) {
            case 'js':
                try {
                    var astTree = acorn.parse(code);
                    result = this._parser.Program(astTree);
                } catch (error) {
                    if (this.codeMirror) {
                        var annotation;
                        if (error instanceof SyntaxError) {
                            annotation = {
                                from: {
                                    line: error.loc.line - 1,
                                    ch: error.loc.column - 2,
                                },
                                to: {
                                    line: error.loc.line - 1,
                                    ch: error.loc.column + 1,
                                },
                            };
                            error.message = '문법 오류입니다.';
                        } else {
                            annotation = this.getLineNumber(
                                error.node.start,
                                error.node.end
                            );
                            annotation.message = error.message;
                            annotation.severity = 'error';
                            this.codeMirror.markText(
                                annotation.from,
                                annotation.to,
                                {
                                    className: 'CodeMirror-lint-mark-error',
                                    __annotation: annotation,
                                    clearOnEnter: true,
                                }
                            );
                        }

                        Entry.toast.alert('Error', error.message);
                    }
                    result = [];
                }
                break;
            case 'block':
                var textCode = this._parser.Code(code);
                var textArr = textCode.match(/(.*{.*[\S|\s]+?}|.+)/g);
                if (Array.isArray(textArr)) {
                    result = textArr.reduce(function(prev, current, index) {
                        var temp = '';

                        if (index === 1) {
                            prev = prev + '\n';
                        }
                        if (current.indexOf('function') > -1) {
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
        }

        return result;
    };

    p.getLineNumber = function(start, end) {
        var value = this.codeMirror.getValue();
        var lines = {
            from: {},
            to: {},
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
                if (!syntaxArray) continue;
                var syntax = this.syntax;
                for (var j = 0; j < syntaxArray.length; j++) {
                    var key = syntaxArray[j];
                    if (
                        j === syntaxArray.length - 2 &&
                        typeof syntaxArray[j + 1] === 'function'
                    ) {
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

    p.setAvailableCode = function(configCode, playerCode) {
        var availableList = [];
        configCode.forEach(function(items, i) {
            items.forEach(function(item, i) {
                availableList.push(item.type);
            });
        });

        if (playerCode instanceof Entry.Code) {
            var blocks = playerCode.getBlockList();
            blocks.forEach(function(item) {
                if (
                    item.type !== NtryData.START &&
                    availableList.indexOf(item.type) === -1
                )
                    availableList.push(item.type);
            });
        } else {
            playerCode.forEach(function(items, i) {
                items.forEach(function(item, i) {
                    if (
                        item.type !== NtryData.START &&
                        availableList.indexOf(item.type) === -1
                    ) {
                        availableList.push(item.type);
                    }
                });
            });
        }

        this.availableCode = this.availableCode.concat(availableList);
    };
})(Entry.Parser.prototype);
