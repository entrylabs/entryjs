/**
 * 취소선, 밑줄 추가 하기 위해 만튼 스타일.
 */
export default class PIXITextStyle extends PIXI.TextStyle {
    
    constructor(style) {
        super(style);

        /**
         * 취소선
         * @type {boolean}
         * @private
         */
        this._cancelLine = false;

        /**
         * 
         * @type {boolean}
         * @private
         */
        this._underLine = false;

        /**
         * 멀티 라인일때 ( wordWrap = true ) 글씨가 보여지는 최대 높이. 음수일때는 글씨를 모두 보여줌.
         * @type {number}
         * @private
         */
        this._maxHeight = -1;
    }

    
    /**
     * 
     * @return {boolean}
     */
    get cancelLine()
    {
        return this._cancelLine;
    }
    
    set cancelLine(value) 
    {
        if (this._cancelLine !== value)
        {
            this._cancelLine = value;
            this.styleID++;
        }
    }

    /**
     * 
     * @return {boolean}
     */
    get underLine()
    {
        return this._underLine;
    }

    set underLine(value)
    {
        if (this._underLine !== value)
        {
            this._underLine = value;
            this.styleID++;
        }
    }

    get maxHeight()
    {
        return this._maxHeight;
    }

    set maxHeight(value)
    {
        if(this._maxHeight !== value)
        {
            this._maxHeight = value;
            this.styleID++;
        }
    }
    
}
