/**
 * 취소선, 밑줄 추가 하기 위해 만튼 스타일.
 */
import { TextStyle } from 'pixi.js';

export default class PIXITextStyle extends TextStyle {
    /** 취소선 */
    private _cancelLine: boolean = false;
    private _underLine: boolean = false;
    /** 멀티 라인일때 ( wordWrap = true ) 글씨가 보여지는 최대 높이. 음수일때는 글씨를 모두 보여줌. */
    private _maxHeight: number = -1;
    private styleID: number = 0;

    /**
     *
     * @return {boolean}
     */
    get cancelLine() {
        return this._cancelLine;
    }

    set cancelLine(value) {
        if (this._cancelLine !== value) {
            this._cancelLine = value;
            this.styleID++;
        }
    }

    /** css wordBreak 의 break-all 속성을 구현하기 위함. entryjs 는 break-all 이 기본이기 때문에 return true 로 해버림. */
    get wordBreakAll(): boolean {
        return true;
    }

    /**
     *
     * @return {boolean}
     */
    get underLine() {
        return this._underLine;
    }

    set underLine(value) {
        if (this._underLine !== value) {
            this._underLine = value;
            this.styleID++;
        }
    }

    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(value) {
        if (this._maxHeight !== value) {
            this._maxHeight = value;
            this.styleID++;
        }
    }
}
