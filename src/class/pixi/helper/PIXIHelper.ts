import { Sprite, Container, Texture, Graphics } from 'pixi.js';
import { PIXISprite } from '../plugins/PIXISprite';
import { PIXITempStore } from '../etc/PIXITempStore';
import { PIXIText } from '../text/PIXIText';

export class PIXIGraphics extends Graphics {
    destroyed: boolean = false;

    destroy(options?: any) {
        this.destroyed = true;
        super.destroy(options);
    }
}

export default class PIXIHelper {
    static sprite(debugName?: string, texture?: Texture): Sprite {
        return new PIXISprite(texture);
    }

    static container(debugName?: string): Container {
        return new Container();
    }

    static text(str: string, font: string, color: string, textBaseline: string, textAlign: string) {
        // console.log(str, font);
        const reg = /((\d+)(pt|sp|px))?\s*(.+)/gi;
        const result: any[] = reg.exec(font) || [];
        const fontName = result[4] || "NanumGothic, 'Nanum Gothic'";
        const size = result[1] || '10pt';

        const nColor = parseInt(color.replace('#', '0x')) || 0;
        // var t = new PIXI.Text(str, {
        const t = new PIXIText(str, {
            fontFamily: fontName,
            fontSize: size,
            fill: nColor,
            // textBaseline: textBaseline || 'alphabetic',
            textBaseline: 'middle',
            align: textAlign || 'left',
            miterLimit: 2.5, //createjs default value,
            padding: 5, //바운드를 삐져나오는 경우를 대비한 패딩
        });
        return t;
    }

    static getOffScreenCanvas(forceHTMLCanvas: boolean = false): HTMLCanvasElement {
        forceHTMLCanvas = true;
        const WIN: any = window;
        if (!forceHTMLCanvas && 'OffscreenCanvas' in WIN) {
            return new WIN.OffscreenCanvas(1, 1);
        } else {
            return document.createElement('canvas');
        }
    }

    /**
     * #ff00ff --> 0xff00ff
     * @param strColor
     */
    static colorToUint(strColor: any) {
        return strColor ? Number(strColor.replace('#', '0x')) : undefined;
    }

    static todo(msg: string) {}

    static newPIXIGraphics() {
        return new PIXIGraphics(false);
    }

    static randomRGBAString(alpha: number = 0.3): string {
        const rr = this._rand255;
        return `rgba(${rr()},${rr()},${rr()},${alpha})`;
    }

    private static _rand255(): number {
        return Math.floor(Math.random() * 255);
    }

    /**
     * createjs.DisplayObject#getTransformBound()
     * @param {PIXI.DisplayObject} target
     */
    static getTransformBound(target: any) {
        const bounds = target.getLocalBounds(PIXITempStore.rect1);

        let x = bounds.x;
        let y = bounds.y;
        const width = bounds.width;
        const height = bounds.height;
        const mtx = PIXITempStore.matrix1;
        target.localTransform.copyTo(mtx);

        if (x || y) {
            const mat2 = PIXITempStore.matrix2.identity().translate(-x, -y);
            mtx.append(mat2);
        }

        const x_a = width * mtx.a;
        const x_b = width * mtx.b;
        const y_c = height * mtx.c;
        const y_d = height * mtx.d;
        const tx = mtx.tx;
        const ty = mtx.ty;

        let minX = tx;
        let maxX = tx;
        let minY = ty;
        let maxY = ty;

        if ((x = x_a + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
        if ((x = x_a + y_c + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
        if ((x = y_c + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }

        if ((y = x_b + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }
        if ((y = x_b + y_d + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }
        if ((y = y_d + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }

        bounds.x = minX;
        bounds.y = minY;
        bounds.width = maxX - minX;
        bounds.height = maxY - minY;
        return bounds;
    }
}
