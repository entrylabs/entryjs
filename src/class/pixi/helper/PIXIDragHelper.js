/**
 * pixi 에는 createjs 의 pressmove 가 없어서 그것을 대신해주는 헬퍼 클라스.
 */

export class PIXIDragHelper {
    /**
     * @param {PIXI.DisplayObject} target
     */
    static handleDrag(target) {
        const C = PIXIDragHelper;
        if(C._TARGET) {
            console.log(`%coh my godness. drag target already exist.`, 'background: #00fffff; color: #ff0000');
            C._unhandleDrag(C._TARGET);
            C._TARGET = null;
        }
        C._TARGET = target;
        console.log(`%chandleDrag(${C.__CNT})`, 'background: #222; color: #bada55');
        C._onMove = function(e){
            target.emit(C.MOVE, e);
        };
        C._onUp = function(e){
            target.emit(C.UP, e);
            C._TARGET = null;
            C._unhandleDrag(target);
        };

        target.on("pointermove", this._onMove);
        target.on("pointerup", this._onUp);
        target.on("pointerupoutside", this._onUp);
        target.on("pointercancel", this._onUp);
    }

    /**
     * @param target
     * @private
     */
    static _unhandleDrag(target) {
        const C = PIXIDragHelper;
        console.log(`%c_unhandleDrag(${C.__CNT++})`, 'background: #222; color: #bada55');
        target.off("pointermove", C._onMove);
        target.off("pointerup", C._onUp);
        target.off("pointerupoutside", C._onUp);
        target.off("pointercancel", C._onUp);
        C._onMove = C._onUp = null;
    }
}
PIXIDragHelper.__CNT = 0;
PIXIDragHelper.DOWN = "pointerdown";
PIXIDragHelper.MOVE = "__pointermove";
PIXIDragHelper.UP = "__pointerup";

