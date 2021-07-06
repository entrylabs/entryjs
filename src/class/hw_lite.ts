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

    constructor() {
        this.status = HardwareStatement.disconnected;
        navigator.serial.addEventListener('connect', (e) => {
            // Connect to `e.target` or add it to a list of available ports.
            console.log(e);
        });

        navigator.serial.addEventListener('disconnect', (e) => {
            // Remove `e.target` from the list of available ports.
            console.log(e);
        });
    }
    async connect(hwJson: IHardwareModuleConfig) {
        // if (this.status === HardwareStatement.connected) {
        //     return;
        // }
        const port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            bufferSize: 512,
        });
        this.port = port;
        // if (hwJson.commType === 'ascii') {
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
        // this.writer = port.writable.getWriter();
        // this.reader = port.readable.getReader();
        //   }

        this.status = HardwareStatement.connected;
        // this.disconnect();
        await this.reader.cancel();
        await this.writableStream;
    }

    async disconnect() {
        try {
            await this.reader?.cancel();
            await this.writer?.abort();
            await this.writableStream;
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
        }
    }

    /**
     *
     * @param data
     * @returns Promise resolves to resulting message
     */

    async send(data?: Buffer | string) {
        if (!data) {
            return;
        }

        this.writer.write(data);
        const { value, done } = await this.reader.read();
        console.log('[received]', value);
        return value;
    }
}

// Entry.hwLite.connect();
// Entry.hwLite.send();
// Entry.hwLite.disconnect();
// Entry.hwLite.writer.close();
// Entry.hwLite.port.close();

Entry.HWLite = HardwareLite;
