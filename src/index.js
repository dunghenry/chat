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
let usersOnline = [];
io.on('connection', (socket) => {
    console.log('User connection ' + socket.id);
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
        }
    });
    socket.on('logout', () => {
        const filterUsersOnline = usersOnline.filter(
            (item) => item !== socket.username,
        );
        socket.broadcast.emit('update-usersOnline', filterUsersOnline);
        socket.emit('logout-sucess');
        usersOnline = filterUsersOnline;
    });
    socket.on('user-chat', (msg) => {
        if (socket.username) {
            socket.broadcast.emit('send-msg-users', {
                username: socket.username,
                msg,
            });
            socket.emit('send-msg-me', msg);
        }
    });
    socket.on('enter-msg', () => {
        socket.broadcast.emit('user-enter-msg', socket.username);
    });
    socket.on('end-enter-msg', () => {
        // console.log('end-enter-msg');
        // console.log(socket.username);
        socket.broadcast.emit('user-end-enter-msg');
    });
    socket.on('disconnect', () => {
        // usersOnline = usersOnline.filter(user => socket.username !== user);
        console.log('User disconnect :' + socket.id);
    });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
