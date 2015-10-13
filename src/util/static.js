"use strict";

goog.provide("Entry.STATIC");

Entry.STATIC = {
    /* data type */
    OBJECT: 0,
    ENTITY: 1,
    SPRITE: 2,
    SOUND: 3,
    VARIABLE: 4,
    FUNCTION: 5,
    SCENE: 6,
    MESSAGE: 7,
    BLOCK_MODEL: 8,
    BOX_MODEL: 9,
    THREAD_MODEL: 10,
    DRAG_INSTANCE: 11,

    /* block state */
    BLOCK_STATIC: 0,
    BLOCK_MOVE: 1,
    BLOCK_FOLLOW: 2
};
