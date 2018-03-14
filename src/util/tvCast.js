'use strict'

Entry.TvCast = function(tvCast) {
	this.generateView(tvCast);
}

var p = Entry.TvCast.prototype;

p.init = function(tvCastHash) {
	this.tvCastHash = tvCastHash;
}

p.generateView = function(tvCastHash) {
	var movieContainer = Entry.createElement('div');
    movieContainer.addClass('entryContainerMovieWorkspace');
    movieContainer.addClass('entryRemove');

    this.movieContainer = movieContainer;
    var view = this.movieContainer;

    var movieContainer = this.movieContainer;
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute("id", "tvCastIframe");
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', tvCastHash);
    this.movieFrame = iframe;

    this.movieContainer.appendChild(this.movieFrame);
}

p.getView = function () {
	return this.movieContainer;
}

p.resize = function() {
    var container = document.getElementById('entryContainerWorkspaceId');
    var iframe = document.getElementById('tvCastIframe');
    w = this.movieContainer.offsetWidth;
    iframe.width = w+'px';
    iframe.height = w*9/16 + 'px';
};
