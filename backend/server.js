const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');

const app = express();
const reacturl = 'http://192.168.4.10:3000';

app.use(cors());  

const server = http.createServer(app);  

app.get('/', (req, res) => {
    console.log('HIII');
    res.send("Server is running");  
});

const io = new Server(server, {
    cors: {
        origin: reacturl,
        methods: ['GET', 'POST'],
    },
});

io.on('connect', (socket) => {
    socket.on('send-message', (message, naam) => {
        socket.broadcast.emit('recieve-message', message, naam);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, ' disconnected');
    });
});

server.listen(4008, () => console.log("Listening on port 4008"));
