Entry.Comment = class Comment {
    dragMode = Entry.DRAG_MODE_NONE;
    offsetX = 50;
    offsetY = 10;

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
            this._line = this.svgGroup.elem('line');
            this._comment = this.svgGroup.elem('rect');

            const { width: parentWidth } = this.pathGroup.getBBox();
            const { topFieldHeight, height } = this._blockView;
            const parentHeight = topFieldHeight || height;
            const { width, titleHeight, defaultLineLength } = this;
            const x = defaultLineLength + parentWidth;
            const y = parentHeight / 2 - titleHeight / 2;

            this._comment.attr({
                x,
                y,
                width,
                height: titleHeight,
                stroke: '#EDA913',
                fill: '#FBB315',
                rx: '4',
            });

            this._line.attr({
                x1: parentWidth,
                y1: parentHeight / 2,
                x2: x + width / 2,
                y2: y + titleHeight / 2,
                style: 'stroke:#eda913;stroke-width:2',
            });

            this.set({
                x,
                y,
            });
            this.canRender = true;
        }
    }

    updatePos() {
        if (this.pathGroup) {
            const { width: parentWidth } = this.pathGroup.getBBox();
            const { topFieldHeight, height } = this._blockView;
            const parentHeight = topFieldHeight || height;
            const { width, titleHeight, defaultLineLength } = this;
            const x = defaultLineLength + parentWidth;
            const y = parentHeight / 2 - titleHeight / 2;

            this._comment.attr({
                x,
                y,
            });

            this._line.attr({
                x1: parentWidth,
                y1: parentHeight,
                x2: x + width / 2,
                y2: y + titleHeight / 2,
            });

            this.set({
                x,
                y,
            });
        }
    }

    moveTo(x, y) {
        const thisX = this.x;
        const thisY = this.y;
        if (!this.display) {
            x = -99999;
            y = -99999;
        }
        if (thisX !== x || thisY !== y) {
            this.set({ x, y });
        }
        if (this.visible && this.display) {
            this.setPosition();
        }
    }

    moveBy(x, y) {
        return this.moveTo(this.x + x, this.y + y);
    }

    setPosition() {
        this._comment.attr({
            x: this.x,
            y: this.y,
        });

        this._line.attr({
            x2: this.x + this.width / 2,
            y2: this.y + this.titleHeight / 2,
        });
    }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        const { scale = 1 } = this.board || {};
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
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const diff = Math.sqrt(
            Math.pow(mouseEvent.pageX - this.mouseDownCoordinate.x, 2) +
                Math.pow(mouseEvent.pageY - this.mouseDownCoordinate.y, 2)
        );
        if (this.dragMode == Entry.DRAG_MODE_DRAG || diff > Entry.BlockView.DRAG_RADIUS) {
            this.set({ visible: false });
            const workspaceMode = this.board.workspace.getMode();

            const dragInstance = this.dragInstance;
            const { scale = 1 } = this.board || {};
            if (this.dragMode != Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
                const offset = this.board.offset();
                Entry.GlobalSvg._applyDomPos(offset.left / scale, offset.top / scale);
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
        const { scale = 1 } = this.board || {};
        let pos = null;
        const { parentX, parentY } = this.mouseDownCoordinate;
        const posX = this.x + parentX;
        const posY = this.y + parentY;
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
};

Entry.Comment.prototype.schema = {
    x: 0,
    y: 0,
    width: 160,
    height: 100,
    titleHeight: 22,
    defaultLineLength: 120,
    readOnly: false,
    visible: true,
    display: true,
    movable: true,
};
