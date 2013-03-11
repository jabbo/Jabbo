<?php
require_once("config.php");
error_reporting(0);
$login = false;
if(ISSET($_COOKIE["jabbo_sess"]))
{
	$user = halen_array("SELECT * FROM members WHERE username='".$_COOKIE["jabbo_name"]."';");
	if ($user['password'] == md5(md5($_COOKIE["jabbo_name"]).md5($_COOKIE["jabbo_pass"])))
	{
		$login = true;
	}
}
if (($client_status == "online") && ($login) && (ISSET($_GET['id'])) && (ISSET($_GET['x'])) && (ISSET($_GET['y'])) && (ISSET($_GET['cx'])) && (ISSET($_GET['cy'])))
{
	$directions = Array(1,2,3,4,5,6,7,8);
	$x = 0;
	for ($i = 0; $i < sizeof($directions); $i++) {
		$avapos[$directions[$i]] = Array();
		$avapos[$directions[$i]][0] = $x; //std
		$x = $x+64;
		$avapos[$directions[$i]][1] = $x; //wlk
		$x = $x+64;
		$avapos[$directions[$i]][2] = $x; //wlk
		$x = $x+64;
		$avapos[$directions[$i]][3] = $x; //wlk
		$x = $x+64;
		$avapos[$directions[$i]][4] = $x; //wlk
		$x = $x+64;
	}
	for ($i = 1; $i <= 4; $i++) { // zitten
		$avapos[($i*2)][5] = $x;
		$x = $x+64;
	}
	
	function imagettfborder($im, $size, $angle, $x, $y, $color, $font, $text, $width) {
	   // top
	   imagettftext($im, $size, $angle, $x-$width, $y-$width, $color, $font, $text);
	   imagettftext($im, $size, $angle, $x, $y-$width, $color, $font, $text);
	   imagettftext($im, $size, $angle, $x+$width, $y-$width, $color, $font, $text);
	   // bottom
	   imagettftext($im, $size, $angle, $x-$width, $y+$width, $color, $font, $text);
	   imagettftext($im, $size, $angle, $x, $y+$width, $color, $font, $text);
	   imagettftext($im, $size, $angle, $x-$width, $y+$width, $color, $font, $text);
	   // left
	   imagettftext($im, $size, $angle, $x-$width, $y, $color, $font, $text);
	   // right
	   imagettftext($im, $size, $angle, $x+$width, $y, $color, $font, $text);
	   for ($i = 1; $i < $width; $i++) {
	      // top line
	      imagettftext($im, $size, $angle, $x-$i, $y-$width, $color, $font, $text);
	      imagettftext($im, $size, $angle, $x+$i, $y-$width, $color, $font, $text);
	      // bottom line
	      imagettftext($im, $size, $angle, $x-$i, $y+$width, $color, $font, $text);
	      imagettftext($im, $size, $angle, $x+$i, $y+$width, $color, $font, $text);
	      // left line
	      imagettftext($im, $size, $angle, $x-$width, $y-$i, $color, $font, $text);
	      imagettftext($im, $size, $angle, $x-$width, $y+$i, $color, $font, $text);
	      // right line
	      imagettftext($im, $size, $angle, $x+$width, $y-$i, $color, $font, $text);
	      imagettftext($im, $size, $angle, $x+$width, $y+$i, $color, $font, $text);
	   }
	}
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
	function add($x, $y, $z, $src) {
		global $layers;
		if (!isset($layers[$z])) {
			$layers[$z] = Array();
		}
		$new = Array($x, $y, $src);
		array_push($layers[$z], $new);
	}
	function add_img($x, $y, $src, $image1) {
		if (gettype($src) == "string") {
			$image2 = @imagecreatefromgif($src);
		}
		else {
			$image2 = $src;
		}
		imagecopy($image1, $image2, $x, $y, 0, 0, imagesx($image2), imagesy($image2));
		imagedestroy($image2);
		return $image1;
	}
	
	function getpos($furni, $info) {
		global $posx, $posy;
		$x = $posx[$furni['tile']];
		$y = $posy[$furni['tile']];
		$tile = explode("_", $furni['tile']);
		$x += intval($info['change_x']);
		$y += intval($info['change_y']);
		if (($furni['turn'] == 1) || ($furni['turn'] == 3)) {
			$y -= floor(((intval($info['lang'])/2)-0.5)*33);
			$y += floor(((intval($info['breed'])/2)-0.5)*33);
		}
		if (($furni['turn'] == 3) || ($furni['turn'] == 4)) {
			$x += intval($info['turn_x']);
			$y += intval($info['turn_y']);
		}
		if ($furni['action'] == 1) {
			if ($furni['turn'] == 2) {
				$x += intval($info['action_x']);
			}
			$y += intval($info['action_y']);
		}
		return Array($x, $y);
	}
	
	function getposava($data) {
		global $posx, $posy;
		$x = $posx[(intval($data["X"])+1)."_".(intval($data["Y"])+1)];
		$y = $posy[(intval($data["X"])+1)."_".(intval($data["Y"])+1)];
		$x += 4;
		$y += -85;
		return Array($x, $y);
	}
	
	
	$layers = Array();
	
	$data = halen_array("SELECT * FROM rooms WHERE id='".$_GET['id']."';");
	$res = mysql_query("SELECT * FROM items WHERE room='".$data['id']."';");
	$furni = Array();
	if (mysql_num_rows($res) >= 1) {
		while ($row = mysql_fetch_array($res)) {
			if (!isset($furni[$row['tile']])) {
				$furni[$row['tile']] = Array();
			}
			$furni[$row['tile']][$row['stacknr']] = Array();
			$furni[$row['tile']][$row['stacknr']] = $row;
		}
	}
	
	$ch = curl_init("127.0.0.1:3502/".$data['id']);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($ch);
	curl_close($ch);
	
	$serversays = json_decode($output, true);
	
	$left = 0;
	$top = 0;
	
	if ($data['mode'] == "s") {
		$gendata = explode(",", $options['gendata_s']);
	}
	elseif ($data['mode'] == "b") {
		$gendata = explode(",", $options['gendata_b']);
	}
	
	$left -= $gendata[4];
	$top += $gendata[5];
	$left += $data['breed'] * $gendata[8];
	
	$width = ((($data['lang'] + $data['breed']) / 2) * ($gendata[8]*2)) + $gendata[6];
	$height = ((($data['lang'] + $data['breed']) / 2) * $gendata[8]) + $gendata[7];
	
	$left += round(($_GET['cx'] - $width) / 2);
	$top += round(($_GET['cy'] - $height) / 2);
	
	
	if (fmod($left / $gendata[8], 2) == 0) // fractal modulus : check parity
	{
		$row = floor($top / $gendata[8]) + floor($left / (2 * $gendata[8]));
		$col = -floor($top / $gendata[8]) + floor(($left + $gendata[8]) / (2 * $gendata[8]));
	}
	else
	{
		$row = floor(($top + $gendata[8] / 2) / $gendata[8]) + floor($left / (2 * $gendata[8]));
		$col = -floor(($top + $gendata[8] / 2) / $gendata[8]) + floor(($left + $gendata[8]) / (2 * $gendata[8]));
	}
	
	
	$poster_x = ($row * $gendata[8] + $col * $gendata[8]);
	$poster_y = ($row * ($gendata[8] / 2)) - ($col * ($gendata[8] / 2));
	
	$start_x = $floor_x = ($row * $gendata[8] + $col * $gendata[8])-$gendata[8]/2;
	$start_y = $floor_y = ($row * ($gendata[8] / 2)) - ($col * ($gendata[8] / 2)) - ($gendata[8] / 2)/2;
	
					
	
	$holes = explode(";", $data['holes']);
	$bigholes = Array();
	$checkedholes = Array();
	
	$posx = Array();
	$posy = Array();
	
	function bighole($x, $y) {
		global $data, $holes, $bigholes, $checkedholes;
		if (($x > 0) && ($y > 0) && ($x <= $data['breed']) && ($y <= $data['lang'])) {
			if (!in_array($x."_".$y, $checkedholes)) {
				if (in_array($x."_".$y, $holes)) {
					array_push($checkedholes, $x."_".$y);
					if ((notile(($x-1), $y)) && (notile($x, ($y-1)))) {
						array_push($bigholes, ($x."_".$y));
					}
					bighole(($x-1), $y);
					bighole($x, ($y+1));
					bighole(($x+1), $y);
					bighole($x, ($y-1));
				}
			}
		}
	}
	function notile ($x, $y) {
		global $data, $holes;
		$answer = false;
		if (($x < 1) || ($y < 1) || ($x > $data['breed']) || ($y > $data['lang'])) {
			$answer = true;
		}
		if (in_array($x."_".$y, $holes)) {
			$answer = true;
		}
		return $answer;
	}
	
	bighole(1,1);
	
	$deurgeweest = false;	
	for ($i1 = 1; $i1 <= $data['lang']; $i1++) 
	{
		for ($i2 = 1; $i2 <= $data['breed']; $i2++) 
		{
			if (!in_array($i2."_".$i1, $holes)) {
				add($floor_x, $floor_y, 3, "images/rooms/floors/".$data['mode']."/".$data['floor'].".gif");
				$door = 0;
				
				if ((($i2-1)."_".$i1 == $data['door']) && (!$deurgeweest)) {
					$x = $floor_x + $gendata[2];
					$y = $floor_y - $gendata[3];
					
					$door1_image = @imagecreatetruecolor(32, 133);
				    imagealphablending($door1_image, false);
				    imagesavealpha($door1_image,true);
				    $door2_transparent = imagecolorallocatealpha($door1_image, 255, 255, 255, 127);
				    imagefilledrectangle($door1_image, 0, 0, 32, 133, $door2_transparent);
				    imagecolortransparent($door1_image, $door2_transparent);
					
				  	$door1_image = add_img(0, 0, "images/rooms/walls/".$data['mode']."/".$data['wall']."/2.gif", $door1_image);
					$door1_image = add_img(0, 31, "images/rooms/door2.gif", $door1_image);
						
					add($x, $y, 1, $door1_image);
					
					
					/*$door2_image = @imagecreatetruecolor(32, 133);
				    imagealphablending($door2_image, false);
				    imagesavealpha($door2_image,true);
				    $door2_transparent = imagecolorallocate($door2_image, 0, 255, 0);
				    imagefilledrectangle($door2_image, 0, 0, 32, 133, $door2_transparent);
				    $door2_image = add_img(0, 0, "images/rooms/walls/walls/".$data['mode']."/".$data['wall']."/2.gif", $door2_image);
					$door2_image = add_img(0, 31, "images/rooms/door2b.gif", $door2_image);
					
					imagecolortransparent($door2_image, $door2_transparent);
					
					add($x, $y, 1, $door2_image);*/
					
					$posx[$data['door']] = $x+($gendata[8]);
					$posy[$data['door']] = $y-($gendata[8]/2);

					$door = 2;
					$deurgeweest = true;
				}
				if (($i2."_".($i1-1) == $data['door']) && (!$deurgeweest)) {
					$x = $floor_x + $gendata[0];
					$y = $floor_y - $gendata[1];
					
					$door1_image = @imagecreatetruecolor(32, 133);
				    imagealphablending($door1_image, false);
				    imagesavealpha($door1_image,true);
				    $door2_transparent = imagecolorallocatealpha($door1_image, 255, 255, 255, 127);
				    imagefilledrectangle($door1_image, 0, 0, 32, 133, $door2_transparent);
				    imagecolortransparent($door1_image, $door2_transparent);
					
				    $door1_image = add_img(0, 0, "images/rooms/walls/".$data['mode']."/".$data['wall']."/1.gif", $door1_image);
					$door1_image = add_img(0, 31, "images/rooms/door1.gif", $door1_image);
					
					
				
					add($x, $y, 1, $door1_image);
					
					/*$door2_image = @imagecreatetruecolor(32, 133);
				    imagealphablending($door2_image, false);
				    imagesavealpha($door2_image,true);
				    $door2_transparent = imagecolorallocate($door2_image, 0, 255, 0);
				    imagefilledrectangle($door2_image, 0, 0, 32, 133, $door2_transparent);
				    $door2_image = add_img(0, 0, "images/rooms/walls/walls/".$data['mode']."/".$data['wall']."/1.gif", $door2_image);
					$door2_image = add_img(0, 31, "images/rooms/door1b.gif", $door2_image);
					
					imagecolortransparent($door2_image, $door2_transparent);
					
					add($x, $y, 1, $door2_image);*/
					
					$posx[$data['door']] = $x-($gendata[8]);
					$posy[$data['door']] = $y-($gendata[8]/2);
					
					$door = 1;
					$deurgeweest = true;
				}
				if ($i1 == 1) {
					if ($door != 1) {
						$x = $floor_x + $gendata[0];
						$y = $floor_y - $gendata[1];
						add($x, $y, 3, "images/rooms/walls/".$data['mode']."/".$data['wall']."/1.gif");
					}
				}
				if ($i2 == 1) {
					if ($door != 2) {
						$x = $floor_x + $gendata[2];
						$y = $floor_y - $gendata[3];
						add($x, $y, 3, "images/rooms/walls/".$data['mode']."/".$data['wall']."/2.gif");
					}
				}
				if (in_array($i2."_".($i1-1), $bigholes)) {
					if ($door != 1) {
						$x = $floor_x + $gendata[0];
						$y = $floor_y - $gendata[1];
						add($x, $y, 3, "images/rooms/walls/".$data['mode']."/".$data['wall']."/1.gif");
					}
				}
				if (in_array(($i2-1)."_".$i1, $bigholes)) {
					if ($door != 2) {
						$x = $floor_x + $gendata[2];
						$y = $floor_y - $gendata[3];
						add($x, $y, 3, "images/rooms/walls/".$data['mode']."/".$data['wall']."/2.gif");
					}
				}
				if ((($i2+1) > $data['breed']) || (in_array(($i2+1)."_".$i1, $holes))) {
					if ((($i1-1) < 1) || (in_array($i2."_".($i1-1), $bigholes))) {
						$x = $floor_x - $gendata[9];
						$y = $floor_y - $gendata[11];
						add($x, $y, 5, "images/rooms/walls/".$data['mode']."/".$data['wall']."/l.gif");
					}
				}
				if ((($i1+1) > $data['lang']) || (in_array($i2."_".($i1+1), $holes))) {
					if ((($i2-1) < 1) || (in_array(($i2-1)."_".($i1-1), $bigholes))) {
						$x = $floor_x + $gendata[10];
						$y = $floor_y - $gendata[11];
						add($x, $y, 5, "images/rooms/walls/".$data['mode']."/".$data['wall']."/r.gif");
					}
				}
			}
			$posx[$i2."_".$i1] = $floor_x;
			$posy[$i2."_".$i1] = $floor_y;
			$floor_x -= $gendata[8];
			$floor_y += ($gendata[8]/2);
		}
		$floor_x = $start_x + ($i1 * $gendata[8]);
		$floor_y = $start_y + ($i1 * ($gendata[8]/2));
	}
	
	$image = @imagecreatetruecolor($_GET['cx'], $_GET['cy']);
	$black = imagecolorallocate($image, 0, 0, 0);
	imagefilledrectangle($image, 0, 0, $_GET['cx'], $_GET['cy'], $black);
	
	ksort($furni);
	foreach ($furni as $key => $data) {
		ksort($data);
		foreach ($data as $key2 => $data2) {
			$info = halen_array("SELECT * FROM furni WHERE furni='".$data2['furni']."';");
			$hoekshow = $data2['turn'];
			if (($info['soort'] == "stoel") && ($info['afb'] == 1)) {
				$hoekshow = 1;
			}
			if ($data2['action'] == 1) {
				$img = "images/furni/".$data2['furni']."/".$hoekshow."b.gif";
			}
			else {
				$img = "images/furni/".$data2['furni']."/".$hoekshow.".gif";
			}
			if ($data2['tile'] != "inv") {
				if ($info['soort'] != "poster") {
					//obj.style.zIndex = intval(data2.stacknr);
					$tile = explode("_", $data2['tile']);
					
					if ($info['soort'] != "tapijt") {
						$z = $tile[0]+$tile[1]+2;
					}
					else {
						$z = 3;
					}
					
					$pos = getpos($data2, $info);
					
					add($pos[0], $pos[1], $z, $img);
				}
				else {
					$tile = "0_0";
					$z = 3;
					$pos = explode("|", $data2['tile']);
					add($pos[0]+$poster_x, $pos[1]+$poster_y, $z, $img);
				}
			}
		}
	}
	
	foreach ($serversays as $key => $data) {
		$figure = str_replace('/', '', $data["C"]);
		if ($data["Dr"] == "camera") {
			$img = "cache/avatars/camera/".$figure.".gif";
		}
		else {
			$img = "cache/avatars/walk/".$figure.".gif";
		}
		
		$hoek = $data["D"];
		if ($data["S"] == "") {
			$z = (intval($data["X"])+1)+(intval($data["Y"])+1)+2;
			$actie = $data["W"];
		}
		else {
			$explode = explode("|", $data["S"]);
			$tile = explode("_", $explode[1]);
			$z = (intval($tile[0])+1)+(intval($tile[1])+1)+2;
			$actie = 5;
		}
		
		$ava_image = @imagecreatetruecolor(64, 110);
	    imagealphablending($ava_image, false);
	    imagesavealpha($ava_image,true);
	    $transparent = imagecolorallocatealpha($ava_image, 255, 255, 255, 127);
	    imagefilledrectangle($ava_image, 0, 0, 64, 110, $transparent);
	    imagecolortransparent($ava_image, $transparent);
		
		$ava_image1 = $ava_image;
	    $ava_image2 = @imagecreatefromgif($img);
	    imagecopy($ava_image1, $ava_image2, (-$avapos[$hoek][$actie]), 0, 0, 0, 2816, 110);
		imagedestroy($ava_image2);
	    $ava_image = $ava_image1;
	    
	    $pos = getposava($data);
	    add($pos[0], $pos[1], $z, $ava_image);
	}
	
	ksort($layers);
	foreach ($layers as $key => $data) {
    	foreach ($data as $key2 => $data2) {
	    	$image = add_img($data2[0], $data2[1], $data2[2], $image);
    	}
	}
	//header("Content-type: image/gif");
	//imagepng($image);
	
	$cropped = @imagecreatetruecolor(159, 115);
	imagecopyresampled($cropped, $image, 0, 0, $_GET['x'], $_GET['y'], 159, 115, 159, 115);
	
	$L=imagesx($cropped);
	$H=imagesy($cropped);
	
	for($j=0;$j<$H;$j++){
	  for($i=0;$i<$L;$i++){
	     // get the pixel color at i,j
	     $rgb = imagecolorat($cropped, $i, $j);
	
	     // get the individual color values 
	     $r = $rgb&0x00FF0000;
	     $r = $r >> 16;
	     $g = $rgb&0x0000FF00;
	     $g = $g >> 8;
	     $b = $rgb&0x0000FF;
	
	     // calculate the grayscale    
	     $bw=($r+$g+$b)/3;
	     $result = (0x000000FF<<24)|($bw<<16)|($bw<<8)|$bw; 
	
	     // create the new color values
	     $new_r = ($result >> 16) & 0xFF;
	     $new_g = ($result >> 8) & 0xFF;
	     $new_b = $result & 0xFF;
	
	     // assign the grayscale color
	     $new_color = imagecolorallocate($cropped, $new_r, $new_g, $new_b); 
	     imagesetpixel($cropped, $i, $j, $new_color);    
	  }
	}
	
	$white = imagecolorallocate($cropped, 255, 255, 255);
	$black = imagecolorallocate($cropped, 0, 0, 0);
	imagefilter($cropped, IMG_FILTER_COLORIZE, 0, -35, -60, 20);
	
	$text = date("d/m/y G:i");
	imagettfborder($cropped, 7, 0, 80, 110, $black, "images/volter.ttf", $text, 1);
	imagettftext($cropped, 7, 0, 80, 110, $white, "images/volter.ttf", $text);
	
	$filter = imagecolorallocatealpha($cropped, 255, 110, 0, 80);
	imagefilledrectangle($cropped, 0, 0, 159, 115, $filter);
	
	$name = strtotime(date("d M Y G:i"));
	$code = create_code(5);
	imagegif($cropped, "cache/camera/" . $code . "_" . $name . ".gif");
	echo $code."_".$name;
	
	//header("Content-type: image/gif");
	//imagegif($cropped)
}
?>
