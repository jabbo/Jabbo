<?php
error_reporting(0);
require_once("avatar.class.php");
function add_img($x, $y, $image, $image1) {
	imagecopy($image1, $image, $x, $y, 0, 0, 64, 110);
	imagedestroy($image);
	return $image1;
}
if ((ISSET($_GET['figure'])) && (ISSET($_GET['action'])) && (ISSET($_GET['direction'])) && (ISSET($_GET['head_direction']))) {
	$figure = $_GET['figure'];
	$action = $_GET['action'];
	$direction = $_GET['direction'];
	$head_direction = $_GET['head_direction'];
	
	$hash = $figure.strtolower($action.$direction.$head_direction);
	$cached = "cache/avatars/".$hash.".gif";
	if(file_exists($cached)){
		header("Content-type: image/gif");
		echo file_get_contents($cached);
	}
	else {
		$image = @imagecreatetruecolor(64, 110);
	    imagealphablending($image, false);
	    imagesavealpha($image,true);
	    $transparent = imagecolorallocatealpha($image, 255, 255, 255, 127);
	    imagefilledrectangle($image, 0, 0, 64, 110, $transparent);
	    imagecolortransparent  ($image, $transparent);
	
	    $image = @imagecreatetruecolor(64, 110);
		$transparent = imagecolorallocate($image, 1, 2, 3);
		imagecolortransparent($image, $transparent);
		imagefilledrectangle($image, 0, 0, 64, 110, $transparent);
		$avatar = new Avatar($figure, $direction, $head_direction, $action, 0, 0, 0);
		$image = add_img(0, 0, $avatar->Draw(), $image);
		imagegif($image, $cached);
		imagedestroy($image);
		header("Content-type: image/gif");
		echo file_get_contents($cached);
	}
}
?>