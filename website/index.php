<?php
require("client/config.php");
include("header.php");
?>
Welcome to Jabbo V<?php echo $options['vers']; ?>!<br>
Jabbo is a JavasScript clone of Habbo made by Thomas Vermaercke,<br> a proof of concept that real MMO's can be done with HTML5 and JavaScript!<p>
Click the button below to register, and then click on Check In!
<p>
<input type='button' value='Register' onClick="window.location.href='register.php';" style='width: 150px;'>
<input type='button'  value='Statistics' onClick="window.location.href='graph.php';" style='width: 150px;'>
<?php
$error = false;
if (!defined('PDO::ATTR_DRIVER_NAME')) {
	$error =  'PHP PDO extension is unavailable!';
}
if (!(extension_loaded('gd') && function_exists('gd_info'))) {
	$error = "You must install PHP-GD!";
}

$new_file_name = 'client/cached/cached/test.php';
if (!is_writable(dirname($new_file_name))) {
	$error =  'cache directory must be writeable!';
}
if (!(strnatcmp(phpversion(),'5.0.0') >= 0)) {
	$error = "please install PHP 5 or higher!";
}

if ($error) {
	echo "<p><b>WARNING</b>: Jabbo won't run correctly on this server: ".$error;
}


include("footer.php");
?>