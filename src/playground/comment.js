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
        // const { comment, view } = this.block;
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

            const { width } = this.pathGroup.getBBox();
            const { topFieldHeight, height } = this._blockView;
            const startX = width;
            const startY = (topFieldHeight || height) / 2;
            this._comment.attr({
                width: this.commentWidth,
                height: this.commentTitleHeight,
                x: startX + this.commentWidth / 2,
                y: startY - this.commentTitleHeight / 2,
                stroke: '#EDA913',
                fill: '#FBB315',
                rx: '4',
            });

            this._line.attr({
                x1: startX,
                y1: startY,
                x2: startX + this.commentWidth / 2,
                y2: startY,
                style: 'stroke:#eda913;stroke-width:2',
            });

            this.set({
                startX,
                startY,
            });
            this.canRender = true;
        }
    }

    updatePos() {
        if (this.pathGroup) {
            const { width } = this.pathGroup.getBBox();
            const matrix = this.parentGroup.getCTM();
            const { x: pathX, y: pathY } = Entry.GlobalSvg.getRelativePoint(matrix);
            const startX = pathX + width;
            const startY = pathY;

            this._line.attr({
                x2: startX,
                y2: startY + this.commentTitleHeight / 2,
            });

            this.set({
                startX,
                startY,
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
            x: this.x + this.startX,
            y: this.y + this.startY,
        });

        this._line.attr({
            x2: this.x + this.startX + 80,
            y2: this.y + this.startY + this.commentTitleHeight / 2,
        });
    }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (
            (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) &&
            !this._board.readOnly
        ) {
            const mouseEvent = Entry.Utils.convertMouseEvent(e);
            const matrix = this.svgGroup.getCTM();
            const { x, y } = Entry.GlobalSvg.getRelativePoint(matrix);
            this.mouseDownCoordinate = {
                x: mouseEvent.pageX,
                y: mouseEvent.pageY,
                parentX: x,
                parentY: y,
            };
            document.onmousemove = this.mouseMove;
            document.ontouchmove = this.mouseMove;
            document.onmouseup = this.mouseUp;
            document.ontouchend = this.mouseUp;
            this.dragInstance = new Entry.DragInstance({
                startX: x + this.startX,
                startY: y + this.startY,
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
            if (this.dragMode != Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
                const offset = this.board.offset();
                Entry.GlobalSvg._applyDomPos(offset.left, offset.top);
            }
            this.moveBy(
                mouseEvent.pageX - dragInstance.offsetX,
                mouseEvent.pageY - dragInstance.offsetY,
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
        if (dragMode === Entry.DRAG_MODE_DRAG) {
            pos = {
                x: this.x + this.startX + parentX,
                y: this.y + this.startY + parentX,
                scaleX: (this.x + this.startX + parentX) / scale,
                scaleY: (this.y + this.startY + parentY) / scale,
            };
        } else {
            pos = this.block.getThread().view.requestAbsoluteCoordinate(this);
            pos.x += this.x + this.startX + parentX;
            pos.y += this.y + this.startY + parentX;
            pos.scaleX = (pos.x + this.startX + parentX) / scale;
            pos.scaleY = (pos.y + this.startY + parentX) / scale;
        }
        return pos;
    }
};

Entry.Comment.prototype.schema = {
    x: 0,
    y: 0,
    moveX: 0,
    moveY: 0,
    startX: 0,
    startY: 0,
    readOnly: false,
    visible: true,
    display: true,
    movable: true,
    commentWidth: 160,
    commentTitleHeight: 22,
};
