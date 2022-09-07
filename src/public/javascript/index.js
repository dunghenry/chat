document.addEventListener(
    'DOMContentLoaded',
    function () {
        const socket = io('http://localhost:4000');
        let userLogin = '';
        let isDisplayChat = false;
        const chatForm = document.querySelector('.chatForm');
        const loginForm = document.querySelector('.loginForm');
        const currentUser = document.querySelector('.currentUser');
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
        const username = document.getElementById('username');
        const btnRegister = document.getElementById('btnRegister');
        btnRegister.onclick = function () {
            socket.emit('register', username.value);
        };
    },
    false,
);
