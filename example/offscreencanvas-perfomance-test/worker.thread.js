let canvas;
/** @type CanvasRenderingContext2D */
var ctx;
var w;
var h;
function _rand255() {
    return Math.floor(Math.random()*255);
}

self.onmessage = (e)=>{
    var data = e.data;
    switch (data.type) {
        case "sendCanvas":
            canvas = data.canvas;
            w = canvas.width;
            h = canvas.height;
            ctx = canvas.getContext("2d");
            self.postMessage({type:"init"});
            doit();
            break;
    }
};

function doit() {
    draw();
    console.log("draw");
    // setInterval(draw, 10);
}


function draw() {
    var rr = _rand255;
    ctx.fillStyle = `rgba(${rr()},${rr()},${rr()},${Math.random()})`;
    ctx.fillRect(0, 0, w, h);
}