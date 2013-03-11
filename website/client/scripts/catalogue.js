// CATALOGUE.JS
// shop code
var catalogue = {
	cats : null, // categories
	gowait : null,
	actief : null,
	init_done : false,
	loading : false,
	went : false,
	buy_cat : 0,
	buy_furni : "",
	buy_price : "",
	box_licht : 15,
	icons_active : { },
	newcat : null,
	addimg : null,
	aantal : null,
	blz : 0, // current page
	blz_amount : 0, // amound of pages
	layout2_pijl1 : 0,
	layout2_pijl2: 0,
	buy_mode : "",
	init : function () {
		if (!this.init_done && !this.loading) {
			this.create_boxes();
			if(client.connection) {
				var req = ajaxCreate();
				req.open("GET", "action.php?method=catinit&r="+Math.round(9000*Math.random()), true);
				req.onreadystatechange = function() {
					if (req.readyState == 4) {
						catalogue.cats = JSON.parse(req.responseText);
						catalogue.init2();
					}
				};
				req.send(null);
			}
		}
	},
	init2 : function () {
		if (!this.init_done && !this.loading) {
			var sidebar = "";
			var hoeveel = 0;
			sidebar += "<table border='0' cellpadding='0' cellspacing='0'>";
			var cats_length = this.cats.length;
			for (i = 0; i < cats_length; i++) {
				sidebar += "<tr><td colspan='3' height='1' style='background-color: #a0a0a4;'></td></tr>";
				sidebar += "<tr><td><img src='images/shop/links1.gif' id='srclinks_"+(i+1)+"'></td>";
				sidebar += "<td id='srccatknop_"+(i+1)+"' class='clientfont' onclick=\"catalogue.go('"+(i+1)+"');\" width='90' height='20' style='cursor: pointer; background-color: #dddddd; overflow: hidden;'>";
				sidebar += "<b>"+this.cats[i].name+"</b>";
				sidebar += "</td><td width='1' style='background-color: #a0a0a4;'></tr>";
				hoeveel++;
			}
			sidebar += "</table>";
			$("cat_sidebar_div").innerHTML = sidebar;
			this.actief = 0;
			this.init_done = true;
			debug.yellow(hoeveel+" categories loaded in Catalogue");
			if (this.gowait == "club") {
				club.gocat();
				this.gowait = null;
			}
			else {
				this.go(1);
			}
		}
	},
	create_boxes : function () {
		var container = $("catboxes");
		var count = 0;
		var vak_x = 21;
		var vak_y = 171;
		for (kolom = 0; kolom < 5; kolom++) {
			vak_x = 21;
			for (rij = 0; rij < 3; rij++) {
				
				var image = document.createElement("img");
				image.src = "images/shop/box1.gif";
				image.id = "box_"+count;
				image.style.position = "absolute";
				image.style.left = vak_x;
				image.style.top = vak_y;
				image.style.zIndex = 1;
				container.appendChild(image);
				
				var image = document.createElement("img");
				image.src = "images/shop/icon.gif";
				image.id = "icon_"+count;
				image.style.position = "absolute";
				image.style.left = vak_x;
				image.style.top = vak_y;
				image.style.zIndex = 2;
				image.count = count;
				addEvent(image, 'click', function() { catalogue.clickfurni(this.count); });
				container.appendChild(image);
				
				count++;
				vak_x += 39;
			}
			vak_y += 39;
		}
	},
	clear_icons : function () {
		for (i = 0; i < 15; i++) {
			$("icon_"+i).src = "images/shop/icon.gif";
			this.icons_active[i] = false;
		}
		if (this.box_licht != 15) {
			$("box_"+this.box_licht).src = "images/shop/box1.gif";
			this.box_licht = 15;
		}
		$("cat_layout2_pijl1").src = "images/shop/pijl1_1.gif";
		$("cat_layout2_pijl2").src = "images/shop/pijl2_1.gif";
	},
	clear_cat : function () {
		HideContent(["cat_frontpage", "cat_camera", "cat_club", "cat_market", "cat_presents", "cat_norares", "cat_productpage1", "cat_layout2", "cat_logo"]);
	},
	go : function (catid) {
		if (!this.loading && this.actief != catid && this.init_done) {
			var category = this.cats[(parseInt(catid)-1)];
			if (this.went) {
				$("srclinks_"+this.actief).src = "images/shop/links1.gif";
				$("srccatknop_"+this.actief).style.background = "rgb(221, 221, 221)";
			}
			$("srclinks_"+catid).src = "images/shop/links2.gif";
			$("srccatknop_"+catid).style.background = "rgb(240, 240, 240)";
			if(category.loaded) {
				this.buy_cat = 0;
				this.buy_furni = "";
				this.buy_price = 0;
				switch(category.layout) {
				case "frontpage":
					$("cat_front_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_front_wow").innerHTML = category.wow1;
					$("cat_front_img1").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_front_text1").innerHTML = category.desc;
					this.clear_cat();
					ShowContent("cat_frontpage");
					break;
				case "camera":
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_camera_img1").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_camera_text1").innerHTML = category.desc;
					$("cat_camera_text2").innerHTML = category.misc['t1'];
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_camera");
					this.buy_cat = category.id;
					this.buy_furni = furni.db[category.furnis[0]].furni;
					this.buy_price = category.prices[0];
					break;
				case "club":
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_club_img1").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_club_text").innerHTML = category.desc;
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_club");
					break;
				case "market":
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_market");
					break;
				case "presents":
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_presents_img1").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_presents_img2").src = "images/shop/shop_img/"+category.side[1]+".gif";
					$("cat_presents_text1").innerHTML = category.desc;
					$("cat_presents_text2").innerHTML = category.misc['t1'];
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_presents");
					break;
				case "norares":
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_norares_img").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_norares_text").innerHTML = category.desc;
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_norares");
					break;
				case "productpage1":
					if (category.furnis.length == 1) {
						HideContent("cat_productpage1_wow1_div");
						HideContent("cat_productpage1_wow2_div");
						$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
						$("cat_productpage1_desc").innerHTML = category.desc;
						var furni_data = furni.db[category.furnis[0]];
						var furni_price = category.prices[0];
						if (furni_price == 1) {
							var cr_text = texts["money1"];
						}
						else {
							var cr_text = texts["money2"];
						}
						$("cat_productpage1_text1").innerHTML = furni_data.name;
						$("cat_productpage1_text2").innerHTML = furni_data.descr;
						$("cat_productpage1_text3").innerHTML = furni_price+" "+cr_text;
						if (furni_data.afb != 1) {
							$("cat_productpage1_img").src = "images/furni/"+furni_data.furni+"/2.gif";
						}
						else {
							$("cat_productpage1_img").src = "images/furni/"+furni_data.furni+"/1.gif";
						}
						if (category.wow1 != "") {
							$("cat_productpage1_wow1").innerHTML = category.wow1;
							ShowContent("cat_productpage1_wow1_div");
						}
						if (category.wow2 != "") {
							$("cat_productpage1_wow2").innerHTML = category.wow2;
							ShowContent("cat_productpage1_wow2_div");
						}
						this.clear_cat();
						ShowContent("cat_logo");
						ShowContent("cat_productpage1");
						this.buy_cat = category.id;
						this.buy_furni = furni_data.furni;
						this.buy_price = furni_price;
					}
					break;
				case "layout2":
					$("cat_layout2_text1").innerHTML = "";
					$("cat_layout2_text3").innerHTML = "";
					HideContent("cat_productpage1_prijsvak");
					HideContent("knop_25");
					this.clear_icons();
					HideContent("cat_layout2_wow1");
					HideContent("cat_layout2_wow2");
					HideContent("cat_layout2_page");
					HideContent("cat_layout2_arrows");
					$("cat_layout2_page_text").innerHTML = "";
					$("cat_logo").src = "images/shop/shop_img/"+category.header+".gif";
					$("cat_layout2_desc").innerHTML = category.desc;
					$("cat_layout2_sideimg").src = "images/shop/shop_img/"+category.side[0]+".gif";
					$("cat_layout2_text2").innerHTML = category.details;
					this.aantal = category.furnis.length;
					this.blz = 1;
					var loopaf = this.aantal;
					if (this.aantal > 15) {
						loopaf = 15;
						this.blz_amount = Math.ceil(this.aantal/15);
						this.layout2_pijl1 = 0;
						$("cat_layout2_pijl1").src = "images/shop/pijl1_1.gif";
						if (this.blz_amount > 1) {
							this.layout2_pijl2 = 2;
							$("cat_layout2_pijl2").src = "images/shop/pijl2_2.gif";
						}
						else {
							this.layout2_pijl2 = 0;
							$("cat_layout2_pijl2").src = "images/shop/pijl2_2.gif";
						}
						$("cat_layout2_page_text").innerHTML = "1/"+this.blz_amount;
						ShowContent("cat_layout2_page");
						ShowContent("cat_layout2_arrows");
					}
					for (i = 0; i < loopaf; i++) {
						$("icon_"+i).src = "images/furni/"+category.furnis[i]+"/icon.gif";
						this.icons_active[i] = true;
					}
					if (category.wow1 != "") {
						$("cat_layout2_wow1_text").innerHTML = category.wow1;
						ShowContent("cat_layout2_wow1");
					}
					if (category.wow2 != "") {
						$("cat_layout2_wow2_text").innerHTML = category.wow2;
						ShowContent("cat_layout2_wow2");
					}
					this.clear_cat();
					ShowContent("cat_logo");
					ShowContent("cat_layout2");
					break;
				default:
					debug.error("Error loading catalogue page: unknown type");
					client.notify(texts["cat_loadfail"], texts["notify_error"]);
					this.unload();
				}
				this.went = true;
				this.actief = catid;
			}
			else {
				ShowContent("cat_load_div");
				this.loading = true;
				this.newcat = catid;
				get_script("action.php?method=catload&id="+category.id+"&putin="+(parseInt(catid)-1)+"&r="+Math.round(9000*Math.random()));
			}
		}
	},
	load2 : function () {
		if (this.loading) {
			var preload_furni = new Array();
			var len = this.cats[(parseInt(this.newcat)-1)]['furnis'].length;
			for (i = 0; i < len; i++) {
				preload_furni.push(this.cats[(parseInt(this.newcat)-1)].furnis[i]);
			}
			var callback = catalogue.load3();
			furni.manager.load(preload_furni, this.addimg, callback);
		}
	},
	load3 : function () {
		var output = new Object();
		output.complete = function() {
			if (catalogue.loading) {
				if (!furni.manager.errors) {
					catalogue.loading = false;
					catalogue.cats[(parseInt(catalogue.newcat)-1)].loaded = true;
					HideContent("cat_load_div");
					catalogue.go(catalogue.newcat);
				}
				else {
					catalogue.unload();
					client.notify(texts["cat_nosuchfurni"], texts["notify_error"]);
				}
			}
		};
		return output;
	},
	unload : function () {
		HideContent("cat_load_div");
		this.loading = false;
		if (this.went) {
			$("srclinks_"+this.actief).src = "images/shop/links2.gif";
			$("srccatknop_"+this.actief).style.background = "rgb(240, 240, 240)";
		}
		$("srclinks_"+this.newcat).src = "images/shop/links1.gif";
		$("srccatknop_"+this.newcat).style.background = "rgb(221, 221, 221)";
	},
	moneyupdate : function () {
		if (user.logged_in) {
			if (user.money == 1) {
				var aanhangsel1 = texts["money1"];
			}
			else {
				var aanhangsel1 = texts["money2"];
			}
			if (user.sessionearned == 1) {
				var aanhangsel2 = texts["money1"];
			}
			else {
				var aanhangsel2 = texts["money2"];
			}
			$("purse_text1").innerHTML = texts["catalogue_youHave"]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size='4' color='#eeeeee'>"+user.money+"</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+aanhangsel1;
			$("purse_text2").innerHTML = texts["catalogue_youHave"]+"&nbsp;&nbsp;"+user.money+"&nbsp;&nbsp;"+aanhangsel1;
			$("purse_text3").innerHTML = texts["catalogue_earned1"]+"&nbsp;&nbsp;"+user.sessionearned+"&nbsp;&nbsp;"+aanhangsel2+" "+texts["catalogue_earned2"];
		}
	},
	clickfurni : function (vak_nr) {
		if (this.icons_active[vak_nr]) {
			var lijstnr = ((this.blz-1)*15)+vak_nr;
			var furni_data = furni.db[this.cats[(parseInt(this.actief)-1)].furnis[lijstnr]];
			var furni_price = this.cats[(parseInt(this.actief)-1)].prices[lijstnr];
			
			if (this.box_licht != vak_nr) {
				if (this.box_licht != 15) {
					$("box_"+this.box_licht).src = "images/shop/box1.gif";
				}
				this.box_licht = vak_nr;
				$("box_"+vak_nr).src = "images/shop/box2.gif";
			}
			if (furni_price == 1) {
				var cr_text = texts["money1"];
			}
			else {
				var cr_text = texts["money2"];
			}
			if (furni_data.afb != 1) {
				$("cat_layout2_sideimg").src = "images/furni/"+furni_data.furni+"/2.gif";
			}
			else {
				$("cat_layout2_sideimg").src = "images/furni/"+furni_data.furni+"/1.gif";
			}
			$("cat_layout2_text1").innerHTML = furni_data.name;
			$("cat_layout2_text2").innerHTML = furni_data.descr;
			$("cat_layout2_text3").innerHTML = furni_price+" "+cr_text;
			HideContent("cat_layout2_wow1");
			HideContent("cat_layout2_wow2");
			ShowContent("cat_productpage1_prijsvak");
			ShowContent("knop_25");
			this.buy_cat = this.cats[(parseInt(this.actief)-1)].id;
			this.buy_furni = furni_data.furni;
			this.buy_price = furni_price;
		}
	},
	show_blz : function (blz) {
		if (blz != 0) {
			this.blz = blz;
			this.clear_icons();
			if (this.blz == 1) {
				this.layout2_pijl1 = 0;
				$("cat_layout2_pijl1").src = "images/shop/pijl1_1.gif";
			}
			else {
				this.layout2_pijl1 = this.blz-1;
				$("cat_layout2_pijl1").src = "images/shop/pijl1_2.gif";
			}
			if (this.blz != this.blz_amount) {
				this.layout2_pijl2 = this.blz+1;
				$("cat_layout2_pijl2").src = "images/shop/pijl2_2.gif";
			}
			else {
				this.layout2_pijl2 = 0;
				$("cat_layout2_pijl2").src = "images/shop/pijl2_1.gif";
			}
			$("cat_layout2_page_text").innerHTML = this.blz+"/"+this.blz_amount;
			var tot_item = this.blz*15;
			var van_item = tot_item-15;
			if (tot_item > this.aantal) {
				tot_item = this.aantal;
			}
			for (i = van_item; i < tot_item; i++) {
				$("icon_"+(i-van_item)).src = "images/furni/"+this.cats[(parseInt(this.actief)-1)].furnis[i]+"/icon.gif";
				this.icons_active[(i-van_item)] = true;
			}
		}
	},
	buy : function () {
		var buy_name = furni.db[this.buy_furni].name;
		if (user.money >= this.buy_price) {
			if (this.buy_price == 1) {
				var cr_text1 = texts["money1"];
			}
			else {
				var cr_text1 = texts["money2"];
			}
			if (user.money == 1) {
				var cr_text2 = texts["money1"];
			}
			else {
				var cr_text2 = texts["money2"];
			}
			this.buy_mode = "self";
			$("koop_aantal").disabled = false;
			$("kado_voorwie").value = '';
			$("kado_text").value = '';
			ShowContent("koop_aantal_div");
			$("koop_aantal").value = '1';
			ShowContent("knop_4");
			ShowContent("knop_6");
			HideContent("koop2_layer");
			HideContent("koop2_prijs");
			HideContent("koop2_jouwgeld");
			HideContent("koop2_kado");
			HideContent("kado_voorwie_layer");
			HideContent("kado_text_layer");
			ShowContent("koop1_prijs");
			ShowContent("koop1_jouwgeld");
			ShowContent("koop1_kado");
			$("koop1_prijs").innerHTML = "<b>"+buy_name+" "+texts["catalogue_costs"]+" "+this.buy_price+" "+cr_text1+"</b>";
			$("koop1_jouwgeld").innerHTML = texts["catalogue_yourMoney1"]+" "+user.money+" "+cr_text2+" "+texts["catalogue_yourMoney2"];
			$("koop1_kado").innerHTML = "<img src='images/shop/kruisje1.gif' align='bottom' onclick='catalogue.buy_present();'> "+texts["catalogue_buyAsPresent"];
			$("koop2_prijs").innerHTML = "<b>"+buy_name+" kost "+this.buy_price+" "+cr_text1+"</b>";
			$("koop2_jouwgeld").innerHTML = texts["catalogue_yourMoney1"]+" "+user.money+" "+cr_text2+" "+texts["catalogue_yourMoney2"];
			$("koop2_kado").innerHTML = "<img src='images/shop/kruisje2.gif' align='bottom' onclick='catalogue.buy_self();'>";
			setTimeout(function(){set_top('kopen'); ShowContent('kopen');},1)
		}
		else {
			if (this.buy_price == 1) {
				var cr_text = texts["money1"];
			}
			else {
				var cr_text = texts["money2"];
			}
			client.notify("<b>'"+buy_name+"' "+texts["catalogue_costs"]+" "+this.buy_price+" "+cr_text+"</b><br><br>"+texts["buy_poor"]);
		}
	},
	buy_stop : function () {
		HideContent("koop_aantal_div");
		HideContent("knop_4");
		HideContent("knop_6");
		HideContent("koop2_layer");
		HideContent("koop2_prijs");
		HideContent("koop2_jouwgeld");
		HideContent("koop2_kado");
		HideContent("kado_voorwie_layer");
		HideContent("kado_text_layer");
		HideContent("koop1_prijs");
		HideContent("koop1_jouwgeld");
		HideContent("koop1_kado");
		HideContent('kopen');
	},
	buy_present : function () {
		this.buy_mode = 'present';
		$("koop_aantal").value = '1';
		$("koop_aantal").disabled = true;
		ShowContent("koop2_layer");
		ShowContent("koop2_prijs");
		ShowContent("koop2_jouwgeld");
		ShowContent("koop2_kado");
		ShowContent("kado_voorwie_layer");
		ShowContent("kado_text_layer");
		HideContent("koop1_prijs");
		HideContent("koop1_jouwgeld");
		HideContent("koop1_kado");
	},
	buy_self : function () {
		koop_modus = 'self';
		$("koop_aantal").disabled = false;
		HideContent("koop2_layer");
		HideContent("koop2_prijs");
		HideContent("koop2_jouwgeld");
		HideContent("koop2_kado");
		HideContent("kado_voorwie_layer");
		HideContent("kado_text_layer");
		ShowContent("koop1_prijs");
		ShowContent("koop1_jouwgeld");
		ShowContent("koop1_kado");
	},
	buy_amount : function () {
		if (this.buy_mode == "present") {
			$("koop_aantal").value = '1';
		}
		else {
			$("koop_aantal").value = parseInt($("koop_aantal").value);
		}
		if ($("koop_aantal").value <= 0 || $("koop_aantal").value == "NaN")
		{
			$("koop_aantal").value = '1';
		}
	},
	buy_ok : function () {
		if (user.money >= (this.buy_price*parseInt($("koop_aantal").value))) {
			packets.send.buyfurni(this.buy_cat, this.buy_furni, $("koop_aantal").value, this.buy_mode, $("kado_voorwie").value, $("kado_text").value)
			this.buy_stop();
		}
		else {
			if (this.buy_price == 1) {
				var cr_text = texts["money1"];
			}
			else {
				var cr_text = texts["money2"];
			}
			if (parseInt($("koop_aantal").value) > 1) {
				var amount_text = " X "+parseInt($("koop_aantal").value);
			}
			else {
				var amount_text = "";
			}
			client.notify("<b>'"+furni.db[this.buy_furni].name+"'"+amount_text+" "+texts["catalogue_costs"]+" "+(this.buy_price*parseInt($("koop_aantal").value))+" "+cr_text+"</b><br><br>"+texts["buy_poor"]);
			$("koop_aantal").value = Math.floor(user.money/this.buy_price);
		}
	},
	buyanswer : function (answer) {
		switch(answer) 
		{
		case "ok":
			client.notify(texts["catalogue_itsyours"]);
			if (client.sound) {
				soundManager.play("buy");
			}
			break;
		case "price":
			if (this.buy_furni != "") {
				if (this.buy_price == 1) {
					var cr_text = texts["money1"];
				}
				else {
					var cr_text = texts["money2"];
				}
				if (parseInt($("koop_aantal").value) > 1) {
					var amount_text = " X "+parseInt($("koop_aantal").value);
				}
				else {
					var amount_text = "";
				}
				client.notify("<b>'"+furni.db[this.buy_furni].name+"'"+amount_text+" "+texts["catalogue_costs"]+" "+(this.buy_price*parseInt($("koop_aantal").value))+" "+cr_text+"</b><br><br>"+texts["buy_poor"]);
			}
			break;
		case "error":
			client.notify(texts["buy_error"]);
			break;
		default:
			debug.error("Unknown buying furniture answer.");
			client.notify(texts["buy_error"]);
		break;
		}
	}
}
var crcodes = {
	show : function () {
		HideContent("cr_code_checking");
		$("cr_code_input").value = "";
		setTimeout(function(){set_top('codes_layer'); ShowContent('codes_layer'); $('cr_code_input').focus();},1)
	},
	check : function () {
		var code_try = $("cr_code_input").value;
		if (code_try != "") {
			ShowContent("cr_code_checking");
			$("cr_code_toptext").innerHTML = texts["crcode_wait"];
			$("trashtext").focus();
			packets.send.coupon(code_try);
		}
	},
	checkedok : function () {
		$("cr_code_toptext").innerHTML = texts["crcode_enter"];
		$("cr_code_input").value = "";
		HideContent("cr_code_checking");
		HideContent("codes_layer");
		$("trashtext").focus();
	},
	checkedbad : function (error) {
		client.notify(error);
		$("cr_code_toptext").innerHTML = texts["crcode_enter"];
		$("cr_code_input").value = "";
		HideContent("cr_code_checking");
		$('cr_code_input').focus();
	}
}