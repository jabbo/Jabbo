<?php
require_once("../client/config.php");
function GetDays($sStartDate, $sEndDate){
  // Firstly, format the provided dates.
  // This function works best with YYYY-MM-DD
  // but other date formats will work thanks
  // to strtotime().
  $sStartDate = gmdate("Y-m-d", strtotime($sStartDate));
  $sEndDate = gmdate("Y-m-d", strtotime($sEndDate));

   // Start the variable off with the start date
  $aDays[] = $sStartDate;

  // Set a 'temp' variable, sCurrentDate, with
  // the start date - before beginning the loop
  $sCurrentDate = $sStartDate;

  // While the current date is less than the end date
  while($sCurrentDate < $sEndDate){
	  
    // Add a day to the current date
    $sCurrentDate = date("Y-m-d", strtotime(date("Y-m-d", strtotime($sCurrentDate)) . " +1 day"));
    // Add this new day to the aDays array
    $aDays[] = $sCurrentDate;
  }

  // Once the loop has finished, return the
  // array of days.
  return $aDays;
}

$dbdates = array();
$res = mysql_query("SELECT created FROM members;");
if (mysql_num_rows($res) >= 1) {
	while ($row = mysql_fetch_array($res)) {
		if ($row['created'] != "") {
			if (ISSET($dbdates[$row['created']])) {
				$dbdates[$row['created']]++;
			}
			else {
				$dbdates[$row['created']] = 1;
			}
		}
	}
}

$data = array();
$days = array();

$aDays = GetDays(file_get_contents("startdate.txt"), date("Y-m-d"));
for ($i = 0; $i < count($aDays); $i++) {
	array_push($days, ($i+1));
	if (ISSET($dbdates[$aDays[$i]])) {
		array_push($data, $dbdates[$aDays[$i]]);
	}
	else {
		array_push($data, 0);
	}
}

 /* CAT:Line chart */

 /* pChart library inclusions */
 include("class/pData.class.php");
 include("class/pDraw.class.php");
 include("class/pImage.class.php");

 /* Create and populate the pData object */
 
 $MyData = new pData();
$MyData->addPoints($data,"Registrations");
$MyData->setSerieWeight("Registrations",2);
$MyData->setSerieOnAxis("Registrations",0);
$MyData->addPoints($days,"Absissa");
$MyData->setAbscissa("Absissa");
$MyData->setAxisPosition(0,AXIS_POSITION_LEFT);
$MyData->setAxisName(0,"Registrations");
$MyData->setAxisUnit(0,"");


 /* Create the pChart object */
 $myPicture = new pImage(700,230,$MyData);

 /* Turn of Antialiasing */
 $myPicture->Antialias = FALSE;

 /* Add a border to the picture */
 $myPicture->drawRectangle(0,0,699,229,array("R"=>0,"G"=>0,"B"=>0));
 
 /* Write the chart title */ 
 $myPicture->setFontProperties(array("FontName"=>"fonts/Forgotte.ttf","FontSize"=>11));
 $myPicture->drawText(150,35,"Jabbo Registrations",array("FontSize"=>20,"Align"=>TEXT_ALIGN_BOTTOMMIDDLE));

 /* Set the default font */
 $myPicture->setFontProperties(array("FontName"=>"fonts/pf_arma_five.ttf","FontSize"=>6));

 /* Define the chart area */
 $myPicture->setGraphArea(60,40,650,200);

 /* Draw the scale */
 $scaleSettings = array("Mode"=>SCALE_MODE_START0, "XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE);
 $myPicture->drawScale($scaleSettings);

 /* Turn on Antialiasing */
 $myPicture->Antialias = TRUE;

 /* Draw the line chart */
 $myPicture->drawLineChart();

 /* Render the picture (choose the best way) */
 $myPicture->autoOutput("pictures/example.drawLineChart.simple.png");

?>