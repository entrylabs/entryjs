var WebSocketClient = require('websocket').w3cwebsocket;

const GATEWAY_CONNECT_TIMEOUT = 5000;

const ADDR = {
    host: window.location.hostname,
    port: 4001,
};

export function voiceApiConnect(addr, cb) {
    return new Promise((resolve, reject) => {
        let returned = false;
        let { host, port } = ADDR;
        if (addr) {
            const addrToken = addr.split(':');
            host = addrToken[0];
            port = Number(addrToken[1]);
        }

        const client = new WebSocketClient(`ws://${host}:${port}`, 'echo-protocol');
        client.onerror = function(error) {
            console.log('Connect Error: ' + JSON.stringify(error));
        };
        client.onopen = function() {
            console.log('NSASR Voice Server Connected');
            resolve(client);
        };
        client.onclose = function() {
            console.log('closed');
        };
        client.onmessage = function(e) {
            if (typeof e.data === 'string') {
                console.log('Received String: ', e.data, ' ');
            } else {
                console.log('Received : ', e.data, ' ');
            }
        };
    });
}
