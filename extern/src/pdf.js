'use strict'

Entry.Pdf = function(file) {
    this.generateView(file);
}

var p = Entry.Pdf.prototype;

p.generateView = function(file) {
    var pdf = this;
    var pdfView = Entry.createElement('div', 'entryPdfWorkspace');
    pdfView.addClass('entryRemove');
    this._view = pdfView;

    var url = '/pdfjs/web/viewer.html';
    if (file && file != '')
        url += '?file='+file;

    pdfViewIframe = Entry.createElement('iframe', 'entryPdfIframeWorkspace');
    pdfViewIframe.setAttribute('id', 'pdfViewIframe');
    pdfViewIframe.setAttribute('frameborder', 0);
    pdfViewIframe.setAttribute('src', url);
    pdfView.appendChild(pdfViewIframe);
}

p.getView = function () {
    return this._view;
};

p.resize = function() {
    var container = document.getElementById('entryContainerWorkspaceId');
    var iframe = document.getElementById('pdfViewIframe');
    w = container.offsetWidth;
    iframe.width = w+'px';
    iframe.height = w*9/16 + 'px';
};
