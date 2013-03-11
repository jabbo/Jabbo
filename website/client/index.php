<?php
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
?>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="chrome=1">
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
		<link rel="stylesheet" href="popup_style.css">
		<script type="text/javascript" src="js.php?script=popup"></script>
		<title><?php echo $texts["client_title"]; ?></title>
	</head>
	<body>
		  <?php
		if ($ask_install) {
			?>
			
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>
    <script type="text/javascript"> 
		if(typeof jQuery == 'undefined'){ document.write("<script type=\"text/javascript\"   src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js\"></"+"script>"); var __noconflict = true; } 
		var CHROMFRAME_OPTIONS = {
			icons_path: "chromeframe/images/"
		}
	</script>
	<script type="text/javascript" src="chromeframe/chromeframe.js"></script>
    <style>
     .chromeFrameInstallDefaultStyle {
       width: 100%;
       border: 5px solid blue;
     }
    </style>

    <div id="prompt"></div>
    
     <script>
     jQuery(document).ready(function($) {
       CFInstall.check({
	       preventPrompt: true,
           onmissing: function(){
	     	$('<div></div>').html(CHROMFRAME_OPTIONS.message || '<?php echo $texts["chromeframe_bar"]; ?>').activebar(window.CHROMFRAME_OPTIONS);
     		}
       });
     });
    </script>
			
		<div id="client-topbar">
		<div class="logo" id="logo" style="width: 70px;"><img src="images/popup/topbar_logo.gif" alt="" align="middle"></div>
		<div id='count_jabbos' class="jabbocount"><?php $nocheck = true; include("popup.php"); ?></div>
		<div class="logout"><div onclick="self.close();"><?php echo $texts["close_client"]; ?></div></div>
		</div>	
			<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='' background="images/back.gif">
			<tr>
			<td valign='middle'>
			<center>
			<br><b><img src='chromeframe/frankwave.gif' valign='top'><br><br><font face='verdana' color='white'><?php echo $texts['chromeframe_ask']; ?></font></b><br><br><br><br><br>
			</center>
			</td>
			</tr>
			</table>
			
			<?php
		} else {
			?>
		<div id="client-topbar">
		<div class="logo" id="logo" style="width: 70px;"><img src="images/popup/topbar_logo.gif" alt="" align="middle"></div>
		<div id='count_jabbos' class="jabbocount"><?php $nocheck = true; include("popup.php"); ?></div>
		<div class="logout"><div onclick="self.close();"><?php echo $texts["close_client"]; ?></div></div>
		</div>
    	<div id="clientembed-container">
			<div id="clientembed" style="width: 0px; height: 0px;">
				<iframe id="the_iframe" src='client.php' width='0' height='0' frameborder='0' scrolling='no' style='position: absolute; top: 0; left: 0;'></iframe>
			</div>
		</div>
    		<?php
		}
		?>
	</body>
</html>