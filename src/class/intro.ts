/**
 * 프로퍼티 패널쪽에서 프로젝트의 속성을 보여주는 뷰를 담당
 * @use entry-lms
 */

import { IEntry } from '../../types/index';

class EntryIntro implements IEntry.Intro {
    public modes: any = {};
    public selected: any = undefined;
    private view_?: any;

    generateView(introView: any) {
        this.view_ = introView;
        this.view_.addClass('entryPlaygroundIntro');
    }

    setView(view: any) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.addClass('active');
        view.appendTo(this.view_);
        Entry.windowResized.notify();
    }

    removeView() {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.removeClass('active');
    }
}

export default EntryIntro;
Entry.Intro = EntryIntro;
