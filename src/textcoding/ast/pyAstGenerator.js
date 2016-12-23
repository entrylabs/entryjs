/*
 *
 */
"use strict";

goog.provide("Entry.PyAstGenerator");

Entry.PyAstGenerator = function() {
    
};

(function(p){
    p.generate = function(code) {
    	var filbertParse = filbert.parse;
        var locations = true;
        var ranges = true;
        var options = { locations: locations, ranges: ranges };
        try {
            var astTree = filbertParse(code, options);
            return astTree;
        }
        catch (error) { 
            var msgTokens = error.message.split('\''); 
            var title = Entry.TextCodingError.TITLE_SYNTAX;
            console.log("msgTokens", msgTokens);

            if(msgTokens[0].trim() == "Unexpected token") {
                var message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_TOKEN;
                var subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            }
            else if(msgTokens[0].trim() == "Unexpected character") {
                var message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                var subject = Entry.TextCodingError.SUBJECT_SYNTAX_CHARACTER;
            }
            else if(msgTokens[0].trim() == "Unexpected indent") {
                var message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                var subject = Entry.TextCodingError.SUBJECT_SYNTAX_INDENT
            }
            else {
                var message = Entry.TextCodingError.MESSAGE_SYNTAX_DEFAULT;
                var subject = Entry.TextCodingError.SUBJECT_SYNTAX_DEFAULT;
            }

            if(msgTokens[1])
                var keyword = msgTokens[1];

            error.title = Lang.TextCoding[title];
            error.message = Lang.TextCoding[message];
            if(keyword)
                error.keyword = keyword;
            else
                error.keyword = '';
            error.subject = Lang.TextCoding[subject];
            
            throw error;
        }
    }
})(Entry.PyAstGenerator.prototype);