/**
 * Resize handle on Easel.js
 */

'use strict';

import { GEDragHelper } from './GEDragHelper';
import { GEHelper } from './GEHelper';

export var GEHandle = function(canvas) {
    if (typeof createjs != 'object') {
        throw 'createjs is not founded';
    }
    const colorSet = EntryStatic.colorSet.canvas || {};
    this.canvas = canvas;
    this.borderColor = colorSet.handleBorder || '#e2e2e2';
    this.knobColor = colorSet.handleKnob || '#4f80ff';
    this.arrowColor = colorSet.handleArrow || '#ffb500';
    this.centerColor = colorSet.handleCenter || '#4f80ff';
    this.rotateKnobColor = colorSet.handleRotateKnob || '#ffb500';

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
};

(function(p) {
    p.setChangeListener = function(object, func) {
        this.onChangeFunction = func;
        this.callerObject = object;
        return this;
    };

    /**
     * for undo and redo
     */
    p.setEditStartListener = function(object, func) {
        this.onEditStartFunction = func;
        this.editStartCallerObject = object;
        return this;
    };

    p.setEditEndListener = function(object, func) {
        this.onEditEndFunction = func;
        this.editEndCallerObject = object;
        return this;
    };

    p.toggleCenter = function(isEnable) {
        this.centerEditable = isEnable;
        this.centerPoint.visible = isEnable;
    };

    p.toggleRotation = function(isEnable) {
        this.rotationEditable = isEnable;
        this.rotateKnob.visible = isEnable;
    };

    p.toggleDirection = function(isEnable) {
        this.directionEditable = isEnable;
        this.directionArrow.visible = isEnable;
    };

    p.toggleResize = function(isEnable) {
        this.resizeEditable = isEnable;
        for (let i = 0; i < 8; i++) {
            this.knobs[i].visible = isEnable;
        }
    };

    p.toggleFont = function(isEnable) {
        this.fontEditable = isEnable;
        this.fontKnob.visible = isEnable;
    };

    p.setX = function(xPos) {
        this.x = xPos;
        this.container.x = xPos;
        this.background.x = xPos;
    };

    p.setY = function(yPos) {
        this.y = yPos;
        this.container.y = yPos;
        this.background.y = yPos;
    };

    p.setWidth = function(width) {
        this.width = width;
        this.background.scaleX = width / 100;
    };

    p.setHeight = function(height) {
        this.height = height;
        this.background.scaleY = height / 100;
    };

    p.setRegX = function(regX) {
        this.regX = regX;
        this.centerPoint.x = regX;
    };

    p.setRegY = function(regY) {
        this.regY = regY;
        this.centerPoint.y = regY;
    };

    p.setRotation = function(rotation) {
        rotation = (rotation + 360) % 360;
        this.rotation = rotation;
        rotation *= GEHelper.rotateWrite;
        this.container.rotation = rotation;
        this.background.rotation = rotation;
        this.updateKnobCursor();
    };

    p.setDirection = function(direction) {
        direction = (direction + 360) % 360;
        this.direction = direction;
        this.directionArrow.rotation = direction * GEHelper.rotateWrite;
    };

    p.setVisible = function(visible) {
        this.visible = visible;
        this.container.visible = visible;
        this.background.visible = visible;
    };

    p.setFont = function(fontSize) {
        this.font = fontSize;
        this.fontKnob.y = fontSize - this.height / 2;
    };

    p.createHandle = function() {
        const handle = this;
        const container = GEHelper.newContainer();
        container.mouseEnabled = true;
        container.mouseChildren = true;

        //border
        const border = GEHelper.newGraphic();
        container.addChild(border);
        this.border = border;

        //edge
        const edge = GEHelper.newGraphic();
        edge.cursor = 'move';
        edge.mouseEnabled = true;
        GEDragHelper.handleDrag(edge);

        edge.on(GEDragHelper.types.DOWN, function(e) {
            const offset = handle.getEventCoordinate(e);
            offset.x -= handle.x;
            offset.y -= handle.y;
            this.offset = offset;
            handle.dispatchEditStartEvent();
        });
        edge.on(GEDragHelper.types.MOVE, function(e) {
            if (handle.getDraggable()) {
                const pos = handle.getEventCoordinate(e);
                pos.x -= this.offset.x;
                pos.y -= this.offset.y;
                handle.setX(pos.x);
                handle.setY(pos.y);
                handle.dispatchOnChangeEvent();
            }
        });
        edge.on(GEDragHelper.types.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(edge);
        this.edge = edge;

        //rotate knob
        const rotateKnob = GEHelper.newGraphic();
        rotateKnob.scaleX = 1.52;
        rotateKnob.scaleY = 1.52;
        rotateKnob.mouseEnabled = true;
        GEDragHelper.handleDrag(rotateKnob);
        rotateKnob.cursor = 'crosshair';
        rotateKnob.on(GEDragHelper.types.DOWN, (e) => {
            handle.dispatchEditStartEvent();
        });
        rotateKnob.on(GEDragHelper.types.MOVE, (e) => {
            const pos = handle.getEventCoordinate(e);
            pos.x -= handle.x;
            pos.y -= handle.y;
            const rotation = (-Math.atan2(pos.x, pos.y) / Math.PI) * 180 - 180;
            handle.setRotation(rotation);
            handle.dispatchOnChangeEvent();
        });
        rotateKnob.on(GEDragHelper.types.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(rotateKnob);
        container.setChildIndex(rotateKnob, 1);
        this.rotateKnob = rotateKnob;

        const directionArrow = GEHelper.newGraphic();
        directionArrow.mouseEnabled = true;
        GEDragHelper.handleDrag(directionArrow);

        if (GEHelper.isWebGL) {
            const arrowLength = 7; // 이 값이 작아질수록 길어집니다
            directionArrow.graphics
                .f(this.arrowColor)
                .mt(0, -40 + arrowLength)
                .lt(9, -30 + arrowLength)
                .lt(-9, -30 + arrowLength)
                .closePath()
                .dr(-2, -32 + arrowLength, 4, 25);
        } else {
            const arrowLength = 7;
            directionArrow.graphics
                .ss(4, 1, 1)
                .s(this.arrowColor)
                .f(this.arrowColor)
                .dc(0, 0, this.DHANDLE_RADIUS)
                .mt(0, 0)
                .lt(0, -40 + arrowLength)
                .lt(7, -32 + arrowLength)
                .lt(-7, -32 + arrowLength)
                .lt(0, -40 + arrowLength)
                .es();
        }

        directionArrow.on(GEDragHelper.types.DOWN, (e) => {
            handle.dispatchEditStartEvent();
        });
        directionArrow.on(GEDragHelper.types.MOVE, (e) => {
            const pos = handle.getLocalCoordinate(handle.getEventCoordinate(e));
            const rotation = (-Math.atan2(pos.x, pos.y) / Math.PI) * 180 - 180;
            handle.setDirection(rotation);
            handle.dispatchOnChangeEvent();
        });
        directionArrow.on(GEDragHelper.types.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(directionArrow);
        container.setChildIndex(directionArrow, 0);
        this.directionArrow = directionArrow;

        // center
        const centerPoint = GEHelper.newGraphic();
        centerPoint.mouseEnabled = true;
        GEDragHelper.handleDrag(centerPoint);
        centerPoint.scaleX = 1.52;
        centerPoint.scaleY = 1.52;
        centerPoint.graphics
            .ss(3.5, 2, 0)
            .s('#FFFFFF')
            .beginFill(this.centerColor)
            .dc(0, 0, 5.5);
        centerPoint.on(GEDragHelper.types.DOWN, (e) => {
            handle.dispatchEditStartEvent();
        });
        centerPoint.on(GEDragHelper.types.MOVE, (e) => {
            let pos = handle.getEventCoordinate(e);
            pos = handle.getLocalCoordinate(pos);
            handle.setRegX(pos.x);
            handle.setRegY(pos.y);
            handle.dispatchOnChangeEvent();
        });
        centerPoint.on(GEDragHelper.types.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        container.addChild(centerPoint);
        this.centerPoint = centerPoint;

        //resize knobs
        this.knobs = [];
        for (let i = 0; i < 8; i++) {
            const knob = GEHelper.newGraphic();
            knob.mouseEnabled = true;
            GEDragHelper.handleDrag(knob);
            knob.scaleX = 1.52;
            knob.scaleY = 1.52;
            knob.graphics
                .ss(0.2, 0, 0)
                .s('#d8d8d8')
                .beginFill('#ffffff')
                .rr(-6, -6, 12, 12, 1)
                .beginFill(this.knobColor)
                .rr(-3.4, -3.4, 7, 7, 1);
            knob.knobIndex = i;
            //knob.cursor = "move";

            knob.on(GEDragHelper.types.DOWN, function(e) {
                const otherKnobIndex =
                    this.knobIndex + 4 > 7 ? this.knobIndex + 4 - 8 : this.knobIndex + 4;
                const otherKnob = handle.knobs[otherKnobIndex];
                const otherKnobPos = handle.getGlobalCoordinate(otherKnob);
                this.otherKnobPos = otherKnobPos;
                handle.dispatchEditStartEvent();
            });
            knob.on(GEDragHelper.types.MOVE, function(e) {
                const pos = handle.getEventCoordinate(e);
                if (handle.checkCenterPointState(handle.regX, handle.regY)) {
                    handle.setRegX(0);
                    handle.setRegY(0);
                    handle.dispatchOnChangeEvent();
                }
                handle.adjust(this.knobIndex, this.otherKnobPos, pos);
            });
            knob.on(GEDragHelper.types.UP, (e) => {
                handle.dispatchEditEndEvent();
            });
            container.addChild(knob);
            this.knobs.push(knob);
        }

        const background = GEHelper.newGraphic();
        background.mouseEnabled = true;
        GEDragHelper.handleDrag(background);
        background.graphics
            .ss(1, 2, 0)
            .s('rgba(254,254,254,0.01)')
            .beginFill('rgba(254,254,254,1)')
            .dr(-50, -50, 100, 100);
        background.on(GEDragHelper.types.DOWN, function(e) {
            const offset = handle.getEventCoordinate(e);
            offset.x -= handle.x;
            offset.y -= handle.y;
            this.offset = offset;
            handle.dispatchEditStartEvent();
        });
        background.on(GEDragHelper.types.MOVE, function(e) {
            if (handle.getDraggable()) {
                const pos = handle.getEventCoordinate(e);
                pos.x -= this.offset.x;
                pos.y -= this.offset.y;
                handle.setX(pos.x);
                handle.setY(pos.y);
                handle.dispatchOnChangeEvent();
            }
        });
        background.on(GEDragHelper.types.UP, (e) => {
            handle.dispatchEditEndEvent();
        });
        this.canvas.addChildAt(background, 0);
        this.background = background;

        this.container = container;
        this.canvas.addChild(this.container);
    };

    p.checkCenterPointState = function(x, y) {
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
    };

    p.render = function() {
        this.renderBorder();
        this.renderEdge();
        this.renderRotateKnob();
        this.renderKnobs();
    };

    p.renderEdge = function() {
        const width = this.width;
        const height = this.height;
        const t = 10; //thickness
        const sx = -(width + t) / 2; //startX
        const sy = -(height + t) / 2; //startY

        this.edge.graphics
            .clear()
            .f('rgba(254,254,254,0.01)')
            .dr(sx, sy, width + t, t)
            .dr(sx, sy + height, width + t, t)
            .dr(sx, sy + t, t, height - t)
            .dr(sx + width, sy + t, t, height - t);
    };

    p.renderRotateKnob = function() {
        const width = this.width;
        const height = this.height;
        this.rotateKnob.graphics
            .clear()
            .ss(0.5, 2, 0)
            .s('#d8d8d8')
            .mt(0, -height / 2)
            .lt(0, -height / 2)
            .lt(0, -height / 2 + 20)
            .cp()
            .beginFill(this.rotateKnobColor)
            .dc(0, -height / 2, 8)
            .beginFill('#ffffff')
            .dc(0, -height / 2, 4);
    };

    p.renderBorder = function() {
        const width = this.width;
        const height = this.height;
        this.border.graphics
            .clear()
            .ss(0.5, 2, 0)
            .s(this.borderColor)
            .mt(-width / 2, -height / 2)
            .lt(0, -height / 2)
            .lt(0, -height / 2)
            .lt(+width / 2, -height / 2)
            .lt(+width / 2, +height / 2)
            .lt(-width / 2, +height / 2)
            .cp();
    };

    p.renderKnobs = function() {
        const width = this.width / 2;
        const height = this.height / 2;
        this.knobs.forEach((knob, i) => {
            knob.x = Math.round(Math.sin((i / 4) * Math.PI)) * width;
            knob.y = Math.round(Math.cos((i / 4) * Math.PI)) * height;
        });
    };

    p.getEventCoordinate = function(e) {
        return {
            x: e.stageX * 0.75 - 240,
            y: e.stageY * 0.75 - 135,
        };
    };

    p.getGlobalCoordinate = function(childObject) {
        const container = this.container;
        const rotation = -(((this.container.rotation * Math.PI) / 180) * GEHelper.rotateRead);
        return {
            x: this.x + childObject.x * Math.cos(rotation) + childObject.y * Math.sin(rotation),
            y: this.y + childObject.y * Math.cos(rotation) - childObject.x * Math.sin(rotation),
        };
    };

    p.getLocalCoordinate = function(pos) {
        const container = this.container;
        const rotation = ((this.container.rotation * Math.PI) / 180) * GEHelper.rotateRead;
        pos.x -= this.x;
        pos.y -= this.y;
        return {
            x: pos.x * Math.cos(rotation) + pos.y * Math.sin(rotation),
            y: pos.y * Math.cos(rotation) - pos.x * Math.sin(rotation),
        };
    };

    p.adjust = function(knobIndex, otherKnobPos, pos) {
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
    };

    p.updateKnobCursor = function() {
        const rotation = this.rotation * GEHelper.rotateRead;
        const cursorList = ['ns-resize', 'nwse-resize', 'ew-resize', 'nesw-resize'];
        const iter = Math.round(rotation / 45);
        for (var i = 0; i < iter; i++) {
            cursorList.unshift(cursorList.pop());
        }
        for (var i = 0; i < 8; i++) {
            this.knobs[i].cursor = cursorList[i % 4];
        }
    };

    p.calcPos = function(pos1, pos2, targetPos) {
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
    };

    p.dispatchOnChangeEvent = function() {
        if (this.onChangeFunction) {
            this.onChangeFunction.call(this.callerObject, this);
        }
    };

    p.dispatchEditStartEvent = function() {
        if (this.onEditStartFunction) {
            this.onEditStartFunction.call(this.editStartCallerObject, this);
        }
    };

    p.dispatchEditEndEvent = function() {
        if (this.onEditEndFunction) {
            this.onEditEndFunction.call(this.editEndCallerObject, this);
        }
    };

    p.setDraggable = function(bool) {
        this.draggable = bool;
    };

    p.getDraggable = function() {
        return this.draggable;
    };
})(GEHandle.prototype);
