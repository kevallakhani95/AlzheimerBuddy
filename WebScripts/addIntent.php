<?php
header('Content-Type: application/json');

$apiLink = YOUR_API_LINK;
$intent = INTENT_NAME;//GET intent name
$apiKey = YOUR_API_KEY;//$_GET['api'];
$objectName = 'microphone';//GET object name
$link = $apiLink.'intents/'.$intent.'?v=20150910';

$result = curlCall($link,'',array('Authorization:Bearer '.$apiKey));
$myArray = json_decode($result, true);

if($myArray['userSays']){
    foreach($myArray['userSays'] as $key => $value) {
           if ($myArray['userSays'][$key]['id']) {
               unset($myArray['userSays'][$key]['id']);
           }
           if ($myArray['userSays'][$key]['updated']) {
               unset($myArray['userSays'][$key]['id']);
           }
       }
       //unsetting data
       unset($myArray['cortanaCommand']);
       unset($myArray['id']);
       unset($myArray['webhookUsed']);
       unset($myArray['webhookForSlotFilling']);
       unset($myArray['lastUpdate']);
       unset($myArray['fallbackIntent']);
       unset($myArray['events']);

    $tempArray = $myArray['userSays'][0];
    $tempArray['data'][1]['text'] = $objectName;
    array_push($myArray['userSays'],$tempArray);
    $dataJson = json_encode($myArray);
    $headerArray = array('Content-Type: application/json; charset=utf-8','Authorization:Bearer '.$apiKey);
    $result = curlCall($link,$dataJson,$headerArray);
    echo $result;
}

function curlCall($link,$data,$header) {

  // Initiate curl
  $ch = curl_init();
  // Set The Response Format to Json
  curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
  // Disable SSL verification
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  // Will return the response, if false it print the response
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  //send post fields data
  if($data != ''){
    //Set HTTP Method to PUT/POST
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
  }
  // Set the url
  curl_setopt($ch, CURLOPT_URL,$link);
  // Execute
  $result=curl_exec($ch);
  // Closing
  curl_close($ch);
  //echo $result;
  return $result;
}


?>
