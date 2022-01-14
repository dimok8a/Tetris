<?php
error_reporting(-1);
require_once('application/Application.php');
header("Content-type:application/json;charset=utf-8");

function router($params){
    $method = $params['method'];
    if ($method){
        $app = new Application();
        switch ($method){
           // about user
           case 'login' : return $app->login($params);
           case 'logout': return $app->logout($params);
           case 'registration': return $app->registration($params);
           case 'isUserLoggedIn': return $app->isUserLoggedIn($params);
           // about lobby
           case 'getOffers': return $app->getOffers($params);
           case 'createOffer': return $app->createOffer($params);
           case 'deleteOffer': return $app->deleteOffer($params);
           case 'acceptOffer': return $app->acceptOffer($params);
           case 'isOfferAccepted': return $app->isOfferAccepted($params);
           // about game
           case 'getGame': return $app->getGame($params);
           case 'getDataGame': return $app->getDataGame($params);
           case 'sendDataGame': return $app->sendDataGame($params);
           case 'readyForGame': return $app->readyForGame($params);
           case 'leftGame': return $app->leftGame($params);
        }
    }
    return false;
}

function answer($data){
    if($data){
        return array(
            'result'=>'ok',
            'data'=>$data
        );
    }
    return array('result'=>'error');
}

echo(json_encode(answer(router($_GET))));
