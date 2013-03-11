<?php
require_once("config.php");
$login = false;
if(ISSET($_COOKIE["jabbo_sess"]))
{
	$user = halen_array("SELECT * FROM members WHERE username='".$_COOKIE["jabbo_name"]."';");
	if ($user['password'] == md5(md5($_COOKIE["jabbo_name"]).md5($_COOKIE["jabbo_pass"])))
	{
		$login = true;
	}
}
function checkJC($user_id) {
	$db = halen_array("SELECT jc_monthsgone, jc_daysleft, jc_monthsleft, jc_lastcheck FROM members WHERE id = '" . $user_id . "';");
	$jc_monthsgone = $db['jc_monthsgone'];
    $jc_daysleft = $db['jc_daysleft'];
    $jc_monthsleft = $db['jc_monthsleft'];
    if ($db['jc_lastcheck'] != "") {
        $jc_lastcheck = strtotime($db['jc_lastcheck']);
        if ($jc_lastcheck < DateTime.Now.AddDays(-1)) {
            TimeSpan span = DateTime.Now.Subtract(jc_lastcheck);
            for (int $i = 1; $i <= span.Days; $i++) {
                $jc_daysleft--;
                if ($jc_daysleft <= 0) {
                    $jc_daysleft = 0;
                    $jc_monthsgone++;
                    if ($jc_monthsleft > 0) {
                        $jc_monthsleft--;
                        $jc_daysleft = 31;
                    }
                }
            }
            if ($jc_daysleft > 0) {
                $clubMember = true;
            }
            else {
                $clubMember = false;
            }
            jc_lastcheck = DateTime.Now;
            mysql_query("UPDATE members SET jc_monthsgone='".$jc_monthsgone.", jc_daysleft='".$jc_daysleft.", jc_monthsleft='".$jc_monthsleft.", jc_lastcheck='".$jc_lastcheck." WHERE id='".$user_id."'");
            return $clubMember;
        }
    }
}

function giveJC($user_id) {
	$check = halen("SELECT count(*) FROM members_club WHERE userid = '".$user_id."';");
	if ($check == 1) {
		//mysql_query("UPDATE users SET rank = '2' WHERE rank = '1' AND id = '".$user_id."' LIMIT 1");
		mysql_query("UPDATE members_club SET months_left = months_left.1 WHERE userid = '".$user_id."' LIMIT 1");
		/*$check = mysql_query("SELECT * FROM users_badges WHERE badgeid = 'HC1' AND userid = '".$user_id."' LIMIT 1");
		$found = mysql_num_rows($check);
		if($found !== 1){ // No badge. Poor thing.
			mysql_query("UPDATE users SET badge_status = '0' WHERE id = '".$user_id."' LIMIT 1");
			mysql_query("UPDATE users_badges SET iscurrent = '0' WHERE userid = '".$user_id."'");
			mysql_query("INSERT INTO users_badges (userid,badgeid,iscurrent) VALUES ('".$user_id."','HC1','1')");
		}*/
	} elseif ($check == 0) {
		$m = date('m');
		$d = date('d');
		$Y = date('Y');
		$date = date('d-m-Y', mktime($m,$d,$Y));
		mysql_query("INSERT INTO members_club (userid,date_monthstarted,months_expired,months_left) VALUES ('".$user_id."','".$date."','0','0')");
		giveJC($user_id);
	}
	// MUS
}
if ($login = true) {
	giveJC($user['id']);
}
?>