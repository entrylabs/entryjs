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
        titleHeight: 22,
        defaultLineLength: 40,
        readOnly: false,
        visible: true,
        display: true,
        movable: true,
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

    createComment() {
        let thread = this.block.getThread();
        while (!(thread.parent instanceof Entry.Code)) {
            if (thread instanceof Entry.FieldBlock) {
                thread = thread.getParentThread();
            } else {
                thread = thread.parent.getThread();
            }
        }
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
    }

    startRender() {
        if (this.svgGroup) {
            this.id = Entry.generateHash();
            this._line = this.svgGroup.elem('line');
            this._comment = this.svgGroup.elem('rect');
            this._title = this.svgGroup.elem('rect');
            this._path = this.svgGroup.elem('defs').elem('path');
            this._text = this.svgGroup.elem('text');
            this._textpath = this._text.elem('textPath');
            this._resizeArea = this.svgGroup.elem('rect');
            this._resizeArrow = this.svgGroup.elem('image');

            this.canRender = true;
            this.setInitSchema();
            this.setFrame();
        }
        this.setPosition();
    }

    setInitSchema() {
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
            id: `${this.id}`,
            stroke: 'red',
        });

        this._text.attr({
            'font-size': 10,
        });

        this._textpath.attr({
            href: `#${this.id}`,
        });

        this._textpath.textContent =
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
    }

    setPosition() {
        const { x, y } = this;
        const width = Math.max(this.width, 100);
        const height = Math.max(this.height, 100);

        this._title.attr({
            x,
            y,
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

        this._resizeArea.attr({
            x: x + width - 20,
            y: y + height - 20,
        });

        this._resizeArrow.attr({
            x: x + width - 14,
            y: y + height - 14,
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
                this.setPosition();
            }
        }
    }

    moveTo(x, y) {
        if (!this.display) {
            this.set({ x: -99999, y: -99999 });
        } else {
            this.set({ x, y });
        }

        if (this.visible && this.display) {
            this.setPosition();
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
        this.setPosition();
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
        document.onmousemove = mouseMove;
        document.ontouchmove = mouseMove;
        document.onmouseup = mouseUp;
        document.ontouchend = mouseUp;
    }

    removeDomEvent() {
        document.onmousemove = undefined;
        document.ontouchmove = undefined;
        document.onmouseup = undefined;
        document.ontouchend = undefined;
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

        this.isEditing && this.destroyTextArea();

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
        this.isEditing = false;
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        if (
            this.dragMode === Entry.DRAG_MODE_DRAG ||
            this.getMouseMoveDiff(mouseEvent) > Entry.BlockView.DRAG_RADIUS
        ) {
            this.set({ visible: false });
            const workspaceMode = this.board.workspace.getMode();

            const dragInstance = this.dragInstance;
            const scale = this.scale;
            if (this.dragMode !== Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
            }
            this.moveBy(
                (mouseEvent.pageX - dragInstance.offsetX) / scale,
                (mouseEvent.pageY - dragInstance.offsetY) / scale
            );

            dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
            });
            Entry.GlobalSvg.commentPosition(dragInstance);
        }
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.dragMode === Entry.DRAG_MODE_MOUSEDOWN) {
            this.isEditing ? (this.isEditing = false) : this.renderTextArea();
        }
        Entry.GlobalSvg.remove();
        this.dragMode = Entry.DRAG_MODE_NONE;
        this.board.set({ dragBlock: null });
        this.set({ visible: true });
        this.setPosition();
        this.removeDomEvent();
        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }

    addControl() {
        this._comment.onmousedown = this.mouseDown;
        this._comment.ontouchstart = this.mouseDown;
        this._title.onmousedown = this.mouseDown;
        this._title.ontouchstart = this.mouseDown;
        this._resizeArea.onmousedown = this.resizeMouseDown;
        this._resizeArea.ontouchstart = this.resizeMouseDown;
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
            this._textpath.textContent = this.textArea.val();
            this.destroyTextArea();
            this.isEditing = false;
        });
        this.textArea = Entry.Dom('textarea', {
            class: 'entry-widget-textarea',
            parent: $('body'),
        });
        this.bindDomEventTextArea();
        this.textArea.val(this._textpath.textContent);
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
            this._textpath.textContent = this.textArea.val();
            if (_.includes(exitKeys, e.keyCode || e.which)) {
                e.preventDefault();
            }
        });
        this.textArea.on('keyup', (e) => {
            this._textpath.textContent = this.textArea.val();
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
        this.event && this.event.destroy();
        delete this.event;

        this.textArea && this.textArea.remove();
        delete this.textArea;

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

        this.dragMode = Entry.DRAG_MODE_NONE;

        const width = Number(this._comment.getAttribute('width'));
        const height = Number(this._comment.getAttribute('height'));
        this.set({
            width,
            height,
        });
        this.setPosition();
        this.removeDomEvent();
        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }
};
