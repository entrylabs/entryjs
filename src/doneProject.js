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
    // var parentcontainer = document.getElementById('entryContainerWorkspaceId');


    this.doneContainer = doneContainer;
    var view = this.doneContainer;
    // var width = parentcontainer.offsetWidth;

    
    var url = '/api/iframe/project/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute("id", "doneProjectframe");
    // iframe.setAttribute('width', width-1);
    // iframe.setAttribute('height', width * 9/16);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
}

p.getView = function () {

	return this.doneContainer;
}

p.resize = function() {
    var container = document.getElementById('entryContainerWorkspaceId');
    var iframe = document.getElementById('doneProjectframe');
    w = container.offsetWidth;
    iframe.width = w+'px';
    iframe.height = w*9/16 + 'px';
}