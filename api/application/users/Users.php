<?php
class Users{
    function __construct($db){
        $this->db = $db;
    }

    // Функция логина
    public function login($login, $rnd, $hash){
        $user = $this->db->getUser($login);
        if ($user){
            if (md5($user->hash.$rnd) == $hash){
                $token = md5(microtime().rand(0, 100000));
                $this->db->updateToken($user->id, $token);
                return array(
                    'token'=>$token,
                    'name'=>$user->name
                );
            }
        }
        return false;
    }

    // Функция выхода пользователя
    public function logout($userId){
        $this->db->updateToken($userId, '');
        return true;
    }

    // Функция регистрации
    public function registration($name, $login, $hash){
        $user = $this->db->getUser($login); // Получаем пользователя по логину из Б.Д.
        if ($user){ // Если такой пользователь есть, то возвращаем false
            return false;
        }
        $this->db->addUser($name, $login, $hash); // Если нет то добавляем в таблицу
        return true;
    }

    public function getUser($token) {
        return $this->db->getUserByToken($token);
    }
}