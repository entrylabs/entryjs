'use strict'

Entry.DoneProject = function(id) {
	this.generateView(id);                                                                                                   
}

var p = Entry.DoneProject.prototype;

p.init = function(projectId) {
	this.projectId = projectId;
}

p.generateView = function(doneProject) {

    // this.youtubeTab.removeClass('entryRemove');
    
	var doneContainer = Entry.createElement('div');
    doneContainer.addClass('entryContainerDoneWorkspace');
    doneContainer.addClass('entryHidden');

    this.doneContainer = doneContainer;
    var view = this.doneContainer;

    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var url = '/api/iframe/project/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', "100%");
    iframe.setAttribute('height', "380px");
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
}

p.getView = function () {

	return this.doneContainer;
}

p.resize = function() {
    console.log('doneproject');
}