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

    cloneCanvas() {
        this.clonedCanvas = document.createElement('canvas');
        this.clonedContext = this.clonedCanvas.getContext('2d');
        this.clonedCanvas.width = 760;
        this.clonedCanvas.height = 480;
        this.clonedContext.fillStyle = 'black';
        this.clonedContext.fillRect(0, 0, 760, 480);
        this.clonedContext.drawImage(this.mainCanvas, 57, 57);
        $('body').append(this.clonedCanvas);
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
        /** @type {CanvasRenderingContext2D} */
        this.colorSpoidCtx = $canvas.get(0).getContext('2d');
        this.colorSpoidCtx.fillStyle = 'white';
        this.colorSpoidCtx.fillRect(0, 0, 120, 120);
        this.colorSpoidCtx.imageSmoothingEnabled = false;
        this.canvasPosition = this.mainCanvas.getBoundingClientRect();
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

    drawCloneImage(mousePos) {
        console.log(mousePos);
        const { left = 0, top = 0, width, height } = this.canvasPosition;
        let x = Math.floor((mousePos.x - left) * 640 / width) + 29;
        let y = Math.floor((mousePos.y - top) * 360 / height) + 27;
        this.colorSpoidCtx.drawImage(this.clonedCanvas, x, y, 320, 180, 0, 0, 640, 360);
    }

    updateMagnifier({ isShow, transform }) {
        if (this.canUpdate) {
            // this.canUpdate = false;
            const imageData = this.colorSpoidCtx.getImageData(57, 57, 1, 1);
            const [red, green, blue] = imageData.data;

            if (isShow) {
                console.log('transform', transform);
                this.$colorSpoid.addClass('isShow');
                this.$colorSpoid.css('transform', transform);
                this.$colorPreview.css(
                    'background-color',
                    'rgb(' + red + ',' + green + ',' + blue + ')'
                );
                this.color = `#${_padStart(red.toString(16), 2, '0')}${_padStart(
                    green.toString(16),
                    2,
                    '0'
                )}${_padStart(blue.toString(16), 2, '0')}`;
            } else {
                this.$colorSpoid.removeClass('isShow');
            }

            requestAnimationFrame(() => {
                this.canUpdate = true;
            });
        }
    }

    moveMagnifer(event) {
        const { left = 0, top = 0, width, height } = this.canvasPosition;
        if (
            event !== null &&
            event.clientX > left &&
            event.clientX < width + left &&
            event.clientY > top &&
            event.clientY < height + top
        ) {
            this.updateMagnifier({
                isShow: true,
                transform: `translate3d(${event.pageX - 57}px, ${event.pageY - 57}px, 0)`,
            });
        } else {
            this.updateMagnifier({
                isShow: false,
            });
        }
    }

    addEventListner() {
        $(document).on('mousedown.magnify', (e) => {
            e.stopImmediatePropagation();
        });
        // $(document).on('touchstart.magnify mousedown.magnify', (e) => {
        //     requestAnimationFrame(() => {
        //         this.$colorSpoid.css('transition', 'transform ease 0.1s');
        //     });
        // });
        $(document).on('touchstart.magnify touchmove.magnify', (e) => {
            const mouseEvent = Entry.Utils.getMouseEvent(e);
            const mousePos = {
                x: mouseEvent.clientX,
                y: mouseEvent.clientY,
            };
            this.drawCloneImage(mousePos);
            this.moveMagnifer(mouseEvent);
        });
        $(document).on('mousemove.magnify', (e) => {
            const mousePos = {
                x: e.clientX,
                y: e.clientY,
            };
            this.drawCloneImage(mousePos);
            this.moveMagnifer(e);
        });
        $(document).on('click.magnify touchend.magnify', (e) => {
            this.emit('selectColor', this.color || '#ffffff');
            this.remove();
        });
    }
}

export default ColorSpoid;
