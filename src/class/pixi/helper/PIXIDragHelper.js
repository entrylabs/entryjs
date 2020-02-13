/**
 * pixi 에는 createjs 의 pressmove 가 없어서 그것을 대신해주는 헬퍼 클라스.
 */

export class PIXIDragHelper {
    /**
     * @param {PIXI.DisplayObject} target
     */
    static handleDrag(target) {
        const C = PIXIDragHelper;
        const CE = this._convertEvent;

        function _onMove(e){
            target.emit(C.MOVE, CE(e));
        }

        function _onUp(e){
            target.emit(C.UP, CE(e));
            target.off("pointermove", _onMove);
        }

        function _onDown(e) {
            target.emit(C.DOWN, CE(e));
            target.on("pointermove", _onMove);
        }

        target.on("pointerdown", _onDown);
        target.on("pointerup", _onUp);
        target.on("pointerupoutside", _onUp);
        target.on("pointercancel", _onUp);
    }

    static _convertEvent(e) {
        let g = e.data.global;
        return {
            target: e.target,
            currentTarget: e.currentTarget,
            stageX: g.x,
            stageY: g.y,
            rawX: g.x,
            rawY: g.y
        };
    }

}

PIXIDragHelper.DOWN = "__pointerdown";
PIXIDragHelper.MOVE = "__pointermove";
PIXIDragHelper.UP = "__pointerup";
PIXIDragHelper.OVER = "pointerover";

