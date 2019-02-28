/**
 * PIXI.Container.getChildAt 은 잘못된 index를 넣으면 throw 함. createjs 는 안함.
 * 동일한 스펙을 맞추기 위해 새로 정의함.
 */
export function pixiGetChildAt() {
    const p = PIXI.Container.prototype;
    p.getChildAt = function(index) {
        return this.children[index];
    }
}