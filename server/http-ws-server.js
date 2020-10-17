const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('New Client Connected');

    ws.send('hey you are connected to the server');

    ws.on('message', function incoming(message) {
        console.log('Received Message : ', message);

        ws.send('hello client');
    })

    ws.on('close', function close(code, reason) {
        console.log('Connect Closed : ', code, reason);
    })

    ws.on('error', function error(err) {
        console.log('Error : ', err);
    })
})

server.listen(9000);