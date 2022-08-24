'use strict';

import * as PIXI from 'pixi.js';
import { GEHelper } from '../graphicEngine/GEHelper';

type EntryObjectEntity = any;

type NotchType = 'ne' | 'nw' | 'se' | 'sw';

const _cache = new Map();
class EntryDialog {
    private parent: EntryObjectEntity;
    private padding = 10;
    private border = 2;
    private width: number;
    private height: number;
    private notch: any;
    private _isNoContentTried: boolean;
    private readonly message_: string;
    private readonly mode_: 'speak' | 'ask' | 'yell' | 'think';
    public object: any;

    constructor(
        entity: EntryObjectEntity,
        message: string | number,
        mode: 'speak' | 'ask' | 'yell' | 'think',
        isStamp: boolean
    ) {
        if (entity.isEngineStop) {
            return;
        }
        if (entity.dialog) {
            entity.dialog.remove(true);
        }
        entity.dialog = this;
        this.parent = entity;

        let messageString = typeof message == 'number' ? String(message) : message;
        if (Entry.console) {
            Entry.console.print(message, mode);
        }
        messageString = messageString.match(/.{1,15}/g).join('\n');
        this.message_ = messageString;
        this.mode_ = mode;
        if (mode === 'speak' || mode === 'ask' || mode === 'think' || mode === 'yell') {
            this.generateSpeak(mode);
        }
        if (!isStamp) {
            Entry.stage.loadDialog(this);
        }
    }

    private getNotchType(bound: any) {
        const parentObj = this.parent.object;
        const entity = parentObj.entity;
        const cache = _cache.get(parentObj.id) || {};
        const { x, y } = cache;
        let notchType = cache.notchType;

        if (entity.x != x || entity.y != y) {
            if (bound.y - 20 - this.border > -135) {
                notchType = 'n';
            } else {
                notchType = 's';
            }
            if (bound.x + bound.width / 2 < 0) {
                notchType += 'e';
            } else {
                notchType += 'w';
            }
            _cache.set(parentObj.id, {
                notchType,
                x: entity.x,
                y: entity.y,
            });
        }

        return notchType;
    }

    private setNotchPositionForPixi(bound: any) {
        const notchType = this.getNotchType(bound);
        if (notchType.includes('n')) {
            this.object.y = Math.max(
                bound.y - this.height / 2 - 20 - this.padding,
                -135 + this.height / 2 + this.padding
            );
        } else {
            this.object.y = Math.min(
                bound.y + bound.height + this.height / 2 + 20 + this.padding,
                135 - this.height / 2 - this.padding
            );
        }
        if (notchType.includes('e')) {
            this.object.x = Math.min(
                bound.x + bound.width + this.width / 2,
                240 - this.width / 2 - this.padding
            );
        } else {
            this.object.x = Math.max(
                bound.x - this.width / 2,
                -240 + this.width / 2 + this.padding
            );
        }
        return notchType;
    }

    private setNotchPositionForCreateJs(bound: any) {
        let notchType = '';
        if (bound.y - 20 - this.border > -135) {
            this.object.y = Math.max(
                bound.y - this.height / 2 - 20 - this.padding,
                -135 + this.height / 2 + this.padding
            );
            notchType += 'n';
        } else {
            this.object.y = Math.min(
                bound.y + bound.height + this.height / 2 + 20 + this.padding,
                135 - this.height / 2 - this.padding
            );
            notchType += 's';
        }
        if (bound.x + bound.width / 2 < 0) {
            this.object.x = Math.min(
                bound.x + bound.width + this.width / 2,
                240 - this.width / 2 - this.padding
            );
            notchType += 'e';
        } else {
            this.object.x = Math.max(
                bound.x - this.width / 2,
                -240 + this.width / 2 + this.padding
            );
            notchType += 'w';
        }
        return notchType;
    }

    /**
     * Set position
     */
    update() {
        const parentObj = this.parent.object;
        let bound = GEHelper.calcParentBound(parentObj);
        if (!bound && this.parent.type === 'textBox') {
            if (!this._isNoContentTried) {
                this.parent.setText(' ');
                bound = GEHelper.calcParentBound(parentObj);
                this._isNoContentTried = true;
            } else {
                delete this._isNoContentTried;
                return;
            }
        }
        if (!this.object) {
            return;
        }

        let notchType = '';

        if (GEHelper.isWebGL) {
            notchType = this.setNotchPositionForPixi(bound);
        } else {
            notchType = this.setNotchPositionForCreateJs(bound);
        }

        if (this.notch && this.notch.type != notchType) {
            this.object.removeChild(this.notch);
            if (this.mode_ === 'think') {
                this.notch = this.createThinkkNotch(notchType as NotchType);
                this.object.addChild(this.notch);
            } else if (this.mode_ === 'speak' || this.mode_ === 'ask') {
                this.notch = this.createSpeakNotch(notchType as NotchType);
                this.object.addChild(this.notch);
            }
        }

        this._isNoContentTried && this.parent.setText('');
        Entry.requestUpdate = true;
    }

    remove(saveCache: boolean) {
        if (!saveCache) {
            _cache.clear();
        }
        Entry.stage.unloadDialog(this);
        this.parent.dialog = null;
        Entry.requestUpdate = true;
    }

    private createSpeakNotch(type: NotchType) {
        const notch = GEHelper.newGraphic();
        notch.type = type;
        const colorSet = EntryStatic.colorSet.canvas || {};
        const height = this.height + this.padding;
        const padding = this.padding;
        const width = this.width;
        if (type === 'ne') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(3, height)
                .lt(11, height)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(2, height)
                .lt(2, height + 9)
                .lt(12, height);
        } else if (type === 'nw') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(width - 3, height)
                .lt(width - 11, height)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(width - 2, height)
                .lt(width - 2, height + 9)
                .lt(width - 12, height);
        } else if (type === 'se') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(3, -padding)
                .lt(11, -padding)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(2, -padding)
                .lt(2, -padding - 9)
                .lt(12, -padding);
        } else if (type === 'sw') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(width - 3, -padding)
                .lt(width - 11, -padding)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(this.width - 2, -padding)
                .lt(width - 2, -padding - 9)
                .lt(width - 12, -padding);
        }
        return notch;
    }

    private createThinkkNotch(type: NotchType) {
        const notch = GEHelper.newGraphic();
        notch.type = type;
        const colorSet = EntryStatic.colorSet.canvas || {};
        const height = this.height + this.padding;
        const padding = this.padding;
        const width = this.width;
        if (type === 'ne') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(3, height)
                .lt(11, height)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(2, height)
                .qt(2, height + 9, 12, height)
                .de(2, height + 9, 5, 4);
        } else if (type === 'nw') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(width - 3, height)
                .lt(width - 11, height)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(width, height)
                .qt(width, height + 9, width - 12, height)
                .de(width - 3, height + 9, 5, 4);
        } else if (type === 'se') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(3, -padding)
                .lt(11, -padding)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(2, -padding)
                .qt(2, -padding - 9, 12, -padding)
                .de(0, -padding - 12, 5, 4);
        } else if (type === 'sw') {
            notch.graphics
                .f('#ffffff')
                .ss(3, 2)
                .s('#ffffff')
                .mt(width - 3, -padding)
                .lt(width - 11, -padding)
                .ss(2, 1, 1)
                .s(colorSet.dialog || '#4f80ff')
                .mt(this.width - 2, -padding)
                .qt(width - 2, -padding - 9, width - 12, -padding)
                .de(width - 6, -padding - 12, 5, 4);
        }
        return notch;
    }

    private drawZigZagLineX({ ctx, x1, y1, x2, y2, padding, zigzagSpacing, oneZigZagLength }: any) {
        let zx = 0;
        ctx.moveTo(x1 + padding, y1);
        for (let n = 0; zx < x2 - padding; n++) {
            zx = (n + 1) * zigzagSpacing + x1 + padding;
            const zy = (n % 2 == 0 ? -oneZigZagLength : oneZigZagLength) + y1;
            ctx.lineTo(zx, zy);
        }
        ctx.lineTo(x2 - padding, y2);
    }
    private drawZigZagLineY({ ctx, x1, y1, x2, y2, padding, zigzagSpacing, oneZigZagLength }: any) {
        let zy = 0;
        ctx.moveTo(x1, y1 + padding);
        for (let n = 0; zy < y2 - padding; n++) {
            zy = (n + 1) * zigzagSpacing + y1 + padding;
            const zx = (n % 2 !== 0 ? -oneZigZagLength : oneZigZagLength) + x1;
            ctx.lineTo(zx, zy);
        }
        ctx.lineTo(x2, y2 - padding);
    }
    private drawZigZagRect({ x, y, w, h, borderColor, fillColor }: any) {
        const rect = GEHelper.newGraphic();
        const zigzagSpacing = 3;
        const oneZigZagLength = 5;
        const ctx = rect.graphics;
        ctx.setStrokeStyle(1);
        ctx.beginStroke(borderColor);
        ctx.beginFill(fillColor);
        const padding = 10;
        this.drawZigZagLineX({
            ctx,
            x1: x,
            y1: y,
            x2: x + w,
            y2: y,
            padding,
            zigzagSpacing,
            oneZigZagLength,
        });
        ctx.lineTo(x + w, y + padding);
        this.drawZigZagLineY({
            ctx,
            x1: x + w,
            y1: y,
            x2: x + w,
            y2: y + h,
            padding,
            zigzagSpacing,
            oneZigZagLength,
        });
        ctx.lineTo(x + w - padding, y + h);
        this.drawZigZagLineX({
            ctx,
            x1: x,
            y1: y + h,
            x2: x + w,
            y2: y + h,
            padding,
            zigzagSpacing,
            oneZigZagLength,
        });
        ctx.moveTo(x + padding, y + h);
        ctx.lineTo(x, y + h - padding);
        this.drawZigZagLineY({
            ctx,
            x1: x,
            y1: y,
            x2: x,
            y2: y + h,
            padding,
            zigzagSpacing,
            oneZigZagLength,
        });
        ctx.moveTo(x + padding, y);
        ctx.lineTo(x, y + padding);
        return rect;
    }

    private drawYellStart({ x, y, w, h, fillColor, borderColor }: any) {
        const star = GEHelper.newGraphic();
        const pointSize = 0.2;
        const radius = Math.sqrt(w * w + h * h) / 2;
        const sides = 30;
        const angle = -90;
        star.graphics
            .f(fillColor)
            .ss(2, 'round')
            .s(borderColor)
            .drawPolyStar(x + radius / 2, y + radius / 2, radius, sides, pointSize, angle);
        return star;
    }

    private generateSpeak(mode: 'speak' | 'ask' | 'yell' | 'think') {
        this.object = GEHelper.newContainer('[dialog] container');
        const fontFamily = EntryStatic.fontFamily || 'NanumGothic';
        const text = GEHelper.textHelper.newText(
            this.message_,
            `15px ${fontFamily}`,
            '#000000',
            'top',
            'left'
        );

        let bound;
        if (GEHelper.isWebGL) {
            bound = text;
        } else {
            bound = text.getTransformedBounds();
        }

        const height = bound.height;
        const width = bound.width >= 10 ? bound.width : 17;
        const colorSet = EntryStatic.colorSet.canvas || {};
        if (mode === 'yell') {
            const rect = this.drawZigZagRect({
                x: -this.padding,
                y: -this.padding,
                w: width + 2 * this.padding,
                h: height + 2 * this.padding,
                fillColor: colorSet.dialogBG || '#ffffff',
                borderColor: colorSet.dialog || '#4f80ff',
            });
            this.object.addChild(rect);
        } else {
            const rect = GEHelper.newGraphic();
            rect.graphics
                .f(colorSet.dialogBG || '#ffffff')
                .ss(2, 'round')
                .s(colorSet.dialog || '#4f80ff')
                .rr(
                    -this.padding,
                    -this.padding,
                    width + 2 * this.padding,
                    height + 2 * this.padding,
                    this.padding
                );
            this.object.addChild(rect);
        }
        this.object.regX = width / 2;
        this.object.regY = height / 2;
        this.width = width;
        this.height = height;
        if (mode === 'think') {
            this.notch = this.createThinkkNotch('nw');
            this.object.addChild(this.notch);
        } else if (mode === 'speak' || mode === 'ask') {
            this.notch = this.createSpeakNotch('nw');
            this.object.addChild(this.notch);
        }
        this.update();
        this.object.addChild(text);
        Entry.requestUpdate = true;
    }
}

export default EntryDialog;
Entry.Dialog = EntryDialog;
