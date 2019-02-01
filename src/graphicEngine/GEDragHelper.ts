
interface IEventType {
    UP:string;
    MOVE:string;
    DOWN:string;
    OVER:string;
}

function getPIXIEvent():IEventType {
    return {
        UP: '__pointerdown',
        DOWN: '__pointermove',
        MOVE: '__pointerup',
        OVER: 'pointerover'
    };
}

function getCreatejsEvent():IEventType  {
    return {
        UP: 'pressup',
        DOWN: 'mousedown',
        MOVE: 'pressmove',
        OVER: 'mouseover'
    };
}


class _GEDragHelper {

    types:IEventType;
    private _isWebGL:boolean;
    public handleDrag:(target:any)=>void;

    INIT(isWebGL:boolean) {
        this._isWebGL = isWebGL;
        this.types = isWebGL ? getPIXIEvent() : getCreatejsEvent();
        if(isWebGL) {
            this.types = getPIXIEvent();
            this.handleDrag = this._handleDragPIXI;
        } else {
            this.types = getCreatejsEvent();
            this.handleDrag = this._handleCreateJs;
        }
    }

    private _handleDragPIXI(target:any) {
        const C = this.types;
        const CE = this._convertPIXIEventToCreateJsStyle;

        function _onMove(e:any){
            target.emit(C.MOVE, CE(e));
        }

        function _onUp(e:any){
            target.emit(C.UP, CE(e));
            target.off("pointermove", _onMove);
        }

        function _onDown(e:any) {
            target.emit(C.DOWN, CE(e));
            target.on("pointermove", _onMove);
        }

        target.on("pointerdown", _onDown);
        target.on("pointerup", _onUp);
        target.on("pointerupoutside", _onUp);
        target.on("pointercancel", _onUp);
    }
    private _convertPIXIEventToCreateJsStyle(e:any) {
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

    private _handleCreateJs(target:any) {
        //do nothing;
    }

}

export let GEDragHelper = new _GEDragHelper();
