import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';

const app = express();
const bare = createBareServer('/sync-engine/'); 
const server = createServer();

// Railway injects the PORT. We bind to 0.0.0.0 so the network can find it.
const PORT = Number(process.env.PORT) || 8080;

app.use(express.static(path.join(process.cwd(), 'public')));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Portal Active on port ${PORT}`);
});
