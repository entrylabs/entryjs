/// <reference path="./index.d.ts" />

/**
 * 엔트리 실제 인스턴스에 대한 정의
 */

declare var Entry: {
    HW: new () => IEntry.Hardware;
    Intro: new () => IEntry.Intro;
    PropertyPanel: new () => IEntry.PropertyPanel;
    BlockView: any;
    Dom: EntryDomConstructor;
    SVG: any;
    moduleManager: any; //TODO
    popupHelper: any; //TODO

    // 엔트리 내 클래스들
    skeleton: { [name: string]: ISkeleton };
    options: IEntry.EntryOptions;
    toast: IEntry.WorkspaceToast;
    playground: IEntry.Playground;
    workspace: UnknownAny;
    propertyPanel: IEntry.PropertyPanel;
    container: IEntry.Container;
    stage: IEntry.Stage;
    Utils: UnknownAny;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 객체들
    HARDWARE_LIST: { [hardwareName: string]: any };
    EXTERNAL_MODULE_LIST?: string[];
    events_: any;
    requestUpdate: boolean;
    TEXT_ALIGNS: string[];
    TEXT_ALIGN_LEFT: number;
    TEXT_ALIGN_CENTER: number;
    TEXT_ALIGN_RIGHT: number;
    block: { [blockName: string]: any };
    hw: IEntry.Hardware; // HW instance
    disposeEvent: any; // Entry.Event instance
    documentMousemove: any; // Entry.Event instance

    // from init option
    mediaFilePath: string;
    moduleBaseUrl: string;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 함수들
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(eventName: string, listener: () => void): void;
    dispatchEvent(eventName: string, ...args: any): void;
    getMainWS(): UnknownAny | undefined;
    assert(predicate: any, message: string): void;
    resizeElement(interfaceModel: any): void;
};
