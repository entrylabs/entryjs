/**
 * 프로퍼티 패널쪽에서 프로젝트의 속성을 보여주는 뷰를 담당
 * @use entry-lms
 */
class EntryIntro {
    constructor() {
        this.modes = {};
        this.selected = undefined;
    }

    generateView(introView) {
        this.view_ = introView;
        this.view_.addClass('entryPlaygroundIntro');
    }

    setView(view) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.addClass('active');
        view.appendTo(this.view_);
    }

    removeView() {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.removeClass('active');
    }
}

Entry.Intro = EntryIntro;
