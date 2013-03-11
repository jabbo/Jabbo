<?php
session_start();
require("client/config.php");
include("header.php");
?>
<h1>Register</h1>
You're just a few steps away from becoming a real Jabbo!<p>
<script src="clothes/registration.js" type="text/javascript"></script>
<script type="text/javascript">
var path = location.protocol + '//' + location.host + location.pathname.replace("register.php", "");
var andSoItBegins = (new Date()).getTime();
HabboView.add(function() {
    var swfobj = new SWFObject(path + "clothes/HabboRegistration.swf", "habboreg", "435", "400", "8");
    swfobj.addParam("base", path + "clothes/");
    swfobj.addParam("wmode", "opaque");
    swfobj.addParam("AllowScriptAccess", "always");
    swfobj.addVariable("figuredata_url", path + "clothes/figuredata.xml");
    swfobj.addVariable("draworder_url", path + "clothes/draworder.xml");
    swfobj.addVariable("localization_url", path + "clothes/figure_editor.xml");
    swfobj.addVariable("figure", "");
    swfobj.addVariable("gender", "");
    swfobj.addVariable("showClubSelections", "1");
    swfobj.write("register-avatar-editor");
});
</script>

	<form method="get" action="registergo.php" id="registerform" autocomplete="off">
	<input type="hidden" name="figure" id="register-figure" value="" />
	<input type="hidden" name="gender" id="register-gender" value="" />
	Username: <input type='text' name='name'><br>
Password: <input type='password' name='pass'><br>
Password check: <input type='password' name='pass2'><br>
Mission: <input type='text' name='mission'><p>
<div id="register-avatar-editor">You need Flash Player: <a target="_blank" href="http://www.adobe.com/go/getflashplayer">http://www.adobe.com/go/getflashplayer</a>.</div>

	 <p>
    <img id="siimage" style="border: 1px solid #000; margin-right: 15px" src="captcha/securimage_show.php?sid=<?php echo md5(uniqid()) ?>" alt="CAPTCHA Image" valign="top" />
    
    <object type="application/x-shockwave-flash" data="captcha/securimage_play.swf?bgcol=#ffffff&amp;icon_file=captcha/images/audio_icon.png&amp;audio_file=captcha/securimage_play.php" height="32" width="32">
    <param name="movie" value="captcha/securimage_play.swf?bgcol=#ffffff&amp;icon_file=captcha/images/audio_icon.png&amp;audio_file=captcha/securimage_play.php" />
    </object>
    &nbsp;
    <a tabindex="-1" style="border-style: none;" href="#" title="Refresh Image" onclick="document.getElementById('siimage').src = 'captcha/securimage_show.php?sid=' + Math.random(); this.blur(); return false"><img src="captcha/images/refresh.png" alt="Reload Image" height="32" width="32" onclick="this.blur()" align="bottom" border="0" /></a><br>
    <strong>Enter Code:</strong>
     <input type="text" name="captcha" size="12" maxlength="8" />
  	</p>
<input type='submit' value='Register!'>
	</form>

<script type="text/javascript">
HabboView.run();
</script>
<?php
include("footer.php");
?>