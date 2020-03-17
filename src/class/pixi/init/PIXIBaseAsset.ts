/**
 * 기본 텍스쳐 로드 되기 전에 객체를 생성 할 수 있도록 json은 함께 번들링함.
 */

class PIXIBaseAssetSprite extends PIXI.Sprite {
    constructor(t?: any) {
        super(t);
    }
}

// var atlasJson = require("./../../../entry_texture/base_asset.json");
let atlasJson: any;

export class PIXIBaseAsset {
    private _sheet: PIXI.Spritesheet;

    constructor() {
        const path = `${Entry.mediaFilePath}base_asset.png`;
        const base = PIXI.BaseTexture.fromImage(path);
        base.once('loaded', () => {
            Entry.requestUpdate = true;
        });
        this._sheet = new PIXI.Spritesheet(base, atlasJson);

        //서브텍스쳐의 개수는 반드시 1000개보다 작아야 한다. 그렇지 않으면 parse 가 async 로 작동함.
        //1000 이라는 숫자는 PIXI.Spritesheet.BATCH_SIZE getter 에 정의됨.
        this._sheet.parse(() => {});
    }

    newSprite(key: string): PIXI.Sprite {
        // return new PIXI.Sprite(this._sheet.textures[key]);
        return new PIXIBaseAssetSprite(this._sheet.textures[key]);
    }
    getTexture(key: string): PIXI.Texture {
        return this._sheet.textures[key];
    }
}
