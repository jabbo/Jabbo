// CLIENT.JS
// main code for the client
var client = {
	sound : false, // sound support?
	connection : true, // still connection?
	still_going : true,
	z_top : 0, // hightest z-index of all divs
	active : true, // is the client still active? if the users doesn't click on anything for more than one minute, this becomes false
	mode : "main", // are we in the main view or in a room?
	init : function() {
		// fire up the client! everything starts here.
		ShowContent("preload_logo");
		resize.resize(); // do a resize to center the logo
		window.status = texts["client_title"]+" "+client_vers;
		open_script("preload.php?r="+Math.round(9000*Math.random())); // load preload images array
	},
	start : function () {
		// preload.php tells us to continue
		if(this.connection) {
			var req = ajaxCreate();
			req.open("GET", "prelogin.php?r="+Math.round(9000*Math.random()), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					$("prelogin_div").innerHTML = req.responseText;
					resize.resize();
					setTimeout(function(){var callback = client.loadlogo_gone(); fade_out('preload_logo', callback);},250);
				}
			};
			req.send(null);
		}
	},
	loadlogo_gone : function () {
		var output = new Object();
		output.complete = function() {
			// the logo has faded out, now preload the images after half a second
			ShowContent("loadview");
			HideContent("preload_logo");
			setTimeout(function(){preload.init();}, 500);
		};
		return output;
	},
	loadbar_gone : function () {
		var output = new Object();
		output.complete = function() {
			// the images are preloaded, try connecting to the server
			HideContent("loadview");
			packets.init();
		};
		return output;
	},
	allErr : function (message, url, line) {
		// there's a JavaScript error!
		if (stop_error) {
			client.error(message, line);
		}
		else {
			debug.error("Error: "+message+" on line "+line);
		}
		return true; // don't pass it on to the javascript console!
	},
	loaded : function () {
		this.z_top = (get_top_real()*1)+1;
		setInterval(function(){client.checks();}, 500);
		setTimeout(function(){var callback = client.loadbar_gone(); fade_out('loadview', callback);}, 250);
	},
	clicked : function () {
		last_active = tijdstip;
	},
	checks : function () {
		if (!this.connection && this.still_going) {
			// client is still going yet there's no connection -> show connection lost box! 
			this.still_going = false;
			room.leave();
			set_top("connection_lost_layer");
			ShowContent('connection_lost_layer');
			JabboServer.Stop();
		}
		if (this.connection) {
			if ((last_active+60) >= tijdstip) {
				if (this.active == false) {
					if (user.logged_in) {
						packets.send.activeagain();
						debug.yellow("Client is active again");
					}
					this.active = false;
				}
				this.active = true;
			}
			else {
				if (this.active == true) {
					if (user.logged_in) {
						packets.send.inactive();
						debug.yellow("Client is inactive");
					}
					this.active = false;
				}
			}
		}
	},
	notify : function (message, title) {
		// an alert box
		if (!title) {
			title = texts["notify_default"];
		}
		setTimeout(function(){add_alert(title, message);},0);
	},
	logged_in : function () {
		avatars.init();
		$("messenger_text_1_jouwnaam").innerHTML = ucfirst(user.name);
		$("messenger_mission").value = user.messenger;
		ShowContent("mainview_div");
		mainview.showtool();
	},
	logged_in2 : function () {
		login.doing = false;
		user.logged_in = true;
		packets.send.login_done();
		// first set logged_in to true, then handle all kinds of data
		
		$('yourface1').style.backgroundImage = "url('avatar.php?figure="+user.clothes+"&direction=3&head_direction=3&action=std')";
		$('yourface2').style.backgroundImage = "url('avatar.php?figure="+user.clothes+"&direction=3&head_direction=3&action=std')";
		catalogue.moneyupdate();
		
		setInterval(function(){room.chat.show_chat.move();}, 3000);
		setInterval(function(){navi.updateask();}, 60000); // elke minuut navigator update, als die geopend is
		
		// remove unneeded divs and classes
		HideContent("login_div");
		removechilds("login_div");
		removechilds("register");
		login = null;
		register = null;
		
		set_top("navigator"); // let navigator have the highest z-index
		ShowContent("navigator");
		navi.opened = true;
	},
	error : function (message, line) {
		var error = new Error(message);
		$("disconnected1").innerHTML = texts["client_error_title"];
		$("disconnected2").innerHTML = texts["client_error_message"]+"<br><b>"+error+" on line "+line+"</b>";
		this.connection = false;
	},
	exit : function () {
		room.leave();
		this.active = false;
		this.connection = false;
	},
	exit2 : function () {
		room.leave();
		HideContent("login_div");
		HideContent("mainview_div");
		HideContent("windows_div");
		this.active = false;
		this.connection = false;
	},
	block : function () {
		// block the client: set transparent div on top
		room.tiles.click = false; // make sure you can't hover tiles anymore
		set_top("block");
		ShowContent("block");
	},
	unblock : function () {
		if (client.mode != "main") {
			room.tiles.click = true;
		}
		HideContent("block");
	}	
};