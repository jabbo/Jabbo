var messenger = {
	loaded : false,
	opened : false,
	changetime : false,
	thistab : 1,
	buddies : new Array(),
	requests : new Array(),
	messages : new Array(),
	message : null,
	request : null,
	searchfor : "",
	searchedid : 0,
	addable : false,
	selected : 0,
	selectedinfo : null,
	writebutton_enable : false,
	delbutton_enable : false,
	open : function () {
		if (!this.opened) {
			this.opened = true;
			set_top('messenger');
			ShowContent('messenger');
			this.tab1();
		}
	},
	close : function () {
		if (this.opened) {
			this.opened = false;
			HideContent('messenger');
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
	update : function (mode) {
		if (this.messages.length != 0 || this.requests.length != 0) {
			$('messenger_icon1').src = "images/messenger2.gif";
			$('messenger_icon2').src = "images/icon1_2.gif";
		}
		else {
			$('messenger_icon1').src = "images/messenger.gif";
			$('messenger_icon2').src = "images/icon1.gif";
		}
		$('messenger_link_1').innerHTML = this.messages.length+" "+texts["messenger_newmessages"];
		$('messenger_link_2').innerHTML = this.requests.length+" "+texts["messenger_newrequests"];
		var friends_text = "";
		if (this.buddies.length == 0) {
			friends_text += "<div class='messengerfont' style='padding: 5px;'>"+texts["messenger_nofriends"]+"</div>";
		}
		else {
			// first the online buddies
			var len = this.buddies.length;
			var count = 0;
			for(x in this.buddies) {
				if(count >= len) break;
				else {
					var buddy = this.buddies[x];
					if (buddy.O == "online") {
						friends_text += "<div onclick='messenger.selectfriend("+buddy.I+", "+x+")' style='position:relative; width:200; height:40;'>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:4; width:170; height:8; font-weight: bold;'>"+ucfirst(buddy.N)+"</div>";
						friends_text += "<div style='position:absolute; left:6; top:4;'><img src='images/messenger/face.gif'></div>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:14; width:170; height:8;'>Online</div>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:24; width:170; height:8;'>"+buddy.M+"</div>";
						friends_text += "<div style='position:absolute; left:0; top:39;'><img src='images/messenger/streep2.gif'></div>";
						if(buddy.I == this.selected && mode==1) {
							friends_text += "<div id='messenger_buddy_select_"+buddy.I+"' style='position:absolute; left:1; top:1;'><img src='images/messenger/selected.gif'></div>";
						}
						else {
							friends_text += "<div id='messenger_buddy_select_"+buddy.I+"' style='position:absolute; left:1; top:1; display:none;'><img src='images/messenger/selected.gif'></div>";
						}
						friends_text += "</div>";
					}
					count++;
				}
			}
			// then the offline buddies
			var len = this.buddies.length;
			var count = 0;
			for(x in this.buddies) {
				if(count >= len) break;
				else {
					var buddy = this.buddies[x];
					if (buddy.O != "online") {
						friends_text += "<div onclick='messenger.selectfriend("+buddy.I+", "+x+")' style='position:relative; width:200; height:40;'>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:4; width:170; height:8; font-weight: bold;'>"+ucfirst(buddy.N)+"</div>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:14; width:170; height:8;'>"+texts["messenger_lastvisit"]+" "+buddy.O.split(/ /)[0]+"</div>";
						friends_text += "<div class='messengerfont' style='position:absolute; left:29; top:24; width:170; height:8;'>"+buddy.M+"</div>";
						friends_text += "<div style='position:absolute; left:0; top:39;'><img src='images/messenger/streep2.gif'></div>";
						if(buddy.I == this.selected && mode==1) {
							friends_text += "<div id='messenger_buddy_select_"+buddy.I+"' style='position:absolute; left:1; top:1;'><img src='images/messenger/selected.gif'></div>";
						}
						else {
							friends_text += "<div id='messenger_buddy_select_"+buddy.I+"' style='position:absolute; left:1; top:1; display:none;'><img src='images/messenger/selected.gif'></div>";
						}
						friends_text += "</div>";
					}
					count++;
				}
			}
		}
		$('messenger_vrienden').innerHTML = friends_text;
		
	},
	missiontext : function () {
		if (this.changetime) {
			clearTimeout(this.changetime);
		}
  		this.changetime = setTimeout(function(){messenger.updatemission();}, 3000);
	},
	missionreg : function () {
		var reg = new RegExp("<(.|\n)*?>");
  		$("messenger_mission").value = $("messenger_mission").value.replace(reg, "");
	},
	updatemission : function () {
		this.changetime = false;
		packets.send.messengermission($("messenger_mission").value);
	},
	selectfriend : function(id, pos) {
		if(this.selected == id) {
			HideContent('messenger_buddy_select_'+id);
			this.selected = 0;
			this.selectedinfo = null;
			messenger.writebutton_enable = false;
			messenger.delbutton_enable = false;
			$('knop_18').className = 'knop_trans';
			$('knop_11').className = 'knop_trans';
		}
		else {
			if(this.selected != 0) {
				HideContent('messenger_buddy_select_'+this.selected);
			}
			this.selected = id;
			this.selectedinfo = this.buddies[pos];
			messenger.writebutton_enable = true;
			messenger.delbutton_enable = true;
			ShowContent('messenger_buddy_select_'+this.selected);
			$('knop_18').className = 'knop_solid';
			$('knop_11').className = 'knop_solid';
		}
	},
	clear : function () {
		messenger.selected = 0;
		this.selectedinfo = null;
		messenger.writebutton_enable = false;
		messenger.delbutton_enable = false;
		$("messenger_send_message_text").value = "";
		$('knop_18').className = 'knop_trans';
		$('knop_11').className = 'knop_trans';
		$('knop_21').className = 'knop_trans';
		HideContent("messenger_vergroot");
		HideContent("messenger_gevonden_naam");
		HideContent("messenger_gevonden_missie");
		HideContent("messenger_gevonden_last_online");
		HideContent("messenger_gevonden_online_status");
		HideContent("messenger_text_1");
		HideContent("messenger_text_2");
		HideContent("messenger_text_3");
		HideContent("messenger_text_4");
		HideContent("messenger_text_5");
		HideContent("messenger_text_6");
		HideContent("messenger_text_7");
		HideContent("messenger_text_8");
		HideContent("messenger_text_9");
		HideContent("messenger_text_10");
		HideContent("messenger_text_11");
		$('messenger_tab1').src = "images/messenger/"+texts["lang"]+"/1.gif";
		$('messenger_tab2').src = "images/messenger/"+texts["lang"]+"/2.gif";
		$('messenger_tab3').src = "images/messenger/"+texts["lang"]+"/3.gif";
		$('messenger_tab4').src = "images/messenger/"+texts["lang"]+"/4.gif";
		$("trashtext").focus();
		messenger.update(2);
		$('messengerface1').style.backgroundImage = "url('images/blank.gif')";
		$('messengerface2').style.backgroundImage = "url('images/blank.gif')";
	},
	tab1 : function () {
		if (this.thistab != 1) {
			this.thistab = 1;
			this.clear();
			ShowContent("messenger_text_1");
			$('messenger_tab1').src = "images/messenger/"+texts["lang"]+"/1b.gif";
		}
	},
	tab2 : function () {
		if (this.thistab != 2) {
			this.thistab = 2;
			this.clear();
			ShowContent("messenger_text_2");
			$('messenger_tab2').src = "images/messenger/"+texts["lang"]+"/2b.gif";
		}
	},
	tab3 : function () {
		if (this.thistab != 3) {
			this.thistab = 3;
			this.clear();
			ShowContent("messenger_text_3");
			$('messenger_tab3').src = "images/messenger/"+texts["lang"]+"/3b.gif";
			$("messenger_zoeknaam").focus();
		}
	},
	tab4 : function () {
		if (this.thistab != 4) {
			this.thistab = 4;
			this.clear();
			ShowContent("messenger_text_4");
			$('messenger_tab4').src = "images/messenger/"+texts["lang"]+"/4b.gif";
		}
	},
	lasttab : function () {
		if (this.thistab != 0) {
			lasttab = this.thistab;
			this.thistab = 0;
			run_script("messenger.tab"+lasttab+"();");
		}
	},
	friendhelp : function () {
		this.clear();
		$('messenger_tab2').src = "images/messenger/"+texts["lang"]+"/2b.gif";
		ShowContent("messenger_text_7");
	},
	show_writehelp : function () {
		HideContent("messenger_text_9");
		ShowContent("messenger_text_10");
	},
	stop_writehelp : function () {
		HideContent("messenger_text_10");
		ShowContent("messenger_text_9");
	},
	search : function () {
		var searchname = $('messenger_zoeknaam').value;
		if (searchname != "") {
			$('messenger_zoeknaam').value = "";
			this.searchfor = searchname;
			this.searchedid = 0;
			packets.send.messengersearch(searchname);
		}
	},
	searched : function (userid, mission, clothes, last_online, online, addable) {
		this.searchedid = userid;
		this.addable = addable;
		$('knop_21').className = 'knop_trans';
		if (this.searchedid == 0) {
			$('messengerface1').style.backgroundImage = "url('images/blank.gif')";
			$('messenger_gevonden_naam').innerHTML = texts["messenger_notfound"];
			HideContent("messenger_vergroot");
			ShowContent("messenger_gevonden_naam");
			HideContent("messenger_gevonden_missie");
			HideContent("messenger_gevonden_last_online");
			HideContent("messenger_gevonden_online_status");
		}
		else {
			$('messengerface1').style.backgroundImage = "url('avatar.php?figure="+clothes+"&direction=3&head_direction=3&action=std')";
			ShowContent("messenger_vergroot");
			ShowContent("messenger_gevonden_naam");
			ShowContent("messenger_gevonden_missie");
			ShowContent("messenger_gevonden_last_online");
			ShowContent("messenger_gevonden_online_status");
			$('messenger_gevonden_naam').innerHTML = ucfirst(this.searchfor.toLowerCase());
			$('messenger_gevonden_missie').innerHTML = mission;
			$('messenger_gevonden_last_online').innerHTML = last_online;
			$('messenger_gevonden_online_status').innerHTML = online;
			if (online) {
				$('messenger_gevonden_online_status').innerHTML = "Online";
			}
			else {
				$('messenger_gevonden_online_status').innerHTML = "Offline";
			}
			if (this.addable) {
				$('knop_21').className = 'knop_solid';
			}
		}
		
	},
	show_message : function () {
		if (this.messages.length > 0) {
			this.message = this.messages[0];
			$('messenger_text_11_text1').innerHTML = texts["messenger_sender"]+": "+ucfirst(this.message.FN);
			$('messenger_text_11_text2').innerHTML = this.message.D;
			$('messenger_message_div').innerHTML = this.message.M;
			this.clear();
			$('messengerface2').style.backgroundImage = "url('avatar.php?figure="+this.message.C+"&direction=3&head_direction=3&action=std')";
			$('messenger_tab1').src = "images/messenger/"+texts["lang"]+"/1b.gif";
			ShowContent("messenger_text_11");
		}
	},
	answer : function () {
		if (this.messages.length > 0 && this.message != null) {
			this.clear();
			this.selected = this.message.FI;
			this.selectedinfo = { N : this.message.FN }
			this.startwrite();
			packets.send.delmessage(this.message.I);
			this.message = null;
			this.messages.shift();
			this.update(1);
		}
	},
	del_message : function () {
		if (this.messages.length > 0 && this.message != null) {
			packets.send.delmessage(this.message.I);
			this.message = null;
			this.messages.shift();
			this.update(1);
			this.thistab = 0;
			this.tab1();
			this.show_message();
		}
	},
	show_vv : function () {
		if (this.requests.length > 0) {
			this.request = this.requests[0];
			$('messenger_text_6_text').innerHTML = ucfirst(this.request.N)+"<br>"+texts["messenger_request_text"];
			this.clear();
			$('messenger_tab1').src = "images/messenger/"+texts["lang"]+"/1b.gif";
			ShowContent("messenger_text_6");
		}
	},
	search_vv : function () {
		if (this.addable) {
			this.addable = false;
			$('knop_21').className = 'knop_trans';
			$('messenger_text_5_text').innerHTML = this.searchfor+texts["messenger_request_sent"];
			this.clear();
			$('messenger_tab3').src = "images/messenger/"+texts["lang"]+"/3b.gif";
			ShowContent("messenger_text_5");
			packets.send.addbuddy(this.searchedid);
		}
	},
	answer_vv : function (answer) {
		if (this.requests.length > 0 && this.request != null) {
			packets.send.messengeranswerrequest(this.request.I, answer);
			this.request = null;
			this.requests.shift();
			this.update(1);
			this.thistab = 0;
			this.tab1();
			this.show_vv();
		}
	},
	messagereg : function () {
		var reg = new RegExp("<(.|\n)*?>");
  		$("messenger_send_message_text").value = $("messenger_send_message_text").value.replace(reg, "");
  		textCounter($('messenger_send_message_text'),216);
	},
	startwrite : function () {
		$("messenger_send_message_text").value = "";
		$('messenger_text_9_text').innerHTML = ucfirst(this.selectedinfo.N);
		HideContent("messenger_text_2");
		ShowContent("messenger_text_9");
		$("messenger_send_message_text").focus();
	},
	writefriend : function () {
		this.messagereg();
		var message = $("messenger_send_message_text").value;
		if (message != "") {
			packets.send.writemessage(this.selected, message);
			this.lasttab();
		}
	},
	startdelbuddy : function () {
		$('messenger_text_8_text').innerHTML = texts["messenger_ask_del1"]+"<br><br>"+ucfirst(this.selectedinfo.N)+"<br>"+texts["messenger_ask_del2"];
		HideContent("messenger_text_2");
		ShowContent("messenger_text_8");
	},
	friend_del : function () {
		packets.send.delbuddy(this.selected);
		messenger.thistab = 0;
		this.tab2();
	}
};