import { PIXIDragHelper } from '../class/pixi/helper/PIXIDragHelper';

interface IEventType {
    UP:string;
    MOVE:string;
    DOWN:string;
    OVER:string;
}

function getPIXIEvent():IEventType {
    return {
        UP: PIXIDragHelper.UP,
        DOWN: PIXIDragHelper.DOWN,
        MOVE: PIXIDragHelper.MOVE,
        OVER: PIXIDragHelper.OVER
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

    INIT(isWebGL:boolean) {
        this._isWebGL = isWebGL;
        this.types = isWebGL ? getPIXIEvent() : getCreatejsEvent();
    }

    handleDrag(target:any) {
        if(this._isWebGL) {
            PIXIDragHelper.handleDrag(target);
        } else {
            //do nothing
        }
    }
}

export let GEDragHelper = new _GEDragHelper();
let w:any = window;
w.GEDragHelper = GEDragHelper;