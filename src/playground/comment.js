Entry.Comment = class Comment {
    constructor(block, board) {
        this.data = {
            x: 0,
            y: 0,
        };
        Entry.Model(this, false);
        const { comment, view } = block;
        const { svgGroup } = view || {};
        this.parentSvgGroup = svgGroup;
        this.svgGroup = svgGroup.elem('g');
        this.board = board;
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        if (svgGroup && !(board instanceof Entry.BlockMenu)) {
            this.startRender();
            this.addControl();
        }

        // this.observe(this, 'a', ['x'])
    }

    // a() {
    //     if(this._comment){
    //         console.log(this.data);
    //         const {x: ix, y: iy} = this.data;
    //         const { x, y, width } = this.parentSvgGroup.getBBox();
    //         this._comment.attr({
    //             x: x - ix - width - 50,
    //             y: y - iy,
    //         });
    //     }
    // }

    startRender() {
        if (this.svgGroup) {
            this._line = this.svgGroup.elem('line');
            this._comment = this.svgGroup.elem('rect');
            const { x, width } = this.parentSvgGroup.getBBox();
            
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
        }
    }

    mouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        this.mouseDownCoordinate = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
        };
        e.target.onmousemove = this.mouseMove;
        e.target.ontouchmove = this.mouseMove;
        e.target.onmouseup = this.mouseUp;
        e.target.ontouchend = this.mouseUp;
    }

    mouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        const mouseEvent = Entry.Utils.convertMouseEvent(e);
        const diff = Math.sqrt(
            Math.pow(mouseEvent.pageX - this.mouseDownCoordinate.x, 2) +
                Math.pow(mouseEvent.pageY - this.mouseDownCoordinate.y, 2)
        );
        console.log(mouseEvent.pageX);
        this.set({
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
        })
    }

    mouseUp(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.onmousemove = undefined;
        e.target.ontouchmove = undefined;
        e.target.onmouseup = undefined;
        e.target.ontouchend = undefined;
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
    x: 0,
    y: 0,
};
