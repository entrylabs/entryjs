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
Entry.SVG = function (id , svgDom) {
    var element = svgDom ? svgDom : document.getElementById(id);
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

    //add util functions
    el.elem = Entry.SVG.createElement;
    el.attr = Entry.SVG.attr;
    el.addClass = Entry.SVG.addClass;
    el.removeClass = Entry.SVG.removeClass;
    el.hasClass = Entry.SVG.hasClass;
    el.remove = Entry.SVG.remove;
    el.removeAttr = Entry.SVG.removeAttr;

    if (tag === "text")
       el.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space","preserve");

    if (this instanceof SVGElement)
        this.appendChild(el);

    return el;
};

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
};

Entry.SVG.addClass = function(className) {
    var classAttr = this.getAttribute('class');
    for (var i = 0; i < arguments.length; i++) {
        var className = arguments[i];
        if (!this.hasClass(className)) classAttr += " " + className;
    }

    this.setAttribute('class', classAttr);
    return this;
};

Entry.SVG.removeClass = function(className) {
    var classAttr = this.getAttribute('class');
    for (var i = 0; i < arguments.length; i++) {
        var className = arguments[i];
        if (this.hasClass(className)) {
            var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
            classAttr = classAttr.replace(reg,' ');
        }
    }

    this.setAttribute('class', classAttr);
    return this;
};

Entry.SVG.hasClass = function(className) {
    var attr = this.getAttribute("class");
    if(!attr)
        return false;
    else
        return attr.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
};

Entry.SVG.remove = function() {
    if (this.parentNode) this.parentNode.removeChild(this);
};

Entry.SVG.removeAttr = function(attrName) {
    this.removeAttribute(attrName);
};
