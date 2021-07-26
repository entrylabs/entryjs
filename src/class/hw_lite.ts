import { TextEncoder } from 'util';
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
        try {
            this.container += chunk;
            const lines = this.container.split(Entry.hwLite.hwModule.delimeter || '\r\n');
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
    private status: string;
    private port: SerialPort;
    private writer: SerialPort.writer;
    private reader: SerialPort.reader;
    private writableStream: any;
    public static hwModule?: EntryHardwareLiteBlockModule;
    static setExternalModule: any;
    static refreshHardwareLiteBlockMenu: any;
    static banClassAllHardwareLite: any;
    private playground: any;
    private connectionType: string;
    textEncoder: TextEncoder;

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

    setExternalModule(moduleObject: EntryHardwareLiteBlockModule) {
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

    async constantServing() {
        try {
            if (this.status === HardwareStatement.disconnected) {
                return;
            }
            const reqLocal = this.hwModule?.requestLocalData();
            if (reqLocal && this.status === HardwareStatement.connected) {
                this.writer.write(Buffer.from(reqLocal));
            }

            const { value, done } = await this.reader.read();

            this.hwModule?.handleLocalData(value);

            if (this.hwModule?.duration) {
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.constantServing();
                    }, this.hwModule.duration);
                });
            }
        } catch (err) {
            this.status === HardwareStatement.disconnected;
            console.log(err);
            this.disconnect();
            return;
        }
    }

    async connect() {
        if (this.status === HardwareStatement.connected) {
            return;
        }
        const port = await navigator.serial.requestPort();

        await port.open(
            this.hwModule?.portData || {
                baudRate: 9600,
                dataBits: 8,
                parity: 'none',
                bufferSize: 256,
                stopBits: 1,
                ...this.hwModule?.portData,
            }
        );
        this.port = port;
        if (this.hwModule?.portData?.connectionType === 'ascii') {
            const encoder = new TextEncoderStream();
            const writableStream = encoder.readable.pipeTo(port.writable);
            const writer = encoder.writable.getWriter();
            this.writableStream = writableStream;
            const writer = port.writable.getWriter();
            const lineReader = port.readable
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(
                    new TransformStream(
                        this.hwModule?.type !== 'master' &&
                            new LineBreakTransformer(this.hwModule?.delimeter)
                    )
                )
                .getReader();
            this.writer = writer;
            this.reader = lineReader;
        } else {
            this.writer = port.writable.getWriter();
            this.reader = port.readable.getReader();
        }

        this.connectionType = this.hwModule?.portData?.connectionType;

        this.status = HardwareStatement.connected;
        this.refreshHardwareLiteBlockMenu();
        if (this.hwModule?.portData?.constantServing) {
            this.constantServing();
        }
    }

    async disconnect() {
        try {
            await this.reader?.cancel();
            await this.writer?.abort();
            if (this.connectionType === 'ascii') {
                await this.writableStream;
            }
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

    async sendAsync(data?: Buffer | string, isResetReq?: boolean, callback?: Function) {
        if (!data) {
            return;
        }
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
            return value;
        } catch (err) {
            console.log(err);
        }
    }
}

Entry.HWLite = HardwareLite;
