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
function smilies($bericht) {
	// Roll Eyes
	$bericht = str_replace ("::)","<img src=\"img/ubbc/rolleyes.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[rolleyes]","<img src=\"img/ubbc/rolleyes.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("::-)","<img src=\"img/ubbc/rolleyes.gif\" border=\"0\">",$bericht);
	// Smile
	$bericht = str_replace (":)","<img src=\"img/ubbc/smiley.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[smile]","<img src=\"img/ubbc/smiley.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-)","<img src=\"img/ubbc/smiley.gif\" border=\"0\">",$bericht);
	// Wink
	$bericht = str_replace (";)","<img src=\"img/ubbc/wink.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[wink]","<img src=\"img/ubbc/wink.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (";-)","<img src=\"img/ubbc/wink.gif\" border=\"0\">",$bericht);
	// Cheesy
	$bericht = str_replace (":D","<img src=\"img/ubbc/cheesy.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[cheesy]","<img src=\"img/ubbc/cheesy.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-D","<img src=\"img/ubbc/cheesy.gif\" border=\"0\">",$bericht);
	// Grin
	$bericht = str_replace (";D","<img src=\"img/ubbc/grin.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[grin]","<img src=\"img/ubbc/grin.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (";-D","<img src=\"img/ubbc/grin.gif\" border=\"0\">",$bericht);
	// Angry
	$bericht = str_replace ("a:(","<img src=\"img/ubbc/angry.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[angry]","<img src=\"img/ubbc/angry.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("a:-(","<img src=\"img/ubbc/angry.gif\" border=\"0\">",$bericht);
	// Sad
	$bericht = str_replace (":(","<img src=\"img/ubbc/sad.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[sad]","<img src=\"img/ubbc/sad.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-(","<img src=\"img/ubbc/sad.gif\" border=\"0\">",$bericht);
	// Shocked
	$bericht = str_replace (":o","<img src=\"img/ubbc/shocked.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[shocked]","<img src=\"img/ubbc/shocked.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-o","<img src=\"img/ubbc/shocked.gif\" border=\"0\">",$bericht);
	// Cool
	$bericht = str_replace ("8)","<img src=\"img/ubbc/cool.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[cool]","<img src=\"images/images//cool.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("8-)","<img src=\"img/ubbc/cool.gif\" border=\"0\">",$bericht);
	// Huh???
	$bericht = str_replace ("???","<img src=\"img/ubbc/huh.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[huh]","<img src=\"img/ubbc/huh.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":?","<img src=\"img/ubbc/huh.gif\" border=\"0\">",$bericht);
	// Tongue
	$bericht = str_replace (":P","<img src=\"img/ubbc/tongue.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[tongue]","<img src=\"img/ubbc/tongue.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-P","<img src=\"img/ubbc/tongue.gif\" border=\"0\">",$bericht);
	// Embarresed
	$bericht = str_replace (":[","<img src=\"img/ubbc/embarassed.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[embarassed]","<img src=\"img/ubbc/embarassed.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-[","<img src=\"img/ubbc/embarassed.gif\" border=\"0\">",$bericht);
	// Lipsrsealed
	$bericht = str_replace (":-X","<img src=\"img/ubbc/lipsrsealed.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[lipsrsealed]","<img src=\"img/ubbc/lipsrsealed.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":X","<img src=\"img/ubbc/lipsrsealed.gif\" border=\"0\">",$bericht);
	// Undecided
	$bericht = str_replace (":-/","<img src=\"img/ubbc/undecided.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[undecided]","<img src=\"img/ubbc/undecided.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-s","<img src=\"img/ubbc/undecided.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":s","<img src=\"img/ubbc/undecided.gif\" border=\"0\">",$bericht);
	// Kiss
	$bericht = str_replace (":*","<img src=\"img/ubbc/kiss.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[kiss]","<img src=\"img/ubbc/kiss.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":-*","<img src=\"img/ubbc/kiss.gif\" border=\"0\">",$bericht);
	// Cry
	$bericht = str_replace (":\'(","<img src=\"img/ubbc/cry.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[cry]","<img src=\"img/ubbc/cry.gif\" border=\"0\">",$bericht);
	$bericht = str_replace (":\'-(","<img src=\"img/ubbc/cry.gif\" border=\"0\">",$bericht);
	// Love
	$bericht = str_replace ("(L)","<img src=\"img/ubbc/love.gif\" border=\"0\">",$bericht);
	$bericht = str_replace ("[love]","<img src=\"img/ubbc/love.gif\" border=\"0\">",$bericht);
	return($bericht);
}
if (($client_status == "online") && ($login) && (ISSET($_GET['method']))) {
	switch ($_GET['method'])
	{
		case "photo":
// take photo etc
		break;
		case "loadfurni":
// load furniture settings
			$furni = Array();
			$res = mysql_query("SELECT * FROM furni;");
			$amount = 0;
			if (mysql_num_rows($res) >= 1) {
				while ($row = mysql_fetch_array($res)) {
					$furni[$row['furni']] = Array();
					$furni[$row['furni']] = $row;
					$furni[$row['furni']]['loaded'] = false;
					$amount++;
			    }
			}
			echo json_encode(Array($furni, $amount));
		break;
		case "chat":
// chatbox
			$chat_config = file_get_contents("../txt/chat_config.txt");
			if ($chat_config == "open") {
				echo "<table border='0' class='clientfont'>";
				if (ISSET($_POST['text'])) {
					$clienttext = $_POST['text'];
					if (($user['rank'] == 4) or ($user['rank'] == 3)) {
						if (substr($_POST['text'], 0,1) == "/") {
							$command = substr($_POST['text'], 1);
							if (substr($command, 0,5) == "clear") {
								file_put_contents("../txt/chat.txt", "");
								file_put_contents("chatlog/chatbox.txt", "");
								$_POST['text'] = "";
							}
							if (substr($command, 0,1) == "b") {
								$_POST['text'] = "<b>".substr($_POST['text'], 3)."</b>";
							}
							if (substr($command, 0,6) == "scream") {
								$_POST['text'] = "<b><font size='7'><i>!</i></font> <font size='5'><u>".substr($_POST['text'], 8)."</u></font><font size='7'><i>!</i></font></b>";
							}
						}
					}
					if ($_POST['text'] != "") {
						$old_chat = file("../txt/chat.txt");
				    	if ($user['rank'] == 1) {
							$_POST['text'] = htmlentities($_POST['text']);
						}
				    	if ($user['rank'] == 1) {
							$old_chat[] = "<tr><td>".ucfirst(htmlentities($_COOKIE["jabbo_name"])).": </td><td>".stripslashes(smilies($_POST['text']))."</td></tr>\n";
						}
						else {
							$old_chat[] = "<tr><td><b>".ucfirst(htmlentities($_COOKIE["jabbo_name"]))."</b>: </td><td>".stripslashes(smilies($_POST['text']))."</td></tr>\n";
						}
						$handle = fopen("../txt/chat.txt",'w');
					    $iwant = array_chunk(array_reverse($old_chat), 19);
					    fwrite($handle, implode("", array_reverse($iwant[0])));
					    fclose($handle);
					    implode("", array_reverse($iwant[0]));
					    // clientside chatbox
					    $clienttext = strip_tags($clienttext, "<b><u><i>");
					    if (($user['rank'] == 4) or ($user['rank'] == 3)) {
							if (substr($clienttext, 0,1) == "/") {
								$command = substr($clienttext, 1);
								if (substr($command, 0,5) == "clear") {
									file_put_contents("chatlog/chatbox.txt", "");
									$clienttext = "";
								}
								if (substr($command, 0,1) == "b") {
									$clienttext = "<b>".substr($clienttext, 3)."</b>";
								}
								if (substr($command, 0,6) == "scream") {
									$clienttext = "<b><font color='blue'><i>!</i></font> <font color='red'><u>".substr($clienttext, 8)."</u></font><font color='blue'><i>!</i></font></b>";
								}
							}
						}
						$old_chat = file("chatlog/chatbox.txt");
				    	if ($user['rank'] == 1) {
							$old_chat[] = "<tr><td>".ucfirst(htmlentities($_COOKIE["jabbo_name"])).": </td><td>".stripslashes($clienttext)."</td></tr>\n";
						}
						else {
							$old_chat[] = "<tr><td><b>".ucfirst(htmlentities($_COOKIE["jabbo_name"]))."</b>: </td><td>".stripslashes($clienttext)."</td></tr>\n";
						}
						$handle = fopen("chatlog/chatbox.txt",'w');
					    $iwant = array_chunk(array_reverse($old_chat), 19);
					    fwrite($handle, implode("", array_reverse($iwant[0])));
					    fclose($handle);
					    echo implode("", array_reverse($iwant[0]));
				    }
				    else {
					    echo file_get_contents("chatlog/chatbox.txt");
					}
				}
				else {
					echo file_get_contents("chatlog/chatbox.txt");
				}
				echo "</table>";
			}
			else {
				echo "<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='position:absolute; left:0; top:0;'><tr><td valign='middle' align='center' class='clientfont'>".$texts['chatbox_closed']."</td></tr></table>";
			}
		break;
		case "catinit":
// load catalogue categories
			$pos1_ids = Array();
			$pos1_names = Array();
			$pos2_ids = Array();
			$pos2_names = Array();
			$pos3_ids = Array();
			$pos3_names = Array();
			$collecties = mysql_query("SELECT id, name, access, pos FROM shop ORDER BY name;");
			if (mysql_num_rows($collecties) >= 1) {
			    while ($row = mysql_fetch_array($collecties)) {
				    $cat_access = explode(";", $row['access']);
			    	if (in_array($user['rank'], $cat_access)) {
				    	switch ($row['pos']) {
						case 1:
						    array_push($pos1_ids, $row['id']);
						    array_push($pos1_names, $row['name']);
						    break;
						case 2:
						    array_push($pos2_ids, $row['id']);
						    array_push($pos2_names, $row['name']);
						    break;
						case 3:
						    array_push($pos3_ids, $row['id']);
						    array_push($pos3_names, $row['name']);
						    break;
						}
			    	}
				}
			}
			$cat_ids = array_merge($pos1_ids, $pos2_ids, $pos3_ids);
			$cat_names = array_merge($pos1_names, $pos2_names, $pos3_names);
			$catarray = Array();
			for ($i = 0; $i < sizeof($cat_ids); $i++) {
				$catarray[$i] = Array();
				$catarray[$i]['id'] = $cat_ids[$i];
				$catarray[$i]['name'] = htmlentities($cat_names[$i]);
				$catarray[$i]['loaded'] = false;
			}
			echo json_encode($catarray);
		break;
		case "catload":
// load catalogue catagory
			if ((ISSET($_GET['id'])) && (ISSET($_GET['putin']))) {
				$cat_id = $_GET['id'];
				$put_in = $_GET['putin'];
				$cat_check = halen("SELECT count(id) FROM shop WHERE id='".$cat_id."';");
				if($cat_check == 1) {
					$cat_preload = Array();
					$cat_data = halen_array("SELECT * FROM shop WHERE id='".$cat_id."';");
					$cat_access = explode(";", $cat_data['access']);
					if (in_array($user['rank'], $cat_access)) {
						$nofurni = false;
						$cat_furni = explode(";", $cat_data['furni']);
						if ($cat_furni[0] == "") {
							$nofurni = true;
						}
						if (($cat_data['layout'] == "frontpage") || ($cat_data['layout'] == "presents") || ($cat_data['layout'] == "norares") || ($cat_data['layout'] == "market") || ($cat_data['layout'] == "club")) {
							$nofurni = false;
						}
						if (!$nofurni) {
							echo "catalogue.cats[".$put_in."].wow1 = '';";
							echo "catalogue.cats[".$put_in."].wow2 = '';";
							echo "catalogue.cats[".$put_in."].layout = '".$cat_data['layout']."';";
							echo "catalogue.cats[".$put_in."].furnis = new Array();";
							echo "catalogue.cats[".$put_in."].prices = new Array();";
							echo "catalogue.cats[".$put_in."].side = new Array();";
							echo "catalogue.cats[".$put_in."].misc = new Array();";
							echo "catalogue.cats[".$put_in."].desc = \"".$cat_data['desc']."\";";
							echo "catalogue.cats[".$put_in."].header = '".$cat_data['img_header']."';";
							echo "catalogue.cats[".$put_in."].details = \"".$cat_data['label_moredetails']."\";";
							array_push($cat_preload, "images/shop/shop_img/".$cat_data['img_header'].".gif");
							$cat_img_side = explode(";", $cat_data['img_side']);
							if ($cat_img_side[0] != "") {
								for ($i = 0; $i < sizeof($cat_img_side); $i++) {
									echo "catalogue.cats[".$put_in."].side[".$i."] = '".$cat_img_side[$i]."';";
									array_push($cat_preload, "images/shop/shop_img/".$cat_img_side[$i].".gif");
								}
							}
							$cat_misc = explode(";", $cat_data['label_misc']);
							if ($cat_misc[0] != "") {
								for ($i = 0; $i < sizeof($cat_misc); $i++) {
									$this_misc = explode(":", $cat_misc[$i]);
									if ($this_misc[0] == "w1") {
										echo "catalogue.cats[".$put_in."].wow1 = \"".$this_misc[1]."\";";
									}
									elseif ($this_misc[0] == "w2") {
										echo "catalogue.cats[".$put_in."].wow2 = \"".$this_misc[1]."\";";
									}
									else {
										echo "catalogue.cats[".$put_in."].misc['".$this_misc[0]."'] = \"".$this_misc[1]."\";";
									}
								}
							}
							if ($cat_furni[0] != "") {
								for ($i = 0; $i < sizeof($cat_furni); $i++) {
									$this_furni = explode(":", $cat_furni[$i]);
									echo "catalogue.cats[".$put_in."].furnis[".$i."] = '".$this_furni[0]."';";
									echo "catalogue.cats[".$put_in."].prices[".$i."] = ".$this_furni[1].";";
								}
							}
							echo "catalogue.addimg = new Array(";
							for ($i = 0; $i < sizeof($cat_preload); $i++) {
								echo "'".$cat_preload[$i]."'";
								if (($i+1) != sizeof($cat_preload)) {
									echo ", ";
								}
							}
							echo ");catalogue.load2();";
						}
						else {
							//nofurni
							echo "client.notify('".$texts['cat_nofurni']."'); catalogue.unload();";
						}
					}
					else {
						//noaccess
						echo "client.notify('".$texts['cat_noaccess']."'); catalogue.unload();";
					}
				}
				else {
					//error
					echo "client.notify('".$texts['cat_error']."'); catalogue.unload();";
				}
			}
		break;
		default:
//big error
		break;
	}
}
?>