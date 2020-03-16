/**
 * 사용처: Entry#lecture 관련 로직 한군데
 */

class EntryPDF {
    constructor(file) {
        this.generateView(file);
    }

    generateView(file) {
        const pdfView = Entry.createElement('div', 'entryPdfWorkspace');
        pdfView.addClass('entryRemove');
        this._view = pdfView;

        let url = '/pdfjs/web/viewer.html';
        if (file && file !== '') {
            url += `?file=${file}`;
        }

        const pdfViewIframe = Entry.createElement('iframe', 'entryPdfIframeWorkspace');
        pdfViewIframe.setAttribute('id', 'pdfViewIframe');
        pdfViewIframe.setAttribute('frameborder', 0);
        pdfViewIframe.setAttribute('src', url);
        pdfView.appendChild(pdfViewIframe);
    }

    getView() {
        return this._view;
    }

    resize() {
        const container = document.getElementById('entryContainerWorkspaceId');
        const iframe = document.getElementById('pdfViewIframe');
        const w = container.offsetWidth;
        iframe.width = `${w}px`;
        iframe.height = `${(w * 9) / 16}px`;
    }
}

Entry.Pdf = EntryPDF;
