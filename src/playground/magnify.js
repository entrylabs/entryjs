Entry.magnify = class magnify {
    constructor() {
        const magnify = document.createElement('canvas');
        magnify.addClass('magnify');
        magnify.setAttribute('width', '100');
        magnify.setAttribute('height', '100');
        var magnifyCtx = magnify.getContext('2d');
        const main = Entry.stage.canvas.canvas;
        var ctx = main.getContext('2d');

        const { left = 0, top = 0, width, height } = main.getBoundingClientRect();
        document.body.appendChild(magnify);
        document.addEventListener('mousemove', function(e) {
            var mousePos = {
                x: e.clientX,
                y: e.clientY,
            };
            var color = undefined;

            if (
                mousePos !== null &&
                mousePos.x > left &&
                mousePos.x < width + left &&
                mousePos.y > top &&
                mousePos.y < height + top
            ) {
                // color picker image is 256x256 and is offset by 10px
                // from top and bottom
                var imageData = ctx.getImageData(0, 0, 640, 360);
                var data = imageData.data;

                let x = Math.floor((mousePos.x - left) * 640 / width);
                let y = Math.floor((mousePos.y - top) * 360 / height);
                // let x = mousePos.x - left;
                // let y = mousePos.y - top;
                console.log(x, y, mousePos.x - left, mousePos.y - top, left, width);
                var red = data[(width * y + x) * 4];
                var green = data[(width * y + x) * 4 + 1];
                var blue = data[(width * y + x) * 4 + 2];
                var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
            }
            console.log(color);
            // magnifyCtx.fillStyle = 'white';
            // //magnifyCtx.clearRect(0,0, zoom.width, zoom.height);
            // //magnifyCtx.fillStyle = "transparent";

            // let x = Math.floor((mousePos.x - left) * 640 / width) - 15;
            // let y = Math.floor((mousePos.y - top) * 360 / height) - 15;
            // magnifyCtx.drawImage(main, x, y, 213, 120, 0, 0, 640, 360);
            // magnify.style.top = e.pageY - 50 + 'px';
            // magnify.style.left = e.pageX - 50 + 'px';
            // magnify.style.display = 'block';
            if (color) {
                magnify.style.borderColor = color;
            }
        });
    }
};
