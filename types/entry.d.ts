/// <reference path="./index.d.ts" />

/**
 * 엔트리 실제 인스턴스에 대한 정의
 */

declare var Entry: {
    HW: new () => IEntry.Hardware;
    Intro: new () => IEntry.Intro;
    PropertyPanel: new () => IEntry.PropertyPanel;
    Pdf: new (filename: string) => IEntry.PDF;
    BlockMenu: any;
    BlockView: any;
    Dom: EntryDomConstructor;
    Dialog: new (
        entity: any,
        message: string | number,
        mode: 'speak' | 'ask',
        isStamp: boolean,
    ) => IEntry.Dialog;
    SVG: any;
    Model: (target: any, isSeal: boolean) => void;
    Event: any;
    Code: any;
    BlockMenuScroller: any;
    moduleManager: IEntry.ExternalModuleManager;
    popupHelper: any; //TODO

    // 엔트리 내 클래스들
    skeleton: { [name: string]: ISkeleton };
    options: IEntry.EntryOptions;
    engine: any;
    toast: IEntry.WorkspaceToast;
    playground: IEntry.Playground;
    workspace: UnknownAny;
    console: any;
    propertyPanel: IEntry.PropertyPanel;
    container: IEntry.Container;
    stage: IEntry.Stage;
    Utils: UnknownAny;
    GlobalSvg: any;
    Workspace: any;
    DragInstance: any;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 객체들
    HARDWARE_LIST: { [hardwareName: string]: any };
    EXTERNAL_MODULE_LIST?: string[];
    KeyboardCode: {map: {[keyname: string]: number}; codeToKeyCode: {[keyname: string]: number}}
    events_: any;
    requestUpdate: boolean;
    TEXT_ALIGNS: string[];
    TEXT_ALIGN_LEFT: number;
    TEXT_ALIGN_CENTER: number;
    TEXT_ALIGN_RIGHT: number;
    block: { [blockName: string]: any };
    hw: IEntry.Hardware; // HW instance
    interfaceState: { [key: string]: any };

    // 엔트리 전역에 할당된 이벤트 객체
    disposeEvent: any;
    documentMousemove: any;
    keyPressed: any;
    windowResized: any;
    documentMousedown: any;

    // 엔트리 전역에 할당된 상수
    DRAG_MODE_DRAG: 2 // utils.js
    DRAG_MODE_NONE: 0;
    DRAG_MODE_MOUSEDOWN: 1;
    type: 'workspace' | string;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 함수들
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(eventName: string, listener: () => void): void;
    dispatchEvent(eventName: string, ...args: any): void;
    getMainWS(): UnknownAny | undefined;
    isMobile(): boolean;
    assert(predicate: any, message: string): void;
    resizeElement(interfaceModel?: any): void;
    loadExternalModules(project: any): Promise<void>;
    bindAnimationCallbackOnce(element: any, func: () => void): void;
    createElement<K extends keyof HTMLElementTagNameMap>(
        type: HTMLElement | K,
        elementId?: string,
    ): HTMLElementTagNameMap[K];
    do(commandName: string, ...args: any[]): any;
} & IEntry.EntryOptions;
