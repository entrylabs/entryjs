Entry.skeleton = function() {};

/*
type Point = { x: number; y: number; };

interface skeletonSchema {
    executable?: boolean = true;
    fontSize?: number;
    movable?: boolean;
    readOnly?: boolean;
    nextShadow?: boolean;
    classes?: string[];
    color?: string;
    outerLine?: string;
    morph?: ['prev', 'next']; // for pebble
    dropdownHeight?: number; // for pebble

    path: (blockView) => string; // svg path string
    box: (blockVIew) => {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
        marginBottom: number;
        topFieldHeight?: number;
    }
    contentPos: () => Point;
    magnets?: (blockView) => {
        next?: Point;
        previous?: Point;
        boolean?: {};
        string?: {};
        param?: {};
    }
    statementPos?: (blockView) => Point[];
}
*/

// index.js 를 제외한 playground/skeleton 디렉토리 하위의 모든 js 를 불러옴
// https://webpack.js.org/guides/dependency-management/#requirecontext
const context = require.context('.', true, /^(?!.*index.js)(.*\.js$)/im);
context.keys().forEach(context);
