'use strict';

Entry.Painter = function(view) {
    this.view = view;
    this.baseUrl = Entry.painterBaseUrl || '/lib/literallycanvas-mobile/lib/img';

    this.file = {
        id: Entry.generateHash(),
        name: '새그림',
        modified: false,
        mode: 'new', // new or edit
    };

    this._keyboardEvents = [];

    Entry.addEventListener('pictureImport', this.addPicture.bind(this));
    Entry.addEventListener('run', this.detachKeyboardEvents.bind(this));
    Entry.addEventListener('stop', this.attachKeyboardEvents.bind(this));

    //dropdown header dispose
    $('body').on('mouseup', '.active li', function() {
        $('.painterTopHeader.active').removeClass('active');
    });

    this.clipboard = null;
};

(function(p) {
    p.initialize = function() {
        if (this.lc) return;

        var that = this;

        var imgURL = that.baseUrl;
        var bgImage = new Image();
        bgImage.src = imgURL + '/transparent-pattern.png';

        var WIDTH = 960;
        var HEIGHT = 540;
        that.lc = LC.init(that.view, {
            imageURLPrefix: imgURL,
            zoomMax: 3.0,
            zoomMin: 0.5,
            toolbarPosition: 'bottom',
            imageSize: { width: WIDTH, height: HEIGHT },
            backgroundShapes: [
                LC.createShape('Rectangle', {
                    x: 0,
                    y: 0,
                    width: WIDTH,
                    height: HEIGHT,
                    strokeWidth: 0,
                    strokeColor: 'transparent',
                }),
            ],
        });
        //that.lc.respondToSizeChange();

        bgImage.onload = function() {
            that.lc.repaintLayer('background');
        };

        var watchFunc = function(e) {
            if (e && ((e.shape && !e.opts && e.shape.isPass) || (e.opts && e.opts.isPass))) {
                Entry.do('processPicture', e, that.lc);
            } else {
                Entry.do('editPicture', e, that.lc);
            }
            that.file.modified = true;
        };

        that.lc.on('clear', watchFunc);
        that.lc.on('remove', watchFunc);
        that.lc.on('shapeEdit', watchFunc);
        that.lc.on('shapeSave', watchFunc);

        that.lc.on('toolChange', that.updateEditMenu.bind(that));
        that.lc.on('lc-pointerdrag', that.stagemousemove.bind(that));
        that.lc.on('lc-pointermove', that.stagemousemove.bind(that));

        that.initTopBar();
        that.updateEditMenu();

        that.attachKeyboardEvents();
    };

    p.show = function() {
        if (!this.lc) this.initialize();
        this.isShow = true;
    };

    p.hide = function() {
        this.isShow = false;
    };

    p.changePicture = function(picture) {
        if (this.file && this.file.id === picture.id) {
            return;
        } else if (!this.file.modified) {
            this.afterModified(picture);
        } else {
            if (this.isConfirm) {
                return;
            }

            this.isConfirm = true;
            var wasRun = false;
            if (Entry.engine.state === 'run') {
                Entry.engine.toggleStop();
                wasRun = true;
            }
            entrylms.confirm(Lang.Menus.save_modified_shape).then(
                function(result) {
                    this.isConfirm = false;
                    if (result === true) {
                        this.file_save(true);
                    } else {
                        this.file.modified = false;
                    }

                    if (!wasRun) {
                        this.afterModified(picture);
                    } else {
                        Entry.playground.injectPicture();
                    }
                }.bind(this)
            );
        }
    };

    p.afterModified = function(picture) {
        var file = this.file;
        file.modified = false;
        this.lc.clear(false);

        file.id = picture.id || Entry.generateHash();
        file.name = picture.name;
        file.mode = 'edit';
        file.objectId = picture.objectId;

        this.addPicture(picture, true);
        // INFO: picture 변경시마다 undoStack 리셋
        this.lc.undoStack = [];
        Entry.stateManager.removeAllPictureCommand();
    };

    p.addPicture = function(picture, isOriginal) {
        var image = new Image();

        if (picture.fileurl) {
            image.src = picture.fileurl;
        } else {
            // deprecated
            image.src =
                Entry.defaultPath +
                '/uploads/' +
                picture.filename.substring(0, 2) +
                '/' +
                picture.filename.substring(2, 4) +
                '/image/' +
                picture.filename +
                '.png';
        }

        var dimension = picture.dimension;
        var shape = LC.createShape('Image', {
            x: 480,
            y: 270,
            width: dimension.width,
            height: dimension.height,
            image: image,
        });

        this.lc.saveShape(shape, !isOriginal);

        image.onload = function() {
            this.lc.setTool(this.lc.tools.SelectShape);
            this.lc.tool.setShape(this.lc, shape);
        }.bind(this);
    };

    p.copy = function() {
        if (this.lc.tool.name !== 'SelectShape' || !this.lc.tool.selectedShape) return;

        var shape = this.lc.tool.selectedShape;
        this.clipboard = {
            className: shape.className,
            data: shape.toJSON(),
        };
        this.updateEditMenu();
    };

    p.cut = function() {
        if (this.lc.tool.name !== 'SelectShape' || !this.lc.tool.selectedShape) return;

        this.copy();
        var shape = this.lc.tool.selectedShape;
        this.lc.removeShape(shape);
        this.lc.tool.setShape(this.lc, null);
    };

    p.paste = function() {
        if (!this.clipboard) return;

        var shape = this.lc.addShape(this.clipboard);
        this.lc.setTool(this.lc.tools.SelectShape);
        this.lc.tool.setShape(this.lc, shape);
    };

    p.updateEditMenu = function() {
        var isSelected = this.lc.tool.name === 'SelectShape' ? 'block' : 'none';
        // this._cutButton.style.display = isSelected;
        // this._copyButton.style.display = isSelected;
        // this._pasteButton.style.display = this.clipboard ? "block" : "none";
    };

    p.file_save = function(taskParam) {
        this.lc.trigger('dispose');
        var dataURL = this.lc.getImage().toDataURL();
        this.file_ = JSON.parse(JSON.stringify(this.file));
        Entry.dispatchEvent('saveCanvasImage', {
            file: this.file_,
            image: dataURL,
            task: taskParam,
        });

        this.file.modified = false;
    };

    p.newPicture = function() {
        var newPicture = {
            dimension: {
                height: 1,
                width: 1,
            },
            //filename: "_1x1",
            fileurl: Entry.mediaFilePath + '_1x1.png',
            name: Lang.Workspace.new_picture,
        };

        newPicture.id = Entry.generateHash();
        if (this.file && this.file.objectId) newPicture.objectId = this.file.objectId;
        Entry.playground.addPicture(newPicture, true);
    };

    p._keyboardPressControl = function(e) {
        if (!this.isShow || Entry.Utils.isInInput(e)) return;

        var keyCode = e.keyCode || e.which,
            ctrlKey = e.ctrlKey;

        if (keyCode == 8 || keyCode == 46) {
            //destroy
            this.cut();
            e.preventDefault();
        } else if (ctrlKey) {
            if (keyCode == 67)
                //copy
                this.copy();
            else if (keyCode == 88) {
                //cut
                this.cut();
            }
        }

        if (ctrlKey && keyCode == 86) {
            //paste
            this.paste();
        }
        this.lc.trigger('keyDown', e);
    };

    p._keyboardUpControl = function(e) {
        if (!this.isShow || Entry.Utils.isInInput(e)) return;

        this.lc.trigger('keyUp', e);
    };

    p.initTopBar = function() {
        var painter = this;

        var ce = Entry.createElement;

        var painterTop = ce(document.getElementById('canvas-top-menu'));
        painterTop.addClass('entryPlaygroundPainterTop');
        painterTop.addClass('entryPainterTop');

        var painterTopFullscreenButton = ce('div', 'entryPainterTopFullscreenButton');
        painterTopFullscreenButton.addClass('entryPlaygroundPainterFullscreenButton');
        painterTopFullscreenButton.bindOnClick(function() {
            const { painter = {}, pictureView_ } = Entry.playground;
            const { view = {} } = painter;
            const $view = $(view);
            if($view.hasClass('fullscreen')) {
                pictureView_.appendChild(view);
                $(view).removeClass('fullscreen');
            } else {
                document.body.appendChild(view);
                $(view).addClass('fullscreen');
            }
            $(view)
                .find('.lc-drawing.with-gui')
                .trigger('resize');
        });
        painterTop.appendChild(painterTopFullscreenButton);

        var painterTopMenu = ce('nav', 'entryPainterTopMenu');
        painterTopMenu.addClass('entryPlaygroundPainterTopMenu');
        painterTop.appendChild(painterTopMenu);

        var painterTopMenuFileNew = ce('div', 'entryPainterTopMenuFileNew');
        painterTopMenuFileNew.bindOnClick(painter.newPicture.bind(this));
        painterTopMenuFileNew.addClass('entryPlaygroundPainterTopMenuFileNew');
        painterTopMenuFileNew.innerHTML = Lang.Workspace.new_picture;
        painterTopMenu.appendChild(painterTopMenuFileNew);

        var painterTopMenuFile = ce('div', 'entryPainterTopMenuFile');
        painterTopMenuFile.addClass('entryPlaygroundPainterTopMenuFile painterTopHeader');
        painterTopMenuFile.innerHTML = Lang.Menus.offline_file;
        var painterTopMenuFileDropdown = ce('div');

        painterTopMenuFileDropdown.addClass('entryPlaygroundPainterTopMenuFileDropdown');
        painterTopMenu.appendChild(painterTopMenuFile);
        painterTopMenuFile.appendChild(painterTopMenuFileDropdown);

        var painterTopMenuEdit = ce('div', 'entryPainterTopMenuEdit');
        painterTopMenuEdit.addClass('entryPlaygroundPainterTopMenuEdit painterTopHeader');
        painterTopMenuEdit.innerHTML = Lang.Menus.offline_edit;
        painterTopMenu.appendChild(painterTopMenuEdit);

        var painterTopMenuFileSave = ce('div', 'entryPainterTopMenuFileSave');
        painterTopMenuFileSave.bindOnClick(function() {
            painter.file_save(false);
        });
        painterTopMenuFileSave.addClass('entryPainterTopMenuFileSave');
        painterTopMenuFileSave.innerHTML = Lang.Workspace.painter_file_save;
        painterTopMenuFileDropdown.appendChild(painterTopMenuFileSave);

        var painterTopMenuFileSaveAsLink = ce('div', 'entryPainterTopMenuFileSaveAs');
        painterTopMenuFileSaveAsLink.bindOnClick(function() {
            painter.file.mode = 'new';
            painter.file_save(false);
        });
        painterTopMenuFileSaveAsLink.addClass('entryPlaygroundPainterTopMenuFileSaveAs');
        painterTopMenuFileSaveAsLink.innerHTML = Lang.Workspace.painter_file_saveas;
        painterTopMenuFileDropdown.appendChild(painterTopMenuFileSaveAsLink);

        var painterTopMenuEditDropdown = ce('div');
        painterTopMenuEditDropdown.addClass('entryPlaygroundPainterTopMenuEditDropdown');
        painterTopMenuEdit.appendChild(painterTopMenuEditDropdown);

        var painterTopMenuEditImport = ce('div', 'entryPainterTopMenuEditImport');
        painterTopMenuEditImport.bindOnClick(function() {
            Entry.dispatchEvent('openPictureImport');
        });
        painterTopMenuEditImport.addClass('entryPainterTopMenuEditImport');
        painterTopMenuEditImport.innerHTML = Lang.Workspace.get_file;
        painterTopMenuEditDropdown.appendChild(painterTopMenuEditImport);

        var painterTopMenuEditCopy = ce('div', 'entryPainterTopMenuEditCopy');
        painterTopMenuEditCopy.bindOnClick(function() {
            painter.copy();
        });
        painterTopMenuEditCopy.addClass('entryPlaygroundPainterTopMenuEditCopy');
        painterTopMenuEditCopy.innerHTML = Lang.Workspace.copy_file;
        painterTopMenuEditDropdown.appendChild(painterTopMenuEditCopy);

        var painterTopMenuEditCut = ce('div', 'entryPainterTopMenuEditCut');
        painterTopMenuEditCut.bindOnClick(function() {
            painter.cut();
        });
        painterTopMenuEditCut.addClass('entryPlaygroundPainterTopMenuEditCut');
        painterTopMenuEditCut.innerHTML = Lang.Workspace.cut_picture;
        painterTopMenuEditDropdown.appendChild(painterTopMenuEditCut);

        var painterTopMenuEditPaste = ce('div', 'entryPainterTopMenuEditPaste');
        painterTopMenuEditPaste.bindOnClick(function() {
            painter.paste();
        });
        painterTopMenuEditPaste.addClass('entryPlaygroundPainterTopMenuEditPaste');
        painterTopMenuEditPaste.innerHTML = Lang.Workspace.paste_picture;
        painterTopMenuEditDropdown.appendChild(painterTopMenuEditPaste);

        var painterTopMenuEditEraseAll = ce('div', 'entryPainterTopMenuEditEraseAll');
        painterTopMenuEditEraseAll.addClass('entryPlaygroundPainterTopMenuEditEraseAll');
        painterTopMenuEditEraseAll.innerHTML = Lang.Workspace.remove_all;
        painterTopMenuEditEraseAll.bindOnClick(function() {
            painter.lc.clear();
        });
        painterTopMenuEditDropdown.appendChild(painterTopMenuEditEraseAll);

        $(painterTopMenuFile).on('click tab', menuClickEvent);
        $(painterTopMenuEdit).on('click tab', menuClickEvent);
        $(document).on('click tap', (e) => {
            e.stopPropagation();
            $(painterTopMenuFile).removeClass('active');
            $(painterTopMenuEdit).removeClass('active');
        });

        var painterTopStageXY = ce('div', 'entryPainterTopStageXY');
        var entryPainterTopStageXYLabel = ce('span', 'entryPainterTopStageXYLabel');
        this.painterTopStageXY = entryPainterTopStageXYLabel;
        painterTopStageXY.addClass('entryPlaygroundPainterTopStageXY');
        entryPainterTopStageXYLabel.addClass('entryPainterTopStageXYLabel');
        painterTopStageXY.appendChild(entryPainterTopStageXYLabel);
        painterTop.appendChild(painterTopStageXY);

        Entry.addEventListener('pictureSelected', this.changePicture.bind(this));

        function menuClickEvent(e) {
            $(painterTopMenuFile).removeClass('active');
            $(painterTopMenuEdit).removeClass('active');
            if(e.target === this) {
                e.stopImmediatePropagation();
                $(this).addClass('active');
            }
        }
    };

    p.stagemousemove = function(event) {
        this.painterTopStageXY.textContent =
            'x:' + event.x.toFixed(1) + ', y:' + event.y.toFixed(1);
    };

    p.attachKeyboardEvents = function() {
        this.detachKeyboardEvents();

        var events = this._keyboardEvents;

        var evt = Entry.keyPressed;
        evt && events.push(evt.attach(this, this._keyboardPressControl));

        evt = Entry.keyUpped;
        evt && events.push(evt.attach(this, this._keyboardUpControl));
    };

    p.detachKeyboardEvents = function() {
        var events = this._keyboardEvents;
        if (!events || !events.length) return;

        while (events.length) {
            var evt = events.pop();
            evt.destroy && evt.destroy();
        }
    };
})(Entry.Painter.prototype);
