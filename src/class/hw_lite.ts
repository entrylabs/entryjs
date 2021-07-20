import ExtraBlockUtils from '../util/extrablockUtils';

enum HardwareStatement {
    disconnected = 'disconnected',
    connected = 'connected',
}

class LineBreakTransformer {
    private container: string;
    constructor() {
        this.container = '';
    }

    transform(chunk: string, controller: any) {
        this.container += chunk;
        const lines = this.container.split('\r\n');
        this.container = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller: any) {
        controller.enqueue(this.container);
    }
}

export default class HardwareLite {
    private status: string;
    private port: SerialPort;
    private writer: SerialPort.writer;
    private reader: SerialPort.reader;
    private writableStream: any;
    public hwModule?: EntryHardwareBlockModule;
    static setExternalModule: any;
    static refreshHardwareLiteBlockMenu: any;
    static banClassAllHardwareLite: any;
    private playground: any;

    constructor(playground: any) {
        this.playground = playground;
        this.status = HardwareStatement.disconnected;
        Entry.addEventListener('hwLiteChanged', this.refreshHardwareLiteBlockMenu.bind(this));
        this.setExternalModule.bind(this);
        this.getHardwareList();
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

    setExternalModule(moduleObject: EntryHardwareBlockModule) {
        this.hwModule = moduleObject;
        this.banClassAllHardwareLite();
        Entry.dispatchEvent('hwLiteChanged');
        this.refreshHardwareLiteBlockMenu();
    }

    refreshHardwareLiteBlockMenu() {
        const blockMenu = Entry.getMainWS()?.blockMenu;
        if (!blockMenu) {
            return;
        }
        if (this.status === HardwareStatement.disconnected) {
            blockMenu.banClass('arduinoLiteConnected', true);
            blockMenu.unbanClass('arduinoLiteConnect', true);
        } else {
            blockMenu.unbanClass('arduinoLiteConnected', true);
            blockMenu.banClass('arduinoLiteConnect', true);
        }

        if (!this.hwModule) {
            // NOTE 이 코드는 하드웨어 블록 초기화 작업도 겸하므로 삭제금지
            this.banClassAllHardwareLite();
        }
        if (this.hwModule) {
            blockMenu.unbanClass(this.hwModule?.name, true);
        }
        blockMenu.hwLiteCodeOutdated = true;
        blockMenu._generateHwLiteCode(true);
        blockMenu.reDraw();
    }

    async getHardwareList() {
        const list = await fetch(`${Entry.moduleliteBaseUrl}`);
        const parsed = await list.json();
        Entry.HARDWARE_LITE_LIST = parsed.map((item: any) => {
            return {
                ...item,
                imageName: `${Entry.moduleliteBaseUrl}${item.name}/files/image`,
            };
        });
    }

    async connect(hwJson?: IHardwareModuleConfig) {
        if (this.status === HardwareStatement.connected) {
            return;
        }
        const port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            bufferSize: 512,
        });
        this.port = port;
        const portInfo = port.getInfo();
        // Microbit에서만 적용되는 코드, ascii 통신용
        if (portInfo.usbProductId === 516 && portInfo.usbVendorId === 3368) {
            const encoder = new TextEncoderStream();
            const writableStream = encoder.readable.pipeTo(port.writable);
            const writer = encoder.writable.getWriter();
            this.writer = writer;
            this.writableStream = writableStream;
            const lineReader = port.readable
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();
            this.reader = lineReader;
        } else {
            this.writer = port.writable.getWriter();
            this.reader = port.readable.getReader();
        }
        try {
            await this.getHardwareList();
        } catch (err) {
            console.log(err);
        }

        this.status = HardwareStatement.connected;
        this.refreshHardwareLiteBlockMenu();
    }

    async disconnect() {
        try {
            await this.reader?.cancel();
            await this.writer?.abort();
            if (this.writableStream) {
                await this.writableStream;
            }
            await this.writer?.close();
        } catch (err) {
            console.log(err);
        } finally {
            await this.port?.close();
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.writableStream = null;
            this.refreshHardwareLiteBlockMenu();
            this.status = HardwareStatement.disconnected;
            Entry.dispatchEvent('hwLiteChanged');
            Entry.toast.alert(
                Lang.Hw.hw_module_terminaltion_title,
                Lang.Hw.hw_module_terminaltion_desc,
                false
            );
        }
    }

    /**
     *
     * @param data
     * @returns Promise resolves to resulting message
     */

    async sendAsync(data?: Buffer | string, isResetReq?: boolean) {
        await this.connect();
        if (this.status === HardwareStatement.disconnected) {
            Entry.toast.alert(
                Lang.Hw.hw_module_terminaltion_title,
                Lang.Hw.hw_module_terminaltion_desc,
                false
            );
            throw new Error('HARDWARE LITE NOT CONNECTED');
        }

        if (!data) {
            return;
        }
        this.writer.write(data);
        if (isResetReq) {
            return;
        }
        const { value, done } = await this.reader.read();
        console.log('[received]', value);
        return value;
    }
}

Entry.HWLite = HardwareLite;
