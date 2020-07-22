/**
 * Resize handle on PIXI.js
 */

'use strict';

import { PIXIHandleEdge } from './PIXIHandleEdge';
import { PIXIDragHelper } from '../helper/PIXIDragHelper';
import { PIXIGlobal } from '../init/PIXIGlobal';

export class PIXIHandle {
    constructor(canvas) {
        if (typeof PIXI != 'object') {
            throw 'PIXI is not founded';
        }

        this.canvas = canvas;
        this._baseAsset = PIXIGlobal.baseAsset;
        this.color = '#c1c7cd';
        //this.color = "#6BD5FF";
        this.arrowColor = '#E79040';
        this.centerColor = '#93440F';
        this.rotateKnobColor = '#6B6B6B';

        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.direction = 0;
        this.width = 100;
        this.height = 100;
        this.flipX = false;
        this.flipY = false;
        this.visible = false;
        this.draggable = true;

        this.centerEditable = true;
        this.rotationEditable = true;
        this.directionEditable = true;
        this.resizeEnable = true;

        this.onChangeFunction = null;
        this.callerObject = null;

        this.createHandle();
        this.render();
        this.selectedObject = null;
    }

    setChangeListener(object, func) {
        this.onChangeFunction = func;
        this.callerObject = object;
        return this;
    }

    /**
     * for undo and redo
     */
    setEditStartListener(object, func) {
        this.onEditStartFunction = func;
        this.editStartCallerObject = object;
        return this;
    }

    setEditEndListener(object, func) {
        this.onEditEndFunction = func;
        this.editEndCallerObject = object;
        return this;
    }

    toggleCenter(isEnable) {
        this.centerEditable = isEnable;
        this.centerPoint.visible = isEnable;
    }

    toggleRotation(isEnable) {
        this.rotationEditable = isEnable;
        this.rotateKnob.visible = isEnable;
    }

    toggleDirection(isEnable) {
        this.directionEditable = isEnable;
        this.directionArrow.visible = isEnable;
    }

    toggleResize(isEnable) {
        this.resizeEditable = isEnable;
        for (let i = 0; i < 8; i++) {
            this.knobs[i].visible = isEnable;
        }
    }

    toggleFont(isEnable) {
        this.fontEditable = isEnable;
        this.fontKnob.visible = isEnable;
    }

    setX(xPos) {
        this.x = xPos;
        this.container.x = xPos;
        this.background.x = xPos;
    }

    setY(yPos) {
        this.y = yPos;
        this.container.y = yPos;
        this.background.y = yPos;
    }

    setWidth(width) {
        this.width = width;
        this.background.width = width;
    }

    setHeight(height) {
        this.height = height;
        this.background.height = height;
    }

    setRegX(regX) {
        this.regX = regX;
        this.centerPoint.x = regX;
    }

    setRegY(regY) {
        this.regY = regY;
        this.centerPoint.y = regY;
    }

    setRotation(rotation) {
        rotation = (rotation + 360) % 360;
        this.rotation = rotation;
        const rad = (rotation * Math.PI) / 180;
        this.container.rotation = rad;
        this.background.rotation = rad;
        this.updateKnobCursor();
    }

    setDirection(direction) {
        direction = (direction + 360) % 360;
        this.direction = direction;
        this.directionArrow.rotation = (direction * Math.PI) / 180;
    }

    setVisible(visible) {
        this.visible = visible;
        this.container.visible = visible;
        this.background.visible = visible;
    }

    setFont(fontSize) {
        this.font = fontSize;
        this.fontKnob.y = fontSize - this.height / 2;
    }

    createHandle() {
        const handle = this;
        const BASE_ASSET = this._baseAsset;
        const container = new PIXI.Container();

        //border
        const border = new PIXI.Graphics();
        container.addChild(border);
        this.border = border;

        //edge
        const edge = new PIXIHandleEdge(BASE_ASSET);
        edge.interactive = true;
        edge.cursor = 'move';
        edge.on(PIXIDragHelper.DOWN, function(e) {
            PIXIDragHelper.handleDrag(edge);
            const offset = handle.getEventCoordinate(e);
            offset.x -= handle.x;
            offset.y -= handle.y;
            this.offset = offset;
            handle.dispatchEditStartEvent();
        });
        edge.on(PIXIDragHelper.MOVE, function(e) {
            if (handle.getDraggable()) {
                const pos = handle.getEventCoordinate(e);
                pos.x -= this.offset.x;
                pos.y -= this.offset.y;
                handle.setX(pos.x);
                handle.setY(pos.y);
                handle.dispatchOnChangeEvent();
            }
        });
        edge.on(PIXIDragHelper.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(edge);
        this.edge = edge;

        //rotate knob
        const rotateKnob = BASE_ASSET.newSprite('handle/rotateKnob');
        rotateKnob.anchor.set(0.5, 1);
        rotateKnob.interactive = true;
        rotateKnob.cursor = 'crosshair';
        rotateKnob.on(PIXIDragHelper.DOWN, (e) => {
            PIXIDragHelper.handleDrag(rotateKnob);
            handle.dispatchEditStartEvent();
        });
        rotateKnob.on(PIXIDragHelper.MOVE, (e) => {
            const pos = handle.getEventCoordinate(e);
            pos.x -= handle.x;
            pos.y -= handle.y;
            const rotation = (-Math.atan2(pos.x, pos.y) / Math.PI) * 180 - 180;
            handle.setRotation(rotation);
            handle.dispatchOnChangeEvent();
        });
        rotateKnob.on(PIXIDragHelper.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(rotateKnob);
        container.setChildIndex(rotateKnob, 1);
        this.rotateKnob = rotateKnob;

        const directionArrow = BASE_ASSET.newSprite('handle/arrow');
        directionArrow.interactive = true;
        directionArrow.pivot.set(9, 42);

        directionArrow.on(PIXIDragHelper.DOWN, (e) => {
            PIXIDragHelper.handleDrag(directionArrow);
            handle.dispatchEditStartEvent();
        });
        directionArrow.on(PIXIDragHelper.MOVE, (e) => {
            const pos = handle.getLocalCoordinate(handle.getEventCoordinate(e));
            const rotation = (-Math.atan2(pos.x, pos.y) / Math.PI) * 180 - 180;
            handle.setDirection(rotation);
            handle.dispatchOnChangeEvent();
        });
        directionArrow.on(PIXIDragHelper.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(directionArrow);
        container.setChildIndex(directionArrow, 0);
        this.directionArrow = directionArrow;

        const centerPoint = BASE_ASSET.newSprite('handle/centerPoint');
        centerPoint.interactive = true;
        centerPoint.anchor.set(0.5, 0.5);

        centerPoint.on(PIXIDragHelper.DOWN, (e) => {
            PIXIDragHelper.handleDrag(centerPoint);
            handle.dispatchEditStartEvent();
        });
        centerPoint.on(PIXIDragHelper.MOVE, (e) => {
            let pos = handle.getEventCoordinate(e);
            pos = handle.getLocalCoordinate(pos);
            handle.setRegX(pos.x);
            handle.setRegY(pos.y);
            handle.dispatchOnChangeEvent();
        });
        centerPoint.on(PIXIDragHelper.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(centerPoint);
        this.centerPoint = centerPoint;

        //resize knobs
        this.knobs = [];
        for (let i = 0; i < 8; i++) {
            const knob = BASE_ASSET.newSprite('handle/knob');
            knob.pivot.set(4, 4);
            knob.interactive = true;
            knob.knobIndex = i;
            knob.on(PIXIDragHelper.DOWN, function(e) {
                const targetKnob = e.currentTarget;
                PIXIDragHelper.handleDrag(targetKnob);
                const otherKnobIndex =
                    this.knobIndex + 4 > 7 ? this.knobIndex + 4 - 8 : this.knobIndex + 4;
                const otherKnob = handle.knobs[otherKnobIndex];
                const otherKnobPos = handle.getGlobalCoordinate(otherKnob);
                this.otherKnobPos = otherKnobPos;
                handle.dispatchEditStartEvent();
            });
            knob.on(PIXIDragHelper.MOVE, function(e) {
                const pos = handle.getEventCoordinate(e);
                if (handle.checkCenterPointState(handle.regX, handle.regY)) {
                    handle.setRegX(0);
                    handle.setRegY(0);
                    handle.dispatchOnChangeEvent();
                }
                handle.adjust(this.knobIndex, this.otherKnobPos, pos);
            });
            knob.on(PIXIDragHelper.UP, (e) => {
                handle.dispatchEditEndEvent();
            });
            container.addChild(knob);
            this.knobs.push(knob);
        }

        const background = BASE_ASSET.newSprite('handle/bg');
        background.interactive = true;
        background.anchor.set(0.5, 0.5);

        background.on(PIXIDragHelper.DOWN, function(e) {
            PIXIDragHelper.handleDrag(background);
            const offset = handle.getEventCoordinate(e);
            offset.x -= handle.x;
            offset.y -= handle.y;
            this.offset = offset;
            handle.dispatchEditStartEvent();
        });
        background.on(PIXIDragHelper.MOVE, function(e) {
            if (handle.getDraggable()) {
                const pos = handle.getEventCoordinate(e);
                pos.x -= this.offset.x;
                pos.y -= this.offset.y;
                handle.setX(pos.x);
                handle.setY(pos.y);
                handle.dispatchOnChangeEvent();
            }
        });
        background.on(PIXIDragHelper.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        this.canvas.addChildAt(background, 0);
        this.background = background;

        this.container = container;
        this.canvas.addChild(this.container);
    }

    checkCenterPointState(x, y) {
        const standard = 718;
        const res = Math.sqrt(x * x + y * y);
        if (res > standard && Entry.engine.isState('stop')) {
            Entry.toast.warning(
                Lang.Workspace.toast_error_title_object_center,
                Lang.Workspace.toast_error_contents_object_center
            );
            return true;
        }
        return false;
    }

    render() {
        this.renderBorder();
        this.renderEdge();
        this.renderRotateKnob();
        this.renderKnobs();
    }

    renderEdge() {
        this.edge.renderEdge(this.width, this.height);
    }

    renderRotateKnob() {
        this.rotateKnob.y = -this.height / 2;
    }

    /**
     * @deprecated 2018.09.19 박준배.
     * graphics 에서 texture 로 변경하면서 border와 edge 를 합쳐버림.
     * 그래서 보더가 필요 없음.
     * 함수가 public naming 이라서 삭제를 못하겠음.
     */
    renderBorder() {}

    renderKnobs() {
        const width = this.width / 2;
        const height = this.height / 2;
        this.knobs.forEach((knob, i) => {
            knob.x = Math.round(Math.sin((i / 4) * Math.PI)) * width;
            knob.y = Math.round(Math.cos((i / 4) * Math.PI)) * height;
        });
    }

    getEventCoordinate(e) {
        const g = e.data.global;
        return {
            x: g.x * 0.75 - 240,
            y: g.y * 0.75 - 135,
        };
    }

    getGlobalCoordinate(childObject) {
        const rotation = -this.container.rotation;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return {
            x: this.x + childObject.x * cos + childObject.y * sin,
            y: this.y + childObject.y * cos - childObject.x * sin,
        };
    }

    getLocalCoordinate(pos) {
        const rotation = this.container.rotation;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        pos.x -= this.x;
        pos.y -= this.y;
        return {
            x: pos.x * cos + pos.y * sin,
            y: pos.y * cos - pos.x * sin,
        };
    }

    adjust(knobIndex, otherKnobPos, pos) {
        const newPoint = this.calcPos({ x: this.x, y: this.y }, otherKnobPos, pos);
        const newCenter = {
            x: (otherKnobPos.x + newPoint.x) / 2,
            y: (otherKnobPos.y + newPoint.y) / 2,
        };
        const newLength = Math.sqrt(
            Math.pow(newPoint.x - otherKnobPos.x, 2) + Math.pow(newPoint.y - otherKnobPos.y, 2)
        );
        if (knobIndex % 4 == 0) {
            var ratio = newLength / this.height;
            this.height = newLength;
            this.setRegY(this.regY * ratio);
        } else if (knobIndex % 4 == 2) {
            var ratio = newLength / this.width;
            this.width = newLength;
            this.setRegX(this.regX * ratio);
        } else {
            const oldLength =
                2 *
                Math.sqrt(
                    Math.pow(this.x - otherKnobPos.x, 2) + Math.pow(this.y - otherKnobPos.y, 2)
                );
            const newWidth = (this.width * newLength) / oldLength;
            var ratio = newWidth / this.width;
            this.setWidth(newWidth);
            this.setRegX(this.regX * ratio);
            const newHeight = (this.height * newLength) / oldLength;
            ratio = newHeight / this.height;
            this.setHeight((this.height * newLength) / oldLength);
            this.setRegY(this.regY * ratio);
        }
        this.setX(newCenter.x);
        this.setY(newCenter.y);

        this.render();
        this.dispatchOnChangeEvent();
    }

    updateKnobCursor() {
        const rotation = this.rotation;
        const cursorList = ['ns-resize', 'nwse-resize', 'ew-resize', 'nesw-resize'];
        const iter = Math.round(rotation / 45);
        for (var i = 0; i < iter; i++) {
            cursorList.unshift(cursorList.pop());
        }
        for (var i = 0; i < 8; i++) {
            this.knobs[i].cursor = cursorList[i % 4];
        }
    }

    calcPos(pos1, pos2, targetPos) {
        if (pos1.x == pos2.x) {
            return {
                x: pos1.x,
                y: targetPos.y,
            };
        } else if (pos1.y == pos2.y) {
            return {
                x: targetPos.x,
                y: pos1.y,
            };
        } else {
            const a = pos1.y - pos2.y;
            const b = pos2.x - pos1.x;
            const c = pos1.x * pos2.y - pos2.x * pos1.y;
            const k = -(a * targetPos.x + b * targetPos.y + c) / (a * a + b * b);
            return {
                x: targetPos.x + a * k,
                y: targetPos.y + b * k,
            };
        }
    }

    dispatchOnChangeEvent() {
        if (this.onChangeFunction) {
            this.onChangeFunction.call(this.callerObject, this);
        }
    }

    dispatchEditStartEvent() {
        if (this.onEditStartFunction) {
            this.onEditStartFunction.call(this.editStartCallerObject, this);
        }
    }

    dispatchEditEndEvent() {
        if (this.onEditEndFunction) {
            this.onEditEndFunction.call(this.editEndCallerObject, this);
        }
    }

    setDraggable(bool) {
        this.draggable = bool;
    }

    getDraggable() {
        return this.draggable;
    }

    destroy() {
        this.onChangeFunction = null;
        this.callerObject = null;
        this.onEditStartFunction = null;
        this.editStartCallerObject = null;
        this.onEditEndFunction = null;
        this.editEndCallerObject = null;
    }
}
