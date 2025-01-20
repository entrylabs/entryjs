/**
 * 사용처: Entry#lecture 관련 로직 한군데
 */

class EntryPDF {
    private _view: HTMLDivElement;

    constructor(filename: string) {
        this.generateView(filename);
    }

    private generateView(file: string) {
        const pdfView = Entry.createElement('div', 'entryPdfWorkspace');

        // @ts-ignore 아무리봐도 순수 HTMLDivElement 에는 이 함수가 없음. 그러나 모르는 무언가가 있을 수 있으므로 그냥 둠
        pdfView.addClass('entryRemove');
        let url = '/pdfjs/web/viewer.html';
        if (file && file !== '') {
            url += `?file=${file}`;
        }

        const pdfViewIframe = Entry.createElement('iframe', 'entryPdfIframeWorkspace');
        pdfViewIframe.setAttribute('id', 'pdfViewIframe');
        pdfViewIframe.setAttribute('frameborder', '0');
        pdfViewIframe.setAttribute('src', url);
        pdfView.appendChild(pdfViewIframe);
        this._view = pdfView;
    }

    getView() {
        return this._view;
    }

    resize() {
        const container = document.getElementById('entryContainerWorkspaceId');
        const viewFrame = document.getElementById('pdfViewIframe') as HTMLIFrameElement;
        const width = container.offsetWidth;
        viewFrame.width = `${width}px`;
        viewFrame.height = `${(width * 9) / 16}px`;
    }
}

export default EntryPDF;
Entry.Pdf = EntryPDF;
