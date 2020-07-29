'use strict';

class GlobalSvg {
    DONE = 0;
    _inited = false;
    REMOVE = 1;
    RETURN = 2;
    scale = 1;

    createDom() {
        if (this.inited) {
            return;
        }

        //document attached element not removed by angular
        $('#globalSvgSurface').remove();
        $('#globalSvg').remove();

        const body = $('body');
        this._container = Entry.Dom('div', {
            classes: ['globalSvgSurface', 'entryRemove'],
            id: 'globalSvgSurface',
            parent: body,
        });

        this.svgDom = Entry.Dom(
            $(
                '<svg id="globalSvg" width="1" height="1"' +
                    'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'
            ),
            { parent: this._container }
        );

        this.svg = Entry.SVG('globalSvg');
        this.svgPoint = this.svg.createSVGPoint();
        this.left = 0;
        this.top = 0;
        this._inited = true;
    }

    setView(view, mode) {
        if (view == this._view) {
            return;
        }
        const data = view.block || view;
        if (data.isReadOnly() || !view.movable) {
            return;
        }
        this._view = view;
        this._mode = mode;
        this.isFromBlockMenu = view.dragInstance && view.dragInstance.isNew;
        view.set({ visible: false });
        this.draw();
        this.show();
        this.align();
        this.position();
        return true;
    }

    getView() {
        return this._view;
    }

    get canAddStorageBlock() {
        const { block = {} } = this._view || {};
        const { copyable } = block;
        return !this.isFromBlockMenu && copyable;
    }

    setComment(view, mode) {
        if (view == this._view || view.readOnly || !view.movable) {
            return;
        }

        view._path.attr({
            id: `${view.id}C`,
            stroke: 'red',
        });

        view._titlePath.attr({
            id: `${view.id}T`,
        });

        view._textPath.attr({
            href: `#${view.id}C`,
        });

        view._titleTextPath.attr({
            href: `#${view.id}T`,
        });
        this._view = view;
        this._mode = mode;
        this.originalX = view.x;
        this.originalY = view.y;
        this.draw();
        this.show();
        this.align();
        this.commentPosition();
    }

    draw() {
        const blockView = this._view;
        if (this._svg) {
            this.remove();
        }
        const isVimMode = this._mode == Entry.Workspace.MODE_VIMBOARD;
        const bBox = blockView.svgGroup.getBBox();
        const { width, height } = bBox;
        this.svgDom.attr({
            width: `${Math.round(bBox.width + 4)}px`,
            height: `${Math.round(bBox.height + 4)}px`,
        });
        this.xScaleDiff = (width * (this.scale - 1)) / (this.scale * 2);
        this.yscaleDiff = (height * (this.scale - 1)) / (this.scale * 2);

        this.svgGroup = Entry.SVG.createElement(blockView.svgGroup.cloneNode(true), { opacity: 1 });
        this.svg.appendChild(this.svgGroup);
        if (blockView.svgCommentGroup) {
            this.svgCommentGroup = Entry.SVG.createElement(
                blockView.svgCommentGroup.cloneNode(true),
                {
                    opacity: 1,
                }
            );
            this.svg.appendChild(this.svgCommentGroup);
        }
        //TODO selectAll function replace
        if (isVimMode) {
            const $svg = $(this.svgGroup);
            const $svgComment = $(this.svgCommentGroup);

            $svg.find('g').css({ filter: 'none' });
            $svgComment.find('g').css({ filter: 'none' });

            $svg.find('path, rect, polygon').velocity(
                {
                    opacity: 0,
                },
                {
                    duration: 500,
                }
            );
            $svgComment.find('path, rect, polygon').velocity(
                {
                    opacity: 0,
                },
                {
                    duration: 500,
                }
            );

            $svg.find('text').velocity(
                {
                    fill: '#000000',
                },
                {
                    duration: 530,
                }
            );
            $svgComment.find('text').velocity(
                {
                    fill: '#000000',
                },
                {
                    duration: 530,
                }
            );
        }
    }

    remove() {
        if (!this.svgGroup) {
            return;
        }
        this.svgGroup.remove();
        delete this.svgGroup;
        if (this.svgCommentGroup) {
            this.svgCommentGroup.remove();
            delete this.svgCommentGroup;
        }
        delete this._view;
        delete this._offsetX;
        delete this._offsetY;
        delete this._startX;
        delete this._startY;
        this.hide();
    }

    align() {
        let offsetX = 0;
        let offsetY = 0;
        if (this._view.getSkeleton) {
            offsetX = this._view.getSkeleton().box(this._view).offsetX || 0;
            offsetY = this._view.getSkeleton().box(this._view).offsetY || 0;
        }
        offsetX *= -1;
        offsetX += 1;
        offsetY *= -1;
        offsetY += 1;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        const transform = `translate(${offsetX}, ${offsetY})`;
        this.svgGroup.attr({ transform });
        if (this.svgCommentGroup) {
            this.svgCommentGroup.attr({ transform });
        }
    }

    show() {
        this.isShow = true;
        this._container.removeClass('entryRemove');
    }

    hide() {
        this.isShow = false;
        this._container.addClass('entryRemove');
    }

    position(value) {
        const blockView = this._view;
        if (!blockView) {
            return;
        }
        const pos = blockView.getAbsoluteCoordinate();
        const offset = blockView.getBoard().offset();
        if (value) {
            this.left += value.left / this.scale;
            this.top += value.top / this.scale;
        } else {
            this.left = pos.scaleX + (offset.left / this.scale - this._offsetX);
            this.top = pos.scaleY + (offset.top / this.scale - this._offsetY);
        }
        this._applyDomPos(this.left, this.top);
    }

    commentPosition({ startX = 0, startY = 0 } = {}) {
        const view = this._view;
        if (!view) {
            return;
        }
        const pos = view.getAbsoluteCoordinate();
        const offset = view.board.offset();
        this.left = pos.scaleX + (offset.left / this.scale - this._offsetX) - this.originalX;
        this.top = pos.scaleY + (offset.top / this.scale - this._offsetY) - this.originalY;
        const [line] = this.svgGroup.getElementsByTagName('line');
        if (line) {
            line.setAttribute('x1', startX / this.scale - this.left + view.parentWidth);
            line.setAttribute('y1', startY / this.scale - this.top + view.parentHeight / 2);
        }
        this._applyDomPos(this.left, this.top);
    }

    adjust(adjustX, adjustY) {
        const left = this.left + (adjustX || 0);
        const top = this.top + (adjustY || 0);
        if (left === this.left && top === this.top) {
            return;
        }

        this.left = left;
        this.top = top;
        this._applyDomPos(this.left, this.top);
    }

    _applyDomPos(left, top) {
        this.svgDom.css({
            transform: `scale(${this.scale}) translate3d(${left + this.xScaleDiff}px,${top +
                this.yscaleDiff}px, 0px)`,
        });
    }

    terminateDrag(blockView) {
        const mousePos = Entry.mouseCoordinate;
        const board = blockView.getBoard();
        const blockMenu = board.workspace.blockMenu;
        const bLeft = blockMenu.offset().left;
        const bTop = blockMenu.offset().top;
        const bWidth = blockMenu.visible ? blockMenu.blockMenuContainer.width() : 0;

        let backPackWidth = 0;
        const windowWidth = window.innerWidth;
        const backPackMode = Entry.playground.backPack.isShow;
        if (backPackMode) {
            backPackWidth = 135;
        }

        if (
            mousePos.y > board.offset().top - 20 &&
            mousePos.x > bLeft + bWidth &&
            mousePos.x < windowWidth - backPackWidth
        ) {
            return this.DONE;
        } else if (
            mousePos.y > bTop &&
            mousePos.x > bLeft &&
            mousePos.x <= bLeft + bWidth &&
            blockMenu.visible
        ) {
            if (blockView.block && !blockView.block.isDeletable()) {
                return this.RETURN;
            } else {
                return this.REMOVE;
            }
        } else {
            return this.RETURN;
        }
    }

    addControl(...args) {
        this.onMouseDown(...args);
    }

    onMouseDown(e) {
        this._startY = e.pageY;
        const that = this;
        e.stopPropagation();
        e.preventDefault();
        if (e.which == 2) {
            console.log('mouse wheel click disabled');
            return;
        }
        const $doc = $(document);
        $doc.bind('mousemove.block', onMouseMove);
        $doc.bind('mouseup.block', onMouseUp);
        $doc.bind('touchmove.block', onMouseMove);
        $doc.bind('touchend.block', onMouseUp);
        this._startX = e.pageX;
        this._startY = e.pageY;

        function onMouseMove(e) {
            const newX = e.pageX;
            const newY = e.pageY;
            const dX = newX - that._startX;
            const dY = newY - that._startY;
            const newLeft = that.left + dX;
            const newTop = that.top + dY;
            that._applyDomPos(newLeft, newTop);
            that._startX = newX;
            that._startY = newY;
            that.left = newLeft;
            that.top = newTop;
        }

        function onMouseUp(e) {
            if (e.which == 2) {
                console.log('mouse wheel click disabled');
                return;
            }
            $(document).unbind('.block');
        }
    }

    setScale(scale = 1) {
        this.scale = scale;
    }

    getRelativePoint(matrix) {
        return this.svgPoint.matrixTransform(matrix);
    }
}

Entry.GlobalSvg = new GlobalSvg();
