/**
 * pixi 는 alpha = 0 일때도 마우스 클릭이벤트를 받기 때문에
 * createjs와 동일하게 alpha=0 일때 마우스 이벤트를 받지 않도록 함수를 수정함.
 */
export function PIXIZeroAlphaNoneInteractionPlugins() {
    const p = PIXI.interaction.InteractionManager.prototype;
    p._processInteractive = p.processInteractive;
    p.processInteractive = function(interactionEvent, displayObject, func, hitTest, interactive) {
        if(!displayObject || displayObject.alpha < 0.001) {
            return false;
        }
        return this._processInteractive(interactionEvent, displayObject, func, hitTest, interactive);
    };
}



