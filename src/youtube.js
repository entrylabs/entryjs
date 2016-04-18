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

    var url = 'https://www.youtube.com/embed/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute("id", "youtubeIframe");
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + youtubeHash);
    this.movieFrame = iframe;
    
    this.movieContainer.appendChild(iframe);
}

p.getView = function () {
	return this.movieContainer;
};

p.resize = function() {
    var container = document.getElementById('entryContainerWorkspaceId');
    var iframe = document.getElementById('youtubeIframe');
    w = container.offsetWidth;
    iframe.width = w+'px';
    iframe.height = w*9/16 + 'px';

}