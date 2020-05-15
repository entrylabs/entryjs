// /**
//  * @fileoverview View element constructor
//  * @author Kyumin Sim
//  * @modifier Jaewon Lee @ 2020/05
//  * @version 0.2.1
//  */
// 'use strict';

// /**
//  * Function for construct html dom element.
//  * @function
//  * @param {string} tag or html to construct dom element.
//  * @param {?object} options include id, classes, parent etc.
//  */
// Entry.SVG = class SVG {
//     constructor(id, svgDom) {
//         const element = svgDom ? svgDom : document.getElementById(id);
//         this.NS = 'http://www.w3.org/2000/svg';
//         this.NS_XLINK = 'http://www.w3.org/1999/xlink';
//         return this.createElement(element);
//     }

//     createElement(tag, options) {
//         let el;
//         if (typeof tag === 'string') {
//             el = document.createElementNS(this.NS, tag);
//         } else {
//             el = tag;
//         }

//         if (options) {
//             if (options.href) {
//                 el.setAttributeNS(this.NS_XLINK, 'href', options.href);
//                 delete options.href;
//             }

//             for (const key in options) {
//                 el.setAttribute(key, options[key]);
//             }
//         }

//         //add util functions
//         el.elem = this.createElement;
//         el.prepend = this.prepend;
//         el.attr = this.attr;
//         el.addClass = this.addClass;
//         el.removeClass = this.removeClass;
//         el.hasClass = this.hasClass;
//         el.remove = this.remove;
//         el.removeAttr = this.removeAttr;

//         if (tag === 'text') {
//             el.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
//         }

//         if (this instanceof SVGElement) {
//             this.appendChild(el);
//         }

//         return el;
//     }

//     prepend(tag) {
//         let el;
//         if (typeof tag === 'string') {
//             el = document.createElementNS(this.NS, tag);
//         } else {
//             el = tag;
//         }
//         //add util functions
//         el.elem = this.createElement;
//         el.prepend = this.prepend;
//         el.attr = this.attr;
//         el.addClass = this.addClass;
//         el.removeClass = this.removeClass;
//         el.hasClass = this.hasClass;
//         el.remove = this.remove;
//         el.removeAttr = this.removeAttr;

//         if (this instanceof SVGElement) {
//             if (this.childNodes.length) {
//                 this.insertBefore(el, this.childNodes[0]);
//             } else {
//                 this.appendChild(el);
//             }
//         }
//         return el;
//     }

//     attr(options, property) {
//         if (typeof options === 'string') {
//             const o = {};
//             o[options] = property;
//             options = o;
//         }

//         if (options) {
//             if (options.href) {
//                 this.setAttributeNS(this.NS_XLINK, 'href', options.href);
//                 delete options.href;
//             }
//             for (const key in options) {
//                 this.setAttribute(key, options[key]);
//             }
//         }

//         return this;
//     }

//     addClass(...classes) {
//         const className = classes.reduce((acc, className) => {
//             if (!this.hasClass(className)) {
//                 acc += ` ${className}`;
//             }
//             return acc;
//         }, this.getAttribute('class'));
//         this.setAttribute('class', className.replace(/\s+/g, ' '));
//         return this;
//     }

//     removeClass(...classes) {
//         const className = classes.reduce((acc, className) => {
//             if (this.hasClass(className)) {
//                 acc = acc.replace(new RegExp(`(\\s|^)${className}(\\s|$)`), ' ');
//             }
//             return acc;
//         }, this.getAttribute('class'));
//         if (className) {
//             this.setAttribute('class', className.replace(/\s+/g, ' '));
//         }
//         return this;
//     }

//     hasClass(className) {
//         const attr = this.getAttribute('class');
//         if (!attr) {
//             return false;
//         } else {
//             return attr.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
//         }
//     }

//     remove() {
//         if (this.parentNode) {
//             this.parentNode.removeChild(this);
//         }
//     }

//     removeAttr(attrName) {
//         this.removeAttribute(attrName);
//     }
// };

/**
 * @fileoverview View element constructor
 * @author Kyumin Sim
 * @version 0.2
 */
'use strict';

/**
 * Function for construct html dom element.
 * @function
 * @param {string} tag or html to construct dom element.
 * @param {?object} options include id, classes, parent etc.
 */
Entry.SVG = function(id, svgDom) {
    const element = svgDom ? svgDom : document.getElementById(id);
    return Entry.SVG.createElement(element);
};

Entry.SVG.NS = 'http://www.w3.org/2000/svg';
Entry.SVG.NS_XLINK = 'http://www.w3.org/1999/xlink';

Entry.SVG.createElement = function(tag, options) {
    let el;
    if (typeof tag === 'string') {
        el = document.createElementNS(Entry.SVG.NS, tag);
    } else {
        el = tag;
    }

    if (options) {
        if (options.href) {
            el.setAttributeNS(Entry.SVG.NS_XLINK, 'href', options.href);
            delete options.href;
        }

        for (const key in options) {
            el.setAttribute(key, options[key]);
        }
    }

    //add util functions
    el.elem = Entry.SVG.createElement;
    el.prepend = Entry.SVG.prepend;
    el.attr = Entry.SVG.attr;
    el.addClass = Entry.SVG.addClass;
    el.removeClass = Entry.SVG.removeClass;
    el.hasClass = Entry.SVG.hasClass;
    el.remove = Entry.SVG.remove;
    el.removeAttr = Entry.SVG.removeAttr;

    if (tag === 'text') {
        el.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    }

    if (this instanceof SVGElement) {
        this.appendChild(el);
    }

    return el;
};

Entry.SVG.prepend = function(tag) {
    let el;
    if (typeof tag === 'string') {
        el = document.createElementNS(Entry.SVG.NS, tag);
    } else {
        el = tag;
    }
    //add util functions
    el.elem = Entry.SVG.createElement;
    el.prepend = Entry.SVG.prepend;
    el.attr = Entry.SVG.attr;
    el.addClass = Entry.SVG.addClass;
    el.removeClass = Entry.SVG.removeClass;
    el.hasClass = Entry.SVG.hasClass;
    el.remove = Entry.SVG.remove;
    el.removeAttr = Entry.SVG.removeAttr;

    if (this instanceof SVGElement) {
        if (this.childNodes.length) {
            this.insertBefore(el, this.childNodes[0]);
        } else {
            this.appendChild(el);
        }
    }
    return el;
};

Entry.SVG.attr = function(options, property) {
    if (typeof options === 'string') {
        const o = {};
        o[options] = property;
        options = o;
    }

    if (options) {
        if (options.href) {
            this.setAttributeNS(Entry.SVG.NS_XLINK, 'href', options.href);
            delete options.href;
        }
        for (const key in options) {
            this.setAttribute(key, options[key]);
        }
    }

    return this;
};

Entry.SVG.addClass = function(...classes) {
    const className = classes.reduce((acc, className) => {
        if (!this.hasClass(className)) {
            acc += ` ${className}`;
        }
        return acc;
    }, this.getAttribute('class'));
    this.setAttribute('class', className.replace(/\s+/g, ' '));
    return this;
};

Entry.SVG.removeClass = function(...classes) {
    const className = classes.reduce((acc, className) => {
        if (this.hasClass(className)) {
            acc = acc.replace(new RegExp(`(\\s|^)${className}(\\s|$)`), ' ');
        }
        return acc;
    }, this.getAttribute('class'));
    if (className) {
        this.setAttribute('class', className.replace(/\s+/g, ' '));
    }
    return this;
};

Entry.SVG.hasClass = function(className) {
    const attr = this.getAttribute('class');
    if (!attr) {
        return false;
    } else {
        return attr.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
    }
};

Entry.SVG.remove = function() {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
};

Entry.SVG.removeAttr = function(attrName) {
    this.removeAttribute(attrName);
};
