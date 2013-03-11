<?php
error_reporting(E_ALL);
require_once("buttons.php");

$mysql_user = "root";
$mysql_pass = "";
$mysql_host = "localhost";
$mysql_dbn = "jabbo";

/*
START OF PHP PDO CODE
try {
	$db = new PDO('mysql:dbname='.$mysql_dbn.';host='.$mysql_host.';charset=utf8', $mysql_user, $mysql_pass);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $ex) {
	die("Jabbo could not connect to the database.");
}
*/


if (!@mysql_select_db($mysql_dbn, @mysql_connect($mysql_host, $mysql_user, $mysql_pass))) {
	exit();   
}
if (!function_exists('halen')) {
	function halen($sql) {
		$result = mysql_query($sql);
		$record = mysql_fetch_row($result);
		return $record[0];
	}
}
if (!function_exists('halen_array')) {
	function halen_array($sql) {
		$result = mysql_query($sql);
		$record = mysql_fetch_array($result);
		return $record;
	}
}
$options = Array();
$sql = "SELECT * FROM options;";
$res = mysql_query($sql);
if (mysql_num_rows($res) >= 1) {
	while ($row = mysql_fetch_array($res)) {
	    $options[$row['name']] = $row['value'];
    }
}
$texts = Array();
$sql = "SELECT name, en FROM texts;";
$res = mysql_query($sql);
if (mysql_num_rows($res) >= 1) {
	while ($row = mysql_fetch_array($res)) {
	    $texts[$row[0]] = $row[1];
    }
}
$client_status = $options["site_online"];
$home_status = $options["client_online"];
if ($home_status == "offline") {
	$client_status = "offline";
}
?>