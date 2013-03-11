<?php
header("Content-Type: text/javascript");
function build_tree($dir = 'images') {
	$output = array();
	$handle = opendir($dir);
	while(false !== ($readdir = readdir($handle))) {
		if($readdir != '.' && $readdir != '..')
		{
			$path = $dir.'/'.$readdir;
			if (is_file($path)) {
				$ok = explode('.',$readdir);
				$ext = end($ok);
				if (($ext == "gif") || ($ext == "png"))
				{
					$output[] = substr($path, 0, strlen($path));
				}
			}
			elseif (is_dir($path)) {
				$output[] = substr($path, 0, strlen($path)).'/';
				if (($readdir != 'furni') && ($readdir != 'shop_img') && ($readdir != 'avatars'))
				{
					$output = array_merge($output, build_tree($path));
				}
			}
		}
	}
	closedir($handle);
	return $output;
}
function process_tree($tree) {
	$output = "";
	$tellen = 0;
	foreach($tree as $pathfile) {
		if (substr($pathfile, -1, 1) != '/') {
			if ($pathfile != "") {
				$output = $output."'".$pathfile."', ";
				$tellen++;
			}
		}
	}
	return substr($output, 0, -2);
}
$preload = process_tree(build_tree());
echo "var preImg = new Array(".$preload."); client.start();";
?>