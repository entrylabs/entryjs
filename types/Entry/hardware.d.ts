/// <reference path="../index.d.ts" />

/**
 * 엔트리 하드웨어 관련 타입 선언이 포함된 목록
 */

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

declare module Entry {
    export var HWMonitor: HardwareMonitor;
    export var moduleManager: any; //TODO
    export var popupHelper: any; //TODO

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
        sendMessage?: (hw: Hardware) => void;
        setZero: () => void;

        //TODO afterSend, dataHandler 의 목적이 모호하므로 추후 개선 필요
        afterReceive?: (portData: HardwareMessageData) => void; // 데이터 수신 이후
        afterSend?: (sendQueue: HardwareMessageData) => void; // 데이서 송신 이후
        dataHandler?: (data: HardwareMessageData) => void;
    }

    /**
     * 하드웨어 모니터 프로퍼티 패널 오브젝트
     * 하드웨어가 연결되면 필요여부에 따라 프로퍼티패널에 하드웨어 모니터가 노출됨
     */
    export interface HardwareMonitor {
        new (hwModule: HardwareModule): HardwareMonitor;
        initView: () => void;
        generateView: () => void;
        generateListView: () => void;
        toggleMode: (mode: string) => void; // 'list' || 'both'?
        setHwModule: (hwModule: HardwareModule) => void;
        update: (portData: UnknownAny, sendQueue: UnknownAny) => void;
    }
}
