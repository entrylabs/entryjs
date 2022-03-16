/*
 *
 */
'use strict';

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
//
Entry.PyHint = function(syntax) {
    this.setSyntax(syntax);
    this.lastHW = null;

    this._blockMenu = Entry.getMainWS().blockMenu;

    CodeMirror.registerHelper('hint', 'python', this.pythonHint.bind(this));

    var hwFunc = function(e) {
        if (Entry.hw.hwModule) {
            var name = Entry.hw.hwModule.name;
            name = name[0].toUpperCase() + name.slice(1);
            if (name === 'ArduinoExt') this.addScope('Arduino', 'Ext');
            else this.addScope(name);
            this.lastHW = name;
        } else {
            this.removeScope(this.lastHW);
            this.lastHW = null;
        }
    }.bind(this);

    var hwLiteFunc = function(e) {
        if (Entry.hwLite.hwModule) {
            var name = Entry.hwLite.hwModule.name;
            name = name[0].toUpperCase() + name.slice(1);
            if (name === 'ArduinoExt') this.addScope('Arduino', 'Ext');
            else this.addScope(name);
            this.lastHW = name;
        } else {
            this.removeScope(this.lastHW);
            this.lastHW = null;
        }
    };

    Entry.addEventListener('hwChanged', hwFunc);

    // Entry.addEventListener('hwLiteChanged', hwLiteFunc);

    if (Entry.hw.hwModule) hwFunc();
};

(function(p) {
    p.pythonHint = function(editor) {
        var cur = editor.getCursor(),
            tokens = editor.getLineTokens(cur.line);
        var lastToken = tokens.pop();
        var result = [],
            menuResult = [];

        while (lastToken && cur.ch <= lastToken.start) lastToken = tokens.pop();

        if (!lastToken) return null;

        var searchString;
        var start = lastToken.start;
        var hintFunc = this.hintFunc;
        var syntax = this.syntax;

        switch (lastToken.type) {
            case 'builtin':
                if (
                    tokens[tokens.length - 2] &&
                    tokens[tokens.length - 2].string === 'def'
                )
                    searchString = null;
                else searchString = lastToken.string;
            case 'def':
                if (!searchString) {
                    var defToken = tokens[tokens.length - 2];
                    if (defToken) {
                        searchString = 'def ' + lastToken.string;
                        start = defToken.start;
                    }
                }
            case 'keyword':
                if (!searchString) searchString = lastToken.string;
            case 'variable':
                if (!searchString) searchString = lastToken.string;
                result = this.fuzzySearch(
                    this.getScope('_global'),
                    searchString
                );
                result = result.map(function(key) {
                    var localSyntax = syntax;
                    var displayText = key.split('#')[0];
                    displayText = displayText.split('\n').join(' ');
                    displayText = displayText.replace(/%\d+/gi, '');
                    displayText = displayText.replace(/\$\d+/gi, '');
                    var localKey;
                    if (key.indexOf('.') > -1) {
                        key = key.split('.');
                        localSyntax = syntax[key[0]];
                        localKey = key.shift();
                        key = key.join('.');
                    }
                    if (localSyntax[key].key)
                        menuResult.push(this.getMenuElement(localSyntax[key]));
                    return {
                        displayText: displayText,
                        hint: hintFunc,
                        syntax: localSyntax[key],
                        localKey: localKey,
                    };
                }, this);
                break;
            case 'property':
                var variableToken = tokens[tokens.length - 2];
                if (!variableToken) break;
                var searchResult;
                var searchScope = this.getScope(variableToken.string);
                if (searchScope.length)
                    searchResult = this.fuzzySearch(
                        searchScope,
                        lastToken.string
                    );
                else if (
                    Entry.variableContainer.getListByName(variableToken.string)
                ) {
                    searchResult = this.fuzzySearch(
                        this.getScope('%2'),
                        lastToken.string
                    );
                    variableToken.string = '%2';
                } else searchResult = [];
                result = searchResult.map(function(key) {
                    var displayText = key.split('#')[0];
                    displayText = displayText.split('\n')[0];
                    return {
                        displayText: displayText,
                        hint: hintFunc,
                        syntax: syntax[variableToken.string][key],
                    };
                });
                var scope = this.syntax[variableToken.string];
                menuResult = searchResult.map(function(key) {
                    return this.getMenuElement(scope[key]);
                }, this);
                break;
            default:
                break;
        }

        if (menuResult.length) this._blockMenu._setDynamic(menuResult);
        else this._blockMenu._cancelDynamic();
        return {
            list: result, // for optimize
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, lastToken.end),
        };
    };

    p.addScope = function(name, extName) {
        if (this.syntax[name] && !this.scope[name]) {
            var syntax = this.syntax;
            if (name === 'Chocopi') {
                for (var key in this.syntax) {
                    if (
                        syntax[key].syntax &&
                        key.indexOf('%') < 0 &&
                        syntax[key].key.indexOf('function_field') < 0
                    ) {
                        if (key.substr(0, 6) === 'def on')
                            this.scope._global.push(key);
                    }
                }
            }
            syntax = this.syntax[name];
            var keys = Object.keys(syntax);
            keys = keys.filter(function(k) {
                var blockSyntax = Entry.block[syntax[k].key];
                if (
                    name === 'Arduino' &&
                    (extName === 'Ext') !==
                        (blockSyntax.class &&
                            blockSyntax.class.indexOf('Ext') > 0)
                )
                    return false;
                return k.indexOf('#') < 0 && !blockSyntax.deprecated;
            });
            this.scope[name] = keys;
            this.scope._global.unshift(name);
            keys = keys.map(function(k) {
                return name + '.' + k;
            });
            this.scope._global = this.scope._global.concat(keys);
        }
    };

    p.removeScope = function(name) {
        if (this.scope[name]) {
            var syntax = this.syntax[name];
            var keys = Object.keys(syntax);
            keys = keys.filter(function(k) {
                return (
                    k.indexOf('#') < 0 && !Entry.block[syntax[k].key].deprecated
                );
            });
            keys = keys.map(function(k) {
                return name + '.' + k;
            });

            this.scope._global.splice(this.scope._global.indexOf(name), 1);
            while (keys.length) {
                var key = keys.pop();
                this.scope._global.splice(this.scope._global.indexOf(key), 1);
            }
            delete this.scope[name];
        }
    };

    p.getScope = function(name) {
        if (this.scope[name]) return this.scope[name];
        else return [];
    };

    p.fuzzySearch = function(arr, start, options) {
        options = options || {};
        options.escapeLetter = '#';
        var result = Entry.Utils.fuzzy.filter(start, arr, options).slice(0, 20);
        result = result.map(function(o) {
            return o.original;
        });
        return result;
    };

    p.hintFunc = function(cm, self, data) {
        var text;
        var syntax = data.syntax;
        var ch = self.from.ch;
        if (!syntax.syntax) {
            text = data.displayText + '.';
            ch += text.length;
        } else {
            text = syntax.syntax;
            if (data.localKey) {
                text = data.localKey + '.' + text;
            }
            text = text.split('.');
            if (text.length > 1) text.shift();
            text = text.join('.');
            if (text.indexOf('%') > -1) {
                ch += text.indexOf('%');
                text = text.replace(/%\d+/gi, '');
            } else {
                ch += text.length;
            }
            text = text.replace(/\$\d+/gi, '');
        }
        if (text.indexOf('\n') > -1) {
            text = text.split('\n').join('\n' + '\t'.repeat(self.from.ch));
        }
        if (text.indexOf(':') > -1) {
            var cur = cm.getCursor(),
                tokens = cm.getLineTokens(cur.line);
            var newStart = tokens.shift();
            while (tokens.length) {
                if (newStart.type === 'keyword') break;
                newStart = tokens.shift();
            }
            ch -= self.from.ch - newStart.start;
            self.from.ch = newStart.start;
        }

        cm.replaceRange(text, self.from, self.to);
        cm.setCursor({ line: self.from.line, ch: ch });
        Entry.helper.renderBlock(data.syntax.key);
    };

    p.setSyntax = function(syntax) {
        this.syntax = syntax;
        this.scope = {};
        this.scope._global = [];
        this.scope._list = [];
        for (var key in syntax) {
            if (
                syntax[key].syntax &&
                key.indexOf('%') < 0 &&
                syntax[key].key.indexOf('function_field') < 0
            ) {
                if (key.substr(0, 6) === 'def on') continue;
                this.scope._global.push(key);
            } else if (key.substr(0, 2) === 'if') this.scope._global.push(key);
            else if (key.substr(0, 5) === 'while') this.scope._global.push(key);
        }
        this.addScope('Entry');
        this.addScope('random');
        this.addScope('math');
        this.addScope('%2', '_list');

        if (this.lastHW) this.addScope(this.lastHW);
    };

    p.getMenuElement = function(blockSyntax) {
        var blockType = blockSyntax.key;
        if (
            blockSyntax.isDefault &&
            Entry.playground.mainWorkspace.blockMenu.getThreadByBlockKey(
                blockType
            )
        ) {
            return blockType;
        } else {
            var params = [];
            if (blockSyntax.params) params = params.concat(blockSyntax.params);
            return [
                blockSyntax.syntax,
                {
                    type: blockType,
                    params: params,
                },
            ];
        }
    };
})(Entry.PyHint.prototype);
