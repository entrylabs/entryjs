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

    constructor() {
        this.status = HardwareStatement.disconnected;
        navigator.serial.addEventListener('connect', (e) => {
            // Connect to `e.target` or add it to a list of available ports.
            console.log(e);
            alert('WDF');
        });

        navigator.serial.addEventListener('disconnect', (e) => {
            // Remove `e.target` from the list of available ports.
            console.log(e);
            alert('DISCONNECTED');
        });
        Entry.addEventListener('hwLiteChanged', this.refreshHardwareLiteBlockMenu.bind(this));
    }

    /**
     * 모든 하드웨어를 숨김처리한다. 현재 연결된 하드웨어도 예외는 없다.
     * @private
     */
    private _banClassAllHardware() {
        const workspace = Entry.getMainWS();
        const blockMenu = workspace && workspace.blockMenu;
        if (!blockMenu) {
            return;
        }

        Object.values(Entry.HARDWARE_LITE_LIST || {}).forEach((hardware: any) => {
            blockMenu.banClass(hardware.name, true);
        });
    }

    setExternalModule(moduleObject: EntryHardwareBlockModule) {
        this.hwModule = moduleObject;
        this._banClassAllHardware();
        Entry.dispatchEvent('hwLiteChanged');
    }

    refreshHardwareLiteBlockMenu() {
        const workspace = Entry.getMainWS();
        const blockMenu = workspace && workspace.blockMenu;

        if (!blockMenu) {
            return;
        }

        this._banClassAllHardware();

        blockMenu.hwLiteCodeOutdated = true;
        blockMenu._generateHwLiteCode(true);
        blockMenu.reDraw();
    }

    async getHardwareList() {}

    async connect(hwJson: IHardwareModuleConfig) {
        if (this.status === HardwareStatement.connected) {
            alert('이미 연결 되어있습니다.');
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
        // if (hwJson?.commType === 'ascii') {
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
        // } else {
        //     this.writer = port.writable.getWriter();
        //     this.reader = port.readable.getReader();
        // }

        this.status = HardwareStatement.connected;
    }

    async disconnect() {
        try {
            if (this.writableStream) {
                await this.reader?.cancel();
                await this.writer?.abort();
                await this.writableStream;
            }
            await this.writer?.close();

            this.reader = null;
            this.writer = null;
            this.writableStream = null;
            this.status = HardwareStatement.disconnected;
        } catch (err) {
            console.log(err);
        } finally {
            await this.port?.close();
            this.port = null;
            alert('연결 해제 되었습니다.');
        }
    }

    /**
     *
     * @param data
     * @returns Promise resolves to resulting message
     */

    async sendAsync(data?: Buffer | string) {
        if (!data) {
            return;
        }
        this.writer.write(data);
        const { value, done } = await this.reader.read();
        console.log('[received]', value);
        return value;
    }
}

Entry.HWLite = HardwareLite;
