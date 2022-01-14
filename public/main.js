window.onload = () => {
    const btnIn = document.querySelector('#btnLogin');
    const btnOut = document.querySelector('#btnLogout');
    const access = document.querySelector('#access');
    const logDiv = document.querySelector('#log');
    const passDiv = document.querySelector('#pass');
    const tkn = document.querySelector('#token');
    const authTitle = document.querySelector('#auth__title');
    const loginDiv = document.querySelector('.login');
    const logoutDiv = document.querySelector('.logout');


    const auth = new Auth(btnIn, btnOut, access, logDiv, passDiv, tkn, authTitle, loginDiv, logoutDiv);

    auth.setEventListeners();
    auth.getRequestIsUserLoggedIn();


}