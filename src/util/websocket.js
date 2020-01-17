import audioUtils from './audioUtils';
import io from 'socket.io-client';

const GATEWAY_CONNECT_TIMEOUT = 5000;

const ADDR = {
    host: window.location.hostname,
    port: 4001,
};

export function voiceApiConnect(addr = ADDR, language = 'Kor', cb) {
    return new Promise((resolve, reject) => {
        const { host, port } = ADDR;
        const client = io.connect(`https://${host}:${port}`, {
            query: `language=${language}`,
            secure: true,
            reconnect: true,
            rejectUnauthorized: false,
        });
        client.onerror = function(error) {
            console.log('Connect Error: ' + JSON.stringify(error));
        };
        client.on('open', () => {
            console.log('NSASR Voice Server Connected');
            resolve(client);
        });
        client.on('disconnect', () => {
            Entry.engine.hideAllAudioPanel();
            console.log('closed');
            audioUtils.isRecording = false;
        });
    });
}
