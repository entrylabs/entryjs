import PopupHelper from '../../popup_helper';

export default function createHardwarePopup(onOkButtonClicked?: () => void) {
    const popupHelper = window.popupHelper || new PopupHelper(true);
    popupHelper.addPopup('hwDownload', {
        type: 'confirm',
        title: Lang.Msgs.not_install_title,
        setPopupLayout(popup: any) {
            const content = Entry.Dom('div', {
                class: 'contentArea',
            });
            const text = Entry.Dom('div', {
                class: 'textArea',
                parent: content,
            });
            const text1 = Entry.Dom('div', {
                class: 'text1',
                parent: text,
            });
            const text2 = Entry.Dom('div', {
                class: 'text2',
                parent: text,
            });
            const text3 = Entry.Dom('div', {
                class: 'text3',
                parent: text,
            });
            const text4 = Entry.Dom('div', {
                class: 'text4',
                parent: text,
            });
            const cancel = Entry.Dom('div', {
                classes: ['popupCancelBtn', 'popupDefaultBtn'],
                parent: content,
            });
            const ok = Entry.Dom('div', {
                classes: ['popupOkBtn', 'popupDefaultBtn'],
                parent: content,
            });
            (text1 as any).text(Lang.Msgs.hw_download_text1);
            (text2 as any).html(Lang.Msgs.hw_download_text2);
            (text3 as any).text(Lang.Msgs.hw_download_text3);
            (text4 as any).text(Lang.Msgs.hw_download_text4);
            (cancel as any).text(Lang.Buttons.cancel);
            (ok as any).html(Lang.Msgs.hw_download_btn);

            (content as any).bindOnClick('.popupDefaultBtn', function() {
                const $this = $(this);
                if ($this.hasClass('popupOkBtn')) {
                    onOkButtonClicked();
                }
                popupHelper.hide(/*'hwDownload'*/);
            });

            popup.append(content);
        },
    });

    return popupHelper;
}
