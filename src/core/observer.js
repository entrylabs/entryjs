'use strict';

/*
 * Entry Observer object Constructor
 * @param {object} obj
 */

Entry.Observer = class Observer {
    constructor(parent, object, funcName, attrs) {
        this.parent = parent;
        this.object = object;
        this.funcName = funcName;
        this.attrs = attrs;
        parent.push(this);
    }

    destroy = function() {
        const parent = this.parent;
        const index = parent.indexOf(this);
        if (index > -1) {
            parent.splice(index, 1);
        }
        return this;
    };
};
