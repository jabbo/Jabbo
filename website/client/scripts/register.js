// REGISTER.JS
// contains client registration code. Not finished at all!
var register = {
	step : 1,
	kruisje1 : false,
	kruisje2: false,
	error_message : "",
	clear : function () {
		HideContent(["register_upperlayer_1", "register_upperlayer_2", "register_upperlayer_3", "register_laden", "register_ballon", "register_plaatje1", "register_ballon_text", "register_text1", "knop_37", "knop_38", "knop_39", "register_text2", "register_text3", "register_kruisje1", "register_text4", "knop_35", "knop_36", "register_text5", "register_char_back", "register_char_name_back", "register_text6", "register_char_name_div", "register_text7", "register_plaatje2", "register_info_back1", "register_info_back2", "register_info_back3", "register_text8", "register_text9", "register_text10", "register_info_input_div_1", "register_info_input_div_2", "register_info_input_div_3", "register_info_input_div_4"]);
	},
	open : function () {
		if(!login.doing) {
			$("register").style.left = 621;
			$("register").style.top = 71;
			register.clear();
			register.step = 1;
			register.kruisje1 = false;
			$("register_kruisje1").src = "images/register/kruisje1.gif";
			$("register_char_name").value = "";
			ShowContent("register_upperlayer_3");
			ShowContent("register_laden");
			ShowContent("register");
			HideContent("login_div");
			packets.send.register_start_check();
		}
	},
	close : function () {
		HideContent("register");
		register.clear();
	},
	close_button : function () {
		ShowContent("login_div");
		HideContent("register");
		register.clear();
	},
	step1 : function () {
		register.step = 1;
		$("register_text5").innerHTML = "1/6";
		register.clear();
		ShowContent("register_upperlayer_1");
		ShowContent("register_ballon");
		ShowContent("register_plaatje1");
		ShowContent("register_ballon_text");
		ShowContent("register_text1");
		ShowContent("knop_37");
		ShowContent("knop_38");
		ShowContent("knop_39");
	},
	step2 : function () {
		register.step = 2;
		$("register_text5").innerHTML = "2/6";
		$('register_text3').scrollTop = 0;
		register.clear();
		ShowContent("register_upperlayer_2");
		ShowContent("register_text2");
		ShowContent("register_text3");
		ShowContent("register_kruisje1");
		ShowContent("register_text4");
		ShowContent("knop_35");
		ShowContent("knop_36");
		ShowContent("register_text5");
	},
	step3 : function () {
		if (register.kruisje1) {
			register.step = 3;
			$("register_text5").innerHTML = "3/6";
			register.clear();
			ShowContent("register_upperlayer_2");
			ShowContent("knop_35");
			ShowContent("knop_36");
			ShowContent("register_text5");
			ShowContent("register_char_back");
			ShowContent("register_char_name_back");
			ShowContent("register_text6");
			ShowContent("register_char_name_div");
			$("register_char_name").focus();
		}
		else {
			client.notify(texts[13]);
		}	
	},
	step4 : function () {
		if (register.step == 4) {
			$("register_text5").innerHTML = "4/6";
			$("register_info_pass1").value = "";
			$("register_info_pass2").value = "";
			register.clear();
			ShowContent("register_upperlayer_2");
			ShowContent("knop_35");
			ShowContent("knop_36");
			ShowContent("register_text5");
			ShowContent("register_text7");
			ShowContent("register_plaatje2");
			ShowContent("register_info_back1");
			ShowContent("register_info_back2");
			ShowContent("register_info_back3");
			ShowContent("register_text8");
			ShowContent("register_info_input_div_1");
			ShowContent("register_info_input_div_2");
			ShowContent("register_info_input_div_3");
			ShowContent("register_info_input_div_4");
		}
		else {
			if ($("register_char_name").value != "")
			{
				register.clear();
				ShowContent("register_upperlayer_3");
				ShowContent("register_laden");
				register.name_check();
			}
			else {
				client.notify(texts[14]);
			}
		}
	},
	step5 : function () {
		if (register.step == "5") {
			register.kruisje2 = true;
			$("register_kruisje2").src = "images/register/kruisje4.gif";
			$("register_text5").innerHTML = "5/6";
			register.clear();
			ShowContent("register_upperlayer_2");
			ShowContent("knop_35");
			ShowContent("knop_36");
			ShowContent("register_text5");
			ShowContent("register_text9");
			$("reg_info_lastcheck_div").innerHTML = "<b>"+texts[15]+" "+$("register_char_name").value+"<br><br>"+texts[16]+" "+$("register_info_birth").value+"<br><br>"+texts[17]+" "+$("register_info_mail").value+"</b>";
		}
		else {
			this.check_info.pass1 = $("register_info_pass1").value;
			this.check_info.pass2 = $("register_info_pass2").value;
			this.check_info.mail = $("register_info_mail").value;
			this.check_info.birth = $("register_info_birth").value;
			this.check_info.firstcheck = true;
			this.check_info.pass_firstcheck = true;
			this.check_info.mail_firstcheck = true;
			this.check_info.birth_firstcheck = true;
			if (this.check_info.pass1 == "") {
				this.check_info.firstcheck = false;
				this.check_info.pass_firstcheck = false;
			}
			if (this.check_info.pass1 != this.check_info.pass2) {
				this.check_info.firstcheck = false;
				this.check_info.pass_firstcheck = false;
			}
			if (!isValidEmail(this.check_info.mail)) {
				this.check_info.firstcheck = false;
				this.check_info.mail_firstcheck = false;
			}
			if (this.check_info.birth != "") {
				this.birtharray = this.check_info.birth.split("-");
				if (this.birtharray.length != 3)
				{
					this.check_info.firstcheck = false;
					this.check_info.birth_firstcheck = false;
				}
				else
				{
					if(this.birtharray[0] > 31)
					{
						this.check_info.firstcheck = false;
						this.check_info.birth_firstcheck = false;
					}
					if(this.birtharray[1] > 12)
					{
						this.check_info.firstcheck = false;
						this.check_info.birth_firstcheck = false;
					}
					if(this.birtharray[2] != 4)
					{
						this.check_info.firstcheck = false;
						this.check_info.birth_firstcheck = false;
					}
				}
			}
			else {
				this.check_info.firstcheck = false;
				this.check_info.birth_firstcheck = false;
			}
			if (this.check_info.firstcheck) {
				register.clear();
				ShowContent("register_upperlayer_3");
				ShowContent("register_laden");
				this.check_info.go();
			}
			else {
				this.error_message = "";
				this.error_message += "<b>"+texts[18]+"</b><br>";
				if (!this.check_info.pass_firstcheck) {
					this.error_message += "<br>"+texts[19];
				}
				if (!this.check_info.birth_firstcheck) {
					this.error_message += "<br>"+texts[20];
				}
				if (!this.check_info.mail_firstcheck) {
					this.error_message += "<br>"+texts[21];
				}
				client.notify(this.error_message);
			}
		}
	},
	step6 : function () {
		register.clear();
		ShowContent("register_upperlayer_3");
		ShowContent("register_laden");
		register.send();
	},
	check_info :
	{
		pass1 : "",
		pass2 : "",
		mail : "",
		birth : "",
		firstcheck : true,
		pass_firstcheck : true,
		mail_firstcheck : true,
		birth_firstcheck : true,
		go : function () {
			
		}
	},
	jong : function () {
		register.close();
		register.jong_send();
		client.exit2();
		client.notify(texts[12]);
	},
	jong_send : function () {
		
	},
	push_kruisje : function () {
		if (register.kruisje1) {
			register.kruisje1 = false;
			$("register_kruisje1").src = "images/register/kruisje1.gif";
		}
		else {
			register.kruisje1 = true;
			$("register_kruisje1").src = "images/register/kruisje2.gif";
		}
	},
	push_kruisje2 : function () {
		if (register.kruisje2) {
			register.kruisje2 = false;
			$("register_kruisje2").src = "images/register/kruisje3.gif";
		}
		else {
			register.kruisje2 = true;
			$("register_kruisje2").src = "images/register/kruisje4.gif";
		}
	},
	done : function () {
		register.step = 6;
		$("register_text5").innerHTML = "6/6";
		register.clear();
		ShowContent("register_upperlayer_2");
		ShowContent("register_text10");
	},
	login : function () {
		$("login_naam").value = $("register_char_name").value;
		$("login_wachtwoord").value = $("register_info_pass1").value;
		register.close_button();
		login.attempt();
	},
	push_back : function () {
		run_script("register.step"+((register.step*1) - 1)+"();");
	},
	push_next : function () {
		run_script("register.step"+((register.step*1) + 1)+"();");
	},
	regstart_checked : function (answer) {
		switch(answer) 
		{
		case "ok":
			register.step1();
			break;
		case "cclosed":
			register.close();
			client.exit();
			break;
		case "ban":
			client.ecxit2();
			client.notify(texts[22]);
			break;
		case "closed":
			register.close_button();
			client.notify(texts["register_closed"]);
			break;
		case "age":
			register.close();
			client.exit2();
			client.notify(texts[24]);
			break;
		case "multi":
			register.close_button();
			client.notify(texts[25]);
			break;
		}
	}
};
/*
OLD CODE FROM JABBO V2, needs converting
function checked_register_name(checked_waarde)
{
	if (checked_waarde == "ok")
	{
		register.step = "4";
		register_step4();
	}
	else
	{
		if (checked_waarde == "unacceptable")
		{
			$("register_char_name").value = "";
			start_alert(texts[26]);
			register_step3();
		}
		else
		{
			if (checked_waarde == "long")
			{
				$("register_char_name").value = "";
				start_alert(texts[27]);
				register_step3();
			}
			else
			{
				if (checked_waarde == "short")
				{
					$("register_char_name").value = "";
					start_alert(texts[28]);
					register_step3();
				}
				else
				{
					if (checked_waarde == "multi")
					{
						$("register_char_name").value = "";
						start_alert(texts[29]);
						register_step3();
					}
					else
					{
						if (checked_waarde == "char")
						{
							$("register_char_name").value = "";
							start_alert(texts[30]);
							register_step3();
						}
						else
						{
							if (checked_waarde == "empty")
							{
								$("register_char_name").value = "";
								start_alert(texts[31]);
								register_step3();
							}
						}
					}
				}
			}
		}
	}
}
function checked_register_info(checked_waarde)
{
	checked_waarde1 = checked_waarde.split("<ajax>")[0];
	checked_waarde2 = checked_waarde.split("<ajax>")[1];
	if (checked_waarde1 == "ok")
	{
		if (checked_waarde2 == "ok")
		{
			register.step = "5";
			register_step5();
		}
		else
		{
			if (checked_waarde2 == "error")
			{
				$("register_info_pass1").value = "";
				$("register_info_pass2").value = "";
				start_alert(texts[32]);
				register_step4();
			}
			else
			{
				if (checked_waarde2 == "age")
				{
					register.close();
					exit_client3();
					start_alert(texts[33]);
				}
				else
				{
					$("register_info_pass1").value = "";
					$("register_info_pass2").value = "";
					register_step4();
				}
			}
		}
	}
	else
	{
		if (checked_waarde1 == "long")
		{
			$("register_info_pass1").value = "";
			$("register_info_pass2").value = "";
			start_alert(texts[34]);
			register_step4();
		}
		else
		{
			if (checked_waarde1 == "short")
			{
				$("register_info_pass1").value = "";
				$("register_info_pass2").value = "";
				start_alert(texts[35]);
				register_step4();
			}
			else
			{
				$("register_info_pass1").value = "";
				$("register_info_pass2").value = "";
				register_step4();
			}
		}
	}
}

function register_jong_send()
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
			ajax_vrij = "nee";
			xmlhttp.open("GET", "register_jong.php?r="+Math.round(9000*Math.random()),true);
	    	xmlhttp.onreadystatechange=function()
	    	{
			    if (xmlhttp.readyState==4)
	       		{
			       	if(xmlhttp.status != 200)
	 				{
		 				verbinding = "nee";
	 				}
	 				ajax_vrij = "ja";
	       		}
	    	}
	    	xmlhttp.send(null);
    	}
    	else
    	{
	    	setTimeout("register_jong_send();", 1000);
    	}
    }
}
function register_name_check()
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
			ajax_vrij = "nee";
			xmlhttp.open("GET", "check_register_name.php?name="+$("register_char_name").value+"&r="+Math.round(9000*Math.random()),true);
	    	xmlhttp.onreadystatechange=function()
	    	{
			    if (xmlhttp.readyState==4)
	       		{
			       	if(xmlhttp.status == 200)
	 				{
		 				checked_register_name(xmlhttp.responseText);
	 				}
	 				else if(xmlhttp.status == 404)
	 				{
		  				verbinding = "nee";
	 				}
	 				else
	 				{
		  				verbinding = "nee";
	 				}
	 				ajax_vrij = "ja";
	       		}
	    	}
	    	xmlhttp.send(null);
    	}
    	else
    	{
	    	setTimeout("register_name_check();", 1000);
    	}
    }
}
function register_info_check()
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
			ajax_vrij = "nee";
			xmlhttp.open("GET", "check_register_info.php?pass="+$("register_info_pass1").value+"&birth="+$("register_info_birth").value+"&r="+Math.round(9000*Math.random()),true);
	    	xmlhttp.onreadystatechange=function()
	    	{
			    if (xmlhttp.readyState==4)
	       		{
			       	if(xmlhttp.status == 200)
	 				{
		 				checked_register_info(xmlhttp.responseText);
	 				}
	 				else if(xmlhttp.status == 404)
	 				{
		  				verbinding = "nee";
	 				}
	 				else
	 				{
		  				verbinding = "nee";
	 				}
	 				ajax_vrij = "ja";
	       		}
	    	}
	    	xmlhttp.send(null);
    	}
    	else
    	{
	    	setTimeout("register_info_check();", 1000);
    	}
    }
}
function register_send()
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
			ajax_vrij = "nee";
			xmlhttp.open("GET", "registergo.php?name="+$("register_char_name").value+"&pass="+$("register_info_pass1").value+"&mail="+$("register_info_mail").value+"&birth="+$("register_info_birth").value+"&automail="+register.kruisje2+"&r="+Math.round(9000*Math.random()),true);
	    	xmlhttp.onreadystatechange=function()
	    	{
			    if (xmlhttp.readyState==4)
	       		{
			       	if(xmlhttp.status == 200)
	 				{
		 				register_done();
	 				}
	 				else if(xmlhttp.status == 404)
	 				{
		  				verbinding = "nee";
	 				}
	 				else
	 				{
		  				verbinding = "nee";
	 				}
	 				ajax_vrij = "ja";
	       		}
	    	}
	    	xmlhttp.send(null);
    	}
    	else
    	{
	    	setTimeout("register_send();", 1000);
    	}
    }
}*/