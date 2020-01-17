import Toast from './toast';

Entry.ZoomController = class ZoomController {
    constructor(board) {
        this.boardMap = new Map();
        if (board) {
            this.setBoard(board);
        }
        if (Entry.windowResized) {
            Entry.windowResized.attach(this, this.setPosition);
        }
    }

    get CONTROLLER_WIDTH() {
        return 128;
    }

    get CONTROLLER_HEIGHT() {
        return 38;
    }

    get ZOOM_RANGE() {
        return [0.6, 0.8, 1, 1.3, 1.6, 2];
    }

    get ZOOM_MODE() {
        return {
            RESET: 0,
            OUT: 1,
            IN: 2,
        };
    }

    get view() {
        return this.svgGroup;
    }

    ZOOM_LEVEL = 2;

    generateView() {
        const zoomGroup = {
            svgZoom: this.nowBoard.svg.elem('g'),
        };
        this.renderStart(zoomGroup);
        this.addControl(zoomGroup);
        zoomGroup.toast = new Toast(this.nowBoard);
        return zoomGroup;
    }

    renderStart(zoomGroup) {
        const {
            btn_zoom_bg = `${Entry.mediaFilePath}btn_zoom_bg.svg`,
            btn_zoom_out = `${Entry.mediaFilePath}btn_zoom_out.svg`,
            btn_zoom_reset = `${Entry.mediaFilePath}btn_zoom_reset.svg`,
            btn_zoom_in = `${Entry.mediaFilePath}btn_zoom_in.svg`,
        } = EntryStatic.images || {};
        const isSafari = Entry.getBrowserType().indexOf('Safari') >= 0;
        const shadowFilter = isSafari ? 'none' : 'url(#entryButtonShadowFilter)';
        zoomGroup.svgZoom.elem('image', {
            href: btn_zoom_bg,
            width: this.CONTROLLER_WIDTH,
            height: this.CONTROLLER_HEIGHT,
        });
        zoomGroup.zoomOut = zoomGroup.svgZoom.elem('image', {
            href: btn_zoom_out,
            x: 4,
            y: 3,
            width: 32,
            height: 32,
            filter: shadowFilter,
            style: 'cursor: default; cursor: -moz-zoom-out; cursor: -webkit-zoom-out; cursor: -ms-zoom-out; cursor: -o-zoom-out;',
        });
        zoomGroup.zoomReset = zoomGroup.svgZoom.elem('image', {
            id: 'zoom_reset',
            href: btn_zoom_reset,
            x: 44,
            y: 3,
            width: 40,
            height: 32,
            filter: shadowFilter,
            style: 'cursor: pointer;',
        });
        zoomGroup.zoomIn = zoomGroup.svgZoom.elem('image', {
            href: btn_zoom_in,
            x: 92,
            y: 3,
            width: 32,
            height: 32,
            filter: shadowFilter,
            style: 'cursor: default; cursor: -moz-zoom-in; cursor: -webkit-zoom-in; cursor: -ms-zoom-in; cursor: -o-zoom-in;',
        });
    }

    addControl(zoomGroup) {
        if (this.nowBoard) {
            $(zoomGroup.svgZoom).bind('mousedown touchstart', (e) => {
                e.stopImmediatePropagation();
            });
            $(zoomGroup.zoomOut).bind('mousedown touchstart', (e) => {
                this.zoomChange(this.ZOOM_MODE.OUT);
            });
            $(zoomGroup.zoomReset).bind('mousedown touchstart', (e) => {
                this.zoomChange(this.ZOOM_MODE.RESET);
            });
            $(zoomGroup.zoomIn).bind('mousedown touchstart', (e) => {
                this.zoomChange(this.ZOOM_MODE.IN);
            });
        }
    }

    zoomChange(mode) {
        switch (mode) {
            case this.ZOOM_MODE.OUT:
                if (this.ZOOM_LEVEL > 0) {
                    this.ZOOM_LEVEL -= 1;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
            case this.ZOOM_MODE.IN:
                if (this.ZOOM_LEVEL < this.ZOOM_RANGE.length - 1) {
                    this.ZOOM_LEVEL += 1;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
            case this.ZOOM_MODE.RESET:
            default:
                const resetIndex = this.ZOOM_RANGE.indexOf(1);
                if (this.ZOOM_LEVEL !== resetIndex) {
                    this.ZOOM_LEVEL = 2;
                    this.setScale(this.ZOOM_RANGE[this.ZOOM_LEVEL]);
                }
                break;
        }
    }

    setScale(scale = 1) {
        const zoomGroup = this.boardMap.get(this.nowBoard);
        const { workspace } = this.nowBoard;
        workspace.setScale(scale);
        zoomGroup.toast.show(`${scale * 100}%`);
        const { scroller } = this.nowBoard;
        scroller.resizeScrollBar && scroller.resizeScrollBar.call(scroller);
    }

    setPosition() {
        if (!this.nowBoard) {
            return;
        }
        var svgDom = this.nowBoard.svgDom;
        this.x = svgDom.width() - (this.CONTROLLER_WIDTH + 22.5);
        this.y = 8;
        this.align();
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    align() {
        var position = this.getPosition();
        this.boardMap.forEach((zoomGroup) => {
            zoomGroup.svgZoom.attr({
                transform: `translate(${position.x}, ${position.y})`,
            });
        });
    }

    setBoard(board) {
        this.nowBoard = board;
        const zoomGroup = this.boardMap.get(board);
        if (!zoomGroup) {
            this.boardMap.set(board, this.generateView());
        }
        this.setPosition();
    }

    destroy() {
        this.boardMap.forEach((zoomGroup) => {
            if (zoomGroup.toast) {
                zoomGroup.toast.destroy();
            }
        });
        delete this.nowBoard;
        delete this.boardMap;
    }
};
