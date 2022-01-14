<?php
class Game {
    function __construct($db){
        $this->db = $db;
    }

    // Создает игру в таблице с указанными gamer1id и gamer2id
    public function createGame($gamer1Id, $gamer2Id){
        return $this->db->createGame($gamer1Id, $gamer2Id);
    }

    // Закрывает активную игру, в которой участвовал user
    public function leftGame($userId){
        return $this->db->leftGame($userId);
    }

    // Возвращает активную игру, в которой был user
    public function getGame($userId){
        return $this->db->getGame($userId);
    }

    // Возвращает данные ТОЛЬКО про 2-го игрока и статус игры
    public function getDataGame($userId){
        $game = $this->getGame($userId);
        if ($game){
            if ($game->gamer1_id == $userId){ // Если запрос отправил 1-й игрок
                $result = (object) array();
                $result->data = $game->gamer2_data;
                $result->status = $game->status;
                return $result;
            } else {
                $result = (object) array();
                $result->data = $game->gamer1_data;
                $result->status = $game->status;
                return $result;
            }
        }
    }

    public function sendDataGame($userId, $data){
        $game = $this->getGame($userId);
        if ($game){
            if ($game->gamer1_id == $userId){ // Если запрос отправил 1-й игрок
                return $this->db->updateDataGame('gamer1_data', $data, $game->id);
            } else {
                return $this->db->updateDataGame('gamer2_data', $data, $game->id);
            }
        }
    }

    // Меняет статус юзера на готов
    public function readyForGame($userId){
        $game = $this->getGame($userId);
        if ($game){
            if ($game->gamer1_id == $userId){ // Если запрос отправил 1-й игрок
                if ($game->gamer2_status == "ready"){ // Если 2-ой тоже готов
                    $this->db->changeGameStatus($game->id, "playing");
                }
                return $this->db->changeGamerStatus($game->id, 'gamer1_status', 'ready');
            } else {
                if ($game->gamer1_status == "ready"){
                    $this->db->changeGameStatus($game->id, "playing");
                }
                return $this->db->changeGamerStatus($game->id, 'gamer2_status', 'ready');
            }
        }
    }
}