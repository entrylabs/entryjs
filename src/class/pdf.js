/**;
 * @fileoverview PDF related class.
 */

'use strict';
/**
 * doxdox 'src/class/object.js' --layout markdown --output documentation/src/class/object.md
 *
 *
 * Class for PDF.
 * @param {File} file
 * @constructor
 */
Entry.Pdf = function(file) {
    this.generateView(file);
};

var p = Entry.Pdf.prototype;

/**
 * generate view for PDF file
 * @param {File} file
 */

p.generateView = function(file) {
    var pdf = this;
    var pdfView = Entry.createElement('div', 'entryPdfWorkspace');
    pdfView.addClass('entryRemove');
    this._view = pdfView;

    var url = '/pdfjs/web/viewer.html';
    if (file && file != '') url += '?file=' + file;

    var pdfViewIframe = Entry.createElement('iframe', 'entryPdfIframeWorkspace');
    pdfViewIframe.setAttribute('id', 'pdfViewIframe');
    pdfViewIframe.setAttribute('frameborder', 0);
    pdfViewIframe.setAttribute('src', url);
    pdfView.appendChild(pdfViewIframe);
};
/**
 * getView
 * @return {domElement}
 */
p.getView = function() {
    return this._view;
};
/**
 * resize pdf view(iframe)
 */
p.resize = function() {
    var container = document.getElementById('entryContainerWorkspaceId');
    var iframe = document.getElementById('pdfViewIframe');
    var w = container.offsetWidth;
    iframe.width = w + 'px';
    iframe.height = (w * 9) / 16 + 'px';
};
