var inv = {
	loaded : false,
	icon_posx : new Array(137,157,177,113,133,153,89,109,129),
	icon_posy : new Array(26,42,58,42,58,74,58,74,90),
	login_data : null, // array of furni that is sent upon server login, and is to be parsed only after PHP login
	page : 1,
	pages : 1,
	open : false,
	back_able : false,
	next_able : false,
	clear : function () {
		// function normally never to be used
		removechilds("tileinv"); // remove all furniture placed in inventory
		this.open = false; // set status to closed
	},
	prepare : function () {
		$('inventory').style.x = 730;
		$('inventory').style.y = 0;
		this.content('close');
		this.open = false; // set status to closed
	},
	opened : function () {
		output = {
			complete : function () {
				$("inventory").style.backgroundPosition = "0px 0px";
				ShowContent("inventory_back");
				ShowContent("inventory_next");
				ShowContent("inventory_close");
				inv.content('open');
			}
		};
		return output;
	},
	set : function (way) {
		switch(way) {
		case "reverse":
			if (this.open) {
				this.set("close");
			}
			else {
				this.set("open");
			}
			break;
		case "open":
			$("inventory").style.backgroundPosition = "-267px 0px";
			var movecallback = inv.opened();
			movelayer("inventory", resize.width()-267, 0, 10, 20, 0.5, movecallback);
			this.open = true;
			break;
		case "close":
			this.content('close');
			HideContent("inventory_back");
			HideContent("inventory_next");
			HideContent("inventory_close");
			$("inventory").style.backgroundPosition = "-267px 0px";
			movelayer("inventory", resize.width(), -162, 20, 20, 0.5, false);
			this.open = false;
			break;
		case "closeforce":
			this.content('close');
			HideContent("inventory_back");
			HideContent("inventory_next");
			HideContent("inventory_close");
			$("inventory").style.backgroundPosition = "-267px 0px";
			$("inventory").style.left = resize.width();
			$("inventory").style.top = "-162";
			this.open = false;
			break;
		}
	},
	content : function (way) {
		var inv_furni = new Array();
		var node = $("tileinv");
		var len = node.childNodes.length;
		for(var i = 0; i < len; i++) {
			if (node.childNodes[i]) {
				inv_furni.push(node.childNodes[i].id);
			}
		}
		this.pages = Math.ceil(inv_furni.length/9);
		if (this.pages == 0) {
			this.pages = 1;
		}
		var inv_content = new Array();
		var len = inv_furni.length;
		if (len <= 9) {
			for (i = 0; i < len; i++) {
				inv_content[i] = inv_furni[i];
			}
		}
		else {
			var end = this.page * 9;
			var start = end - 9;
			if (end > inv_furni.length) {
				end = inv_furni.length;
			}
			for (i = start; i < end; i++) {
				inv_content.push(inv_furni[i]);
			}
		}
		if (this.page > this.pages) {
			this.page--;
		}
		if (way == "open") {
			for (i = 0; i < inv_content.length; i++) {
				var this_furni = $(inv_content[i]);
				this_furni.style.left = resize.width()-this.icon_posx[i];
				this_furni.style.top = this.icon_posy[i];
				ShowContent(inv_content[i]);
			}
			if (this.pages > 1) {
				if (this.page != 1) {
					$('inventory_back').className = 'knop_solid';
					this.back_able = true;
				}
				else {
					$('inventory_back').className = 'knop_trans';
					this.back_able = false;
				}
				if (this.page != this.pages) {
					$('inventory_next').className = 'knop_solid';
					this.next_able = true;
				}
				else {
					$('inventory_next').className = 'knop_trans';
					this.next_able = false;
				}
			}
			else {
				$('inventory_back').className = 'knop_trans';
				$('inventory_next').className = 'knop_trans';
				this.back_able = this.next_able = false;
			}
		}
		else if (way == "close") {
			var len = inv_furni.length;
			for (i = 0; i < len; i++) {
				if (furni.obj != null) {
					if (inv_content[i] != furni.obj.id) {
						HideContent(inv_furni[i]);
					}
				}
				else {
					HideContent(inv_furni[i]);
				}
			}
		}
	},
	go_back: function () {
		if (this.back_able) {
			this.content('close');
			if (this.page != 1) {
				this.page--;
			}
			this.content('open');
		}
	},
	go_next : function () {
		if (this.next_able) {
			this.content('close');
			if (this.page != this.pages) {
				this.page++;
			}
			this.content('open');
		}
	}
};