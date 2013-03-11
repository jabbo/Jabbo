<?php
session_start();
require("client/config.php");
$created = date("Y-m-d");
include("header.php");
?>
<script>
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
</script>
<?php
function error ($error) {
	echo $error."<p><input type='button' value='Try again' onClick=\"window.location.href='register.php';\" style='width: 150px;'>";
	include("footer.php");
	die();
}

if ((ISSET($_GET["name"])) && (ISSET($_GET["pass"])) && (ISSET($_GET["pass2"])) && (ISSET($_GET["mission"])) && (ISSET($_GET["figure"])) && (ISSET($_GET["gender"])) && (ISSET($_GET["captcha"]))) {
	foreach($_GET as $key => $value) {
		if (!is_array($key)) {
			// sanitize the input data
			if ($key != 'ct_message') {
				$value = strip_tags($value);
				$_GET[$key] = htmlspecialchars(stripslashes(trim($value)));
			}
		}
	}
	$captcha = @$_GET['captcha']; // the user's entry for the captcha code
	
	require_once('captcha/securimage.php');
	$securimage = new Securimage();
	if ($securimage->check($captcha) == false) {
		error('Incorrect security code entered.');
	}
	else {
		$_GET["name"] = strtolower($_GET["name"]); // really important cause Jabbo stores member names as lowercase!
		if ($_GET["pass"] != $_GET["pass2"]) {
			error("Passwords don't match!");
		}
		else {
			if (strlen($_GET["pass"]) >= 6) {
				if (strlen($_GET["name"]) >= 3) {
					if ((strpos($_GET["name"], "'") !== false) || (strpos($_GET["name"], "'") !== false) || (strpos($_GET["pass"], "'") !== false) || (strpos($_GET["pass"], '"') !== false)) {
						error("Username or password contain illegal characters!");
					}
					else {
						$naam_multi = mysql_num_rows(mysql_query("SELECT id FROM members WHERE username='".$_GET["name"]."';"));
						if ($naam_multi == 0){
							$pass = md5((md5($_GET["name"])).(md5($_GET["pass"])));
							mysql_query("INSERT INTO members SET username='".$_GET["name"]."', password='".$pass."', mission='".$_GET["mission"]."', activated='1', figure='".$_GET["figure"]."', gender='".$_GET["gender"]."', money='50', created='".$created."';");
							echo "<h1>Register</h1><p>Thank you for registering, ".$_GET["name"]."!<p>";
							echo "<img src='client/avatar2.php?figure=".$_GET["figure"]."' style='display:none;'>";
							echo "<img src='client/avatar3.php?figure=".$_GET["figure"]."' style='display:none;'>";
							echo "<script>createCookie('jabbo_name', '".$_GET["name"]."', 0);createCookie('jabbo_pass', '".$_GET["pass"]."', 0);createCookie('jabbo_sess', 'ja', 0);</script>";
							include("footer.php");
						}
						else {
							error("This username is already in use!");
						}
					}
				}
				else
				{
					error("Username must be at least 3 characters long!");
				}
			}
			else {
				error("Password must be at least 6 characters long!");
			}
		}
	}
}
else {
	error ("Please fill in all fields!");
}
?>