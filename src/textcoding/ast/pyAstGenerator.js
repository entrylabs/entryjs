/*
 *
 */
'use strict';

Entry.PyAstGenerator = function() {};

(function(p) {
    p.generate = function(code) {
        var filbertParse = filbert.parse;
        var locations = true;
        var ranges = true;
        var options = { locations: locations, ranges: ranges };
        try {
            var astTree = filbertParse(code, options);
            return astTree;
        } catch (error) {
            var msgTokens = error.message.split("'");
            var title = Entry.TextCodingError.TITLE_SYNTAX;
            console.log('msgTokens', msgTokens);

            var message, subject;
            if (error.expectedType && error.tokType) {
                if (error.tokType === 'eof' || error.tokType === 'newline')
                    message =
                        Lang.TextCoding.message_conv_is_expect1 +
                        this.getTokenLang(error.expectedType) +
                        Lang.TextCoding.message_conv_is_expect2;
                else
                    message = Lang.TextCoding.message_conv_instead
                        .replace('%1', this.getTokenLang(error.tokType))
                        .replace('%2', this.getTokenLang(error.expectedType));
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (error.tokType) {
                if (error.tokType === 'eof' || error.tokType === 'newline')
                    message =
                        Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_TOKEN;
                else
                    message =
                        Lang.TextCoding.message_conv_is_wrong1 +
                        this.getTokenLang(error.tokType) +
                        Lang.TextCoding.message_conv_is_wrong2;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (msgTokens[0].trim() == 'Unexpected token') {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_TOKEN;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_TOKEN;
            } else if (msgTokens[0].trim() == 'Unexpected character') {
                message =
                    Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_CHARACTER;
            } else if (msgTokens[0].trim() == 'Reserved variable word') {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_RESERVED_TOKEN;
                subject = Entry.TextCodingError.SUBJECT_CONV_VARIABLE;
            } else if (msgTokens[0].trim() == 'Reserved list word') {
                message =
                    Entry.TextCodingError.MESSAGE_SYNTAX_RESERVED_TOKEN_LIST;
                subject = Entry.TextCodingError.SUBJECT_CONV_LIST;
            } else if (msgTokens[0].trim() == 'Unexpected indent') {
                message =
                    Entry.TextCodingError.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_INDENT;
            } else {
                message = Entry.TextCodingError.MESSAGE_SYNTAX_DEFAULT;
                subject = Entry.TextCodingError.SUBJECT_SYNTAX_DEFAULT;
            }

            if (msgTokens[1]) var keyword = msgTokens[1];

            error.title = Lang.TextCoding[title] || title;
            error.message = Lang.TextCoding[message] || message;
            error.keyword = keyword || '';
            error.subject = Lang.TextCoding[subject] || subject;

            throw error;
        }
    };

    p.getTokenLang = function(token) {
        if (Array.isArray(token)) {
            var tokens = token.map(this._getTokenLang);
            var lastToken = tokens.pop();
            return (
                tokens.join(', ') + Lang.TextCoding.message_conv_or + lastToken
            );
        } else return this._getTokenLang(token);
    };

    p._getTokenLang = function(token) {
        return Lang.TextCoding[token] || '"' + token + '"';
    };
})(Entry.PyAstGenerator.prototype);
