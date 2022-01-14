<?php
class DB{
    function __construct(){
        $host = 'localhost';
        $port = '3306';
        $name = 'users';
        $user = 'root';
        $pass = 'root';
        try{
            $this->db = new PDO(
                'mysql:'.
                'host='.$host.';'.
                'port='.$port.';'.
                'dbname='.$name,
                $user,
                $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        } catch(Exeption $e){
            print_r($e->getMessage());
            die();
        }
    }

    function __destruct(){
        $this->db = null;
    }

    public function getUser($login){
        $login = addslashes($login);
        $query = 'SELECT * FROM users  WHERE login="'.$login.'"';
        return $this->
                db->query($query)->
                fetchObject();
    }

    public function getUserByToken($token) {
        $query = 'SELECT * FROM users WHERE token="'.$token.'"';
        return $this->db->query($query)->
                fetchObject();
    }

    public function getUserById($id) {
        $query = 'SELECT * FROM users WHERE id='.$id;
        return $this->db->query($query)->
                fetchObject();
    }

    public function getUsers(){
        $query = 'SELECT * FROM users';
        $stmp = $this->db->query($query);
        $result = array();
        while ($row = $stmp->fetch(PDO::FETCH_OBJ)){
            $result[] = $row;
        }
        return $result;

    }

    // Функция обновления токена конкретного пользователя
    public function updateToken($id, $token){
        $query = 'UPDATE users SET token="'.$token.'"'.' WHERE id='.$id;
        $this->db->exec($query);
        return true;
    }

    // Регистрация нового пользователя в Б.Д.
    public function addUser($name, $login, $hash){
        $name = addslashes($name); // Экранируем кавычки
        $login = addslashes($login);
        $name = '"'.$name.'"'; // Добавляем кавычки
        $login = '"'.$login.'"';
        $hash = '"'.$hash.'"';
        $query = 'INSERT INTO users (name, login, hash) VALUES '.'('
        .$name.', '
        .$login.', '
        .$hash.')';
        $this->db->exec($query);
    }

    // Возвращает все оферы, которые не созданы пользователем
    public function getOffers($userId){
        $query = 'SELECT * FROM lobbies WHERE creator_id <>'.$userId
        .' AND offer_id is NULL AND status="open"';
        $stmp = $this->db->query($query);
        $result = array();
        while ($row = $stmp->fetch(PDO::FETCH_OBJ)){
            $result[] = $row;
        }
        return $result;
    }

    // Возвращает лобби по id, если оно СУЩЕСТВУЕТ и ОТКРЫТО
    public function getLobbyById($lobbyId){
        $query = 'SELECT * FROM lobbies WHERE id = '.$lobbyId.' AND status = "open"';
        return $this->db->query($query)->
                fetchObject();
    }

    // Обновляет лобби с указанным айди, изменяя offer_id на переданный
    public function updateOffer($userId, $lobbyId){
        $query = 'UPDATE lobbies SET offer_id='.$userId.' WHERE id = '.$lobbyId;
        $this->db->exec($query);
        return true;
    }

    public function changeLobbyStatus($lobbyId, $status){
        $query = 'UPDATE lobbies SET status="'.$status.'"'.' WHERE id = '.$lobbyId;
        $this->db->exec($query);
        return true;
    }

    // Закрывает все лобби, в которых принимал участвие user
    public function deleteOffer($userId){
        $query = 'UPDATE lobbies SET status = "close" WHERE creator_id = "'.$userId.'"'.
        ' OR offer_id = "'.$userId.'"';
        $this->db->exec($query);
        return true;
    }

    // Создает лобби с указанным id creatorА
    public function createOffer($userId){
        $query = 'INSERT INTO lobbies (creator_id) VALUES ('.'"'.$userId.'")';
        $this->db->exec($query);
        return true;
    }

    // Возвращает приняли ли оффер, созданный юзером
    public function isOfferAccepted($userId){
        $query = 'SELECT * FROM lobbies WHERE creator_id="'.$userId.'"'
        .' AND status = "accepted" AND offer_id is NOT NULL';
        return $this->db->query($query)->
        fetchObject();
    }

    // // Закрывает оффер, созданный юзером
    // public function deleteOffer($userId){
    //     $query = 'UPDATE lobbies SET status="close" WHERE creator_id="'.$userId.'"'
    //     .'AND status = "open" AND offer_id is NULL';
    //     $this->db->exec($query);
    //     return true;
    // }

    // Функция добавляет игру в бд с указанными userID
    public function createGame($user1Id, $user2Id){
        $query = 'INSERT INTO games (`gamer1_id`, `gamer2_id`) VALUES ('.'"'.$user1Id.'", '.'"'.$user2Id.'")';
        print_r($query);
        $this->db->exec($query);
        return true;
    }

    // Закрывает активную игру, в которой участвовал user
    public function leftGame($userId){
        $query = 'UPDATE games SET status="stopped" WHERE (gamer1_id = "'.$userId.'"'.
        ' OR gamer2_id = "'.$userId.'")'.
        'AND (status = "playing" OR status="starting")';
        $this->db->exec($query);
        return true;
    }

    // Возвращает активную игру, в которой участвует user
    public function getGame($userId){
        $query = 'SELECT * FROM games WHERE (gamer1_id = '.$userId.
        ' OR gamer2_id = '.$userId.')'.
        ' AND (status = "starting" OR status="playing")';
        return $this->db->query($query)->
                fetchObject(); 
    }

    // Меняет статус геймера в указанной игре на указанный
    public function changeGamerStatus($gameId, $gamer, $status){
        $query = 'UPDATE games SET '.$gamer.'="'.$status.'"'.' WHERE id = '.$gameId;
        $this->db->exec($query);
        return true;
    }

    public function changeGameStatus($gameId, $status){
        $query = 'UPDATE games SET status = "'.$status.'"'.' WHERE id = '.$gameId;
        $this->db->exec($query);
        return true;
    }


    public function updateDataGame($user, $data, $gameId){
        $query = 'UPDATE games SET '.$user.'= 
        "{
        matrix: '.json_encode(json_decode($data)->matrix).', 
        score:'.json_encode(json_decode($data)->score).',
        next:'.json_encode(json_decode($data)->next).',
        pocket:'.json_encode(json_decode($data)->pocket).',
        }"'.' WHERE id = '.$gameId;
        $this->db->exec($query);
        return true;
    }

}

