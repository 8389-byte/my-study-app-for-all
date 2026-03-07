import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';

const app = express();
const bare = createBareServer('/sync-engine/'); 
const server = createServer();

const PORT = Number(process.env.PORT) || 8080;

// This tells the server to look inside the public folder for your portal
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
    console.log(`System Online on port ${PORT}`);
});
