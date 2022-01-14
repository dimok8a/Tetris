window.onload = () => {
    const btnReg = document.querySelector('#btnRegistr');
    const access = document.querySelector('#access');
    const regDiv = document.querySelector('.registr');
    const regTitle = document.querySelector('#reg__title');

    // const mailDiv = document.querySelector('#mail');
    const nameDiv = document.querySelector('#name');
    const logDiv = document.querySelector('#log');
    const pass1Div = document.querySelector('#pass1');
    const pass2Div = document.querySelector('#pass2');

    const reg = new Registration(regTitle, regDiv, btnReg, access, nameDiv, logDiv, pass1Div, pass2Div);

    reg.setEventListeners();


    // Говорим пользователю заполнить все поля, если он этого не сделал
    btnReg.addEventListener('click', () => {
        if (nameDiv.value == "" || nameDiv.value == "" || logDiv.value == "" || pass1Div.value == "" || pass2Div.value == "") {
            access.innerText = "Пожалуйста, заполните все поля";
            reg.sash(access);
        }
    });
    // При вводе второго пароля смотрим чтобы они совпадали
    pass2Div.oninput = () => {
        if (pass2Div.value != pass1Div.value) {
            access.innerText = "Поля пароля должны совпадать";
            reg.sash(access);
        } else {
            access.classList.add('hide');
        }
    };

}