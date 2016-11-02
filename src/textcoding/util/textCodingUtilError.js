/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtilError");

Entry.TextCodingUtilError = {};

(function(tue) {
	tue.TC_ERROR_TITLE_SYNTAX = "tc_error_title_syntax";
	tue.TC_ERROR_TITLE_CONVERTING = "tc_error_title_converting";

	tue.TC_ERROR_MESSAGE_NO_BLOCK = "tc_error_message_no_block";
	tue.TC_ERROR_MESSAGE_NO_VARIABLE = "tc_error_message_no_variable";
	tue.TC_ERROR_MESSAGE_NO_LIST = "tc_error_message_no_list";
	tue.TC_ERROR_MESSAGE_OBJECT ="tc_error_message_no_object";

	var error = {};
 
	tue.error = function(title, message, keyword, line) {
		console.log("error control", title, message, keyword, line);
		var errorInfo = this.getErrorInfo(title, message, keyword);
		console.log("errorInfo", errorInfo);
		error.title = errorInfo.title;
		error.message = errorInfo.message; 
		error.line = line;
		throw error;
	};

	tue.getErrorInfo = function(title, message, keyword) {
		var info = {};
		console.log("getErrorInfo", Lang.TextCoding[title]);
		info.title = Lang.TextCoding[title];
		info.message = "\'" + keyword + "\'" + Lang.TextCoding[message];

		return info;

	};
})(Entry.TextCodingUtilError); 