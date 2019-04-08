import EntryPaint from 'entry-paint';

Entry.Painter = class Painter {
    constructor(view) {
        this.view = view;
        this.baseUrl = Entry.painterBaseUrl;

        this.file = {
            id: Entry.generateHash(),
            name: '새그림',
            modified: false,
            mode: 'new', // new or edit
        };

        this._keyboardEvents = [];

        // Entry.addEventListener('pictureImport', this.addPicture.bind(this));
        // Entry.addEventListener('run', this.detachKeyboardEvents.bind(this));
        // Entry.addEventListener('stop', this.attachKeyboardEvents.bind(this));

        // //dropdown header dispose
        // $('body').on('mouseup', '.active li', function() {
        //     $('.painterTopHeader.active').removeClass('active');
        // });

        this.clipboard = null;
        this.initialize();
    }

    initialize() {
        EntryPaint.init({ parent: this.view });
    }

    show() {}
    hide() {}
};
