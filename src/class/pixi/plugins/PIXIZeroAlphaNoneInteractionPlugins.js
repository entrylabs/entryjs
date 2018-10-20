/**
 * pixi 는 alpha = 0 일때도 마우스 클릭이벤트를 받기 때문에
 * createjs와 동일하게 alpha=0 일때 마우스 이벤트를 받지 않도록 함수를 수정함.
 */
export class PIXIZeroAlphaNoneInteractionPlugins {
    constructor() {

        (function(p) {
            p._processInteractive = p.processInteractive;
            p.processInteractive = function(interactionEvent, displayObject, func, hitTest, interactive) {
                if(!displayObject || displayObject.alpha <= 0) {
                    return false;
                }
                return this._processInteractive(interactionEvent, displayObject, func, hitTest, interactive);
            };
        })(PIXI.interaction.InteractionManager.prototype);

    }
}



