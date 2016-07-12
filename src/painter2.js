'use strict';

Entry.Painter2 = function(view) {
    this.view = view;
};

(function(p) {

p.initialize = function() {
    this.lc = LC.init(this.view, {
            imageURLPrefix: '/lib/literallycanvas/lib/img',
            backgroundColor: '#fff',
            toolbarPosition: 'bottom',
        }
    );
};

p.show = function() {
    if (!this.lc)
        this.initialize();

};

}(Entry.Painter2.prototype));
