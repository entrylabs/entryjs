import { DisplayObject, Container } from 'pixi.js';

export function PIXIShortPropPlugin() {
    Object.defineProperties(DisplayObject.prototype, {
        scaleX: {
            get() {
                return this.scale.x;
            },
            set(v) {
                this.scale.x = v;
            },
        },
        scaleY: {
            get() {
                return this.scale.y;
            },
            set(v) {
                this.scale.y = v;
            },
        },
        regX: {
            get() {
                return this.pivot.x;
            },
            set(v) {
                this.pivot.x = v;
            },
        },
        regY: {
            get() {
                return this.pivot.y;
            },
            set(v) {
                this.pivot.y = v;
            },
        },
        mouseEnabled: {
            get() {
                return this.interactive;
            },
            set(v) {
                this.interactive = v;
            },
        },
    });

    Object.defineProperties(Container.prototype, {
        mouseChildren: {
            get() {
                return this.interactiveChildren;
            },
            set(v) {
                this.interactiveChildren = v;
            },
        },
    });
}
