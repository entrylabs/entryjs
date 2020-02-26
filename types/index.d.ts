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

declare interface EntryDomOptions {
    id?: string;
    class?: string;
    classes?: string[];
    text?: string;
    src?: string;
    href?: string;
    parent?: EntryDom;
}

declare interface EntryDom extends JQuery {
    bindOnClick?: (e: any) => this;
}

declare type EntryDomConstructor = (
    tag: string | HTMLElement | JQuery,
    options?: EntryDomOptions
) => EntryDom;

interface HardwareMessageData extends HardwareModuleId {
    [key: string]: any;
}

interface HardwareModuleId {
    company: string;
    model: string;
}

type WebSocketMessage = {
    data: string;
    mode: number;
    type: 'utf8';
};

declare module IEntry {
    export const Dom: EntryDomConstructor;

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

    export interface ExternalModuleManager {
        loadExternalModule(moduleName: string): Promise<void>;
        registerHardwareModule(moduleObject: HardwareModule): void;
    }

    /**
     * 외부에 노출될 수 있는 하드웨어 클래스 내 변수 및 함수 정의
     */
    export interface Hardware {
        portData: UnknownAny;
        sendQueue: UnknownAny;
        update: () => void;
        closeConnection: () => void;
        downloadConnector: () => void;
        downloadGuide: () => void;
        downloadSource: () => void;
        setZero: () => void;
        checkDevice: (data: HardwareMessageData) => void;
        openHardwareDownloadPopup: () => void;
        setExternalModule: (moduleObject: IEntry.HardwareModule) => void;
        onReceiveData?: (portData: any) => void;
    }

    /**
     * 엔트리 워크스페이스에 존재하는 하드웨어 모듈
     * 블록 및 하드웨어모니터 UI 정보, 통신 로직을 가지고있음
     */
    export interface HardwareModule {
        id: HardwareModuleId;
        name: string;
        monitorTemplate?: UnknownAny;
        communicationType?: string;
        sendMessage?: (hw: Hardware) => void;

        // 필수 함수 목록
        setZero: () => void;
        getBlocks: () => { [blockName: string]: EntryBlock };
        blockMenuBlocks: string[];
        setLanguage: () => {
            [langType: string]: { [type: string]: { [templateName: string]: string } };
        };

        //TODO afterSend, dataHandler 의 목적이 모호하므로 추후 개선 필요
        afterReceive?: (portData: HardwareMessageData) => void; // 데이터 수신 이후
        afterSend?: (sendQueue: HardwareMessageData) => void; // 데이서 송신 이후
        dataHandler?: (data: HardwareMessageData) => void;
    }

    export interface EntryBlock {
        color: string;
        outerLine?: string;
        skeleton: string;
        statements: any[];
        params: {
            type: string;
            img?: string;
            size: number;
            value?: number;
            fontSize?: number;
            bgColor?: string;
            arrowColor?: string;
            position?: { x: number; y: number };
        };
    }
    // Entry namespace 에 필요한 객체가 있으면 추가해주세요.
}
