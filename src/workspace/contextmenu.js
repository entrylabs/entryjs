'use strict';

goog.provide('Entry.ContextMenu');

(function(ctx) {
    ctx.X_PADDING = 20;

    ctx.Y_HEIGHT = 20;

    ctx.visible = false;

    ctx.createDom = function() {
        this.dom = Entry.Dom('ul', {
            id: 'entry-contextmenu',
            parent: $('body')
        });
        Entry.Utils.disableContextmenu(this.dom);
    };

    ctx.show = function(options) {
        if (!this.dom) this.createDom();
        var that = this;
        console.log('show');

        var parent = this.dom;

        parent.empty();

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option.text;

            var elem = Entry.Dom('li', {
                class: 'entry-contextmenu-each',
                parent: parent
            });

            elem.text(text);

            (function(elem, cb) {
                elem.mousedown(function(){
                    if (cb) cb();
                    that.hide();
                });
            })(elem, option.callback);
        }

        var mousePos = Entry.mouseCoordinate;
        parent.css({
            left: mousePos.x,
            top: mousePos.y
        });
        parent.removeClass('entryRemove');
    };

    ctx.hide = function() {
        this.dom.empty();
        this.dom.addClass('entryRemove');
    };


})(Entry.ContextMenu);
