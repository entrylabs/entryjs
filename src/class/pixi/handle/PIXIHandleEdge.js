import { Container } from 'pixi.js';

export class PIXIHandleEdge extends Container {
    constructor(baseAsset) {
        super();
        const spriteFactory = () => {
            const sp = baseAsset.newSprite('handle/border');
            sp.pivot.set(0, 4);
            this.addChild(sp);
            return sp;
        };
        this._left = spriteFactory();
        this._right = spriteFactory();
        this._top = spriteFactory();
        this._bottom = spriteFactory();
    }

    renderEdge(w, h) {
        const hw = w / 2;
        const hh = h / 2;

        this._top.width = w;
        this._top.position.set(-hw, -hh);

        this._bottom.width = w;
        this._bottom.position.set(-hw, hh);

        this._left.width = h;
        this._left.rotation = Math.PI / 2;
        this._left.position.set(-hw, -hh);

        this._right.width = h;
        this._right.rotation = Math.PI / 2;
        this._right.position.set(hw, -hh);
    }
}
