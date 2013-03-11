var navi = {
	opened : false,
	lists :
	{
		publics : { },
		privates : { },
		own : { },
		searched : { }
	},
	selectedroom : null,
	open : function () {
		if (!this.opened) {
			this.opened = true;
			this.updateask();
			set_top('navigator');
			ShowContent('navigator');
		}
	},
	close : function () {
		if (this.opened) {
			this.opened = false;
			HideContent('navigator');
		}
	},
	reverse : function () {
		if (this.opened) {
			this.close();
		}
		else {
			this.open();
		}
	},
	updateask : function () {
		if (this.opened) {
			packets.send.naviupdate();
		}
	},
	update_publics : function () {
		var html = "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='5' height='2'></td></tr>";
		var len = this.lists.publics.length;
		var count = 0;
		for(x in this.lists.publics) {
			if(count >= len) break; //fix to avoid prototype breaking our loop
			else {
				var room = this.lists.publics[x];
				if (room.U != 0) {
					var image_extra = "2";
				}
				else {
					var image_extra = "";
				}
				html += "<tr><td><img src='images/navi/links.gif'></td><td onclick="+'"'+"navi.roomclick("+x+", 'public');"+'"'+" width='227' bgcolor='#DADADA'><div class='clientfont'><img src='images/navi/sloten/1.gif'>&nbsp;"+room.N+"</div></td><td><img src='images/navi/rechts.gif'></td><td width='2'><font color='black' size='2'>&nbsp;</font></td><td><div onclick="+'"'+"navi.goclick("+x+", 'public');"+'"'+" style='position:relative;'><img src='images/navi/ga"+image_extra+".gif' border='0' style='cursor: default;'><div style='position:absolute; left:0; top:0; width:42; height:16; text-align:right;' class='clientfont'><u>"+texts["navi_go"]+"</u></div></div></td></tr><tr><td colspan='5' height='2'></td></tr>";
				count++;
			}
		}
		if (count < 1) {
			html += "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='2' height='8'></td></tr><tr><td width='8'></td><td><div class='clientfont'>"+texts["navi_no_publics"]+"</div></td></tr></table>";
			html += "</table>";
		}
		html += "</table>";
		$("list_publics").innerHTML = html;
	},
	update_guestrooms : function () {
		var html = "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='5' height='2'></td></tr>";
		var len = this.lists.privates.length;
		var count = 0;
		for(x in this.lists.privates) {
			if(count >= len) break; //fix to avoid prototype breaking our loop
			else {
				var room = this.lists.privates[x];
				if (room.U != 0) {
					var eenderde = room.M/3;
					if (room.U < Math.round(eenderde)) {
						var image_extra = "2";
					}
					else if (room.U < Math.round(eenderde*2)) {
						var image_extra = "3";
					}
					else if (room.U <= room.M) {
						var image_extra = "4";
					}
				}
				else {
					var image_extra = "";
				}
				html += "<tr><td><img src='images/navi/links.gif'></td><td onclick="+'"'+"navi.roomclick("+x+", 'private');"+'"'+" width='227' bgcolor='#DADADA'><div class='clientfont'><img src='images/navi/sloten/"+room.S+".gif'>&nbsp;"+room.N+"</div></td><td><img src='images/navi/rechts.gif'></td><td width='2'><font color='black' size='2'>&nbsp;</font></td><td><div onclick="+'"'+"navi.goclick("+x+", 'private');"+'"'+" style='position:relative;'><img src='images/navi/ga"+image_extra+".gif' border='0' style='cursor: default;'><div style='position:absolute; left:0; top:0; width:42; height:16; text-align:right;' class='clientfont'><u>"+texts["navi_go"]+"</u></div></div></td></tr><tr><td colspan='5' height='2'></td></tr>";
				count++;
			}
		}
		if (count < 1) {
			html += "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='2' height='8'></td></tr><tr><td width='8'></td><td><div class='clientfont'>"+texts["navi_no_guestrooms"]+"</div></td></tr></table>";
			html += "</table>";
		}
		html += "</table>";
		$("list_guestrooms").innerHTML = html;
	},
	update_own : function () {
		var html = "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='5' height='2'></td></tr>";
		var len = this.lists.own.length;
		var count = 0;
		for(x in this.lists.own) {
			if(count >= len) break; //fix to avoid prototype breaking our loop
			else {
				var room = this.lists.own[x];
				if (room.U != 0) {
					var eenderde = room.M/3;
					if (room.U < Math.round(eenderde)) {
						var image_extra = "2";
					}
					else if (room.U < Math.round(eenderde*2)) {
						var image_extra = "3";
					}
					else if (room.U <= room.M) {
						var image_extra = "4";
					}
				}
				else {
					var image_extra = "";
				}
				html += "<tr><td><img src='images/navi/links.gif'></td><td onclick="+'"'+"navi.roomclick("+x+", 'own');"+'"'+" width='227' bgcolor='#DADADA'><div class='clientfont'><img src='images/navi/sloten/"+room.S+".gif'>&nbsp;"+room.N+"</div></td><td><img src='images/navi/rechts.gif'></td><td width='2'><font color='black' size='2'>&nbsp;</font></td><td><div onclick="+'"'+"navi.goclick("+x+", 'own');"+'"'+" style='position:relative;'><img src='images/navi/ga"+image_extra+".gif' border='0' style='cursor: default;'><div style='position:absolute; left:0; top:0; width:42; height:16; text-align:right;' class='clientfont'><u>"+texts["navi_go"]+"</u></div></div></td></tr><tr><td colspan='5' height='2'></td></tr>";
				count++;
			}
		}
		if (count < 1) {
			html += "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='2' height='8'></td></tr><tr><td width='8'></td><td><div class='clientfont'>"+texts["navi_no_ownrooms"]+"</div></td></tr></table>";
			html += "</table>";
		}
		html += "</table>";
		$("list_own").innerHTML = html;
	},
	update_searched : function () {
		var html = "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='5' height='2'></td></tr>";
		var len = this.lists.searched.length;
		var count = 0;
		for(x in this.lists.searched) {
			if(count >= len) break; //fix to avoid prototype breaking our loop
			else {
				var room = this.lists.searched[x];
				if (room.U != 0) {
					var eenderde = room.M/3;
					if (room.U < Math.round(eenderde)) {
						var image_extra = "2";
					}
					else if (room.U < Math.round(eenderde*2)) {
						var image_extra = "3";
					}
					else if (room.U <= room.M) {
						var image_extra = "4";
					}
				}
				else {
					var image_extra = "";
				}
				html += "<tr><td><img src='images/navi/links.gif'></td><td onclick="+'"'+"navi.roomclick("+x+", 'searched');"+'"'+" width='227' bgcolor='#DADADA'><div class='clientfont'><img src='images/navi/sloten/"+room.S+".gif'>&nbsp;"+room.N+"</div></td><td><img src='images/navi/rechts.gif'></td><td width='2'><font color='black' size='2'>&nbsp;</font></td><td><div onclick="+'"'+"navi.goclick("+x+", 'searched');"+'"'+" style='position:relative;'><img src='images/navi/ga"+image_extra+".gif' border='0' style='cursor: default;'><div style='position:absolute; left:0; top:0; width:42; height:16; text-align:right;' class='clientfont'><u>"+texts["navi_go"]+"</u></div></div></td></tr><tr><td colspan='5' height='2'></td></tr>";
				count++;
			}
		}
		if (count < 1) {
			html += "<table border='0' cellpadding='0' cellspacing='0'><tr><td colspan='2' height='8'></td></tr><tr><td width='8'></td><td><div class='clientfont'>"+texts["navi_no_finds"]+"</div></td></tr></table>";
			html += "</table>";
		}
		html += "</table>";
		$("list_searched").innerHTML = html;
	},
	byid : function(id) {
		id = parseInt(id);
		if(id != null && id != "NaN") {
			room.go(id);
		}
		else {	
			debug.add("ID not accepted");
		}
	},
	clearbuttons : function () {
		HideContent("knop_24");
		HideContent("knop_2");
		HideContent("knop_3");
		HideContent("knop_23");
		HideContent("knop_30");
		HideContent("knop_31");
		HideContent("knop_32");
		HideContent("knop_33");
		HideContent("knop_34");
	},
	clear : function () {
		$('big_tab1').src = "images/navi/tabs/1a.gif";
		$('big_tab2').src = "images/navi/tabs/2a.gif";
		$('tabtitel_src').src = "images/blank.gif";
		$('roomschrijf_1').innerHTML = "";
		$('roomschrijf_2').innerHTML = "";
		$('roomschrijf_3').innerHTML = "";
		$('small_tab1').src = "images/navi/small_tabs/1a.gif";
		$('small_tab2').src = "images/navi/small_tabs/2a.gif";
		$('small_tab3').src = "images/navi/small_tabs/3a.gif";
		HideContent("list_publics");
		HideContent("list_guestrooms");
		HideContent("list_searched");
		HideContent("list_own");
		HideContent("list_favo");
		HideContent("tabtitel_1");
		HideContent("tabtitel_2");
		HideContent("tabtitel_3");
		HideContent("tabtitel_4");
		HideContent("tabtitel_5");
		HideContent("small_tab1_div");
		HideContent("small_tab2_div");
		HideContent("small_tab3_div");
		HideContent("zoeklayer");
		HideContent("zoekvak");
		HideContent("knop_22");
		HideContent("eigenlayer");
		HideContent("knop_26");
		HideContent("maakmachine");
		HideContent("wijziglayer");
		HideContent("knop_7");
		HideContent("knop_29");
		HideContent("knop_8");
		HideContent("navi_change_text_div");
		HideContent('change_pass_div');
		HideContent("navi_blanc_layer");
		HideContent("navi_del_text_div1");
		HideContent("navi_del_text_div2");
		HideContent("navi_del_text_div3");
		this.selectedroom = null;
	},
	bigtab1 : function () {
		this.clearbuttons();
		this.clear();
		$('big_tab1').src = "images/navi/tabs/1b.gif";
		$('tabtitel_src').src = "images/navi/icons/8.gif";
		$('roomschrijf_1').innerHTML = texts["navi_publics"];
		$('roomschrijf_3').innerHTML = texts["navi_publics_help"];
		ShowContent("list_publics");
		ShowContent("tabtitel_1");
	},
	bigtab2 : function () {
		this.clearbuttons();
		this.clear();
		$('big_tab2').src = "images/navi/tabs/2b.gif";
		$('tabtitel_src').src = "images/navi/icons/7.gif";
		$('roomschrijf_1').innerHTML = texts["navi_guestrooms"];
		$('roomschrijf_3').innerHTML = texts["navi_guestrooms_help"];
		ShowContent("list_guestrooms");
		ShowContent("tabtitel_2");
		ShowContent("small_tab1_div");
		ShowContent("small_tab2_div");
		ShowContent("small_tab3_div");
	},
	smalltab1 : function () {
		this.clearbuttons();
		this.clear();
		$('tabtitel_src').src = "images/navi/icons/3.gif";
		$('roomschrijf_1').innerHTML = texts["navi_guestrooms"];
		$('roomschrijf_3').innerHTML = texts["navi_searchhelp"];
		ShowContent("tabtitel_3");
		$('small_tab1').src = "images/navi/small_tabs/1b.gif";
		ShowContent("small_tab1_div");
		ShowContent("small_tab2_div");
		ShowContent("small_tab3_div");
		ShowContent("list_searched");
		ShowContent("zoeklayer");
		ShowContent("zoekvak");
		ShowContent("knop_22");
		$('navi_search').focus();
	},
	smalltab2 : function () {
		this.clearbuttons();
		this.clear();
		$('tabtitel_src').src = "images/navi/icons/1.gif";
		$('roomschrijf_1').innerHTML = texts["navi_guestrooms"];
		$('roomschrijf_3').innerHTML = texts["navi_ownrooms_help"];
		ShowContent("tabtitel_4");
		ShowContent("small_tab1_div");
		ShowContent("small_tab2_div");
		ShowContent("small_tab3_div");
		$('small_tab2').src = "images/navi/small_tabs/2b.gif";
		ShowContent("list_own");
		ShowContent("eigenlayer");
		ShowContent("knop_26");
		ShowContent("maakmachine");
	},
	smalltab3 : function () {
		this.clearbuttons();
		this.clear();
		$('tabtitel_src').src = "images/navi/icons/2.gif";
		$('roomschrijf_1').innerHTML = texts["navi_guestrooms"];
		$('roomschrijf_3').innerHTML = texts["navi_favo_help"];
		ShowContent("tabtitel_5");
		ShowContent("small_tab1_div");
		ShowContent("small_tab2_div");
		ShowContent("small_tab3_div");
		$('small_tab3').src = "images/navi/small_tabs/3b.gif";
		ShowContent("list_favo");
	},
	roomclick : function (pos, list) {
		switch(list) {
			case "public":
				this.selectedroom = this.lists.publics[pos];
				break;
			case "private":
				this.selectedroom = this.lists.privates[pos];
				break;
			case "own":
				this.selectedroom = this.lists.own[pos];
				break;
			case "searched":
				this.selectedroom = this.lists.searched[pos];
				break;
		}
		this.clearbuttons();
		
		if (this.selectedroom.T == "public") {
			$('tabtitel_src').src = "images/navi/public/"+this.selectedroom.I+".gif";
			$('roomschrijf_2').innerHTML = "";
			ShowContent("knop_24");
		}
		else {
			$('roomschrijf_2').innerHTML = texts["navi_roomowner"]+": "+ucfirst(this.selectedroom.O);
			switch(this.selectedroom.S) {
				case 1:
					$('tabtitel_src').src = "images/navi/icons/4.gif";
				break;
				case 2:
					$('tabtitel_src').src = "images/navi/icons/5.gif";
				break;
				case 3:
					$('tabtitel_src').src = "images/navi/icons/6.gif";
				break;
			}
			if (this.selectedroom.O == user.name) {
				ShowContent("knop_24");
				ShowContent("knop_23");
			}
			else {
				ShowContent("knop_24");
				if (this.selectedroom.F == 0)
				{
					ShowContent("knop_2");
					HideContent("knop_3");
				}
				else {
					ShowContent("knop_3");
					HideContent("knop_2");
				}
			}
		}
		$('roomschrijf_1').innerHTML = this.selectedroom.N+" "+this.selectedroom.U+"/"+this.selectedroom.M;
		if (in_array("view_room_id", user.rights)) {
			$('roomschrijf_1').innerHTML += " (ID: "+this.selectedroom.I+")";
		}
		$('roomschrijf_3').innerHTML = this.selectedroom.D;
	},
	goclick : function (pos, list) {
		switch(list) {
			case "public":
				this.selectedroom = this.lists.publics[pos];
				break;
			case "private":
				this.selectedroom = this.lists.privates[pos];
				break;
			case "own":
				this.selectedroom = this.lists.own[pos];
				break;
			case "searched":
				this.selectedroom = this.lists.searched[pos];
				break;
			break;
		}
		this.go();
	},
	go : function () {
		if (this.selectedroom != null) {
			if (this.selectedroom.T == "private") {
				if (this.selectedroom.O == user.name) {
					setTimeout(function(){room.go(navi.selectedroom.I);},1);
				}
				else {
					switch(this.selectedroom.S) {
						case 1:
							setTimeout(function(){room.go(navi.selectedroom.I);},1);
						break;
						case 2:
							if (in_array("visit_locked", user.rights)) {
								setTimeout(function(){room.go(navi.selectedroom.I);},1);
							}
							else {
								client.notify(texts["navi_locked"]);
							}
						break;
						case 3:
							if (in_array("visit_locked", user.rights)) {
								setTimeout(function(){room.go(navi.selectedroom.I);},1);
							}
							else {
								$("navi_go_room_pass_text").innerHTML = "<img src='images/navi/icons/6.gif'><br><br><b>"+texts["navi_pass"]+"<br>"+this.selectedroom.N+"</div></b><br><br>"+texts["navi_pass"]+"<br><br><input type='password' size='15' maxlength='15' name='navi_room_pass' id='navi_room_pass' class='clientfont'><br><br>";
								ShowContent("navi_blanc_layer");
								ShowContent("navi_go_room_pass");
								ShowContent("knop_30");
								ShowContent("knop_31");
							}
						break;
					}
				}
			}
			else if (this.selectedroom.T == "public")  {
				setTimeout(function(){room.go(navi.selectedroom.I);},1);
			}
		}
	},
	search : function () {
		var searchfor = $('navi_search').value;
		if (searchfor != "") {
			$('navi_search').value = "";
			packets.send.navisearch(searchfor);
		}
	}
};

/*
function enterpass(id, pass)
{
	pass_form = $("navi_room_pass").value;
	pass_good = pass;
	if (pass_form != "")
	{
		if (pass_form == pass_good)
		{
			show_room(id);
			stop_enterpass();
		}
		else
		{
			start_alert(texts[72]);
			$("navi_room_pass").value = "";
		}
	}
}
function stop_enterpass()
{
	pass_form = "";
	pass_good = "";
	$("navi_room_pass").value = "";
	$("navi_go_room_pass_text").innerHTML = "";
	HideContent("navi_blanc_layer");
	HideContent("navi_go_room_pass");
	HideContent("knop_30");
	HideContent("knop_31");
}


function change_room(naam, omschrijving, type, safe, van, id, favo, pass)
{
	del_progres = 0;
	change_current_pass = pass;
	$("change_id").value = id;
	$("change_name").value = naam;
	$("change_desc").value = omschrijving;
	if (safe == 1)
	{
		$("change_safety_1").checked = true;
		HideContent('change_pass_div');
	}
	if (safe == 2)
	{
		$("change_safety_2").checked = true;
		HideContent('change_pass_div');
	}
	if (safe == 3)
	{
		$("change_safety_3").checked = true;
		ShowContent('change_pass_div');
		$('change_pass_div').innerHTML = '<b>'+texts[99]+':</b><br><input type="password" size="15" maxlength="15" id="change_pass1" name="change_pass1" class="clientfont" value="'+change_current_pass+'"><br><br><b>'+texts[100]+':</b><br><input type="password" size="15" maxlength="15" id="change_pass2" name="change_pass2" class="clientfont" value="'+change_current_pass+'">';
	}
	ShowContent("wijziglayer");
	ShowContent("knop_7");
	ShowContent("knop_29");
	ShowContent("knop_8");
	ShowContent("navi_change_text_div");
}
function change_safe_pass()
{
	change_check1 = $("change_safety_1").checked;
	change_check2 = $("change_safety_2").checked;
	change_check3 = $("change_safety_3").checked;
	if (change_check1)
	{
		$('change_pass_div').innerHTML = '';
		HideContent('change_pass_div');
	}
	if (change_check2)
	{
		$('change_pass_div').innerHTML = '';
		HideContent('change_pass_div');
	}
	if (change_check3)
	{
		$('change_pass_div').innerHTML = '<b>'+texts[99]+':</b><br><input type="password" size="15" maxlength="15" id="change_pass1" name="change_pass1" class="clientfont" value="'+change_current_pass+'"><br><br><b>'+texts[100]+':</b><br><input type="password" size="15" maxlength="15" id="change_pass2" name="change_pass2" class="clientfont" value="'+change_current_pass+'">';
		ShowContent('change_pass_div');
	}
}
function save_change_room() 
{
	change_check1 = $("change_safety_1").checked;
	change_check2 = $("change_safety_2").checked;
	change_check3 = $("change_safety_3").checked;
	if (change_check1)
	{
		new_safe = 1;
	}
	if (change_check2)
	{
		new_safe = 2;
	}
	if (change_check3)
	{
		new_safe = 3;
	}
	if (new_safe == 3)
	{
		change_pass_check();
	}
	else
	{
		change_send();
	}
}
function change_pass_check()
{
	pass1 = $("change_pass1").value;
	pass2 = $("change_pass2").value;
	if ((pass1 != "") && (pass2 != ""))
	{
		if ((pass1.length > 3) && (pass2.length > 3))
		{
			if (pass1 == pass2)
			{
				if (pass1.length <= 15)
				{
					change_send();
				}
				else
				{
					start_alert(texts[101]);
				}
			}
			else
			{
				start_alert(texts[102]);
			}
		}
		else
		{
			start_alert(texts[103]);
		}
	}
	else
	{
		if ($("change_pass_div").style.visibility == 'visible')
		{
			start_alert(texts[104]);
		}
		else
		{
			$("change_pass1").value = "";
			$("change_pass2").value = "";
			ShowContent("change_pass_div");
		}
	}
}
function change_send(new_id)
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
			new_id = $("change_id").value;
			new_name = $("change_name").value;
			new_desc = $("change_desc").value;
			change_check1 = $("change_safety_1").checked;
			change_check2 = $("change_safety_2").checked;
			change_check3 = $("change_safety_3").checked;
			new_pass = "";
			if (change_check1)
			{
				new_safe = 1;
			}
			if (change_check2)
			{
				new_safe = 2;
			}
			if (change_check3)
			{
				new_safe = 3;
			}
			if (new_safe == 3)
			{
				new_pass = $("change_pass1").value;
			}
			ajax_vrij = "nee";
			xmlhttp.open("GET", "changeroom.php?id="+new_id+"&eigenaar="+sessie_naam+"&naam="+new_name+"&schrijf="+new_desc+"&safe="+new_safe+"&pass="+new_pass+"&r="+Math.round(9000*Math.random()),true);
		    xmlhttp.onreadystatechange=function()
		    {
			    if (xmlhttp.readyState==4)
		        {
			        if(xmlhttp.status == 200)
		 			{
						$('list_eigen').innerHTML = xmlhttp.responseText;
			        	start_alert(texts[105]);
			        	navi.smalltab2();
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
	    	setTimeout("change_send('"+new_id+"');", 1000);
    	}
    }
}
function del_change_room()
{
	if (del_progres == 0)
	{
		straks_del_progres = 1;
		ShowContent("navi_blanc_layer");
		ShowContent("navi_del_text_div1");
		ShowContent("knop_32");
		ShowContent("knop_33");
	}
	if (del_progres == 1)
	{
		straks_del_progres = 2;
		ShowContent("navi_blanc_layer");
		HideContent("navi_del_text_div1");
		ShowContent("navi_del_text_div2");
		ShowContent("knop_32");
		ShowContent("knop_33");
	}
	if (del_progres == 2)
	{
		if (verbinding == "ja")
		{
			if (ajax_vrij == "ja")
			{
		 		ajax_vrij = "nee";
				dell_id = $("change_id").value;
				xmlhttp.open("GET", "dellroom.php?id="+dell_id+"&eigenaar="+sessie_naam+"&r="+Math.round(9000*Math.random()),true);
    			xmlhttp.onreadystatechange=function()
	    		{
	    			if (xmlhttp.readyState==4)
        			{
	        			
	        			if(xmlhttp.status == 200)
		 				{
					 		$('list_eigen').innerHTML = xmlhttp.responseText;
							straks_del_progres = 0;
							HideContent("navi_del_text_div2");
							HideContent("knop_32");
							HideContent("knop_33");
							ShowContent("navi_del_text_div3");
							ShowContent("knop_34");
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
		    	setTimeout("del_change_room();", 1000);
    		}
		}
	}
	del_progres = straks_del_progres;
}
function stop_del_change_room()
{
	del_progres = 0;
	HideContent("navi_blanc_layer");
	HideContent("navi_del_text_div1");
	HideContent("navi_del_text_div2");
	HideContent("knop_30");
	HideContent("knop_31");
	HideContent("knop_32");
	HideContent("knop_33");
}
function stop_change_room()
{
	HideContent("wijziglayer");
	HideContent("knop_7");
	HideContent("knop_29");
	HideContent("knop_8");
	HideContent("navi_change_text_div");
	HideContent('change_pass_div');
	HideContent("navi_blanc_layer");
	HideContent("navi_del_text_div1");
	HideContent("navi_del_text_div2");
	change_current_pass = '';
}


function add_favo(kamerid)
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
		 	ajax_vrij = "nee";
			xmlhttp.open("GET", "add_favo.php?kamerid="+kamerid+"&sessie_naam="+sessie_naam+"&r="+Math.round(9000*Math.random()),true);
    		xmlhttp.onreadystatechange=function()
    		{
	    		if (xmlhttp.readyState==4)
		       	{
			       	if(xmlhttp.status == 200)
		 			{
			 			$('list_favoriet').innerHTML = xmlhttp.responseText;
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
	    	setTimeout("add_favo("+kamerid+");", 1000);
    	}
	}
}
function del_favo(kamerid)
{
	if (verbinding == "ja")
	{
		if (ajax_vrij == "ja")
		{
		 	ajax_vrij = "nee";
			xmlhttp.open("GET", "del_favo.php?kamerid="+kamerid+"&sessie_naam="+sessie_naam+"&r="+Math.round(9000*Math.random()),true);
    		xmlhttp.onreadystatechange=function()
    		{
	    		if (xmlhttp.readyState==4)
        		{
	        		if(xmlhttp.status == 200)
		 			{
			 			$('list_favoriet').innerHTML = xmlhttp.responseText;
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
	    	setTimeout("del_favo("+kamerid+");", 1000);
    	}
	}
}

*/