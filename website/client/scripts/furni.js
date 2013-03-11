var furni = {
	db : null, // data of all furni types
	data : null, // data of furni in room
	obj : null, // object that is being dragged
	dragimg : null,
	put_down : false, // is the object ready to be put down?
	drop : false, // can object be placed on this tile?
	tile_map : null,
	stack_map : null,
	loaddb : function () {
		if (client.connection) {
			var req = ajaxCreate();
			req.open("GET", "action.php?method=loadfurni&r="+Math.round(9000*Math.random()), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					if (req.responseText != "") {
						var answer = JSON.parse(req.responseText);
						furni.db = answer[0];
						furni.manager.stats_total = answer[1];
						debug.yellow("Loaded info of "+answer[1]+" pieces of furniture");
						login.dbloaded();
					}
					else {
						login.error('error');
					}
				}
			};
			req.send(null);
		}
	},
	manager : {
		errors : false,
		stats_loaded : 0,
		stats_total : 0,
		img_loaded : null,
		img_preload : null,
		img_count : null,
		preload : null,
		callback : null,
		amount : 0,
		amount2 : 0,
		check : function () {
			var yes = 0;
			
			var len = furni.db.length;
			var count = 0;
			for(x in furni.db) {
				count++;
				if (furni.db[x].loaded) {
					yes++;
				}
			}
			this.stats_loaded = yes;
			this.stats_total = count;
			debug.yellow("Furniture manager counted: "+yes+" of "+count+" pieces preloaded.");
		},
		load : function (toload, addimg, callback) {
			// usage : you can call addimg and callback false
			
			var imgtoload = new Array();
			this.errors = false;
			this.img_loaded = new Array();
			this.img_preload = new Array()
			this.img_count = 0;
			this.callback = callback;
			this.amount = toload.length;
			if (addimg) {
				this.amount2 = addimg.length;
			}
			else {
				this.amount2 = 0;
			}
			
			var toload_length = toload.length;
			for (i = 0; i < toload_length; i++) {
				if (isset(furni.db[toload[i]])) {
					if (!furni.db[toload[i]].loaded) {
						if (furni.db[toload[i]].afb == 1) {
							if (furni.db[toload[i]].action == 1) {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
								imgtoload.push("images/furni/"+toload[i]+"/1b.gif");
							}
							else {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
							}
						}
						else if (furni.db[toload[i]].afb > 2) {
							if (furni.db[toload[i]].action == 1) {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2.gif");
								imgtoload.push("images/furni/"+toload[i]+"/3.gif");
								imgtoload.push("images/furni/"+toload[i]+"/4.gif");
								imgtoload.push("images/furni/"+toload[i]+"/1b.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2b.gif");
								imgtoload.push("images/furni/"+toload[i]+"/3b.gif");
								imgtoload.push("images/furni/"+toload[i]+"/4b.gif");
							}
							else {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2.gif");
								imgtoload.push("images/furni/"+toload[i]+"/3.gif");
								imgtoload.push("images/furni/"+toload[i]+"/4.gif");
							}
						}
						else {
							if (furni.db[toload[i]].action == 1) {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2.gif");
								imgtoload.push("images/furni/"+toload[i]+"/1b.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2b.gif");
							}
							else {
								imgtoload.push("images/furni/"+toload[i]+"/1.gif");
								imgtoload.push("images/furni/"+toload[i]+"/2.gif");
							}
						}
						imgtoload.push("images/furni/"+toload[i]+"/icon.gif");
						furni.db[toload[i]].loaded = true;
					}
				}
				else {
					debug.error("Furni manager failed to load '"+toload[i]+"'");
					this.amount--;
					this.errors = true;
				}
			}
			
			if (addimg) {
				var addimg_length = addimg.length;
				for (i = 0; i < addimg_length; i++) {
					imgtoload.push(addimg[i]);
				}
			}
			
			var imgtoload_length = imgtoload.length;
			for (i = 0; i < imgtoload_length; i++) {
				this.img_preload[i] = document.createElement('img');
		        this.img_preload[i].setAttribute('src', imgtoload[i]);
			}
			var img_preload_length = this.img_preload.length;
			for (i = 0; i < img_preload_length; i++) {
				this.img_loaded[i] = false;
			}
			this.check_load();
		},
		check_load : function () {
			if (this.img_count == this.img_preload.length) {
				this.loaded();
				return;
			}
			var img_preload_length = this.img_preload.length;
			for (i = 0; i <= img_preload_length; i++) {
				if (this.img_loaded[i] == false && this.img_preload[i].complete) {
					this.img_loaded[i] = true;
					this.img_count++;
				}
			}
			setTimeout(function(){furni.manager.check_load();},10);
		},
		loaded : function () {
			this.stats_loaded = this.stats_loaded + this.amount;
			debug.yellow("Furniture manager preloaded "+this.amount+" new piece(s) + "+this.amount2+" additional image(s), "+this.stats_loaded+"/"+this.stats_total+" loaded");
			this.callback.complete();
		}
	},
	init : function () {
		// intialise and show furniture
		this.obj = null;
		this.dragimg = null;
		var preload_furni = new Array();
		
		var len = this.data.length;
		var count = 0;
		
		for(x in this.data) {
			if(count >= len) break;
			else {
				count++;
				preload_furni.push(this.data[x].F);
			}
		}
		// laadt ook de deuren, die door PHP GD gegenereerd moeten worden
		var preload_images = new Array("images/rooms/door.php?door=1&wall="+room.data.wall+"&mode="+room.data.mode+"&img=1", "images/rooms/door.php?door=1&wall="+room.data.wall+"&mode="+room.data.mode+"&img=2", "images/rooms/door.php?door=2&wall="+room.data.wall+"&mode="+room.data.mode+"&img=1", "images/rooms/door.php?door=2&wall="+room.data.wall+"&mode="+room.data.mode+"&img=2");
		var callback = furni.init2();
		furni.manager.load(preload_furni, preload_images, callback); // preload furniture
	},
	init2 : function () {
		var output = new Object();
		output.complete = function() {
			var len = furni.data.length;
			var count = 0;
			
			for(x in furni.data) {
				if(count >= len) break;
				else {
					count++;
					furni.add(furni.data[x], false);
				}
			}
			debug.green("Room furniture data parsed.");
			furni.heightmaps(); // set heightmaps, after furni init
			room.loadedclient = true;
			room.loaded();
		};
		return output;
	},
	inv : function () {
		if (!inv.loaded) {
			// preload inventory login data
			this.obj = null;
			this.dragimg = null;
			var preload_furni = new Array();
			
			var len = inv.login_data.length;
			var count = 0;
			
			for(x in inv.login_data) {
				if(count >= len) break;
				else {
					count++;
					preload_furni.push(inv.login_data[x].F);
				}
			}
			var callback = furni.inv2();
			furni.manager.load(preload_furni, false, callback); // preload furniture
		}
		else {
			furni.inv2().complete();
		}
	},
	inv2 : function () {
		// add inventory login data
		var output = new Object();
		output.complete = function() {
			if (!inv.loaded) {
				var len = inv.login_data.length;
				var count = 0;
				
				for(x in inv.login_data) {
					if(count >= len) break;
					else {
						count++;
						furni.add(inv.login_data[x], false);
					}
				}
				inv.login_data = null;
				inv.loaded = true;
				debug.green("Inventory login data parsed.");
				furni.init();
			}
			else {
				furni.init();
			}
		};
		return output;
	},
	getpos : function (furniname, turn, action, tile) {
		var info = this.db[furniname];
		if (info.soort != "poster") {
			var x = room.tiles.posx[tile];
			var y = room.tiles.posy[tile];
			tile = tile.split(/_/);
			x += parseInt(info.change_x);
			y += parseInt(info.change_y);
			if (turn == 1 || turn == 3) {
				y -= Math.floor(((parseInt(info.lang)/2)-0.5)*33);
				y += Math.floor(((parseInt(info.breed)/2)-0.5)*33);
			}
			if (turn == 3 || turn == 4) {
				x += parseInt(info.turn_x);
				y += parseInt(info.turn_y);
			}
			if (action == 1) {
				if (turn == 2) {
					x += parseInt(info.action_x);
				}
				y += parseInt(info.action_y);
			}
		}
		else {
			var x = room.start_x+parseInt(tile.split("|")[0]);
			var y =  room.start_y+parseInt(tile.split("|")[1]);
			if (action == 1) {
				if (turn == 2) {
					x += parseInt(info.action_x);
				}
				y += parseInt(info.action_y);
			}
		}
		return [x,y];
	},
	checkmuur : function (posx, posy, startx, starty, endx, endy, uitvoertype) {
		if (uitvoertype == 1) {
			if (posx >= startx && posx <= endx && posy >= starty && posy <= endy) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			if (posx >= startx && posx <= endx) {
				return true;
			}
			else {
				return false;
			}
		}
	},
	checkmuren : function (posx, posy, uitvoertype) {
		var to_return = false;
	    var to_return2 = 1;
	    
		var len = room.walls.turn.length;
		for (i = 0; i < len; i++) {
			if (this.checkmuur(posx, posy, room.walls.startx[i], room.walls.starty[i], room.walls.endx[i], room.walls.endy[i], uitvoertype)) {
				to_return = true;
				to_return2 = room.walls.turn[i];
			}
		}
		if (uitvoertype == 1) {
			return to_return;
		}
		else {
			return to_return2;
		}	
	},
	packet : function (data) {
		
		/* preload images first, add to furnimanager etc
		var image = new Image();
image.src = 'image.jpg';
image.onload = function() {
// sometimes called
alert('image loaded');
};
*/
		var furninode = $("furni_"+data.I);
		if (client.mode != "main") {
			var handrefresh = false;
			var pagerefresh = false;
			var newfurni = false;
			if (data.T == "inv") {
				handrefresh = true;
				pagerefresh = true;
				if (!furninode) {
					newfurni = true;
					this.add(data, false);
				}
				else {
					// weghalen uit kamer, in de hand zetten
					furninode.tile = data.T;
					furninode.style.zIndex = parseInt(data.S);
					furninode.tile = data.T;
					furninode.turn = data.H;
					furninode.action = data.A;
					$("tile"+data.T).appendChild(furninode);
					HideContent("furni_"+data.I);
					this.to_icon(data.I, true); // true: force update
					furni.click(""); // item zit nu in hand, podium leegmaken
				}
			}
			else {
				// place in room
				if (!furninode) {
					this.add(data, true); // true: animation
				}
				else {
					// it's in the room already, just move it please!
					if (furninode.tile == "inv") {
						handrefresh = true;
					}
					if (this.db[data.F].soort != "poster") {
						var pos = this.getpos(data.F, data.H, data.A, data.T);
					}
					else {
						var pos = this.getpos(data.F, data.H, data.A, data.T);
						data.T = "0_0";
					}
					furninode.style.left = pos[0];
					furninode.style.top = pos[1];
					furninode.tile = data.T;
					furninode.turn = data.H;
					furninode.action = data.A;
					if (this.db[data.F].soort != "tapijt") {
						furninode.style.zIndex = parseInt(data.S);
						$("tile"+data.T).appendChild(furninode);
					}
					else {
						if (data.T != "inv") {
							furninode.style.zIndex = parseInt(data.T.split(/_/)[0])+parseInt(data.T.split(/_/)[1]);
							$("tile0_0").appendChild(furninode);
						}
						else {
							furninode.style.zIndex = parseInt(data.S);
							$("tile"+data.T).appendChild(furninode);
						}
					}
					this.to_furni(data.I, true); // true: force update
				}
			}
			if (handrefresh) {
				if (pagerefresh) {
					inv.page = Math.ceil($("tileinv").childNodes.length/9);
				}
				if (inv.open) {
					inv.content("close");
					inv.content("open");
				}
				else {
					inv.set("open");
				}
			}
			this.heightmaps();
		}
		else {
			if (data.T == "inv") {
				// gewoon toevoegen aan hand, we zitten in het hoteloverzicht
				this.add(data, false);
			}
		}
	},
	add : function (data, animation) {
		// add a piece of furniture
		
		var data = { // conversions
			id : data.I,
			tile : data.T,
			stacknr : data.S,
			stackheight : data.SH,
			turn : data.H,
			action : data.A,
			furni : data.F
		};
		
		if (isset(this.db[data.furni])) {
			var info = this.db[data.furni];
			var image = "";
			
			var turnshow = data.turn;
			if (info.soort == "stoel" && info.afb == 1) {
				turnshow = 1;
			}
			if (data.action == 1) {
				image = "images/furni/"+data.furni+"/"+turnshow+"b.gif";
			}
			else {
				image = "images/furni/"+data.furni+"/"+turnshow+".gif";
			}
			if (data.tile == "inv") {
				image = "images/furni/"+data.furni+"/icon.gif";
				var pos = [0,0];
			}
			else {
				if (info.soort != "poster") {
					var pos = this.getpos(data.furni, data.turn, data.action, data.tile);
				}
				else {
					var pos = this.getpos(data.furni, data.turn, data.action, data.tile);
					data.tile = "0_0";
				}
			}
			
			var obj = document.createElement("img");
			obj.id = "furni_"+data.id;
			obj.db = data.id;
			obj.tile = data.tile;
			obj.stacknr = data.stacknr;
			obj.stackheight = data.stackheight;
			obj.turn = data.turn;
			obj.action = data.action;
			obj.furni = data.furni;
			obj.style.left = pos[0];
			obj.style.top = pos[1];
			obj.src = image;
			obj.style.position = "absolute";
			obj.className = "item_solid";
			if (data.tile == "inv") {
				obj.imgstate = false; // true = furniture / false = icon
				obj.style.display = "none";
			}
			else {
				obj.imgstate = true; // true = furniture / false = icon
			}
			if (animation) {
				obj.style.display = "none";
			}
			addEvent(obj, 'mousedown', function() { furni.click(data.id); });
			if (info.action == 1) {
		    	addEvent(obj, 'dblclick', function() { furni.action(data.id); });
			}
			//$("tile"+data.tile).insertBefore(obj, $("tile"+data.tile).firstChild);
			if (info.soort != "tapijt") {
				obj.style.zIndex = parseInt(data.stacknr);
				$("tile"+data.tile).appendChild(obj);
			}
			else {
				if (data.tile != "inv") {
					obj.style.zIndex = parseInt(data.tile.split(/_/)[0])+parseInt(data.tile.split(/_/)[1]);
					$("tile0_0").appendChild(obj);
				}
				else {
					obj.style.zIndex = parseInt(data.stacknr);
					$("tile"+data.tile).appendChild(obj);
				}
			}
			if (animation) {
				animate.drop.start("furni_"+data.id, pos[0], pos[1]);
				ShowContent("furni_"+data.id);
			}
		}
		else {
			debug.error("Couldn't load furniture: '"+data.furni+"'");
		}
	},
	remove : function (id) {
		var furninode = $("furni_"+id);
		if (furninode) {
			furninode.parentNode.removeChild(furninode);
		}
		if (this.obj != null) {
			if (this.obj.db == id) {
				removechilds("dragfurni");
				this.obj = null;
				this.dragimg = null;
				this.click("");
			}
		}
	},
	click : function (id) {
		if (this.obj == null) {
			avatars.clicked = 0;
			if (id != "") {
				var furni = $("furni_"+id);
				var info = this.db[furni.furni];
				var info_show = true;
				
				if (furni.tile == "inv") {
					if (info.soort == "camera") {
						camera.camid = id;
						set_top("askcamera");
						ShowContent("askcamera");
						object_center("askcamera");
					}
					else {
						this.dragstart(id);
					}
					info_show = false;
				}
				else {
					if (ctrl_status) {
						if (info.soort != "poster") {
							this.turn(id);
							info_show = false;
						}
					}
					if (alt_status) {
						if (info.soort != "poster") {
							this.dragstart(id);
							info_show = false;
						}
					}
				}
				if (info_show) {
					if (furni.furni == "picture") {
						camera.showpicture(id);
						
					}
					ShowContent("infoshade");
					$('infotext').innerHTML = info.name;
					$('infodesc').innerHTML = info.descr;
					$('infoicon').src = "images/furni/"+furni.furni+"/icon.gif";
					$('infopop').style.backgroundImage = "url('images/blank.gif')";
					$('infobadge').src = 'images/blank.gif';
					$('buttons').innerHTML = "";
					if (room.data.rights) {
						if (info.soort != "poster") {
							$('buttons').innerHTML += '<div onclick="furni.dragstart(\''+id+'\')" onmousedown="room.button_down(this, \'move\')" onmouseup="room.button_up(this, \'move\')" style="width: 84px; background-image:url(\'images/rooms/move.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
							if (this.turncheck(id)) {
								$('buttons').innerHTML += '<div onclick="furni.turn(\''+id+'\')" onmousedown="room.button_down(this, \'turn\')" onmouseup="room.button_up(this, \'turn\')" style="width: 69px; background-image:url(\'images/rooms/turn.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
							}
						}
						if (room.data.owner == user.id || in_array("always_pickup", user.rights)) {
							$('buttons').innerHTML += '<div onclick="furni.pickup(\''+id+'\')" onmousedown="room.button_down(this, \'pickup\')" onmouseup="room.button_up(this, \'pickup\')" style="width: 66px; background-image:url(\'images/rooms/pickup.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
						}
						if (in_array("config_furni", user.rights)) {
							$('buttons').innerHTML += '<div onclick="room.furnitools('+id+')" onmousedown="room.button_down(this, \'config\')" onmouseup="room.button_up(this, \'config\')" style="width: 64px; background-image:url(\'images/rooms/config.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
						}
					}
				}
			}
			else {
				HideContent("infoshade");
				$('infotext').innerHTML = "";
				$('infodesc').innerHTML = "";
				$('infoicon').src = 'images/blank.gif';
				$('infopop').style.backgroundImage = "url('images/blank.gif')";
				$('infobadge').src = 'images/blank.gif';
				$('buttons').innerHTML = "";
			}
		}
	},
	dragstart : function (id) {
		if (room.data.rights && client.mode == "room") {
			this.obj = $("furni_"+id);
			this.put_down = false;
			if (this.obj.tile != "inv") {
				this.obj.className = "item_trans";
			}
			else {
				HideContent(this.obj.id);
			}
			var dragimg = document.createElement("img");
			dragimg.id = "dragimg";
			dragimg.src = this.obj.src;
			dragimg.style.position = "absolute";
			dragimg.style.left = this.obj.style.left;
			dragimg.style.top = this.obj.style.top;
			dragimg.style.zIndex = ((get_top())*1)+1;
			dragimg.style.className = "item_trans2";
			dragimg.imgstate = this.obj.imgstate;
			removechilds("dragfurni");
			$("dragfurni").appendChild(dragimg);
			this.dragimg = $("dragimg");
			this.drop = false;
			setTimeout(function(){furni.put_down = true;},100);
		}
		return false;
	},
	move : function (posx, posy) {
		if (this.obj != null && client.mode == "room") {
			// move furniture!
			var info = this.db[this.obj.furni];
			var changepos = true;
			var imgstate = this.dragimg.imgstate; // to determine whether the object should become an icon or furni image
			if (inv.open) {
				if (posx <= resize.width() && posy <= 162 && posx >= resize.width()-267 && posy >= 0) {
					var handstatus = true;
					imgstate = false;
					this.dragimg.className = 'item_solid';
				}
				else {
					var handstatus = false;
					imgstate = true;
				}
			}
			else {
				var handstatus = false;
				imgstate = true;
			}
			var force = false;
			var dragwidth = this.dragimg.width;
			var dragheight = this.dragimg.height;
			var dragx = Math.ceil(dragwidth/2);
			var dragy = Math.ceil(dragheight/2);
			var max_x = resize.width() - dragwidth;
			var max_y = resize.height() - dragheight;
			var x = (posx - dragx);
			var y = (posy - dragy);
			if (x < 0) {
				x = 0;
			}
			if (y < 0) {
				y = 0;
			}
			if (x > max_x) {
				x = max_x;
			}
			if (y > max_y) {
				y = max_y;
			}
			this.drop = true;
			if (!handstatus) { // it's not in the inventory, let's try to put in on a tile!
				var tile = room.tiles.check(posx, posy, true);
				if (info.soort == "poster") {
					// poster!
					imgstate = true;
					var turn = 1;
					if (this.checkmuren(posx, posy, 2) == 1) {
						// rotatie 1
						var check1 = this.checkmuren(x, y+(dragwidth/4), 1);
						var check2 = this.checkmuren((x+dragwidth), y, 1);
						var check3 = this.checkmuren(x, (y+dragheight), 1);
						var check4 = this.checkmuren((x+dragwidth), ((y+dragheight)-(dragwidth/4)), 1);
						var check2_1 = this.checkmuren(x, y+(dragwidth/4), 2);
						var check2_2 = this.checkmuren((x+dragwidth), y, 2);
						var check2_3 = this.checkmuren(x, (y+dragheight), 2);
						var check2_4 = this.checkmuren((x+dragwidth), ((y+dragheight)-(dragwidth/4)), 2);
						turn = 1;
					}
					else {
						// rotatie 2
						var check1 = this.checkmuren(x, y, 1);
						var check2 = this.checkmuren((x+dragwidth), y+(dragwidth/4), 1);
						var check3 = this.checkmuren(x, ((y+dragheight)-(dragwidth/4)), 1);
						var check4 = this.checkmuren((x+dragwidth), (y+dragheight), 1);
						var check2_1 = this.checkmuren(x, y, 2);
						var check2_2 = this.checkmuren((x+dragwidth), y+(dragwidth/4), 2);
						var check2_3 = this.checkmuren(x, ((y+dragheight)-(dragwidth/4)), 2);
						var check2_4 = this.checkmuren((x+dragwidth), (y+dragheight), 2);
						turn = 2;
					}
					
					if (check1 && check2 && check3 && check4 && check2_1 == check2_2 && check2_1 == check2_3 && check2_1 == check2_4) {
						changepos = true;
						this.dragimg.style.zIndex = 3;
						this.obj.turn = turn;
						this.drop = true;
						this.dragimg.className = 'item_solid';
						force = true;
					}
					else
					{
						this.drop = false;
						this.dragimg.className = 'item_trans';
						changepos = true;
						set_top(this.dragimg.id);
					}
				}
				else {
					if (tile[0]) { // is it on a tile?
						// furniture might be multiple tiles big, let's check
						var multiple_check = this.multiple_check(this.obj, tile[1], tile[2], this.obj.turn, info.lang, info.breed);
						if (multiple_check[1] == 0) {
							// none are marked 'used', let's check for stackable and free tiles
							if(multiple_check[2] != 0) {
								// some tiles are stackable, whilst all other are free -> stacking time!
								var multi_check = "stack";
							}
							else {
								// all tiles are free -> normal placement
								var multi_check = "free";
							}
						}
						else {
							// some are marked 'used', furniture cannot be moved
							var multi_check = "used";
						}
						//debug.add(multiple_check[0]+" "+multiple_check[1]+" "+multiple_check[2]+" "+multi_check);
						if (multi_check == "free") {
							this.drop = true;
							imgstate = true;
							this.dragimg.className = 'item_solid';
							var pos = this.getpos(this.obj.furni, this.obj.turn, this.obj.action, tile[1]+"_"+tile[2]);
							x = pos[0];
							y = pos[1];
						}
						else if (multi_check == "stack") {
							this.drop = false;
							changepos = true;
							imgstate = false;
						}
						else {
							// furniture cannot be placed
							this.drop = false;
							changepos = true;
							imgstate = false;
						}
					}
					else {
						// furniture is not on a tile
						this.drop = false;
						set_top(this.dragimg.id);
						imgstate = false;
						this.dragimg.className = 'item_trans2';
					}
				}
			}
			if (handstatus  && inv.open) {
				// make sure one can drop in inventory
				this.drop = true;
			}
			if (imgstate) {
				if (info.soort == "poster") {
					this.to_furni(this.obj.db, force);
				}
				else {
					this.to_furni(this.obj.db, false);
				}
			}
			else {
				this.to_icon(this.obj.db, false);
			}
			if (changepos) {
				this.dragimg.style.left = x;
				this.dragimg.style.top = y;
				if (info.soort == "poster") {
					if (handstatus) {
						set_top(this.dragimg.id);
					}
				}
			}
			return false;
		}
	},
	dragstop : function (pos, is_tile, droptile) {
		if (this.obj != null && this.drop && this.put_down && client.mode == "room") {
			if (this.db[this.obj.furni].soort != "poster") {
				var do_drop = false;
				if (is_tile) {
					sendtile = droptile[0]+"_"+droptile[1];
					do_drop = true;
				}
				else if (inv.open && pos[0] <= resize.width() && pos[1] <= 162 && pos[0] >= resize.width()-267 && pos[1] >= 0) {
					do_drop = true;
					sendtile = "inv";
				}
				if (do_drop) {
					removechilds("dragfurni");
					if (this.obj.tile != "inv") {
						this.obj.className = 'item_solid';
					}
					else {
						HideContent(this.obj.id);
						inv.content("open");
					}
					// check of het niet gewoon in de inventory blijft staan
					if (!(sendtile == "inv" && this.obj.tile == "inv")) {
						// check eerst nog voor doneren
						if (this.obj.tile == "inv" && sendtile != "inv" && room.data.owner != user.id) {
							// doneren!
							if (in_array("always_pickup", user.rights)) {
								packets.send.furni_move(this.obj.db, sendtile);
							}
							else {
								this.donate.start(this.obj.db, sendtile);
							}
						}
						else {
							packets.send.furni_move(this.obj.db, sendtile);
						}
					}
					this.obj = null;
					this.dragimg = null;
				}
			}
			else {
				// poster, andere soort coördinaten doorgeven, relatief tov room.start_x en room.start_y
				removechilds("dragfurni");
				HideContent(this.obj.id);
				inv.content("open");
				if (!(inv.open && pos[0] <= resize.width() && pos[1] <= 162 && pos[0] >= resize.width()-267 && pos[1] >= 0)) {
					var poster_x = parseInt(this.dragimg.style.left)-room.start_x;
					var poster_y = parseInt(this.dragimg.style.top)-room.start_y;
					if (this.obj.action == 1) {
						if (this.obj.turn == 2) {
							poster_x -= parseInt(this.db[this.obj.furni].action_x);
						}
						poster_y -= parseInt(this.db[this.obj.furni].action_y);
					}
					if (room.data.owner != user.id) {
						// doneren!
						if (in_array("always_pickup", user.rights)) {
							packets.send.furni_move(this.obj.db, poster_x+"|"+poster_y+"@"+this.obj.turn);
						}
						else {
							this.donate.start(this.obj.db, poster_x+"|"+poster_y+"@"+this.obj.turn);
						}
					}
					else {
						packets.send.furni_move(this.obj.db, poster_x+"|"+poster_y+"@"+this.obj.turn);
					}
				}
				this.obj = null;
				this.dragimg = null;
			}
		}
	},
	donate : {
		id : null,
		tile : null,
		start: function (id, tile) {
			this.id = id;
			this.tile = tile;
			set_top("donate_layer");
			ShowContent("donate_layer");
		},
		proceed : function () {
			packets.send.furni_move(this.id, this.tile);
			this.id = null;
			this.tile = null;
			HideContent("donate_layer");
		},
		stop : function () {
			this.id = null;
			this.tile = null;
			HideContent("donate_layer");
		}
	},
	to_furni : function (id, update) {
		var furni = $("furni_"+id);
		var dragimg = $("dragimg");
		var info = this.db[furni.furni];
		var h = furni.turn;
		if (info.soort == "stoel" && info.afb == 1) {
			h = 1;
		}
		var extra = "";
		if (furni.action == 1) {
			extra = "b";
		}
		var img = "images/furni/"+furni.furni+"/"+h+extra+".gif";
		if (update) {
			if (dragimg != null) {
				dragimg.imgstate = true;
				dragimg.src = img;
			}
			else {
				furni.imgstate = true;
				furni.src = img;
			}
		}
		else {
			if (!dragimg.imgstate) {
				dragimg.imgstate = true;
				dragimg.src = img;
			}
		}
	},
	to_icon : function (id, update) {
		var furni = $("furni_"+id);
		var dragimg = $("dragimg");
		var img = "images/furni/"+furni.furni+"/icon.gif";
		if (update) {
			furni.imgstate = false;
			furni.src = img;
		}
		else {
			if (dragimg.imgstate) {
				dragimg.imgstate = false;
				dragimg.src = img;
				
			}
		}
	},
	turncheck : function (id) {
		// requiring rewrite
		var furni = $("furni_"+id);
		var info = this.db[furni.furni];
		
		var turns = info.afb;
		var doen = true;
		if (turns == 1) {
			doen = false;
		}
		if (info.soort == "stoel" && turns == 1) {
			turns = 4;
			doen = true;
		}
		if (furni.h == turns) {
			var check_draai = 1;
		}
		else {
			var check_draai = (furni.h*1)+1;
		}
		/*var check_tegels_array = maak_tegel_array(furni.tile, check_draai, info.lang, info.breed);
		var aantal_vrij = aantal_bezet = aantal_huidig = 0;
		for (i = 0; i < check_tegels_array.length; i++) // LENGTH APART, SPEED!
		{
			var this_check = vrijtegel(check_tegels_array[i], furni_nr, furni.tile);
			if (this_check == "vrij")
			{
				aantal_vrij++;
			}
			if (this_check == "bezet")
			{
				aantal_bezet++;
			}
			if (this_check == "huidig")
			{
				aantal_huidig++;
			}
		}
		if (aantal_bezet == 0)
		{
			if ((aantal_vrij+aantal_huidig) == check_tegels_array.length)
			{
				resultaat = "ja";
			}
			else
			{
				resultaat = "nee";
			}
		}
		else
		{
			resultaat = "nee";
		}
		if (resultaat == "nee")
		{
			doen = false;
		}*/
		if (furni.tile == "inv") {
			doen = false;
		}
		if (furni.soort == "poster") {
			doen = false;
		}
		return doen;
	},
	multiple_check : function (furni, tile1, tile2, h, lang, breed) {
		// function used for furniture that has a length of breath larger than 1, to see whether the other tiles are free
		var info = this.db[furni.furni];
	    var furnitiles = new Array();
		if (furni.tile != "inv") {
			var tile = furni.tile.split(/_/);
	        var furnilengte = 0;
	        var furnibreedte = 0;
	        switch (furni.turn) {
	            case 1:
	                furnilengte = info.lang;
	                furnibreedte = info.breed;
	                break;
	            case 2:
	                furnilengte = info.breed;
	                furnibreedte = info.lang;
	                break;
	            case 3:
	                furnilengte = info.lang;
	                furnibreedte = info.breed;
	                break;
	            case 4:
	                furnilengte = info.breed;
	                furnibreedte = info.lang;
	                break;
	        }
	        for (i1 = 0; i1 < furnilengte; i1++) {
				for (i2 = 0; i2 < furnibreedte; i2++) {
					furnitiles.push((parseInt(tile[0])-i1)+"_"+(parseInt(tile[1])+i2));
				}
			}
		}
		var free = 0;
		var used = 0;
		var stack = 0;
		switch(h) {
		case 1:
			lengte = lang;
			breedte = breed;
			break;
		case 2:
			lengte = breed;
			breedte = lang;
		break;
		case 3:
			lengte = lang;
			breedte = breed;
		break;
		case 4:
			lengte = breed;
			breedte = lang;
		break;
		}
		for (i1 = 0; i1 < lengte; i1++) {
			for (i2 = 0; i2 < breedte; i2++) {
				var tile = (tile1-i1)+"_"+(tile2+i2);
				if (in_array(tile, furnitiles)) {
					 // this is one of the current tiles!
					free++;
				}
				else {
					if (isset(this.stack_map[tile])) {
						if (info.soort != "tapijt") {
							switch(this.tile_map[tile]) {
							case 0: // free
								free++;
							break;
							case 1: // used
								used++;
							break;
							case 2: // stackable
								stack++;
							break;
							case 3: // chair
								used++; // chairs are never stackable anyway
							break;
							}
						}
						else {
							if (!in_array(tile, room.data.holes)) {
								free++;
							}
							else {
								used++;
							}
						}
					}
					else {
						used++; // tile does not even exist, make sure furniture is not placed!!
					}
				}
			}
		}
		return new Array(free, used, stack);
	},
	heightmaps : function () {
		/*
		tile_map options:
			0: free
			1: used
			2: stackable
			3: chair
		*/
		this.stack_map = new Array(); // this is in fact just to retrieve the highest furniture in a nice array for all tiles
		this.tile_map = new Array(); // data of all the furniture that is stacked highest, used for furniture placing and avatar walking
		// first create neccesary arrays
		for (i1 = 1; i1 <= room.data.lang; i1++) {
			for (i2 = 1; i2 <= room.data.breed; i2++) {
				var tile = i2+"_"+i1;
				this.stack_map[tile] = new Array();
				this.tile_map[tile] = 0; // free tile
			}
		}
		// then put info in them
		for (i1 = 1; i1 <= room.data.lang; i1++) {
			for (i2 = 1; i2 <= room.data.breed; i2++) {
				var tile = i2+"_"+i1;
				var node = $("tile"+tile);
				for(var i = 0; i < node.childNodes.length; i++) {
					if (node.childNodes[i]) {
						var furni = node.childNodes[i];
						if (furni.furni == "avatar") {
							this.stack_map[(i2)+"_"+(i1)][1] = "avatar";
						}
						else {
							var info = this.db[furni.furni];
							switch(furni.turn) {
							case 1:
								var lengte = info.lang;
								var breedte = info.breed;
								break;
							case 2:
								var lengte = info.breed;
								var breedte = info.lang;
								break;
							case 3:
								var lengte = info.lang;
								var breedte = info.breed;
								break;
							case 4:
								var lengte = info.breed;
								var breedte = info.lang;
								break;
							}
							for (i3 = 0; i3 < lengte; i3++) {
								for (i4 = 0; i4 < breedte; i4++) {
									this.stack_map[(i2-i3)+"_"+(i1+i4)][furni.stacknr] = furni.db;
								}
							}
						}
					}
				}
			}
		}
		// generate tile_map, now that we can see which items are stacked highest
		for (i1 = 1; i1 <= room.data.lang; i1++) {
			for (i2 = 1; i2 <= room.data.breed; i2++) {
				var tile = i2+"_"+i1;
				var this_stack_map = this.stack_map[tile];
				var amount = this_stack_map.length;
				if (amount != 0) {
					amount -= 1;
					var id = this_stack_map[amount];
					if (id == "avatar") {
						this.tile_map[tile] = 1;
					}
					else {
						var furni = $("furni_"+id);
						var info = this.db[furni.furni];
						var result = 1; // normal furniture
						if (info.stacking == "yes") {
							result = 2; // stackable furniture
						}
						else if (info.soort == "stoel") {
							// why use else? -> chair is never stackable
							result = 3; //chair
						}
						this.tile_map[tile] = result; // set tile_map
					}
				}
			}
		}
		// oh, and don't place furniture in holes!
		var len = room.data.holes.length;
		for (i = 0; i < len; i++) {
			this.tile_map[room.data.holes[i]] = 1;
		}
	},
	turn : function (id) {
		// turn furniture
		packets.send.furni_turn(id);
	},
	action : function (id) {
		if (!(ctrl_status || alt_status)) {
			// turn furnture on/off if possible
			packets.send.furni_action(id);
		}
	},
	pickup : function (id) {
		//pick up furni
		packets.send.furni_pickup(id);
		furni.click("");
	}
};