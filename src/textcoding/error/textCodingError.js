/*
 *
 */
'use strict';

Entry.TextCodingError = {};

(function(tce) {
    tce.TITLE_SYNTAX = 'title_syntax';
    tce.TITLE_CONVERTING = 'title_converting';

    tce.MESSAGE_SYNTAX_DEFAULT = 'message_syntax_default';
    tce.MESSAGE_SYNTAX_UNEXPECTED_TOKEN = 'message_syntax_unexpected_token';
    tce.MESSAGE_SYNTAX_UNEXPECTED_CHARACTER = 'message_syntax_unexpected_character';
    tce.MESSAGE_SYNTAX_UNEXPECTED_INDENT = 'message_syntax_unexpected_indent';
    tce.MESSAGE_SYNTAX_RESERVED_TOKEN = 'message_syntax_reserved_token';
    tce.MESSAGE_SYNTAX_RESERVED_TOKEN_LIST = 'message_syntax_reserved_token_list';

    tce.MESSAGE_CONV_DEFAULT = 'message_conv_default';
    tce.MESSAGE_CONV_NO_SUPPORT = 'message_conv_no_support';
    tce.MESSAGE_CONV_NO_VARIABLE = 'message_conv_no_variable';
    tce.MESSAGE_CONV_NO_LIST = 'message_conv_no_list';
    tce.MESSAGE_CONV_NO_OBJECT = 'message_conv_no_object';
    tce.MESSAGE_CONV_NO_FUNCTION = 'message_conv_no_function';
    tce.MESSAGE_CONV_NO_ENTRY_EVENT_FUNCTION = 'message_conv_no_entry_event_function';

    tce.SUBJECT_SYNTAX_DEFAULT = 'subject_syntax_default';
    tce.SUBJECT_SYNTAX_TOKEN = 'subject_syntax_token';
    tce.SUBJECT_SYNTAX_CHARACTER = 'subject_syntax_character';
    tce.SUBJECT_SYNTAX_INDENT = 'subject_syntax_indent';

    tce.SUBJECT_CONV_DEFAULT = 'subject_conv_default';
    tce.SUBJECT_CONV_GENERAL = 'subject_conv_general';
    tce.SUBJECT_CONV_VARIABLE = 'subject_conv_variable';
    tce.SUBJECT_CONV_LIST = 'subject_conv_list';
    tce.SUBJECT_CONV_OBJECT = 'subject_conv_object';
    tce.SUBJECT_CONV_FUNCTION = 'subject_conv_function';

    //No Converting Message
    tce.ALERT_VARIABLE_EMPTY_TEXT_ADD_CHANGE = 'alert_variable_empty_text_add_change';
    tce.ALERT_LIST_EMPTY_TEXT_ADD_CHANGE = 'alert_list_empty_text_add_change';
    tce.ALERT_LIST_CONTAINS_EXCEED_LENGTH_VALUE = 'alert_list_contains_exceed_length_value';
    tce.ALERT_FUNCTION_NAME_EMPTY_TEXT_ADD_CHANGE = 'alert_function_name_empty_text_add_change';
    tce.ALERT_VARIABLE_EMPTY_TEXT = 'alert_variable_empty_text';
    tce.ALERT_LIST_EMPTY_TEXT = 'alert_list_empty_text';
    tce.ALERT_FUNCTION_NAME_FIELD_MULTI = 'alert_function_name_field_multi';
    tce.ALERT_FUNCTION_NAME_DISORDER = 'alert_function_name_disorder';
    tce.ALERT_FUNCTION_HAS_BOOLEAN = 'alert_function_has_boolean';
    tce.ALERT_FUNCTION_EDITOR = 'alert_function_editor';
    tce.ALERT_FUNCTION_NO_SUPPORT = 'alert_function_no_support';
    tce.ALERT_LIST_NO_SUPPORT = 'alert_list_no_support';
    tce.ALERT_VARIABLE_NO_SUPPORT = 'alert_variable_no_support';
    tce.ALERT_SIGNAL_NO_SUPPORT = 'alert_signal_no_support';
    tce.ALERT_LEGACY_NO_SUPPORT = 'alert_legacy_no_support';
    tce.ALERT_NO_SAVE_ON_ERROR = 'alert_no_save_on_error';
    tce.ALERT_API_NO_SUPPORT = 'alert_api_no_support';

    const error = {};

    tce.error = function(title, message, keyword, line, subject) {
        console.log('error control', title, message, keyword, line);
        const errorInfo = this.getErrorInfo(title, message, keyword, line, subject);
        error.title = errorInfo.title;
        error.message = errorInfo.message;
        error.line = line;
        throw error;
    };

    tce.getErrorInfo = function(title, message, keyword, line, subject) {
        const info = {};
        info.title = Lang.TextCoding[title];
        var message = Lang.TextCoding[message];

        let contents;
        if (keyword) {
            var kw = `'${keyword}' `;
        } else {
            var kw = '';
        }

        if (subject) {
            var sj = Lang.TextCoding[subject];
        } else {
            var sj = Lang.TextCoding[this.SUBJECT_CONV_GENERAL];
        }

        if (typeof line === 'object') {
            line = line.start.line + 2;
        }

        contents = `[${sj}]` + ` ${kw} : ${message} ` + `(line ${line})`;

        info.message = contents;

        return info;
    };
})(Entry.TextCodingError);
