document.addEventListener(
    'DOMContentLoaded',
    function () {
        const socket = io('http://localhost:4000');
        let userLogin = '';
        let isDisplayChat = false;
        const chatForm = document.querySelector('.chatForm');
        const loginForm = document.querySelector('.loginForm');
        const currentUser = document.querySelector('.currentUser');
        const btnLogout = document.querySelector('#btnLogout');
        const username = document.getElementById('username');
        const btnRegister = document.getElementById('btnRegister');
        const btnSend = document.querySelector('#btnSend');
        const chatMsg = document.querySelector('#chatMsg');
        const listMsg = document.querySelector('.listMsg');
        socket.on('user-enter-msg', function (username) {
            if (username) {
                let notifi = document.querySelector('#notification');
                notifi.textContent = username;
                let img = document.createElement('img');
                img.src = './images/msg.gif';
                img.setAttribute('id', 'notification');
                img.style.height = '30px';
                notifi.appendChild(img);
            }
        });
        socket.on('user-end-enter-msg', () => {
            let notifi = document.querySelector('#notification');
            notifi.innerHTML = '';
        });
        chatMsg.onblur = function () {
            socket.emit('end-enter-msg');
        };

        chatMsg.onfocus = function () {
            socket.emit('enter-msg');
        };

        socket.on('send-msg-users', (data) => {
            let div = document.createElement('div');
            div.className = 'msgUserOther';
            div.textContent = data.username;
            let pChild = document.createElement('p');
            pChild.className = 'msg';
            pChild.textContent = data.msg;
            div.appendChild(pChild);
            listMsg.appendChild(div);
        });
        socket.on('send-msg-me', (msg) => {
            chatMsg.value = '';
            let div = document.createElement('div');
            const br = document.createElement('br');
            div.className = 'msgMe';
            div.textContent = msg;
            listMsg.appendChild(div);
        });
        socket.on('register-failure', () => {
            alert('Username is already exits!');
        });

        socket.on('register-success', (username) => {
            isDisplayChat = true;
            userLogin = username;
            render();
            currentUser.textContent = username;
        });
        socket.on('send-usersOnline', (usersOnline) => {
            const boxContent = document.getElementById('boxContent');
            boxContent.textContent = '';
            usersOnline.forEach((user) => {
                if (userLogin !== user) {
                    const element = document.createElement('div');
                    element.className = 'userOnline';
                    element.textContent = user;
                    boxContent.appendChild(element);
                }
            });
            const user = usersOnline.includes(userLogin);
            if (user && usersOnline.length === 1) {
                boxContent.textContent = 'User online not found!';
            }
        });
        socket.on('update-usersOnline', (usersOnline) => {
            const boxContent = document.getElementById('boxContent');
            boxContent.textContent = '';
            usersOnline.forEach((user) => {
                if (userLogin !== user) {
                    const element = document.createElement('div');
                    element.className = 'userOnline';
                    element.textContent = user;
                    boxContent.appendChild(element);
                }
            });
            const user = usersOnline.includes(userLogin);
            if (user && usersOnline.length === 1) {
                boxContent.textContent = 'User online not found!';
            }
        });

        socket.on('logout-sucess', () => {
            userLogin = '';
            alert(`Confirm logout account ${userLogin}!`);
            render();
        });
        function render() {
            if (isDisplayChat) {
                chatForm.style.display = 'block';
                loginForm.style.display = 'none';
            } else {
                chatForm.style.display = 'none';
                loginForm.style.display = 'block';
            }
        }
        render();
        btnRegister.onclick = function () {
            socket.emit('register', username.value);
        };
        btnLogout.onclick = function () {
            username.value = '';
            socket.emit('logout');
            isDisplayChat = false;
            currentUser.textContent = '';
        };
        btnSend.onclick = function () {
            if (chatMsg.value) {
                socket.emit('user-chat', chatMsg.value);
            }
        };
    },
    false,
);
