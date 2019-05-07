import EntryPaint from 'entry-paint';
import axios from 'axios';

const stringToElement = (htmlString) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString;
    return wrapper.children[0];
};
Entry.Painter = class Painter {
    constructor(view) {
        this.view = view;
        this.cache = [];

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

    getExt(filePath) {
        return filePath.split('.').pop() === 'svg' ? 'svg' : 'png';
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

    _getImageSrc(picture) {
        const { imageType = 'png', fileurl, filename } = picture || {};
        if (fileurl) {
            return fileurl;
        } else {
            const extention = imageType === 'paper' ? 'png' : imageType;
            return `${Entry.defaultPath}/uploads/${filename.substring(0, 2)}/${filename.substring(
                2,
                4
            )}/image/${filename}.${extention}`;
        }
    }

    addPicture(picture, isChangeShape) {
        const { imageType = 'png', paper } = picture || {};
        const imageSrc = this._getImageSrc(picture);

        isChangeShape && (this.isImport = true);

        switch (imageType) {
            case 'png':
                this.entryPaint.addBitmap(imageSrc);
                break;
            case 'svg':
                axios.get(imageSrc).then(({ data }) => {
                    this.entryPaint.addSVG(stringToElement(data));
                });
                break;
            case 'paper':
                this.entryPaint.setPaperJSON(paper);
                break;
        }
    }

    fileSave(taskParam) {
        if (!Entry.stage.selectedObject) {
            return;
        }
        const dataURL = this.entryPaint.getDataURL();
        this.file.paperJson = this.entryPaint.getPaperJSON();
        const file = JSON.parse(JSON.stringify(this.file));
        Entry.dispatchEvent('saveCanvasImage', {
            file,
            image: dataURL,
            task: taskParam,
        });

        this.file.isUpdate = false;
        this.file.modified = false;
    }
};
