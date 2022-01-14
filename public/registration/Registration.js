class Registration {
    constructor(regTitle, regDiv, btnReg, access, nameDiv, logDiv, pass1Div, pass2Div) {
        this.regTitle = regTitle;
        this.regDiv = regDiv;
        this.btnReg = btnReg;
        this.access = access;
        // this.mailDiv = mailDiv;
        this.nameDiv = nameDiv;
        this.logDiv = logDiv;
        this.pass1Div = pass1Div;
        this.pass2Div = pass2Div;

        this.md = new MD();
    }

    async sendRequestRegistration() {
        if (this.pass1Div.value != this.pass2Div.value) { // Если 2 пароля не совпадают, то не даем зарегистрироваться
            return false;
        }
        const hash = this.md.MD5(this.logDiv.value + this.pass1Div.value); // Хешируем логин+пароль
        const answer = await fetch(`http://tetris/api/?method=registration&name=${this.nameDiv.value}&login=${this.logDiv.value}&hash=${hash}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes['result'] == "ok") {
            return true;
        }
        return false;
    }

    async getRequestRegistration() {
        const ok = await this.sendRequestRegistration();
        if (ok == true) { // Если регистрация прошла успешно, то сообщаем об этом
            this.renderRegistrationSuccess();
            return;
        }
        this.renderErrorRegistration();
    }

    // Рендер страницы при успешной регистрации
    renderRegistrationSuccess() {
        this.regDiv.classList.add('hide');
        this.regTitle.classList.add('hide');
        this.access.classList.remove('hide');
        this.access.classList.remove('shake-horizontal');
        this.access.innerText = 'Вы зарегистрировались успешно';
        this.access.style.color = "#00A36D";
    }

    // Рендер страницы при неудачной регистрации
    renderErrorRegistration() {
        this.access.innerText = 'Ошибка при регистрации';
        this.sash();
    }

    setEventListeners() { // устанавливаем евент листенеры на кнопку
        this.btnReg.addEventListener('click', this.getRequestRegistration.bind(this));
        this.btnReg.addEventListener('mouseout', addClassOut); // Красивый перелив
        this.btnReg.addEventListener('mouseover', addClassOver);
    }

    // Тряска строки состояния
    sash() {
        this.access.style.color = "crimson";
        this.access.classList.remove('hide');
        if (this.access.classList.contains('shake-horizontal')) { // Если надпись уже тряслась
            this.access.classList.remove('shake-horizontal'); // Трясем ее заново
        }
        setTimeout(() => {
            this.access.classList.add('shake-horizontal')
        }, 100);
    }
}

function addClassOver() {
    this.classList.remove('btn-mouseout');
    this.classList.add('btn-mouseover');
}

function addClassOut() {
    this.classList.remove('btn-mouseover');
    this.classList.add('btn-mouseout');
}