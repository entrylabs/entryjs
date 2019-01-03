Entry.ZoomController = class ZoomController {
    constructor(board) {
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

    get TOAST_WIDTH() {
        return 88;
    }

    get TOAST_HEIGHT() {
        return 44;
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
        this.svgGroup = this.board.svg.elem('g');
        this.toastGroup = this.board.svg.elem('g');
        this.renderStart();
        this.addControl();
    }

    renderStart() {
        this.svgGroup.elem('image', {
            href: `${Entry.mediaFilePath}btn_zoom_bg.svg`,
            width: this.CONTROLLER_WIDTH,
            height: this.CONTROLLER_HEIGHT,
        });
        this.zoomOut = this.svgGroup.elem('image', {
            href: `${Entry.mediaFilePath}btn_zoom_out.svg`,
            x: 4,
            y: 3,
            width: 32,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: zoom-out;',
        });
        this.zoomReset = this.svgGroup.elem('image', {
            id: 'zoom_reset',
            href: `${Entry.mediaFilePath}btn_zoom_reset.svg`,
            x: 44,
            y: 3,
            width: 40,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: pointer;',
        });
        this.zoomIn = this.svgGroup.elem('image', {
            href: `${Entry.mediaFilePath}btn_zoom_in.svg`,
            x: 92,
            y: 3,
            width: 32,
            height: 32,
            filter: 'url(#entryButtonShadowFilter)',
            style: 'cursor: zoom-in;',
        });

        this.toast = this.toastGroup.elem('g', {
            class: 'hideToast',
        });
        this.toastBG = this.toast.elem('image', {
            href: `${Entry.mediaFilePath}zoom_size_bg.svg`,
            width: this.TOAST_WIDTH,
            height: this.TOAST_HEIGHT,
        });
        this.toastText = this.toast.elem('text', {
            width: this.TOAST_WIDTH,
            height: this.TOAST_HEIGHT,
            x: this.TOAST_HEIGHT,
            y: 25,
            fill: '#4f80ff',
            'text-anchor': 'middle',
            class: 'toastText',
        });
        this.toastText.textContent = '100%';
    }

    addControl() {
        if (this.board) {
            $(this.zoomOut).bind('mousedown touchstart', (e) => {
                this.zoomChange(this.ZOOM_MODE.OUT);
            });
            $(this.zoomReset).bind('mousedown touchstart', (e) => {
                this.zoomChange(this.ZOOM_MODE.RESET);
            });
            $(this.zoomIn).bind('mousedown touchstart', (e) => {
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
        this.toastText.textContent = `${scale * 100}%`;
        const { workspace } = this.board;
        workspace.setScale(scale);
        this.toast.removeClass('fadeToast');
        $(this.toast).width();
        this.toast.addClass('fadeToast');
        this.removeToast();
        const { scroller } = this.board;
        scroller.resizeScrollBar && scroller.resizeScrollBar.call(scroller);
    }

    // 애니메이션 Debounce 처리
    removeToast = _.debounce(() => {
        this.toast.removeClass('fadeToast');
    }, 3000);

    setPosition() {
        if (!this.board) {
            return;
        }
        var svgDom = this.board.svgDom;
        this.x = svgDom.width() - (this.CONTROLLER_WIDTH + 22.5);
        this.y = 8;
        this.toastX = (svgDom.width() - this.TOAST_WIDTH) / 2;
        this.toastY = 19;
        this.align();
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y,
            toastX: this.toastX,
            toastY: this.toastY,
        };
    }

    align() {
        var position = this.getPosition();
        this.svgGroup.attr({
            transform: `translate(${position.x}, ${position.y})`,
        });
        this.toastGroup.attr({
            transform: `translate(${position.toastX}, ${position.toastY})`,
        });
    }

    setBoard(board) {
        this.board = board;
        if (!this.svgGroup) {
            this.generateView();
        }
        this.setPosition();
    }
};
