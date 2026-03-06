import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';

const app = express();
// Stealth Path: Hides the proxy tunnel from firewall patterns
const bare = createBareServer('/sync-engine/'); 
const server = createServer();

// CRITICAL: Bind to Railway's dynamic port and 0.0.0.0
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

// Binding to '0.0.0.0' allows the Railway load balancer to find your app
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Portal Active: http://0.0.0.0:${PORT}`);
});
