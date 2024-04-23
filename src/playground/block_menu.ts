import Visible from '@egjs/visible';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import identity from 'lodash/identity';
import remove from 'lodash/remove';
import includes from 'lodash/includes';
import head from 'lodash/head';
import find from 'lodash/find';
import ModelClass from '../core/modelClass';
import Hammer from 'hammerjs';

import { EntryDom } from '../../types/index';

const VARIABLE = 'variable';
const HW = 'arduino';
const practicalCourseCategoryList = ['hw_motor', 'hw_melody', 'hw_sensor', 'hw_led', 'hw_robot'];
const splitterHPadding = EntryStatic.splitterHPadding || 20;
const BETA_LIST = [];

type BlockMenuAlignType = 'LEFT' | 'CENTER';

type CategoryData = {
    category: string;
    blocks: string[];
    visible?: boolean;
};

type Schema = {
    code: any;
    dragBlock: any;
    closeBlock: any;
    selectedBlockView: any;
};

class BlockMenu extends ModelClass<Schema> {
    public visible = true;
    public hwCodeOutdated = false;
    public code: any;
    public view: EntryDom;
    public changeEvent: any; // Entry.Event
    public categoryDoneEvent: any; // Entry.Event
    public codeListener: any; // Entry.Event
    private readonly _svgId = `blockMenu${Date.now()}`;
    private readonly suffix = 'blockMenu';
    private readonly _dSelectMenu: any;
    private readonly _scroll: boolean;
    private readonly _scroller: any; // Entry.BlockMenuScroller
    private readonly _bannedClass: string[];
    private readonly _splitters: any[];
    // view elements
    private svg: any; // Entry.SVG
    private svgDom: EntryDom;
    private pattern: any;
    private svgGroup: any;
    private svgThreadGroup: any;
    private svgBlockGroup: any;
    private svgCommentGroup: any;
    private _boardBlockView: any; // in block
    private _categoryCol: EntryDom;
    private _offset: JQuery.Coordinates;
    private categoryWrapper: EntryDom;
    private blockMenuContainer: EntryDom;
    private blockMenuWrapper: EntryDom;
    private blockMenuWrapperForTrashcan: EntryDom;
    private objectAlert: any;
    private _dynamicThreads: any[];
    private _selectDynamic: boolean;
    private _setDynamicTimer: any;
    private _align: BlockMenuAlignType;
    private _categories: any[];
    private _categoryData: CategoryData[];
    private _categoryElems: { [categoryName: string]: EntryDom };
    private _selectedCategoryView?: EntryDom;
    private _renderedCategories: { [key: string]: boolean };
    private _threadsMap: { [key: string]: any }; // any => thread
    private _svgWidth: number;
    private _generateCodesTimer: NodeJS.Timeout;
    private categoryIndicatorVisible: any; // egjs.visible
    private widthBackup: number;
    private lastSelector: string;

    private firstSelector: string;
    private workspace: any;
    private dragInstance: any; // Entry.dragInstance
    // schema
    private selectedBlockView: any;
    private dragBlock: any;

    _setDynamic = debounce((blocks = []) => {
        if (!this._isOn()) {
            return;
        }
        let data;

        this._dynamicThreads = blocks
            .map((block: any) => {
                if (typeof block === 'string') {
                    return block;
                } else if (block.constructor === Array) {
                    const keyName = block[0];
                    if (!this.getThreadByBlockKey(keyName)) {
                        data = block[1];
                        data.category = 'extra';
                        this._createThread([data], undefined, keyName);
                    }
                    return keyName;
                }
            })
            .filter(identity);

        this._selectDynamic = true;
        this.selectMenu(undefined, true);
    }, 150);

    reDraw = debounce(() => {
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
    }, 100);

    constructor(
        dom: EntryDom,
        align: BlockMenuAlignType,
        categoryData: CategoryData[],
        scroll: boolean
    ) {
        super(
            {
                code: null,
                dragBlock: null,
                closeBlock: null,
                selectedBlockView: null,
            },
            false
        );
        const { hardwareEnable } = Entry;

        this._dSelectMenu = debounce(this.selectMenu, 0);

        this._align = align || 'CENTER';
        this._svgWidth = 254;
        this._scroll = scroll !== undefined ? scroll : false;
        this._bannedClass = [];
        this._categories = [];
        this._dynamicThreads = [];
        this._setDynamicTimer = null;
        this._renderedCategories = {};

        this._threadsMap = {};
        const $dom = typeof dom === 'string' ? $(`#${dom}`) : $(dom);
        if ($dom.prop('tagName') !== 'DIV') {
            throw new Error('Dom is not div element');
        }

        this.view = $dom;

        this._clearCategory();

        // hardwareEnable 인 경우, 하드웨어 카테고리와 실과형 로봇카테고리 전부를 제외한다.
        this._categoryData = remove(
            categoryData,
            ({ category }) =>
                hardwareEnable || [...practicalCourseCategoryList, HW].indexOf(category) <= -1
        );

        this._generateView(this._categoryData);

        this._splitters = [];

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
            Entry.windowResized.attach(this, debounce(this.updateOffset, 200));
        }

        Entry.addEventListener(
            'setBlockMenuDynamic',
            function () {
                this._setDynamicTimer = this._setDynamic.apply(this, arguments);
            }.bind(this)
        );

        Entry.addEventListener('cancelBlockMenuDynamic', this._cancelDynamic.bind(this));
        Entry.addEventListener('fontLoaded', this.reDraw.bind(this));
        this.initBlockDoubleClickEvent();
    }

    initBlockDoubleClickEvent() {
        const hammer = new Hammer(this.code.board.svgBlockGroup);
        hammer.on('doubletap', (e: { target: HTMLElement }) => {
            const blockId = e.target.getAttribute('blockId');
            if (!blockId) {
                return;
            }
            const targetBlock = this.code.findById(blockId);
            if (
                targetBlock.type.startsWith('func_') ||
                ['basic_text', 'clickable_text', 'basic_button'].includes(
                    targetBlock?._schema?.skeleton
                )
            ) {
                return;
            }
            const { width, height } = targetBlock.view;
            const { scale, svg } = this.workspace.board;
            const { left, top, right, bottom } = svg.getBoundingClientRect();
            const boardCenterX = (Math.min(window.innerWidth, right) - left) / 2;
            const boardCenterY = (Math.min(window.innerHeight, bottom) - top) / 2;
            const block = targetBlock.toJSON(true);
            block.x = boardCenterX - (width * scale) / 2;
            block.y = boardCenterY - (height * scale) / 2;

            Entry.do('addThread', [block]);
        });
    }

    foldBlockMenu() {
        const playground = Entry.playground;
        if (!playground || playground.resizing) {
            return;
        }

        if (this._scroller) {
            this._scroller.setOpacity(0);
        }

        const widthBackup = this.widthBackup;
        if (widthBackup) {
            $(this.blockMenuWrapper).css('width', widthBackup);
        }
        delete this.widthBackup;
    }

    changeCode(code: any) {
        if (code instanceof Array) {
            code = new Entry.Code(code);
        }

        if (!(code instanceof Entry.Code)) {
            return console.error('You must inject code instance');
        }

        // this.codeListener?.destory();
        this.codeListener?.destroy?.();

        this.set({ code });
        this.codeListener = this.code.changeEvent.attach(this, () => {
            this.changeEvent.notify();
        });
        code.createView(this);

        this.align();
    }

    bindCodeView(codeView: any) {
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

        let pastClass: string;
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
            if (shouldReDraw || (Entry?.Func?.isEdit && blockView?.block?.data?.params?.length)) {
                blockView.reDraw();
            }
            if (Entry.block[type]) {
                const className = Entry.block[type].class;
                if (pastClass && pastClass !== className) {
                    this._createSplitter(marginFromTop);
                    marginFromTop += vPadding;
                }
                pastClass = className;
            }

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

    cloneToGlobal(e: any) {
        const blockView = this.dragBlock;
        if (this._boardBlockView || blockView === null) {
            if (this.widthBackup) {
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
                if (Entry.toast && !(this.objectAlert && Entry.toast.isOpen(this.objectAlert))) {
                    this.objectAlert = Entry.toast.alert(
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
                const firstBlock: any = head(datum);
                firstBlock.x = firstBlock.x - svgWidth + (dx || 0);
                firstBlock.y = firstBlock.y + distance + (dy || 0);

                const newBlock = Entry.do('addThreadFromBlockMenu', datum).value.getFirstBlock();
                const newBlockView = newBlock?.view;

                // if some error occured
                // blockView is not exist
                if (!newBlockView) {
                    newBlock?.destory();
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

    setSelectedBlock(blockView?: any) {
        this.selectedBlockView?.removeSelected();

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

    renderText(blocks?: any[]) {
        if (!this._isOn()) {
            return;
        }

        blocks = blocks || this._getSortedBlocks();
        const targetMode = Entry.BlockView.RENDER_MODE_TEXT;

        blocks[0].forEach((block: any) => {
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

    renderBlock(blocks?: any[]) {
        if (!this._isOn()) {
            return;
        }

        blocks = blocks || this._getSortedBlocks();
        const targetMode = Entry.BlockView.RENDER_MODE_BLOCK;

        blocks[0].forEach((block: any) => {
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

    _createSplitter(topPos: number) {
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

    setMenu(doNotAlign?: boolean) {
        if (!this.hasCategory()) {
            return;
        }

        const sorted: [any[], any[]] = [[], []];
        this._categoryData.forEach(({ category, blocks: threads }) => {
            if (category === 'func') {
                const funcThreads = this.code
                    .getThreadsByCategory('func')
                    .map((thread: any) => thread.getFirstBlock().type);
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

    toggleBlockMenu() {
        const board = this.workspace.board;
        const boardView = board.view;
        const elem = this._categoryElems[this.lastSelector];
        const className = 'entrySelectedCategory';
        const className2 = 'entryUnSelectedCategory';

        if (!boardView.hasClass('folding')) {
            boardView.addClass('folding');
            Entry.playground.resizeHandle_.addClass('folding');
            Entry.playground.resizeHandle_.removeClass('unfolding');
            if (elem) {
                elem.removeClass(className);
                elem.addClass(className2);
            }
            Entry.playground.hideTabs();
            this.visible = false;
        } else {
            if (!this.visible) {
                boardView.addClass('foldOut');
                Entry.playground.showTabs();
            }
            boardView.removeClass('folding');
            Entry.playground.resizeHandle_.addClass('unfolding');
            Entry.playground.resizeHandle_.removeClass('folding');
            this.visible = true;
        }
        Entry.bindAnimationCallbackOnce(boardView, () => {
            board.scroller.resizeScrollBar.call(board.scroller);
            boardView.removeClass('foldOut');
            Entry.windowResized.notify();
        });

        if (this.visible) {
            if (elem) {
                elem.removeClass(className2);
                elem.addClass(className);
            }
        }

        this.align();
    }

    selectMenu(selector: number | string, doNotFold: boolean, doNotAlign?: boolean) {
        if (Entry.disposeEvent) {
            Entry.disposeEvent.notify();
        }
        if (!this._isOn() || !this._categoryData) {
            return;
        }

        const oldView = this._selectedCategoryView;
        const name = this._convertSelector(selector);
        if (selector !== undefined && !name) {
            this.align();
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
        const handle = Entry.playground.resizeHandle_;
        const className = 'entrySelectedCategory';
        const className2 = 'entryUnSelectedCategory';

        if (oldView) {
            oldView.removeClass(className);
            oldView.addClass(className2);
        }

        if (this.visible) {
            this._selectedCategoryView = elem;
            if (elem) {
                elem.removeClass(className2);
                elem.addClass(className);
            }
        }

        doNotAlign !== true && this.align();
    }

    banCategory(categoryName: string) {
        const categoryElem = this._categoryElems[categoryName];
        if (!categoryElem) {
            return;
        }
        categoryElem.addClass('entryRemoveCategory');
        if (this.lastSelector === categoryName) {
            this._dSelectMenu(this.firstSelector, true);
        }
    }

    unbanCategory(category: string) {
        const blockList = this._getCategoryBlocks(category);

        if (!blockList) {
            return;
        }

        const count = blockList.reduce(
            (count, block) => (this.checkBanClass(Entry.block[block]) ? count - 1 : count),
            blockList.length
        );

        const categoryElem = this._categoryElems[category];
        if (categoryElem && count > 0) {
            categoryElem.removeClass('entryRemoveCategory');
            categoryElem.removeClass('entryRemove');
        }
    }

    banClass(className: string, doNotAlign?: boolean) {
        const banned = this._bannedClass;
        if (!includes(banned, className)) {
            banned.push(className);
            doNotAlign !== true && this.align();
        }
    }

    unbanClass(className: string, doNotAlign?: boolean) {
        const banned = this._bannedClass;
        const index = banned.indexOf(className);
        if (index > -1) {
            banned.splice(index, 1);
            doNotAlign !== true && this.align();
        }
    }

    checkBanClass({ isNotFor = [] } = {}) {
        if (isEmpty(isNotFor)) {
            return false;
        }

        const banned = this._bannedClass;
        const filteredIsNotFor = isNotFor.filter(identity);

        for (let i = 0; i < filteredIsNotFor.length; i++) {
            if (!includes(banned, filteredIsNotFor[i])) {
                return false;
            }
        }

        return true;
    }

    checkCategory(blockInfo: any) {
        if (!this.hasCategory() || !blockInfo) {
            return;
        }

        if (!this.lastSelector || this._selectDynamic) {
            return true;
        }

        return !includes(blockInfo.isFor || [], `category_${this.lastSelector}`);
    }

    /**
     * 특정 카테고리에 특정 블록명을 추가한다.
     * 카테고리가 존재하지 않거나 블록명이 이미 등록된 경우 스킵한다.
     * Entry.block 목록에 실제 데이터가 있는지, blockMenu 의 그리기 갱신이 필요한지는 상관하지 않는다.
     * @param categoryName {string}
     * @param blockName {string}
     */
    addCategoryData(categoryName: string, blockName: string) {
        const selectedCategory = this._categoryData.find(
            (element) => element.category === categoryName
        );
        if (selectedCategory?.blocks.indexOf(blockName) === -1) {
            selectedCategory.blocks.push(blockName);
        }

        if (!this.getThreadByBlockKey(blockName)) {
            const threadDatum = this._buildCategoryCodes([blockName], categoryName);
            this._createThread(threadDatum[0]);
        }
    }

    destroy() {
        this.categoryIndicatorVisible.off();
        this._categoryCol.off();
        $(document).off('.blockMenuScroll');
    }

    removeControl(eventType: string) {
        this.svgDom.off(eventType);
    }

    onMouseMove(e: JQuery.MouseMoveEvent) {
        e?.stopPropagation();

        if (Entry.isMobile()) {
            this._scroller.setOpacity(0.8);
        }

        const { pageY } = Entry.Utils.convertMouseEvent(e);

        const dragInstance = this.dragInstance;
        this._scroller.scroll(-pageY + dragInstance.offsetY);
        dragInstance.set({ offsetY: pageY });
    }

    onMouseUp(e: JQuery.MouseUpEvent) {
        if (Entry.isMobile()) {
            this._scroller.setOpacity(0);
        }
        if (e.which == 2) {
            console.log('mouse wheel click disabled');
            return;
        }
        if (e.button != 1) {
            $(document).unbind('.blockMenu');
            delete this.dragInstance;
        }
    }

    onMouseDown(e: JQuery.TouchMoveEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.which == 2) {
            console.log('mouse wheel click disabled');
            return;
        }
        if (e.button === 0 || e.originalEvent?.touches) {
            const mouseEvent = Entry.Utils.convertMouseEvent(e);
            if (Entry.documentMousedown) {
                Entry.documentMousedown.notify(mouseEvent);
            }
            const doc = $(document);

            doc.bind('mousemove.blockMenu touchmove.blockMenu', this.onMouseMove.bind(this));
            doc.bind('mouseup.blockMenu touchend.blockMenu', this.onMouseUp.bind(this));

            this.dragInstance = new Entry.DragInstance({
                startY: mouseEvent.pageY,
                offsetY: mouseEvent.pageY,
            });
        }
    }

    dominate({ view: { svgGroup } }: any) {
        this.svgBlockGroup.appendChild(svgGroup);
    }

    _handleDragBlock() {
        this._boardBlockView = null;
        if (this._scroller) {
            this._scroller.setOpacity(0);
        }
    }

    _handleBoardDragBlock() {
        this._toggleTrashcan(!!this.workspace?.board?.dragBlock);
    }

    _toggleTrashcan(visible: boolean) {
        this.blockMenuWrapperForTrashcan?.toggleClass('entryRemove', !visible);
    }

    enablePattern() {
        this.pattern.removeAttribute('style');
    }

    disablePattern() {
        this.pattern.attr({ style: 'display: none' });
    }

    /**
     * lms, entry-web 에서 사용 중
     */
    setCategoryData(data: CategoryData[]) {
        this._clearCategory();
        this._categoryData = data;
        this._generateCategoryView(data);
        this._generateCategoryCodes();
        this.setMenu();
        Entry.resizeElement();
    }

    /**
     * lms 에서 사용 중
     */
    setNoCategoryData(data: any) {
        this._clearCategory();
        Entry.resizeElement();
        this.changeCode(data);
        this.categoryDoneEvent.notify();
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
                    block: 'nearest',
                });
            });
            point.attr('data-action', action);
            indicator.attr('data-action', action);
            //@ts-ignore
            this._categoryCol[action](point);
            //@ts-ignore
            this._categoryCol[action](indicator);
        });

        this.categoryIndicatorVisible = new Visible('.entryCategoryListWorkspace', {
            targetClass: 'visiblePoint',
            expandSize: 0,
        });
        this.categoryIndicatorVisible.on('change', (e: any) => {
            e.visible.forEach((dom: any) => {
                const { dataset } = dom;
                const { action } = dataset;
                $(`.scrollIndicator.${action}`).css('display', 'none');
            });
            e.invisible.forEach((dom: any) => {
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

    _generateHwCode(shouldHide?: boolean) {
        const threads = this.code.getThreadsByCategory(HW);

        if (!(this._categoryData && this.shouldGenerateHwCode(threads))) {
            return;
        }

        threads.forEach((t: any) => {
            this._deleteThreadsMap(t);
            t.destroy();
        });

        const blocks = this._getCategoryBlocks(HW);

        if (isEmpty(blocks)) {
            return;
        }

        this._buildCategoryCodes(
            blocks.filter((b) => !this.checkBanClass(Entry.block[b])),
            HW
        ).forEach((t: any) => {
            if (shouldHide) {
                t[0].x = -99999;
            }
            this._createThread(t);
            delete t[0].x;
        });

        this.hwCodeOutdated = false;
        Entry.dispatchEvent('hwCodeGenerated');
    }

    /**
     * Ntry systems/entryPlayground.js#loadConfig 에서 사용됨
     * 그 외에는 쓸모없음
     * @deprecated
     */
    setAlign(align: BlockMenuAlignType) {
        this._align = align || 'CENTER';
    }

    _cancelDynamic(fromElement: boolean, cb?: () => void) {
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

    deleteRendered(name: string) {
        delete this._renderedCategories[name];
    }

    clearRendered() {
        this._renderedCategories = {};
    }

    hasCategory() {
        return !!this._categoryData;
    }

    getDom(query: any) {
        if (isEmpty(query)) {
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

    getSvgDomByType(blockType: string, params: any[]) {
        const thread = find(this.code.getThreads(), (thread) => {
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

    scrollToType(type: string, params: any[]) {
        if (!type) {
            return;
        }

        const block: any = head(this.code.getBlockList(false, type));
        if (!block) {
            return;
        }

        this.hasCategory() && this.selectMenu(block.category, true);

        if (isOverFlow(this.getSvgDomByType(type, params).getBoundingClientRect())) {
            this._scroller.scrollByPx(block.view.y - 20);
        }

        function isOverFlow({ bottom }: { bottom: number }) {
            return bottom > $(window).height() - 10;
        }
    }

    shouldGenerateHwCode(threads: any) {
        return this.hwCodeOutdated || threads.length === 0;
    }

    getThreadByBlockKey(key: string) {
        return this._threadsMap[key];
    }

    private _buildCategoryCodes(blocks: any, category: string) {
        return blocks.reduce((threads: any, type: string) => {
            const block = Entry.block[type];
            if (!block || !block.def) {
                return [...threads, [{ type, category }]];
            } else {
                return (block.defs || [block.def]).reduce(
                    (threads: any, d: any) => [...threads, [Object.assign(d, { category })]],
                    threads
                );
            }
        }, []);
    }

    enableTrashcan() {
        this.blockMenuWrapperForTrashcan = Entry.Dom('div', {
            class: 'blockMenuWrapper blockMenuTrashcan entryRemove',
            parent: this.blockMenuContainer,
        })
            .on('pointerenter', () => this.blockMenuWrapperForTrashcan.addClass('open'))
            .on('pointerleave', () => this.blockMenuWrapperForTrashcan.removeClass('open'));

        Entry.Dom('span')
            .text(Lang.Workspace.drag_to_remove)
            .appendTo(this.blockMenuWrapperForTrashcan);

        this.workspace?.board?.observe(this, '_handleBoardDragBlock', ['dragBlock']);
    }

    changeTypeThreadByBlockKey(key: string) {
        this.getThreadByBlockKey(key)?.getFirstBlock().changeType();
    }

    private _generateView(categoryData: CategoryData[]) {
        categoryData && this._generateCategoryView(categoryData);

        this.blockMenuContainer = Entry.Dom('div', {
            class: 'blockMenuContainer',
            parent: this.view,
        }).css({
            position: 'relative',
        });
        Entry.Utils.disableContextmenu(this.blockMenuContainer);
        this.blockMenuWrapper = Entry.Dom('div', {
            class: 'blockMenuWrapper',
            parent: this.blockMenuContainer,
        });

        this.svgDom = Entry.Dom(
            $(
                // eslint-disable-next-line max-len
                `<svg id="${this._svgId}" class="blockMenu" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>`
            ),
            { parent: this.blockMenuWrapper }
        );
        this.svgDom.mouseenter(() => {
            this._scroller?.setOpacity(0.8);

            const selectedBlockView = this.workspace.selectedBlockView;
            if (
                !Entry.playground ||
                Entry.playground.resizing ||
                selectedBlockView?.dragMode === Entry.DRAG_MODE_DRAG ||
                Entry.GlobalSvg.isShow
            ) {
                return;
            }
            const bBox = this.svgGroup.getBBox();
            const adjust = this.hasCategory() ? 64 : 0;
            const expandWidth = bBox.width + bBox.x + adjust + 2;
            const menuWidth = 319;
            if (expandWidth > menuWidth) {
                this.widthBackup = menuWidth - adjust - 2;
                $(this.blockMenuWrapper).css('width', expandWidth - adjust);
            }
        });

        this.svgDom.mouseleave(() => {
            this.foldBlockMenu();
        });

        Entry.Utils.bindBlockViewHoverEvent(this, this.svgDom);
        $(window).scroll(this.updateOffset.bind(this));
    }

    private _clearSplitters() {
        while (this._splitters.length) {
            this._splitters.pop().remove();
        }
    }

    private _convertSelector(selector: number | string) {
        if (!Entry.Utils.isNumber(selector)) {
            return selector;
        }

        let selectorNumber = Number(selector);
        const categories = this._categories;
        const elems = this._categoryElems;
        for (let i = 0; i < categories.length; i++) {
            const key = categories[i];
            const visible = !elems[key].hasClass('entryRemove');
            if (visible) {
                if (selectorNumber-- === 0) {
                    return key;
                }
            }
        }
    }

    private _generateCategoryCodes(elems?: any[]) {
        let elemKeys: string[];
        if (!elems) {
            this.view.addClass('init');
            elemKeys = Object.keys(this._categoryElems);
        } else {
            elemKeys = elems;
        }

        if (isEmpty(elemKeys)) {
            return;
        }
        const key = elemKeys.shift();
        if (key !== HW) {
            this._generateCategoryCode(key);
        } else {
            this._generateHwCode(true);
        }

        if (elemKeys.length) {
            this._generateCodesTimer = setTimeout(() => this._generateCategoryCodes(elemKeys), 0);
        } else {
            this._generateCodesTimer = null;
            this.view.removeClass('init');
            this.align();
            this.categoryDoneEvent.notify();
        }
    }

    private _generateCategoryCode(category: string) {
        if (!this._categoryData) {
            return;
        }

        const code = this.code;
        const blocks = this._getCategoryBlocks(category);
        if (!blocks) {
            return;
        }

        this._categories.push(category);

        let index: number;
        if (category === 'func') {
            const threads = this.code.getThreadsByCategory('func');
            if (threads.length) {
                index = this.code.getThreadIndex(threads[0]);
            }
        }

        this._buildCategoryCodes(blocks, category).forEach((t: any) => {
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

    private _addControl(dom: EntryDom) {
        dom.on('wheel', this._mouseWheel.bind(this));

        if (this._scroller) {
            $(this.svg).bind('mousedown touchstart', this.onMouseDown.bind(this));
        }
    }

    // WheelEvent?
    private _mouseWheel(e: any) {
        const originalEvent = e.originalEvent;
        originalEvent.preventDefault();
        const disposeEvent = Entry.disposeEvent;
        if (disposeEvent) {
            disposeEvent.notify(originalEvent);
        }
        this._scroller.scroll(-originalEvent.wheelDeltaY || originalEvent.deltaY / 3);
    }

    private _captureKeyEvent(e: KeyboardEvent) {
        const keyCode = Entry.Utils.inputToKeycode(e);
        if (!keyCode) {
            return;
        }
        if (e.ctrlKey && Entry.type === 'workspace' && keyCode > 48 && keyCode < 58) {
            e.preventDefault();
            setTimeout(() => {
                this._cancelDynamic(true);
                this._dSelectMenu(keyCode, true);
            }, 200);
        }
    }

    private _clearCategory() {
        if (this._generateCodesTimer) {
            clearTimeout(this._generateCodesTimer);
            this._generateCodesTimer = null;
        }

        this._selectedCategoryView = null;
        this._categories = [];
        this._threadsMap = {};

        each(this._categoryElems, (elem) => elem.remove());
        this._categoryElems = {};

        const code = this.code;
        if (code?.constructor == Entry.Code) {
            code.clear();
        }

        this._categoryCol?.remove();
        this._categoryData = null;
    }

    /**
     * 카테고리의 목록 뷰를 그린다.
     * @param data {{category: string, blocks: object[]}[]} EntryStatic.getAllBlocks
     * @private
     */
    private _generateCategoryView(data: CategoryData[]) {
        if (!data) {
            return;
        }

        this._categoryCol?.remove();

        // 카테고리가 이미 만들어져있는 상태에서 데이터만 새로 추가된 경우,
        // categoryWrapper 는 살리고 내부 컬럼 엘리먼트만 치환한다.
        if (!this.categoryWrapper) {
            this.categoryWrapper = Entry.Dom('div', {
                class: 'entryCategoryListWorkspace',
            });
        } else {
            this.categoryWrapper.textContent = '';
        }

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
        this.firstSelector = head(data).category;
        this._categoryCol[0].appendChild(fragment);
        this.makeScrollIndicator();
    }

    private _generateCategoryElement(name: string, visible: boolean) {
        this._categoryElems[name] = Entry.Dom('li', {
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
            .text(Lang.Blocks[name.toUpperCase()]);
        if (BETA_LIST.includes(name)) {
            this._categoryElems[name][0].appendChild(
                Entry.Dom('div', {
                    id: `entryCategory${name}BetaTag`,
                    classes: ['entryCategoryBetaTag'],
                })[0]
            );
        }

        return this._categoryElems[name];
    }

    private _isNotVisible(blockInfo: any) {
        return this.checkCategory(blockInfo) || this.checkBanClass(blockInfo);
    }

    private _getSortedBlocks(): [any[], any[]] {
        let visibles: any[] = [];
        let inVisibles: any[];
        let block;

        const allBlocks: any[] = compact(
            this.code.getThreads().map((thread: any) => thread.getFirstBlock())
        );

        if (this._selectDynamic) {
            const threadsMap = this._threadsMap;
            visibles = this._dynamicThreads.reduce((visibles, type) => {
                block = threadsMap[type].getFirstBlock();
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

    private _isOn() {
        return this.view.css('display') !== 'none';
    }

    private _registerThreadsMap(type: string, thread: any) {
        if (!(type && thread?.getFirstBlock())) {
            return;
        }
        this._threadsMap[type] = thread;
    }

    private _deleteThreadsMap(thread: any) {
        const block = thread?.getFirstBlock();
        if (!block) {
            return;
        }
        delete this._threadsMap[block.type];
    }

    private _createThread(data: any, index?: number, keyName?: string) {
        if (typeof keyName !== 'string') {
            keyName = undefined;
        }
        keyName = keyName || data[0].type;

        const thread = this.code.createThread(data, index);
        this._registerThreadsMap(keyName, thread);
        return thread;
    }

    private _getCategoryBlocks(category: string): string[] | undefined {
        const selectedCategory = find(this._categoryData, { category });
        return selectedCategory?.blocks;
    }
}

export default BlockMenu;
Entry.BlockMenu = BlockMenu;
