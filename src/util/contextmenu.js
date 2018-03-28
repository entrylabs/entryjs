'use strict';

Entry.ContextMenu = {};

(function(ctx) {
    const ATTR_KEY = 'data-option-index';

    ctx.visible = false;
    ctx._hideEvent = null;

    ctx.createDom = function() {
        this.dom = Entry.Dom('ul', {
            id: 'entry-contextmenu',
            parent: $('body'),
        });

        _bindEvent.call(this);
    };

    ctx.show = function(options, className, coordinate) {
        this._options = options;

        if (!this.dom) this.createDom();
        if (!options.length) return;

        if (this._hideEvent) {
            this._hideEvent.destroy();
        }

        this._hideEvent = Entry.documentMousedown.attach(this, this.hide);
        if (className !== undefined) {
            this._className = className;
            this.dom.addClass(className);
        }

        var parent = this.dom;

        parent.empty();

        var fragment = document.createDocumentFragment();

        options.forEach((option, idx) => {
            var { text, enable, divider } = option;
            enable = option.enable !== false;
            //set value for later use
            option.enable = enable;

            var elem = Entry.Dom('li').attr(ATTR_KEY, idx);
            fragment.appendChild(elem.get(0));

            if (divider) {
                className = 'divider';
            } else {
                className = enable ? 'menuAble' : 'menuDisable';
                Entry.Dom('span', { parent: elem }).text(text);
            }

            elem.addClass(className);
        });

        parent.get(0).appendChild(fragment);
        parent.removeClass('entryRemove');
        this.visible = true;
        this.position(coordinate || Entry.mouseCoordinate);
    };

    ctx.position = function(pos) {
        var dom = this.dom;
        dom.css({
            left: 0,
            top: 0,
        });
        var width = dom.width();
        var height = dom.height();

        var win = $(window);
        var winWidth = win.width();
        var winHeight = win.height();

        if (pos.x + width > winWidth) pos.x -= width + 3;
        if (pos.y + height > winHeight) pos.y -= height;

        dom.css({
            left: pos.x,
            top: pos.y,
        });
    };

    ctx.hide = function() {
        this.visible = false;
        var dom = this.dom;
        
        dom.empty().addClass('entryRemove');

        if (this._className) {
            dom.removeClass(this._className);
            delete this._className;
        }
        if (this._hideEvent) {
            this._hideEvent.destroy();
            this._hideEvent = null;
        }
    };

    ctx.onContextmenu = function(target, callback) {
        target.on('touchstart mousemove mouseup contextmenu', function(e) {
            switch (e.type) {
                case 'touchstart':
                    var startEvent = Entry.Utils.convertMouseEvent(e);
                    this.coordi = {
                        x: startEvent.clientX,
                        y: startEvent.clientY,
                    };

                    this.longTouchEvent = setTimeout(
                        function() {
                            callback(this.coordi);
                            this.longTouchEvent = undefined;
                        }.bind(this),
                        900
                    );
                    break;
                case 'mousemove':
                    if (!this.coordi) return;
                    var diff = Math.sqrt(
                        Math.pow(e.pageX - this.coordi.x, 2) +
                            Math.pow(e.pageY - this.coordi.y, 2)
                    );
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
                    if (e.type === 'contextmenu') {
                        // e.stopPropagation();
                        // e.preventDefault();
                        callback(this.coordi);
                    }
                    break;
            }
        });
    };

    function _bindEvent() {
        var that = this;
        this.dom.on('mousedown touchstart', (e) => {
            e.stopPropagation();
        });

        //event delegation
        this.dom.on('mousedown touchstart', 'li', function(e) {
            e.stopPropagation();
            var options = that._options;

            if (_.isEmpty(options)) {
                return that.hide();
            }

            var { enable, callback } = options[this.getAttribute(ATTR_KEY)];

            if (enable && callback) {
                e.preventDefault();
                that.hide();
                callback(e);
            }
        });

        Entry.Utils.disableContextmenu(this.dom);
    }
})(Entry.ContextMenu);
