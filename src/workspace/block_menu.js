"use strict";

goog.provide("Entry.BlockMenu");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom, align, categoryData, scroll) {
    Entry.Model(this, false);
    this._align = align || "CENTER";
    this._scroll = scroll !== undefined ? scroll : false;
    this._bannedClass = [];
    this._categories = [];
    this.suffix = 'blockMenu';

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    this.view = dom;

    this.visible = true;
    this._svgId = 'blockMenu' + new Date().getTime();
    this._clearCategory();
    this._generateView(categoryData);

    this.offset = this.svgDom.offset();
    this._splitters = [];
    this.setWidth();

    this.svg = Entry.SVG(this._svgId);
    Entry.Utils.addFilters(this.svg, this.suffix);
    this.patternRect = Entry.Utils.addBlockPattern(this.svg, this.suffix);

    this.svgGroup = this.svg.elem("g");

    this.svgThreadGroup = this.svgGroup.elem("g");
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.elem("g");
    this.svgBlockGroup.board = this;

    this.changeEvent = new Entry.Event(this);
    if (categoryData) this._generateCategoryCodes(categoryData);

    this.observe(this, "_handleDragBlock", ["dragBlock"]);

    if (this._scroll) {
        this._scroller = new Entry.BlockMenuScroller(this);
        this._addControl(dom);
    }

    if (Entry.documentMousedown)
        Entry.documentMousedown.attach(this, this.setSelectedBlock);
    if (this._categoryCodes && Entry.keyPressed)
        Entry.keyPressed.attach(this, this._captureKeyEvent);
};

(function(p) {
    var splitterHPadding = 20;
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null
    };

    p._generateView = function(categoryData) {
        var parent = this.view;
        var that = this;

        if (categoryData) {
            this._categoryCol = Entry.Dom('ul', {
                class: 'entryCategoryListWorkspace',
                parent: parent
            });

            this._generateCategoryView(categoryData);
        }

        this.blockMenuContainer = Entry.Dom('div', {
            'class':'blockMenuContainer',
            'parent':parent
        });

        this.svgDom = Entry.Dom(
            $('<svg id="' + this._svgId +'" class="blockMenu" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: this.blockMenuContainer }
        );

        this.svgDom.mouseenter(function(e) {
            if (that._scroller) that._scroller.setOpacity(1);

            var selectedBlockView = that.workspace.selectedBlockView;
            if (!Entry.playground || Entry.playground.resizing ||
                (selectedBlockView && selectedBlockView.dragMode === Entry.DRAG_MODE_DRAG)) return;
            Entry.playground.focusBlockMenu = true;
            var bBox = that.svgGroup.getBBox();
            var expandWidth = bBox.width + bBox.x + 64;
            if (expandWidth > Entry.interfaceState.menuWidth) {
                this.widthBackup = Entry.interfaceState.menuWidth - 64;
                $(this).stop().animate({
                    width: expandWidth - 62
                }, 200);
            }
        });

        this.svgDom.mouseleave(function(e) {
            if (!Entry.playground || Entry.playground.resizing) return;

            if (that._scroller)
                that._scroller.setOpacity(0);

            var widthBackup = this.widthBackup;
            if (widthBackup)
                $(this).stop().animate({
                    width: widthBackup
                }, 200);
            delete this.widthBackup;
            delete Entry.playground.focusBlockMenu;
        });

    };

    p.changeCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        if (this.codeListener)
            this.code.changeEvent.detach(this.codeListener);
        var that = this;
        this.set({code:code});
        this.codeListener = this.code.changeEvent.attach(
            this,
            function() {that.changeEvent.notify();}
        );
        code.createView(this);
        var workspace = this.workspace;
        var workspaceMode = workspace.getMode();
        if (this.workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
            if (!code.mode || code.mode === 'code')
                this.renderText();
        } else {
            if (code.mode === 'text')
                this.renderBlock();
        }
        this.align();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
        if (this._scroller)
            this.svgGroup.appendChild(this._scroller.svgGroup);
    };

    p.align = function() {
        if (!this.code) return;
        this._clearSplitters();

        var threads = this.code.getThreads();
        var vPadding = 15,
            marginFromTop = 10,
            hPadding = this._align == 'LEFT' ? 10 : this.svgDom.width()/2;

        var pastClass;
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            var block = thread.getFirstBlock();
            var blockView = block.view;

            var blockInfo = Entry.block[block.type];
            if(this.checkBanClass(blockInfo)) {
                blockView.set({display:false});
                continue;
            }

            blockView.set({display:true});
            var className = blockInfo.class;
            if (pastClass && pastClass !== className) {
                this._createSplitter(marginFromTop);
                marginFromTop += vPadding;
            }
            pastClass = className;

            var left = hPadding - blockView.offsetX;
            if (this._align == 'CENTER') left -= blockView.width /2;

            marginFromTop -= blockView.offsetY;
            blockView._moveTo(
                left,
                marginFromTop,
                false);
            marginFromTop += blockView.height + vPadding;

        }

        this.updateSplitters();
        this.changeEvent.notify();
    };

    p.cloneToGlobal = function(e) {
        if (this._boardBlockView) return;
        if (this.dragBlock === null) return;

        var globalSvg = Entry.GlobalSvg;
        var workspace = this.workspace;
        var workspaceMode = workspace.getMode();
        var blockView = this.dragBlock;

        var svgWidth = this._svgWidth;

        var board = workspace.selectedBoard;

        if (board && (workspaceMode == Entry.Workspace.MODE_BOARD ||
                      workspaceMode == Entry.Workspace.MODE_OVERLAYBOARD)) {
            if (!board.code) return;

            var block = blockView.block;
            var clonedThread;
            var code = this.code;
            var currentThread = block.getThread();
            if (block && currentThread) {
                var threadJSON = currentThread.toJSON(true);
                this._boardBlockView = Entry.do("addThread", threadJSON).value
                    .getFirstBlock().view;

                var distance = this.offset.top - board.offset.top;

                this._boardBlockView._moveTo(
                    blockView.x-svgWidth,
                    blockView.y+distance,
                    false
                );
                this._boardBlockView.onMouseDown.call(this._boardBlockView, e);
                this._boardBlockView.dragInstance.set({isNew:true});
            }
        } else {
            if(Entry.GlobalSvg.setView(blockView, workspace.getMode()))
                Entry.GlobalSvg.addControl(e);
        }
    };

    p.terminateDrag = function() {
        if (!this._boardBlockView) return;

        var boardBlockView = this._boardBlockView;
        if (!boardBlockView) return;
        var thisCode = this.code;
        var workspace = this.workspace;
        var boardCode = workspace.getBoard().code;

        this._boardBlockView = null;

        //board block should be removed below the amount of range
        var blockLeft = Entry.GlobalSvg.left;
        var width = Entry.GlobalSvg.width/2;
        var boardLeft = boardBlockView.getBoard().offset.left;
        return blockLeft < boardLeft - width;
    };

    p.getCode = function(thread) {return this._code;};

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else blockView = null;

        this.set({selectedBlockView:blockView});
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};

    p.renderText = function() {
        var threads = this.code.getThreads();
        this.code.mode = 'text';
        for (var i=0; i<threads.length; i++)
            threads[i].view.renderText();
    };

    p.renderBlock = function() {
        var threads = this.code.getThreads();
        this.code.mode = 'code';
        for (var i=0; i<threads.length; i++)
            threads[i].view.renderBlock();
    };

    p._createSplitter = function(topPos) {
        var width = this._svgWidth;
        var svgBlockGroup = this.svgBlockGroup;
        var line = svgBlockGroup.elem("line", {
            x1: splitterHPadding,
            y1: topPos,
            x2: width-splitterHPadding,
            y2: topPos,
            stroke : '#b5b5b5'
        });
        this._splitters.push(line);
    };

    p.updateSplitters = function(y) {
        y = y === undefined ? 0 : y;
        var splitters = this._splitters;
        var width = this._svgWidth;
        var xDest = width - splitterHPadding;
        var yDest;
        splitters.forEach(function(line) {
            yDest = parseFloat(line.getAttribute('y1')) + y;
            line.attr({
                x2: xDest, y1:yDest, y2:yDest
            });
        });
    };

    p._clearSplitters = function() {
        var splitters = this._splitters;
        for (var i = splitters.length-1; i>=0; i--) {
            splitters[i].remove();
            splitters.pop();
        }
    };

    p.setWidth = function() {
        this._svgWidth = this.blockMenuContainer.width();
        this.updateSplitters();
        this.offset = this.svgDom.offset();
    };

    p.setMenu = function() {
        var categoryCodes = this._categoryCodes;
        var elems = this._categoryElems;
        for (var key in categoryCodes) {
            var code = categoryCodes[key];
            if (!(code instanceof Entry.Code))
                code = categoryCodes[key] = new Entry.Code(code);
            var threads = code.getThreads();

            var count = threads.length;
            for (var i=0; i<threads.length; i++) {
                var block = threads[i].getFirstBlock();
                if(this.checkBanClass(Entry.block[block.type]))
                    count--;
            }

            var elem = elems[key];
            if (count === 0) elems[key].addClass('entryRemove');
            else elems[key].removeClass('entryRemove');
        }
    };

    p.getCategoryCodes = function(selector) {
        var name = this._convertSelector(selector);
        var code = this._categoryCodes[name];
        if (!(code instanceof Entry.Code))
            code = this._categoryCodes[name] = new Entry.Code(code);
        return code;
    };

    p._convertSelector = function(selector) {
        if (isNaN(selector)) return selector;

        selector = Number(selector);
        var categories = this._categories;
        var elems = this._categoryElems;
        for (var i = 0; i < categories.length; i++) {
            var key = categories[i];
            var visible = !elems[key].hasClass('entryRemove');
            if (visible) {
                if (selector-- === 0) return key;
            }
        }

    };

    p.selectMenu = function(selector, doNotFold) {
        var name = this._convertSelector(selector);
        if (!name) return;
        if (name == 'variable')
            Entry.playground.checkVariables();

        var elem = this._categoryElems[name];
        var oldView = this._selectedCategoryView;
        var className = 'entrySelectedCategory';
        var animate = false;
        var board = this.workspace.board,
            boardView = board.view;

        if (oldView) oldView.removeClass(className);

        if (elem == oldView && !doNotFold) {
            boardView.addClass('folding');
            this._selectedCategoryView = null;
            elem.removeClass(className);
            Entry.playground.hideTabs();
            animate = true;
            this.visible = false;
        } else if (!oldView) {
            if (!this.visible) {
                animate = true;
                boardView.addClass('foldOut');
                Entry.playground.showTabs();
            }
            boardView.removeClass('folding');
            this.visible = true;
        }

        if (animate) {
            Entry.bindAnimationCallbackOnce(boardView, function(){
                board.scroller.resizeScrollBar.call(board.scroller);
                boardView.removeClass('foldOut');
                Entry.windowResized.notify();
            });
        }

        if (this.visible) {
            var code = this._categoryCodes[name];

            this._selectedCategoryView = elem;
            elem.addClass(className);
            if (code.constructor !== Entry.Code)
                code = this._categoryCodes[name] = new Entry.Code(code);

            this.changeCode(code);
        }

        this.lastSelector = name;
    };


    p._generateCategoryCodes = function(categoryData) {
        this._categoryCodes = {};
        for (var i=0; i<categoryData.length; i++) {
            var datum = categoryData[i];
            var blocks = datum.blocks;
            var codesJSON = [];
            blocks.forEach(function(b){
                var block = Entry.block[b];
                if (!block || !block.def) {
                    codesJSON.push([{type:b}]);
                } else {
                    if (block.defs) {
                        for (var i =0; i <block.defs.length; i++)
                            codesJSON.push([
                                block.defs[i]
                            ]);
                    } else
                        codesJSON.push([
                            block.def
                        ]);
                }
            });
            var categoryName = datum.category;
            this._categories.push(categoryName);
            this._categoryCodes[categoryName] = codesJSON;
        }
    };

    p.banClass = function(className) {
        var index = this._bannedClass.indexOf(className);
        if (index < 0)
            this._bannedClass.push(className);
        this.align();
    };

    p.unbanClass = function(className) {
        var index = this._bannedClass.indexOf(className);
        if (index > -1)
            this._bannedClass.splice(index, 1);
        this.align();
    };

    p.checkBanClass = function(blockInfo) {
        if (!blockInfo) return;
        var isNotFor = blockInfo.isNotFor;
        for (var i in this._bannedClass) {
            if (isNotFor && isNotFor.indexOf(this._bannedClass[i]) > -1)
                return true;
        }
        return false;
    };

    p._addControl = function(dom) {
        var that = this;
        var svgDom = this.svgDom;
        dom.on('wheel', function(){
            that._mouseWheel.apply(that, arguments);
        });

        //svgDom.on('mouseout', function(e){
            //var offset = that.offset;
            //var width = that._expandWidth || that._svgWidth;

            //if (offset.left > e.clientX -2 || offset.top > e.clientY -2 ||
                //(offset.left + width -2 < e.clientX ))
                //that._scroller.setOpacity(0);
        //});
    };

    p._mouseWheel = function(e) {
        e = e.originalEvent;
        e.preventDefault();
        var disposeEvent = Entry.disposeEvent;
        if (disposeEvent)
            disposeEvent.notify(e);
        this._scroller.scroll(
            -e.wheelDeltaY || e.deltaY / 3
        );
    };

    p.dominate = function(block) {
        this.svgBlockGroup
            .appendChild(block.view.svgGroup);
    };

    p.reDraw = function() {
        this.selectMenu(this.lastSelector, true);
        var codeView = this.code && this.code.view ? this.code.view : null;
        if (codeView) codeView.reDraw();
    };

    p._handleDragBlock = function() {
        this._boardBlockView = null;
        if (this._scroller) this._scroller.setOpacity(0);
    };

    p._captureKeyEvent = function(e) {
        var keyCode = e.keyCode;
        var type = Entry.type;

        if (e.ctrlKey && type == 'workspace') {
            if (keyCode > 48 && keyCode < 58) {
                e.preventDefault();
                this.selectMenu(keyCode - 49);
            }
        }
    };

    p.setPatternRectFill = function(color) {
        this.patternRect.attr({fill:color});
    };

    p._clearCategory = function() {
        this._selectedCategoryView = null;
        this._categories = [];

        var categories = this._categoryElems;
        for (var key in categories)
            categories[key].remove();
        this._categoryElems = {};

        categories = this._categoryCodes;
        for (key in categories) {
            var code = categories[key];
            if (code.constructor == Entry.Code)
                code.clear();
        }
        this._categoryCodes = null;
    };

    p.setCategoryData = function(data) {
        this._clearCategory();
        this._generateCategoryView(data);
        this._generateCategoryCodes(data);
    };

    p._generateCategoryView = function(data) {
        if (!data) return;
        var that = this;

        for (var i=0; i<data.length; i++) {
            var name = data[i].category;
            var element = Entry.Dom('li', {
                id: 'entryCategory' + name,
                class: 'entryCategoryElementWorkspace',
                parent: this._categoryCol
            });

            (function(elem, name){
                elem.text(Lang.Blocks[name.toUpperCase()]);
                that._categoryElems[name] = elem;
                elem.bindOnClick(function(e) {
                    that.selectMenu(name);
                });
            })(element, name);
        }
    };


})(Entry.BlockMenu.prototype);
