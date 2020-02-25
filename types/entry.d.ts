declare class Entry {
    static HW: new () => IEntry.Hardware;
    static SVG: any;
    static moduleManager: any; //TODO
    static popupHelper: any; //TODO

    // 엔트리 내 클래스들
    static skeleton: { [name: string]: ISkeleton };
    static options: IEntry.EntryOptions;
    static toast: IEntry.WorkspaceToast;
    static playground: IEntry.Playground;
    static workspace: UnknownAny;
    static propertyPanel: IEntry.PropertyPanel;
    static container: IEntry.Container;
    static stage: IEntry.Stage;
    static Utils: UnknownAny;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 객체들
    static HARDWARE_LIST: { [hardwareName: string]: IEntry.HardwareModule };
    static EXTERNAL_MODULE_LIST?: string[];
    static events_: any;
    static requestUpdate: boolean;
    static TEXT_ALIGNS: string[];
    static TEXT_ALIGN_LEFT: number;
    static TEXT_ALIGN_CENTER: number;
    static TEXT_ALIGN_RIGHT: number;
    static block: { [blockName: string]: IEntry.EntryBlock };
    static hw: IEntry.Hardware; // HW instance

    // from init option
    static mediaFilePath: string;
    static moduleBaseUrl: string;

    // 엔트리에서 네임스페이스에 할당되어있는 특정 함수들
    static addEventListener: (type: string, listener: () => void) => void;
    static dispatchEvent(eventName: string, ...args: any): void;
    static getMainWS(): UnknownAny | undefined;
    static assert(predicate: any, message: string): void;
}
