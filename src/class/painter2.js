import EntryPaint from 'entry-paint';

Entry.Painter = class Painter {
    constructor(view) {
        this.view = view;
        this.cache = [];
        this.baseUrl = Entry.painterBaseUrl;

        this.file = {
            id: Entry.generateHash(),
            name: '새그림',
            modified: false,
            mode: 'new', // new or edit
        };

        this.isShow = false;
        this.clipboard = null;
    }

    initialize() {
        this.isShow = true;
        this.entryPaint = EntryPaint.create({ parent: this.view });
        Entry.addEventListener('pictureSelected', this.changePicture.bind(this));
        this.isImport = true;
        this.entryPaint.on('SNAPSHOT_SAVED', (e) => {
            if (!this.isImport && Entry.stage.selectedObject) {
                Entry.do('editPicture', e, this.entryPaint);
                this.file.modified = true;
            }
            this.isImport = false;
        });
        Entry.windowResized.attach(this.view, this.entryPaint.realign);
    }

    show() {
        if (!this.isShow) {
            this.initialize();
        }
    }

    hide() {}

    getFilePath(filePath) {
        return filePath.split('.').pop();
    }

    changePicture(picture = {}) {
        if (this.file && this.file.id === picture.id) {
            if (!this.file.isUpdate) {
                Entry.stage.updateObject();
                this.file.isUpdate = true;
            }
            return;
        } else if (!this.file.modified) {
            this.afterModified(picture);
        } else {
            if (this.isConfirm) {
                return;
            }

            this.isConfirm = true;
            let wasRun = false;
            if (Entry.engine.state === 'run') {
                Entry.engine.toggleStop();
                wasRun = true;
            }
            entrylms.confirm(Lang.Menus.save_modified_shape).then((result) => {
                this.isConfirm = false;
                if (result === true) {
                    this.fileSave(true);
                } else {
                    this.file.modified = false;
                }

                if (!wasRun) {
                    this.afterModified(picture);
                } else {
                    Entry.playground.injectPicture();
                }
            });
        }
        Entry.stage.updateObject();
        this.file.isUpdate = true;
    }

    afterModified(picture) {
        const file = this.file;
        file.modified = false;
        this.isImport = true;
        this.entryPaint.reset();

        if (picture.id) {
            file.id = picture.id || Entry.generateHash();
            file.name = picture.name;
            file.mode = 'edit';
            file.objectId = picture.objectId;

            this.addPicture(picture, true);
        } else {
            file.id = Entry.generateHash();
        }

        // this.lc.undoStack = [];
        Entry.stateManager.removeAllPictureCommand();
    }

    getPictureExt(picture) {
        return picture.fileurl
            ? this.getFilePath(picture.fileurl)
            : this.getFilePath(picture.label.ko);
    }

    addPicture(picture, isChangeShape) {
        const image = new Image();
        const ext = this.getPictureExt(picture);

        if (picture.fileurl) {
            image.src = picture.fileurl;
        } else {
            // deprecated
            image.src = `${Entry.defaultPath}/uploads/${picture.filename.substring(
                0,
                2
            )}/${picture.filename.substring(2, 4)}/image/${picture.filename}.${ext}`;
        }

        const imageSrc = image.src;
        const cache = this.cache[imageSrc];
        isChangeShape && (this.isImport = true);
        if (cache) {
            this.entryPaint.setPaperJSON(cache);
        } else if (ext === 'png') {
            this.entryPaint.addBitmap(imageSrc);
            this.cache[imageSrc] = this.entryPaint.getPaperJSON();
        } else {
            this.entryPaint.addSVG(imageSrc);
        }
    }

    fileSave(taskParam) {
        if (!Entry.stage.selectedObject) {
            return;
        }
        const dataURL = this.entryPaint.getDataURL();
        this.file_ = JSON.parse(JSON.stringify(this.file));
        Entry.dispatchEvent('saveCanvasImage', {
            file: this.file_,
            image: dataURL,
            task: taskParam,
        });

        this.file.isUpdate = false;
        this.file.modified = false;
    }
};
