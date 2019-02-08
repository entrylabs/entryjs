(function() {
    if(window.PIXI) {
        return;
    }

    const emptyFn = ()=>{};

    window.PIXI = new Proxy({}, {
        get: (target, prop) => {
            return emptyFn;
        }
    });
})();