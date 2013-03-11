var matic = {
	roomtype : 1,
	counttiles : new Array(104, 94, 36, 84, 80, 80),
	naviclick : function () {
		setTimeout(function(){matic.open();},1);	
	},
	open : function () {
		set_top('matic_back');
		ShowContent('matic_back');
		set_top('matic');
		ShowContent('matic');
		ShowContent("matic_1");
		HideContent("matic_2");
		$("matic_2_text").innerHTML = "";
		HideContent("matic_3");
		HideContent("matic_4");
		$("matic_4_text").innerHTML = "";
		HideContent("matic_5");
		HideContent("matic_6");
		HideContent("matic_7");
		HideContent("matic_lijn_2");
		HideContent("matic_lijn_3");
		ShowContent("matic_knop_1");
		ShowContent("matic_knop_2");
		HideContent("matic_knop_3");
		HideContent("matic_knop_4");
		HideContent("matic_knop_5");
		HideContent("matic_knop_6");
		HideContent("matic_knop_7");
		HideContent("matic_knop_8");
		$("matic_name").value = '';
		$("matic_desc").value = '';
		this.roomtype = 1;
		$("matic_5_text").innerHTML = texts["matic_size"]+": 104 "+texts["matic_tiles"];
		$("matic_type_image").src = "images/matic/roomtype/1.gif";
		$("matic_safety_1").checked = true;
		$("matic_pass1").value = "";
		$("matic_pass2").value = "";
	},
	close : function () {
		HideContent('matic_back');
		HideContent('matic');
	},
	button2 : function () {
		HideContent("matic_1");
		ShowContent("matic_2");
		$("matic_2_text").innerHTML = "<b>"+texts["matic_createyourown"]+"</b><br>"+texts["matic_canmodifysettings"];
		ShowContent("matic_3");
		ShowContent("matic_4");
		$("matic_4_text").innerHTML = "1/3";
		ShowContent("matic_lijn_2");
		ShowContent("matic_lijn_3");
		HideContent("matic_knop_1");
		HideContent("matic_knop_2");
		ShowContent("matic_knop_3");
		ShowContent("matic_knop_4");
		$("matic_name").focus();
	},
	button3: function () {
		if ($("matic_name").value == "") {
			client.notify("Geef je kamer een naam!");
		}
		else {
			$("matic_2_text").innerHTML = texts["matic_chooselayout"];
			$("matic_4_text").innerHTML = "2/3";
			HideContent("matic_3");
			ShowContent("matic_5");
			HideContent("matic_knop_3");
			HideContent("matic_knop_4");
			ShowContent("matic_knop_5");
			ShowContent("matic_knop_6");
		}
	},
	button4 : function () {
		$("matic_2_text").innerHTML = "<b>"+texts["matic_createyourown"]+"</b><br>"+texts["matic_canmodifysettings"];
		$("matic_4_text").innerHTML = "1/3";
		ShowContent("matic_3");
		HideContent("matic_5");
		ShowContent("matic_knop_3");
		ShowContent("matic_knop_4");
		HideContent("matic_knop_5");
		HideContent("matic_knop_6");
	},
	button5 : function () {
		$("matic_2_text").innerHTML = texts["matic_security"];
		$("matic_4_text").innerHTML = "3/3";
		HideContent("matic_5");
		ShowContent("matic_6");
		HideContent("matic_knop_5");
		HideContent("matic_knop_6");
		ShowContent("matic_knop_7");
		ShowContent("matic_knop_8");
	},
	button6 : function () {
		$("matic_2_text").innerHTML = texts["matic_chooselayout"];
		$("matic_4_text").innerHTML = "2/3";
		ShowContent("matic_5");
		HideContent("matic_6");
		HideContent("matic_7");
		ShowContent("matic_knop_5");
		ShowContent("matic_knop_6");
		HideContent("matic_knop_7");
		HideContent("matic_knop_8");
	},
	button7 : function () {
		var new_safe = 1;
		if ($("matic_safety_1").checked) {
			new_safe = 1;
		}
		else if ($("matic_safety_2").checked) {
			new_safe = 2;
		}
		else if ($("matic_safety_3").checked) {
			new_safe = 3;
		}
		if (new_safe != 0) {
			if (new_safe == 3) {
				matic.checkpass();
			}
			else {
				matic.send();
			}
		}
	},
	checkpass : function () {
		var pass1 = $("matic_pass1").value;
		var pass2 = $("matic_pass2").value;
		if ((pass1 != "") && (pass2 != "")) {
			if ((pass1.length > 3) && (pass2.length > 3)) {
				if (pass1 == pass2) {
					if (pass1.length <= 15) {
						HideContent("matic_7");
						matic.send();
					}
					else {
						HideContent("matic_6");
						ShowContent("matic_7");
						client.notify(texts["matic_longpwd"]);
					}
				}
				else {
					HideContent("matic_6");
					ShowContent("matic_7");
					client.notify(texts["matic_checkpwd"]);
				}
			}
			else {
				HideContent("matic_6");
				ShowContent("matic_7");
				client.notify(texts["matic_shortpwd"]);
			}
		}
		else {
			if ($("matic_7").style.visibility == 'visible') {
				HideContent("matic_6");
				ShowContent("matic_7");
				client.notify(texts["matic_fillall"]);
			}
			else {
				$("matic_pass1").value = "";
				$("matic_pass2").value = "";
				HideContent("matic_6");
				ShowContent("matic_7");
			}
		}
	},
	send : function () {
		var new_name = $("matic_name").value;
		var new_desc = $("matic_desc").value;
		var new_type = parseInt(this.roomtype);
		var new_pass = "";
		var new_safe = 0;
		if ($("matic_safety_1").checked) {
			new_safe = 1;
		}
		else if ($("matic_safety_2").checked) {
			new_safe = 2;
		}
		else if ($("matic_safety_3").checked) {
			new_safe = 3;
		}
		if (new_safe == 3)
		{
			new_pass = $("matic_pass1").value;
		}
		packets.send.createroom(new_name, new_desc, new_type, new_safe, new_pass);
	},
	arrow1: function () {
		var roomtype = parseInt(this.roomtype);
		if (roomtype == 1) {
			roomtype = 6;
		}
		else {
			roomtype--;
		}
		this.roomtype = roomtype;
		$("matic_5_text").innerHTML = texts["matic_size"]+": "+this.counttiles[(roomtype-1)]+" "+texts["matic_tiles"];
		$("matic_type_image").src = "images/matic/roomtype/"+roomtype+".gif";
	},
	arrow2 : function () {
		var roomtype = parseInt(this.roomtype);
		if (roomtype == 6) {
			roomtype = 1;
		}
		else {
			roomtype++;
		}
		this.roomtype = roomtype;
		$("matic_5_text").innerHTML = texts["matic_size"]+": "+this.counttiles[(roomtype-1)]+" "+texts["matic_tiles"];
		$("matic_type_image").src = "images/matic/roomtype/"+roomtype+".gif";
	},
	answer : function (answer) {
		this.close();
		if (answer == "error") {
			client.notify(texts["matic_fail"]);
		}
		else {
			var id = parseInt(answer);
			if(id != null && id != "NaN") {
				room.go(id, "private");
			}
			else {
				client.notify(texts["matic_fail"]);
				debug.add("Create Room answer ID not accepted");
			}
		}
	}
}