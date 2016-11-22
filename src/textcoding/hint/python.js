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
    this.scope._global = Object.keys(syntax);
    this._blockMenu = Entry.playground.mainWorkspace.blockMenu;

    CodeMirror.registerHelper("hint", "python", this.pythonHint.bind(this));
};

(function(p) {
    p.pythonHint = function(editor) {
        var cur = editor.getCursor(), tokens = editor.getLineTokens(cur.line);
        var lastToken = tokens[tokens.length - 1];
        var result = [], menuResult = [];

        // If it's not a 'word-style' token, ignore the token.


        if (!lastToken) return null;

        switch(lastToken.type) {
            case "variable":
                result = this.fuzzySearch(this.getScope("_global"), lastToken.string).slice(0,20);
                result = result.map(function(key) {
                    return {
                        displayText: key,
                        text: key
                    }
                })
                break;
            case "property":
                var variableToken = tokens[tokens.length - 3];
                if (!variableToken)
                    break;
                var searchResult = this.fuzzySearch(this.getScope(variableToken.string), lastToken.string).slice(0,20);
                result = searchResult.map(function(key) {
                    return {
                        displayText: key,
                        text: key
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
            from: CodeMirror.Pos(cur.line, lastToken.start),
            to: CodeMirror.Pos(cur.line, lastToken.end)};
    }

    p.getScope = function(name) {
        if (this.scope[name]) return this.scope[name];
        else if (this.syntax[name]) {
            this.scope[name] = Object.keys(this.syntax[name]);
            return this.scope[name]
        } else {
            return [];
        }

    }

    p.fuzzySearch = function(arr, start, options) {
        var result = fuzzy.filter(start, arr, options);
        result = result.map(function(o){return o.original});
        return result;
    };

})(Entry.PyHint.prototype);
