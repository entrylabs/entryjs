Entry.magnify = class magnify {
    constructor() {
        this.mainCanvas = Entry.stage.canvas.canvas;
        this.color = '';
        this.renderComponet();
    }

    remove() {
        $(document).off('mousemove.magnify touchmove.magnify');
        $(document).off('click.magnify');
        this.$magnify.remove();
        delete this.color
    }

    renderComponet() {
        const magnify = `
            <canvas width="100px" height="100px" class="magnify"/>
            <div class="magnifyRect"/>
        `;
        const $magnify = $('<div class="entryMagnify">').html(magnify);
        const magnifyCanvas = $magnify.find('canvas')[0];
        /** @type {CanvasRenderingContext2D} */
        const magnifyCtx = magnifyCanvas.getContext('2d');
        magnifyCtx.fillStyle = 'white';
        magnifyCtx.imageSmoothingEnabled = false;
        const { left = 0, top = 0, width, height } = this.mainCanvas.getBoundingClientRect();
        this.$magnify = $magnify;
        $('body').append($magnify);
        $(document).on('mousemove.magnify touchmove.magnify', (e) => {
            const mousePos = {
                x: e.clientX,
                y: e.clientY,
            };

            let x = Math.floor((mousePos.x - left) * 640 / width) - 17;
            let y = Math.floor((mousePos.y - top) * 360 / height) - 20;
            magnifyCtx.drawImage(this.mainCanvas, x, y, 213, 120, 0, 0, 640, 360);

            if (
                mousePos !== null &&
                mousePos.x > left &&
                mousePos.x < width + left &&
                mousePos.y > top &&
                mousePos.y < height + top
            ) {
                $magnify.css('transform', `translate3d(${e.pageX - 50}px, ${e.pageY - 50}px, 0)`);
                const imageData = magnifyCtx.getImageData(50, 50, 1, 1);
                const [red, green, blue] = imageData.data;
                const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                if (color) {
                    magnifyCanvas.style.borderColor = color;
                    this.color = [red, green, blue];
                }
            }
        });
        $(document).on('click.magnify', () => {
            console.log(this.color);
            this.remove();
        });
    }
};
