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
        const { comment, view } = block;
        const { svgGroup } = view || {};
        this._block = block;
        this._board = board;
        this._blockView = view;
        this.value = '';
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            console.time('a');
            this.createComment();
            this.startRender();
            this.addControl();
            console.timeEnd('a');
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

    _getFontSize() {
        return this.scale * 10;
    }

    _getTextareaPath() {
        let d = '';
        for (let y = 14; y < this.height - this.titleHeight - 4; y += 16) {
            d += `M6,${y} H${this.width - 12} `;
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
                '메모입니다. 메모입니다.메모입니다.메모입니다.메모입니다.메모입니다메모입니다. 메모입니다.메모입니다.메모입니다.메모입니다.메모입니다.메모입니다. 메모입니다.메모입니다.메모입니다.메모입니다.메모입니다.';
            this.canRender = true;
        }
        this.setPosition();
    }

    setPosition() {
        this._title.attr({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.titleHeight,
        });

        this._comment.attr({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        });

        this._line.attr({
            x1: this.parentWidth,
            y1: this.parentHeight / 2,
            x2: this.x + this.width / 2,
            y2: this.y + this.titleHeight / 2,
        });

        this._path.attr({
            transform: `translate(${this.x}, ${this.y + this.titleHeight})`,
            d: this._getTextareaPath(),
        });

        this._text.attr({
            // transform: `translate(${this.x}, ${this.y + this.titleHeight})`,
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

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isEditing) {
            this.destroyTextArea();
        }
        const scale = this.scale;
        if (
            (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) &&
            !this._board.readOnly
        ) {
            const { width: parentWidth } = this.pathGroup.getBBox();
            const { topFieldHeight, height } = this._blockView;
            const parentHeight = topFieldHeight || height;
            const mouseEvent = Entry.Utils.convertMouseEvent(e);
            const matrix = this.svgGroup.getCTM();
            const { x, y } = Entry.GlobalSvg.getRelativePoint(matrix);
            const { mouseMove, mouseUp } = this;
            this.mouseDownCoordinate = {
                x: mouseEvent.pageX,
                y: mouseEvent.pageY,
                parentX: x,
                parentY: y,
            };
            document.onmousemove = mouseMove;
            document.ontouchmove = mouseMove;
            document.onmouseup = mouseUp;
            document.ontouchend = mouseUp;
            this.dragInstance = new Entry.DragInstance({
                startX: x / scale + parentWidth,
                startY: y / scale + parentHeight / 2,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
                mode: true,
            });
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
        }
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isEditing = false;
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const diff = Math.sqrt(
            Math.pow(mouseEvent.pageX - this.mouseDownCoordinate.x, 2) +
                Math.pow(mouseEvent.pageY - this.mouseDownCoordinate.y, 2)
        );
        if (this.dragMode == Entry.DRAG_MODE_DRAG || diff > Entry.BlockView.DRAG_RADIUS) {
            this.set({ visible: false });
            const workspaceMode = this.board.workspace.getMode();

            const dragInstance = this.dragInstance;
            const scale = this.scale;
            if (this.dragMode != Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
            }
            this.moveBy(
                (mouseEvent.pageX - dragInstance.offsetX) / scale,
                (mouseEvent.pageY - dragInstance.offsetY) / scale,
                false,
                true
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
            this.isEditing ? this.isEditing = false : this.renderTextArea();
        }
        this.dragMode = Entry.DRAG_MODE_NONE;
        document.onmousemove = undefined;
        document.ontouchmove = undefined;
        document.onmouseup = undefined;
        document.ontouchend = undefined;
        this.board.set({ dragBlock: null });
        Entry.GlobalSvg.remove();
        this.set({ visible: true });
        this.setPosition();
        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }

    addControl() {
        const dom = this.svgGroup;
        dom.onmousedown = this.mouseDown;
        dom.ontouchstart = this.mouseDown;
    }

    updateOpacity = function() {
        if (this.visible === false) {
            this.svgGroup.attr({ opacity: 0 });
        } else {
            this.svgGroup.removeAttr('opacity');
            this.setPosition();
        }
    };

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
        this.event = Entry.disposeEvent.attach(this, () => {
            this._textpath.textContent = this.textArea.val();
            this.destroyTextArea();
            this.isEditing = false;
        });
        this.textArea = Entry.Dom('textarea', {
            class: 'entry-widget-textarea',
            parent: $('body'),
        });
        this.textArea.val(this._textpath.textContent);
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
        const { top, left } = this._comment.getBoundingClientRect();
        this.textArea.css({
            left,
            top: this.titleHeight * this.scale + top,
            'font-size': `${this._getFontSize()}px`,
            width: this.width * this.scale,
            height: (this.height - this.titleHeight) * this.scale,
            'border-radius': `0 0 ${4 * this.scale}px ${4 * this.scale}px`,
            padding: `${3 * this.scale}px ${6 * this.scale}px`,
        });
        this.textArea.focus && this.textArea.focus();
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
};
