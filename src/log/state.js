/**
 * @fileoverview State class for undo and redo.
 */
'use strict';

/**
 * @constructor
 */
Entry.State = function(type, caller, func, param) {
    /**
     * function's caller.
     * @type {!object}
     */
    this.caller = caller;
    /**
     * function to recover state.
     * @type {!function}
     */
    this.func = func;
    /**
     * parameters for function.
     * @type {Array}
     */
    if (arguments.length > 3)
        this.params = Array.prototype.slice.call(arguments).slice(3);
    /**
     * message for interface.
     * @type {?String}
     * */
    this.message = type;
    /**
     * born time
     * @type {Number}
     * */
    this.time = Entry.getUpTime();
};

/**
 * generate message for interface.
 */
Entry.State.prototype.generateMessage = function() {

};
