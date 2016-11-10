/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingError");

Entry.TextCodingError = {};

(function(tce) {
	tce.TITLE_SYNTAX = "title_syntax";
	tce.TITLE_CONVERTING = "title_converting";

	tce.MESSAGE_NO_BLOCK = "message_no_block";
	tce.MESSAGE_NO_VARIABLE = "message_no_variable";
	tce.MESSAGE_NO_LIST = "message_no_list";
	tce.MESSAGE_NO_OBJECT ="message_no_object";

	var error = {};
 
	tce.error = function(title, message, keyword, line) {
		console.log("error control", title, message, keyword, line);
		var errorInfo = this.getErrorInfo(title, message, keyword);
		console.log("errorInfo", errorInfo);
		error.title = errorInfo.title;
		error.message = errorInfo.message;  
		error.line = line;
		throw error;
	};

	tce.getErrorInfo = function(title, message, keyword) {
		var info = {};
		console.log("getErrorInfo", Lang.TextCoding[title]);
		info.title = Lang.TextCoding[title];
		info.message = "\'" + keyword + "\'" + Lang.TextCoding[message];

		return info;

	};
})(Entry.TextCodingError); 