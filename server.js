const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { networkInterfaces } = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit('user-connected', socket.id);
        });

        socket.on('offer', (payload) => {
            // payload: { target: socketId, sdp: sessionDescription }
            io.to(payload.target).emit('offer', {
                sdp: payload.sdp,
                caller: socket.id,
            });
        });

        socket.on('answer', (payload) => {
            // payload: { target: socketId, sdp: sessionDescription }
            io.to(payload.target).emit('answer', {
                sdp: payload.sdp,
                responder: socket.id,
            });
        });

        socket.on('ice-candidate', (payload) => {
            // payload: { target: socketId, candidate: candidate }
            io.to(payload.target).emit('ice-candidate', {
                candidate: payload.candidate,
                sender: socket.id,
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);

        // Log LAN IP for mobile connection
        const nets = networkInterfaces();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    console.log(`> Local Network: http://${net.address}:${port}`);
                }
            }
        }
    });
});
