/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtilError");

Entry.TextCodingUtilError = {};

(function(tue) {
	this.TC_ERR_TITLE_SYNTAX = "title_syntax";
	this.TC_ERR_TITLE_CONVERTING = "title_converting";

	this.TC_ERR_MESSAGE_NO_BLOCK = "message_no_block";
	this.TC_ERR_MESSAGE_NO_VARIABLE = "message_no_variable";
	this.TC_ERR_MESSAGE_NO_LIST = "message_no_list";
	this.TC_ERR_MESSAGE_OBJECT ="message_no_object";

	var error = {};
	tue.error = function(title, message, keyword, line) {
		console.log("error control", title, message, keyword, line);
		var errorInfo = this.getErrorInfo(title, message, keyword);
		error.title = errorInfo.title;
		error.message = errorInfo.message;
		error.line = line;
		throw error;
	};

	tue.getErrorInfo = function(title, message, keyword) {
		var info = {};
		info.title = Lang.TextCoding.Error[title];
		info.message = "\'" + keyword + "\'" + Lang.textcoding[message];

		return info;

	};
})(Entry.TextCodingUtilError);