'use strict'

Entry.Youtube = function(youtube) {
    this.generateView(youtube);                                                                                        
}

var p = Entry.Youtube.prototype;

p.init = function(youtube) {
    this.youtubeHash = youtube;
    this.generateView();
};
p.generateView = function(youtubeHash) {
	var movieContainer = Entry.createElement('div');
    movieContainer.addClass('entryContainerMovieWorkspace');
    movieContainer.addClass('entryHidden');

    this.movieContainer = movieContainer;
    var view = this.movieContainer;
    var width = view.style.width;

    var url = 'https://www.youtube.com/embed/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', "100%");
    iframe.setAttribute('height', "380");
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + youtubeHash);
    this.movieFrame = iframe;
    
    this.movieContainer.appendChild(iframe);
}

p.getView = function () {
	return this.movieContainer;
};
