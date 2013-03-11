<?php
function new_button($id, $type, $text, $click, $visible, $exception="")
{
	$visible_text = "";
	$exception_text1 = "";
	$exception_text2 = "";
	if ($visible == 0)
	{
		$visible_text .= " style='display:none;'";
	}
	if ($exception != "")
	{
		$exception_text1 = $exception."{";
		$exception_text2 = "}";
	}
	switch ($type)
	{
    case 1:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",1)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",1)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='6' height='18'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/1_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='18' style='background: url(\"images/buttons/1_center1.gif\") repeat-x; padding: 2px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: black;'><b>".$text."</b></div>";
		echo "</td>";
		echo "<td width='6' height='18'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/1_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	case 2:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",2)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",2)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='11' height='23'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/2_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='23' style='background: url(\"images/buttons/2_center1.gif\") repeat-x; padding: 5px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: black;'><b>".$text."</b></div>";
		echo "</td>";
		echo "<td width='11' height='23'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/2_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	case 3:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",3)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",3)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='6' height='18'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/3_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='18' style='background: url(\"images/buttons/3_center1.gif\") repeat-x; padding: 3px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: #F0F0F0;'>".$text."</div>";
		echo "</td>";
		echo "<td width='6' height='18'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/3_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	case 4:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",4)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",4)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='11' height='18'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/4_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='18' style='background: url(\"images/buttons/4_center1.gif\") repeat-x; padding: 2px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: black;'><b>".$text."</b></div>";
		echo "</td>";
		echo "<td width='11' height='18'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/4_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	case 5:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",5)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",5)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='11' height='18'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/5_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='18' style='background: url(\"images/buttons/5_center1.gif\") repeat-x; padding: 2px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: black;'><b>".$text."</b></div>";
		echo "</td>";
		echo "<td width='11' height='18'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/5_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	case 6:
		echo "<table id='knop_".$id."' onclick='".$exception_text1.$click.$exception_text2."' onmousedown='".$exception_text1."button_down(".$id.",6)".$exception_text2."' onmouseup='".$exception_text1."button_up(".$id.",6)".$exception_text2."' border='0' cellpadding='0' cellspacing='0'".$visible_text.">";
		echo "<tr>";
		echo "<td width='7' height='17'>";
		echo "<img id='knop_".$id."_left' src='images/buttons/6_left1.gif'>";
		echo "</td>";
		echo "<td id='knop_".$id."_center' height='17' style='background: url(\"images/buttons/6_center1.gif\") repeat-x; padding: 2px 0px 0px 0px;' valign='top'>";
		echo "<div id='knop_".$id."_text' class='eigenfont' style='color: black;'><b>".$text."</b></div>";
		echo "</td>";
		echo "<td width='7' height='17'>";
		echo "<img id='knop_".$id."_right' src='images/buttons/6_right1.gif'>";
		echo "</td>";
		echo "</tr>";
		echo "</table>";
		break;
	}
}
function new_shadow($width, $height, $left=0, $top=0)
{
	echo "<img src='images/shade1.gif' class='transp' style='position:absolute; left:8; top:".($height-5+$top).";'>";
	echo "<img src='images/shade2.gif' class='transp' style='position:absolute; left:".($width-15+$left)."; top:".($height-15+$top).";'>";
	echo "<img src='images/shade3.gif' class='transp' style='position:absolute; left:".($width-5+$left)."; top:8;'>";
	echo "<img src='images/black.gif' class='transp' style='position:absolute; left:15; top:".($height-3+$top)."; width: ".($width-30+$left)."px; height: 3px;'>";
	echo "<img src='images/black.gif' class='transp' style='position:absolute; left:".($width-3+$left)."; top:15; width: 3px; height: ".($height-30+$top)."px;'>";
}
?>