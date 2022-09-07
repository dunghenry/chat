const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Server } = require('socket.io');
const routes = require('./routes');
const viewEngine = require('./configs/viewEngine');
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4000;
viewEngine(app);
routes(app);
const usersOnline = [];
io.on('connection', (socket) => {
    console.log('User connected successfully!');
    console.log(socket.id);
    socket.on('register', (user) => {
        const username = user.trim();
        const rs = usersOnline.includes(username);
        if (rs) {
            console.log('Error');
            socket.emit('register-failure');
        } else {
            usersOnline.push(username);
            socket.emit('register-success', username);
            socket.username = username;
            io.sockets.emit('send-usersOnline', usersOnline);
            // console.log(usersOnline);
        }
    });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
