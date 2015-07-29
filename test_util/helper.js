"use strict";

var Test = {};

Test.randomString = function() {
    return Math.random().toString(36).substring(
        Math.floor(Math.random() * 17 + 1)
    );
}

Test.randomNumber = function() {
    Math.floor(Math.random() * 100);
};

window.Test = Test;
