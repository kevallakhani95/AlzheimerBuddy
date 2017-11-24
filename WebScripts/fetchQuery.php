<?php
header('Content-Type: application/json');

$apiLink = YOUR_API_LINK;
$apiKey = YOUR_API_KEY;//$_GET['api'];
$query = "where is my book";
$entityLink = $apiLink."query?v=20150910";

$data_string = "{'query':'$query', 'timezone':'GMT-5', 'lang':'en', 'sessionId':'53201'}";

// Initiate curl
$ch = curl_init();

// Set The Response Format to Json
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8','Authorization:Bearer '.$apiKey));
// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//send post fields data
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
// Set the url
curl_setopt($ch, CURLOPT_URL,$entityLink);

// Execute
$result=curl_exec($ch);
// Closing
curl_close($ch);
echo $result;
?>
