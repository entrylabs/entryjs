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
    movieContainer.addClass('entryHidden');

    this.movieContainer = movieContainer;
    var view = this.movieContainer;
    var width = view.style.width;

    var movieContainer = this.movieContainer;
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', "100%");
    iframe.setAttribute('height', "380");
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', tvCastHash);
    this.movieFrame = iframe;
    
    this.movieContainer.appendChild(iframe);
}

p.getView = function () {

	return this.movieContainer;
}
