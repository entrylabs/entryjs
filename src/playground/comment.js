Entry.Comment = class Comment {
    dragMode = Entry.DRAG_MODE_NONE;
    offsetX = 50;
    offsetY = 10;

    constructor(block, board) {
        Entry.Model(this, false);

        if(!board.svgCommentGroup) {
            return;
        }
        const { comment, view } = block;
        const { svgGroup, pathGroup } = view || {};
        this._board = board;
        this._blockView = view;
        this.pathGroup = pathGroup;
        this.parentGroup = svgGroup;
        const wrapper = Entry.SVG(null, board.svgCommentGroup);
        this.svgGroup = wrapper.elem('g');
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            this.startRender();
            this.addControl();
        }

        this.observe(this, 'updateOpacity', ['visible'], false)
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
            const { x, width, y, height } = this.pathGroup.getBBox();
            
            const matrix = this.parentGroup.getCTM();
            const { x: pathX, y: pathY } = Entry.GlobalSvg.getRelativePoint(matrix);

            const startX = x + width + this.offsetX + pathX;
            const startY = y + pathY;
            console.log('startRender', x, y, startX, startY, pathX, pathY);
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
                x1: startX - this.offsetX,
                y1: startY + this.offsetY,
                x2: startX + 80,
                y2: startY + this.offsetY,
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
        if (this.visible && this.display) this.setPosition();
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
            y2: this.y + this.startY,
        });
    }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (
            (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) &&
            !this._board.readOnly
        ) {
            this.set({ visible: false });
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
                startX: this.startX + x - this.offsetX,
                startY: this.startY + y + this.offsetY,
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
            const workspaceMode = this.board.workspace.getMode();

            let isFirst = false;
            var dragInstance = this.dragInstance;
            if (this.dragMode != Entry.DRAG_MODE_DRAG) {
                this.dragMode = Entry.DRAG_MODE_DRAG;
                Entry.GlobalSvg.setComment(this, workspaceMode);
                const offset = this.board.offset();
                Entry.GlobalSvg._applyDomPos(offset.left, offset.top);
                isFirst = true;
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
        var dom = this.svgGroup;
        var that = this;
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
        const {parentX, parentY} = this.mouseDownCoordinate;
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
};
