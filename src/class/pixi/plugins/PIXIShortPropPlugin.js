export function PIXIShortPropPlugin() {

    Object.defineProperties(PIXI.DisplayObject.prototype, {
        scaleX: {
            get: function(){ return this.scale.x; },
            set: function(v){ this.scale.x = v; },
        },
        scaleY: {
            get: function() { return this.scale.y; },
            set: function(v) { this.scale.y = v; },
        },
        regX: {
            get: function() { return this.pivot.x; },
            set: function(v) { this.pivot.x = v; },
        },
        regY: {
            get: function() { return this.pivot.y; },
            set: function(v) { this.pivot.y = v; },
        },
        mouseEnabled: {
            get: function() { return this.interactive; },
            set: function(v) { this.interactive = v; }
        },
    });

    Object.defineProperties(PIXI.Container.prototype, {
        mouseChildren: {
            get: function() { return this.interactiveChildren; },
            set: function(v) { this.interactiveChildren = v; }
        }
    });
}
