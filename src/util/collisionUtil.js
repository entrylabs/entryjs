import { GEHelper } from '../graphicEngine/GEHelper';

const ALPHA_THRESHOLD = 0.2;
const collision = ndgmr.checkPixelCollision;

export const collisionCheckColor = (currentSprite, targetSprite, colorOnTarget, colorOnMe) => {
    if (colorOnMe) {
        if (checkColor(currentSprite, targetSprite, colorOnTarget, colorOnMe)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (checkColor(currentSprite, targetSprite, colorOnTarget)) {
            return true;
        }
    }
};
const threshold = 0;

const checkColor = (currentSprite, targetSprite, colorOnTarget, colorOnMe) => {
    const { r, g, b } = colorOnTarget;
    const currentObject = currentSprite.object;
    const targetObject = targetSprite.object;
    if (targetSprite.type === 'textBox' || currentSprite.type === 'textBox') {
    } else {
        if (
            targetSprite.getVisible() &&
            collision(currentObject, targetObject, ALPHA_THRESHOLD, false)
        ) {
            /*
                @type/collisionInfo { minX, minY, targetWidth, targetHeight }
            */
            const collisionInfo = getCollisionAreaInfo(currentObject, targetObject);

            const imageData = getImageDataWithCollisionInfo(currentSprite, collisionInfo);
            let imageData2 = null;

            if (colorOnTarget) {
                imageData2 = getImageDataWithCollisionInfo(targetSprite, collisionInfo);
            }

            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i] == r && imageData[i + 1] == g && imageData[i + 2] == b) {
                    if (!colorOnMe) {
                        return true;
                    } else {
                        if (
                            imageData2[i] == colorOnMe.r &&
                            imageData2[i + 1] == colorOnMe.g &&
                            imageData2[i + 2] == colorOnMe.b
                        ) {
                            return true;
                        }
                    }
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

const getImageDataWithCollisionInfo = (
    spriteTobeDiscarded,
    { minX, minY, targetWidth, targetHeight }
) => {
    spriteTobeDiscarded.setVisible(false);
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
        gl.readPixels(minX, minY, targetWidth, targetHeight, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    }
    spriteTobeDiscarded.setVisible(true);
    Entry.stage._app.render();
    return imageData;
};

// currentObjects => tobe removed;
const getCollisionAreaInfo = (currentObject, targetObject) => {
    const collisionData = collision(currentObject, targetObject, ALPHA_THRESHOLD, true);
    const minX = parseInt(collisionData.x + collisionData.width * threshold);
    const minY = parseInt(collisionData.y + collisionData.height * threshold);
    const targetWidth = parseInt(collisionData.width * (1 - 2 * threshold));
    const targetHeight = parseInt(collisionData.height * (1 - 2 * threshold));
    if (targetWidth < 1 || targetHeight < 1) {
        return {};
    }
    return { minX, minY, targetWidth, targetHeight };
};
