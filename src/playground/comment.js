Entry.Comment = class Comment {
    constructor(block, board) {
        Entry.Model(this, false);
        const { comment, view } = block;
        const { svgGroup, pathGroup } = view || {};
        this.pathGroup = pathGroup;
        this.svgGroup = svgGroup.elem('g');
        this.board = board;
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            this.startRender();
            this.addControl();
        }

        this.observe(this, 'a', ['moveX', 'moveY']);
    }

    a() {
        if(this._comment && this.isMouseEvent){
            console.log('update');
            const {posX = 0, posY = 0} = this.mouseDownCoordinate || {};
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

            this._comment.attr({
                width: '160',
                height: '22',
                x: x + width + 50,
                y: '3',
                stroke: '#EDA913',
                fill: '#FBB315',
                rx: '4',
            });

            this._line.attr({
                x1: x + width,
                y1: 13,
                x2: x + width + 50 + 80,
                y2: 13,
                style: 'stroke:#eda913;stroke-width:2',
            });

            this.canRender = true;
        }
    }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isMouseEvent = true;
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        this.mouseDownCoordinate = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            posX: Number(this._comment.getAttribute('x')) || 0,
            posY: Number(this._comment.getAttribute('y')) || 0,
        };
        console.log(this.mouseDownCoordinate);
        document.onmousemove = this.mouseMove;
        document.ontouchmove = this.mouseMove;
        document.onmouseup = this.mouseUp;
        document.ontouchend = this.mouseUp;
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const diff = Math.sqrt(
            Math.pow(mouseEvent.pageX - this.mouseDownCoordinate.x, 2) +
                Math.pow(mouseEvent.pageY - this.mouseDownCoordinate.y, 2)
        );
        this.set({
            moveX: mouseEvent.pageX - this.mouseDownCoordinate.x,
            moveY: mouseEvent.pageY - this.mouseDownCoordinate.y,
        })
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isMouseEvent = false;
        document.onmousemove = undefined;
        document.ontouchmove = undefined;
        document.onmouseup = undefined;
        document.ontouchend = undefined;
    }

    addControl() {
        var dom = this.svgGroup;
        var that = this;
        dom.onmousedown = this.mouseDown;
        dom.ontouchstart = this.mouseDown;
        // dom.on('wheel', function() {
        // });
    }
};

Entry.Comment.prototype.schema = {
    moveX: 0,
    moveY: 0,
};
