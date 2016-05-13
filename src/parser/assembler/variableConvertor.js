/*
 *
 */
"use strict";

goog.provide("Entry.VariableConvertor");

Entry.VariableConvertor = function() {

};

(function(p) {
	p.convert = function(type, param) {
		console.log("convert",type, param);
		var result = "";
    	switch(type) {
            case 'variable': {
                var messages = Entry.variableContainer.messages_;
                if(messages.length != 0) {
                    for(var index in messages) {
                        if(param == messages[index].name) {
                            result = messages[index].id;
                            return result;
                        }
                    }
                    result = param;
                } else {
                    result = param;
                }
                break;
            }
    		case 'scene': {
                var scenes = Entry.scene.scenes_;
                if(scenes.length != 0) {
        			for(var index in scenes) {
                        if(param == scenes[index].name) {
                            result = scenes[index].id;
                            return result;
                        }
                    }
                    result = param;
                } else {
                    result = param;
                }
                break;
            }
            case 'object': {
                if(param == "자신") {
                    result = "self";
                    return result;
                } else if(param == "마우스포인터"){
                    result = "mouse";
                    return result;
                }

                var objects = Entry.container.objects_;
                if(objects.length != 0) {
                    for(var index in objects) {
                        if(param == objects[index].name && objects[index].isSelected_) {
                            result = objects[index].id;
                            return result;
                        }
                    }
                    result = param;
                } else {
                    result = param;
                }
                break;
            }
            case 'picture': {
                var objects = Entry.container.objects_;
                if(objects.length != 0) {
                    for(var index in objects) {
                        if(objects[index].isSelected_){
                            var pictures = objects[index].pictures
                            for(var y in pictures) {
                                if(param == pictures[y].name) {
                                    result = pictures[y].id;
                                    return result;
                                }
                            }
                        }
                    }
                    result = param;
                } else {
                    result = param;
                }
                break;
            }
            case 'sound': {
                var objects = Entry.container.objects_;
                if(objects.length != 0) {
                    for(var index in objects) {
                        if(objects[index].isSelected_){
                            var sounds = objects[index].sounds
                            for(var y in sounds) {
                                if(param == sounds[y].name) {
                                    result = sounds[y].id;
                                    return result;
                                }
                            }
                        }
                    }
                    result = param;
                } else {
                    result = param;
                }
                break;
            }
            default: {
                if(param == "none") {
                    result = null;
                    break;
                } else {
                    result = param;
                }
            }

    	}

    	return result;
	};
})(Entry.VariableConvertor.prototype);