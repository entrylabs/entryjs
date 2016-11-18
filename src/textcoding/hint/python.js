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
    this.syntax = syntax;

    function pythonHint(editor) {
        var cur = editor.getCursor(), token = editor.getTokenAt(cur);
        // If it's not a 'word-style' token, ignore the token.

        /////////////////////////////////////////////////////////////
        //Entry Event added by jhlee
        /////////////////////////////////////////////////////////////
        var defTokens = ["def entry_event_start", "def entry_event_mouse_up", "def entry_event_object_down", 
                        "def entry_event_object_up", "def entry_event_scene_start", "def entry_event_clone_create", 
                        "def entry_event_clone_create", "def entry_event_signal", "def entry_event_key"];

        var defMaps = [];
        for(var d in defTokens) {
            var defToken = defTokens[d];
            if(defToken == "def entry_event_signal") {
                defMaps.push({
                    displayText: defToken,
                    text: defToken + "(\"None\"):"
                });
            }
            else if(defToken == "def entry_event_key") {
                defMaps.push({
                    displayText: defToken,
                    text: defToken + "(\"Q\"):"
                });
            } 
            else {
                defMaps.push({
                    displayText: defToken,
                    text: defToken + "():"
                });
            }
        }

        var found = [], current = token.string;

        console.log("token", token);
        
        if(token.string.includes("def")) {
            found = found.concat(fuzzySearch(
                    defMaps, current,
                    {extract: function(e) {return e.displayText}}));
            /////////////////////////////////////////////////////////////
            //end part of Entry Event added by jhlee
            /////////////////////////////////////////////////////////////
        } 
        else if (!/^[\w$_]*$/.test(token.string)) {
                token = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                    className: token.string == ":" ? "python-type" : null};
        }

        var base;

        if(token.type == "def") {
            defMaps.map(function(keyword, index) {
                console.log("def keyoword", keyword);
                keyword.displayText = keyword.displayText.split("def")[1].trim();
                keyword.text = keyword.text.split("def")[1].trim();
            });

            found = found.concat(fuzzySearch(
                    defMaps, current,
                    {extract: function(e) {return e.displayText}}));
        }
        else if (token.type == "variable" || token.string == "set" || token.string == "print" || token.string == "is") {
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

    var hwObjects = ["Codeino", "Arduino", "Xbot", "Dplay", "Sensorboard", 
                    "Nemoino", "Hamster", "Albert", "Bitbrick", "Neobot", "Robotis"];
    var globalKeywords =
        "Entry,self,Hw,while True,True,False,break,for i in range(),if,if else,len,random.randint";
    var globalKeywordsL = globalKeywords.split(",");

    var syntaxMap = {_global: []};

    //the start of temporary implementation by jhlee
    console.log("fuzzy this.syntax", syntax);

    var blocks = Entry.block; 
    for (var key in blocks) {
        var block = blocks[key];
        var syntax = block.syntax;
        if (!syntax || !syntax.py)
            continue;

        syntax = syntax.py.join("");
        syntax = syntax.split('.');
        
        if(syntax[0].indexOf("def ") > -1) { 
            syntax = syntax[0].split(' ');
        }
        else if(syntax.length === 1)
            continue;

        var objName = syntax.shift();

        var isHwObjectName = false;
        for(var h in hwObjects) {
            var hwObject = hwObjects[h];
            if(objName == hwObject || objName == "hw")
                isHwObjectName = true;
        }

        if(isHwObjectName)
            continue;

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


        var isHwObjectName = false;
        for(var h in hwObjects) {
            var hwObject = hwObjects[h];
            if(objName == hwObject || objName == "hw")
                isHwObjectName = true;
        }

        if(isHwObjectName)
            continue;

        if(objName == "def") {
            syntaxMap._global.push({
                displayText: objName + " " + operator,
                text: objName + " " + operator + paramPart + ":"
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
