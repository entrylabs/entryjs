type ObjectAny = { [key: string]: any };

declare type Point = {
    x: number;
    y: number;
};

declare interface ISkeleton {
    executable?: boolean;
    fontSize?: number;
    movable?: boolean;
    readOnly?: boolean;
    nextShadow?: boolean;
    classes?: string[];
    color?: string;
    outerLine?: string;
    morph?: ['prev', 'next']; // for pebble
    dropdownHeight?: number; // for pebble
    path: (blockView: any) => string; // svg path string
    box: (
        blockView: any
    ) => {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
        marginBottom: number;
        topFieldHeight?: number;
    };
    contentPos: (blockView: any) => Point;
    magnets?: (
        blockView: any
    ) => {
        next?: Point;
        previous?: Point;
        boolean?: {};
        string?: {};
        param?: {};
    };
    statementPos?: (blockView: any) => Point[];
}

declare type ObjectLike = { [key: string]: ObjectAny };

declare module Entry {
    export var skeleton: { [name: string]: ISkeleton };
    // Entry namespace 에 필요한 객체가 있으면 추가해주세요.
}
