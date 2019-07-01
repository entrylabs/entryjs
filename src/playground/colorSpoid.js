import EventEmitter from 'events';
import _padStart from 'lodash/padStart';
import _debounce from 'lodash/debounce';

class ColorSpoid extends EventEmitter {
    constructor(stage, canvas) {
        super();
        this.stage = stage;
        this.mainCanvas = canvas;
        this.mainCanvasCtx = canvas.getContext('2d');
        this.canUpdate = true;
        this.color = '';
    }

    get TRANSFORM_OFFSET_Y() {
        return Entry.isMobile() ? 107 : 57;
    }

    get INNER_TRANSFORM_OFFSET_Y() {
        return Entry.isMobile() ? 156 : 0;
    }

    get CLIENT_OFFSET_Y() {
        return Entry.isMobile() ? 52 : 0;
    }

    renderComponet() {
        // this.cloneCanvas();
        this.stage.handle.setVisible(false);
        this.isRunning = true;
        this.mainCanvas.addClass('isPickerMode');
        const magnify = `
            <div class="canvasWrapper">
                <div class="innerCanvasWrapper">
                    <canvas width="640" height="360" class="magnify"/>
                </div>
            </div>
            <div class="canvasCircle"/>
            <div class="colorPreview">
                <div class="colorCircle"/>
            </div>
            <div class="magnifyRect"/>
        `;
        this.$curtain = $('<div class="entryMagnifyCurtain">');
        this.$colorSpoid = $('<div class="entryMagnify" />').html(magnify);
        const $canvas = this.$colorSpoid.find('canvas');
        this.$canvas = $canvas;
        this.$colorPreview = this.$colorSpoid.find('.colorPreview');
        this.$magnifyRect = this.$colorSpoid.find('.magnifyRect');

        this.canvasPosition = this.mainCanvas.getBoundingClientRect();
        const { width, height } = this.canvasPosition;
        const width2x = width * 3;
        const height2x = height * 3;
        $canvas.attr('width', width2x);
        $canvas.attr('height', height2x);
        /** @type {CanvasRenderingContext2D} */
        this.colorSpoidCtx = $canvas.get(0).getContext('2d');
        this.colorSpoidCtx.imageSmoothingEnabled = false;
        this.colorSpoidCtx.drawImage(this.mainCanvas, 0, 0, width2x, height2x);
        $('body').append(this.$curtain);
        $('body').append(this.$colorSpoid);
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

    updateMagnifier({ isShow, wrapperTransform, innerTransform, colorPos }) {
        if (isShow) {
            this.$colorSpoid.addClass('isShow');
            this.$colorSpoid.css('transform', wrapperTransform);
            this.$canvas.css('transform', innerTransform);
        } else {
            this.$colorSpoid.removeClass('isShow');
        }
        if (this.canUpdate) {
            this.canUpdate = false;
            requestAnimationFrame(() => {
                if (this.colorSpoidCtx && colorPos) {
                    const { x = 0, y = 0 } = colorPos;
                    const imageData = this.mainCanvasCtx.getImageData(x, y, 1, 1);
                    const [red, green, blue] = imageData.data;
                    const background = `rgb(${red}, ${green}, ${blue})`;
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
            const innerX = mouseEvent.clientX - left;
            const innerY = mouseEvent.clientY - top;
            const x = Math.floor((innerX * 640) / width); // + 29;
            const y = Math.floor(((innerY - this.CLIENT_OFFSET_Y) * 360) / height); // + 28;
            this.updateMagnifier({
                event: mouseEvent,
                isShow: true,
                wrapperTransform: `translate3d(${mouseEvent.pageX - 57}px, ${mouseEvent.pageY -
                    this.TRANSFORM_OFFSET_Y}px, 0)`,
                innerTransform: `translate3d(${-innerX * 3}px, ${-innerY * 3 +
                    this.INNER_TRANSFORM_OFFSET_Y}px, 0)`,
                colorPos: {
                    x,
                    y,
                },
            });
        } else {
            this.color = '';
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
            this.emit('selectColor', this.color);
            this.remove();
        });
    }
}

export default ColorSpoid;
