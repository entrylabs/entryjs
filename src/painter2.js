'use strict';

Entry.Painter2 = function(view) {
    this.view = view;

    this.file = {
        id: Entry.generateHash(),
        name: '새그림',
        modified: false,
        mode: 'new' // new or edit
    };
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
                        strokeColor: 'transparent',
                        fillColor: '#e8e8e8',
                    }
                ),
                LC.createShape(
                    'Rectangle', {
                        x: 0, y: 0, width: 960, height: 540,
                        strokeWidth: 0,
                        strokeColor: 'transparent',
                        fillPattern: bgImage
                    }
                )
            ]
        }
    );

    bgImage.onload = function() {
        this.lc.repaintLayer("background")
    }.bind(this);

    this.lc.on("do", function(e) {
        Entry.do("editPicture", e.action, this.lc);
    });

    this.initTopBar();
};

p.show = function() {
    if (!this.lc)
        this.initialize();
};

p.changePicture = function(picture) {
    //painter.selectToolbox('cursor');
    if (this.file && this.file.id === picture.id)
        return;

    if (this.file.modified) {
        var save = confirm('수정된 내용을 저장하시겠습니까?');
        if (save) {
            this.file_ = JSON.parse(JSON.stringify(this.file));
            this.file_save(true);
        }
    }
    this.file.modified = false;
    this.lc.clear();

    var image = new Image();
    if (picture.id)
        image.id = picture.id;
    else
        image.id = Entry.generateHash();

    this.file.id = image.id;
    this.file.name = picture.name;
    this.file.mode = 'edit';
    if (picture.fileurl) {
        image.src = picture.fileurl;
    } else {
        // deprecated
        image.src = Entry.defaultPath + '/uploads/' + picture.filename.substring(0,2)+'/' + picture.filename.substring(2,4)+'/image/'+picture.filename+'.png';
    }

    var dimension = picture.dimension;
    this.lc.saveShape(LC.createShape('Image',{
        x: 480 - dimension.width / 2,
        y: 270 - dimension.height / 2,
        image: image}));
};

p.file_save = function() {
    //this.clearHandle();
    //this.trim();

    var dataURL = this.lc.getImage().toDataURL();
    Entry.dispatchEvent('saveCanvasImage',
                        {file: this.file, image: dataURL});

    this.file.modified = false;

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
        painter.edit_copy();
    });
    painterTopMenuEditCopyLink.addClass('entryPlaygroundPainterTopMenuEditCopy');
    painterTopMenuEditCopyLink.innerHTML = Lang.Workspace.copy_file;
    painterTopMenuEditCopy.appendChild(painterTopMenuEditCopyLink);

    var painterTopMenuEditCut = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditCut);

    var painterTopMenuEditCutLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditCut');
    painterTopMenuEditCutLink.bindOnClick(function() {
        painter.edit_cut();
    });
    painterTopMenuEditCutLink.addClass('entryPlaygroundPainterTopMenuEditCut');
    painterTopMenuEditCutLink.innerHTML = Lang.Workspace.cut_picture;
    painterTopMenuEditCut.appendChild(painterTopMenuEditCutLink);

    var painterTopMenuEditPaste = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditPaste);

    var painterTopMenuEditPasteLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditPaste');
    painterTopMenuEditPasteLink.bindOnClick(function() {
        painter.edit_paste();
    });
    painterTopMenuEditPasteLink.addClass('entryPlaygroundPainterTopMenuEditPaste');
    painterTopMenuEditPasteLink.innerHTML = Lang.Workspace.paste_picture;
    painterTopMenuEditPaste.appendChild(painterTopMenuEditPasteLink);

    var painterTopMenuEditEraseAll = Entry.createElement('li');
    painterTopMenuEditContainer.appendChild(painterTopMenuEditEraseAll);

    var painterTopMenuEditEraseAllLink = Entry.createElement('a',
                                                'entryPainterTopMenuEditEraseAll');
    painterTopMenuEditEraseAllLink.addClass('entryPlaygroundPainterTopMenuEditEraseAll');
    painterTopMenuEditEraseAllLink.innerHTML = Lang.Workspace.remove_all;
    painterTopMenuEditEraseAllLink.bindOnClick(function() {
        painter.clearCanvas();
    });

    painterTopMenuEditEraseAll.appendChild(painterTopMenuEditEraseAllLink);

    Entry.addEventListener('pictureSelected', this.changePicture.bind(this));
}

}(Entry.Painter2.prototype));
