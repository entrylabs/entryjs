'use strict'

Entry.TvCast = function() {
	this.generateView();                                                                                                   
}

var p = Entry.TvCast.prototype;

p.init = function(tvCastHash) {
	this.tvCastHash = tvCastHash;
}

p.generateView = function() {    
	var movieContainer = Entry.createElement('div');
    movieContainer.addClass('entryContainerMovieWorkspace');
    movieContainer.addClass('entryHide');

    this.movieContainer = movieContainer;
    var view = this.movieContainer;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var movieContainer = this.movieContainer;
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', this.tvcast);
    this.movieFrame = iframe;
    
    this.movieContainer.appendChild(iframe);
}

p.getView = function () {

	return this.movieFrame;
}