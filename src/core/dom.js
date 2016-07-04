/**
 * @fileoverview View element constructor
 * @author Kyumin Sim
 * @version 0.2
 */
"use strict";

goog.provide('Entry.Dom');

/**
 * Function for construct html dom element.
 * @function
 * @param {string} tag or html to construct dom element.
 * @param {?object} options include id, classes, parent etc.
 */
Entry.Dom = function (tag, options) {
    var tagRegex = /<(\w+)>/,
        dom;

    if (tag instanceof HTMLElement) dom = $(tag);
    else if (tag instanceof jQuery) dom = tag;
    else if (tagRegex.test(tag)) dom = $(tag);
    else dom = $('<' + tag + '></' + tag + '>');

    if (options === undefined) return dom;
    if (options.id) dom.attr('id', options.id);
    if (options.class) dom.addClass(options.class);
    if (options.classes) options.classes.map(function (className) {dom.addClass(className);});
    if (options.src) dom.attr('src', options.src);
    if (options.parent) options.parent.append(dom);

    dom.bindOnClick = function() {
        var hasChild = false;
        var child;
        var func;

        var handler = function (e) {
            e.stopImmediatePropagation();
            if (e.handled) return;
            e.handled = true;
            func.call(this, e);
        }

        if(arguments.length > 1 ) {
            func = (arguments[1] instanceof Function) ? arguments[1] : function () {};
            child = (typeof arguments[0] === 'string') ? arguments[0] : '';
        } else {
            func = (arguments[0] instanceof Function) ? arguments[0] : function () {};
        }

        if(child) {
            $(this).on('click tab', child, handler);
        } else {
            $(this).on('click tab', handler);
        }
    };

    return dom;
};

