class PropertyPanel {
    constructor() {
        this.modes = {};
        this.selected = null;
    }

    generateView(parentDom) {
        const container = $(parentDom);
        this._view = Entry.Dom('div', {
            class: 'propertyPanel',
            parent: container,
        });

        this._tabView = Entry.Dom('div', {
            class: 'propertyTab',
            parent: this._view,
        });

        this._contentView = Entry.Dom('div', {
            class: 'propertyContent',
            parent: this._view,
        });

        this._cover = Entry.Dom('div', {
            classes: ['propertyPanelCover', 'entryRemove'],
            parent: this._view,
        });

        const splitter = Entry.Dom('div', {
            class: 'entryObjectSelectedImgWorkspace',
            parent: container,
        });
        this.initializeSplitter(splitter);
    }

    addMode(mode, contentObj) {
        if (this.modes[mode]) {
            this.removeMode(mode);
        }

        let contentDom = contentObj.getView();
        // will be removed after apply new Dom class
        contentDom = Entry.Dom(contentDom, {
            parent: this._contentView,
        });

        const tabDom = Entry.Dom(`<div>${Lang.Menus[mode]}</div>`, {
            classes: ['propertyTabElement', `propertyTab${mode}`],
            parent: this._tabView,
        });
        tabDom.bind('click', () => {
            this.select(mode);
        });

        if (mode === 'console') {
            contentObj.codeMirror.refresh();
        }

        this._removeDom(mode);

        this.modes[mode] = {
            obj: contentObj,
            tabDom,
            contentDom,
        };

        if (mode === 'hw') {
            $('.propertyTabhw').bind('dblclick', () => {
                Entry.dispatchEvent('hwModeChange');
            });
        }
    }

    removeMode(mode) {
        this._removeDom(mode);

        const keys = Object.keys(this.modes);
        if (keys && keys.length > 0) {
            this.select(keys[0]);
        }
    }

    resize(canvasSize) {
        const selected = this.selected;
        if (!selected) {
            return;
        }
        const canvasHeight = (canvasSize * 9) / 16;
        this._view.css({
            width: `${canvasSize}px`,
            top: `${canvasHeight + 35 + 40 + 48 - 22}px`,
        });
        if (canvasSize >= 430) {
            this._view.removeClass('collapsed');
        } else {
            this._view.addClass('collapsed');
        }

        Entry.dispatchEvent('windowResized');

        const obj = this.modes[selected].obj;
        if (selected === 'hw') {
            if (this.modes.hw.obj.listPorts) {
                obj.resizeList();
            } else {
                obj.resize && obj.resize();
            }
        } else {
            obj.resize && obj.resize();
        }
    }

    select(modeName) {
        for (const key in this.modes) {
            const mode = this.modes[key];
            mode.tabDom.removeClass('selected');
            mode.contentDom.addClass('entryRemove');
            $(mode.contentDom).detach();
            mode.obj.visible = false;
        }

        const selected = this.modes[modeName];
        $(this._contentView).append(selected.contentDom);
        selected.tabDom.addClass('selected');
        selected.contentDom.removeClass('entryRemove');
        if (selected.obj.resize) {
            selected.obj.resize();
        }
        selected.obj.visible = true;
        this.selected = modeName;
    }

    initializeSplitter(splitter) {
        splitter.bind('mousedown touchstart', (e) => {
            e.preventDefault();
            if (Entry.disposeEvent) {
                Entry.disposeEvent.notify();
            }
            const container = Entry.container;
            this._cover.removeClass('entryRemove');
            this._cover._isVisible = true;
            container.splitterEnable = true;
            if (Entry.documentMousemove) {
                container.resizeEvent = Entry.documentMousemove.attach(this, (e) => {
                    if (container.splitterEnable) {
                        Entry.resizeElement({
                            canvasWidth: e.clientX || e.x,
                        });
                    }
                });
            }
            $(document).bind('mouseup.container:splitter touchend.container:splitter', (e) => {
                const container = Entry.container;
                const listener = container.resizeEvent;
                if (listener) {
                    container.splitterEnable = false;
                    listener.destroy();
                    delete container.resizeEvent;
                }
                if (this._cover._isVisible) {
                    this._cover._isVisible = false;
                    this._cover.addClass('entryRemove');
                }
                $(document).unbind('.container:splitter');
            });
        });
    }

    _removeDom(mode) {
        if (this.modes[mode]) {
            this.modes[mode].tabDom.remove();
            this.modes[mode].contentDom.remove();
            if (mode === 'hw') {
                $(this.modes).removeClass('.propertyTabhw');
                $('.propertyTabhw').unbind('dblclick');
            }
        }
    }
}

Entry.PropertyPanel = PropertyPanel;
