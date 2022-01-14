class Auth {
    constructor(btnIn, btnOut, access, logDiv, passDiv, tkn, authTitle, loginDiv, logoutDiv) {
        this.btnIn = btnIn;
        this.btnOut = btnOut;
        this.access = access;
        this.logDiv = logDiv;
        this.passDiv = passDiv;
        this.tokenDiv = tkn;
        this.authTitle = authTitle;
        this.loginDiv = loginDiv;
        this.logoutDiv = logoutDiv;


        this.token = "";
        this.name = "";
        this.md = new MD();
    }

    async sendRequestLogin() {
        const rnd = Math.floor(Math.random() * 10000 + 2)
        const answer = await fetch(`http://tetris/api/?method=login&login=${this.logDiv.value}&rnd=${rnd}&hash=${this.md.MD5(this.md.MD5(this.logDiv.value+this.passDiv.value)+rnd)}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes['result'] == "ok") { // Если все ок, то запоминает имя и токен пользователя 
            this.name = jsonRes['data']['name'];
            this.token = jsonRes['data']['token'];
            return true;
        }
        return false;
    }

    async getRequestLogin() {
        const ok = await this.sendRequestLogin();
        this.loginDiv.value = "";
        this.passDiv.value = "";
        if (ok == true) {
            this.renderLogin();
            return;
        }
        this.renderErrorLogin();
    }

    async sendRequestLogout() {
        let answer = await fetch(`http://tetris/api/?method=logout&token=${this.token}`);
        let result = await answer.text();
        let jsonRes = JSON.parse(result);
        if (jsonRes['data'] == true) {
            return true;
        }
        return false;
    }

    async getRequestLogout() {
        const ok = await this.sendRequestLogout();
        this.clear(); // Очищаем все данные о пользователе
        if (ok == true) {
            this.renderLogout();
            return;
        }
        this.access.style.color = "crimson";
        this.access.textContent = "Вас не было в системе"
    }

    clear() {
        this.name = "";
        this.token = "";
        this.loginDiv.value = "";
        this.passDiv.value = "";
    }

    renderLogout() {
        this.logoutDiv.classList.add('hide');
        this.loginDiv.classList.remove('hide');
        this.access.style.color = "#00A36D";
        this.access.textContent = "Вы вышли из системы";
        localStorage.removeItem('token');
        this.tokenDiv.classList.add('hide');
        this.authTitle.classList.remove('hide');
    }

    // Рендер страницы при успешной авторизации
    renderLogin() {
        this.loginDiv.classList.add('hide');
        this.logoutDiv.classList.remove('hide');
        this.access.textContent = `Доступ разрешен, ${this.name}`
        this.tokenDiv.textContent = `Ваш токен: ${this.token}`;
        localStorage.setItem('token', this.token);
        this.tokenDiv.classList.remove('hide');
        this.access.style.color = "#00A36D";
        this.tokenDiv.style.color = "#00A36D";
        this.authTitle.classList.add('hide');
        window.open('http://tetris/public/lobby', '_self');
    }

    // Рендер страницы при неуспешной авторизации
    renderErrorLogin() {
        this.access.style.color = "crimson";
        if (this.access.classList.contains('shake-horizontal')) { // Если надпись уже тряслась
            this.access.classList.remove('shake-horizontal'); // Трясем ее заново
        }
        setTimeout(() => {
            this.access.classList.add('shake-horizontal')
        }, 100);
        this.access.textContent = "Неверный логин/пароль"
        localStorage.removeItem('token');
        this.tokenDiv.classList.add('hide');
    }

    async sendRequestIsUserLoggedIn() {
        const answer = await fetch(`http://tetris/api/?method=isUserLoggedIn&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async getRequestIsUserLoggedIn() {
        const result = await this.sendRequestIsUserLoggedIn();
        if (result) {
            window.open('http://tetris/public/lobby', '_self');
        }
    }


    // Устанавливаем евент листенеры на кнопки
    setEventListeners() {
        this.btnIn.addEventListener('click', this.getRequestLogin.bind(this));
        this.btnOut.addEventListener('click', this.getRequestLogout.bind(this));

        this.btnIn.addEventListener('mouseout', addClassOut);
        this.btnIn.addEventListener('mouseover', addClassOver);
        this.btnOut.addEventListener('mouseout', addClassOut);
        this.btnOut.addEventListener('mouseover', addClassOver);
    }
}

// Функции для перелива кнопок
function addClassOver() {
    this.classList.remove('btn-mouseout');
    this.classList.add('btn-mouseover');
    // setTimeout(() => this.classList.remove('btn-animation'), 300);
}

function addClassOut() {
    this.classList.remove('btn-mouseover');
    this.classList.add('btn-mouseout');
}