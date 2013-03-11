<?php
require_once("config.php");
$aantal = halen("SELECT value FROM store_values WHERE name='jabbos_online';");
if ($aantal == 1) {
	$jabbotext = $texts['jabbo_1'];
}
else {
	$jabbotext = $texts['jabbo_multi'];
}
echo $aantal." ".$jabbotext." ".$texts['client_online'];
?>