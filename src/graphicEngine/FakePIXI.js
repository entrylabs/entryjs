(function() {
    if(window.PIXI) {
        return;
    }

    const emptyFn = ()=>{};

    window.PIXI = new Proxy({}, {
        get: (target, prop) => {
            console.log("proxy:"+prop);
            return emptyFn;
        }
    });

    window.PIXI = pixi;
})();