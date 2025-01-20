/**
 * useWebGL 일때 font 로드가 끝나면 생성된 모든 text 오브젝트를 다시 draw 하도록 함.
 */
import { TextMetrics } from 'pixi.js';

const LOADED = 'fontLoaded';

export class PIXIFontLoadHandler {
    private _items: any[] = [];
    private _fontLoaded: boolean;

    constructor() {
        this._handleFontLoaded = this._handleFontLoaded.bind(this);
        this._listen();
    }

    private _listen() {
        if ((window as any).fontLoaded) {
            this._fontLoaded = true;
        } else {
            Entry.addEventListener(LOADED, this._handleFontLoaded);
        }
    }

    private _handleFontLoaded() {
        this._fontLoaded = true;
        Entry.removeEventListener(LOADED, this._handleFontLoaded);
        TextMetrics.clearMetrics(null);
        this._items.forEach((text: any) => {
            //updateText() 는 private 함수이지만, override 했으므로, 호출하겠음.
            text.updateText(false);
        });
        Entry.requestUpdate = true;
        this._items = null;
    }

    /** @param {PIXIText} text */
    manage(text: any) {
        if (this._fontLoaded) {
            return;
        }
        this._items.push(text);
    }

    /** @param {PIXIText} text */
    unmanage(text: any) {
        if (this._fontLoaded) {
            return;
        }
        const arr = this._items;
        const index = arr.indexOf(text);
        if (index == -1) {
            return;
        }
        arr.splice(index, 1);
    }
}
