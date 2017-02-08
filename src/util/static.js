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
    BLOCK_RENDER_MODEL: 9,
    BOX_MODEL: 10,
    THREAD_MODEL: 11,
    DRAG_INSTANCE: 12,

    /* block state */
    BLOCK_STATIC: 0,
    BLOCK_MOVE: 1,
    BLOCK_FOLLOW: 2,

    /* execute return state */
    RETURN: 0,
    CONTINUE: 1,
    BREAK: 2,
    PASS: 3,

    COMMAND_TYPES: {
        addThread: 101,
        destroyThread: 102,
        destroyBlock: 103,
        recoverBlock: 104,
        insertBlock: 105,
        separateBlock: 106,
        moveBlock: 107,
        cloneBlock: 108,
        uncloneBlock: 109,
        scrollBoard: 110,
        setFieldValue: 111,

        selectObject: 201,

        'do': 301,
        'undo': 302,
        'redo': 303,

        editPicture: 401,
        uneditPicture: 402,
        processPicture: 403,
        unprocessPicture: 404,

        toggleRun: 501,
        toggleStop: 502,
    },

    RECORDABLE: {
        SUPPORT: 1,
        SKIP: 2,
        ABANDONE: 3
    },
};
