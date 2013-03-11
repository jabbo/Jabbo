<?php
header("Content-Type: text/javascript");
require_once("config.php");
error_reporting(0);
$js = "";
if (ISSET($_GET['script']))  {
	$scripts = explode(";", $_GET['script']);
	for ($i = 0; $i < sizeof($scripts); $i++) {
		$script = $scripts[$i];
		if (file_exists("scripts/".$script.".js")) {
			$js .= file_get_contents("scripts/".$script.".js");
		}
		if ($i != (sizeof($scripts)-1)) {
			$js .= "\n";
		}
	}
}
elseif (ISSET($_GET['lib'])) {
	if (file_exists("scripts/lib/".$_GET['lib'].".js")) {
		echo "debug.add('".ucfirst($_GET['lib'])." library loaded');";
		$js .= file_get_contents("scripts/lib/".$_GET['lib'].".js");
	}
	else {
		$js .= "debug.error('Unable to load ".$_GET['lib']." library');";
	}
}
else {
	if (file_exists("scripts/js.js")) {
		header('Content-Type: text/html; charset=ISO-8859-1');
		$js .= file_get_contents("scripts/js.js");
	}
	else {
		$scripts = explode(";", file_get_contents("scripts/scripts.txt"));
		for ($i = 0; $i < sizeof($scripts); $i++) {
			$script = $scripts[$i];
			if (file_exists("scripts/".$script.".js")) {
				$js .= file_get_contents("scripts/".$script.".js");
			}
			if ($i != (sizeof($scripts)-1)) {
				$js .= "\n";
			}
		}
		$js .= "\nvar texts = {};";
		foreach ($texts as $name => $value) {
			$js .= "texts[\"".$name."\"] = \"".$value."\";";
		}
	}
}
/*
$ch = curl_init('http://closure-compiler.appspot.com/compile');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS&js_code='.urlencode($js));
$output = curl_exec($ch);
curl_close($ch);
file_put_contents("js.js", $output);
*/
file_put_contents("js.js", $js);
echo $js;
?>