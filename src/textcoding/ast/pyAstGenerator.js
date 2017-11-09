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

            var message, subject;
            if (error.expectedType && error.tokType) {
                if (error.tokType === "eof" || error.tokType === "newline")
                    message = this.getTokenLang(error.expectedType) + " 가 필요합니다.";
                else
                    message = this.getTokenLang(error.tokType) + " 대신 " + this.getTokenLang(error.expectedType) + " 가 필요합니다.";
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (error.tokType) {
                if (error.tokType === "eof" || error.tokType === "newline")
                    message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_TOKEN;
                else
                    message = this.getTokenLang(error.tokType) + " 는 올 수 없습니다.";
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (msgTokens[0].trim() == "Unexpected token") {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_TOKEN;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (msgTokens[0].trim() == "Unexpected character") {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_CHARACTER;
            } else if(msgTokens[0].trim() == "Reserved variable word") {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_RESERVED_TOKEN;
                subject = Entry.TextCodingError.SUBJECT_CONV_VARIABLE;
            } else if(msgTokens[0].trim() == "Reserved list word") {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_RESERVED_TOKEN_LIST;
                subject = Entry.TextCodingError.SUBJECT_CONV_LIST;
            } else if(msgTokens[0].trim() == "Unexpected indent") {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_INDENT;
            } else {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_DEFAULT;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_DEFAULT;
            }

            if(msgTokens[1])
                var keyword = msgTokens[1];

            error.title = Lang.TextCoding[title] || title;
            error.message = Lang.TextCoding[message] || message;
            error.keyword = keyword || "";
            error.subject = Lang.TextCoding[subject] || subject;
            
            throw error;
        }
    };

    p.getTokenLang = function(token) {
        if (Array.isArray(token))
            return token.map(this._getTokenLang).join(", ");
        else
            return this._getTokenLang(token);
    };
    
    p._getTokenLang = function(token) {
        return Lang.TextCoding[token] || "\"" + token + "\"";
    };
})(Entry.PyAstGenerator.prototype);