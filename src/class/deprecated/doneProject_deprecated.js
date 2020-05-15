'use strict';

require('../util/static');

Entry.DoneProject = function(id) {
    this.generateView(id);
};

const p = Entry.DoneProject.prototype;

p.init = function(projectId) {
    this.projectId = projectId;
};

p.generateView = function(doneProject) {
    // this.youtubeTab.removeClass('entryRemove');

    const doneContainer = Entry.createElement('div');
    doneContainer.addClass('entryContainerDoneWorkspace');
    // var parentcontainer = document.getElementById('entryContainerWorkspaceId');

    this.doneContainer = doneContainer;
    const view = this.doneContainer;
    // var width = parentcontainer.offsetWidth;

    const url = '/api/iframe/project/';
    const iframe = Entry.createElement('iframe');
    iframe.setAttribute('id', 'doneProjectframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
    doneContainer.addClass('entryRemove');
};

p.getView = function() {
    return this.doneContainer;
};

p.resize = function() {
    const container = document.getElementById('entryContainerWorkspaceId');
    const iframe = document.getElementById('doneProjectframe');
    const w = this.doneContainer.offsetWidth;

    iframe.width = `${w}px`;
    iframe.height = `${(w * 9) / 16}px`;
};
