'use strict';

goog.provide('Entry.ContextMenu');

(function(ctx) {
    ctx.createDom = function() {
        this.dom = Entry.Dom('ul', {
            id: 'entry-contextmenu',
            parent: $('body')
        });
        Entry.Utils.disableContextmenu(this.dom);

        Entry.documentMousedown.attach(
            this, function(){this.hide();}
        );
    };

    ctx.show = function(options) {
        if (!this.dom) this.createDom();
        if (options.length === 0) return;
        var that = this;

        var parent = this.dom;

        parent.empty();

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option.text;
            var enable = option.enable !== false;

            var elem = Entry.Dom('li', {
                class: enable ? 'menuAble' : 'menuDisable',
                parent: parent
            });

            elem.text(text);

            if (enable && option.callback) {
                (function(elem, cb) {
                    elem.mousedown(function(){
                        cb();
                    });
                })(elem, option.callback);
            }
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
