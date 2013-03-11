var login = {
	unreal : false,
	doing : false,
	try_name : "",
	try_pass : "",
	show : function () {
		if (login_direct == "ja") {
			$("login_naam").value = login_direct_name;
			$("login_wachtwoord").value = login_direct_pass;
			try_login();
		}
		if (readCookie('jabbo_sess') == "ja") {
			$("login_naam").value = readCookie('jabbo_name');
			$("login_wachtwoord").value = readCookie('jabbo_pass');
		}
		mainview.show();
		ShowContent("login_div");
		register.close_button();
		$("login_naam").focus();
		client.mode = "main";
		// cleaning up
		removechilds("loadview");
	},
	attempt : function () {
		this.try_name = $("login_naam").value.toLowerCase();
		this.try_pass = $("login_wachtwoord").value;
		if (this.try_name != "" && this.try_pass != "") {
			client.block();
			HideContent("knop_1");
			ShowContent("verbinden_img");
			login.doing = true;
			client.block();
			HideContent("knop_1");
			ShowContent("verbinden_img");
			if (mainview.animations_done) {
				login.go();
			}
			else {
				login.unreal = true;
			}
		}
		else {
			client.notify(texts["login_fill_both"]);
		}
	},
	go : function () {
		if (login.unreal) {
			login.unreal = false;
		}
		HideContent("register_box");
		packets.send.login(this.try_name, this.try_pass);
	},
	succes : function () {
		if (in_array("debug", user.rights)) {
			lib.load("debug");
		}
		user.name = $("login_naam").value.toLowerCase();
		user.pass = $("login_wachtwoord").value;
		this.try_name = "";
		this.try_pass = "";
		createCookie('jabbo_name', user.name, 0);
		createCookie('jabbo_pass', user.pass, 0);
		createCookie('jabbo_sess', 'ja', 0);
		register.close_button();
		furni.loaddb();
	},
	dbloaded : function () {
		$('welcome_jabbo_img').src = "avatar.php?figure="+user.clothes+"&action=wav&direction=3&head_direction=3";
		this.loadwindows();
	},
	loadwindows : function () {
		if (client.connection) {
			var req = ajaxCreate();
			req.open("GET", "windows.php?r="+Math.round(9000*Math.random()), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					$("windows_div").innerHTML = req.responseText;
					resize.resize();
					HideContent("login_hide");
					$("welcome_jabbo_text").innerHTML = texts["login_welcome"]+", "+ucfirst(user.name);
					ShowContent("welcome_jabbo");
					ShowContent("welcome_jabbo_text");
					client.logged_in();
					setTimeout(function(){client.logged_in2();}, 3000);
					client.unblock();
				}
			};
			req.send(null);
		}
	},
	error : function (errcode) {
		switch(errcode) {
			case "error":
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.unblock();
				client.exit2();
				client.notify(texts["login_fail"]);
				break;
			case "try":
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.unblock();
				client.exit2();
				client.notify(texts["login_max"]);
				break;
			case "mail":
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.notify(texts["login_mail"]);
				client.unblock();
				break;
			case "full":
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.notify(texts["login_full"]);
				client.unblock();
				break;
			case "ban":
				$("login_naam").value = "";
				$("login_wachtwoord").value = "";
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.notify(texts["login_ban"]);
				client.unblock();
				break;
			case "wrong":
				$("login_naam").value = "";
				$("login_wachtwoord").value = "";
				ShowContent("knop_1");
				HideContent("verbinden_img");
				client.notify(texts["login_wrong"]);
				client.unblock();
				break;
			default:
				debug.error("Unknown login errorcode.");
		}
		login.doing = false;
		ShowContent("register_box");
	}
};