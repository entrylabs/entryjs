'use strict';

Entry.Painter2 = function(view) {
    this.view = view;

    this.file = {
        id: Entry.generateHash(),
        name: '새그림',
        modified: false,
        mode: 'new' // new or edit
    };

    Entry.addEventListener('pictureImport', function(picture) {
        this.addPicture(picture)
    }.bind(this));

    this.clipboard = null;
};

(function(p) {

p.initialize = function() {
    if (this.lc)
        return;
    var imgURL = '/lib/literallycanvas/lib/img';
    var bgImage = new Image();
    bgImage.src = imgURL + '/transparent-pattern.png';
    this.lc = LC.init(this.view, {
            imageURLPrefix: imgURL,
            zoomMax: 3.0,
            zoomMin: 0.5,
            toolbarPosition: 'bottom',
            imageSize: {width: 960, height: 540},
            backgroundShapes: [
                LC.createShape(
                    'Rectangle', {
                        x: 0, y: 0, width: 960, height: 540,
                        strokeWidth: 0,
                        strokeColor: 'transparent'
                    }
                )
            ]
        }
    );

    bgImage.onload = function() {
        this.lc.repaintLayer("background")
    }.bind(this);

    var watchFunc = function(e) {
        if ((e.shape && !e.opts && e.shape.isPass) ||
            e.opts && e.opts.isPass) {
            Entry.do("processPicture", e, this.lc)
        } else {
            Entry.do("editPicture", e, this.lc)
        }
        this.file.modified = true;
    }.bind(this)

    this.lc.on("clear", watchFunc);
    this.lc.on("shapeEdit", watchFunc);
    this.lc.on("shapeSave", watchFunc);

    this.lc.on("toolChange", function(e) {
        this.updateEditMenu();
    }.bind(this));

    this.lc.on("lc-pointerdrag", this.stagemousemove.bind(this));
    this.lc.on("lc-pointermove", this.stagemousemove.bind(this));

    this.initTopBar();
    this.updateEditMenu();

    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this._keyboardPressControl);
    if (Entry.keyUpped)
        Entry.keyUpped.attach(this, this._keyboardUpControl);
};

p.show = function() {
    if (!this.lc)
        this.initialize();
    this.isShow = true;
};

p.hide = function() {
    this.isShow = false;
};

p.changePicture = function(picture) {
    //painter.selectToolbox('cursor');
    if (this.file && this.file.id === picture.id)
        return;

    if (this.file.modified) {
        var save = confirm('수정된 내용을 저장하시겠습니까?');
        if (save) {
            this.file_save(true);
        }
    }
    this.file.modified = false;
    this.lc.clear(false);

    if (picture.id)
        this.file.id = picture.id;
    else
        this.file.id = Entry.generateHash();
    this.file.name = picture.name;
    this.file.mode = 'edit';

    this.addPicture(picture, true);
};

p.addPicture = function(picture, isOriginal) {
    var image = new Image();

    if (picture.fileurl) {
        image.src = picture.fileurl;
    } else {
        // deprecated
        image.src = Entry.defaultPath + '/uploads/' + picture.filename.substring(0,2)+'/' + picture.filename.substring(2,4)+'/image/'+picture.filename+'.png';
    }

    var dimension = picture.dimension;
    var shape = LC.createShape('Image',{
        x: 480,
        y: 270,
        width: dimension.width,
        height: dimension.height,
        image: image
    });
    this.lc.saveShape(shape, !isOriginal);

    image.onload = function() {
        this.lc.setTool(this.lc.tools.SelectShape);
        this.lc.tool.setShape(this.lc, shape);
    }.bind(this);

};

p.copy = function() {
    if (this.lc.tool.name !== "SelectShape" ||
       !this.lc.tool.selectedShape)
        return;

    var shape = this.lc.tool.selectedShape;
    this.clipboard = {
        className: shape.className,
        data: shape.toJSON()
    };
    this.updateEditMenu();
};

p.cut = function() {
    if (this.lc.tool.name !== "SelectShape" ||
       !this.lc.tool.selectedShape)
        return;
    this.copy();
    var shape = this.lc.tool.selectedShape;
    this.lc.removeShape(shape);
    this.lc.tool.setShape(this.lc, null);
};

p.paste = function() {
    if (!this.clipboard)
        return;
    var shape = this.lc.addShape(this.clipboard);
    this.lc.setTool(this.lc.tools.SelectShape);
    this.lc.tool.setShape(this.lc, shape);
};

p.updateEditMenu = function() {
    var isSelected = this.lc.tool.name === "SelectShape" ? "block" : "none";
    this._cutButton.style.display = isSelected;
    this._copyButton.style.display = isSelected;
    this._pasteButton.style.display = this.clipboard ? "block" : "none";
};

p.file_save = function() {
    this.lc.trigger("dispose")
    var dataURL = this.lc.getImage().toDataURL();
    this.file_ = JSON.parse(JSON.stringify(this.file));
    Entry.dispatchEvent('saveCanvasImage',
                        {file: this.file_, image: dataURL});

    this.file.modified = false;
};

p.newPicture = function() {
    var newPicture = {
        dimension: {
            height: 1,
            width: 1
        },
        //filename: "_1x1",
        fileurl: Entry.mediaFilePath + '_1x1.png',
        name: Lang.Workspace.new_picture
    };

    newPicture.id = Entry.generateHash();
    Entry.playground.addPicture(newPicture, true);
};

p._keyboardPressControl = function(e) {
    if (!this.isShow || Entry.Utils.isInInput(e)) return;
    var keyCode = e.keyCode || e.which,
        ctrlKey = e.ctrlKey;

    if (keyCode == 8 || keyCode == 46) { //destroy
        this.cut()
        e.preventDefault();
    } else if (ctrlKey) {
        if (keyCode == 67) //copy
            this.copy()
        else if (keyCode == 88) { //cut
            this.cut()
        }
    }

    if (ctrlKey && keyCode == 86) { //paste
        this.paste()
    }
    this.lc.trigger("keyDown", e);
};

p._keyboardUpControl = function(e) {
    this.lc.trigger("keyUp", e);
};

p.initTopBar = function() {
    var painter = this;

    var painterTop = Entry.createElement(document.getElementById("canvas-top-menu"));
    painterTop.addClass('entryPlaygroundPainterTop');
    painterTop.addClass('entryPainterTop');

    var painterTopMenu = Entry.createElement('nav', 'entryPainterTopMenu');
    painterTopMenu.addClass('entryPlaygroundPainterTopMenu');
    painterTop.appendChild(painterTopMenu);

    var painterTopMenuContainer = Entry.createElement('ul');
    painterTopMenu.appendChild(painterTopMenuContainer);

    var painterTopMenuFileNew = Entry.createElement('li');
    painterTopMenu.appendChild(painterTopMenuFileNew);

    var painterTopMenuFileNewLink = Entry.createElement('a',
                                                'entryPainterTopMenuFileNew');
    painterTopMenuFileNewLink.bindOnClick(function() {
        painter.newPicture();
    });
    painterTopMenuFileNewLink.addClass('entryPlaygroundPainterTopMenuFileNew');
    painterTopMenuFileNewLink.innerHTML = Lang.Workspace.new_picture;
    painterTopMenuFileNew.appendChild(painterTopMenuFileNewLink);

    var painterTopMenuFile = Entry.createElement('li', 'entryPainterTopMenuFile');
    painterTopMenuFile.addClass('entryPlaygroundPainterTopMenuFile');
    painterTopMenuFile.innerHTML = Lang.Workspace.painter_file;
    painterTopMenuContainer.appendChild(painterTopMenuFile);

    var painterTopMenuFileContainer = Entry.createElement('ul');
    painterTopMenuFile.appendChild(painterTopMenuFileContainer);

    var painterTopMenuFileSave = Entry.createElement('li');
    painterTopMenuFileContainer.appendChild(painterTopMenuFileSave);
    var painterTopMenuFileSaveLink = Entry.createElement('a',
                                                'entryPainterTopMenuFileSave');
    painterTopMenuFileSaveLink.bindOnClick(function() {
        painter.file_save(false);
    });
    painterTopMenuFileSaveLink.addClass('entryPainterTopMenuFileSave');
    painterTopMenuFileSaveLink.innerHTML = Lang.Workspace.painter_file_save;
    painterTopMenuFileSave.appendChild(painterTopMenuFileSaveLink);

    var painterTopMenuFileSaveAs = Entry.createElement('li');
    painterTopMenuFileContainer.appendChild(painterTopMenuFileSaveAs);

    var painterTopMenuFileSaveAsLink = Entry.createElement('a',
                                                'entryPainterTopMenuFileSaveAs');
    painterTopMenuFileSaveAsLink.bindOnClick(function() {
        painter.file.mode = "new";
        painter.file_save(false);
    });
    painterTopMenuFileSaveAsLink.addClass('entryPlaygroundPainterTopMenuFileSaveAs');
    painterTopMenuFileSaveAsLink.innerHTML = Lang.Workspace.painter_file_saveas;
    painterTopMenuFileSaveAs.appendChild(painterTopMenuFileSaveAsLink);


    var painterTopMenuEdit = Entry.createElement('li', 'entryPainterTopMenuEdit');
    painterTopMenuEdit.addClass('entryPlaygroundPainterTopMenuEdit');
    painterTopMenuEdit.innerHTML = Lang.Workspace.painter_edit;
    painterTopMenuContainer.appendChild(painterTopMenuEdit);

    var painterTopMenuEditContainer = Entry.createElement('ul');
    painterTopMenuEdit.appendChild(painterTopMenuEditContainer);

    var painterTopMenuEditImport = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditImport);
    var painterTopMenuEditImportLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditImportLink');
    painterTopMenuEditImportLink.bindOnClick(function() {
        Entry.dispatchEvent('openPictureImport');
    });
    painterTopMenuEditImportLink.addClass('entryPainterTopMenuEditImport');
    painterTopMenuEditImportLink.innerHTML = Lang.Workspace.get_file;
    painterTopMenuEditImport.appendChild(painterTopMenuEditImportLink);

    var painterTopMenuEditCopy = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditCopy);

    var painterTopMenuEditCopyLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditCopy');
    painterTopMenuEditCopyLink.bindOnClick(function() {
        painter.copy();
    });
    painterTopMenuEditCopyLink.addClass('entryPlaygroundPainterTopMenuEditCopy');
    painterTopMenuEditCopyLink.innerHTML = Lang.Workspace.copy_file;
    painterTopMenuEditCopy.appendChild(painterTopMenuEditCopyLink);
    this._copyButton = painterTopMenuEditCopy;

    var painterTopMenuEditCut = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditCut);

    var painterTopMenuEditCutLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditCut');
    painterTopMenuEditCutLink.bindOnClick(function() {
        painter.cut();
    });
    painterTopMenuEditCutLink.addClass('entryPlaygroundPainterTopMenuEditCut');
    painterTopMenuEditCutLink.innerHTML = Lang.Workspace.cut_picture;
    painterTopMenuEditCut.appendChild(painterTopMenuEditCutLink);
    this._cutButton = painterTopMenuEditCut;

    var painterTopMenuEditPaste = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditPaste);

    var painterTopMenuEditPasteLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditPaste');
    painterTopMenuEditPasteLink.bindOnClick(function() {
        painter.paste();
    });
    painterTopMenuEditPasteLink.addClass('entryPlaygroundPainterTopMenuEditPaste');
    painterTopMenuEditPasteLink.innerHTML = Lang.Workspace.paste_picture;
    painterTopMenuEditPaste.appendChild(painterTopMenuEditPasteLink);
    this._pasteButton = painterTopMenuEditPaste;

    var painterTopMenuEditEraseAll = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditEraseAll);

    var painterTopMenuEditEraseAllLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditEraseAll');
    painterTopMenuEditEraseAllLink.addClass('entryPlaygroundPainterTopMenuEditEraseAll');
    painterTopMenuEditEraseAllLink.innerHTML = Lang.Workspace.remove_all;
    painterTopMenuEditEraseAllLink.bindOnClick(function() {
        painter.lc.clear();
    });

    painterTopMenuEditEraseAll.appendChild(painterTopMenuEditEraseAllLink);

    var painterTopStageXY = Entry.createElement('div', 'entryPainterTopStageXY');
    this.painterTopStageXY = painterTopStageXY;
    painterTopStageXY.addClass('entryPlaygroundPainterTopStageXY');
    painterTop.appendChild(painterTopStageXY);

    Entry.addEventListener('pictureSelected', this.changePicture.bind(this));
}

p.stagemousemove = function(event) {
    this.painterTopStageXY.textContent = 'x:'+ event.x.toFixed(1) +
        ', y:'+event.y.toFixed(1);
};

}(Entry.Painter2.prototype));
