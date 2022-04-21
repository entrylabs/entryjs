import throttle from 'lodash/throttle';
import { TextEncoder } from 'util';
import ExtraBlockUtils from '../util/extrablockUtils';
import HardwareMonitor from './hardware/hardwareMonitor';

enum HardwareStatement {
    disconnected = 'disconnected',
    connected = 'connected',
    willDisconnect = 'willDisconnect',
    connectFailed = 'connectFailed',
}

const ARDUINO_BOARD_IDS: string[] = ['1.1', '4.2', '8.1'];

class LineBreakTransformer {
    private container: string;
    constructor() {
        this.container = '';
    }

    transform(chunk: string, controller: any) {
        try {
            this.container += chunk;
            // @ts-ignore
            const lines = this.container.split(Entry.hwLite?.hwModule?.delimeter || '\r\n');
            this.container = lines.pop();
            lines.forEach((line) => controller.enqueue(line));
        } catch (e) {
            controller.enqueue(chunk);
        }
    }

    flush(controller: any) {
        controller.enqueue(this.container);
    }
}

export default class HardwareLite {
    private status: HardwareStatement;
    private HardwareStatement: any;
    private port: any; // serialport
    private writer: any; // SerialPort.writer;
    private reader: any; //SerialPort.reader;
    private writableStream: any;
    hwModule: EntryHardwareLiteBlockModule;
    static setExternalModule: any;
    static refreshHardwareLiteBlockMenu: any;
    static banClassAllHardwareLite: any;
    static isHwLiteSupportAgent: any;
    private playground: any;
    private connectionType: 'ascii' | 'bytestream' | undefined;
    textEncoder: TextEncoder;
    private hwMonitor?: HardwareMonitor;
    private isSendAsyncRun: boolean;
    private sendAsyncWithThrottle: any;

    constructor(playground: any) {
        this.playground = playground;
        this.hwModule = null;
        this.status = HardwareStatement.disconnected;
        this.HardwareStatement = HardwareStatement;
        this.isSendAsyncRun = false;
        Entry.addEventListener('hwLiteChanged', this.refreshHardwareLiteBlockMenu.bind(this));
        Entry.addEventListener('beforeStop', this.checkConditionBeforeStop.bind(this));
        this.setExternalModule.bind(this);
    }

    setZero() {
        this.hwModule?.setZero();
    }

    checkConditionBeforeStop(){
        this.isSendAsyncRun = false;
    }

    isActive(name: string) {
        if (this.hwModule) {
            const data = {};
            // @ts-ignore
            data[name] = this.hwModule;
            return ExtraBlockUtils.isActive(name, data);
        }
        return false;
    }
    /**
     * 모든 하드웨어를 숨김처리한다. 현재 연결된 하드웨어도 예외는 없다.
     * @private
     */
    banClassAllHardwareLite() {
        const workspace = Entry.getMainWS();
        const blockMenu = workspace && workspace.blockMenu;
        if (!blockMenu) {
            return;
        }
        Object.values(Entry.HARDWARE_LITE_LIST || {}).forEach((hardware: any) => {
            blockMenu.banClass(hardware.name, true);
        });
        ExtraBlockUtils.banAllBlocks(this.playground, Entry.HARDWARE_LITE_LIST);
        blockMenu.reDraw();
    }

    setExternalModule(moduleObject: EntryHardwareLiteBlockModule) {
        this.hwModule = moduleObject;
        this.banClassAllHardwareLite();
        Entry.block.changeBlockText('arduino_lite_device_name', this.hwModule.title.ko);
        Entry.dispatchEvent('hwLiteChanged');
        if (Entry.propertyPanel && this.hwModule.monitorTemplate) {
            this._setHardwareMonitorTemplate();
        }
        this.sendAsyncWithThrottle = throttle(this.sendAsync, this.hwModule.duration);
    }

    getConnectFailedMenu() {
        this.status = HardwareStatement.connectFailed;
        this.refreshHardwareLiteBlockMenu();
    }

    setFirmwareDownloadButton(callback: Function) {
        const workspace = Entry.getMainWS();
        const blockMenu = workspace && workspace.blockMenu;
        if (!blockMenu) {
            return;
        }
        Entry.block.changeBlockEvent('arduino_lite_download_firmware', 'mousedown', callback);
        blockMenu.changeTypeThreadByBlockKey('arduino_lite_download_firmware');
    }

    private _setHardwareMonitorTemplate() {
        if (!this.hwMonitor) {
            this.hwMonitor = new HardwareMonitor(this.hwModule);
        } else {
            this.hwMonitor.setHwModule(this.hwModule);
            this.hwMonitor.initView();
        }
        Entry.propertyPanel.addMode('hw', this.hwMonitor);
        this.hwMonitor.generateViewByMode();
    }

    _updatePortData() {
        if (this.hwMonitor && Entry.propertyPanel && Entry.propertyPanel.selected === 'hw') {
            this.hwMonitor.update(this.hwModule.getMonitorPort(), null);
        }
    }

    isHwLiteSupportAgent() {
        const userAgentString = navigator.userAgent.toLowerCase();
        return userAgentString.indexOf('chrome') >= 0 && userAgentString.indexOf('window') < 0;
    }

    refreshHardwareLiteBlockMenu() {
        const blockMenu = Entry.getMainWS()?.blockMenu;
        if (!blockMenu) {
            return;
        }

        switch (this.status) {
            case HardwareStatement.disconnected:
                blockMenu.banClass('arduinoLiteConnected', true);
                blockMenu.banClass('arduinoLiteConnectFailed', true);
                blockMenu.banClass('arduinoLiteGuide', true);
                blockMenu.unbanClass('arduinoLiteDisconnected', true);
                blockMenu.unbanClass('arduinoDisconnected', true);
                this.isHwLiteSupportAgent()
                    ? blockMenu.unbanClass('arduinoLiteSupported', true)
                    : blockMenu.banClass('arduinoLiteSupported', true);
                this.banClassAllHardwareLite();
                break;
            case HardwareStatement.connected:
                blockMenu.banClass('arduinoLiteConnectFailed', true);
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.banClass('arduinoLiteSupported', true);
                blockMenu.banClass('arduinoLiteGuide', true);
                blockMenu.unbanClass('arduinoLiteConnected', true);
                blockMenu.unbanClass(this.hwModule?.name, true);
                break;
            case HardwareStatement.connectFailed:
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoLiteConnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.banClass('arduinoLiteSupported', true);
                blockMenu.unbanClass('arduinoLiteConnectFailed', true);
                if (typeof this.hwModule?.id === 'string') {
                    if (ARDUINO_BOARD_IDS.includes(this.hwModule.id)) {
                        blockMenu.unbanClass('arduinoLiteGuide', true);
                    }
                } else if (this.hwModule?.id instanceof Array) {
                    for (const id in this.hwModule.id) {
                        if (ARDUINO_BOARD_IDS.includes(this.hwModule.id[id])) {
                            blockMenu.unbanClass('arduinoLiteGuide', true);
                            break;
                        }
                    }
                }
                this.banClassAllHardwareLite();
                break;
        }
        blockMenu.hwCodeOutdated = true;
        blockMenu._generateHwCode(true);
        blockMenu.reDraw();
    }

    async readPortData() {
        try {
            if (this.status === HardwareStatement.connected && Entry.engine.isState('run')) {
                const { value, done } = await this.reader.read();

                if (!value) {
                    this.reader.cancel();
                    throw new Error("reader's value is undefined. check device");
                }
                return value;
            }
        } catch (error) {
            console.error(error);
            this.getConnectFailedMenu();
        }
    }

    async writePortData(data: string) {
        if (data && this.status === HardwareStatement.connected) {
            const result = await this.writer.write(Buffer.from(data));
        }
    }

    async removeSerialPort() {
        try {
            // INFO: 디바이스가 제거되었을 때, reader만 단독 예외처리
            await this.reader?.cancel().catch((error: any) => {
                console.error(error);
            });

            await this.writer?.close();
            if (this.connectionType === 'ascii' && this.writableStream) {
                await this.writableStream;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.port?.close();
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.writableStream = null;
        }
    }

    // engine 동작중 에러 발생시 호출, 디바이스에 read, write가 모두 안되는 것이 전제
    async handleConnectErrorInEngineRun() {
        // INFO: Engin.toggleStop에서 setZero가 실행되지 않도록 상태변경
        if (this.status === HardwareStatement.willDisconnect) {
            return;
        }
        this.status = HardwareStatement.willDisconnect;
        if (Entry.engine.isState('run')) {
            await Entry.engine.toggleStop();
        }
        await this.removeSerialPort();
        this.getConnectFailedMenu();
        Entry.toast.alert(
            Lang.Msgs.hw_connection_failed_title,
            Lang.Msgs.hw_connection_failed_desc,
            false
        );
    }

    /**
     * 디바이스와 duration 간격으로 지속적 통신
     */
    async constantServing() {
        try {
            if (this.status === HardwareStatement.disconnected) {
                return;
            }
            if (this.hwModule?.portData?.constantServing !== 'ReadOnly') {
                const reqLocal = this.hwModule?.requestLocalData();
                if (reqLocal && this.status === HardwareStatement.connected) {
                    if (Entry.engine.isState('run')) {
                        this.writer.write(Buffer.from(reqLocal));
                    }
                }
            }

            const { value, done } = await this.reader.read();
            if (done) {
                this.getConnectFailedMenu();
                return;
            }
            this.hwModule?.handleLocalData(value);
            this._updatePortData();

            setTimeout(() => {
                this.constantServing();
            }, this.hwModule.duration || 0);
        } catch (error) {
            console.error(error);
            this.getConnectFailedMenu();
            return;
        }
    }

    async connect() {
        if (this.status === HardwareStatement.connected) {
            return;
        }

        try {
            // @ts-ignore
            const port = await navigator.serial.requestPort();
            const { portData } = this.hwModule || {};
            await port.open(
                portData || {
                    baudRate: 9600,
                    dataBits: 8,
                    parity: 'none',
                    bufferSize: 256,
                    stopBits: 1,
                }
            );
            this.port = port;
            const encoder = new TextEncoderStream();
            const writable = port.writable;

            this.connectionType = portData?.connectionType;
            if (portData?.writeAscii || portData?.connectionType === 'ascii') {
                const writableStream = encoder.readable.pipeTo(writable);
                this.writableStream = writableStream;
                this.writer = encoder.writable.getWriter();
            } else {
                this.writer = port.writable.getWriter();
            }

            let readable = port.readable;
            if (portData?.readAscii || this.connectionType === 'ascii') {
                readable = readable.pipeThrough(new TextDecoderStream());
            }
            if (this.hwModule?.delimeter || this.connectionType === 'ascii') {
                readable = readable.pipeThrough(new TransformStream(new LineBreakTransformer()));
            }
            this.reader = readable.getReader();

            this.status = HardwareStatement.connected;
            this.refreshHardwareLiteBlockMenu();
            if (this.hwModule?.initialHandshake) {
                const result = await this.hwModule.initialHandshake();
                if (!result) {
                    throw new Error('Handshake Error : 디바이스와 연결에 실패하였습니다.');
                }
            }
            if (portData?.constantServing) {
                this.constantServing();
            }

            Entry.toast.success(
                Lang.Msgs.hw_connection_success,
                Lang.Msgs.hw_connection_success_desc2
            );
        } catch (error) {
            console.error(error);
            Entry.toast.alert(
                Lang.Msgs.hw_connection_failed_title,
                Lang.Msgs.hw_connection_failed_desc,
                false
            );
            this.getConnectFailedMenu();
        }
    }

    async disconnect() {
        try {
            Entry.hardwareLiteBlocks = [];
            this.status = HardwareStatement.willDisconnect;

            // INFO: 디바이스가 제거되었을 때, reader만 단독 예외처리
            await this.reader?.cancel().catch((error: any) => {
                console.error(error);
            });

            await this.writer?.close();
            if (this.connectionType === 'ascii' && this.writableStream) {
                await this.writableStream;
            }
        } catch (err) {
            console.error(err);
        } finally {
            await this.port?.close();
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.writableStream = null;
            this.hwModule = null;
            this.status = HardwareStatement.disconnected;
            Entry.dispatchEvent('hwLiteChanged');
            Entry.toast.alert(
                Lang.Msgs.hw_connection_termination_title,
                Lang.Msgs.hw_connection_termination_desc,
                false
            );
        }
    }

    /**
     * 디바이스와 1회성 통신
     * @param data
     * @returns Promise resolves to resulting message
     */
    async sendAsync(data?: Buffer | string, isResetReq?: boolean, callback?: Function) {
        if (this.isSendAsyncRun) {
            return;
        } else {
            this.isSendAsyncRun = true;
        }
        if (!data || this.status !== HardwareStatement.connected) {
            return;
        }
        // @ts-ignore
        const encodedData = typeof data === 'string' ? data : Buffer.from(data, 'utf8');

        try {
            if (this.status !== HardwareStatement.connected) {
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    Lang.Msgs.hw_connection_failed_desc,
                    false
                );
                throw new Error('HARDWARE LITE NOT CONNECTED');
            }
            await this.writer.write(encodedData);
            if (isResetReq) {
                this.isSendAsyncRun = false;
                return;
            }
            const { value, done } = await this.reader.read();
            if (callback) {
                return callback(value);
            }
            this._updatePortData();
            return value;
        } catch (err) {
            console.error(err);
            this.getConnectFailedMenu();
        }finally{
            this.isSendAsyncRun = false;
        }
    }
    sendAsciiAsBuffer(asciiStr: string) {
        this.writer.write(Buffer.from(asciiStr, 'utf8'));
    }
    addHardwareLiteModule(module: EntryHardwareLiteBlockModule) {
        Entry.do('objectAddHardwareLiteBlocks', module);
    }
    removeHardwareLiteModule() {
        Entry.do('objectRemoveHardwareLiteBlocks', this.hwModule);
    }

    update() {
        if (this.status !== HardwareStatement.connected) {
            console.error('Cannot update hwLite queue. Check connection status.');
            return;
        }
        if (this.hwModule?.portData?.constantServing) {
            const reqLocal = this.hwModule?.requestLocalData();
            if (reqLocal) {
                this.writer.write(Buffer.from(reqLocal));
            }
        }
    }
}

Entry.HWLite = HardwareLite;
