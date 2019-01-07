import EventEmitter from 'events';
import _padStart from 'lodash/padStart';
import _debounce from 'lodash/debounce';

class ColorSpoid extends EventEmitter {
    constructor(stage, canvas) {
        super();
        this.stage = stage;
        this.mainCanvas = canvas;
        this.canUpdate = true;
        this.color = '';
        // this.renderComponet();
    }

    get DRAW_OFFSET_Y() {
        return Entry.isMobile() ? -23 : 28;
    }

    get TRANSFORM_OFFSET_Y() {
        return Entry.isMobile() ? 107 : 57;
    }

    get CLIENT_OFFSET_Y() {
        return Entry.isMobile() ? 50 : 0;
    }

    cloneCanvas() {
        this.clonedCanvas = document.createElement('canvas');
        this.clonedContext = this.clonedCanvas.getContext('2d');
        this.clonedCanvas.width = 760;
        this.clonedCanvas.height = 480;
        this.clonedContext.fillStyle = 'white';
        this.clonedContext.fillRect(0, 0, 760, 480);
        this.clonedContext.drawImage(this.mainCanvas, 57, 57);
    }

    renderComponet() {
        this.cloneCanvas();
        this.stage.handle.setVisible(false);
        this.isRunning = true;
        this.mainCanvas.addClass('isPickerMode');
        const magnify = `
            <canvas width="114px" height="114px" class="magnify"/>
            <div class="canvasCircle"/>
            <div class="colorPreview">
                <div class="colorCircle"/>
            </div>
            <div class="magnifyRect"/>
        `;
        this.$curtain = $('<div class="entryMagnifyCurtain">');
        this.$colorSpoid = $('<div class="entryMagnify" />').html(magnify);
        const $canvas = this.$colorSpoid.find('canvas');
        this.$colorPreview = this.$colorSpoid.find('.colorPreview');
        this.$magnifyRect = this.$colorSpoid.find('.magnifyRect');
        /** @type {CanvasRenderingContext2D} */
        this.colorSpoidCtx = $canvas.get(0).getContext('2d');
        this.colorSpoidCtx.fillStyle = 'white';
        this.colorSpoidCtx.fillRect(0, 0, 120, 120);
        this.colorSpoidCtx.imageSmoothingEnabled = false;
        this.canvasPosition = this.mainCanvas.getBoundingClientRect();
        $('body').append(this.$curtain);
        $('body').append(this.$colorSpoid);
        this.$colorSpoid.css('will-change', 'transform');
        this.addEventListner();
    }

    run() {
        this.renderComponet();
        return this;
    }

    remove() {
        this.mainCanvas.removeClass('isPickerMode');
        $(document).off('.magnify');
        this.$curtain.remove();
        this.$colorSpoid.remove();
        delete this.$curtain;
        delete this.$colorSpoid;
        delete this.$colorPreview;
        delete this.colorSpoidCtx;
        delete this.canvasPosition;
        delete this.color;
        delete this.clonedContext;
        delete this.clonedCanvas;
        delete this.isRunning;
        this.stage.handle.setVisible(true);
    }

    drawCloneImage(mousePos) {
        const { left = 0, top = 0, width, height } = this.canvasPosition;
        let x = Math.floor((mousePos.clientX - left) * 640 / width) + 29;
        let y = Math.floor((mousePos.clientY - top) * 360 / height) + this.DRAW_OFFSET_Y;
        this.colorSpoidCtx.drawImage(this.clonedCanvas, x, y, 57, 57, 0, 0, 114, 114);
    }

    updateMagnifier({ isShow, transform, event }) {
        if (isShow) {
            this.$colorSpoid.addClass('isShow');
            this.$colorSpoid.css('transform', transform);
        } else {
            this.$colorSpoid.removeClass('isShow');
        }
        if (this.canUpdate) {
            this.canUpdate = false;
            requestAnimationFrame(() => {
                if (this.colorSpoidCtx) {
                    this.drawCloneImage(event);
                    const imageData = this.colorSpoidCtx.getImageData(57, 57, 1, 1);
                    const [red, green, blue] = imageData.data;
                    const background = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.$colorPreview.css('background-color', background);
                    this.$magnifyRect.css('background-color', background);
                    this.color = `#${_padStart(red.toString(16), 2, '0')}${_padStart(
                        green.toString(16),
                        2,
                        '0'
                    )}${_padStart(blue.toString(16), 2, '0')}`;
                }
                this.canUpdate = true;
            });
        }
    }

    moveMagnifer(event) {
        const { left = 0, top = 0, width, height } = this.canvasPosition;
        const mouseEvent = Entry.Utils.getMouseEvent(event);
        if (
            mouseEvent !== null &&
            mouseEvent.clientX > left &&
            mouseEvent.clientX < width + left &&
            mouseEvent.clientY > top + this.CLIENT_OFFSET_Y &&
            mouseEvent.clientY < height + top + this.CLIENT_OFFSET_Y
        ) {
            this.updateMagnifier({
                event: mouseEvent,
                isShow: true,
                transform: `translate3d(${mouseEvent.pageX - 57}px, ${mouseEvent.pageY -
                    this.TRANSFORM_OFFSET_Y}px, 0)`,
            });
        } else {
            this.updateMagnifier({
                event: mouseEvent,
                isShow: false,
            });
        }
    }

    addEventListner() {
        $(document).on('mousedown.magnify', (e) => {
            e.stopImmediatePropagation();
        });
        $(document).on('touchstart.magnify touchmove.magnify mousemove.magnify', (e) => {
            this.moveMagnifer(e);
        });
        $(document).on('click.magnify touchend.magnify', (e) => {
            this.emit('selectColor', this.color || '#ffffff');
            this.remove();
        });
    }
}

export default ColorSpoid;
