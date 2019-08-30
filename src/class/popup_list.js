'use strict';

/**
 * Constructor of popup_list
 * @param {HTMLDomElement} dom
 * @constructor
 */

Entry.PopupList = function(dom) {
    this.view = dom;
};

(function(p) {
    /**
     * getView
     * @return {HTMLDomElement}
     */
    p.getView = function() {
        return this.view;
    };
    /**
     * resize, emptyFunction
     */
    p.resize = function() {};
})(Entry.PopupList.prototype);
