'use strict';
/*
 *
 * @param {object} dom which to inject playground
 */
import Visible from '@egjs/visible';
import debounce from 'lodash/debounce';

const VARIABLE = 'variable';
const HW = 'arduino';
const practicalCourseCategoryList = ['hw_motor', 'hw_melody', 'hw_sensor', 'hw_led', 'hw_robot'];
const splitterHPadding = EntryStatic.splitterHPadding || 20;

class BlockMenu {
    constructor(dom, align, categoryData, scroll, readOnly) {
        Entry.Model(this, false);
        const { options = {} } = Entry;
        const { disableHardware = false } = options;

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
        this._dynamicThreads = [];
        this._setDynamicTimer = null;
        this._renderedCategories = {};
        this.readOnly = readOnly === undefined ? true : readOnly;
        this.scale = 1;

        this._threadsMap = {};
        let $dom;

        if (typeof dom === 'string') {
            $dom = $(`#${dom}`);
        } else {
            $dom = $(dom);
        }

        if ($dom.prop('tagName') !== 'DIV') {
            return console.error('Dom is not div element');
        }

        this.view = $dom;

        this.visible = true;
        this.hwCodeOutdated = false;
        this._svgId = `blockMenu${_.now()}`;
        this._clearCategory();

        // disableHardware 인 경우, 하드웨어 카테고리와 실과형 로봇카테고리 전부를 제외한다.
        this._categoryData = _.remove(
            categoryData,
            ({ category }) =>
                !(
                    disableHardware &&
                    (category === HW || practicalCourseCategoryList.indexOf(category) > -1)
                )
        );

        this._generateView(this._categoryData);

        this._splitters = [];
        this.setWidth();

        this.svg = Entry.SVG(this._svgId);
        Entry.Utils.addFilters(this.svg, this.suffix);
        const { pattern } = Entry.Utils.addBlockPattern(this.svg, this.suffix);
        this.pattern = pattern;

        this.svgGroup = this.svg.elem('g');

        this.svgThreadGroup = this.svgGroup.elem('g');
        this.svgThreadGroup.board = this;

        this.svgBlockGroup = this.svgGroup.elem('g');
        this.svgBlockGroup.board = this;

        this.svgCommentGroup = this.svgGroup.elem('g');
        this.svgCommentGroup.board = this;

        this.changeEvent = new Entry.Event(this);
        this.categoryDoneEvent = new Entry.Event(this);

        this.observe(this, '_handleDragBlock', ['dragBlock']);

        this.changeCode(new Entry.Code([]));
        this._categoryData && this._generateCategoryCodes();

        if (this._scroll) {
            this._scroller = new Entry.BlockMenuScroller(this);
            this._addControl($dom.find('.blockMenuContainer'));
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
    }

    schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null,
    };

    _buildCategoryCodes(blocks, category) {
        return blocks.reduce((threads, type) => {
            const block = Entry.block[type];
            if (!block || !block.def) {
                return [...threads, [{ type, category }]];
            } else {
                return (block.defs || [block.def]).reduce(
                    (threads, d) => [...threads, [Object.assign(d, { category })]],
                    threads
                );
            }
        }, []);
    }

    _generateView(categoryData) {
        const parent = this.view;
        const that = this;

        categoryData && this._generateCategoryView(categoryData);

        this.blockMenuContainer = Entry.Dom('div', {
            class: 'blockMenuContainer',
            parent,
        });
        Entry.Utils.disableContextmenu(this.blockMenuContainer);
        this.blockMenuWrapper = Entry.Dom('div', {
            class: 'blockMenuWrapper',
            parent: this.blockMenuContainer,
        });

        this.svgDom = Entry.Dom(
            $(
                `<svg id="${this._svgId}" class="blockMenu" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>`
            ),
            { parent: this.blockMenuWrapper }
        );
        this.svgDom.mouseenter(function() {
            that._scroller && that._scroller.setOpacity(0.8);

            const selectedBlockView = that.workspace.selectedBlockView;
            if (
                !Entry.playground ||
                Entry.playground.resizing ||
                (selectedBlockView && selectedBlockView.dragMode === Entry.DRAG_MODE_DRAG) ||
                Entry.GlobalSvg.isShow
            ) {
                return;
            }
            Entry.playground.focusBlockMenu = true;
            const bBox = that.svgGroup.getBBox();
            const adjust = that.hasCategory() ? 64 : 0;
            const expandWidth = bBox.width + bBox.x + adjust + 2;
            const { menuWidth } = Entry.interfaceState;
            if (expandWidth > menuWidth) {
                this.widthBackup = menuWidth - adjust - 2;
                $(that.blockMenuWrapper).css('width', expandWidth - adjust);
            }
        });

        this.svgDom.mouseleave(() => {
            this.foldBlockMenu();
        });

        Entry.Utils.bindBlockViewHoverEvent(this, this.svgDom);
        $(window).scroll(this.updateOffset.bind(this));
    }

    foldBlockMenu() {
        const playground = Entry.playground;
        if (!playground || playground.resizing) {
            return;
        }

        if (this._scroller) {
            this._scroller.setOpacity(0);
        }

        const widthBackup = this.svg.widthBackup;
        if (widthBackup) {
            $(this.blockMenuWrapper).css('width', widthBackup);
        }
        delete this.svg.widthBackup;
        delete playground.focusBlockMenu;
    }

    changeCode(code, isImmediate) {
        if (code instanceof Array) {
            code = new Entry.Code(code);
        }

        if (!(code instanceof Entry.Code)) {
            return console.error('You must inject code instance');
        }

        _.result(this.codeListener, 'destroy');

        const that = this;
        this.set({ code });
        this.codeListener = this.code.changeEvent.attach(this, () => {
            that.changeEvent.notify();
        });
        code.createView(this);

        if (isImmediate) {
            this.align();
        } else {
            this._dAlign();
        }
    }

    bindCodeView(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
        if (this._scroller) {
            this.svgGroup.appendChild(this._scroller.svgGroup);
        }
    }

    align() {
        const code = this.code;
        if (!(this._isOn() && code)) {
            return;
        }
        this._clearSplitters();

        const vPadding = 15;
        let marginFromTop = 10;
        const hPadding = this._align === 'LEFT' ? 10 : this.svgDom.width() / 2;

        let pastClass;
        const blocks = this._getSortedBlocks();
        const [visibles = [], inVisibles = []] = blocks;

        inVisibles.forEach(({ view: blockView } = {}) => {
            if (!blockView) {
                return;
            }
            blockView.set({ display: false });
            blockView.detach();
        });

        const lastSelector = this.lastSelector;
        const shouldReDraw = !this._renderedCategories[lastSelector];
        visibles.forEach(({ view: blockView, type } = {}, index) => {
            if (!blockView) {
                return;
            }
            blockView.attach();
            blockView.set({ display: true });
            shouldReDraw && blockView.reDraw();

            const className = Entry.block[type].class;
            if (pastClass && pastClass !== className) {
                this._createSplitter(marginFromTop);
                marginFromTop += vPadding;
            }
            pastClass = className;

            let left = hPadding - blockView.offsetX;
            if (this._align === 'CENTER') {
                left -= blockView.width / 2;
            }

            marginFromTop -= blockView.offsetY;
            blockView.moveTo(left, marginFromTop, false);
            if (index > 0) {
                marginFromTop += blockView.marginBottom || 0;
            }
            marginFromTop += blockView.height + vPadding;
        });

        this.updateSplitters();

        if (this.workspace) {
            const mode = this.workspace.getMode();
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

        if (lastSelector !== 'func') {
            this._renderedCategories[lastSelector] = true;
        }
        this.changeEvent.notify();
    }

    cloneToGlobal(e) {
        const blockView = this.dragBlock;
        if (this._boardBlockView || blockView === null) {
            if (this.svg.widthBackup) {
                this.foldBlockMenu();
            }
            return;
        }

        const GS = Entry.GlobalSvg;
        const workspace = this.workspace;
        const workspaceMode = workspace.getMode();
        const { MODE_BOARD, MODE_OVERLAYBOARD } = Entry.Workspace;

        const svgWidth = this._svgWidth;

        const board = workspace.selectedBoard;
        const { x = 0, y = 0 } = blockView.mouseDownCoordinate || {};
        const dx = e.pageX - x;
        const dy = e.pageY - y;
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

            const block = blockView.block;
            const currentThread = block.getThread();
            if (block && currentThread) {
                const distance = this.offset().top - board.offset().top - $(window).scrollTop();

                const datum = currentThread.toJSON(true);
                const firstBlock = _.head(datum);
                firstBlock.x = firstBlock.x - svgWidth + (dx || 0);
                firstBlock.y = firstBlock.y + distance + (dy || 0);

                const newBlock = Entry.do('addThreadFromBlockMenu', datum).value.getFirstBlock();
                const newBlockView = newBlock && newBlock.view;

                // if some error occured
                // blockView is not exist
                if (!newBlockView) {
                    _.result(newBlock, 'destroy');
                    return;
                }

                this._boardBlockView = newBlockView;

                newBlockView.onMouseDown.call(newBlockView, e);
                if (newBlockView.dragInstance) {
                    newBlockView.dragInstance.set({
                        isNew: true,
                    });
                }

                GS.setView(newBlockView, workspaceMode);
            } else {
            }
        } else {
            if (GS.setView(blockView, workspaceMode)) {
                GS.adjust(dx, dy);
                GS.addControl(e);
            }
        }
    }

    terminateDrag() {
        const boardBlockView = this._boardBlockView;

        if (!boardBlockView) {
            return;
        }

        this._boardBlockView = null;

        //board block should be removed below the amount of range
        const { left, width } = Entry.GlobalSvg;
        return left < boardBlockView.getBoard().offset().left - width / 2;
    }

    getCode() {
        return this.code;
    }

    setSelectedBlock(blockView) {
        _.result(this.selectedBlockView, 'removeSelected');

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else {
            blockView = null;
        }

        this.set({ selectedBlockView: blockView });
    }

    hide() {
        this.view.addClass('entryRemove');
    }

    show() {
        this.view.removeClass('entryRemove');
    }

    renderText(blocks) {
        if (!this._isOn()) {
            return;
        }

        blocks = blocks || this._getSortedBlocks();
        const targetMode = Entry.BlockView.RENDER_MODE_TEXT;

        blocks[0].forEach((block) => {
            if (targetMode === block.view.renderMode) {
                return;
            }
            const thread = block.getThread();
            const view = thread.view;
            if (view) {
                view.renderText();
            } else {
                thread.createView(this, Entry.BlockView.RENDER_MODE_TEXT);
            }
        });
        return blocks;
    }

    renderBlock(blocks) {
        if (!this._isOn()) {
            return;
        }

        blocks = blocks || this._getSortedBlocks();
        const targetMode = Entry.BlockView.RENDER_MODE_BLOCK;

        blocks[0].forEach((block) => {
            if (targetMode === block.view.renderMode) {
                return;
            }
            const thread = block.getThread();
            const view = thread.view;
            if (view) {
                view.renderBlock();
            } else {
                thread.createView(this, Entry.BlockView.RENDER_MODE_BLOCK);
            }
        });
        return blocks;
    }

    _createSplitter(topPos) {
        const { common = {} } = EntryStatic.colorSet || {};
        this._splitters.push(
            this.svgBlockGroup.elem('line', {
                x1: splitterHPadding,
                y1: topPos,
                x2: this._svgWidth - splitterHPadding,
                y2: topPos,
                stroke: common.SPLITTER || '#AAC5D5',
            })
        );
    }

    updateSplitters(y = 0) {
        const xDest = this._svgWidth - splitterHPadding;
        let yDest;
        this._splitters.forEach((line) => {
            yDest = parseFloat(line.getAttribute('y1')) + y;
            line.attr({
                x2: xDest,
                y1: yDest,
                y2: yDest,
            });
        });
    }

    _clearSplitters() {
        const splitters = this._splitters;
        while (splitters.length) {
            splitters.pop().remove();
        }
    }

    setWidth() {
        this._svgWidth = this.blockMenuContainer.width();
        this.updateSplitters();
    }

    setMenu(doNotAlign) {
        if (!this.hasCategory()) {
            return;
        }

        const sorted = [[], []];

        this._categoryData.forEach(({ category, blocks: threads }) => {
            if (category === 'func') {
                const funcThreads = this.code
                    .getThreadsByCategory('func')
                    .map((t) => t.getFirstBlock().type);
                threads = funcThreads.length ? funcThreads : threads;
            }

            const inVisible =
                threads.reduce(
                    (count, type) => (this.checkBanClass(Entry.block[type]) ? count - 1 : count),
                    threads.length
                ) === 0;
            const elem = this._categoryElems[category];

            if (inVisible) {
                sorted[1].push(elem);
            } else {
                sorted[0].push(elem);
            }
        });

        requestAnimationFrame(() => {
            //visible
            sorted[0].forEach((elem) => elem.removeClass('entryRemove'));
            //invisible
            sorted[1].forEach((elem) => elem.addClass('entryRemove'));
            this.selectMenu(0, true, doNotAlign);
        });
    }

    _convertSelector(selector) {
        if (!Entry.Utils.isNumber(selector)) {
            return selector;
        }

        selector = Number(selector);
        const categories = this._categories;
        const elems = this._categoryElems;
        for (let i = 0; i < categories.length; i++) {
            const key = categories[i];
            const visible = !elems[key].hasClass('entryRemove');
            if (visible) {
                if (selector-- === 0) {
                    return key;
                }
            }
        }
    }

    selectMenu(selector, doNotFold, doNotAlign) {
        if (Entry.disposeEvent) {
            Entry.disposeEvent.notify();
        }
        if (!this._isOn() || !this._categoryData) {
            return;
        }

        const oldView = this._selectedCategoryView;

        const name = this._convertSelector(selector);
        if (selector !== undefined && !name) {
            this._dAlign();
            return;
        }

        if (name) {
            this.lastSelector = name;
        }

        switch (name) {
            case VARIABLE:
                Entry.playground.checkVariables();
                break;
            case HW:
                this._generateHwCode();
                this.align();
                break;
        }

        const elem = this._categoryElems[name];
        let animate = false;
        const board = this.workspace.board;
        const boardView = board.view;
        const className = 'entrySelectedCategory';
        const className2 = 'entryUnSelectedCategory';

        if (oldView) {
            oldView.removeClass(className);
            oldView.addClass(className2);
        }

        doNotFold = doNotFold || !this.hasCategory();

        if (elem == oldView && !doNotFold) {
            boardView.addClass('folding');
            this._selectedCategoryView = null;
            if (elem) {
                elem.removeClass(className);
                elem.addClass(className2);
            }
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
        } else if (!name) {
            this._selectedCategoryView = null;
        }

        if (animate) {
            Entry.bindAnimationCallbackOnce(boardView, () => {
                board.scroller.resizeScrollBar.call(board.scroller);
                boardView.removeClass('foldOut');
                Entry.windowResized.notify();
            });
        }

        if (this.visible) {
            this._selectedCategoryView = elem;
            if (elem) {
                elem.removeClass(className2);
                elem.addClass(className);
            }
        }

        doNotAlign !== true && this._dAlign();
    }

    _generateCategoryCodes(elems) {
        if (!elems) {
            this.view.addClass('init');
            elems = Object.keys(this._categoryElems);
        }
        if (_.isEmpty(elems)) {
            return;
        }
        const key = elems.shift();
        if (key !== HW) {
            this._generateCategoryCode(key);
        } else {
            this._generateHwCode(true);
        }

        if (elems.length) {
            this._generateCodesTimer = setTimeout(() => this._generateCategoryCodes(elems), 0);
        } else {
            this._generateCodesTimer = null;
            this.view.removeClass('init');
            this.align();
            this.categoryDoneEvent.notify();
        }
    }

    _generateCategoryCode(category) {
        if (!this._categoryData) {
            return;
        }

        const code = this.code;
        const blocks = _.result(_.find(this._categoryData, { category }), 'blocks');
        if (!blocks) {
            return;
        }

        this._categories.push(category);

        let index;
        if (category === 'func') {
            const threads = this.code.getThreadsByCategory('func');
            if (threads.length) {
                index = this.code.getThreadIndex(threads[0]);
            }
        }

        this._buildCategoryCodes(blocks, category).forEach((t) => {
            if (!t || !t[0]) {
                return;
            }
            t[0].x = -99999;
            this._createThread(t, index);
            if (index !== undefined) {
                index++;
            }
            delete t[0].x;
        });

        code.changeEvent.notify();
    }

    banCategory(categoryName) {
        const categoryElem = this._categoryElems[categoryName];
        if (!categoryElem) {
            return;
        }
        categoryElem.addClass('entryRemoveCategory');
        if (this.lastSelector === categoryName) {
            this._dSelectMenu(this.firstSelector, true);
        }
    }

    unbanCategory(category) {
        const threads = _.result(_.find(this._categoryData, { category }), 'blocks');

        if (!threads) {
            return;
        }

        const count = threads.reduce(
            (count, block) => (this.checkBanClass(Entry.block[block]) ? count - 1 : count),
            threads.length
        );

        const categoryElem = this._categoryElems[category];
        if (categoryElem && count > 0) {
            categoryElem.removeClass('entryRemoveCategory');
            categoryElem.removeClass('entryRemove');
        }
    }

    banClass(className, doNotAlign) {
        const banned = this._bannedClass;
        if (!_.includes(banned, className)) {
            banned.push(className);
            doNotAlign !== true && this._dAlign();
        }
    }

    unbanClass(className, doNotAlign) {
        const banned = this._bannedClass;
        const index = banned.indexOf(className);
        if (index > -1) {
            banned.splice(index, 1);
            doNotAlign !== true && this._dAlign();
        }
    }

    checkBanClass({ isNotFor = [] } = {}) {
        if (_.isEmpty(isNotFor)) {
            return false;
        }

        const banned = this._bannedClass;
        isNotFor = isNotFor.filter(_.identity);

        for (let i = 0; i < isNotFor.length; i++) {
            if (!_.includes(banned, isNotFor[i])) {
                return false;
            }
        }

        return true;
    }

    checkCategory(blockInfo) {
        if (!this.hasCategory() || !blockInfo) {
            return;
        }

        if (!this.lastSelector || this._selectDynamic) {
            return true;
        }

        return !_.includes(blockInfo.isFor || [], `category_${this.lastSelector}`);
    }

    /**
     * 특정 카테고리에 특정 블록명을 추가한다.
     * 카테고리가 존재하지 않거나 블록명이 이미 등록된 경우 스킵한다.
     * Entry.block 목록에 실제 데이터가 있는지, blockMenu 의 그리기 갱신이 필요한지는 상관하지 않는다.
     * @param categoryName {string}
     * @param blockName {string}
     */
    addCategoryData(categoryName, blockName) {
        const selectedCategory = this._categoryData.find(
            (element) => element.category === categoryName
        );
        if (selectedCategory && selectedCategory.blocks.indexOf(blockName) === -1) {
            selectedCategory.blocks.push(blockName);
        }
    }

    _addControl(dom) {
        const { _mouseWheel, onMouseDown, _scroller } = this;

        dom.on('wheel', _mouseWheel.bind(this));

        if (_scroller) {
            $(this.svg).bind('mousedown touchstart', onMouseDown.bind(this));
        }
    }

    destroy() {
        this.categoryIndicatorVisible.off();
        this._categoryCol.off();
        $(document).off('.blockMenuScroll');
    }

    removeControl(eventType) {
        this.svgDom.off(eventType);
    }

    onMouseMove = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (Entry.isMobile()) {
            this._scroller.setOpacity(0.8);
        }

        const { pageY } = Entry.Utils.convertMouseEvent(e);

        const dragInstance = this.dragInstance;
        this._scroller.scroll(-pageY + dragInstance.offsetY);
        dragInstance.set({ offsetY: pageY });
    };

    onMouseUp = () => {
        if (Entry.isMobile()) {
            this._scroller.setOpacity(0);
        }
        if (e.button != 1) {
            $(document).unbind('.blockMenu');
            delete this.dragInstance;
        }
    };

    onMouseDown(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            const mouseEvent = Entry.Utils.convertMouseEvent(e);
            if (Entry.documentMousedown) {
                Entry.documentMousedown.notify(mouseEvent);
            }
            const doc = $(document);

            doc.bind('mousemove.blockMenu touchmove.blockMenu', this.onMouseMove);
            doc.bind('mouseup.blockMenu touchend.blockMenu', this.onMouseUp);

            this.dragInstance = new Entry.DragInstance({
                startY: mouseEvent.pageY,
                offsetY: mouseEvent.pageY,
            });
        }
    }

    _mouseWheel(e) {
        e = e.originalEvent;
        e.preventDefault();
        const disposeEvent = Entry.disposeEvent;
        if (disposeEvent) {
            disposeEvent.notify(e);
        }
        this._scroller.scroll(-e.wheelDeltaY || e.deltaY / 3);
    }

    dominate({ view: { svgGroup } }) {
        this.svgBlockGroup.appendChild(svgGroup);
    }

    reDraw() {
        if (!this._isOn()) {
            return;
        }

        let selector = this.lastSelector;
        if (this._selectDynamic) {
            selector = undefined;
        }

        this.selectMenu(selector, true);
        this._getSortedBlocks()
            .shift()
            .forEach(({ view }) => view.reDraw());
    }

    _handleDragBlock() {
        this._boardBlockView = null;
        if (this._scroller) {
            this._scroller.setOpacity(0);
        }
    }

    _captureKeyEvent(e) {
        const keyCode = e.keyCode;

        if (e.ctrlKey && Entry.type === 'workspace' && keyCode > 48 && keyCode < 58) {
            e.preventDefault();
            setTimeout(() => {
                this._cancelDynamic(true);
                this._dSelectMenu(keyCode - 49, true);
            }, 200);
        }
    }

    enablePattern() {
        this.pattern.removeAttribute('style');
    }

    disablePattern() {
        this.pattern.attr({ style: 'display: none' });
    }

    _clearCategory() {
        if (this._generateCodesTimer) {
            clearTimeout(this._generateCodesTimer);
            this._generateCodesTimer = null;
        }

        this._selectedCategoryView = null;
        this._categories = [];
        this._threadsMap = {};

        const _removeFunc = _.partial(_.result, _, 'remove');

        _.each(this._categoryElems, _removeFunc);

        this._categoryElems = {};

        const code = this.code;
        if (code && code.constructor == Entry.Code) {
            code.clear();
        }

        _removeFunc(this._categoryCol);
        this._categoryData = null;
    }

    clearCategory = this._clearCategory;

    setCategoryData(data) {
        this._clearCategory();
        this._categoryData = data;
        this._generateCategoryView(data);
        this._generateCategoryCodes();
        this.setMenu();
        Entry.resizeElement();
    }

    setNoCategoryData(data) {
        this._clearCategory();
        Entry.resizeElement();
        this.changeCode(data, true);
        this.categoryDoneEvent.notify();
    }

    /**
     * 카테고리의 목록 뷰를 그린다.
     * @param data {{category: string, blocks: object[]}[]} EntryStatic.getAllBlocks
     * @private
     */
    _generateCategoryView(data) {
        if (!data) {
            return;
        }

        _.result(this._categoryCol, 'remove');

        this.categoryWrapper = Entry.Dom('div', {
            class: 'entryCategoryListWorkspace',
        });
        this._categoryCol = Entry.Dom('ul', {
            class: 'entryCategoryList',
            parent: this.categoryWrapper,
        });
        this.view.prepend(this.categoryWrapper);

        const fragment = document.createDocumentFragment();

        /*
        visible = static_mini 의 실과형 하드웨어에서만 사용됩니다. (EntryStatic 에 책임)
         */
        data.forEach(({ category, visible }) =>
            fragment.appendChild(this._generateCategoryElement(category, visible)[0])
        );
        this.firstSelector = _.head(data).category;
        this._categoryCol[0].appendChild(fragment);
        this.makeScrollIndicator();
    }

    makeScrollIndicator() {
        ['append', 'prepend'].forEach((action) => {
            const point = Entry.Dom('li', {
                class: `visiblePoint ${action}`,
            });
            const indicator = Entry.Dom('a', {
                class: `scrollIndicator ${action}`,
            });
            indicator.bindOnClick(() => {
                point[0].scrollIntoView({
                    behavior: 'smooth',
                });
            });
            point.attr('data-action', action);
            indicator.attr('data-action', action);
            this._categoryCol[action](point);
            this._categoryCol[action](indicator);
        });

        this.categoryIndicatorVisible = new Visible('.entryCategoryListWorkspace', {
            targetClass: 'visiblePoint',
            expandSize: 0,
        });
        this.categoryIndicatorVisible.on('change', (e) => {
            e.visible.forEach((dom) => {
                const { dataset } = dom;
                const { action } = dataset;
                $(`.scrollIndicator.${action}`).css('display', 'none');
            });
            e.invisible.forEach((dom) => {
                const { dataset } = dom;
                const { action } = dataset;
                $(`.scrollIndicator.${action}`).css('display', 'block');
            });
        });
        this._categoryCol.on(
            'scroll',
            debounce(() => {
                this.categoryIndicatorVisible.check();
            }, 100)
        );
        setTimeout(() => {
            this.categoryIndicatorVisible.check();
        }, 0);
        if (Entry.windowResized) {
            Entry.windowResized.attach(this, () => {
                this.categoryIndicatorVisible.check();
            });
        }
        $(document).on('visibilitychange.blockMenuScroll', (e) => {
            if (document.visibilityState === 'visible') {
                requestAnimationFrame(() => {
                    this.categoryIndicatorVisible.check();
                });
            }
        });
    }

    _generateCategoryElement(name, visible) {
        return (this._categoryElems[name] = Entry.Dom('li', {
            id: `entryCategory${name}`,
            classes: [
                'entryCategoryElementWorkspace',
                'entryRemove',
                visible === false ? 'entryRemoveCategory' : '',
            ],
        })
            .bindOnClick(() => {
                this._cancelDynamic(true, () => {
                    this.selectMenu(name, undefined, true);
                    this.align();
                });
            })
            .text(Lang.Blocks[name.toUpperCase()]));
    }

    updateOffset() {
        this._offset = this.svgDom.offset();
    }

    offset() {
        const { top = 0, left = 0 } = this._offset || {};
        if (top === 0 && left === 0) {
            this.updateOffset();
        }
        return this._offset;
    }

    _generateHwCode(shouldHide) {
        const threads = this.code.getThreadsByCategory(HW);

        if (!(this._categoryData && this.shouldGenerateHwCode(threads))) {
            return;
        }

        threads.forEach((t) => {
            this._deleteThreadsMap(t);
            t.destroy();
        });

        const blocks = _.result(_.find(this._categoryData, { category: HW }), 'blocks');

        if (_.isEmpty(blocks)) {
            return;
        }

        this._buildCategoryCodes(
            blocks.filter((b) => !this.checkBanClass(Entry.block[b])),
            HW
        ).forEach((t) => {
            if (shouldHide) {
                t[0].x = -99999;
            }
            this._createThread(t);
            delete t[0].x;
        });

        this.hwCodeOutdated = false;
        Entry.dispatchEvent('hwCodeGenerated');
    }

    setAlign(align) {
        this._align = align || 'CENTER';
    }

    _isNotVisible(blockInfo) {
        return this.checkCategory(blockInfo) || this.checkBanClass(blockInfo);
    }

    _getSortedBlocks() {
        let visibles = [];
        let inVisibles;
        let block;

        const _getFirstBlock = _.partial(_.result, _, 'getFirstBlock');

        const allBlocks = _.chain(this._getThreads())
            .map(_getFirstBlock)
            .compact()
            .value();

        if (this._selectDynamic) {
            const threadsMap = this._threadsMap;
            visibles = this._dynamicThreads.reduce((visibles, type) => {
                block = _getFirstBlock(threadsMap[type]);
                if (block) {
                    visibles.push(block);
                }
                return visibles;
            }, []);

            inVisibles = allBlocks;
        } else {
            inVisibles = [];
            allBlocks.forEach((block) => {
                if (!this._isNotVisible(Entry.block[block.type])) {
                    visibles.push(block);
                } else {
                    inVisibles.push(block);
                }
            });
        }

        return [visibles, inVisibles];
    }

    _setDynamic(blocks = []) {
        if (!this._isOn()) {
            return;
        }
        let data;

        this._dynamicThreads = blocks
            .map((b) => {
                if (typeof b === 'string') {
                    return b;
                } else if (b.constructor === Array) {
                    const keyName = b[0];
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
    }

    _cancelDynamic(fromElement, cb) {
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
    }

    _isOn() {
        return this.view.css('display') !== 'none';
    }

    deleteRendered(name) {
        delete this._renderedCategories[name];
    }

    clearRendered() {
        this._renderedCategories = {};
    }

    hasCategory() {
        return !!this._categoryData;
    }

    getDom(query) {
        if (_.isEmpty(query)) {
            return;
        }
        if (query[0] === 'category') {
            return this._categoryElems[query[1]];
        } else {
            const { type, params = [] } = query[0][0];
            this.align();
            this.scrollToType(type, params);
            return this.getSvgDomByType(type, params);
        }
    }

    getSvgDomByType(blockType, params) {
        const thread = _.find(this.code.getThreads(), (thread) => {
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

        if (!thread) {
            return;
        }

        return thread.getFirstBlock().view.svgGroup;
    }

    scrollToType(type, params) {
        if (!type) {
            return;
        }

        const block = _.head(this.code.getBlockList(false, type));
        if (!block) {
            return;
        }

        this.hasCategory() && this.selectMenu(block.category, true);

        if (isOverFlow(this.getSvgDomByType(type, params).getBoundingClientRect())) {
            this._scroller.scrollByPx(block.view.y - 20);
        }

        function isOverFlow({ bottom }) {
            return bottom > $(window).height() - 10;
        }
    }

    shouldGenerateHwCode(threads) {
        return this.hwCodeOutdated || threads.length === 0;
    }

    _registerThreadsMap(type, thread) {
        if (!(type && thread && thread.getFirstBlock())) {
            return;
        }
        this._threadsMap[type] = thread;
    }

    _deleteThreadsMap(thread) {
        const block = thread && thread.getFirstBlock();
        if (!block) {
            return;
        }
        delete this._threadsMap[block.type];
    }

    getThreadByBlockKey(key) {
        return this._threadsMap[key];
    }

    _getThreads() {
        return this.code.getThreads();
    }

    _createThread(data, index, keyName) {
        if (typeof keyName !== 'string') {
            keyName = undefined;
        }
        keyName = keyName || data[0].type;

        const thread = this.code.createThread(data, index);
        this._registerThreadsMap(keyName, thread);
        return thread;
    }
}

Entry.BlockMenu = BlockMenu;
