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

        this.observe(this, 'a', ['moveX', 'moveY']);
    }

    get board() {
        return this._board;
    }

    get blockView() {
        return this._blockView;
    }

    a() {
        return;
        if (this._comment && this.isMouseEvent) {
            console.log('update');
            const { posX = 0, posY = 0 } = this.mouseDownCoordinate || {};
            this._comment.attr({
                x: this.moveX + posX,
                y: this.moveY + posY,
            });

            this._line.attr({
                x2: this.moveX + posX + 80,
                y2: this.moveY + posY,
            });
        }
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
                x1: x + width,
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

    moveTo(x, y, animate, doNotUpdatePos) {
        var thisX = this.x;
        var thisY = this.y;
        if (!this.display) {
            x = -99999;
            y = -99999;
        }
        if (thisX !== x || thisY !== y) this.set({ x: x, y: y });

        doNotUpdatePos !== true && this._lazyUpdatePos();

        if (this.visible && this.display) this.setPosition(animate);
    }

    moveBy(x, y, animate, doNotUpdatePos) {
        return this.moveTo(this.x + x, this.y + y, animate, doNotUpdatePos);
    }

    setPosition() {
        console.log(this.x, this.startX, this.y, this.startY);
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
                startX: mouseEvent.pageX,
                startY: mouseEvent.pageY,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
                height: 0,
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
                Entry.GlobalSvg.setView(this, workspaceMode);
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

            Entry.GlobalSvg.position();

            if (!this.originPos) {
                this.originPos = {
                    x: this.x,
                    y: this.y,
                };
            }
            // this.set({
            //     moveX: mouseEvent.pageX - this.mouseDownCoordinate.x,
            //     moveY: mouseEvent.pageY - this.mouseDownCoordinate.y,
            // })
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
};
