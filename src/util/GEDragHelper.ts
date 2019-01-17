import { PIXIDragHelper } from '../class/pixi/helper/PIXIDragHelper';

interface IEventType {
    UP:string;
    MOVE:string;
    DOWN:string;
}

function getPIXIEvent():IEventType {
    return {
        UP: PIXIDragHelper.UP,
        DOWN: PIXIDragHelper.DOWN,
        MOVE: PIXIDragHelper.MOVE,
    };
}

function getCreatejsEvent():IEventType  {
    return {
        UP: PIXIDragHelper.UP,
        DOWN: PIXIDragHelper.DOWN,
        MOVE: PIXIDragHelper.MOVE,
    };
}


class _GEDragHelper {

    types:IEventType;
    private _isWebGL:boolean;

    INIT(isWebGL:boolean) {
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