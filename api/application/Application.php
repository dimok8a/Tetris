<?php
require_once("db/DB.php");
require_once("users/Users.php");
require_once("lobby/Lobby.php");
require_once("game/Game.php");

class Application{
    function __construct(){
        $db = new DB();
        $this->users = new Users($db);
        $this->lobby = new Lobby($db);
        $this->game = new Game($db);
    }

    public function login($params){
        if(
            $params['login'] && 
            $params['rnd'] && 
            $params['hash']
        ){
            return $this->users->login($params['login'],$params['rnd'],$params['hash']);
        }
    }

    public function logout($params){
        if($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                $this->lobby->deleteOffer($user->id); // Закрываем все офферы пользователя
                $this->game->leftGame($user->id);// Закрываем все игры пользователя
                return $this->users->logout($user->id);
            }
        }
    }

    public function registration($params){
        if($params['name'] && $params['login'] && $params['hash']){
            return $this->users->registration($params['name'], $params['login'], $params['hash']);
        }
    }

    public function isUserLoggedIn($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return true;
            }
            return false;
        }
    }

    public function getOffers($params) {
        if ($params['token']) {
            $user = $this->users->getUser($params['token']);
            if ($user) {
                return $this->lobby->getOffers($user->id);
            }
        }
    }

    public function acceptOffer($params) {
        if ($params['token'] && $params['id']) {
            $user = $this->users->getUser($params['token']); // Получаем юзера, который принял офер
            if ($user) {
                $lobby = $this->lobby->getLobby($params['id']); // Получаем лобби, в которое хочет залететь юзер
                if ($lobby){
                    $this->game->createGame($user->id, $lobby->creator_id); // Создаем игру
                    $this->lobby->changeLobbyStatus($lobby->id, "accepted"); // Меняем статус лобби на принято
                    return $this->lobby->acceptOffer($user->id, $lobby->id); // Добавляем юзера в offer_id
                }
            }
        }
    }

    public function createOffer($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                $this->lobby->deleteOffer($user->id); // Закрываем предыдущие офферы
                $this->game->leftGame($user->id); // Выходим из всех предыдущих игр
                return $this->lobby->createOffer($user->id); // Создаем оффер
            }

        }
    }

    public function isOfferAccepted($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->lobby->isOfferAccepted($user->id);
            }
        }
    }

    public function deleteOffer($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->lobby->deleteOffer($user->id);
            }
        }
    }
    

    public function leftGame($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->game->leftGame($user->id);
            }
        }
    }

    public function getGame($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->game->getGame($user->id);
            }
        }
    }
    public function getDataGame($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->game->getDataGame($user->id);
            }
        }
    }

    public function readyForGame($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                return $this->game->readyForGame($user->id);
            }
        }
    }

    public function sendDataGame($params){
        if ($params['token']){
            $user = $this->users->getUser($params['token']);
            if ($user){
                // return $params['data'];
                //return $params['data'];
                return $this->game->sendDataGame($user->id, $params['data']);
            }
        }
    }



}