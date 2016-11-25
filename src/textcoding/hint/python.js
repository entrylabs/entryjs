/*
 *
 */
"use strict";

goog.provide("Entry.PyHint");

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
//
Entry.PyHint = function(syntax) {
    console.log(Entry.playground.mainWorkspace.vimBoard._parser.syntax);

    this.syntax = syntax;
    this.scope = {};

    this.scope._global = [];
    for (var key in syntax) {
        if (syntax[key].syntax && key.indexOf("%") < 0)
            this.scope._global.push(key)
    }
    this.addScope("Entry");

    this._blockMenu = Entry.playground.mainWorkspace.blockMenu;

    CodeMirror.registerHelper("hint", "python", this.pythonHint.bind(this));

    Entry.addEventListener('hwChanged', function(e){
        if (Entry.hw.hwModule) {
            var name = Entry.hw.hwModule.name;
            name = name[0].toUpperCase() + name.slice(1);
            this.addScope(name);
        }
    }.bind(this));
};

(function(p) {
    p.pythonHint = function(editor) {
        var cur = editor.getCursor(), tokens = editor.getLineTokens(cur.line);
        var lastToken = tokens[tokens.length - 1];
        var result = [], menuResult = [];

        console.log(tokens)

        // If it's not a 'word-style' token, ignore the token.


        if (!lastToken) return null;

        var searchString;
        var start = lastToken.start;
        var hintFunc = this.hintFunc;
        var syntax = this.syntax;

        switch(lastToken.type) {
            case "def":
                var defToken = tokens[tokens.length - 3];
                if (defToken) {
                    searchString = "def " + lastToken.string;
                    start = defToken.start;
                }
            case "keyword":
                if (!searchString)
                    searchString = lastToken.string;
            case "variable":
                if (!searchString)
                    searchString = lastToken.string;
                result = this.fuzzySearch(this.getScope("_global"), searchString).slice(0,20);
                result = result.map(function(key) {
                    var localSyntax = syntax;
                    var displayText = key.split("#")[0];
                    var localKey;
                    if (key.indexOf(".") > -1) {
                        key = key.split(".");
                        localSyntax = syntax[key[0]]
                        localKey = key[0];
                        key = key[1];
                    }
                    return {
                        displayText: displayText,
                        hint: hintFunc,
                        syntax: localSyntax[key],
                        localKey: localKey
                    }
                })
                break;
            case "property":
                var variableToken = tokens[tokens.length - 3];
                if (!variableToken)
                    break;
                var searchResult = this.fuzzySearch(this.getScope(variableToken.string), lastToken.string).slice(0,20);
                result = searchResult.map(function(key) {
                    var displayText = key.split("#")[0];
                    return {
                        displayText: displayText,
                        hint: hintFunc,
                        syntax: syntax[variableToken.string][key]
                    }
                })
                var scope = this.syntax[variableToken.string];
                menuResult = searchResult.map(function(key) {
                    return scope[key].key;
                })
                break;
            default:
                break;
        }

        if (menuResult.length)
            this._blockMenu._setDynamic(menuResult)
        else
            this._blockMenu._cancelDynamic()
        return {list: result, // for optimize
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, lastToken.end)};
    }

    p.addScope = function(name) {
        if (this.syntax[name]) {
            var keys = Object.keys(this.syntax[name]);
            this.scope[name] = keys;
            this.scope._global.unshift(name);
            keys = keys.map(function(k) {return name + "." + k});
            this.scope._global = this.scope._global.concat(keys)
        }
    };

    p.getScope = function(name) {
        if (this.scope[name]) return this.scope[name];
        else return [];
    }

    p.fuzzySearch = function(arr, start, options) {
        var result = fuzzy.filter(start, arr, options);
        result = result.map(function(o){return o.original});
        return result;
    };

    p.hintFunc = function(cm, self, data) {
        console.log(cm, self, data);
        var text;
        var syntax = data.syntax;
        var ch = self.from.ch;
        if (!syntax.syntax) {
            text = data.displayText + ".";
            ch += text.length;
        } else {
            text = syntax.syntax.split("\n");
            text = text[0];
            if (data.localKey) {
                text = data.localKey + "." + text;
            }
            console.log(text);
            text = text.split(".");
            if (text.length > 1)
                text.shift();
            text = text.join(".");
            if (text.indexOf("%") > -1) {
                text = text.replace(/%\d+/gi, "");
                ch += text.indexOf("(") + 1;
            } else {
                ch += text.length;
            }
        }

        cm.replaceRange(text, self.from, self.to)
        cm.setCursor({line: self.from.line, ch: ch})
    };

})(Entry.PyHint.prototype);
