const io = require('socket.io-client');
const GATEWAY_CONNECT_TIMEOUT = 5000;

const ADDR = {
    host: window.location.hostname,
    port: 4001,
};

export function voiceApiConnect(addr = ADDR, cb) {
    return new Promise((resolve, reject) => {
        const { host, port } = ADDR;

        const client = io.connect(`ws://${host}:${port}`);
        client.onerror = function(error) {
            console.log('Connect Error: ' + JSON.stringify(error));
        };
        client.on('open', () => {
            console.log('NSASR Voice Server Connected');
            resolve(client);
        });
        client.on('disconnect', () => {
            console.log('closed');
        });
    });
}
