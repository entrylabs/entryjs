'use strict';

goog.provide('Entry.ContextMenu');

(function(ctx) {
    ctx.visible = false;
    ctx._hideEvent = null;

    ctx.createDom = function() {

        this.dom = Entry.Dom('ul', {
            id: 'entry-contextmenu',
            parent: $('body')
        });

        this.dom.bind('mousedown touchstart', function(e) {
            e.stopPropagation();
        });

        Entry.Utils.disableContextmenu(this.dom);
    };

    ctx.show = function(options, className, coordinate) {
        this._hideEvent = Entry.documentMousedown.attach(
            this, function(){this.hide();}
        );
        if (!this.dom) this.createDom();
        if (options.length === 0) return;
        var that = this;
        if (className !== undefined) {
            this._className = className;
            this.dom.addClass(className);
        }

        var parent = this.dom;

        parent.empty();

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option.text;
            var enable = option.enable !== false;

            var elem = Entry.Dom('li', { parent: parent });

            if (option.divider) className = 'divider';
            else {
                className = enable ? 'menuAble' : 'menuDisable';
                var span = Entry.Dom('span', { parent: elem });

                span.text(text);

                if (enable && option.callback) {
                    (function(elem, cb) {
                        elem.mousedown(function(e){
                            e.preventDefault();
                            that.hide();
                            cb(e);
                        });
                    })(elem, option.callback);
                }
            }
            elem.addClass(className);
        }

        parent.removeClass('entryRemove');
        this.visible = true;
        this.position(coordinate || Entry.mouseCoordinate);
    };

    ctx.position = function(pos) {
        var dom = this.dom;
        dom.css({
            left: 0,
            top: 0
        });
        var width = dom.width();
        var height = dom.height();

        var win = $(window);
        var winWidth = win.width();
        var winHeight = win.height();

        if (pos.x + width > winWidth)
            pos.x -= width + 3;
        if (pos.y + height > winHeight)
            pos.y -= height;

        dom.css({
            left: pos.x,
            top: pos.y
        });

    };

    ctx.hide = function() {
        this.visible = false;
        this.dom.empty();
        this.dom.addClass('entryRemove');
        if (this._className) {
            this.dom.removeClass(this._className);
            delete this._className;
        }
        if (this._hideEvent) {
            Entry.documentMousedown.detach(this._hideEvent);
            this._hideEvent = null;
        }
    };

    ctx.onContextmenu = function(target, callback) {
        target.on('touchstart mousemove mouseup contextmenu', function (e) {
            switch(e.type) {
                case 'touchstart':
                    var startEvent = Entry.Utils.convertMouseEvent(e);
                    this.coordi = {
                        x: startEvent.clientX,
                        y: startEvent.clientY,
                    }

                    this.longTouchEvent = setTimeout((function() {
                        callback(this.coordi);
                        this.longTouchEvent = undefined;
                    }).bind(this), 900);
                    break;
                case 'mousemove':
                    if(!this.coordi) return;
                    var diff = Math.sqrt(Math.pow(e.pageX - this.coordi.x, 2) +
                            Math.pow(e.pageY - this.coordi.y, 2));
                    if (diff > 5 && this.longTouchEvent) {
                        clearTimeout(this.longTouchEvent);
                        this.longTouchEvent = undefined;
                    }
                    break;
                case 'mouseup':
                    // e.stopPropagation();
                    if (this.longTouchEvent) {
                        clearTimeout(this.longTouchEvent);
                        this.longTouchEvent = null;
                    }
                    break;
                case 'contextmenu':
                    clearTimeout(this.longTouchEvent);
                    this.longTouchEvent = undefined;
                    if(e.type === 'contextmenu') {
                        // e.stopPropagation();
                        // e.preventDefault();
                        callback(this.coordi);
                    }
                    break;
            }
        });
    }


})(Entry.ContextMenu);
