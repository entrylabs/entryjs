Entry.Comment = class Comment {
    dragMode = Entry.DRAG_MODE_NONE;
    offsetX = 50;
    offsetY = 10;
    schema = {
        x: 0,
        y: 0,
        parentWidth: 0,
        parentHeight: 0,
        width: 160,
        height: 160,
        readOnly: false,
        visible: true,
        display: true,
        movable: true,
        isOpened: true,
    };

    constructor(block, board) {
        Entry.Model(this, false);

        if (!board.svgCommentGroup) {
            return;
        }
        const { view } = block;
        const { svgGroup } = view || {};
        this._block = block;
        this._board = board;
        this._blockView = view;
        this.value = '';
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            this.createComment();
            this.startRender();
            this.addControl();
        }

        this.observe(this, 'updateOpacity', ['visible'], false);
        this.observe(this, 'toggleContent', ['isOpened'], false);
        this.observe(
            this,
            'setPosition',
            ['x', 'y', 'width', 'height', 'parentWidth', 'parentHeight', 'isOpened'],
            false
        );
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

    createComment() {
        const { svgGroup, pathGroup } = this.blockView || {};
        this.pathGroup = pathGroup;
        this.parentGroup = svgGroup;
        this.svgGroup = this._blockView.commentShapeGroup;
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.resizeMouseDown = this.resizeMouseDown.bind(this);
        this.resizeMouseMove = this.resizeMouseMove.bind(this);
        this.resizeMouseUp = this.resizeMouseUp.bind(this);
        this.toggleMouseDown = this.toggleMouseDown.bind(this);
        this.toggleMouseUp = this.toggleMouseUp.bind(this);
    }

    startRender() {
        if (this.svgGroup) {
            this.id = Entry.generateHash();
            this._line = this.svgGroup.elem('line');

            this._contentGroup = this.svgGroup.elem('g');
            this._comment = this._contentGroup.elem('rect');
            this._path = this._contentGroup.elem('defs').elem('path');
            this._text = this._contentGroup.elem('text');
            this._textPath = this._text.elem('textPath');
            this._resizeArea = this._contentGroup.elem('rect');
            this._resizeArrow = this._contentGroup.elem('image');

            this._title = this.svgGroup.elem('rect');
            this._titleGroup = this.svgGroup.elem('g');
            this._toggleArrow = this._titleGroup.elem('image');
            this._titlePath = this._titleGroup.elem('defs').elem('path');
            this._titleText = this._titleGroup.elem('text');
            this._titleTextPath = this._titleText.elem('textPath');

            this._commentIcon = this.svgGroup.elem('image');
            this._toggleArea = this.svgGroup.elem('rect');

            this.canRender = true;
            this.setFrame();
            this.initSchema();
        }
    }

    initSchema() {
        const { width: parentWidth } = this.pathGroup.getBBox();
        const { topFieldHeight, height } = this._blockView;
        const parentHeight = topFieldHeight || height;
        const { titleHeight, defaultLineLength } = this;
        const x = defaultLineLength + parentWidth;
        const y = parentHeight / 2 - titleHeight / 2;

        this.set({
            x,
            y,
            parentWidth,
            parentHeight,
        });
        this.setPosition();
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

        this._line.attr({
            style: 'stroke:#eda913;stroke-width:2',
        });

        this._path.attr({
            id: `${this.id}c`,
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

        this._textPath.textContent =
            '메모입니다. 메모입니다.메모입니다.메모입니다.메모입니다.메모입니다메모입니다.' +
            '메모입니다.메모입니다.메모입니다.메모입니다.메모입니다.메모입니다. 메모입니다.' +
            '메모입니다.메모입니다.메모입니다.메모입니다.';

        const path = `${Entry.mediaFilePath}block_icon/comment/`;
        this._resizeArea.attr({
            width: 20,
            height: 20,
            fill: 'transparent',
            class: 'entry-comment-resize-arrow',
        });

        this._resizeArrow.attr({
            href: `${path}resize_arrow.svg`,
        });

        this._toggleArea.attr({
            y: this.y,
            width: 20,
            height: this.titleHeight,
            fill: 'transparent',
        });

        this._toggleArrow.attr({
            href: `${path}toggle_open_arrow.svg`,
        });

        this._commentIcon.attr({
            href: `${path}comment_icon.svg`,
        });

        if (!this.block) {
            this._line.attr({
                class: 'invisible',
            });
        }
    }

    setPosition() {
        if (!this.visible || !this.display) {
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

        this._line.attr({
            x1: this.parentWidth,
            y1: this.parentHeight / 2,
            x2: x + width / 2,
            y2: y + this.titleHeight / 2,
        });

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

    updatePos() {
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
        return this.moveTo(this.x + x, this.y + y);
    }

    resize(x, y) {
        this.set({
            width: this.width + x,
            height: this.height + y,
        });
    }

    setDragInstance(e) {
        const { width: parentWidth } = this.pathGroup.getBBox();
        const { topFieldHeight, height } = this._blockView;
        const parentHeight = topFieldHeight || height;
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const matrix = this.svgGroup.getCTM();
        const { x, y } = Entry.GlobalSvg.getRelativePoint(matrix);
        this.mouseDownCoordinate = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            parentX: x,
            parentY: y,
        };
        this.dragInstance = new Entry.DragInstance({
            startX: x / this.scale + parentWidth,
            startY: y / this.scale + parentHeight / 2,
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
        e.preventDefault();
        e.stopPropagation();

        if (
            (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) &&
            !this._board.readOnly
        ) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.mouseMove, this.mouseUp);
        }
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        if (
            this.dragMode === Entry.DRAG_MODE_DRAG ||
            this.getMouseMoveDiff(mouseEvent) > Entry.BlockView.DRAG_RADIUS
        ) {
            if (this.isEditing) {
                this.destroyTextArea();
            }
            this.set({ visible: false });
            const workspaceMode = this.board.workspace.getMode();

            if (this.dragMode !== Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
            }
            this.moveBy(
                (mouseEvent.pageX - this.dragInstance.offsetX) / this.scale,
                (mouseEvent.pageY - this.dragInstance.offsetY) / this.scale
            );

            this.dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
            });
            Entry.GlobalSvg.commentPosition(this.dragInstance);
        }
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.isEditing && this.isOpened && this.dragMode === Entry.DRAG_MODE_MOUSEDOWN) {
            this.renderTextArea();
        } else {
            this.destroyTextArea();
        }
        
        this.removeMoveSetting(this.mouseMove, this.mouseUp);
    }

    removeMoveSetting(mouseMove, mouseUp) {
        Entry.GlobalSvg.remove();
        this.dragMode = Entry.DRAG_MODE_NONE;
        this.board.set({ dragBlock: null });
        this.set({ visible: true });
        this.removeDomEvent(mouseMove, mouseUp);
        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }

    addControl() {
        const bindEvent = (dom, func) => {
            dom.addEventListener('mousedown', func);
            dom.addEventListener('ontouchstart', func);
        };
        bindEvent(this._comment, this.mouseDown);
        bindEvent(this._title, this.mouseDown);
        bindEvent(this._resizeArea, this.resizeMouseDown);
        bindEvent(this._toggleArea, this.toggleMouseDown);
    }

    updateOpacity() {
        if (this.visible === false) {
            this.svgGroup.attr({ opacity: 0 });
        } else {
            this.svgGroup.removeAttr('opacity');
            this.setPosition();
        }
    }

    isReadOnly() {
        return this.readOnly;
    }

    getBoard() {
        return undefined;
    }

    getAbsoluteCoordinate(dragMode = this.dragMode) {
        const scale = this.scale;
        let pos = null;
        const { parentX, parentY } = this.mouseDownCoordinate;
        const posX = this.x;
        const posY = this.y;
        if (dragMode === Entry.DRAG_MODE_DRAG) {
            pos = {
                x: posX,
                y: posY,
                scaleX: this.x + parentX / scale,
                scaleY: this.y + parentY / scale,
            };
        } else {
            pos = this.block.getThread().view.requestAbsoluteCoordinate(this);
            pos.x += posX;
            pos.y += posY;
            pos.scaleX = pos.x / scale;
            pos.scaleY = pos.y / scale;
        }
        return pos;
    }

    renderTextArea() {
        this.isEditing = true;
        const { top, left } = this._comment.getBoundingClientRect();
        this.event = Entry.disposeEvent.attach(this, () => {
            this._textPath.textContent = this.textArea.val();
            this.destroyTextArea();
        });
        this.textArea = Entry.Dom('textarea', {
            class: 'entry-widget-textarea',
            parent: $('body'),
        });
        this.bindDomEventTextArea();
        this.textArea.val(this._textPath.textContent);
        this.textArea.css({
            left,
            top: this.titleHeight * this.scale + top,
            'font-size': `${this.fontSize}px`,
            width: this.width * this.scale,
            height: (this.height - this.titleHeight) * this.scale,
            'border-radius': `0 0 ${4 * this.scale}px ${4 * this.scale}px`,
            padding: `${3 * this.scale}px ${6 * this.scale}px`,
        });
        this.textArea.focus && this.textArea.focus();
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
            const textVal = this.textArea.val();
            this.textArea.remove();
            this._textPath.textContent = textVal;
            this._titleTextPath.textContent = textVal;
            delete this.textArea;
        }

        Entry.Utils.blur();
    }

    resizeMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.resizeMouseMove, this.resizeMouseUp);
        }
    }

    resizeMouseMove(e) {
        e.preventDefault();
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
        e.preventDefault();
        e.stopPropagation();

        this.set({
            width: Number(this._comment.getAttribute('width')),
            height: Number(this._comment.getAttribute('height')),
        });
        
        this.removeMoveSetting(this.resizeMouseMove, this.resizeMouseUp);
    }

    toggleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            this.setDragInstance(e);
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            this.bindDomEvent(this.mouseMove, this.toggleMouseUp);
        }
    }

    toggleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.dragMode === Entry.DRAG_MODE_MOUSEDOWN) {
            this.set({
                isOpened: !this.isOpened,
            });
        }
        this.removeMoveSetting(this.mouseMove, this.toggleMouseUp);
    }

    toggleContent() {
        const path = `${Entry.mediaFilePath}block_icon/comment/`;
        let fileName;
        if (this.isOpened) {
            this._contentGroup.classList.remove('invisible');
            this._titleText.classList.add('invisible');
            this._titleGroup.classList.remove('invisible');
            fileName = 'toggle_open_arrow.svg';
        } else {
            if (this._block) {
                this._titleGroup.classList.add('invisible');
            }
            this._contentGroup.classList.add('invisible');
            this._titleText.classList.remove('invisible');
            fileName = 'toggle_close_arrow.svg';
            this.destroyTextArea();
        }
        this._toggleArrow.attr({
            href: path + fileName,
        });
    }
};
