<?php
require_once("config.php");
$login_ok = "nee";
if(ISSET($_COOKIE["jabbo_sess"]))
{
	$user = halen_array("SELECT * FROM members WHERE username='".$_COOKIE["jabbo_name"]."';");
	if ($user['password'] == md5(md5($_COOKIE["jabbo_name"]).md5($_COOKIE["jabbo_pass"])))
	{
		$login_ok = "ja";
	}
}
if (($client_status == "online") && ($login_ok == "ja")) {
?>
<!-- Rooms -->

<div id='room_div' style="position:absolute; display:none; left:0; top:0; background-color: black; overflow: hidden;">

<div id="room_back" onclick="furni.click('')" style="position:absolute; left:0; top:0; z-index:2;"></div>

<div id='furniture'></div>
<div id='nametags'></div>
<div id='tileinv' style='position: absolute; z-index:141;'></div>
<div id='dragfurni'></div>
<div id='roomchats'></div>


<div id="podium" style='position:absolute; z-index:500;'>
<img src='images/rooms/podium.gif' style='position:absolute; left:0; top:0; z-index:1;'>
<img id='infoshade' class='transp' src='images/rooms/descr_shade.gif' style='position:absolute; left:1; top:64; z-index:1;'>
<div id='infotext' class='eigenfont' style='position:absolute; left:8; top:46; z-index:1; width:145px; height:13px; color: white; text-align: center; font-weight: bold;'></div>
<div id='infodesc' class='eigenfont' style='position:absolute; left:8; top:65; z-index:1; width:145px; height:26px; color: white; text-align: right;'></div>
<img id='infoicon' src='images/blank.gif' style='position:absolute; left:94; top:8; z-index:1; width:38px; height:38px;'>
</div>

<div id='infopop' style='position:absolute; width: 64px; height: 123px; z-index:500; background-position: -960px 0px; background-repeat:no-repeat; overflow: hidden;'></div>
<img id='infobadge' style='position:absolute; z-index:500;'>

<div id='buttons' style='position:absolute; left:0; z-index:500; height:17px;' align='right'></div>

<div id='inventory' style='position:absolute; top:-162; width:267; height: 162; z-index:140; background: url("images/rooms/hand.gif"); background-repeat:no-repeat; overflow: hidden;' onmouseover="stop_tclick();" onmouseout="start_tclick();"></div>

<div id='inventory_back' style='position:absolute; top:2; z-index:141; display: none;' class='knop_trans'><?php new_button(43, 6, $texts["inv_back"], "inv.go_back()", 1, "if(inv.back_able)"); ?></div>
<div id='inventory_next' style='position:absolute; top:2; z-index:141; display: none;' class='knop_trans'><?php new_button(44, 6, $texts["inv_next"], "inv.go_next()", 1, "if(inv.next_able)"); ?></div>
<div id='inventory_close' style='position:absolute; top:2; z-index:141; display: none;'><?php new_button(52, 6, $texts["inv_close"], "inv.set(\"close\")", 1); ?></div>

<div id='roominfo1' class='roomfont' style='position:absolute; left:11; z-index:3; font-weight: bold;' onclick="furni.click('')"></div>
<div id='roominfo2' class='roomfont' style='position:absolute; left:11; z-index:3;' onclick="furni.click('')"></div>

<img id='vote_bad' src='images/rooms/bad.gif' style='position:absolute; left:10; z-index:3;' onclick="room.vote('down')">
<img id='vote_good' src='images/rooms/good.gif' style='position:absolute; left:25; z-index:3;' onclick="room.vote('up')">

<div id='vote_text' class='roomfont' style='position:absolute; left:43; z-index:3;' onclick="furni.click('')"><?php echo $texts["vote_text"]; ?></div>

<img id='tile_hover' src='images/tile_hover_b.gif' onclick="furni.click('')" style='position: absolute; z-index:2; display: none;'>

<div id='voted_text' class='roomfont' style='position:absolute; left:11; z-index:3; display: none;' onclick="furni.click('')"></div>

<div id="roomtoolbar" style='position:absolute; left:0; height: 50px; z-index:500;'>

<div id='yourface2' style='position:absolute; left:10; top:3; width: 50px; height: 48px; background-position: -8px -20px; background-repeat:no-repeat;'></div>

<div style='position:absolute; left:66; top:6; z-index:2;'>
<table cellpadding="0" border="0" cellspacing="0.0">
  <tr>
    <td><img src="images/rooms/chatbar1.gif" style="width: 14px;  height: 40px; border-width: 0px;"></td>
    <td style="background:url(images/rooms/chatbar2.gif) repeat-x;" class="clientfont">
	<input type='text' value="" id='roomchat' onclick="this.value=''; this.style.width='44px';" style="background:transparent; border:0px solid transparent;" class='chatfont' onKeyDown='room.chat.expand()' onKeyUp='room.chat.expand()' onKeyPress='Core.CatchEnter(event, "roomchat");'>
	</td>
    <td><img src="images/rooms/chatbar3.gif" style="width: 8px;  height: 40px; border-width: 0px;"></td>
</tr>
</table>
</div>

<table height='50' width='100%' border='0' cellpadding='0' cellspacing='0'>
<tr>
<td style="background: url('images/rooms/toolbar.gif') repeat-x; padding: 5px 0px 0px 0px;" class="clientfont" align="right">
<img onclick="set_top('catalogue'); ReverseContent('catalogue'); catalogue.init();" src="images/icon3.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;
<img onclick="messenger.reverse();" id='messenger_icon2' src="images/icon1.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;
<img onclick="navi.reverse();" src="images/icon2.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;
<img onclick="chatbox.reverse();" src="images/icon4.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;
<img onclick="inv.set('reverse');" src="images/icon5.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;
<img onclick="set_top('help_layer'); ReverseContent('help_layer');" src="images/icon6.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;
<img onclick="room.leave();" src="images/icon7.gif" border="0" style="cursor: pointer;" align="middle">&nbsp;&nbsp;&nbsp;
</td>
</tr>
</table>

</div>

</div>

<!-- Kamer laden -->

<div id="load_layer" style="position:absolute; background-color: black; display:none; left:0; top:0;">
<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'><tr><td valign='middle' align='center'>
<div style='position:relative; width:265; height:94;'>
<img src='images/rooms/load.gif'>
<div style='position:absolute; left:0; top:33; width:265; height:94;' class='clientfont' align='center'><b><?php echo $texts["room_loading"]; ?></b></div>
</div>
</td></tr></table>
</div>

<!-- Einde Kamer laden -->

</div>

<!-- End Rooms -->

<!-- Meubel instellen -->

<div id="config_furni_layer" onmouseover="stop_tclick();" onmouseout="start_tclick();" style="position:absolute; background-color: #A5A8B6; z-index:11; display:none; left:10; top:10; height:400; width:175;">

<div style='position:absolute; left:160; top:5; height:11; width:11;' onclick="config_furni_stop();">
<?php echo $texts["config_furni_stop"]; ?>
</div>

<div id='config_furni_text_1' class='clientfont' style='overflow: hidden; position:absolute; left:5; top:5; height:375; width:140;'>
</div>

<div class='clientfont' style='position:absolute; left:5; top:380;'>
<a onclick='config_update()'><b><?php echo $texts["config_furni_session"]; ?></b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onclick='save_config(bezig_furni_id)'><b><?php echo $texts["config_furni_save"]; ?></b></a>
</div>

</div>

<!-- Einde Meubel instellen -->

<!-- Buy -->

<div id="kopen" style="position:absolute; display:none; left:0; top:0; z-index:140;" onmouseover="stop_tclick();" onmouseout="start_tclick();">

<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'>
<tr>
<td valign='middle'>
<center>

<div style="position:relative; background: url(images/shop/koop1.gif) no-repeat; width:311px; height:257px;">

<?php new_shadow(311,257) ?>

<div class='clientfont' id='koop1_prijs' style='position:absolute; left:0; top:68; z-index:1; height: 205px; width:308px; display: none;'></div>
<div class='clientfont' id='koop1_jouwgeld' style='position:absolute; left:0; top:106; z-index:1; height: 205px; width:308px; display: none;'></div>
<div class='clientfont' id='koop1_kado' style='position:absolute; left:0; top:133; z-index:1; height: 205px; width:308px; display: none;'></div>
<div class='clientfont' id='koop2_layer' style='position:absolute; left:13; top:87; z-index:1; height: 118px; width:281px; display: none; background-color: #bdbdbd;'>
<div class='clientfont' style='position:absolute; left:27; top:9; z-index:1; text-align: left;'>
<?php echo $texts["buy_presentIsFor"]; ?>
</div>

<div class='clientfont' style='position:absolute; left:12; top:50; z-index:1; text-align: left;'>
<?php echo $texts["buy_presentMessage"]; ?>
</div>
</div>

<div class='clientfont' id='koop2_prijs' style='position:absolute; left:0; top:28; z-index:1; height: 205px; width:308px; display: none;'></div>
<div class='clientfont' id='koop2_jouwgeld' style='position:absolute; left:0; top:66; z-index:1; height: 205px; width:308px; display: none;'></div>
<div class='clientfont' id='koop2_kado' style='position:absolute; left:24; top:95; z-index:1; height: 205px; width:308px; display: none;' align='left'></div>

<div id='kado_voorwie_layer' style='position:absolute; left:42; top:113; z-index:1; display: none;'>
<input type='text' size='32' maxlength='20' id='kado_voorwie' class='clientfont'>
</div>

<div id='kado_text_layer' style='position:absolute; left:24; top:166; z-index:1; display: none;'>
<textarea id='kado_text' class='clientfont' rows='1' cols='46'>
</textarea>
</div>

<div style='position:absolute; left:128; top:215; z-index:9;'>
<?php new_button(4, 1, $texts["buy_stop"], "catalogue.buy_stop()", 0); ?>
</div>
<div style='position:absolute; left:200; top:213; z-index:9;'>
<?php new_button(6, 2, $texts["buy_ok"], "catalogue.buy_ok()", 1); ?>
</div>

<div class='clientfont' id='koop_aantal_div' style='position:absolute; left:55; top:215; z-index:1; display: none;'>
<?php echo $texts["buy_amount"]; ?> <input type='text' size='2' maxlength='2' id='koop_aantal' class='clientfont' value='1' onchange='catalogue.buy_amount();'>
</div>

</div>

</center>
</td>
</tr>
</table>

</div>

<!-- End Buy -->

<!-- Helptool -->

<div id="help_layer" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('help_layer');" style="position:absolute; background: url(images/help/layer.gif) no-repeat; display:none; overflow: hidden; left:325; top:103; width:307; height:335; z-index:140;">

<?php new_shadow(304,332,3,3) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'help_layer')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["about_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>
<div style='position:absolute; left:280; top:7; width: 11px; height: 11px;'><img onclick="HideContent('help_layer');" src="images/help/close.gif" border='0' style='cursor: pointer;' align='top'></div>

<div style="position:absolute; left:10; top:30; width:218; height:290;">

<table border='0' width="218" height="290">
<tr><td valign="middle" align='left'>

<table border='0'>
<tr><td rowspan='2' width='58' align='center' valign='top'><img src='images/help/icon.gif'></td><td height='6'></td></tr><tr><td class='clientfont' width='160' align='left'>
<b><?php echo $texts["about_title"]; ?></b><br>
<?php echo $texts["about_text"]; ?><br><br>
<b><?php echo $texts["team_manager"]; ?></b> <?php
$list = "";
$sql = mysql_query("SELECT username FROM members WHERE rank='4' ORDER BY id;");
if (mysql_num_rows($sql) >= 1) 
{
	while ($row = mysql_fetch_array($sql)) 
    {
	    $list .= ", ".ucfirst($row['username']);
    }
    echo substr($list, 1, (strlen($list)-1));
}
else
{
	echo "-";
}
?><br>
<b><?php echo $texts["team_staff"]; ?></b> <?php
$list = "";
$sql = mysql_query("SELECT username FROM members WHERE rank='3' ORDER BY id;");
if (mysql_num_rows($sql) >= 1) 
{
	while ($row = mysql_fetch_array($sql)) 
    {
	    $list .= ", ".ucfirst($row['username']);
    }
    echo substr($list, 1, (strlen($list)-1));
}
else
{
	echo "-";
}
?><br>
<b><?php echo $texts["team_other"]; ?></b> <?php
$list = "";
$sql = mysql_query("SELECT username FROM members WHERE rank!='1' AND rank!='3' AND rank!='4' ORDER BY id;");
if (mysql_num_rows($sql) >= 1) 
{
	while ($row = mysql_fetch_array($sql)) 
    {
	    $list .= ", ".ucfirst($row['username']);
    }
    echo substr($list, 1, (strlen($list)-1));
}
else
{
	echo "-";
}
?>
<br><br><?php new_button(46, 2, $texts["about_close"], 'HideContent("help_layer");', 1); ?>
</td></tr></table>
</td></tr></table>
</div>

</div>

<!-- Einde Helptool -->

<!-- Club -->

<div id="club_layer" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('club_layer');" style="position:absolute; background: url(images/club/layer.gif) no-repeat; display:none; overflow: hidden; left: 311px; top: 127px; width:341; height:289; z-index:140;">

<?php new_shadow(338,286,3,3) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'club_layer')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["club_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>
<div style='position:absolute; left:314; top:7; width: 11px; height: 11px;'><img onclick="HideContent('club_layer');" src="images/club/close.gif" border='0' style='cursor: pointer;' align='top'></div>

<img style='position:absolute; left:33; top:40;' src='images/club/frank.gif'>
<img style='position:absolute; left:19; top:185;' src='images/club/buylayer.gif'>

<div class='clientfont' style="position:absolute; left:94; top:39; width: 210px;">
<span style='font-weight: bold;'><?php echo $texts["club_intro_header"]; ?></span><br><br>
<?php echo $texts["club_intro_text"]; ?><br>
<span onclick="club.moreclick();" style="color: blue; cursor: pointer; text-decoration: underline;"><?php echo $texts["club_intro_more"]; ?></span>
</div>

<div style='position:absolute; left:40; top:200;'><?php new_button(58, 5, "&nbsp;&nbsp;&nbsp;&nbsp;".$texts["club_buy"]."&nbsp;&nbsp;&nbsp;&nbsp;", 'client.notify("'.$texts["club_buy_website"].'");', 1); ?></div>
<div class='clientfont' style='position:absolute; left:130; top:202;'><?php echo $texts["club_price"]; ?></div>
<div style='position:absolute; left:23; top:245;'><?php new_button(59, 1, $texts["club_button_close"], 'HideContent("club_layer");', 1); ?></div>


</div>

</div>

<!-- Einde Club -->

<!-- Credit Codes -->

<div id="codes_layer" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('codes_layer');" style="position:absolute; background: url(images/code/layer.gif) no-repeat; display:none; overflow: hidden; left:282; top:215; width:315; height:211; z-index:140;">

<?php new_shadow(312,208,3,3) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'codes_layer')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["crcode_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>
<div style='position:absolute; left:290; top:7; width: 11px; height: 11px;'><img onclick="HideContent('codes_layer');" src="images/code/close.gif" border='0' style='cursor: pointer;' align='top'></div>

<div id='cr_code_toptext' class='clientfont' style="position:absolute; left:24; top:44; font-weight: bold;">
<?php echo $texts["crcode_enter"]; ?>
</div>

<img src='images/code/vak.gif' style='position:absolute; left:24; top:62;'>

<div style='position:absolute; left:31; top:61; width: 92;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:91; height:17;' onclick='$("cr_code_input").focus();'>
<input id='cr_code_input' type="text" size="10" class='roundinput' maxlength='10' style='width: 91px;'>
</div>

<div style='position:absolute; left:138; top:59;'>
<?php new_button(49, 2, $texts["crcode_send"], "crcodes.check();", 1); ?>
</div>

<div class='clientfont' style="position:absolute; left:23; top:89; width: 265px; height: 70px;">
<?php echo $texts["crcode_help"]; ?>
</div>

<div style='position:absolute; left:10; top:167; width: 289px;' align='center'>
<?php new_button(50, 5, $texts["crcode_stop"], 'crcodes.checkedok();', 1); ?>
</div>

<div id='cr_code_checking' class='item_trans2' style='position:absolute; left:12; top:32; width: 286px; height: 161px; background-color: #efefef; display: none;'></div>

</div>

<!-- Einde Credit Codes -->

<!-- Doneren -->

l<div id="donate_layer" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('donate_layer');" style="position:absolute; background: url(images/donate_layer.gif) no-repeat; display:none; overflow: hidden; left:327; top:189; width:308; height:165; z-index:140;">

<?php new_shadow(305,162,3,3) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'donate_layer')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["notify_default"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>

<div class='clientfont' style="position:absolute; left:23; top:55; width: 255px; height: 58px;">
<?php echo $texts["donate_text"]; ?>
</div>

<div style='position:absolute; left:174; top:106;'>
<?php new_button(60, 2, $texts["donate_proceed"], "furni.donate.proceed();", 1); ?>
</div>

<div style='position:absolute; left:65; top:108;'>
<?php new_button(61, 5, $texts["donate_stop"], 'furni.donate.stop();', 1); ?>
</div>

</div>

<!-- Einde Doneren -->

<!-- Camera -->

<div id="camera" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('camera');" style="position:absolute; background: url(images/camera/layer.gif) no-repeat; overflow: hidden; display:none; left:160; top:100; width:219; height:327; z-index:140;">

<div style='position:absolute; left:21; top:5; width:175; height:15;' onmousedown="dragStart(event, 'camera')"></div>

<img onclick="HideContent('camera'); packets.send.getdrink('');" src="images/camera/close.gif" border='0' style='cursor: pointer; position:absolute; left:181; top:7;'>

<div id='savepic' style='position:absolute; left:28; top:23; width: 161; height: 117;'></div>

<img id='cameratake' onclick='camera.take()' style='position:absolute; left:30; top:178;' src='images/camera/take2.gif'>
<img id='cameradel' onclick='camera.deletepic()' style='position:absolute; left:76; top:178;' src='images/camera/del1.gif'>
<img id='camerasave' onclick='camera.save()' style='position:absolute; left:122; top:178;' src='images/camera/save1.gif'>

<img id='cameracaptionimg' style='position:absolute; left:26; top:224;' src='images/camera/caption1.gif'>

<div class='clientfont' style='position:absolute; left:37; top:209; z-index:11;'>
<?php echo $texts["camera_caption"]; ?>
</div>

<textarea id='camera_caption' style='position:absolute; left:26; top:223; width: 167px; height: 55px; padding: 3px; overflow:hidden; border: 0px; background-color: transparent; font-family: verdana, arial, sans-serif; font-size: 9px; color: #000000; display: none;' onKeyDown="camera.captionreg();" onKeyUp="camera.captionreg();"></textarea>

</div>

<!-- End Camera -->

<!-- Ask Camera -->

<div id="askcamera" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('askcamera');" style="position:absolute; background: url(images/camera/asklayer.gif) no-repeat; overflow: hidden; display:none; left: 0; top: 0; width:223; height:128; z-index:140;">

<div class='clientfont' style='position:absolute; left:0; top:26; width: 233px; height: 10px; z-index:11; font-weight: bold; text-align: center;'>
<?php echo $texts["camera_ask_title"]; ?>
</div>

<div class='clientfont' style='position:absolute; left:35; top:45; z-index:11;'>
<?php echo $texts["camera_ask_text"]; ?>
</div>

<div style='position:absolute; left:50; top:85; z-index:11;'>
<?php new_button(56, 1, $texts["camera_ask_room"], "camera.drag()", 1); ?>
</div>

<div style='position:absolute; left:120; top:82; z-index:11;'>
<?php new_button(57, 2, $texts["camera_ask_shoot"], "camera.open()", 1); ?>
</div>

</div>

<!-- End Ask Camera -->

<!-- Picture -->

<div id="picture" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('picture');" style="position:absolute; background: url(images/camera/picturelayer.gif) no-repeat; overflow: hidden; display:none; left: 100; top: 100; width:175; height:194; z-index:140;" onmousedown="dragStart(event, 'picture')">

<img onclick="HideContent('picture');" src="images/camera/pictureclose.gif" border='0' style='cursor: pointer; position:absolute; left:157; top:4;'>

<div id='picturepic' style='position:absolute; left:7; top:18; width: 161; height: 117;'></div>

<div id='picturecaption' class='clientfont' style='position:absolute; left:6; top:136; width: 163px; height: 55px; z-index:11; text-align: left;'></div>

</div>

<!-- End Picture -->

<!-- Chatbox -->

<div id="chatbox" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('chatbox');" style="position:absolute; background: url(images/chat/layer.gif) no-repeat; display:none; overflow: hidden; left:50; top:50; width:430; height:378; z-index:140;">

<?php new_shadow(429,377,1,1); ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'chatbox')">
<center>
<table border='0' height='16' cellpadding='0' cellspacing='0' style='color: #b8b7b7; background-color: #e5e5e5; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 2px 0px 0px 0px;'>
<?php echo $texts["chatbox_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>


<div style='position:absolute; left:400; top:8; width: 11px; height: 11px;'>
<img onclick="chatbox.close();" src="images/chat/close.gif" border='0' style='cursor: pointer;' align='top'>
</div>

<div id="chatbox_text" class='clientfont' style="position:absolute; left:8; top:34; width: 410px; height: 300px; overflow:hidden; border:0px;"></div>
<div id="chatbox_load" class='clientfont' style="position:absolute; left:8; top:34; width: 410px; height: 300px; overflow:hidden; border:0px; display: none;">
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='position:absolute; left:0; top:0;'>
<tr><td valign='middle' align='center' class='clientfont'><img src='images/chat/load.gif'><br><?php echo $texts["chatbox_loading"]; ?></td></tr></table>
</div>

<div style='position:absolute; left:11; top:346; width: 383px; height: 17px;'>
<input class="chatboxinput" id="chatbox_input" onKeyPress="Core.CatchEnter(event, 'chatbox');">
</div>

<div style='position:absolute; left:401; top:346; width: 17px; height: 18px;'>
<img onclick="chatbox.go();" src="images/chat/go.gif" border='0' style='cursor: pointer;' align='top'>
</div>

</div>

<!-- Einde Chatbox -->

<!-- Messenger -->

<div id="messenger" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('messenger');" style="position:absolute; background: url(images/messenger/layer.gif) no-repeat; display:none; overflow: hidden; left:16; top:65; width:256; height:297; z-index:140;">

<?php new_shadow(255,297,1) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'messenger')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #996600; background-color: #FFCB00; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["messenger_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>
<img onclick="messenger.close();" src="images/messenger/close.gif" border='0' style='position:absolute; left:229; top:7; width: 11px; height: 11px; cursor: pointer;' align='top'>

<div id='messenger_text_1' style='position:absolute; left:0; top:0; display:;'>
<img src='images/messenger/streep.gif' style='position:absolute; left:21; top:130;'>
<div id='messenger_text_1_jouwnaam' style='position:absolute; left:83; top:62; font-weight: bold;' class='messengerfont'></div>
<div id='yourface1' style='position:absolute; left:26; top:62; width: 50px; height: 48px; z-index:3; background-position: -8px -20px; background-repeat:no-repeat;'></div>
<input type='text' id='messenger_mission' size='21' maxlength='21' class='messengerinput' style='position:absolute; left:83; top:79;' onKeyDown='messenger.missionreg();' onKeyUp='messenger.missionreg();' onKeyPress='messenger.missiontext();'>
<div id='messenger_link_1' style='position:absolute; left:87; top:162; width:147; height:30; text-decoration: underline; cursor: pointer;' onclick='messenger.show_message();' class='messengerfont'>0 <?php echo $texts["messenge_newmessages"]; ?></div>
<div id='messenger_link_2' style='position:absolute; left:87; top:178; width:147; height:30; text-decoration: underline; cursor: pointer;' onclick='messenger.show_vv();' class='messengerfont'>0 <?php echo $texts["messenge_newrequests"]; ?></div>
</div>

<div id='messenger_text_2' style='position:absolute; left:0; top:0; display:none;'>
<div id='messenger_vrienden' class='messengerscroll' style='position:absolute; left:19; top:33;'></div>
<img id='messenger_text_2_help' onclick='messenger.friendhelp();' style='position:absolute; left:29; top:202; width:13; height:13; cursor: pointer;' src='images/messenger/messenger_ask.gif'>
<div style='position:absolute; left:49; top:200; width: 120px;'><?php new_button(18, 3, $texts["messenger_write_button"], "messenger.startwrite();", 1, "if(messenger.writebutton_enable)"); ?></div>
<div style='position:absolute; left:171; top:200;'><?php new_button(11, 3, $texts["messenger_delbuddy"], "messenger.startdelbuddy();", 1, "if(messenger.delbutton_enable)"); ?></div>
</div>

<div id='messenger_text_3' style='position:absolute; left:0; top:0; display:none;'>
<img src='images/messenger/zoeklayer.gif' style='position:absolute; left:24; top:77;'>
<div id='messengerface1' style='position:absolute; left:25; top:85; width: 50px; height: 48px; background-position: -8px -20px; background-repeat:no-repeat;'></div>
<input type='text' id='messenger_zoeknaam' onKeyPress='Core.CatchEnter(event, "messenger");' size='25' maxlength='20' class='messengerinput' style='position:absolute; left:24; top:52;'>
<div style='position:absolute; left:183; top:52;'><?php new_button(55, 3, $texts["messenger_search_button"], "messenger.search()", 1); ?></div>
<div id='messenger_gevonden_naam' style='position:absolute; left:73; top:86; width:155; font-weight:bold; display:none;' class='messengerfont'></div>
<div id='messenger_gevonden_missie' style='position:absolute; left:73; top:100; width:155; display:none;' class='messengerfont'></div>
<div id='messenger_gevonden_last_online' style='position:absolute; left:73; top:149; width:155; display:none;' class='messengerfont'></div>
<div id='messenger_gevonden_online_status' style='position:absolute; left:73; top:169; width:155; display:none;' class='messengerfont'></div>
<img id='messenger_vergroot' src='images/messenger/vergrootglas.gif' style='position:absolute; left:37; top:151; display:none;'>
<div style='position:absolute; left:25; top:201; width: 200px;'><?php new_button(21, 3, $texts["messenger_askbuddy"], "messenger.search_vv();", 1, "if(messenger.addable)"); ?></div>
</div>

<div id='messenger_text_4' style='position:absolute; left:0; top:0; display:none;'>
<img src='images/messenger/textarea.gif' style='position:absolute; left:24; top:63;'>
<div style='position:absolute; left:32; top:44; width:177px; font-weight: bold;' class='messengerfont'><?php echo $texts["messenger_help_title"]; ?></div>
<div style='position:absolute; left:32; top:69; width:177px; height:100px;' class='messengerfont'><?php echo $texts["messenger_help_text"]; ?></div>
</div>

<div id='messenger_text_5' style='position:absolute; left:0; top:0; display:none;'>
<div id='messenger_text_5_text' style='position:absolute; left:19; top:72; width:215; height:125; font-weight: bold;' align='center' class='messengerfont'></div>
<div style='position:absolute; left:114; top:201;'><?php new_button(17, 3, $texts["messenger_askbuddy_ok"], "messenger.thistab = 0; messenger.tab3();", 1); ?></div>
</div>

<div id='messenger_text_6' style='position:absolute; left:0; top:0; display:none;'>
<div id='messenger_text_6_text' style='position:absolute; left:19; top:60; width:215; height:125; font-weight: bold;' align='center' class='messengerfont'></div>
<div style='position:absolute; left:76; top:201;'><?php new_button(16, 3, $texts["messenger_askbuddy_no"], "messenger.answer_vv(false);", 1); ?></div>
<div style='position:absolute; left:136; top:201;'><?php new_button(15, 3, $texts["messenger_askbuddy_yes"], "messenger.answer_vv(true);", 1); ?></div>
</div>

<div id='messenger_text_7' style='position:absolute; left:0; top:0; display:none;'>
<img src='images/messenger/textarea.gif' style='position:absolute; left:24; top:63;'>
<div style='position:absolute; left:32; top:44; width:177px; font-weight: bold;' class='messengerfont'><?php echo $texts["messenger_friendhelp_title"]; ?></div>
<div style='position:absolute; left:32; top:69; width:177px; height:100px;' class='messengerfont'><?php echo $texts["messenger_friendhelp_text"]; ?></div>
<div style='position:absolute; left:25; top:201; width:40; height:18;'><?php new_button(10, 3, $texts["messenger_friendhelp_ok"], "messenger.thistab = 0; messenger.tab2()", 1); ?></div>
</div>

<div id='messenger_text_8' style='position:absolute; left:0; top:0; display:none;'>
<div id='messenger_text_8_text' style='position:absolute; left:19; top:87; width:215; height:125; font-weight: bold;' align='center' class='messengerfont'></div>
<div style='position:absolute; left:67; top:201;'><?php new_button(13, 3, $texts["messenger_frienddel_no"], "messenger.thistab = 0; messenger.tab2()", 1); ?></div>
<div style='position:absolute; left:134; top:201;'><?php new_button(14, 3, $texts["messenger_frienddel_yes"], "messenger.friend_del()", 1); ?></div>
</div>

<div id='messenger_text_9' style='position:absolute; left:0; top:0; display:none;'>
<div style='position:absolute; left:29; top:39; width:177px; font-weight: bold;' class='messengerfont'><?php echo $texts["messenger_recipient"]; ?></div>
<div id='messenger_text_9_text' style='position:absolute; left:35; top:51; font-weight: bold;' class='messengerfont'></div>
<img id='messenger_text_9_help' style='position:absolute; left:216; top:41; width:13; height:13; cursor: pointer;' onclick='messenger.show_writehelp();' src='images/messenger/messenger_ask.gif'>
<textarea id='messenger_send_message_text' style='position:absolute; left:24; top:80; width: 205px; height: 114px; padding: 3px; overflow:hidden; border: 1px solid #eeeeee; background-color: transparent; font-family: verdana, arial, sans-serif; font-size: 9px; color: #eeeeee;' onKeyDown="messenger.messagereg();" onKeyUp="messenger.messagereg();"></textarea>
<div id='messenger_text_9_button1' style='position:absolute; left:25; top:201;'><?php new_button(19, 3, $texts["messenger_stopwrite"], "messenger.lasttab()", 1); ?></div>
<div id='messenger_text_9_button2' style='position:absolute; left:163; top:201;'><?php new_button(20, 3, $texts["messenger_sendwrite"], "messenger.writefriend()", 1); ?></div>
</div>

<div id='messenger_text_10' style='position:absolute; left:0; top:0; display:none;'>
<img src='images/messenger/textarea.gif' style='position:absolute; left:24; top:63;'>
<div style='position:absolute; left:32; top:44; width:177px; font-weight: bold;' class='messengerfont'><?php echo $texts["messenger_writehelp_title"]; ?></div>
<div style='position:absolute; left:32; top:69; width:177px; height:100px;' class='messengerfont'><?php echo $texts["messenger_writehelp_text"]; ?></div>
<div style='position:absolute; left:25; top:201; width:40; height:18;'><?php new_button(9, 3, $texts["messenger_writehelp_ok"], "messenger.stop_writehelp()", 1); ?></div>
</div>

<div id='messenger_text_11' style='position:absolute; left:0; top:0; display:none;'>
<div id='messengerface2' style='position:absolute; left:21; top:33; width: 45px; height: 48px; background-position: -8px -22px; background-repeat:no-repeat;'></div>
<div id='messenger_text_11_text1' style='position:absolute; left:72; top:39; width:162px; overflow: hidden;' class='messengerfont'></div>
<div id='messenger_text_11_text2' style='position:absolute; left:72; top:49; width:162px; overflow: hidden;' class='messengerfont'></div>
<div id='messenger_message_div' class='messengermessagescroll' style='position:absolute; left:24; top:80;'></div>
<div style='position:absolute; left:55; top:201; width:201; height:18;'><?php new_button(53, 3, $texts["messenger_reply"], "messenger.answer()", 1); ?></div>
<div style='position:absolute; left:171; top:201; width:201; height:18;'><?php new_button(54, 3, $texts["messenger_delmessage"], "messenger.del_message()", 1); ?></div>
</div>

<div id="messenger_tab1_div" style='position:absolute; left:33; top:245; z-index:7;'><img src="images/messenger/<?php echo $texts["lang"] ?>/1b.gif" id="messenger_tab1" onclick="messenger.tab1()"></div>
<div id="messenger_tab2_div" style='position:absolute; left:79; top:245; z-index:7;'><img src="images/messenger/<?php echo $texts["lang"] ?>/2.gif" id="messenger_tab2" onclick="messenger.tab2()"></div>
<div id="messenger_tab3_div" style='position:absolute; left:126; top:245; z-index:7;'><img src="images/messenger/<?php echo $texts["lang"] ?>/3.gif" id="messenger_tab3" onclick="messenger.tab3()"></div>
<div id="messenger_tab4_div" style='position:absolute; left:173; top:245; z-index:7;'><img src="images/messenger/<?php echo $texts["lang"] ?>/4.gif" id="messenger_tab4" onclick="messenger.tab4()"></div>
</div>

<!-- Einde messenger -->

<!-- Navigator -->

<div id="navigator" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('navigator');" style="position:absolute; background: url(images/navi/layer.gif) no-repeat; display:none; overflow: hidden; left:585; top:20; width:366; height:456; z-index:140;">

<?php new_shadow(365,455,1,1) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'navigator')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["navi_title"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>
<img onclick="navi.close();" src="images/navi/close.gif" border='0' style='position:absolute; left:339; top:7; width: 11px; height: 11px; cursor: pointer;' align='top'>

<div id="big_tab1_div" style='position:absolute; left:10; top:29; z-index:7; width:172; height:57;' onclick='navi.bigtab1()'>
<img src="images/navi/tabs/1b.gif" id="big_tab1" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:65; top:11; width:100; height:45;' class='clientfont'><b><?php echo $texts["navi_publics"]; ?></b></div>
</div>
<div id="big_tab2_div" style='position:absolute; left:181; top:29; z-index:7; width:171; height:57;' onclick='navi.bigtab2()'>
<img src="images/navi/tabs/2a.gif" id="big_tab2" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:65; top:11; width:100; height:45;' class='clientfont'><b><?php echo $texts["navi_guestrooms"]; ?></b></div>
</div>

<div id="small_tab1_div" style='position:absolute; left:10; top:86; z-index:7; width:115; height:24; display: none;' onclick='navi.smalltab1()'>
<img src="images/navi/small_tabs/1a.gif" id="small_tab1" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:24; top:7; width:90; height:15;' class='clientfont'><?php echo $texts["navi_search"]; ?></div>
</div>
<div id="small_tab2_div" style='position:absolute; left:125; top:86; z-index:7; width:113; height:24; display: none;' onclick='navi.smalltab2()'>
<img src="images/navi/small_tabs/2a.gif" id="small_tab2" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:24; top:7; width:88; height:15;' class='clientfont'><?php echo $texts["navi_ownrooms"]; ?></div>
</div>
<div id="small_tab3_div" style='position:absolute; left:238; top:86; z-index:7; width:114; height:24; display: none;' onclick='navi.smalltab3()'>
<img src="images/navi/small_tabs/3a.gif" id="small_tab3" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:24; top:7; width:89; height:15;' class='clientfont'><?php echo $texts["navi_favo"]; ?></div>
</div>

<div>

<div id='tabtitel_1' style='position:absolute; left:32; top:93; z-index:7; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold; visibility: visible;'>
<?php echo $texts["navi_publics"]; ?>
</div>

<div id='tabtitel_2' style='position:absolute; left:32; top:111; z-index:7; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold; display: none;'>
<?php echo $texts["navi_guestrooms"]; ?>
</div>

<div id='tabtitel_3' style='position:absolute; left:32; top:164; z-index:7; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold; display: none;'>
<?php echo $texts["navi_searchresults"]; ?>
</div>

<div id='tabtitel_4' style='position:absolute; left:32; top:164; z-index:7; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold; display: none;'>
<?php echo $texts["navi_yourRooms"]; ?>
</div>

<div id='tabtitel_5' style='position:absolute; left:32; top:119; z-index:7; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold; display: none;'>
<?php echo $texts["navi_yourFavos"]; ?>
</div>

<div id='wijziglayer' style='position:absolute; left:10; top:109; z-index:10; display: none;'>
<img src="images/navi/wijziglayer.gif" id="wijziglayer_src">
</div>

<div style='position:absolute; left:60; top:414; z-index:11;'>
<?php new_button(7, 1, $texts["navi_change_stop"], "stop_change_room()", 0); ?>
</div>

<div style='position:absolute; left:128; top:414; z-index:11;'>
<?php new_button(29, 1, $texts["navi_change_del"], "del_change_room()", 0); ?>
</div>

<div style='position:absolute; left:279; top:412; z-index:11;'>
<?php new_button(8, 2, $texts["navi_change_ok"], "save_change_room()", 0); ?>
</div>

<div id='navi_change_text_div' style='position:absolute; height: 294px; left:58; top:109; z-index:11; display: none;'>
<table class='clientfont' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'>
<tr>
<td valign='middle'>
<?php echo $texts["navi_change_roomname"]; ?><br>
<input type='text' size='43' maxlength='30' id='change_name' class='clientfont'>
<br><br>
<?php echo $texts["navi_change_roomdesc"]; ?>:<br>
<textarea id='change_desc' cols='40' rows='3' class='clientfont'></textarea>
<br><br>
<input onclick="change_safe_pass()" type="radio" value="1" id="change_safety_1" checked> <?php echo $texts["navi_change_lock1"]; ?><br>
<input onclick="change_safe_pass()" type="radio" value="2" id="change_safety_2"> <?php echo $texts["navi_change_lock2"]; ?><br>
<input onclick="change_safe_pass()" type="radio" value="3" id="change_safety_3"> <?php echo $texts["navi_change_lock3"]; ?>
<br><br>
<div id='change_pass_div' style='z-index:11; display: none;'>
</div>
<input type="hidden" id="change_id" checked>
</td>
</tr>
</table>
</div>

<div id='navi_blanc_layer' style='position:absolute; left:10; top:29; z-index:12; display: none;'>
<img src="images/navi/blanc_layer.gif" id="blanc_layer_src">
</div>

<div id='navi_del_text_div1' style='position:absolute; width: 342px; height: 413px; left:10; top:29; z-index:12; display: none;'>
<div style='position: absolute; top:150; width:342px; font-weight: bold;' class='clientfont' align='center'>
<?php echo $texts["navi_delroom1"]; ?><br><br>
</div>
</div>

<div id='navi_del_text_div2' style='position:absolute; width: 342px; height: 413px; left:10; top:29; z-index:12; display: none;'>
<div style='position: absolute; top:150; width:342px; font-weight: bold;' class='clientfont' align='center'>
<?php echo $texts["navi_delroom2"]; ?><br><br>
</div>
</div>

<div id='navi_del_text_div3' style='position:absolute; width: 342px; height: 413px; left:10; top:29; z-index:12; display: none;'>
<div style='position: absolute; top:150; width:342px; font-weight: bold;' class='clientfont' align='center'>
<?php echo $texts["navi_roomgone"]; ?><br><br>
</div>
</div>

<div style='position:absolute; left:127; top:285; z-index:13;'>
<?php new_button(32, 1, $texts["navi_stopdel"], "stop_del_change_room()", 0); ?>
</div>
<div style='position:absolute; left:184; top:282; z-index:13;'>
<?php new_button(33, 2, $texts["navi_delroom"], "del_change_room()", 0); ?>
</div>
<div style='position:absolute; left:163; top:225; z-index:13;'>
<?php new_button(34, 2, $texts["navi_roomgone_ok"], "click_small_tab2()", 0); ?>
</div>

<div id='navi_go_room_pass' style='position:absolute; width: 342px; height: 413px; left:10; top:29; z-index:12; display: none;'>
<div style='position: absolute; top:74; width:342px;' class='clientfont' align='center'>
<div id='navi_go_room_pass_text'></div>
</div>
</div>

<div style='position:absolute; left:127; top:285; z-index:13;'>
<?php new_button(30, 1, $texts["navi_enterpwd_stop"], "stop_enterpass()", 0); ?>
</div>
<div style='position:absolute; left:184; top:282; z-index:13;'>
<?php new_button(31, 2, $texts["navi_enterpwd_ok"], "enterpass(navi_room_selected_id, navi_room_selected_pass)", 0); ?>
</div>


<div id='zoeklayer' style='position:absolute; left:10; top:110; z-index:8; display: none;'>
<img src="images/navi/infolayer.gif" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:12; top:8; width:325; height:30;' class='clientfont'><?php echo $texts["navi_search_help"]; ?></div>
</div>

<div id='zoekvak' style='position:absolute; left:16; top:130; z-index:9; display: none;'>
<input type='text' size='38' id='navi_search' onKeyPress='Core.CatchEnter(event, "navi");' class='clientfont'>
</div>

<div style='position:absolute; left:305; top:132; z-index:9;'>
<?php new_button(22, 1, $texts["navi_search_button"], "navi.search()", 0); ?>
</div>

<div id='eigenlayer' style='position:absolute; left:10; top:110; z-index:8; width:342; height:45; display: none;'>
<img src="images/navi/infolayer.gif" style="position:absolute; left:0; top:0;">
<div style='position:absolute; left:12; top:8; width:325; height:30;' class='clientfont'><?php echo $texts["navi_matic_help"]; ?></div>
</div>

<div style='position:absolute; left:16; top:132; z-index:9; width:225px;'>
<?php new_button(26, 1, $texts["navi_matic_button"], "matic.naviclick()", 0); ?>
</div>
<img id="maakmachine" onclick='matic.naviclick()' src="images/navi/matic.gif" border='0' style='position:absolute; left:317; top:115; z-index:8; display: none;'>

<div id='naviplaatje' style='position:absolute; left:26; top:354; z-index:8;'>
<table border='0' cellpadding='0' cellspacing='0' height='68' width='58'>
<tr><td valign='middle'><center>
<img src="images/navi/icons/8.gif" id="tabtitel_src">
</center></td></tr>
</table>
</div>

<div id='roomschrijf_1' style='position:absolute; left:96; top:352; z-index:6; height: 60px; width:230px; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold;'>
<?php echo $texts["navi_publics"]; ?>
</div>

<div id='roomschrijf_2' style='position:absolute; left:96; top:362; z-index:6; height: 60px; width:230px; font-family: verdana, arial, sans-serif; font-size: 9px; font-weight: bold;'>
</div>

<div id='roomschrijf_3' style='position:absolute; left:96; top:374; z-index:6; height: 60px; width:230px; font-family: verdana, arial, sans-serif; font-size: 9px;;'>
<?php echo $texts["navi_publics_help"]; ?>
</div>

<div style='position:absolute; left:291; top:412; z-index:6;'>
<?php new_button(24, 2, $texts["navi_room_go"], "navi.go()", 0); ?>
</div>

<div style='position:absolute; left:125; top:415; z-index:6;'>
<?php new_button(2, 1, $texts["navi_addfavo"], "add_favo(navi_room_selected_id)", 0); ?>
</div>

<div style='position:absolute; left:95; top:415; z-index:6;'>
<?php new_button(3, 1, $texts["navi_delfavo"], "del_favo(navi_room_selected_id)", 0); ?>
</div>

<div id='navi_button_wijzig' style='position:absolute; left:125; top:415; z-index:6;'>
<?php new_button(23, 1, $texts["navi_change_button"], "change_room(navi_room_selected_naam, navi_room_selected_omschrijving, navi_room_selected_type, navi_room_selected_safe, navi_room_selected_van, navi_room_selected_id, navi_room_selected_favo, navi_room_selected_pass)", 0); ?>
</div>


<div id='list_publics' class='scroll' style='height: 230px; position:absolute; left:15; top:110; z-index:5;'></div>
<div id='list_guestrooms' class='scroll' style='height: 207px; position:absolute; left:15; top:128; z-index:5; display: none;'></div>
<div id='list_searched' class='scroll' style='height: 164px; position:absolute; left:15; top:178; z-index:5; display: none;'></div>
<div id='list_own' class='scroll' style='height: 164px; position:absolute; left:15; top:173; z-index:5; display: none;'></div>
<div id='list_favo' class='scroll' style='height: 209px; position:absolute; left:15; top:128; z-index:5; display: none;'></div>

</div>

</div>

<!-- Einde Navigator -->

<!-- Room-o-Matic -->

<div id="matic_back" class="transp" style="position:absolute; background: url(images/matic/black.gif); z-index:140; display:none; overflow: hidden; left:0; top:0;" onmouseover="stop_tclick();" onmouseout="start_tclick();"></div>

<div id="matic" style="position:absolute; background: url(images/matic/layer.gif) no-repeat; z-index:141; display:none; overflow: hidden; width:324; height:477;" onmouseover="stop_tclick();" onmouseout="start_tclick();">

<img onclick='matic.close();' src="images/matic/close.gif" border='0' style='position:absolute; left:289; top:39; cursor: pointer;'>

<div id='matic_1' style='position:absolute; left:35; top:80; z-index:1; height: 205px; width:255px;'>
<table border='0' cellpadding='0' cellspacing='0' height='205' width='255'>
<tr>
<td valign='middle'>
<div class='maticfont' id='matic_1_text'>
<?php echo $texts["matic_descr"]; ?>
</div>
</td>
</tr>
</table>
</div>

<div id='matic_2' style='position:absolute; left:32; top:71; z-index:1; height: 35px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='35' width='255'>
<tr>
<td valign='middle'>
<center>
<div class='maticfont' id='matic_2_text'>
</div>
</center>
</td>
</tr>
</table>
</div>

<div id='matic_3' style='position:absolute; left:35; top:85; z-index:1; height: 205px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='205' width='255'>
<tr>
<td valign='middle'>
<div class='maticfont' id='matic_3_text'>
<center>
<table class='maticfont' border='0'>
<tr>
<td align='right'><?php echo $texts["matic_roomname"]; ?>&nbsp;&nbsp;</td>
<td><input type='text' size='30' maxlength='30' id='matic_name' class='maticinput'></td>
</tr>
<tr>
<td align='right'><?php echo $texts["matic_owner"]; ?>:&nbsp;&nbsp;</td>
<td><input type='text' size='30' value='<?php echo $_COOKIE["jabbo_name"]; ?>' class='maticinput' readonly></td>
</tr>
</table>
</center>
<br><br>
<?php echo $texts["matic_roomdescr"]; ?>:
<br>
<textarea id='matic_desc' style='width: 240px; height: 75px; padding: 3px; overflow:hidden; border: 1px solid #b5ef6b; background-color: transparent; font-family: verdana, arial, sans-serif; font-size: 9px; color: #b5ef6b;'></textarea>
</div>
</td>
</tr>
</table>
</div>

<div id='matic_4' style='position:absolute; left:32; top:296; z-index:1; height: 17px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='17' width='255'>
<tr>
<td valign='middle'>
<center>
<div class='maticfont' id='matic_4_text'>
</div>
</center>
</td>
</tr>
</table>
</div>

<div id='matic_5' style='position:absolute; left:35; top:80; z-index:1; height: 205px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='205' width='255'>
<tr>
<td valign='middle'>
<center>
<table border='0'>
<tr>
<td valign='center' align='center'>
<img onclick='matic.arrow1()' src='images/matic/buttons/arrow1.gif'>
</td>
<td valign='center' align='center' width='150' height='150'><img id='matic_type_image' src="images/matic/roomtype/1.gif"></td>
<td valign='center' align='center'>
<img onclick='matic.arrow2()' src='images/matic/buttons/arrow2.gif'>
</td>
</tr>
<tr>
<td valign='center' align='center' colspan='3'>
<div class='maticfont' id='matic_5_text'></div>
</td>
</tr>
</table>
</center>
</td>
</tr>
</table>
</div>

<div id='matic_6' style='position:absolute; left:35; top:80; z-index:1; height: 205px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='205' width='255'>
<tr>
<td valign='middle'>
<div class='maticfont' id='matic_6_text'>
<input type="radio" value="1" name='matic_safety' id="matic_safety_1" checked> <?php echo $texts["matic_safe1"]; ?><br>
<input type="radio" value="2" name='matic_safety' id="matic_safety_2"> <?php echo $texts["matic_safe2"]; ?><br>
<input type="radio" value="3" name='matic_safety' id="matic_safety_3"> <?php echo $texts["matic_safe3"]; ?>
</div>
</td>
</tr>
</table>
</div>

<div id='matic_7' style='position:absolute; left:35; top:80; z-index:1; height: 205px; width:255px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' height='205' width='255'>
<tr>
<td valign='middle'>
<div class='maticfont' id='matic_7_text'>
<b><?php echo $texts["matic_pass1"]; ?>:</b><br>
<input type='password' size='15' maxlength='15' id='matic_pass1' class='maticinput'>
<br><br>
<b><?php echo $texts["matic_pass2"]; ?>:</b><br>
<input type='password' size='15' maxlength='15' id='matic_pass2' class='maticinput'>
</div>
</td>
</tr>
</table>
</div>

<img id='matic_lijn_1' src="images/matic/lijn.gif" style="position:absolute; left:32; top:288; z-index:1; height: 1px; width:255px;">
<img id='matic_lijn_2' src="images/matic/lijn.gif" style="position:absolute; left:32; top:70; z-index:1; height: 1px; width:255px; display: none;">
<img id='matic_lijn_3' src="images/matic/lijn.gif" style="position:absolute; left:32; top:105; z-index:1; height: 1px; width:255px; display: none;">
<img id='matic_knop_1' onclick='matic.close()' src="images/matic/buttons/afbreken.gif" style="position:absolute; left:44; top:296; z-index:1;">
<img id='matic_knop_2' onclick='matic.button2()' src="images/matic/buttons/start.gif" style="position:absolute; left:194; top:296; z-index:1;">
<img id='matic_knop_3' onclick='matic.close()' src="images/matic/buttons/afbreken.gif" style="position:absolute; left:32; top:296; z-index:1; display: none;">
<img id='matic_knop_4' onclick='matic.button3()' src="images/matic/buttons/start.gif" style="position:absolute; left:213; top:296; z-index:1; display: none;">
<img id='matic_knop_5' onclick='matic.button4()' src="images/matic/buttons/vorige.gif" style="position:absolute; left:32; top:296; z-index:1; display: none;">
<img id='matic_knop_6' onclick='matic.button5()' src="images/matic/buttons/volgende.gif" style="position:absolute; left:201; top:296; z-index:1; display: none;">
<img id='matic_knop_7' onclick='matic.button6()' src="images/matic/buttons/vorige.gif" style="position:absolute; left:32; top:296; z-index:1; display: none;">
<img id='matic_knop_8' onclick='matic.button7()' src="images/matic/buttons/klaar1.gif" style="position:absolute; left:201; top:296; z-index:1; display: none;">

</div>

<!-- Einde Room-o-Matic -->

<!-- catalogue -->

<div id="catalogue" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('catalogue');" style="position:absolute; background: url(images/shop/layer.gif) no-repeat; display:none; overflow: hidden; left:197; top:9; width:446; height:462; z-index:140;">

<img src='images/shop/shade.gif' class='transp' style='position:absolute; left:324; top:22;'>

<div class="handle" onmousedown="dragStart(event, 'catalogue')" style="position:absolute; left:0; top:0; height:29; width:325;">
<table border='0' width="100%" height="100%" cellpadding="0" cellspacing="0">
<tr>
<td>
</td>
</tr>
</table>
</div>

<div class="handle" onmousedown="dragStart(event, 'catalogue')" style="position:absolute; left:328; top:20; height:15; width:109;">
<table border='0' width="100%" height="100%" cellpadding="0" cellspacing="0">
<tr>
<td>
</td>
</tr>
</table>
</div>
<img onclick="HideContent('catalogue');" src="images/shop/close.gif" border='0' style='position:absolute; left:420; top:22; width: 11px; height: 11px; cursor: pointer;' align='top'>

<img src='images/shop/smallcoins.gif' style='position:absolute; left:11; top:441;'>

<div id='purse_text2' class='clientfont' style='position:absolute; left:36; top:441;'></div>
<div style="position:absolute; left:165; top:440; width:150px; height: 9px;" align='right'>
<table border='0' cellpadding='0' cellspacing='0'><tr><td class='clientfont' style='text-decoration: underline; cursor: pointer;' onclick="if (!catalogue.loading) { client.notify('<?php echo $texts["catalogue_crhelp_text"]; ?>'); }"><?php echo $texts["catalogue_crhelp"]; ?></td></tr></table>
</div>

<img id='cat_logo' src='images/blank.gif' style='position:absolute; left:19; top:35; display: none;'>

<div id='cat_frontpage' style='display:none;'>

<img id='cat_front_logo' src='images/blank.gif' style='position:absolute; left:22; top:47;'>

<div style='position:absolute; background: url(images/shop/wow1.gif) no-repeat; left:176; top:136; width: 135px; height: 61px;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'>
<tr><td valign='middle' align='center'>
<div id='cat_front_wow' class='clientfont' style='padding: 10px; font-weight: bold;'></div>
</td></tr></table>
</div>

<img id='cat_front_img1' src='images/blank.gif' style='position:absolute; left:215; top:232;'>

<div id='cat_front_text1' class='clientfont' style='position:absolute; left:23; top:212; width: 175px; height: 100px;'></div>

<img src='images/shop/purse_layer.gif' style='position:absolute; left:17; top:323;'>
<img src='images/shop/purse.gif' style='position:absolute; left:36; top:346;'>

<div id='purse_text1' class='clientfont' style='position:absolute; left:88; top:345; width: 220px; height: 25px; font-weight: bold; text-align: center;'></div>

<div id='purse_text3' class='clientfont' style='position:absolute; left:34; top:405; width: 259px; height: 9px; color: #eeeeee;'></div>

<div style='position:absolute; left:116; top:376;'>
<?php new_button(47, 4, $texts["catalogue_codes_button"], "crcodes.show()", 1); ?>
</div>

<div style='position:absolute; left:176; top:376; width:125px;' align='right'>
<?php new_button(48, 4, $texts["catalogue_transactions_button"], "transactions_show()", 1); ?>
</div>

</div>

<div id='cat_camera' style='display:none;'>
<img src='images/shop/films_div.gif' style='position:absolute; left:20; top:302;'>
<img id='cat_camera_img1' src='images/blank.gif' style='position:absolute; left:192; top:137;'>
<div id='cat_camera_text1' class='clientfont' style='position:absolute; left:20; top:135; width: 165px; height: 140px;'></div>
<div id='cat_camera_text2' class='clientfont' style='position:absolute; left:125; top:312; width: 176px; height: 80px; color:#993300;'></div>
<div style='position:absolute; left:147; top:246;'><?php new_button(51, 1, $texts["catalogue_buy"], "catalogue.buy()", 1); ?></div>
</div>

<div id='cat_club' style='display:none;'>
<img src='images/shop/clublayer.gif' style='position:absolute; left:12; top:102;'>

<div class='clientfont' style='position:absolute; left:25; top:125; width: 270px; height: 250px; padding: 6px 0px 0px 6px;'>
<img id='cat_club_img1' src='images/blank.gif' style='position:relative; padding: 0px 6px 6px 0px; float: left; vertical-align:text-top;'>
<div id="cat_club_text"></div>
</div>

</div>

<div id='cat_market' style='display:none;'>
</div>

<div id='cat_presents' style='display:none;'>
<img id='cat_presents_img1' src='images/blank.gif' style='position:absolute; left:27; top:127;'>
<img id='cat_presents_img2' src='images/blank.gif' style='position:absolute; left:195; top:274;'>
<div id='cat_presents_text1' class='clientfont' style='position:absolute; left:90; top:137; width: 212px; height: 60px;'></div>
<div id='cat_presents_text2' class='clientfont' style='position:absolute; left:35; top:271; width: 158px; height: 110px;'></div>
</div>

<div id='cat_norares' style='display:none;'>

<div style='position:absolute; background: url(images/shop/norares_text.gif) no-repeat; left:39; top:111; width: 243px; height: 94px;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='68' style='position:absolute; left:0; top:0;'>
<tr><td valign='middle' align='center'>
<div id='cat_norares_text' class='clientfont' style='padding: 5px;'></div>
</td></tr></table>
</div>

<div style='position:absolute; left:0; top:148; width: 325px; height: 290px;'>
<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'><tr><td valign='middle' align='center'>
<img id='cat_norares_img' src='images/blank.gif'>
</td></tr></table>
</div>

</div>

<div id='cat_productpage1' style='display:none;'>

<div id='cat_productpage1_desc' class='clientfont' style='position:absolute; left:22; top:106; width: 281px;'></div>

<div style='position:absolute; left:0; top:110; width: 325px; height: 328px;'>
<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'><tr><td valign='middle' align='center'>
<img id='cat_productpage1_img' src='images/blank.gif'>
</td></tr></table>
</div>

<div id='cat_productpage1_text1' class='clientfont' style='position:absolute; left:0; top:348; width: 325px; height: 11px; text-align: center; font-weight: bold;'></div>
<div id='cat_productpage1_text2' class='clientfont' style='position:absolute; left:92; top:359; width: 140px; text-align: center;'></div>
<div id='cat_productpage1_text3' class='clientfont' style='position:absolute; left:0; top:391; width: 325px; height: 11px; text-align: center;'></div>

<div style='position:absolute; left:0; top:406; width: 325px;' align='center'>
<?php new_button(51, 1, $texts["catalogue_buy"], "catalogue.buy()", 1); ?>
</div>

<div id='cat_productpage1_wow1_div' style='position:absolute; background: url(images/shop/wow1.gif) no-repeat; left:155; top:155; width: 135px; height: 61px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'>
<tr><td valign='middle' align='center'>
<div id='cat_productpage1_wow1' class='clientfont' style='padding: 10px; font-weight: bold;'></div>
</td></tr></table>
</div>

<div id='cat_productpage1_wow2_div' style='position:absolute; background: url(images/shop/wow2.gif) no-repeat; left:155; top:155; width: 135px; height: 61px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='50'>
<tr><td valign='middle' align='center'>
<div id='cat_productpage1_wow2' class='clientfont' style='padding: 5px; font-weight: bold;'></div>
</td></tr></table>
</div>

</div>

<div id='cat_layout2' style='display:none;'>

<div id='catboxes'></div>

<div id='cat_layout2_desc' class='clientfont' style='position:absolute; left:20; top:102; width: 285px; height: 50px;'></div>

<div style='position:absolute; left:20; top:159; font-weight: bold;' class='clientfont'>
<?php echo $texts["catalogue_selectproduct"]; ?>
</div>

<div id='cat_layout2_page' style='position:absolute; left:22; top:384; width: 112px; height: 32px;'>
<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'><tr><td class='clientfont' valign='middle' align='center'>
<?php echo $texts["catalogue_page"]; ?><br><div id='cat_layout2_page_text' style='font-weight: bold;'></div>
</td></tr></table>
</div>

<div id='cat_layout2_arrows'>
<img id='cat_layout2_pijl1' src='images/shop/pijl1_1.gif' style='position:absolute; left:22; top:384;'>
<img id='cat_layout2_pijl2' src='images/shop/pijl2_1.gif' style='position:absolute; left:102; top:384;'>
<img id='cat_layout2_downpijl1' src='images/shop/pijl1_3.gif' style='position:absolute; left:22; top:384; display:none;'>
<img id='cat_layout2_downpijl2' src='images/shop/pijl2_3.gif' style='position:absolute; left:102; top:384; display:none;'>
<img src='images/blank.gif' width='32' height='32' onclick='catalogue.show_blz(catalogue.layout2_pijl1);' onmousedown='if (catalogue.layout2_pijl1 != 0) { ShowContent("cat_layout2_downpijl1"); }' onmouseup='if (catalogue.layout2_pijl1 != 0) { HideContent("cat_layout2_downpijl1"); }' style='position:absolute; left:22; top:384;'>
<img src='images/blank.gif' width='32' height='32' onclick='catalogue.show_blz(catalogue.layout2_pijl2);' onmousedown='if (catalogue.layout2_pijl2 != 0) { ShowContent("cat_layout2_downpijl2"); }' onmouseup='if (catalogue.layout2_pijl2 != 0) { HideContent("cat_layout2_downpijl2"); }' style='position:absolute; left:102; top:384;'>
</div>

<div style='position:absolute; left:152; top:140; width:162px; height: 250px; overflow: hidden;'>
<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'><tr><td valign='middle' align='center'>
<img id='cat_layout2_sideimg' src='images/blank.gif'>
</td></tr></table>
</div>

<img id='cat_productpage1_prijsvak' src='images/shop/prijsvak.gif' style='position:absolute; left:156; top:384;'>

<div id='cat_layout2_text1' class='clientfont' style='position:absolute; left:167; top:345; width:135px; font-weight: bold;'></div>
<div id='cat_layout2_text2' class='clientfont' style='position:absolute; left:166; top:358; width:135px;'></div>
<div id='cat_layout2_text3' class='clientfont' style='position:absolute; left:164; top:393;'></div>

<div style='position:absolute; left:269; top:391;'>
<?php new_button(25, 1, $texts["catalogue_buy"], "catalogue.buy()", 1); ?>
</div>

<div id='cat_layout2_wow1' style='position:absolute; background: url(images/shop/wow1.gif) no-repeat; left:169; top:146; width: 135px; height: 61px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'>
<tr><td valign='middle' align='center'>
<div id='cat_layout2_wow1_text' class='clientfont' style='padding: 10px; font-weight: bold;'></div>
</td></tr></table>
</div>

<div id='cat_layout2_wow2' style='position:absolute; background: url(images/shop/wow2.gif) no-repeat; left:169; top:146; width: 135px; height: 61px; display: none;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%' height='50'>
<tr><td valign='middle' align='center'>
<div id='cat_layout2_wow2_text' class='clientfont' style='padding: 5px; font-weight: bold;'></div>
</td></tr></table>
</div>

</div>

<div id='cat_sidebar_div' class='catscroll' style='position:absolute; left:325; top:40; z-index:10;'>
</div>

<div id='cat_load_div' style='display: none;'>
<div class='item_trans2' style='position:absolute; left:10; top:31; width: 305px; height: 403px; background-color: #eeeeee; z-index:11;'></div>

<div style='position:absolute; left:11; top:34; width: 303px; height: 61px; background-color: #eeeeee; z-index:11;'>
<img src='images/shop/cat_loadtext.gif' style='position:absolute; left:101; top:25; z-index:11;'>
<img src='images/shop/cat_load.gif' style='position:absolute; left:191; top:24; z-index:11;'>
</div>

</div>

<!-- Einde catalogue -->
<?php
}
?>