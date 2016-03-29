/**
 * @fileoverview PropertyPanel shows project's property
 */
'use strict';

goog.provide("Entry.PropertyPanel");

Entry.PropertyPanel = function() {
    this.modes = {};
    this.selected = null;
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
        });

        var selectedImgView = Entry.createElement('div');
        selectedImgView.addClass('entryObjectSelectedImgWorkspace');
        this.selectedImgView_ = selectedImgView;
        this._view.append(selectedImgView);
        this.initializeSplitter(selectedImgView);
        this.splitter = selectedImgView;
    };

    p.addMode = function(mode, contentObj) {

        var contentDom = contentObj.getView();
        // will be removed after apply new Dom class
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
            obj: contentObj,
            tabDom: tabDom,
            contentDom: contentDom
        };
        console.log("123123213123123123232njknfdjkasnjfk");
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

        console.log(this.modes);
        Entry.dispatchEvent('windowResized');
        // if(this.selected == 'hw' && this.modes.hw.obj.listPorts)
        //     this.modes[this.selected].obj.resizeList();
        // else 
        //     this.modes[this.selected].obj.resize();
    
    };

    p.select = function(modeName) {
        console.log(modeName);
        for (var key in this.modes) {
            var mode = this.modes[key];
            mode.tabDom.removeClass("selected");
            mode.contentDom.addClass("entryHidden");
        }
        var selected = this.modes[modeName];
        selected.tabDom.addClass("selected");
        selected.contentDom.removeClass("entryHidden");
        console.log(123321);
        console.log(selected);
        selected.obj.resize();
        this.selected = modeName;
    };

    p.initializeSplitter = function(splitter) {
        splitter.onmousedown = function(e) {
            Entry.container.disableSort();
            Entry.container.splitterEnable = true;
        };
        document.addEventListener('mousemove', function(e) {
            if (Entry.container.splitterEnable) {
                Entry.resizeElement({canvasWidth: e.x || e.clientX});
            }
        });
        document.addEventListener('mouseup', function(e) {
            Entry.container.splitterEnable = false;
            Entry.container.enableSort();
        });
    };
})(Entry.PropertyPanel.prototype)
