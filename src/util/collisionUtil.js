import { GEHelper } from '../graphicEngine/GEHelper';

const ALPHA_THRESHOLD = 0.2;
const collision = ndgmr.checkPixelCollision;

export const collisionCheckColor = (currentSprite, targetSprite, targetColor1, targetColor2) => {
    if (targetColor2) {
        if (
            checkColor(currentSprite, targetSprite, targetColor2) &&
            checkColor(targetSprite, currentSprite, targetColor1)
        ) {
            return true;
        } else {
            return false;
        }
    } else {
        if (checkColor(currentSprite, targetSprite, targetColor1)) {
            return true;
        }
    }
};
const threshold = 0;

const checkColor = (currentSprite, targetSprite, color) => {
    const { r, g, b } = color;
    const currentObject = currentSprite.object;
    const targetObject = targetSprite.object;
    if (targetSprite.type === 'textBox' || currentSprite.type === 'textBox') {
    } else {
        if (
            targetSprite.getVisible() &&
            collision(currentObject, targetObject, ALPHA_THRESHOLD, false)
        ) {
            const collisionData = collision(currentObject, targetObject, ALPHA_THRESHOLD, true);
            const minX = parseInt(collisionData.x + collisionData.width * threshold);
            const minY = parseInt(collisionData.y + collisionData.height * threshold);
            const targetWidth = parseInt(collisionData.width * (1 - 2 * threshold));
            const targetHeight = parseInt(collisionData.height * (1 - 2 * threshold));
            if (targetWidth < 1 || targetHeight < 1) {
                return false;
            }
            currentSprite.setVisible(false);
            Entry.stage._app.render();

            let imageData = null;
            if (!GEHelper._isWebGL) {
                // const context = document.getElementById('entryCanvas').getContext('2d');
                imageData = document
                    .getElementById('entryCanvas')
                    .getContext('2d')
                    .getImageData(minX, minY, targetWidth, targetHeight).data;
            } else {
                imageData = new Uint8Array(collisionData.width * collisionData.height * 4);
                const gl = document.getElementById('entryCanvas').getContext('experimental-webgl', {
                    preserveDrawingBuffer: true,
                });
                gl.readPixels(
                    minX,
                    minY,
                    targetWidth,
                    targetHeight,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    imageData
                );
            }
            currentSprite.setVisible(true);
            Entry.stage._app.render();
            for (let i = 0; i < imageData.length; i += 4) {
                if (
                    imageData[i] == r &&
                    imageData[i + 1] == g &&
                    imageData[i + 2] == b
                    // Math.abs(imageData[i + 0] - r) < 3 &&
                    // Math.abs(imageData[i + 1] - g) < 3 &&
                    // Math.abs(imageData[i + 2] - b) < 3
                ) {
                    return true;
                }
            }
        }
        const clonedEntities = targetSprite.parent.clonedEntities;
        for (let i = 0, len = clonedEntities.length; i < len; i++) {
            const entity = clonedEntities[i];
            if (entity.isStamp || !entity.getVisible()) {
                continue;
            }
            if (collision(currentObject, entity.object, ALPHA_THRESHOLD, false)) {
                console.log('is it here?');

                return true;
            }
        }
    }
};
