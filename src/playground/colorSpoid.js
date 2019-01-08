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
        return Entry.isMobile() ? 49 : 0;
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
        // this.cloneCanvas();
        this.stage.handle.setVisible(false);
        this.isRunning = true;
        this.mainCanvas.addClass('isPickerMode');
        const magnify = `
            <div class="canvasWrapper">
                <canvas width="640" height="360" class="magnify"/>
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
        const width2x = width * 2;
        const height2x = height * 2;
        /** @type {CanvasRenderingContext2D} */
        this.colorSpoidCtx = $canvas.get(0).getContext('2d');
        this.colorSpoidCtx.fillStyle = 'white';
        this.colorSpoidCtx.fillRect(0, 0, 640, 360);
        this.colorSpoidCtx.drawImage(this.mainCanvas, 0, 0);
        this.colorSpoidCtx.imageSmoothingEnabled = false;
        $canvas.css('width', width2x);
        $canvas.css('height', height2x);
        $('body').append(this.$curtain);
        $('body').append(this.$colorSpoid);
        this.addEventListner();
        this.$colorSpoid.addClass('isShow');
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
        this.$canvas.css(
            'transform',
            `translate3d(${mousePos.pageX - 57}px, ${mousePos.pageY -
                this.TRANSFORM_OFFSET_Y}px, 0)`
        );
        // let x = Math.floor((mousePos.clientX - left) * 640 / width) + 29;
        // let y = Math.floor((mousePos.clientY - top - this.DRAW_OFFSET_Y) * 360 / height) + 28;
        // this.colorSpoidCtx.drawImage(this.clonedCanvas, x, y, 57, 57, 0, 0, 114, 114);
    }

    updateMagnifier({ isShow, transform, position, transform2 }) {
        if (isShow) {
            // this.$colorSpoid.addClass('isShow');
            this.$colorSpoid[0].style.transform = transform; //.css('transform', transform);
            // this.$colorSpoid.css('transform', transform);
            this.$canvas.css('transform', transform2);
        } else {
            // this.$colorSpoid.removeClass('isShow');
        }
        // if (this.canUpdate) {
        //     this.canUpdate = false;
        //     requestAnimationFrame(() => {
        //         if (this.colorSpoidCtx && position) {
        //             // this.drawCloneImage(event);
        //             const { x = 0, y = 0 } = position;
        //             const imageData = this.colorSpoidCtx.getImageData(x, y, 1, 1);
        //             const [red, green, blue] = imageData.data;
        //             const background = 'rgb(' + red + ',' + green + ',' + blue + ')';
        //             this.$colorPreview.css('background-color', background);
        //             this.$magnifyRect.css('background-color', background);
        //             this.color = `#${_padStart(red.toString(16), 2, '0')}${_padStart(
        //                 green.toString(16),
        //                 2,
        //                 '0'
        //             )}${_padStart(blue.toString(16), 2, '0')}`;
        //         }
        //         this.canUpdate = true;
        //     });
        // }
    }

    moveMagnifer(event) {
        console.time('a');
        const { left = 0, top = 0, width, height } = this.canvasPosition;
        const mouseEvent = Entry.Utils.getMouseEvent(event);
        if (
            mouseEvent !== null &&
            mouseEvent.clientX > left &&
            mouseEvent.clientX < width + left &&
            mouseEvent.clientY > top + this.CLIENT_OFFSET_Y &&
            mouseEvent.clientY < height + top + this.CLIENT_OFFSET_Y
        ) {
            const a = mouseEvent.clientX - left;
            const b = mouseEvent.clientY - top;

            let x = Math.floor((mouseEvent.clientX - left) * 640 / width); // + 29;
            let y = Math.floor((mouseEvent.clientY - top) * 360 / height); // + 28;

            this.updateMagnifier({
                event: mouseEvent,
                isShow: true,
                transform: `translate3d(${mouseEvent.pageX - 57}px, ${mouseEvent.pageY -
                    this.TRANSFORM_OFFSET_Y}px, 0)`,
                transform2: `translate3d(${-a * 2}px, ${-b * 2}px, 0)`,
                position: {
                    x,
                    y,
                },
            });
        } else {
            this.updateMagnifier({
                event: mouseEvent,
                isShow: false,
            });
        }
        console.timeEnd('a');
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
