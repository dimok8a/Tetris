window.onload = () => {
    const lobby = new Lobby('#makeOffer', '.offers_container', '.avalible_offers', '#condition_container', '#exit_button');
    lobby.getRequestIsUserLoggedIn();
    lobby.getRequestGetOffers();
    lobby.setEventListeners();
    lobby.startGetOffersLoop(1000);

}