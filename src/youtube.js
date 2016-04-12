'use strict'

Entry.Youtube = function() {
	this.generateView();                                                                                                   
}

var p = Entry.Youtube.prototype;

p.init = function(youtubeHash) {
	this.youtubeHash = youtubeHash;
}

p.generateView = function() {

    // this.youtubeTab.removeClass('entryRemove');
    
	var movieContainer = Entry.createElement('div');
    movieContainer.addClass('entryContainerMovieWorkspace');
    movieContainer.addClass('entryHide');

    this.movieContainer = movieContainer;
    var view = this.movieContainer;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
	// view.appendChild(movieContainer);  

    var url = 'https://www.youtube.com/embed/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + this.youtubeHash);
    this.movieFrame = iframe;
    
    this.movieContainer.appendChild(iframe);
}

p.getView = function () {

	return this.movieFrame;
}