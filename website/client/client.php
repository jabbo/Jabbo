<?php
session_start();
if (!isset($_SESSION['initiated']))
{
	session_regenerate_id();
	$_SESSION['initiated'] = true;
}
$aangemeld = false;
if (ISSET($_SESSION['ingelogd'])) {
	if ($_SESSION['ingelogd']) {
		$aangemeld = true;
	}
}
$string = $_SERVER['HTTP_USER_AGENT'];
$string .= '435jh43590s8nfp84wbf';
$fingerprint = md5($string);
if(!isset($_SESSION['ua']))
{
	$_SESSION['ua'] = $fingerprint;
}
else
{
	if($_SESSION['ua'] != $fingerprint)
	{
        session_destroy();
		die();
	}
}

$nocheck = true;
require_once("config.php");
function detect_ie() {
	if (isset($_SERVER['HTTP_USER_AGENT']) && (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false)) {
		return true;
	}
	else {
		return false;
	}
}
$ask_install = false;
if (detect_ie()) {
	if (!preg_match("/chromeframe/i", $_SERVER['HTTP_USER_AGENT'])) {
		$ask_install = true;
	}
}
if ($ask_install):
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title><?php echo $texts["client_title"]; ?></title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta http-equiv="content-style-type" content="text/css">
<meta http-equiv="content-script-type" content="text/javascript">
<meta name="description" content="<?php echo $texts["client_description"]; ?>">
<meta http-equiv="expires" content="0">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta name="mssmarttagspreventparsing" content="true">
<meta http-equiv="imagetoolbar" content="no">
<link href="../images/icon.ico" rel="shortcut icon" type="image/x-icon">
</head>
<body background="images/back.gif">

<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='position: absolute; left: 0px; top:0px;'>
<tr>
<td valign='middle'>
<center>
<br><b><img src='chromeframe/frankwave.gif' valign='top'><br><br><font face='verdana' color='white'><?php echo $texts["chromeframe_ask"]; ?></font></b><br><br><br><br><br>
</center>
</td>
</tr>
</table>

</body>
</html>
<?php elseif ($client_status == "offline"):?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title><?php echo $texts["client_title"]; ?></title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta http-equiv="content-style-type" content="text/css">
<meta http-equiv="content-script-type" content="text/javascript">
<meta name="description" content="<?php echo $texts["client_description"]; ?>">
<meta http-equiv="expires" content="0">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta name="mssmarttagspreventparsing" content="true">
<meta http-equiv="imagetoolbar" content="no">
<link href="../images/icon.ico" rel="shortcut icon" type="image/x-icon">
</head>
<body background="images/back.gif">

<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='position: absolute; left: 0px; top:0px;'>
<tr>
<td valign='middle'>
<center><br>
<b><font face='verdana' color='white'><?php echo $texts["closed_maintainance"]; ?></font></b><br><br><img src='images/maintenance.gif'>
</center>
</td>
</tr>
</table>

</body>
</html>
<?php else:?>
<html>
<head>
<title><?php echo $texts["client_title"]; ?></title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta http-equiv="content-style-type" content="text/css">
<meta http-equiv="content-script-type" content="text/javascript">
<meta name="description" content="<?php echo $texts["client_description"]; ?>">
<meta http-equiv="expires" content="0">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta name="mssmarttagspreventparsing" content="true">
<meta http-equiv="imagetoolbar" content="no">
<link href="images/icon.ico" rel="shortcut icon" type="image/x-icon">
<link rel="stylesheet" href="style.css">
<script type="text/javascript" src="frameworks/prototype.js"></script>
<script type="text/javascript" src="frameworks/scriptaculous.js"></script>
<script type="text/javascript" charset="ISO-8859-1" src="js.php"></script>
<?php
	echo "<script>";
	if ($options['client_error'] == "true") {
		echo "window.onerror = function (message, url, line) { try { client.allErr(message, url, line); } catch (e) { return true; } }\n";
	}
	echo "var client_vers = \"".$options['vers']."\"; var stop_error = ".$options['stop_error']."; var genarray = { s : new Array(".$options['gendata_s']."), b : new Array(".$options['gendata_b'].") }; ";
	if ($aangemeld) {
		$my_name = $_SESSION['naam'];
		$my_pass = halen("SELECT password FROM members WHERE username='".$my_name."';");
		echo " var login_direct = 'ja'; var login_direct_name='".$my_name."'; var login_direct_pass='".$my_pass."';";
	}
	else
	{
		echo " var login_direct = 'nee';";
	}
	echo "</script>\n";
?>
</head>

<body oncontextmenu="return false;" onselectstart="return false;" ondragstart="return false;">

<div id="block" style="position:absolute; z-index:0; display:none; overflow: none; left:0; top:0;" onmouseover="stop_tclick();" onmouseout="start_tclick();"></div>

<img id="preload_logo" src='images/logo.gif' style="position:absolute; display:none;">

<div id='loadview' style="position:absolute; left:0; top:0; overflow: hidden; display:none;">

<table id="loadtable" border='0'>
<tr>
<td height="168" valign="middle">
<div id="laadbar" style="position:absolute;">
<table border='0' id="loading_bar" bgcolor="black"  width="428" cellpadding="0" cellspacing="0">
<tr>
<td width="2"><img src="images/gray.gif" width="2" height="1"><br><img src="images/gray.gif" width="1" height="1"><img src="images/black.gif" width="1" height="1"></td>
<td><img src="images/gray.gif" width="428" height="1"><br><img src="images/black.gif" width="124" height="1"></td>
<td width="2"><img src="images/gray.gif" width="2" height="1"><br><img src="images/black.gif" width="1" height="1"><img src="images/gray.gif" width="1" height="1"></td>
</tr>
<tr>
<td width="2"><img src="images/gray.gif" width="1" height="12"><img src="images/black.gif" width="1" height="12"></td>
<td><img src="images/gray.gif" id="grijsbar" name="grijsbar" style="width: 0%; height: 12px;"><img src="images/black.gif" id="zwartbar" name="zwartbar" style="width: 100%; height: 12px;"></td>
<td width="2"><img src="images/black.gif" width="1" height="12"><img src="images/gray.gif" width="1" height="12"></td>
<tr>
<td width="2"><img src="images/gray.gif" width="1" height="1"><img src="images/black.gif" width="1" height="1"><br><img src="images/gray.gif" width="2" height="1"></td>
<td><img src="images/black.gif" width="428" height="1"><br><img src="images/gray.gif" width="428" height="1"></td>
<td width="2"><img src="images/black.gif" width="1" height="1"><img src="images/gray.gif" width="1" height="1"><br><img src="images/gray.gif" width="2" height="1"></td>
</tr>
</table>
</div>
<br>
</td>
</tr>
</table>

</div>

<div id='prelogin_div'></div>
<div id='windows_div'></div>
<input id='trashtext' type='text' style='width:0px; height:0px; position: absolute; left:-10px; top: -10px; z-index: 0;'>

</body>
</html>
<?php endif;?>