/*
 *
 */
"use strict";

goog.provide("Entry.PyHint");

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
//
Entry.PyHint = function() {
    CodeMirror.registerHelper("hint", "python", pythonHint);

    function pythonHint(editor) {
        var cur = editor.getCursor(), token = editor.getTokenAt(cur);
        // If it's not a 'word-style' token, ignore the token.

        if (!/^[\w$_]*$/.test(token.string)) {
            token = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                className: token.string == ":" ? "python-type" : null};
        }

        var found = [], current = token.string;

        var base;

        if (token.type == "variable") {
            base = token.string;
            if (base != null) {
                found = found.concat(fuzzySearch(globalKeywordsL, current));
                found = found.concat(fuzzySearch(
                    syntaxMap._global, current,
                    {extract: function(e) {return e.displayText}}));
            }
        }
        else if (token.type == "property" || token.type == "variable-2" ||
                token.state.lastToken == ".") {
            base = token.string;
            var tokens = editor.getLineTokens(cur.line);
            var firstToken = tokens.shift();

            while (firstToken.type !== "variable" && firstToken.type !== "variable-2" )
                firstToken = tokens.shift();
            var currentVariable = firstToken.string;

            if (base != null) {
                if (syntaxMap[currentVariable]) {
                    found = found.concat(fuzzySearch(
                        syntaxMap[currentVariable], current,
                        {extract: function(e) {return e.displayText}}));
                }
            }
            if (token.state.lastToken == ".") {
                found = found.concat(syntaxMap[currentVariable]);
            }
        }

        return {list: found.slice(0, 25), // for optimize
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)};
    }

    var globalKeywords =
        "Entry,self,Hw,while True,True,False,break,for i in range,if,if else,len,random.randint";
    var globalKeywordsL = globalKeywords.split(",");

    var syntaxMap = {_global: []};

    var blocks = Entry.block; 
    for (var key in blocks) {
        var block = blocks[key];
        var syntax = block.syntax;
        if (!syntax || !syntax.py)
            continue;
        syntax = syntax.py.join("");
        syntax = syntax.split('.');
        //console.log("syntax", syntax, "include", syntax[0].indexOf("def"));
        
        if(syntax[0].indexOf("def ") > -1) {
            syntax = syntax[0].split(' ');
        }
        else if(syntax.length === 1)
            continue;

        var objName = syntax.shift();

        if (!syntaxMap[objName]) {
            syntaxMap[objName] = [];
            syntaxMap._global.push({
                displayText: objName,
                text: objName
            });
        }

        syntax = syntax[0].split(',');
        var paramPart = "(" + new Array(syntax.length).join(" , ") + ")";
        var operator = syntax[0].split('(')[0];
        syntaxMap[objName].push({
            displayText: operator,
            text: operator + paramPart
        });

        if(objName == "def") {
            syntaxMap._global.push({
                displayText: objName + " " + operator,
                text: objName + " " + operator + paramPart
            });
        } 
        else {
            syntaxMap._global.push({
                displayText: objName + "." + operator,
                text: objName + "." + operator + paramPart
            });
        }
    }

    function fuzzySearch(arr, start, options) {
        var result = fuzzy.filter(start, arr, options);
        result = result.map(function(o){return o.original});
        return result;
    }
};
