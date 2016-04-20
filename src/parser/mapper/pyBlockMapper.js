/*
 *
 */
"use strict";

goog.provide("Entry.PyBlockMapper");

Entry.PyBlockMapper = function() {
    
};

(function(p){
    p.getBlock = function(key) {
    	return Block(key);
    }
})(Entry.PyBlockMapper.prototype);