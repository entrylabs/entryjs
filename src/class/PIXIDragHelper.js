/**
 * pixi 에는 createjs 의 pressmove 가 없어서 그것을 대신해주는 헬퍼 클라스.
 */

export class PIXIDragHelper {
    /**
     * @param {PIXI.DisplayObject} target
     */
    static handleDrag(target) {
        const C = PIXIDragHelper;
        C._onMove = function(e){
            target.emit(C.MOVE, e);
        };
        C._onUp = function(e){
            target.emit(C.UP, e);
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
        target.off("pointermove", C._onMove);
        target.off("pointerup", C._onUp);
        target.off("pointerupoutside", C._onUp);
        target.off("pointercancel", C._onUp);
        C._onMove = C._onUp = null;
    }
}

PIXIDragHelper.DOWN = "pointerdown";
PIXIDragHelper.MOVE = "__pointermove";
PIXIDragHelper.UP = "__pointerup";

