'use strict';
/*
 *
 * @param {object} dom which to inject playground
 */
Entry.BlockMenu = function(dom, align, categoryData, scroll, readOnly) {
    Entry.Model(this, false);

    this.reDraw = Entry.Utils.debounce(this.reDraw, 100);
    this._dAlign = this.align;
    this._setDynamic = Entry.Utils.debounce(this._setDynamic, 150);
    this._dSelectMenu = Entry.Utils.debounce(this.selectMenu, 0);

    this._align = align || 'CENTER';
    this.setAlign(this._align);
    this._scroll = scroll !== undefined ? scroll : false;
    this._bannedClass = [];
    this._categories = [];
    this.suffix = 'blockMenu';
    this._isSelectingMenu = false;
    this._dynamicThreads = [];
    this._setDynamicTimer = null;
    this._renderedCategories = {};
    this.categoryRendered = false;
    this.readOnly = readOnly === undefined ? true : readOnly;

    this._threadsMap = {};

    if (typeof dom === 'string') dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop('tagName') !== 'DIV') return console.error('Dom is not div element');

    this.view = dom;

    this.visible = true;
    this.hwCodeOutdated = false;
    this._svgId = 'blockMenu' + _.now();
    this._clearCategory();
    this._categoryData = categoryData;
    this._generateView(categoryData);

    this._splitters = [];
    this.setWidth();

    this.svg = Entry.SVG(this._svgId);
    Entry.Utils.addFilters(this.svg, this.suffix);
    var { pattern } = Entry.Utils.addBlockPattern(this.svg, this.suffix);
    this.pattern = pattern;

    this.svgGroup = this.svg.elem('g');

    this.svgThreadGroup = this.svgGroup.elem('g');
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.elem('g');
    this.svgBlockGroup.board = this;

    this.changeEvent = new Entry.Event(this);
    this.categoryDoneEvent = new Entry.Event(this);

    this.observe(this, '_handleDragBlock', ['dragBlock']);

    this.changeCode(new Entry.Code([]));
    categoryData && this._generateCategoryCodes();

    if (this._scroll) {
        this._scroller = new Entry.BlockMenuScroller(this);
        this._addControl(dom);
    }

    if (Entry.documentMousedown) {
        Entry.documentMousedown.attach(this, this.setSelectedBlock);
    }
    if (this.code && Entry.keyPressed) {
        Entry.keyPressed.attach(this, this._captureKeyEvent);
    }
    if (Entry.windowResized) {
        Entry.windowResized.attach(this, Entry.Utils.debounce(this.updateOffset, 200));
    }

    Entry.addEventListener(
        'setBlockMenuDynamic',
        function() {
            this._setDynamicTimer = this._setDynamic.apply(this, arguments);
        }.bind(this)
    );

    Entry.addEventListener('cancelBlockMenuDynamic', this._cancelDynamic.bind(this));
    Entry.addEventListener('fontLoaded', this.reDraw.bind(this));
};

(function(p) {
    var VARIABLE = 'variable';
    var HW = 'arduino';

    var splitterHPadding = 20;

    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null,
    };

    p._generateView = function(categoryData) {
        var parent = this.view;
        var that = this;

        categoryData && this._generateCategoryView(categoryData);

        this.blockMenuContainer = Entry.Dom('div', {
            class: 'blockMenuContainer',
            parent: parent,
        });

        this.svgDom = Entry.Dom(
            $(
                '<svg id="' +
                    this._svgId +
                    '" class="blockMenu" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'
            ),
            { parent: this.blockMenuContainer }
        );

        this.svgDom.mouseenter(function(e) {
            that._scroller && that._scroller.setOpacity(1);

            var selectedBlockView = that.workspace.selectedBlockView;
            if (
                !Entry.playground ||
                Entry.playground.resizing ||
                (selectedBlockView && selectedBlockView.dragMode === Entry.DRAG_MODE_DRAG)
            )
                return;
            Entry.playground.focusBlockMenu = true;
            var bBox = that.svgGroup.getBBox();
            var adjust = that.hasCategory() ? 64 : 0;
            var expandWidth = bBox.width + bBox.x + adjust;
            var { menuWidth } = Entry.interfaceState;
            if (expandWidth > menuWidth) {
                this.widthBackup = menuWidth - adjust;
                $(this)
                    .stop()
                    .animate({ width: expandWidth - adjust }, 200);
            }
        });

        this.svgDom.mouseleave(function(e) {
            var playground = Entry.playground;
            if (!playground || playground.resizing) return;

            if (that._scroller) that._scroller.setOpacity(0);

            var widthBackup = this.widthBackup;
            if (widthBackup) {
                $(this)
                    .stop()
                    .animate({ width: widthBackup }, 200);
            }
            delete this.widthBackup;
            delete playground.focusBlockMenu;
        });

        Entry.Utils.bindBlockViewHoverEvent(this, this.svgDom);
        $(window).scroll(this.updateOffset.bind(this));
    };

    p.changeCode = function(code, isImmediate) {
        if (code instanceof Array) code = new Entry.Code(code);

        if (!(code instanceof Entry.Code)) return console.error('You must inject code instance');

        _.result(this.codeListener, 'destroy');

        var that = this;
        this.set({ code: code });
        this.codeListener = this.code.changeEvent.attach(this, function() {
            that.changeEvent.notify();
        });
        code.createView(this);

        if (isImmediate) this.align();
        else this._dAlign();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
        if (this._scroller) {
            this.svgGroup.appendChild(this._scroller.svgGroup);
        }
    };

    p.align = function() {
        var code = this.code;
        if (!(this._isOn() && code)) return;
        this._clearSplitters();

        var vPadding = 15,
            marginFromTop = 10,
            hPadding = this._align == 'LEFT' ? 10 : this.svgDom.width() / 2;

        var pastClass;
        var blocks = this._getSortedBlocks();
        var [visibles = [], inVisibles = []] = blocks;

        inVisibles.forEach(({ view: blockView } = {}) => {
            if (!blockView) return;
            blockView.set({ display: false });
            blockView.detach();
        });

        var lastSelector = this.lastSelector;
        var shouldReDraw = !this._renderedCategories[lastSelector];
        visibles.forEach(({ view: blockView, type } = {}) => {
            if (!blockView) return;
            blockView.attach();
            blockView.set({ display: true });
            shouldReDraw && blockView.reDraw();

            var className = Entry.block[type].class;
            if (pastClass && pastClass !== className) {
                this._createSplitter(marginFromTop);
                marginFromTop += vPadding;
            }
            pastClass = className;

            var left = hPadding - blockView.offsetX;
            if (this._align == 'CENTER') left -= blockView.width / 2;

            marginFromTop -= blockView.offsetY;
            blockView._moveTo(left, marginFromTop, false);
            marginFromTop += blockView.height + vPadding;
        });

        this.updateSplitters();

        if (this.workspace) {
            var mode = this.workspace.getMode();
            switch (mode) {
                case Entry.Workspace.MODE_BOARD:
                case Entry.Workspace.MODE_OVERLAYBOARD:
                    this.renderBlock(blocks);
                    break;
                case Entry.Workspace.MODE_VIMBOARD:
                    this.renderText(blocks);
                    break;
                default:
                    this.renderBlock(blocks);
            }
        }

        if (lastSelector !== 'func') this._renderedCategories[lastSelector] = true;
        this.changeEvent.notify();
    };

    p.cloneToGlobal = function(e) {
        var blockView = this.dragBlock;
        if (this._boardBlockView || blockView === null) return;

        var GS = Entry.GlobalSvg;
        var workspace = this.workspace;
        var workspaceMode = workspace.getMode();
        var { MODE_BOARD, MODE_OVERLAYBOARD } = Entry.Workspace;

        var svgWidth = this._svgWidth;

        var board = workspace.selectedBoard;
        var { x = 0, y = 0 } = blockView.mouseDownCoordinate || {};
        var dx = e.pageX - x,
            dy = e.pageY - y;

        if (board && (workspaceMode === MODE_BOARD || workspaceMode === MODE_OVERLAYBOARD)) {
            if (!board.code) {
                if (Entry.toast) {
                    Entry.toast.alert(
                        Lang.Workspace.add_object_alert,
                        Lang.Workspace.add_object_alert_msg
                    );
                }
                if (this.selectedBlockView) {
                    this.selectedBlockView.removeSelected();
                    this.set({
                        selectedBlockView: null,
                        dragBlock: null,
                    });
                }
                return;
            }

            var block = blockView.block;
            var currentThread = block.getThread();
            if (block && currentThread) {
                var distance = this.offset().top - board.offset().top - $(window).scrollTop();

                var datum = currentThread.toJSON(true);
                var firstBlock = _.head(datum);
                firstBlock.x = firstBlock.x - svgWidth + (dx || 0);
                firstBlock.y = firstBlock.y + distance + (dy || 0);

                var newBlock = Entry.do('addThreadFromBlockMenu', datum).value.getFirstBlock();
                var newBlockView = newBlock && newBlock.view;

                //if some error occured
                //blockView is not exist
                if (!newBlockView) {
                    _.result(newBlock, 'destroy');
                    return;
                }

                this._boardBlockView = newBlockView;

                newBlockView.onMouseDown.call(newBlockView, e);
                newBlockView.dragInstance.set({
                    isNew: true,
                });

                GS.setView(newBlockView, workspaceMode);
            }
        } else {
            if (GS.setView(blockView, workspaceMode)) {
                GS.adjust(dx, dy);
                GS.addControl(e);
            }
        }
    };

    p.terminateDrag = function() {
        var boardBlockView = this._boardBlockView;

        if (!boardBlockView) return;

        this._boardBlockView = null;

        //board block should be removed below the amount of range
        var { left, width } = Entry.GlobalSvg;
        return left < boardBlockView.getBoard().offset().left - width / 2;
    };

    p.getCode = function(thread) {
        return this.code;
    };

    p.setSelectedBlock = function(blockView) {
        _.result(this.selectedBlockView, 'removeSelected');

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else {
            blockView = null;
        }

        this.set({ selectedBlockView: blockView });
    };

    p.hide = function() {
        this.view.addClass('entryRemove');
    };

    p.show = function() {
        this.view.removeClass('entryRemove');
    };

    p.renderText = function(blocks) {
        if (!this._isOn()) return;

        var blocks = blocks || this._getSortedBlocks();
        var targetMode = Entry.BlockView.RENDER_MODE_TEXT;

        blocks[0].forEach((block) => {
            if (targetMode === block.view.renderMode) {
                return;
            }
            var thread = block.getThread();
            var view = thread.view;
            if (view) {
                view.renderText();
            } else {
                thread.createView(this, Entry.BlockView.RENDER_MODE_TEXT);
            }
        });
        return blocks;
    };

    p.renderBlock = function(blocks) {
        if (!this._isOn()) return;

        blocks = blocks || this._getSortedBlocks();
        var targetMode = Entry.BlockView.RENDER_MODE_BLOCK;

        blocks[0].forEach((block) => {
            if (targetMode === block.view.renderMode) return;
            var thread = block.getThread();
            var view = thread.view;
            if (view) {
                view.renderBlock();
            } else {
                thread.createView(this, Entry.BlockView.RENDER_MODE_BLOCK);
            }
        });
        return blocks;
    };

    p._createSplitter = function(topPos) {
        this._splitters.push(
            this.svgBlockGroup.elem('line', {
                x1: splitterHPadding,
                y1: topPos,
                x2: this._svgWidth - splitterHPadding,
                y2: topPos,
                stroke: '#b5b5b5',
            })
        );
    };

    p.updateSplitters = function(y = 0) {
        var xDest = this._svgWidth - splitterHPadding;
        var yDest;
        this._splitters.forEach((line) => {
            yDest = parseFloat(line.getAttribute('y1')) + y;
            line.attr({
                x2: xDest,
                y1: yDest,
                y2: yDest,
            });
        });
    };

    p._clearSplitters = function() {
        var splitters = this._splitters;
        while (splitters.length) splitters.pop().remove();
    };

    p.setWidth = function() {
        this._svgWidth = this.blockMenuContainer.width();
        this.updateSplitters();
    };

    p.setMenu = function(doNotAlign) {
        if (!this.hasCategory()) return;

        var sorted = [[], []];

        this._categoryData.forEach(({ category, blocks: threads }) => {
            if (category === 'func') {
                var funcThreads = this.code
                    .getThreadsByCategory('func')
                    .map((t) => t.getFirstBlock().type);
                threads = funcThreads.length ? funcThreads : threads;
            }

            var inVisible =
                threads.reduce(
                    (count, type) => (this.checkBanClass(Entry.block[type]) ? count - 1 : count),
                    threads.length
                ) === 0;
            var elem = this._categoryElems[category];

            if (inVisible) sorted[1].push(elem);
            else sorted[0].push(elem);
        });

        requestAnimationFrame(() => {
            //visible
            sorted[0].forEach((elem) => elem.removeClass('entryRemove'));
            //invisible
            sorted[1].forEach((elem) => elem.addClass('entryRemove'));
            this.selectMenu(0, true, doNotAlign);
        });
    };

    p._convertSelector = function(selector) {
        if (!Entry.Utils.isNumber(selector)) return selector;

        selector = Number(selector);
        var categories = this._categories;
        var elems = this._categoryElems;
        for (var i = 0; i < categories.length; i++) {
            var key = categories[i];
            var visible = !elems[key].hasClass('entryRemove');
            if (visible) if (selector-- === 0) return key;
        }
    };

    p.selectMenu = function(selector, doNotFold, doNotAlign) {
        if (!this._isOn() || !this._categoryData) return;

        var oldView = this._selectedCategoryView;

        var name = this._convertSelector(selector);
        if (selector !== undefined && !name) {
            this._dAlign();
            return;
        }

        if (name) this.lastSelector = name;

        this._isSelectingMenu = true;
        switch (name) {
            case VARIABLE:
                Entry.playground.checkVariables();
                break;
            case HW:
                this._generateHwCode();
                this.align();
                break;
        }

        var elem = this._categoryElems[name];
        var animate = false;
        var board = this.workspace.board,
            boardView = board.view,
            className = 'entrySelectedCategory';

        if (oldView) oldView.removeClass(className);

        doNotFold = doNotFold || !this.hasCategory();

        if (elem == oldView && !doNotFold) {
            boardView.addClass('folding');
            this._selectedCategoryView = null;
            elem && elem.removeClass(className);
            Entry.playground.hideTabs();
            animate = true;
            this.visible = false;
        } else if (!oldView && this.hasCategory()) {
            if (!this.visible) {
                animate = true;
                boardView.addClass('foldOut');
                Entry.playground.showTabs();
            }
            boardView.removeClass('folding');
            this.visible = true;
        } else if (!name) this._selectedCategoryView = null;

        if (animate) {
            Entry.bindAnimationCallbackOnce(boardView, () => {
                board.scroller.resizeScrollBar.call(board.scroller);
                boardView.removeClass('foldOut');
                Entry.windowResized.notify();
            });
        }

        this._isSelectingMenu = false;

        if (this.visible) {
            this._selectedCategoryView = elem;
            elem && elem.addClass(className);
        }

        doNotAlign !== true && this._dAlign();
    };

    p._generateCategoryCodes = function(elems) {
        if (!elems) {
            this.categoryRendered = false;
            this.view.addClass('init');
            elems = Object.keys(this._categoryElems);
        }
        if (_.isEmpty(elems)) {
            return;
        }
        var key = elems.shift();
        if (key !== HW) {
            this._generateCategoryCode(key);
        } else this._generateHwCode(true);

        if (elems.length) {
            this._generateCodesTimer = setTimeout(() => this._generateCategoryCodes(elems), 0);
        } else {
            this._generateCodesTimer = null;
            this.view.removeClass('init');
            this.align();
            this.categoryRendered = true;
            this.categoryDoneEvent.notify();
        }
    };

    p._generateCategoryCode = function(category) {
        if (!this._categoryData) return;

        var code = this.code;
        var blocks = _.result(_.find(this._categoryData, { category }), 'blocks');
        if (!blocks) return;

        this._categories.push(category);

        var index;
        if (category == 'func') {
            var threads = this.code.getThreadsByCategory('func');
            if (threads.length) index = this.code.getThreadIndex(threads[0]);
        }

        _buildCategoryCodes(blocks, category).forEach((t) => {
            if (!t || !t[0]) return;
            t[0].x = -99999;
            var thread = this._createThread(t, index);
            if (index !== undefined) index++;
            delete t[0].x;
        });

        code.changeEvent.notify();
    };

    p.banCategory = function(categoryName) {
        var categoryElem = this._categoryElems[categoryName];
        if (!categoryElem) {
            return;
        }
        categoryElem.addClass('entryRemoveCategory');
        if (this.lastSelector === categoryName) {
            this._dSelectMenu(this.firstSelector, true);
        }
    };

    p.unbanCategory = function(category) {
        var threads = _.result(_.find(this._categoryData, { category }), 'blocks');

        if (!threads) {
            return;
        }

        var count = threads.reduce(
            (count, block) => (this.checkBanClass(Entry.block[block]) ? count - 1 : count),
            threads.length
        );

        var categoryElem = this._categoryElems[category];
        if (categoryElem && count > 0) {
            categoryElem.removeClass('entryRemoveCategory');
            categoryElem.removeClass('entryRemove');
        }
    };

    p.banClass = function(className, doNotAlign) {
        var banned = this._bannedClass;
        if (!_.contains(banned, className)) {
            banned.push(className);
            doNotAlign !== true && this._dAlign();
        }
    };

    p.unbanClass = function(className, doNotAlign) {
        var banned = this._bannedClass;
        var index = banned.indexOf(className);
        if (index > -1) {
            banned.splice(index, 1);
            doNotAlign !== true && this._dAlign();
        }
    };

    p.checkBanClass = function({ isNotFor = [] } = {}) {
        if (_.isEmpty(isNotFor)) {
            return false;
        }

        var banned = this._bannedClass;
        isNotFor = isNotFor.filter(_.identity);

        for (var i = 0; i < isNotFor.length; i++) {
            if (!_.contains(banned, isNotFor[i])) {
                return false;
            }
        }

        return true;
    };

    p.checkCategory = function(blockInfo) {
        if (!this.hasCategory() || !blockInfo) return;

        if (!this.lastSelector || this._selectDynamic) return true;

        return !_.contains(blockInfo.isFor || [], `category_${this.lastSelector}`);
    };

    p._addControl = function(dom) {
        var { _mouseWheel, onMouseDown, _scroller } = this;

        dom.on('wheel', _mouseWheel.bind(this));

        if (_scroller) {
            $(this.svg).bind('mousedown touchstart', onMouseDown.bind(this));
        }
    };

    p.removeControl = function(eventType) {
        this.svgDom.off(eventType);
    };

    p.onMouseDown = function(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var blockMenu = this;
        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            var mouseEvent = Entry.Utils.convertMouseEvent(e);

            if (Entry.documentMousedown) Entry.documentMousedown.notify(mouseEvent);
            var doc = $(document);

            doc.bind('mousemove.blockMenu', onMouseMove);
            doc.bind('mouseup.blockMenu', onMouseUp);
            doc.bind('touchmove.blockMenu', onMouseMove);
            doc.bind('touchend.blockMenu', onMouseUp);

            this.dragInstance = new Entry.DragInstance({
                startY: mouseEvent.pageY,
                offsetY: mouseEvent.pageY,
            });
        }

        function onMouseMove(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            var { pageY } = Entry.Utils.convertMouseEvent(e);

            var dragInstance = blockMenu.dragInstance;
            blockMenu._scroller.scroll(-pageY + dragInstance.offsetY);
            dragInstance.set({ offsetY: pageY });
        }

        function onMouseUp(e) {
            $(document).unbind('.blockMenu');
            delete blockMenu.dragInstance;
        }
    };

    p._mouseWheel = function(e) {
        e = e.originalEvent;
        e.preventDefault();
        var disposeEvent = Entry.disposeEvent;
        if (disposeEvent) disposeEvent.notify(e);
        this._scroller.scroll(-e.wheelDeltaY || e.deltaY / 3);
    };

    p.dominate = function({ view: { svgGroup } }) {
        this.svgBlockGroup.appendChild(svgGroup);
    };

    p.reDraw = function() {
        if (!this._isOn()) return;

        var selector = this.lastSelector;
        if (this._selectDynamic) selector = undefined;

        this.selectMenu(selector, true);
        this._getSortedBlocks()
            .shift()
            .forEach(({ view }) => view.reDraw());
    };

    p._handleDragBlock = function() {
        this._boardBlockView = null;
        if (this._scroller) {
            this._scroller.setOpacity(0);
        }
    };

    p._captureKeyEvent = function(e) {
        var keyCode = e.keyCode;

        if (e.ctrlKey && Entry.type == 'workspace' && keyCode > 48 && keyCode < 58) {
            e.preventDefault();
            setTimeout(() => {
                this._cancelDynamic(true);
                this._dSelectMenu(keyCode - 49, true);
            }, 200);
        }
    };

    p.enablePattern = function() {
        this.pattern.removeAttribute('style');
    };

    p.disablePattern = function() {
        this.pattern.attr({ style: 'display: none' });
    };

    p._clearCategory = function() {
        if (this._generateCodesTimer) {
            clearTimeout(this._generateCodesTimer);
            this._generateCodesTimer = null;
        }

        this._selectedCategoryView = null;
        this._categories = [];
        this._threadsMap = {};

        var _removeFunc = _.partial(_.result, _, 'remove');

        _.each(this._categoryElems, _removeFunc);

        this._categoryElems = {};

        var code = this.code;
        if (code && code.constructor == Entry.Code) {
            code.clear();
        }

        _removeFunc(this._categoryCol);
        this._categoryData = null;
    };

    p.clearCategory = p._clearCategory;

    p.setCategoryData = function(data) {
        this._clearCategory();
        this._categoryData = data;
        this._generateCategoryView(data);
        this._generateCategoryCodes();
        this.setMenu();
        Entry.resizeElement();
    };

    p.setNoCategoryData = function(data) {
        this._clearCategory();
        Entry.resizeElement();
        this.changeCode(data, true);
        this.categoryDoneEvent.notify();
    };

    p._generateCategoryView = function(data) {
        if (!data) return;

        _.result(this._categoryCol, 'remove');

        this._categoryCol = Entry.Dom('ul', {
            class: 'entryCategoryListWorkspace',
        });
        this.view.prepend(this._categoryCol);

        var fragment = document.createDocumentFragment();
        data.forEach(({ category, visible }) =>
            fragment.appendChild(this._generateCategoryElement(category, visible)[0])
        );
        this.firstSelector = _.head(data).category;
        this._categoryCol[0].appendChild(fragment);
    };

    p._generateCategoryElement = function(name, visible) {
        return (this._categoryElems[name] = Entry.Dom('li', {
            id: 'entryCategory' + name,
            classes: [
                'entryCategoryElementWorkspace',
                'entryRemove',
                visible === false ? 'entryRemoveCategory' : '',
            ],
        })
            .bindOnClick((e) => {
                this._cancelDynamic(true, () => {
                    this.selectMenu(name, undefined, true);
                    this.align();
                });
            })
            .text(Lang.Blocks[name.toUpperCase()]));
    };

    p.updateOffset = function() {
        this._offset = this.svgDom.offset();
    };

    p.offset = function() {
        var { top = 0, left = 0 } = this._offset || {};
        if (top === 0 && left === 0) {
            this.updateOffset();
        }
        return this._offset;
    };

    p._generateHwCode = function(shouldHide) {
        var threads = this.code.getThreadsByCategory(HW);

        if (!(this._categoryData && this.shouldGenerateHwCode(threads))) {
            return;
        }

        threads.forEach((t) => {
            this._deleteThreadsMap(t);
            t.destroy();
        });

        var blocks = _.result(_.find(this._categoryData, { category: HW }), 'blocks');

        if (_.isEmpty(blocks)) return;

        _buildCategoryCodes(blocks.filter((b) => !this.checkBanClass(Entry.block[b])), HW).forEach(
            (t) => {
                if (shouldHide) t[0].x = -99999;
                this._createThread(t);
                delete t[0].x;
            }
        );

        this.hwCodeOutdated = false;
        Entry.dispatchEvent('hwCodeGenerated');
    };

    p.setAlign = function(align) {
        this._align = align || 'CENTER';
    };

    p._isNotVisible = function(blockInfo) {
        return this.checkCategory(blockInfo) || this.checkBanClass(blockInfo);
    };

    p._getSortedBlocks = function() {
        var visibles = [];
        var inVisibles;
        var block;

        var _getFirstBlock = _.partial(_.result, _, 'getFirstBlock');

        var allBlocks = _.chain(this._getThreads())
            .map(_getFirstBlock)
            .compact()
            .value();

        if (this._selectDynamic) {
            var threadsMap = this._threadsMap;
            visibles = this._dynamicThreads.reduce((visibles, type) => {
                block = _getFirstBlock(threadsMap[type]);
                if (block) visibles.push(block);
                return visibles;
            }, []);

            inVisibles = allBlocks;
        } else {
            inVisibles = [];
            allBlocks.forEach((block) => {
                if (!this._isNotVisible(Entry.block[block.type])) visibles.push(block);
                else inVisibles.push(block);
            });
        }

        return [visibles, inVisibles];
    };

    p._setDynamic = function(blocks = []) {
        if (!this._isOn()) return;
        var data;

        this._dynamicThreads = blocks
            .map((b) => {
                if (typeof b === 'string') {
                    return b;
                } else if (b.constructor === Array) {
                    var keyName = b[0];
                    if (!this.getThreadByBlockKey(keyName)) {
                        data = b[1];
                        data.category = 'extra';
                        this._createThread([data], undefined, keyName);
                    }
                    return keyName;
                }
            })
            .filter(_.identity);

        this._selectDynamic = true;
        this.selectMenu(undefined, true);
    };

    p._cancelDynamic = function(fromElement, cb) {
        if (this._setDynamicTimer) {
            clearTimeout(this._setDynamicTimer);
            this._setDynamicTimer = null;
        }
        this._selectDynamic = false;
        this._dynamicThreads = [];
        if (fromElement !== true) {
            this.selectMenu(this.lastSelector, true);
        }
        cb && cb();
    };

    p._isOn = function() {
        return this.view.css('display') !== 'none';
    };

    p.deleteRendered = function(name) {
        delete this._renderedCategories[name];
    };

    p.clearRendered = function() {
        this._renderedCategories = {};
    };

    p.hasCategory = function() {
        return !!this._categoryData;
    };

    p.getDom = function(query) {
        if (_.isEmpty(query)) {
            return;
        }
        if (query[0] === 'category') {
            return this._categoryElems[query[1]];
        } else {
            var { type, params = [] } = query[0][0];
            this.align();
            this.scrollToType(type, params);
            return this.getSvgDomByType(type, params);
        }
    };

    p.getSvgDomByType = function(blockType, params) {
        var thread = _.find(this.code.getThreads(), (thread) => {
            if (!thread) {
                return;
            }
            const { type, params: threadParams } = thread.getFirstBlock();
            let option = true;
            if (
                blockType === 'calc_basic' ||
                blockType === 'boolean_basic_operator' ||
                blockType === 'boolean_and_or'
            ) {
                option = type === blockType && threadParams[1] === params[1];
            }
            return type === blockType && option;
        });

        if (!thread) return;

        return thread.getFirstBlock().view.svgGroup;
    };

    p.scrollToType = function(type, params) {
        if (!type) return;

        var block = _.head(this.code.getBlockList(false, type));
        if (!block) return;

        this.hasCategory() && this.selectMenu(block.category, true);

        if (isOverFlow(this.getSvgDomByType(type, params).getBoundingClientRect())) {
            this._scroller.scrollByPx(block.view.y - 20);
        }

        function isOverFlow({ bottom }) {
            return bottom > $(window).height() - 10;
        }
    };

    p.shouldGenerateHwCode = function(threads) {
        return this.hwCodeOutdated || threads.length === 0;
    };

    p._registerThreadsMap = function(type, thread) {
        if (!(type && thread && thread.getFirstBlock())) return;
        this._threadsMap[type] = thread;
    };

    p._deleteThreadsMap = function(thread) {
        var block = thread && thread.getFirstBlock();
        if (!block) return;
        delete this._threadsMap[block.type];
    };

    p.getThreadByBlockKey = function(key) {
        return this._threadsMap[key];
    };

    p._getThreads = function() {
        return this.code.getThreads();
    };

    p._createThread = function(data, index, keyName) {
        if (typeof keyName !== 'string') keyName = undefined;
        keyName = keyName || data[0].type;

        var thread = this.code.createThread(data, index);
        this._registerThreadsMap(keyName, thread);
        return thread;
    };

    function _buildCategoryCodes(blocks, category) {
        return blocks.reduce((threads, type) => {
            var block = Entry.block[type];
            if (!block || !block.def) {
                return [...threads, [{ type: type, category }]];
            } else {
                return (block.defs || [block.def]).reduce(
                    (threads, d) => [...threads, [Object.assign(d, { category })]],
                    threads
                );
            }
        }, []);
    }
})(Entry.BlockMenu.prototype);
