<?php
class Lobby {
    function __construct($db){
        $this->db = $db;
    }
     
    // Возвращает все открытые офферы, которые НЕ создал этот юзер
    public function getOffers($userId) {
        $lobbiesArray = $this->db->getOffers($userId);
        foreach($lobbiesArray as $key => $value){
            $creator_name = $this->db->getUserById($value->creator_id)->login; // Добавляем к выходным данным имя создателя
            $value->creator_name = $creator_name;
        }
        return $lobbiesArray;
    }

    // Возвращает лобби по id, если оно СУЩЕСТВУЕТ и ОТКРЫТО
    public function getLobby($lobbyId){
        return $this->db->getLobbyById($lobbyId);
    }

    // Меняет статус лобби с указанным id
    public function changeLobbyStatus($lobbyId, $status){
        return $this->db->changeLobbyStatus($lobbyId, $status);
    }
    
    // Добавляет userID в указанное lobby в качестве offer_id
    public function acceptOffer($userId, $lobbyId){
        return $this->db->updateOffer($userId, $lobbyId);
    }

    // Создает лобби с указанным id creatorА
    public function createOffer($userId){
       return $this->db->createOffer($userId);
    }

    // Кто-то принял оффер пользователя или нет
    public function isOfferAccepted($userId){
        return $this->db->isOfferAccepted($userId);
    }

    // Закрывает все офферы пользователя
    public function deleteOffer($userId){
        return $this->db->deleteOffer($userId);
    }
}