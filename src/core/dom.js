/**
 * @fileoverview View element constructor
 * @author Kyumin Sim
 * @version 0.2
 */

goog.provide('Entry.Dom');

"use strict";
/**
 * Function for construct html dom element.
 * @function
 * @param {string} tag or html to construct dom element.
 * @param {?object} options include id, classes, parent etc.
 */
Entry.Dom = function (tag, options) {
    var tagRegex = /<(\w+)>/,
        dom;

    if (tag instanceof HTMLElement)
        dom = $(tag);
    else if (tag instanceof jQuery)
        dom = tag;
    else if (tagRegex.test(tag))
        dom = $(tag);
    else
        dom = $('<' + tag + '></' + tag + '>');

    if (options === undefined)
        return dom;

    if (options.id)
        dom.attr('id', options.id);

    if (options.class)
        dom.addClass(options.class);

    if (options.classes)
        options.classes.map(function (className) { dom.addClass(className) });

    return dom;
};

