'use strict';

Entry.PopupList = function(dom) {
    this.view = dom;
};

(function(p) {
    p.getView = function() {
        return this.view;
    };

    p.resize = function() {};
})(Entry.PopupList.prototype);
