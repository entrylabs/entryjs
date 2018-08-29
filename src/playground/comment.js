Entry.Comment = class Comment {
    constructor(block, board) {
        Entry.Model(this, false);
        const { comment, view } = block;
        const { svgGroup, pathGroup } = view || {};
        this._board = board;
        this._blockView = view;
        this.pathGroup = pathGroup;
        this.svgGroup = svgGroup.elem('g');
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            this.startRender();
            this.addControl();
        }
    }

    get board() {
        return this._board;
    }

    get blockView() {
        return this._blockView;
    }

    startRender() {
        if (this.svgGroup) {
            this._line = this.svgGroup.elem('line');
            this._comment = this.svgGroup.elem('rect');
            const { x, width } = this.pathGroup.getBBox();
            const startX = x + width + 50;
            const startY = 3;

            this._comment.attr({
                width: '160',
                height: '22',
                x: startX,
                y: startY,
                stroke: '#EDA913',
                fill: '#FBB315',
                rx: '4',
            });

            this._line.attr({
                x1: startX - 50,
                y1: startY + 10,
                x2: startX + 80,
                y2: startY + 10,
                style: 'stroke:#eda913;stroke-width:2',
            });

            this.set({
                startX,
                startY,
            });
            this.canRender = true;
        }
    }

    moveTo(x, y) {
        var thisX = this.x;
        var thisY = this.y;
        if (!this.display) {
            x = -99999;
            y = -99999;
        }
        if (thisX !== x || thisY !== y) this.set({ x: x, y: y });

        // / !== true && this._lazyUpdatePos();

        if (!this.visible && this.display) this.setPosition();
    }

    moveBy(x, y) {
        return this.moveTo(this.x + x, this.y + y, );
    }

    setPosition() {
        this._comment.attr({
            x: this.x + this.startX,
            y: this.y + this.startY,
        });

        this._line.attr({
            x2: this.x + this.startX + 80,
            y2: this.y + this.startY,
        });
    };

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (
            (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) &&
            !this._board.readOnly
        ) {
            this.isMouseEvent = true;
            const mouseEvent = Entry.Utils.convertMouseEvent(e);
            this.mouseDownCoordinate = {
                x: mouseEvent.pageX,
                y: mouseEvent.pageY,
            };
            document.onmousemove = this.mouseMove;
            document.ontouchmove = this.mouseMove;
            document.onmouseup = this.mouseUp;
            document.ontouchend = this.mouseUp;

            this.dragInstance = new Entry.DragInstance({
                startX: this.startX,
                startY: this.startY,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
                mode: true,
            });
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
            // this.board.set({ dragBlock: this });
            // this.addDragging();
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
            const workspaceMode = this.board.workspace.getMode();

            let isFirst = false;
            if (this.dragMode != Entry.DRAG_MODE_DRAG) {
                // this._toGlobalCoordinate(undefined, true);
                this.dragMode = Entry.DRAG_MODE_DRAG;
                // this.block.getThread().changeEvent.notify();
                Entry.GlobalSvg.setComment(this, workspaceMode);
                isFirst = true;
            }

            var dragInstance = this.dragInstance;
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

            console.log(dragInstance.startX, dragInstance.startY);
            Entry.GlobalSvg.commentPosition(dragInstance);
        }
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isMouseEvent = false;
        document.onmousemove = undefined;
        document.ontouchmove = undefined;
        document.onmouseup = undefined;
        document.ontouchend = undefined;
        this.board.set({ dragBlock: null });
        Entry.GlobalSvg.remove();
        this.blockView.set({visible: true});
        this.setPosition();

        delete this.mouseDownCoordinate;
        delete this.dragInstance;
    }

    addControl() {
        var dom = this.svgGroup;
        var that = this;
        dom.onmousedown = this.mouseDown;
        dom.ontouchstart = this.mouseDown;
        // dom.on('wheel', function() {
        // });
    }

    addDragging() {
        this.svgGroup.addClass('dragging');
    }

    removeDragging() {
        this.svgGroup.removeClass('dragging');
    }

    addSelected() {
        this.svgGroup.addClass('selected');
    }

    removeSelected() {
        this.svgGroup.removeClass('selected');
    }

    isReadOnly() {
        return this.readOnly;
    }

    getBoard() {
        return undefined;
    }

    getAbsoluteCoordinate(dragMode = this.dragMode) {
        const { scale = 1 } = this.board || {};
        let pos = null;
        if (dragMode === Entry.DRAG_MODE_DRAG) {
            pos = {
                x: this.x + this.startX,
                y: this.y + this.startY,
                scaleX: (this.x + this.startX) / scale,
                scaleY: (this.y + this.startY) / scale,
            };
        } else {
            pos = this.block.getThread().view.requestAbsoluteCoordinate(this);
            pos.x += this.x + this.startX;
            pos.y += this.y + this.startY;
            pos.scaleX = (pos.x + this.startX) / scale;
            pos.scaleY = (pos.y + this.startY) / scale;
        }        
        console.log(pos.x, pos.y);
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
};
