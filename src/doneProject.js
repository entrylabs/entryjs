'use strict'

Entry.DoneProject = function() {
	this.generateView();                                                                                                   
}

var p = Entry.DoneProject.prototype;

p.init = function(projectId) {
	this.projectId = projectId;
}

p.generateView = function() {

    // this.youtubeTab.removeClass('entryRemove');
    
	var doneContainer = Entry.createElement('div');
    doneContainer.addClass('entryContainerDoneWorkspace');
    doneContainer.addClass('entryHide');
    // view.appendChild(doneContainer);
    this.doneContainer = doneContainer;
    var view = this.doneContainer;
	// view.appendChild(movieContainer);  

    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var url = '/api/iframe/project/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16 + 35);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + this.doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
}

p.getView = function () {

	return this.movieFrame;
}