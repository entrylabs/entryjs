/**
 * PIXI.Container.getChildAt 은 잘못된 index를 넣으면 throw 함. createjs 는 안함.
 * 동일한 스펙을 맞추기 위해 새로 정의함.
 */
export function pixiGetChildAt() {
    const p = PIXI.Container.prototype;
    p.getChildAt = function(index) {
        return this.children[index];
    };


    p.getChildIndex = function(child) {
        return this.children.indexOf(child);
    };

    p.___addChildAt = p.addChildAt;
    p.addChildAt = function(child, index) {
        try {
            return this.___addChildAt(child, index);
        } catch(e) {
            return child;
        }
    };


}