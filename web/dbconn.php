
<?php
## This is the file for making a connection to the database
## All the parameters necessary for making a connection are specified in this file.
// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "alz_buddy";
// Create connection
//$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
// If any error in the connection file then Error is displayed


$conn = mysqli_connect(YOUR_AWS_ENDPOINT, YOUR_USERNAME,YOUR_PASSWORD, YOUR_DB_NAME, PORT);

if (!$conn) {
    die("Connection failed: " . $conn->connect_error);
}
else
{
	// echo "Connection made";
}
?>
    
