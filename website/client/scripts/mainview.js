var mainview = {
	animations_done : false,
	show: function () {
		this.closewindows();
		ShowContent("backview");
		ShowContent("mainview_div");
		client.mode = "main";
		this.black._open();
	},
	showopen: function () {
		this.black.opened = false;
		this.closewindows();
		$('navigator').style.left = 585;
		$('navigator').style.top = 20;
		navi.open();
		ShowContent("backview");
		ShowContent("mainview_div");
		this.showtool();
		client.mode = "main";
		this.black._open();
	},
	showdirect: function () {
		this.black.opened = true;
		this.closewindows();
		$('navigator').style.left = 585;
		$('navigator').style.top = 20;
		navi.open();
		ShowContent("backview");
		ShowContent("mainview_div");
		this.showtool();
		client.mode = "main";
	},
	hide : function () {
		this.closewindows();
		HideContent("mainview_div");
		HideContent("backview");
	},
	closewindows : function () {
		if (user.logged_in) {
			HideContent("catalogue");
			HideContent("codes_layer");
			HideContent("askcamera");
			HideContent("camera");
			HideContent("picture");
			HideContent("donate_layer");
			chatbox.close();
			messenger.close();
			navi.close();
			matic.close();
			HideContent("help_layer");
		}
	},
	black :
	{
		opened : false,
		_open : function () {
			if (!mainview.black.opened) {
				mainview.animations_done = false;
				$('main_logo').style.top = -168;
				client.block();
				set_top("main_black_div");
				ShowContent("main_black_div");
				movecallback = this._opened();
				$('main_black_1').style.top = 0;
				$('main_black_2').style.top = Math.ceil((resize.height()/2));
				movelayer('main_black_1', 0, (Math.ceil((resize.height()/2)))-((Math.ceil((resize.height()/2)))*2), 30, 20, 0.8, movecallback);
				movelayer('main_black_2', 0, resize.height(), 30, 20, 0.8, false);
			}
		},
		_close : function () {
			if (mainview.black.opened) {
				mainview.animations_done = false;
				client.block();
				set_top("main_black_div");
				ShowContent("main_black_div");
				movecallback = this._closed();
				$('main_black_1').style.top = (Math.ceil((resize.height()/2)))-((Math.ceil((resize.height()/2)))*2);
				$('main_black_2').style.top = resize.height();
				movelayer('main_black_1', 0, 0, 30, 20, 0.8, movecallback);
				movelayer('main_black_2', 0, Math.ceil((resize.height()/2)), 30, 20, 0.8, false);
			}
		},
		_opened : function () {
			to_return = new Object();
			to_return.complete = function() {
				client.unblock();
				mainview.black.opened = true;
				HideContent("main_black_div");
				mainview.open_logo();
			}
			return to_return;
		},
		_closed : function () {
			to_return = new Object();
			to_return.complete = function() {
				mainview.animations_done = true;
				client.unblock();
				mainview.black.opened = false;
				room.go2(); // ga naar de kamers!
				//public.go2();
				mainview.hide();
				HideContent("main_black_div");
			}
			return to_return;
		}
	},
	open_logo : function () {
		mainview.animations_done = true;
		ShowContent("main_logo");
		movecallback = this.logo_opened();
		movelayer('main_logo', 0, 0, 10, 40, 0.5, movecallback);
	},
	logo_opened : function () {
		to_return = new Object();
		to_return.complete = function() {
			mainview.animations_done = true;
			if (!user.logged_in && login.unreal)
			{
				login.go();
			}
		}
		return to_return;
	},
	showtool : function () {
		$('toolbar_div').style.top = 55;
		movelayer('toolbar_div', 0, 0, 10, 20, 0.9, false);
	}
}