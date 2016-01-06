/**
 * @fileoverview PropertyPanel shows project's property
 */
'use strict';

goog.provide("Entry.PropertyPanel");

Entry.PropertyPanel = function() {
    this.modes = {};
};

(function(p) {
    /**
     * Generate View
     */
    p.generateView = function(parentDom, option) {
        this._view = Entry.Dom("div", {
            class: "propertyPanel",
            parent: $(parentDom)
        });

        this._tabView = Entry.Dom("div", {
            class: "propertyTab",
            parent: this._view
        });

        this._contentView = Entry.Dom("div", {
            class: "propertyContent",
            parent: this._view
        })
    };

    p.addMode = function(mode, contentDom) {
        contentDom = Entry.Dom(contentDom, {
            parent: this._contentView
        });
        var tabDom = Entry.Dom('<div>' + mode +'</div>', {
            classes: ["propertyTabElement", "propertyTab" + mode],
            parent: this._tabView
        });
        var that = this;
        tabDom.bindOnClick(function() {
            that.select(mode);
        });
        if (this.modes[mode]) {
            this.modes[mode].tabDom.remove();
            this.modes[mode].contentDom.remove();
        }
        this.modes[mode] = {
            tabDom: tabDom,
            contentDom: contentDom
        };
    };

    p.resize = function(canvasSize) {
        var canvasHeight = canvasSize*9/16;
        this._view.css({
            width: canvasSize + 'px',
            top: (canvasHeight + 35 + 40 + 48 - 22) + 'px'
        });
        if (canvasSize >= 430)
            this._view.removeClass("collapsed");
        else
            this._view.addClass("collapsed");
    };

    p.select = function(modeName) {
        for (var key in this.modes) {
            var mode = this.modes[key];
            mode.tabDom.removeClass("selected");
            mode.contentDom.addClass("entryHidden");
        }
        this.modes[modeName].tabDom.addClass("selected");
        this.modes[modeName].contentDom.removeClass("entryHidden");
    };
})(Entry.PropertyPanel.prototype)
