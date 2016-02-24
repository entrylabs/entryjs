/**
 * @fileoverview View element constructor
 * @author Kyumin Sim
 * @version 0.2
 */
"use strict";

goog.provide('Entry.SVG');

/**
 * Function for construct html dom element.
 * @function
 * @param {string} tag or html to construct dom element.
 * @param {?object} options include id, classes, parent etc.
 */
Entry.SVG = function (id) {
    var element = document.getElementById(id);
    return Entry.SVG.createElement(element);
};

Entry.SVG.NS = 'http://www.w3.org/2000/svg';
Entry.SVG.NS_XLINK = 'http://www.w3.org/1999/xlink';


Entry.SVG.createElement = function (tag, options) {
    var el;
    if (typeof tag === "string")
        el= document.createElementNS(Entry.SVG.NS, tag);
    else
        el = tag;

    if (options) {
        if (options.href) {
            el.setAttributeNS(Entry.SVG.NS_XLINK, 'href', options.href);
            delete options.href;
        }
        for (var key in options) {
            el.setAttribute(key, options[key]);
        }
    }

    if (this instanceof SVGElement)
        this.appendChild(el);

    el.elem = Entry.SVG.createElement;
    el.attr = Entry.SVG.attr;

    return el;
}

Entry.SVG.attr = function(options, property) {
    if (typeof options === "string") {
        var o = {};
        o[options] = property;
        options = o;
    }

    if (options) {
        if (options.href) {
            this.setAttributeNS(Entry.SVG.NS_XLINK, 'href', options.href);
            delete options.href;
        }
        for (var key in options) {
            this.setAttribute(key, options[key]);
        }
    }

    return this;
}
