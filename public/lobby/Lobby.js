class Lobby {
    constructor(makeOfferBtn, globalContainer, avalibleOffersContainer, conditionContainer, exitButton) {
        this.makeOfferBtn = makeOfferBtn;
        this.globalContainer = globalContainer;
        this.avalibleOffersContainer = avalibleOffersContainer;
        this.conditionContainer = conditionContainer;
        this.exitButton = exitButton;
        this.creatorsId = [];
        this.startMakeOffer = false;
    }

    async sendRequestGetOffers() {
        const answer = await fetch(`http://tetris/api/?method=getOffers&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes['result'] == "ok") { // Если все ок, то возвращает данные
            return jsonRes['data'];
        }
        return false;
    }

    async getRequestGetOffers() {
        const result = await this.sendRequestGetOffers();
        if (result == false) {
            if (this.lastError) { // Если ошибка была отрендерена, не рендерим ее снова
                return;
            }
            this.renderError();
            this.lastError = true;
            return;
        }
        const newIds = result.map(val => val['creator_id']);
        if (this.creatorsId.join(" ") == newIds.join(" ")) { // Если список оферов не обновился, то ничего нового не рендерим
            return;
        }
        this.creatorsId = newIds;
        this.renderSuccess(result);
        this.lastError = false;
        return;
    }

    startGetOffersLoop(time = 100) {
        this.getOffersLoop = setInterval(() => this.getRequestGetOffers(), time);
    }

    stopGetOffersLoop() {
        clearInterval(this.getOffersLoop);
    }

    renderError() {
        document.querySelector(this.avalibleOffersContainer).innerText = "Нет подходящих предложений :("
    }

    renderSuccess(result) {
        document.querySelector(this.avalibleOffersContainer).innerHTML = '';
        result.forEach(val => {
            const offer_card = document.createElement('div');
            const someText = `
        <div class="offer_name">
            ${val['creator_name']}
        </div>
        <div class="invites">
            Приглашает в игру
        </div>
        <div class="accept_offer">
            <p>
                <input type="button" data-id=${val['id']} value="Принять">
            </p>
        </div>
        `
            offer_card.classList.add('offer_card');
            offer_card.innerHTML = someText;
            document.querySelector(this.avalibleOffersContainer).appendChild(offer_card);
        })

    }

    renderSuccess2() {
        document.querySelector(this.avalibleOffersContainer).innerHTML = '';
        const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        result.forEach(val => {
            const offer_card = document.createElement('div');
            const someText = `
        <div class="offer_name">
            ${val}
        </div>
        <div class="invites">
            Приглашает в игру
        </div>
        <div class="accept_offer">
            <p>
                <input type="button"value="Принять">
            </p>
        </div>
        `
            offer_card.classList.add('offer_card');
            offer_card.innerHTML = someText;
            document.querySelector(this.avalibleOffersContainer).appendChild(offer_card);
        })

    }

    async sendRequestAcceptOffer(id) {
        const answer = await fetch(`http://tetris/api/?method=acceptOffer&token=${localStorage.getItem('token')}&id=${id}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes['result'] == "ok") { // Если все ок, то возвращает данные
            return jsonRes['data'];
        }
        return false;
    }

    renderErrorDownCard(card) {
        const err = document.createElement('div');
        err.innerText = "Что-то пошло не так :(";
        err.style.color = 'red';
        card.appendChild(err);
    }

    renderSuccessfulAccept() {
        window.open("http://tetris/public/game", "_self");
    }

    async getRequestAcceptOffer(id, card) {
        const result = this.sendRequestAcceptOffer(id);
        if (result == false) {
            this.renderErrorDownCard(card);
            return;
        }
        this.renderSuccessfulAccept();
        return;
    }

    async sendRequestMakeOffer() {
        const answer = await fetch(`http://tetris/api/?method=createOffer&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes['result'] == "ok") { // Если все ок, то возвращает данные
            return jsonRes['data'];
        }
        return false;
    }

    async getRequestMakeOffer() {
        const result = await this.sendRequestMakeOffer();
        if (result == true) {
            this.renderSuccessMakeOffer();
            return;
        }
        this.renderErrorMakeOffer();
        return;
    }
    renderSuccessMakeOffer() {

        document.querySelector(this.conditionContainer).innerText = 'Оффер создан успешно!'
        document.querySelector(this.conditionContainer).style.color = 'green';
        setTimeout(() => {
            document.querySelector(this.conditionContainer).innerText = '';
        }, 3000)
        return;
    }

    renderErrorMakeOffer() {
        document.querySelector(this.conditionContainer).innerText = 'При создании оффера возникла ошибка'
        document.querySelector(this.conditionContainer).style.color = 'red';
        setTimeout(() => {
            document.querySelector(this.conditionContainer).innerText = '';
        }, 3000)
        return;
    }

    async sendRequestLogout() {
        let answer = await fetch(`http://tetris/api/?method=logout&token=${localStorage.getItem('token')}`);
        let result = await answer.text();
        let jsonRes = JSON.parse(result);
        if (jsonRes['data'] == true) {
            return true;
        }
        return false;
    }

    async getRequestLogout() {
        const ok = await this.sendRequestLogout();
        if (ok == true) {
            localStorage.removeItem('token');
            window.open('http://tetris', "_self");
            return;
        }
        document.querySelector(this.conditionContainer).innerText = 'Вас не было в системе'
        document.querySelector(this.conditionContainer).style.color = 'red';
        setTimeout(() => {
            window.open("http://tetris/", "_self");
            document.querySelector(this.conditionContainer).innerText = '';
        }, 3000)
    }

    async sendRequestIsAccepted() {
        let answer = await fetch(`http://tetris/api/?method=isOfferAccepted&token=${localStorage.getItem('token')}`);
        let result = await answer.text();
        let jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async sendRequestDeleteOffer() {
        let answer = await fetch(`http://tetris/api/?method=deleteOffer&token=${localStorage.getItem('token')}`);
        let result = await answer.text();
        let jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async getRequestDeleteOffer() {
        const result = await this.sendRequestDeleteOffer();
        if (result) {
            document.querySelector(this.conditionContainer).innerText = 'Оффер отменен'
            document.querySelector(this.conditionContainer).style.color = 'green';
            setTimeout(() => {
                document.querySelector(this.conditionContainer).innerText = '';
            }, 3000)
        } else {
            document.querySelector(this.conditionContainer).innerText = 'Что-то пошло не так'
            document.querySelector(this.conditionContainer).style.color = 'red';
            setTimeout(() => {
                document.querySelector(this.conditionContainer).innerText = '';
            }, 3000)
        }
    }

    startIsAcceptedLoop() {
        this.isAcceptedLoop = setInterval(() => {
            const result = this.sendRequestIsAccepted();
            result.then(val => {
                if (!this.startMakeOffer) {
                    clearInterval(this.isAcceptedLoop);
                    return;
                }
                if (val) {
                    this.renderSuccessfulAccept();
                    clearInterval(this.isAcceptedLoop);
                }
            });
        }, 1000);
    }

    renderCancelMakeOffer() {
        document.querySelector(this.makeOfferBtn).style.backgroundColor = '#6E192E';
        document.querySelector(this.makeOfferBtn).style.border = '1px solid #440F1D';
        document.querySelector(this.makeOfferBtn).value = 'Отменить';
        return;
    }

    renderNormalMakeOffer() {
        document.querySelector(this.makeOfferBtn).style.backgroundColor = '#0F97FF';
        document.querySelector(this.makeOfferBtn).style.border = '1px solid #0F56FF';
        document.querySelector(this.makeOfferBtn).value = 'Создать оффер';
        return;
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
        if (!result) {
            window.open('http://tetris', '_self');
        }
    }
    setEventListeners() {
        document.querySelector(this.avalibleOffersContainer).addEventListener('click', e => {
            if (e.target.getAttribute('data-id')) {
                this.getRequestAcceptOffer(e.target.getAttribute('data-id'), e.target);
            }
        });
        document.querySelector(this.makeOfferBtn).addEventListener('click', () => {
            if (!this.startMakeOffer) {
                this.startMakeOffer = true;
                this.getRequestMakeOffer();
                this.startIsAcceptedLoop();
                this.renderCancelMakeOffer();
            } else {
                this.getRequestDeleteOffer();
                this.renderNormalMakeOffer();
                this.startMakeOffer = false;
            }

        });
        document.querySelector(this.exitButton).addEventListener('click', () => {
            this.getRequestLogout();
        })
    }
}