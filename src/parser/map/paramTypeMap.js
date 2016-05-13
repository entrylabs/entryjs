
/*
 *
 */
"use strict";

goog.provide("Entry.ParamTypeMap");

Entry.ParamTypeMap = function() {

};

(function(p) {
    p.getDropdownDynamicType = {"when_message_cast" : "variable", 
                      "message_cast" : "variable",
                      "message_cast_wait" : "variable",
                      "start_scene" : "scene", 
                      "create_clone" : "object", 
                      "locate" : "object",
                      "locate_object_time" : "object",
                      "see_angle_object" : "object",
                      "change_to_some_shape" : "picture",
                      "sound_something_with_block" : "sound",
                      "sound_something_second_with_block" : "sound",
                      "sound_from_to" : "sound",
                      "sound_something_wait_with_block" : "sound",
                      "sound_something_second_wait_with_block" : "sound",
                      "sound_from_to_and_wait" : "sound"
                    };
})(Entry.ParamTypeMap.prototype);