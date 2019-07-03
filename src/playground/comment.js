Entry.Comment = class Comment {
    dragMode = Entry.DRAG_MODE_NONE;
    offsetX = 50;
    offsetY = 10;
    schema = {
        id: null,
        x: 0,
        y: 0,
        moveX: 0,
        moveY: 0,
        parentWidth: 0,
        parentHeight: 0,
        width: 160,
        height: 160,
        value: '',
        readOnly: false,
        visible: true,
        display: true,
        movable: true,
        isOpened: true,
        deletable: Entry.Block.DELETABLE_TRUE,
    };

    constructor(schema, board, block) {
        Entry.Model(this, false);

        if (schema) {
            this.set(schema);
        }
        this.generateId(schema);
        this._block = block;
        if (block) {
            this.createComment(board, schema);
        }
        this.magnet = {};
    }

    get block() {
        return this._block;
    }

    get board() {
        return this._board;
    }

    get blockView() {
        return this._blockView;
    }

    get view() {
        return this;
    }

    get defaultLineLength() {
        return 40;
    }

    get titleHeight() {
        return 22;
    }

    get scale() {
        return this.board.scale || 1;
    }

    get fontSize() {
        return this.scale * 10;
    }

    get value() {
        return this.value;
    }

    get thread() {
        return this._thread || (this.block && this.block.thread);
    }

    get code() {
        if (this.board && this.board.getCode) {
            return this.board.getCode();
        }
        if (this.thread && this.thread.getCode) {
            return this.thread.getCode();
        }
    }

    get textAreaPath() {
        let d = '';
        let { width, height } = this;
        width = Math.max(width, 100);
        height = Math.max(height, 100);

        for (let y = 14; y < height - this.titleHeight - 4; y += 16) {
            d += `M6,${y} H${width - 12} `;
        }
        return d;
    }

    get titleTextAreaPath() {
        return `M22,14 H${this.width - 22}`;
    }

    generateId(schema = {}) {
        const id = schema.id || Entry.Utils.generateId();
        this.set({ id });
    }

    createComment(board, schema) {
        if (board) {
            this._board = board;
        }
        const { view } = this.block || {};
        this._blockView = view;
        const { svgGroup, pathGroup, svgCommentGroup } = this.blockView || {};
        this.pathGroup = pathGroup;
        this.parentGroup = svgGroup;

        if (this.block && svgCommentGroup) {
            this.svgGroup = svgCommentGroup.prepend('g');
        } else if (this.board.svgCommentGroup) {
            this.svgGroup = this.board.svgCommentGroup.elem('g');
        } else {
            return;
        }
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.resizeMouseDown = this.resizeMouseDown.bind(this);
        this.resizeMouseMove = this.resizeMouseMove.bind(this);
        this.resizeMouseUp = this.resizeMouseUp.bind(this);
        this.toggleMouseDown = this.toggleMouseDown.bind(this);
        this.toggleMouseUp = this.toggleMouseUp.bind(this);

        this.startRender();
        this.initParentSize();
        if (schema) {
            this.initSchema(schema);
        }
        this.setFrame();
        this.addControl();
        this.setPosition();
        this.code && this.code.registerBlock(this);
        this.setObservers();
    }

    startRender() {
        if (this.block) {
            this._line = this.svgGroup.elem('line');
        }

        this._contentGroup = this.svgGroup.elem('g');
        this._comment = this._contentGroup.elem('rect');
        this._path = this._contentGroup.elem('defs').elem('path');
        this._text = this._contentGroup.elem('text');
        this._textPath = this._text.elem('textPath');
        this._resizeArrow = this._contentGroup.elem('image');
        this._resizeArea = this._contentGroup.elem('rect');

        this._title = this.svgGroup.elem('rect');
        this._titleGroup = this.svgGroup.elem('g');
        this._toggleArrow = this._titleGroup.elem('image');
        this._titlePath = this._titleGroup.elem('defs').elem('path');
        this._titleText = this._titleGroup.elem('text');
        this._titleTextPath = this._titleText.elem('textPath');

        this._commentIcon = this.svgGroup.elem('image');
        this._toggleArea = this.svgGroup.elem('rect');

        this.canRender = true;
    }

    initSchema(schema = {}) {
        const { titleHeight, defaultLineLength } = this;
        const x = this.parentWidth + defaultLineLength;
        const y = this.parentHeight / 2 - titleHeight / 2;

        schema.x = schema.x || x;
        schema.y = schema.y || y;
        schema.width = schema.width || 160;
        schema.height = schema.height || 160;
        this.set(schema);
    }

    initParentSize() {
        if (!this.pathGroup) {
            return;
        }
        const parentWidth = this.pathGroup.getBBox().width;
        const { topFieldHeight, height } = this._blockView;
        const parentHeight = topFieldHeight || height;

        this.set({
            parentWidth,
            parentHeight,
        });
    }

    setFrame() {
        this._comment.attr({
            stroke: '#EDA913',
            fill: '#FFDA85',
            rx: '4',
        });

        this._title.attr({
            stroke: '#EDA913',
            fill: '#FBB315',
            rx: '4',
        });

        if (this.block) {
            this._line.attr({
                style: 'stroke:#eda913;stroke-width:2',
            });
        }

        this._path.attr({
            id: `${this.id}c`,
            stroke: 'red',
        });

        this._titlePath.attr({
            id: `${this.id}t`,
        });

        this._text.attr({
            'font-size': 10,
        });

        this._titleText.attr({
            'font-size': 10,
            fill: 'white',
            'font-weight': 'bold',
            class: 'invisible',
        });

        this._textPath.attr({
            href: `#${this.id}c`,
        });

        this._titleTextPath.attr({
            href: `#${this.id}t`,
        });

        const path = `${Entry.mediaFilePath}block_icon/comment/`;

        this._resizeArea.attr({
            width: 20,
            height: 20,
            fill: 'transparent',
            class: 'entry-comment-resize-arrow',
        });

        this._resizeArrow.attr({
            width: 8,
            height: 8,
            href: `${path}resize_arrow.svg`,
        });

        this._toggleArea.attr({
            y: this.y,
            width: 20,
            height: this.titleHeight,
            fill: 'transparent',
            class: 'entry-comment-toggle-arrow',
        });

        this._toggleArrow.attr({
            width: 8,
            height: 5,
            href: `${path}toggle_open_arrow.svg`,
        });

        this._commentIcon.attr({
            width: 12,
            height: 12,
            href: `${path}comment_icon.svg`,
        });
    }

    setPosition() {
        if (!this.visible) {
            return;
        }
        const { x, y } = this;
        let width = Math.max(this.width, 100);
        let rx = 4;
        const height = Math.max(this.height, 100);
        if (!this.isOpened && this.block) {
            width = 22;
            rx = 11;
        }

        this._title.attr({
            x,
            y,
            rx,
            width,
            height: this.titleHeight,
        });

        this._comment.attr({
            x,
            y,
            width,
            height,
        });

        if (this.block) {
            this._line.attr({
                x1: this.parentWidth,
                y1: this.parentHeight / 2,
                x2: x + width / 2,
                y2: y + this.titleHeight / 2,
            });
        }

        this._path.attr({
            transform: `translate(${x}, ${y + this.titleHeight})`,
            d: this.textAreaPath,
        });

        this._titlePath.attr({
            transform: `translate(${x}, ${y})`,
            d: this.titleTextAreaPath,
        });

        this._resizeArea.attr({
            x: x + width - 20,
            y: y + height - 20,
        });

        this._resizeArrow.attr({
            x: x + width - 14,
            y: y + height - 14,
        });

        this._toggleArea.attr({
            y,
            x: x + width - 20,
            height: this.titleHeight,
        });

        this._toggleArrow.attr({
            x: x + width - 16,
            y: y + 8,
        });

        this._commentIcon.attr({
            x: x + 5,
            y: y + 5,
        });
    }

    setObservers() {
        this._observers = [];
        this._observers.push(this.observe(this, 'updateOpacity', ['visible'], false));
        this._observers.push(this.observe(this, 'toggleContent', ['isOpened']));
        this._observers.push(this.observe(this, 'setValue', ['value']));
        this._observers.push(
            this.observe(this, 'setPosition', [
                'x',
                'y',
                'width',
                'height',
                'parentWidth',
                'parentHeight',
                'isOpened',
            ])
        );
    }

    updatePos() {
        this.set({
            x: this.moveX,
            y: this.moveY,
        });
    }

    updateParentPos() {
        if (this.pathGroup) {
            const { width: parentWidth } = this.pathGroup.getBBox();
            const { topFieldHeight, height } = this._blockView;
            const parentHeight = topFieldHeight || height;
            const { parentWidth: beforeParentWidth, parentHeight: beforeParentHeight } = this;
            const defferenceWidth = parentWidth - beforeParentWidth;
            const defferenceHeight = parentHeight - beforeParentHeight;

            if (defferenceWidth || defferenceHeight) {
                let { x, y } = this;
                x += defferenceWidth;
                y += defferenceHeight;

                this.set({
                    x,
                    y,
                    parentWidth,
                    parentHeight,
                });
            }
        }
    }

    moveTo(x, y) {
        if (!this.display) {
            this.set({ x: -99999, y: -99999 });
        } else {
            this.set({ x, y });
        }
    }

    moveBy(x, y) {
        return this.moveTo(this.x + x / this.scale, this.y + y / this.scale);
    }

    resize(x, y) {
        this.set({
            width: this.width + x,
            height: this.height + y,
        });
    }

    setDragInstance(e) {
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const matrix = this.svgGroup.getCTM();
        const { x, y } = Entry.GlobalSvg.getRelativePoint(matrix);
        const { left: startX, top: startY } = (this.pathGroup &&
            this.pathGroup.getBoundingClientRect()) || { left: x, top: y };
        this.mouseDownCoordinate = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            parentX: x,
            parentY: y,
        };
        this.dragInstance = new Entry.DragInstance({
            startX,
            startY,
            offsetX: mouseEvent.pageX,
            offsetY: mouseEvent.pageY,
            mode: true,
        });
    }

    bindDomEvent(mouseMove, mouseUp) {
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('touchmove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('touchend', mouseUp);
    }

    removeDomEvent(mouseMove, mouseUp) {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('touchmove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('touchend', mouseUp);
    }

    getMouseMoveDiff(mouseEvent) {
        return Math.sqrt(
            Math.pow(mouseEvent.pageX - this.mouseDownCoordinate.x, 2) +
                Math.pow(mouseEvent.pageY - this.mouseDownCoordinate.y, 2)
        );
    }

    mouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        this.longPressTimer = null;
        if (this.board.workingEvent) {
            return;
        }
        this.board.workingEvent = true;

        if ((e.button === 0 || e.type === 'touchstart') && !this.board.readOnly) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.mouseMove, this.mouseUp);
            const eventType = e.type;
            this.board.set({ dragBlock: this });

            if (eventType === 'touchstart' || Entry.isMobile()) {
                this.longPressTimer = setTimeout(() => {
                    if (this.longPressTimer) {
                        this.longPressTimer = null;
                        this.rightClick(e);
                        this.mouseUp(e);
                    }
                }, 700);
            }
        } else if (Entry.Utils.isRightButton(e)) {
            this.rightClick(e);
        }
    }

    rightClick(e) {
        const disposeEvent = Entry.disposeEvent;
        if (disposeEvent) {
            disposeEvent.notify(e);
        }
        delete this.board.workingEvent;
        this.dragMode = Entry.DRAG_MODE_NONE;

        const { clientX: x, clientY: y } = Entry.Utils.convertMouseEvent(e);

        const board = this.board;
        return Entry.ContextMenu.show(_getOptions(this), null, { x, y });

        function _getOptions(comment) {
            const readOnly = comment.readOnly;

            const copyAndPaste = {
                text: Lang.Blocks.copy_paste_comment,
                enable: !readOnly,
                callback() {
                    Entry.do('cloneComment', comment.copy(), board);
                },
            };

            const copy = {
                text: Lang.Blocks.copy_comment,
                enable: !readOnly,
                callback() {
                    comment.copyToClipboard();
                },
            };

            const remove = {
                text: Lang.Blocks.delete_comment,
                enable: !readOnly,
                callback() {
                    Entry.do('removeComment', comment);
                },
            };

            const toggle = {
                text: comment.isOpened ? Lang.Blocks.fold_comment : Lang.Blocks.open_comment,
                enable: !readOnly,
                callback() {
                    Entry.do('toggleComment', comment);
                },
            };

            const separate = {
                text: Lang.Blocks.separate_comment,
                enable: !!comment.block,
                callback() {
                    Entry.do('separateComment', comment);
                },
            };

            const options = [copyAndPaste, copy, remove, toggle, separate];

            return options;
        }
    }

    mouseMove(e) {
        e.stopPropagation();
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        if (
            this.dragMode === Entry.DRAG_MODE_DRAG ||
            this.getMouseMoveDiff(mouseEvent) > Entry.BlockView.DRAG_RADIUS
        ) {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
            if (this.isEditing) {
                this.destroyTextArea();
            }
            const workspaceMode = this.board.workspace.getMode();
            if (this.dragMode !== Entry.DRAG_MODE_DRAG) {
                this.set({
                    moveX: this.x,
                    moveY: this.y,
                });
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
                this.visible && this.set({ visible: false });
                this.generateCommentableBlocks();
            }

            this.set({
                moveX: this.moveX + (mouseEvent.pageX - this.dragInstance.offsetX) / this.scale,
                moveY: this.moveY + (mouseEvent.pageY - this.dragInstance.offsetY) / this.scale,
            });

            this.checkConnectableBlock();
            this.dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
            });
            Entry.GlobalSvg.commentPosition(this.dragInstance);
        }
    }

    mouseUp(e) {
        e.stopPropagation();
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }

        if (!this.isEditing && this.isOpened && this.dragMode === Entry.DRAG_MODE_MOUSEDOWN) {
            this.renderTextArea();
        } else if (this.dragMode === Entry.DRAG_MODE_DRAG) {
            this.destroyTextArea();
            Entry.do('moveComment', this);
            if (this.connectableBlockView) {
                Entry.do('connectComment', this.toJSON(), this.connectableBlockView.block).isPass(
                    true,
                    true
                );
                this.removeSelected();
            }
        }
        if (this.board) {
            this.board.set({ dragBlock: null });
            delete this.board.workingEvent;
        }

        this.removeMoveSetting(this.mouseMove, this.mouseUp);
    }

    removeMoveSetting(mouseMove, mouseUp) {
        const dragMode = this.dragMode;
        this.dragMode = Entry.DRAG_MODE_NONE;
        this.board.set({ dragBlock: null });
        delete this.connectableBlocks;
        this.set({ visible: true });
        this.setPosition();
        this.removeDomEvent(mouseMove, mouseUp);
        const gs = Entry.GlobalSvg;
        const gsRet = gs.terminateDrag(this);
        if (gsRet === gs.REMOVE && dragMode === Entry.DRAG_MODE_DRAG) {
            Entry.do('removeComment', this).isPass(true, true);
        }
        Entry.GlobalSvg.remove();
        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }

    addControl() {
        const bindEvent = (dom, func) => {
            dom.addEventListener('mousedown', func);
            dom.addEventListener('touchstart', func, false);
        };
        bindEvent(this._contentGroup, this.mouseDown);
        bindEvent(this._title, this.mouseDown);
        bindEvent(this._titleGroup, this.mouseDown);
        bindEvent(this._resizeArea, this.resizeMouseDown);
        bindEvent(this._toggleArea, this.toggleMouseDown);
    }

    updateOpacity() {
        this.visible
            ? Entry.Utils.removeClass(this.svgGroup, 'invisible')
            : Entry.Utils.addClass(this.svgGroup, 'invisible');
    }

    isReadOnly() {
        return this.readOnly;
    }

    getBoard() {
        return this.board;
    }

    getAbsoluteCoordinate(dragMode = this.dragMode) {
        const scale = this.scale;
        let pos = null;
        let parentX = 0;
        let parentY = 0;
        let x = this.moveX || this.x;
        let y = this.moveY || this.y;
        if (this.mouseDownCoordinate) {
            parentX = this.mouseDownCoordinate.parentX;
            parentY = this.mouseDownCoordinate.parentY;
        }
        if (this.blockView && dragMode !== Entry.DRAG_MODE_DRAG) {
            x += this.blockView.getAbsoluteCoordinate().x;
            y += this.blockView.getAbsoluteCoordinate().y;
        }
        pos = {
            x,
            y,
            scaleX: x + parentX / scale,
            scaleY: y + parentY / scale,
        };
        return pos;
    }

    renderTextArea() {
        this.isEditing = true;
        const { top, left } = this._comment.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop;
        this.event = Entry.disposeEvent.attach(this, () => {
            this._textPath.textContent = this.value;
            this.destroyTextArea();
        });
        this.textArea = Entry.Dom('textarea', {
            class: 'entry-widget-textarea',
            parent: $('body'),
        });
        this.bindDomEventTextArea();
        this.textArea.val(this.value);
        this.textArea.css({
            left: left - (1 - this.scale) * 0.2 + 2,
            top: this.titleHeight * this.scale + top + 1 + scrollTop,
            'font-size': `${this.fontSize}px`,
            width: (this.width - 16) * this.scale,
            height: (this.height - this.titleHeight - 10) * this.scale,
            border: `${this.scale}px solid transparent`,
            'border-radius': `0 0 ${4 * this.scale}px ${4 * this.scale}px`,
            padding: `${2 * this.scale}px ${4 * this.scale}px`,
        });
        const length = this.value.length;
        this.textArea.focus &&
            this.textArea.focus() &&
            this.textArea[0].setSelectionRange(length, length);
    }

    bindDomEventTextArea() {
        this.textArea.on('mousedown', (e) => {
            e.stopPropagation();
        });
        const exitKeys = [13, 27];
        this.textArea.on('keypress', (e) => {
            if (_.includes(exitKeys, e.keyCode || e.which)) {
                e.preventDefault();
            }
        });
        this.textArea.on('keyup', (e) => {
            if (_.includes(exitKeys, e.keyCode || e.which)) {
                this.destroyTextArea();
                this.isEditing = false;
            }
        });
        this.textArea.one('blur', () => {
            this.destroyTextArea();
            this.isEditing = false;
        });
    }

    destroyTextArea() {
        this.isEditing = false;

        this.event && this.event.destroy();
        delete this.event;

        if (this.textArea) {
            this.textArea.remove();
            const value = this.textArea.val();
            if (this.value !== value) {
                Entry.do('writeComment', this, value);
            }
            delete this.textArea;
        }

        Entry.Utils.blur();
    }

    writeComment(value) {
        this.set({ value });
    }

    setValue() {
        this._textPath.textContent = this.value;
        this._titleTextPath.textContent = this.value;
    }

    resizeMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        if (Entry.documentMousedown) {
            Entry.documentMousedown.notify(e);
        }

        if ((e.button === 0 || e.type === 'touchstart') && !this.board.readOnly) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.resizeMouseMove, this.resizeMouseUp);
        } else if (Entry.Utils.isRightButton(e)) {
            this.rightClick(e);
        }
    }

    resizeMouseMove(e) {
        e.stopPropagation();

        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        if (
            this.dragMode === Entry.DRAG_MODE_DRAG ||
            this.getMouseMoveDiff(mouseEvent) > Entry.BlockView.DRAG_RADIUS
        ) {
            if (this.dragMode !== Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
            }
            this.resize(
                (mouseEvent.pageX - this.dragInstance.offsetX) / this.scale,
                (mouseEvent.pageY - this.dragInstance.offsetY) / this.scale
            );

            this.dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
            });
        }
    }

    resizeMouseUp(e) {
        e.stopPropagation();

        this.set({
            width: Number(this._comment.getAttribute('width')),
            height: Number(this._comment.getAttribute('height')),
        });

        this.removeMoveSetting(this.resizeMouseMove, this.resizeMouseUp);
    }

    toggleMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        if (Entry.documentMousedown) {
            Entry.documentMousedown.notify(e);
        }

        if ((e.button === 0 || e.type === 'touchstart') && !this.board.readOnly) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.mouseMove, this.toggleMouseUp);
        } else if (Entry.Utils.isRightButton(e)) {
            this.rightClick(e);
        }
    }

    toggleMouseUp(e) {
        e.stopPropagation();

        if (this.dragMode === Entry.DRAG_MODE_MOUSEDOWN) {
            Entry.do('toggleComment', this);
        } else {
            Entry.do('moveComment', this);
        }
        this.removeMoveSetting(this.mouseMove, this.toggleMouseUp);
    }

    toggleContent() {
        const path = `${Entry.mediaFilePath}block_icon/comment/`;
        let fileName;
        if (this.isOpened) {
            Entry.Utils.removeClass(this._contentGroup, 'invisible');
            Entry.Utils.addClass(this._titleText, 'invisible');
            Entry.Utils.removeClass(this._titleGroup, 'invisible');
            fileName = 'toggle_open_arrow.svg';
        } else {
            if (this._block) {
                Entry.Utils.addClass(this._titleGroup, 'invisible');
            }
            Entry.Utils.addClass(this._contentGroup, 'invisible');
            Entry.Utils.removeClass(this._titleText, 'invisible');
            fileName = 'toggle_close_arrow.svg';
            this.destroyTextArea();
        }
        this._toggleArrow.attr({
            href: path + fileName,
        });
    }

    setThread(thread) {
        this._thread = thread;
    }

    getThread() {
        let thread;
        if (this.block) {
            thread = this.block.getThread();
        } else {
            thread = this.thread;
        }
        return thread;
    }

    copy() {
        const cloned = this.toJSON(true);
        const { x, y } = this.getAbsoluteCoordinate();
        cloned.x = x + 15;
        cloned.y = y + 15;
        cloned.id = Entry.Utils.generateId();
        cloned.type = 'comment';

        return cloned;
    }

    copyToClipboard() {
        Entry.clipboard = this.copy();
    }

    connectToBlock(block) {
        const data = this.toJSON();
        const board = this.board;
        delete data.x;
        delete data.y;
        delete data.visible;
        this.destroy();
        block.connectComment(new Entry.Comment(data, board, block));
    }

    separateFromBlock() {
        const data = this.toJSON();
        const { x, y } = this.getAbsoluteCoordinate();
        const board = this.board;
        data.x = x;
        data.y = y;
        this.destroy();
        const comment = new Entry.Comment(data, board);
        this.board.code.createThread([comment], 0);
    }

    destroy() {
        if (this.board) {
            this.destroyView();
            this._destroyObservers();
            this.code.unregisterBlock(this);
        }
        if (this.block) {
            this.block.disconnectComment();
        } else {
            this.code.destroyThread(this.thread);
        }
    }

    destroyView() {
        this.removeControl();
        this.svgGroup && this.svgGroup.remove();
        delete this.svgGroup;
    }

    getBlocksInThreads(threads) {
        let blockMap = [];
        for (const thread of threads) {
            const blocks = thread.getBlocks();
            for (const block of blocks) {
                let blocksInStatement = [];
                if (block.statements) {
                    blocksInStatement = this.getBlocksInThreads(block.statements);
                }
                blockMap = [block, ...blocksInStatement, ...blockMap];
            }
        }
        return blockMap;
    }

    generateCommentableBlocks() {
        this.connectableBlocks = [];
        this.connectableBlockCoordinate = null;
        if (this.block) {
            return;
        }

        const threads = (this.code && this.code.getThreads()) || [];
        const blockMap = this.getBlocksInThreads(threads);
        for (const index in blockMap) {
            const block = blockMap[index];
            if (block instanceof Entry.Block && !block.comment && block.isCommentable()) {
                const coordinate = block.view.getAbsoluteCoordinate();
                const { width, height, topFieldHeight } = block.view;
                this.connectableBlocks.push({
                    id: block.id,
                    x1: coordinate.scaleX,
                    y1: coordinate.scaleY,
                    x2: coordinate.scaleX + width,
                    y2: coordinate.scaleY + (topFieldHeight || height),
                });
            }
        }
    }

    checkConnectableBlock() {
        if (this.block) {
            return;
        }
        if (
            this.connectableBlockCoordinate &&
            this.isOnConnectableBlock(this.connectableBlockCoordinate)
        ) {
            return;
        }
        this.removeSelected();
        for (const coordinate of this.connectableBlocks) {
            if (this.isOnConnectableBlock(coordinate)) {
                this.connectableBlockView = this.code.findById(coordinate.id).view;
                this.board.setSelectedBlock(this.connectableBlockView);
                this.connectableBlockCoordinate = coordinate;
                return;
            }
        }
    }

    removeSelected() {
        if (this.connectableBlockView) {
            this.connectableBlockView.removeSelected();
            this.connectableBlockView = null;
        }
        this.connectableBlockCoordinate = null;
    }

    isOnConnectableBlock(coordinate) {
        const { x1, y1, x2, y2 } = coordinate;
        const { moveX: x, moveY: y } = this;
        return x1 <= x && x < x2 && y1 <= y && y < y2;
    }

    isInOrigin() {
        return false;
    }

    reDraw() {}

    _destroyObservers() {
        const observers = this._observers;
        while (observers.length) {
            observers.pop().destroy();
        }
    }

    removeControl() {
        const destroyEvent = (dom, func) => {
            dom.removeEventListener('mousedown', func);
            dom.removeEventListener('ontouchstart', func);
        };
        destroyEvent(this._contentGroup, this.mouseDown);
        destroyEvent(this._title, this.mouseDown);
        destroyEvent(this._resizeArea, this.resizeMouseDown);
        destroyEvent(this._toggleArea, this.toggleMouseDown);
    }

    isDeletable() {
        return this.deletable;
    }

    getCode() {
        return this.code;
    }

    toJSON() {
        const json = this._toJSON();
        json.type = 'comment';
        delete json.parentWidth;
        delete json.parentHeight;
        delete json.moveX;
        delete json.moveY;
        return json;
    }
};
