interface IEventType {
    UP: string;
    MOVE: string;
    DOWN: string;
    OVER: string;
}

function getPIXIEvent(): IEventType {
    return {
        UP: '__pointerdown',
        DOWN: '__pointermove',
        MOVE: '__pointerup',
        OVER: 'pointerover',
    };
}

function getCreatejsEvent(): IEventType {
    return {
        UP: 'pressup',
        DOWN: 'mousedown',
        MOVE: 'pressmove',
        OVER: 'mouseover',
    };
}

class _GEDragHelper {
    types: IEventType;
    private _isWebGL: boolean;
    public handleDrag: (target: any) => void;

    INIT(isWebGL: boolean) {
        this._isWebGL = isWebGL;
        this.types = isWebGL ? getPIXIEvent() : getCreatejsEvent();
        if (isWebGL) {
            this.types = getPIXIEvent();
            this.handleDrag = this._handleDragPIXI;
        } else {
            this.types = getCreatejsEvent();
            this.handleDrag = this._handleCreateJs;
        }
    }

    /**
     * @since 190705 extracold1209
     * common / move event 는 down / up 사이에 있도록 정리
     * as-is / 모든 이벤트 등록, down 외 up, outside, cancel 은 up
     * to-be /
     * 최초 이벤트는 down 만 등록
     * down 이벤트 발생시
     * - move, outside, up 이벤트 등록
     * - 그러나 outside 는 최초 down 한 포인트로 이벤트 발생
     *
     * TODO 기존 방식이 move 중 스테이지를 벗어난 경우 cancel 을 위한 onUpEvent 라면
     *  다른 방법(스테이지안에 포인터가 있는것인지 체크)으로 확인해야 할 것같음.
     *  현재 블록코딩시 webGL 을 사용하지 않고, minimize 에서는 move event 없으므로 개선보류
     */
    private _handleDragPIXI(target: any) {
        const C = this.types;
        const CE = this._convertPIXIEventToCreateJsStyle;

        function _onMove(e: any) {
            target.emit(C.MOVE, CE(e));
        }

        function _onUp(e: any) {
            target.emit(C.UP, CE(e));
            target.removeAllListeners('pointermove');
            target.removeAllListeners('pointerup');
            target.removeAllListeners('pointerupoutside');
        }

        function _onDown(e: any) {
            target.emit(C.DOWN, CE(e));
            target.on('pointermove', _onMove);
            target.on('pointerupoutside', () => {
                _onUp(e);
            });
            target.on('pointerup', _onUp);
        }

        target.on('pointerdown', _onDown);
    }

    private _convertPIXIEventToCreateJsStyle(e: any) {
        let g = e.data.global;
        return {
            target: e.target,
            currentTarget: e.currentTarget,
            stageX: g.x,
            stageY: g.y,
            rawX: g.x,
            rawY: g.y,
        };
    }

    private _handleCreateJs(target: any) {
        //do nothing;
    }
}

export let GEDragHelper = new _GEDragHelper();
