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
        Entry.block.changeBlockText('arduino_lite_device_name', this.hwModule.title.ko);
        Entry.dispatchEvent('hwLiteChanged');
        if (Entry.propertyPanel && this.hwModule.monitorTemplate) {
            this._setHardwareMonitorTemplate();
        }
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
                this.banClassAllHardwareLite();
                break;
            case HardwareStatement.connected:
                blockMenu.banClass('arduinoLiteConnectFailed', true);
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.banClass('arduinoLiteGuide', true);
                blockMenu.unbanClass('arduinoLiteConnected', true);
                blockMenu.unbanClass(this.hwModule?.name, true);
                break;
            case HardwareStatement.connectFailed:
                blockMenu.banClass('arduinoLiteDisconnected', true);
                blockMenu.banClass('arduinoLiteConnected', true);
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.unbanClass('arduinoLiteConnectFailed', true);
                if (typeof this.hwModule?.id === 'string') {
                    if (ARDUINO_BOARD_IDS.includes(this.hwModule.id)) {
                        blockMenu.unbanClass('arduinoLiteGuide', true);
                    }
                } else if (this.hwModule?.id instanceof Array) {
                    for (const id in this.hwModule.id) {
                        if (ARDUINO_BOARD_IDS.includes(id)) {
                            blockMenu.unbanClass('arduinoLiteGuide', true);
                            return;
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
                this.hwMonitor
                    ? Lang.Msgs.hw_connection_success_desc
                    : Lang.Msgs.hw_connection_success_desc2
            );
        } catch (error) {
            console.error(error);
            Entry.toast.alert(
                Lang.Msgs.hw_module_terminaltion_title,
                Lang.Msgs.hw_module_terminaltion_desc,
                false
            );
            this.getConnectFailedMenu();
        }
    }

    async disconnect() {
        try {
            Entry.hardwareLiteBlocks = [];
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
            Entry.dispatchEvent('hwLiteChanged');
            Entry.toast.alert(
                Lang.Msgs.hw_module_terminaltion_title,
                Lang.Msgs.hw_module_terminaltion_desc,
                false
            );
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
                    Lang.Msgs.hw_module_terminaltion_title,
                    Lang.Msgs.hw_module_terminaltion_desc,
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
    addHardwareLiteModule(module: EntryHardwareLiteBlockModule) {
        Entry.do('objectAddHardwareLiteBlocks', module);
    }
    removeHardwareLiteModule() {
        Entry.do('objectRemoveHardwareLiteBlocks', this.hwModule);
    }
}

Entry.HWLite = HardwareLite;
