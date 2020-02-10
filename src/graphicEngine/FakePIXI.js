import * as PIXI from 'pixi.js';

(function() {
    window.PIXI = PIXI;

    /* //PIXI를 통해 참조하는 속성을 찾아내기 위한 함수
    var arr = [];
    window.pixinames = arr;
    window.PIXI = new Proxy({}, {
        get: (target, prop) => {
            if(arr.indexOf(prop) < 0 ) {
                arr.push(prop);
            }
            return emptyFn;
        }
    });
    */
})();
