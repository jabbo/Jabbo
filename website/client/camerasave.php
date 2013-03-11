<?php
require_once("config.php");
$login = false;
if(ISSET($_COOKIE["jabbo_sess"]))
{
	$user = halen_array("SELECT * FROM members WHERE username='".$_COOKIE["jabbo_name"]."';");
	if ($user['password'] == md5(md5($_COOKIE["jabbo_name"]).md5($_COOKIE["jabbo_pass"])))
	{
		$login = true;
	}
}
if (($client_status == "online") && ($login) && (ISSET($_GET['id'])) && (ISSET($_GET['caption']))) {
	require_once("mus.cls.php");
	function create_code($length) {
		$temp_code = "";
		$pstring = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWXxYyZz0123456789";
		$plength = strlen($pstring);
		for ($i = 1; $i <= $length; $i++) {
			$start = rand(0,$plength);
			$temp_code.= substr($pstring, $start, 1);
		}
		return $temp_code;
	}
	if (file_exists("cache/camera/".$_GET['id'].".gif")) {
		$mussocket = new MUS("127.0.0.1", 3501, 5);
		
		$code = create_code(20);
		
		$caption = strip_tags($_GET['caption']);
		$caption = str_replace("#", "", $caption);
		$caption = str_replace(chr(2), "", $caption);
		$caption = str_replace("||", "<br>", $caption);
		
		$mussocket->SendData("002".$user['id'].chr(2).$caption.chr(2).$code."#");
		
		rename("cache/camera/".$_GET['id'].".gif", "photos/".$code.".gif");
		echo($mussocket->ReciveData());
		
		$mussocket->Close();
	}
	else {
		echo "error";
	}
}
?>