const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9000 });

function noop() { }

function heartbeat() {
    console.log('in server heart beat')
    this.isAlive = true;
}

wss.on('connection', function connection(ws, req) {
    console.log('New client connected !!');

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    // gives the ip address
    const ip = req.socket.remoteAddress;
    console.log(ip);

    // below give the ip address, if using proxy
    // const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
    // console.log(ip);

    ws.send('hey you are connected to the server');

    ws.on('message', function incoming(message) {
        console.log('Received Message : ', message);

        ws.send('hello client')

        // server broadcast to all the clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toUpperCase());
            }
        })

        // server broadcast to all expect itself
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toUpperCase());
            }
        })
    })

    ws.on('close', function closed(code, reason) {
        console.log('Connection closed', code, reason);
    })

    ws.on('error', function error(err) {
        console.log('Error : ', err);
    })
})

wss.on('close', function close() {
    console.log('Server closed');
    clearInterval(interval);
});


const interval = setInterval(function ping() {
    console.log('in interval');
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

interval