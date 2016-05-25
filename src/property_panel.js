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

        var tabDom = Entry.Dom('<div>' +Lang.Menus[mode] +'</div>', {
            classes: ["propertyTabElement", "propertyTab" + mode],
            parent: this._tabView
        });
        var that = this;
        tabDom.bind('click',function() {
            that.select(mode);
        });

        if (this.modes[mode]) {
            this.modes[mode].tabDom.remove();
            this.modes[mode].contentDom.remove();
            if(mode == 'hw'){
                $(this.modes).removeClass('.propertyTabhw');
                $('.propertyTabhw').unbind('dblclick');
            }
        }


        this.modes[mode] = {
            obj: contentObj,
            tabDom: tabDom,
            contentDom: contentDom
        };

        if(mode == 'hw') {
            $('.propertyTabhw').bind('dblclick',(function(){
                Entry.dispatchEvent('hwModeChange');
            }));
        }
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

        Entry.dispatchEvent('windowResized');

        var modeResize  = this.modes[this.selected].obj.resize;
        if(modeResize && this.selected != 'hw')
            modeResize();
        else if(this.selected == 'hw' && this.modes.hw.obj.listPorts)
             this.modes[this.selected].obj.resizeList();
         else if(this.selected == 'hw')
            this.modes[this.selected].obj.resize();

    };

    p.select = function(modeName) {
        for (var key in this.modes) {
            var mode = this.modes[key];
            mode.tabDom.removeClass("selected");
            mode.contentDom.addClass("entryRemove");
            mode.obj.visible = false;
        }
        var selected = this.modes[modeName];
        selected.tabDom.addClass("selected");
        selected.contentDom.removeClass("entryRemove");
        if(selected.obj.resize)
            selected.obj.resize();
        selected.obj.visible = true;
        this.selected = modeName;
    };

    p.initializeSplitter = function(splitter) {
        splitter.onmousedown = function(e) {
            Entry.container.disableSort();
            Entry.container.splitterEnable = true;
            if (Entry.documentMousemove) {
                Entry.container.resizeEvent = Entry.documentMousemove.attach(this, function(e) {
                    if (Entry.container.splitterEnable) {
                        Entry.resizeElement({
                            canvasWidth: e.clientX || e.x
                        });
                    }
                });
            }
        };

        document.addEventListener('mouseup', function(e) {
            var listener = Entry.container.resizeEvent
            if (listener) {
                Entry.container.splitterEnable = false;
                Entry.documentMousemove.detach(listener);
                delete Entry.container.resizeEvent;
            }
            Entry.container.enableSort();
        });
    };
})(Entry.PropertyPanel.prototype);
