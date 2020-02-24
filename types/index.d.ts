// TODO 이 아래 타입들이 붙어있으면 그냥 아직 몰라서 붙인 타입입니다. 수정이 필요합니다.
declare type UnknownAny = any;
declare type UnknownFunction = (...args: any[]) => any;

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

declare module IEntry {
    export interface Container {
        getAllObjects(): UnknownAny[];
    }

    export interface Playground {
        object?: UnknownAny;
        setMenu?: UnknownFunction;
    }

    /**
     * 오브젝트, 도움말, 하드웨어등의 정보를 가지고있는 좌측하단 패널
     */
    export interface PropertyPanel {
        removeMode: (mode: string) => void;
        addMode: (modeKey: string, element: UnknownAny) => void;
        selected: string;
    }

    export interface Stage {
        canvas: PIXI.Container | any;
        _app: PIXI.Application | any;
    }

    /**
     * 과거 엔트리 토스트
     */
    type WSToastFunction = (title: string, message: string, isNotAutoDispose?: boolean) => void;

    export interface WorkspaceToast {
        alert: WSToastFunction;
        warning: WSToastFunction;
        success: WSToastFunction;
    }

    /**
     * 최초 엔트리 Init 시 받는 옵션들. 여기저기서 사용된다
     */
    export interface EntryOptions {
        disableHardware?: boolean;
    }

    // Entry namespace 에 필요한 객체가 있으면 추가해주세요.
}
