<?php require_once("config.php"); ?>

<!-- Debug -->

<div id="debug_screen" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('debug_screen');" style="position:absolute; overflow: hidden; display:none; left:0; top:0; height:200; z-index:1;">

<div id="debug_trans" class="item_trans" style="position:absolute; background-color: black; overflow: hidden; left:0; top:0; height:200px;">
</div>

<div id="debug_text" class="clientfont" id="debug_text" style="position:absolute; color: white; overflow: hidden; left:0; top:0; height:185px; padding:2px;">
<font color='yellow'><?php echo $texts["debug_start"]; ?></font>
</div>

<div id="debug_inputlayer" style="position:absolute; left:0; top:0; height:200px;">
<input class="debuginput" id="debug_input" onKeyPress="Core.CatchEnter(event, 'debug');">
</div>

</div>

<!-- End Debug -->

<!-- backview en mainview -->

<img id='backview' src="images/view_generic.png" style="position:absolute; display:none;">

<div id='mainview_div' style='display:none;'>

<!-- Toolbar -->

<div id='toolbar_container' style="position:absolute; overflow: hidden; left:0; height:55;">

<div id='toolbar_div' style="position:absolute; overflow: hidden; left:0; top:55; height:55; background-color: black;">

<div id='toolbar_icons' style='position:absolute; left:0; top:9; height: 41px; overflow: hidden;' align='center'>
<table border='0' cellpadding='0' cellspacing='0' height='41'>
<tr><td valign='middle' align='center' width='46'>
<img onclick="if (user.logged_in) { set_top('catalogue'); ReverseContent('catalogue'); catalogue.init(); }" src='images/catalogue.gif' style='cursor: pointer;'>
</td><td valign='middle' align='center' width='46'>
<img id="messenger_icon1" onclick="if (user.logged_in) { messenger.reverse(); }" src='images/messenger.gif' style='cursor: pointer;'>
</td><td valign='middle' align='center' width='46'>
<img onclick="if (user.logged_in) { navi.reverse(); }" src='images/navigator.gif' style='cursor: pointer;'>
</td><td valign='middle' align='center' width='46'>
<img onclick="if (user.logged_in) { chatbox.reverse(); }" src='images/chatbox.gif' style='cursor: pointer;'>
</td><td valign='middle' align='center' width='46'>
<img onclick="if (user.logged_in) { set_top('club_layer'); ReverseContent('club_layer'); }" src='images/club.gif' style='cursor: pointer;'>
</td><td valign='middle' align='center' width='46'>
<img onclick="if (user.logged_in) { set_top('help_layer'); ReverseContent('help_layer'); }" src='images/help.gif' style='cursor: pointer;'>
</td></tr>
</table>
</div>

</div>

</div>

<!-- Einde Toolbar -->

<div id='main_logo' style='position:absolute; display:none; left:0; top:-168;'>
<img src='images/logo_shade.gif' class='logoshade' style='position:absolute; left:0; top:57;'>
<img src='images/main_logo.gif' style='position:absolute; left:0; top:0;'>
</div>

<div id='main_black_div' style='position:absolute; left:0; top:0; overflow: hidden; display:none;'>
<div id='main_black_1' style='position:absolute; left:0; top:0; background-color: black;'></div>
<div id='main_black_2' style='position:absolute; left:0; background-color: black;'></div>
</div>

</div>

<!-- einde backview en mainview -->

<div id='login_div' style='display:none;'>

<!-- Registreren -->

<div id="register_box" style="position:absolute; background: url(images/register.gif) no-repeat; overflow: hidden; width:215; height:104;">

<?php new_shadow(215,104) ?>

<div style='position:absolute; left:0; top:10; width:212; height:11; text-align: center;' class='titlefont'>
<?php echo $texts["login_firstTimeHere"]; ?>
</div>

<div style='position:absolute; left:0; top:42; width:212; height:30; text-align: center; font-weight: bold;' class='clientfont'>
<?php echo $texts["login_haventGotUser"]; ?><br>
<div onclick='register.open();' style='cursor: pointer;'><u><?php echo $texts["login_create1here"]; ?></u></div>
</div>

</div>

<!-- Einde Registreren -->

<!-- Inloggen -->

<div id="login_box" style="position:absolute; background: url(images/login.gif) no-repeat; overflow: hidden; width:215; height:220;">

<?php new_shadow(215,220) ?>

<div style='position:absolute; left:0; top:10; width:212; height:11; text-align: center;' class='titlefont'>
<?php echo $texts["login_whatsJabboCalled"]; ?>
</div>

<div id='login_hide'>
<img src='images/login_vak.gif' style='position:absolute; left:23; top:56;'>
<img src='images/login_vak.gif' style='position:absolute; left:23; top:112;'>

<div style='position:absolute; left:0; top:38; width:212; height:11; text-align: center;' class='clientfont'>
<?php echo $texts["login_name"]; ?>
</div>

<div style='position:absolute; left:0; top:95; width:212; height:11; text-align: center;' class='clientfont'>
<?php echo $texts["login_pass"]; ?>
</div>

<div style='position:absolute; left:0; top:60; width:212; height:26; text-align: center;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:212; height:26;' onclick='$("login_naam").focus();'>
<input id='login_naam' name='login_naam' type="text" size="20" class='logininput' maxlength='20'>
</div>

<div style='position:absolute; left:0; top:116; width:212; height:26; text-align: center;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:212; height:26;' onclick='$("login_wachtwoord").focus();'>
<input id='login_wachtwoord' name='login_wachtwoord' type="password" size="20" class='logininput' maxlength='20'>
</div>

<div style='position:absolute; left:0; top:152; width:212; height:50;' align='center'>
<?php new_button(1, 2, $texts["button_ok"], "login.attempt()", 1); ?>
</div>

<div id='verbinden_img' class='clientfont' style='position:absolute; left:0; top:155; width:212; height:8; text-align: center; font-weight: bold; display:none;'>
<?php echo $texts["login_connecting"]; ?>
<img src='images/pinken.gif' style='position:absolute; left:13; top:2; width:185; height:8;'>
</div>
</div>

<div id='welcome_jabbo' style='position:absolute; left:0; top:38; width:212; height:8; display: none;' align='center'>
<img id='welcome_jabbo_img' src='images/blank.gif'>
</div>

<div id='welcome_jabbo_text' class='clientfont' style='position:absolute; left:0; top:162; width:212; height:8; text-align: center; font-weight: bold; display: none;'></div>

</div>

<!-- Einde Inloggen -->

</div>

<!-- Alert -->

<div id="alerts"></div>

<!-- Einde Alert -->

<!-- Registreren -->
<div id="register" onmouseover="stop_tclick();" onmouseout="start_tclick();" onClick="set_top('register');" style="position:absolute; background: url(images/register/layer.gif) no-repeat; display:none; overflow: hidden; left:621; top:71; width:307; height:408; z-index:140;">

<?php new_shadow(307,408) ?>

<div style='position:absolute; left:0; top:5; width:100%; height:15;' onmousedown="dragStart(event, 'register')">
<center>
<table border='0' height='15' cellpadding='0' cellspacing='0' style='color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>
<tr><td width='4'></td><td><div style='padding: 3px 0px 0px 0px;'>
<?php echo $texts["reg_details"]; ?>
</div></td><td width='4'></td></tr></table>
</center>
</div>

<div id='register_text5' style='position:absolute; left:0; top:378; width:304; height:8; text-align: center; display:none;' class='titlefont'>
</div>

<div id='register_upperlayer_1' style='position:absolute; left:10; top:29; width:284; height:317; display:none;'>
<img src='images/register/upperlayer1.gif'>
</div>

<div id='register_upperlayer_2' style='position:absolute; left:10; top:29; width:284; height:341; display:none;'>
<img src='images/register/upperlayer2.gif'>
</div>

<div id='register_upperlayer_3' style='position:absolute; left:10; top:29; width:284; height:365; display:none;'>
<img src='images/register/upperlayer3.gif'>
</div>

<div id='register_laden' class='clientfont' style='position:absolute; left:0; top:183; width:304; height:10; text-align: center; display:none;'>
<b><?php echo $texts["reg_connecting"]; ?></b>
<img src='images/pinken.gif' style='position:absolute; left:11; top:2;  width:281; height:10;'>
</div>

<div id='register_ballon' style='position:absolute; left:33; top:50; width:194; height:29; display:none;'>
<img src='images/register/ballon.gif'>
</div>

<div id='register_plaatje1' style='position:absolute; left:137; top:86; width:142; height:105; display:none;'>
<img src='images/register/plaatje1.gif'>
</div>

<div id='register_ballon_text' style='position:absolute; left:33; top:53; width:194; height:8; text-align: center; display:none;' class='clientfont'>
<?php echo $texts["reg_balloon_text"]; ?>
</div>

<div id='register_text1' style='position:absolute; left:24; top:219; width:256; height:122; display:none;' class='clientfont'>
<b><?php echo $texts["reg_createjabbo"]; ?></b><br><br><?php echo $texts["reg_welcometext1"]; ?><br><br><?php echo $texts["reg_welcometext2"]; ?>
</div>

<div style='position:absolute; left:11; top:352; width:80; height:18; text-align: left;'>
<?php new_button(37, 4, $texts["reg_cancel"], "register.close_button()", 0); ?>
</div>

<div style='position:absolute; left:73; top:352; width:220; height:18;' align='right'>
<?php new_button(38, 4, $texts["reg_underage"], "register.jong()", 0); ?>
</div>

<div style='position:absolute; left:73; top:376; width:220; height:18;' align='right'>
<?php new_button(39, 4, $texts["reg_olderage"], "register.step2()", 0); ?>
</div>

<div id='register_text2' style='position:absolute; left:24; top:38; width:255; height:40; display:none;' class='clientfont'>
<?php echo $texts["reg_legal_header"]; ?>
</div>

<div id='register_text3' style='position:absolute; left:24; top:86; width:253; height:213; display:none; border: 1px solid black;' class='scroll'>
<div class='clientfont'><?php echo $options['tos']; ?></div>
</div>

<img onclick='register.push_kruisje()' id='register_kruisje1' src='images/register/kruisje1.gif' style='position:absolute; left:32; top:319; width:12; height:12; display:none;'>

<div id='register_text4' style='position:absolute; left:51; top:319; width:232; height:34; display:none;' class='clientfont'>
<?php echo $texts["reg_legal_agree"]; ?>
</div>

<div id='register_backknop' style='position:absolute; left:11; top:376;'>
<?php new_button(35, 4, $texts["reg_back"], "register.push_back()", 0); ?>
</div>

<div id='register_nextknop' style='position:absolute; left:220; top:376;'>
<?php new_button(36, 4, $texts["reg_next"], "register.push_next()", 0); ?>
</div>

<div id='register_char_back' style='position:absolute; left:11; top:161; width:281; height:190; display:none;'>
<img src='images/register/char_back.gif'>
</div>

<div id='register_char_name_back' style='position:absolute; left:20; top:37; width:266; height:84; display:none;'>
<img src='images/register/char_name.gif'>
</div>

<div id='register_text6' style='position:absolute; left:35; top:40; width:237; height:30; display:none;' class='clientfont'>
<?php echo $texts["reg_name_note"]; ?>
</div>

<div id='register_char_name_div' style='position:absolute; left:55; top:82; width:194; height:26; text-align: center; display:none;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:194; height:26;' onclick='$("register_char_name").focus();'>
<input id='register_char_name' name='register_char_name' type="text" size="20" class='charnameinput' maxlength='20'>
</div>

<div id='register_text7' style='position:absolute; left:25; top:38; width:255; height:40; display:none;' class='clientfont'>
<?php echo $texts["reg_pwd_note"]; ?>
</div>

<div id='register_plaatje2' style='position:absolute; left:180; top:79; width:97; height:82; display:none;'>
<img src='images/register/plaatje2.gif'>
</div>

<div id='register_info_back1' style='position:absolute; left:19; top:92; display:none;'>
<img src='images/register/reg_pass_back.gif'>
</div>

<div id='register_info_back2' style='position:absolute; left:19; top:176; display:none;'>
<img src='images/register/reg_mail_back.gif'>
</div>

<div id='register_info_back3' style='position:absolute; left:19; top:257; display:none;'>
<img src='images/register/reg_birth_back.gif'>
</div>

<div id='register_text8' style='display:none;'>
<div style='position:absolute; left:31; top:97;' class='clientfont'>
<?php echo $texts["reg_pass1"]; ?>:
</div>

<div style='position:absolute; left:31; top:129;' class='clientfont'>
<?php echo $texts["reg_pass2"]; ?>:
</div>

<div style='position:absolute; left:29; top:181; width:248; height:42;' class='clientfont'>
<?php echo $texts["reg_email_note"]; ?>
</div>

<div style='position:absolute; left:29; top:261;' class='clientfont'>
<?php echo $texts["reg_birthdayformat"]; ?>
</div>

<div style='position:absolute; left:30; top:276;' class='clientfont'>
<?php echo $texts["reg_birthday_example"]; ?>
</div>

<div style='position:absolute; left:27; top:310; width:255; height:42;' class='clientfont'>
<?php echo $texts["reg_promise"]; ?>
</div>
</div>

<div id='register_info_input_div_1' style='position:absolute; left:31; top:111; width: 107;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:107; height:17;' onclick='$("register_info_pass1").focus();'>
<input id='register_info_pass1' name='register_info_pass1' type="password" size="15" class='roundinput' maxlength='20' style='width: 107px;'>
</div>

<div id='register_info_input_div_2' style='position:absolute; left:31; top:143; width: 107;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:107; height:17;' onclick='$("register_info_pass2").focus();'>
<input id='register_info_pass2' name='register_info_pass2' type="password" size="15" class='roundinput' maxlength='20' style='width: 107px;'>
</div>

<div id='register_info_input_div_3' style='position:absolute; left:31; top:228; width: 243;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:243; height:17;' onclick='$("register_info_mail").focus();'>
<input id='register_info_mail' name='register_info_mail' type="text" size="40" class='roundinput' maxlength='40' style='width: 243px;'>
</div>

<div id='register_info_input_div_4' style='position:absolute; left:31; top:291; width: 243;'>
<img src='images/blank.gif' style='position:absolute; left:0; top:0; width:243; height:17;' onclick='$("register_info_birth").focus();'>
<input id='register_info_birth' name='register_info_birth' type="text" size="10" class='roundinput' maxlength='10' style='width: 243px;'>
</div>

<div id='register_text9' style='display:none;'>
<div style='position:absolute; left:32; top:61;' class='clientfont'>
<b><?php echo $texts["reg_check_info"]; ?></b>
</div>

<div style='position:absolute; left:217; top:186; width:97; height:82;'>
<img src='images/register/plaatje3.gif'>
</div>

<div style='position:absolute; left:19; top:85;'>
<img src='images/register/lastcheck_back1.gif'>
</div>

<div style='position:absolute; left:19; top:309;'>
<img src='images/register/lastcheck_back2.gif'>
</div>

<div id='reg_info_lastcheck_div' style='position:absolute; left:31; top:90; width:240; height:58;' class='clientfont'>
</div>

<div style='position:absolute; left:29; top:164; width:180; height:122;' class='clientfont'>
<?php echo $texts["reg_check_confirm"]; ?>
</div>

<div style='position:absolute; left:51; top:316; width:230; height:34;' class='clientfont'>
<?php echo $texts["reg_spam"]; ?>
</div>

<img onclick='register.push_kruisje2()' id='register_kruisje2' src='images/register/kruisje4.gif' style='position:absolute; left:32; top:316; width:12; height:12;'>

</div>

<div id='register_text10' style='display:none;'>
<div id='register_ballon' style='position:absolute; left:53; top:53;'>
<img src='images/register/ballon2.gif'>
</div>

<div id='register_plaatje1' style='position:absolute; left:153; top:132;'>
<img src='images/register/plaatje4.gif'>
</div>

<div id='register_ballon_text' style='position:absolute; left:53; top:58; width:194; height:34; text-align: center;' class='clientfont'>
<?php echo $texts["reg_doneheader"]; ?>
</div>

<div style='position:absolute; left:24; top:239; width:260; height:100;' class='clientfont'>
<?php echo $texts["reg_donetext"]; ?>
</div>

<div style='position:absolute; left:242; top:376;'>
<?php new_button(40, 4, $texts["reg_done_button"], "register_login()", 1); ?>
</div>
</div>

</div>
<!-- Einde Registreren -->

<!-- Connection lost -->

<div id='connection_lost_layer' onmouseover="stop_tclick();" onmouseout="start_tclick();" style='position:absolute; display:none; left:0; top:0; z-index:1; overflow: hidden;'>

<div id='connection_lost_transp' class="transp" style="position:absolute; background-color: black; left:0; top:0; z-index: 1;"></div>

<div class='connection_lost' style='position:absolute; left:1; top:1; z-index:1;height:140px; width:340px; background-color: white; border: 1px solid black; z-index: 2;'></div>

<div class='clientfont' style='position:absolute; left:12; top:11; font-weight: bold; z-index: 3;' align='left'><?php echo $texts["alert_connection_lost"]; ?></div>
<div class='clientfont' style='position:absolute; left:12; top:30; z-index: 3;' align='left'><?php echo $texts["alert_restart"]; ?></div>
<div class='clientfont' style='position:absolute; left:12; top:52; z-index: 3;' align='left'><?php echo $texts["alert_restart_wait"]; ?></div>
<div onclick='window.location.reload();' class='clientfont' style='position:absolute; left:298; top:121; z-index: 3;' align='left'><font color='#666666'><b><?php echo $texts["connection_lost_ok"]; ?></b></font></div>

</div>

<!-- End Connection lost -->