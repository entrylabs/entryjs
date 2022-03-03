import { TextEncoder } from 'util';
import ExtraBlockUtils from '../util/extrablockUtils';
import HardwareMonitor from './hardware/hardwareMonitor';
import hardwareLite from '../playground/blocks/hardwareLite';

enum HardwareStatement {
    disconnected = 'disconnected',
    connected = 'connected',
    willDisconnect = 'willDisconnect',
    connectFailed = 'connectFailed',
}

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
    private port: any; // serialport
    private writer: any; // SerialPort.writer;
    private reader: any; //SerialPort.reader;
    private writableStream: any;
    hwModule: EntryHardwareLiteBlockModule;
    static setExternalModule: any;
    static refreshHardwareLiteBlockMenu: any;
    static banClassAllHardwareLite: any;
    private playground: any;
    private connectionType: 'ascii' | 'bytestream' | undefined;
    textEncoder: TextEncoder;
    private hwMonitor?: HardwareMonitor;

    constructor(playground: any) {
        this.playground = playground;
        this.hwModule = null;
        this.status = HardwareStatement.disconnected;
        Entry.addEventListener('hwLiteChanged', this.refreshHardwareLiteBlockMenu.bind(this));
        this.setExternalModule.bind(this);
        this.initHardwareLiteList();
    }

    setZero() {
        this.hwModule?.setZero();
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
        Entry.dispatchEvent('hwLiteChanged');
        if (Entry.propertyPanel && this.hwModule.monitorTemplate) {
            this._setHardwareMonitorTemplate();
        }
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

    refreshHardwareLiteBlockMenu() {
        console.log(
            `Activate refreshHardwareLiteBlockMenu \nstatus : ${this.status}\nthis.hwModule : ${this.hwModule} `
        );
        const blockMenu = Entry.getMainWS()?.blockMenu;
        if (!blockMenu) {
            return;
        }

        switch (this.status) {
            case HardwareStatement.disconnected:
                blockMenu.banClass('arduinoLiteConnected', true);
                blockMenu.banClass('arduinoLiteConnectFailed', true);
                blockMenu.unbanClass('arduinoLiteDisconnected', true);
                blockMenu.unbanClass('arduinoDisconnected', true);
                this.banClassAllHardwareLite();
                Entry.moduleManager.moduleListLite = [];
                break;
            case HardwareStatement.connected:
                blockMenu.banClass('arduinoLiteConnectFailed', true);
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.unbanClass('arduinoLiteConnected', true);
                blockMenu.unbanClass(this.hwModule?.name, true);
                break;
            case HardwareStatement.connectFailed:
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoLiteConnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.unbanClass('arduinoLiteConnectFailed', true);
                this.banClassAllHardwareLite();
                break;
        }
        // blockMenu.hwLiteCodeOutdated = true;
        // blockMenu._generateHwLiteCode(true);
        blockMenu.hwCodeOutdated = true;
        blockMenu._generateHwCode(true);
        blockMenu.reDraw();
    }

    initHardwareLiteList() {
        // TO-DO : 추후 모듈화 적용시 외부모듈에서 가져오도록 수정예정
        hardwareLite.initHardwareLiteList();
    }

    async constantServing() {
        try {
            if (this.status === HardwareStatement.disconnected) {
                return;
            }
            if (this.hwModule?.portData?.constantServing !== 'ReadOnly') {
                const reqLocal = this.hwModule?.requestLocalData();
                if (reqLocal && this.status === HardwareStatement.connected) {
                    this.writer.write(Buffer.from(reqLocal));
                }
            }

            const { value, done } = await this.reader.read();
            this.hwModule?.handleLocalData(value);
            this._updatePortData();

            setTimeout(() => {
                this.constantServing();
            }, this.hwModule.duration || 0);
        } catch (error) {
            console.error(error);
            this.status = HardwareStatement.connectFailed;
            this.refreshHardwareLiteBlockMenu();
            return;
        }
    }

    async connect() {
        if (this.status === HardwareStatement.connected) {
            return;
        }
        // @ts-ignore
        try {
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
            // if () {
            //     const writableStream = encoder.readable.pipeTo(port.writable);
            //     const writer = encoder.writable.getWriter();
            //     this.writableStream = writableStream;
            //     const lineReader = port.readable
            //         .pipeThrough(new TextDecoderStream())
            //         .pipeThrough(new TransformStream(new LineBreakTransformer()))
            //         .getReader();
            //     this.writer = writer;
            //     this.reader = lineReader;
            // } else {
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
            // }

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
        } catch (error) {
            console.error(error);
            this.status = HardwareStatement.connectFailed;
            this.refreshHardwareLiteBlockMenu();
        }
    }

    async disconnect() {
        try {
            this.status = HardwareStatement.willDisconnect;
            await this.reader?.cancel();
            await this.writer?.abort();
            if (this.connectionType === 'ascii') {
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
            // this.refreshHardwareLiteBlockMenu();
            Entry.dispatchEvent('hwLiteChanged');
            // CHECK : 연결 해제시에도 toast 알림을 날려야 하는지? 한다면 종류는 뭘로
            // Entry.toast.alert(
            //     Lang.Workspace.hw_connection_termination_desc,
            //     Lang.Workspace.hw_connection_termination_desc2,
            //     false
            // );
        }
    }

    /**
     *
     * @param data
     * @returns Promise resolves to resulting message
     */

    async sendAsync(data?: Buffer | string, isResetReq?: boolean, callback?: Function) {
        if (!data) {
            return;
        }
        // @ts-ignore
        const encodedData = typeof data === 'string' ? data : Buffer.from(data, 'utf8');
        await this.connect();
        try {
            if (this.status === HardwareStatement.disconnected) {
                Entry.toast.alert(
                    Lang.Hw.hw_module_terminaltion_title,
                    Lang.Hw.hw_module_terminaltion_desc,
                    false
                );
                throw new Error('HARDWARE LITE NOT CONNECTED');
            }
            await this.writer.write(encodedData);

            if (isResetReq) {
                return;
            }
            const { value, done } = await this.reader.read();
            if (callback) {
                return callback(value);
            }
            this.hwModule?.handleLocalData(value);
            this._updatePortData();
            return value;
        } catch (err) {
            console.error(err);
        }
    }
    sendAsciiAsBuffer(asciiStr: string) {
        this.writer.write(Buffer.from(asciiStr, 'utf8'));
    }
}

Entry.HWLite = HardwareLite;
