var room = {
	loadedclient: false,
	loadedserver: false,
	loading: false,
	id : 0,
	data : null,
	start_x : 0,
	start_y : 0,
	bigholes : new Array(),
	checkedholes : new Array(),
	go : function (id) {
		if (!this.loading) {
			client.mode = "main";
			if (this.id == 0) {
				this.loading = true;
				this.id = id;
				mainview.black._close();
			}
			else {
				mainview.closewindows();
				this.loading = true;
				this.id = id;
				this.go2();
			}
		}
	},
	go2 : function () {
		if (this.loading) {
			this.loadedclient = false;
			this.loadedserver = false; 
			furni.obj = null;
			furni.dragimg = null;
			this.tiles.click = false;
			set_top('room_div');
			set_top('load_layer');
			ShowContent('load_layer');
			ShowContent('room_div');
			packets.send.room_go(this.id);
		}
	},
	fail : function (error) {
		if (this.loading) {
			this.loading = false;
			this.id = 0;
			mainview.showdirect();
			HideContent('load_layer');
			HideContent('room_div');
			debug.error("Loading room failed.");
			if (error == "error") {
				client.notify(texts["room_loadfail"], texts["notify_error"]);
			}
			else {
				client.notify(texts["room_full"]);
			}
		}
	},
	load : function () {
		if (this.loading) {
			client.mode = "room";
			$("roominfo1").innerHTML = this.data.name;
			$("roominfo2").innerHTML = texts["room_owner"]+": "+ucfirst(this.data.ownername);
			if (room.data.voted) {
				$('voted_text').innerHTML = texts["room_score"]+" "+room.data.score;
				HideContent('vote_bad');
				HideContent('vote_good');
				HideContent('vote_text');
				ShowContent('voted_text');
			}
			else {
				$('voted_text').innerHTML = "";
				ShowContent('vote_bad');
				ShowContent('vote_good');
				ShowContent('vote_text');
				HideContent('voted_text');
			}
			$('roomchat').value = texts["room_chatclick"];
			$("roomchat").style.width = (resize.width()-380)+'px';
			$('trashtext').focus();
			furni.click('');
			this.roomgen();
			this.tiles.init();
			furni.inv(); // after loading inventory login data, this will call on furni.init(), which includes preload, will call on room.loaded() when done
			inv.set("closeforce");
			document.onmousemove = room.mousemove;
			document.onmouseup = room.mousedown;
		}
	},
	reload : function () {
		if (client.mode == "room" && !this.loading) {
			var temp_furni = new Array();
			var temp_avatars = new Array();
			$("furniture").childElements().each(function(thisTile) {
				thisTile.childElements().each(function(thisChild) {
					if (isset(thisChild.db)) {
						if (furni.db[thisChild.furni].soort != "poster") {
							var data = {
								I : thisChild.db,
								T : thisChild.tile,
								S : thisChild.stacknr,
								SH : thisChild.stackheight,
								H : thisChild.turn,
								A : thisChild.action,
								F : thisChild.furni
							};
						}
						else {
							var poster_x = (parseInt(thisChild.style.left)-room.start_x);
							var poster_y = (parseInt(thisChild.style.top)-room.start_y);
							if (thisChild.action == 1) {
								if (thisChild.turn == 2) {
									poster_x -= parseInt(furni.db[thisChild.furni].action_x);
								}
								poster_y -= parseInt(furni.db[thisChild.furni].action_y);
							}
							var data = {
								I : thisChild.db,
								T : poster_x+"|"+poster_y,
								S : thisChild.stacknr,
								SH : thisChild.stackheight,
								H : thisChild.turn,
								A : thisChild.action,
								F : thisChild.furni
							};
						}
						temp_furni.push(data);
					}
					else {
						temp_avatars.push(thisChild);
					}
				});
			});
			// door
			$("tile"+this.data.door).childElements().each(function(thisChild) {
				temp_avatars.push(thisChild);
			});
			this.roomgen();
			this.tiles.init();
			temp_furni.each(function(thisFurni) {
				furni.add(thisFurni, false);
			});
			temp_avatars.each(function(thisAvatar) {
				avatars.add(thisAvatar.serverid, thisAvatar.name, thisAvatar.mission, thisAvatar.clothes, thisAvatar.badge, thisAvatar.tile[0]+"_"+thisAvatar.tile[1], thisAvatar.turn, thisAvatar.drink, thisAvatar.brb, thisAvatar.sit, thisAvatar.friend, thisAvatar.rights);
			});
			furni.heightmaps(); // set heightmaps, after furni init
		}
	},
	loaded : function () {
		if (this.loading) {
			if (this.loadedclient && this.loadedserver) {
				ShowContent("room_div");
				HideContent("load_layer");
				this.loading = false;
				this.tiles.click = true;
			}
		}
	},
	leave : function () {
		if (client.mode == "room") {
			this.tiles.click = false;
			this.id = 0;
			furni.obj = null;
			furni.dragimg = null;
			HideContent("room_div");
			removechilds("room_back");
			removechilds("furniture");
			removechilds("dragfurni");
			removechilds("roomchats");
			removechilds("nametags");
			mainview.showopen();
			packets.send.room_leave();
		}
	},
	walls : {
		turn : new Array(),
		startx : new Array(),
		starty : new Array(),
		endx : new Array(),
		endy : new Array(),
		clear : function () {
			this.turn = new Array();
			this.startx = new Array();
			this.starty = new Array();
			this.endx = new Array();
			this.endy = new Array();
		},
		add : function (turn, x, y) {
			var gendata = genarray[room.data.mode];
			this.turn.push(turn);
			this.startx.push(x);
			this.starty.push(y);
			this.endx.push(x+gendata[8]);
			this.endy.push(y+gendata[12]);
		}
	},
	roomgen : function () {
		removechilds("room_back");
		removechilds("furniture");
		removechilds("dragfurni");
		removechilds("roomchats");
		removechilds("nametags");
		inv.prepare();
		var left = 0;
		var top = 0;
		var gendata = genarray[this.data.mode];
		
		this.tiles.width = gendata[8];
		this.tiles.height = this.tiles.width/2;
		
		left -= gendata[4];
		top += gendata[5];
		left += this.data.breed * gendata[8];
		
		var width = (((parseInt(this.data.lang) + parseInt(this.data.breed)) / 2) * (gendata[8]*2)) + gendata[6];
		var height = (((parseInt(this.data.lang) + parseInt(this.data.breed)) / 2) * gendata[8]) + gendata[7];
		
		left += Math.round((resize.width() - width) / 2);
		top += Math.round((resize.height() - height) / 2);
		
		if ((left / gendata[8]) % 2 == 0) {
			var row = Math.floor(top / gendata[8]) + Math.floor(left / (2 * gendata[8]));
			var col = -Math.floor(top / gendata[8]) + Math.floor((left + gendata[8]) / (2 * gendata[8]));
		}
		else {
			var row = Math.floor((top + gendata[8] / 2) / gendata[8]) + Math.floor(left / (2 * gendata[8]));
			var col = -Math.floor((top + gendata[8] / 2) / gendata[8]) + Math.floor((left + gendata[8]) / (2 * gendata[8]));
		}
		
		var start_x = floor_x = row * gendata[8] + col * gendata[8];
		var start_y = floor_y = (row * (gendata[8] / 2)) - (col * (gendata[8] / 2));
		
		this.start_x = start_x;
		this.start_y = start_y;
		start_x = floor_x -= this.tiles.width/2;
		start_y = floor_y -= this.tiles.height/2;
		
		this.bigholes = new Array();
		this.checkedholes = new Array();
		walls = { turn : new Array(), startx : new Array(), starty : new Array(), endx : new Array(), endy : new Array() };
		this.bighole([1,1]);
			
		var deurgeweest = false;
		for (i1 = 1; i1 <= this.data.lang; i1++) {
			for (i2 = 1; i2 <= this.data.breed; i2++) {
				if (!in_array(i2+"_"+i1, this.data.holes)) {
					// dit is geen gat
					this.addtoback("images/rooms/floors/"+this.data.mode+"/"+this.data.floor+".gif", floor_x, floor_y, 3);
					var door = 0;
					if (i2+"_"+(i1-1) == this.data.door && !deurgeweest) {
						var x = floor_x + gendata[0];
						var y = floor_y - gendata[1];
						this.addtoback("images/rooms/door.php?door=1&wall="+this.data.wall+"&mode="+this.data.mode+"&img=1", x, y, 1);
						this.addtoback("images/rooms/door.php?door=1&wall="+this.data.wall+"&mode="+this.data.mode+"&img=2", x, y, 3);
						door = 1;
						deurgeweest = true;
						this.walls.add(1, x, y);
					}
					if ((i2-1)+"_"+i1 == this.data.door && !deurgeweest) {
						var x = floor_x + gendata[2];
						var y = floor_y - gendata[3];
						this.addtoback("images/rooms/door.php?door=2&wall="+this.data.wall+"&mode="+this.data.mode+"&img=1", x, y, 1);
						this.addtoback("images/rooms/door.php?door=2&wall="+this.data.wall+"&mode="+this.data.mode+"&img=2", x, y, 3);
						door = 2;
						deurgeweest = true;
						this.walls.add(2, x, y);
					}
					if (i1 == 1) {
						if (door != 1) {
							var x = floor_x + gendata[0];
							var y = floor_y - gendata[1];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/1.gif", x, y, 3);
							this.walls.add(1, x, y);
						}
					}
					if (i2 == 1) {
						if (door != 2) {
							var x = floor_x + gendata[2];
							var y = floor_y - gendata[3];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/2.gif", x, y, 3);
							this.walls.add(2, x, y);
						}
					}
					if (in_array(i2+"_"+(i1-1), this.bigholes)) {
						if (door != 1) {
							var x = floor_x + gendata[0];
							var y = floor_y - gendata[1];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/1.gif", x, y, 3);
							this.walls.add(1, x, y);
						}
					}
					if (in_array((i2-1)+"_"+i1, this.bigholes)) {
						if (door != 2) {
							var x = floor_x + gendata[2];
							var y = floor_y - gendata[3];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/2.gif", x, y, 3);
							this.walls.add(2, x, y);
						}
					}
					if ((i2+1) > this.data.breed || in_array((i2+1)+"_"+i1, this.data.holes)) {
						if ((i1-1) < 1 || in_array(i2+"_"+(i1-1), this.bigholes)) {
							var x = floor_x - gendata[9];
							var y = floor_y - gendata[11];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/l.gif", x, y, 5);
						}
					}
					if ((i1+1) > this.data.lang || in_array(i2+"_"+(i1+1), this.data.holes)) {
						if ((i2-1) < 1 || in_array((i2-1)+"_"+(i1-1), this.bigholes)) {
							var x = floor_x + gendata[10];
							var y = floor_y - gendata[11];
							this.addtoback("images/rooms/walls/"+this.data.mode+"/"+this.data.wall+"/r.gif", x, y, 5);
						}
					}
				}
				this.addtile(i2+"_"+i1);
				floor_x -= gendata[8];
				floor_y += (gendata[8] / 2);
			}
			floor_x = start_x + (i1 * gendata[8]);
			floor_y = start_y + (i1 * (gendata[8] / 2));
		}
		this.addtile("0_0"); // for posters
		
		// deurtje
		var obj = document.createElement("div");
		obj.id = "tile"+this.data.door;
		obj.style.position = "absolute";
		obj.style.zIndex = 2;
		$("room_back").appendChild(obj);
	},
	bighole : function (tile) {
		if (tile[0] > 0 && tile[1] > 0 && tile[0] <= this.data.breed && tile[1] <= this.data.lang) {
			if (!in_array(tile[0]+"_"+tile[1], this.checkedholes)) {
				if (in_array(tile[0]+"_"+tile[1], this.data.holes)) {
					this.checkedholes.push(tile[0]+"_"+tile[1]);
					if (this.notile([(tile[0]-1),tile[1]]) && this.notile([tile[0],(tile[1]-1)])) {
						this.bigholes.push(tile[0]+"_"+tile[1]);
					}
					this.bighole([(tile[0]-1),tile[1]]);
					this.bighole([tile[0],(tile[1]+1)]);
					this.bighole([(tile[0]+1),tile[1]]);
					this.bighole([tile[0],(tile[1]-1)]);
				}
			}
		}
	},
	notile : function (tile) {
		var answer = false;
		if (tile[0] < 1 || tile[1] < 1 || tile[0] > this.data.breed || tile[1] > this.data.lang) {
			answer = true;
		}
		if (in_array(tile[0]+"_"+tile[1], this.data.holes)) {
			answer = true;
		}
		return answer;
	},
	addtoback : function (img, x, y, z) {
		var obj = document.createElement("img");
		obj.src = img;
		obj.style.position = "absolute";
		obj.style.left = x;
		obj.style.top = y;
		obj.style.zIndex = z;
		$("room_back").appendChild(obj);
	},
	addtile : function (tile) {
		var obj = document.createElement("div");
		obj.id = "tile"+tile;
		var z = ((tile.split(/_/)[0])*1)+((tile.split(/_/)[1])*1);
		if (z < 2) {
			z = 2;
		}
		if (tile == "0_0") {
			z = 1;
		}
		obj.style.position = "absolute"; // make z-index apply to nodes correctly
		obj.style.zIndex = z+2; // +2 -> we don't want furniture etc to be beneath walls
		// add as first node
		//$("furniture").insertBefore(obj, $("furniture").firstChild);
		$("furniture").appendChild(obj);
	},
	tiles : {
		click : false,
		width : 0,
		height: 0,
		posx : null,
		posy : null,
		nul_row : 0,
		nul_col : 0,
		init : function () {
			$("tile_hover").src = "images/tile_hover_"+room.data.mode+".gif";
			this.posx = new Array();
			this.posy = new Array();
			
			var x = room.start_x - (this.width/2);
			var y = room.start_y - (this.height/2);
			for (i1 = 1; i1 <= room.data.lang; i1++) {
				for (i2 = 1; i2 <= room.data.breed; i2++) {
					this.posx[i2+"_"+i1] = x;
					this.posy[i2+"_"+i1] = y;
					
					if ((i2-1)+"_"+i1 == room.data.door) {
						this.posx[room.data.door] = x+(this.width);
						this.posy[room.data.door] = y-(this.height);
					}
					else if (i2+"_"+(i1-1) == room.data.door) {
						this.posx[room.data.door] = x-(this.width)
						this.posy[room.data.door] = y-(this.height);
					}
					
					x -= this.width;
					y += this.height;
				}
				x = room.start_x + (i1 * this.width) - (this.width/2);
				y = room.start_y + (i1 * this.height) - (this.height/2);
			}
			if (parseInt(room.start_x / this.width) % 2 == 0) {
				this.nul_row = Math.floor(room.start_y / this.width) + Math.floor(room.start_x / (2 * this.width));
				this.nul_col = -Math.floor(room.start_y / this.width) + Math.floor((room.start_x + this.width) / (2 * this.width));
			}
			else {
				this.nul_row = Math.floor((room.start_y + this.width / 2) / this.width) + Math.floor(room.start_x / (2 * this.width));
				this.nul_col = -Math.floor((room.start_y + this.width / 2) / this.width) + Math.floor((room.start_x + this.width) / (2 * this.width));
			}
		},
		check : function (x, y, mode) {
			if (parseInt(x / this.width) % 2 == 0) {
				var row = Math.floor(y / this.width) + Math.floor(x / (2 * this.width));
				var col = -Math.floor(y / this.width) + Math.floor((x + this.width) / (2 * this.width));
			}
			else {
				var row = Math.floor((y + this.width / 2) / this.width) + Math.floor(x / (2 * this.width));
				var col = -Math.floor((y + this.width / 2) / this.width) + Math.floor((x + this.width) / (2 * this.width));
			}
			if (mode) {
				var tile1 = -(col-this.nul_col)+1;
				var tile2 = row-this.nul_row+1;
				if (tile1 > 0 && tile2 > 0 && tile1 <= room.data.breed && tile2 <= room.data.lang && !in_array(tile1+"_"+tile2, room.data.holes)) {
					var hover_x = (row * this.width + col * this.width)-(this.width/2);
					var hover_y = ((row * (this.width / 2)) - (col * (this.width / 2)))-(this.height/2);
					var to_return = new Array(true, tile1, tile2, hover_x, hover_y);
					$('tile_hover').style.left = hover_x;
					$('tile_hover').style.top = hover_y;
					ShowContent('tile_hover');
				}
				else {
					var to_return = new Array(false, 0, 0, 0, 0);
					$('tile_hover').hide();
				}
				return to_return;
			}
			else {
				tile1 = -(col-this.nul_col)+1;
				tile2 = row-this.nul_row+1;
				//$('infotext').innerHTML = tile1+" "+tile2; // DEVONLY
				if (tile1 > 0 && tile2 > 0 && tile1 <= room.data.breed && tile2 <= room.data.lang && !in_array(tile1+"_"+tile2, room.data.holes)) {
					$('tile_hover').style.left = (row * this.width + col * this.width)-(this.width/2);
					$('tile_hover').style.top = ((row * (this.width / 2)) - (col * (this.width / 2)))-(this.height/2);
					ShowContent('tile_hover');
				}
				else {
					$('tile_hover').hide();
				}
			}
		}
	},
	mousemove : function (positions) {
		// drag furniture + tile hover
		var posx = document.all ? window.event.clientX : positions.pageX;
		var posy = document.all ? window.event.clientY : positions.pageY;
		if (furni.obj != null && client.mode == "room") {
			furni.move(posx, posy);
		}
		else {
			//no object is being dragged, just hover the tile please
			if (room.tiles.click) {
				room.tiles.check(posx, posy, false);
			}
		}
	},
	mousedown : function (positions) {
		// drop furniture + walking
		if (furni.obj != null && client.mode == "room") {
			var posx = document.all ? window.event.clientX : positions.pageX;
			var posy = document.all ? window.event.clientY : positions.pageY;
			var this_tegel = room.tiles.check(posx, posy, true);
			furni.dragstop([posx,posy], this_tegel[0], [this_tegel[1],this_tegel[2]]);
		}
		else {
			//no object is being dragged, just start walking please - if this is really a tile!
			if (room.tiles.click && client.mode != "main" && !ctrl_status && !alt_status && furni.obj == null) {
				var posx = document.all ? window.event.clientX : positions.pageX;
				var posy = document.all ? window.event.clientY : positions.pageY;
				var this_tegel = room.tiles.check(posx, posy, true);
				if (this_tegel[0]) {
					packets.send.walkrequest(this_tegel[1], this_tegel[2]);
				}
			}
		}
	},
	chat : {
		expand : function () {
			var reg = new RegExp("<(.|\n)*?>");
  			$("roomchat").value = $("roomchat").value.replace(reg, "");
			var size = ($("roomchat").value.length*13)+30;
			if (size > 44 && size < (resize.width()-380)) {
				$("roomchat").style.width = size+"px";
			}
			else {
				if (size < 44) {
					$("roomchat").style.width = "44px";
				}
				else if (size > (resize.width()-385)) {
					$("roomchat").style.width = (resize.width()-380)+"px";
				}
			}
		},
		new_chat : function () {
			var chat_box = $('roomchat').value;
			if(chat_box != '') {
				packets.send.room_chat("R", chat_box);
			}
			$('roomchat').value = "";
			$("roomchat").style.width = "44px";
			$('roomchat').focus();
		},
		spam : {
			count : 0,
			init : function (count) {
				this.count = count;
				this.spam();
			},
			spam : function (count) {
				$('roomchat').disabled = true;
		
				this.count = this.count - 1;

				$('roomchat').value = texts["room_spam"]+" " + this.count;
				room.chat.expand();
				if (this.count <= 0 ) {
					$('roomchat').disabled = false;
					$('roomchat').value = "";
					$("roomchat").style.width = "44px";
					$('roomchat').focus();
					clearTimeout(spamtimer);
					return;
				}
				var spamtimer = setTimeout(function(){room.chat.spam.spam(this.count)},1000);
			}
		},
		show_chat : {
			chat_id : 0,
			render : function (name, id, message) {
				if (client.mode != "main") {
					if($("ava_"+id)) {
						var node = $("roomchats");
						var len = node.childNodes.length;
						for (i = 0; i < len; i++) {
							var this_node = node.childNodes[i];
							if (this_node) {
								var new_top = parseInt(this_node.style.top)-22;
								if(new_top > 0) {
									this_node.style.top = new_top;
								}
								else {
									node.removeChild(this_node);
								}
							}
						}
						var chatlength = Math.floor(((message.length*6.5)+(name.length*6.1))/2);
						var middle_x = parseInt($("ava_"+id).style.left);
						middle_x += ($("ava_"+id).clientWidth)/2;
						middle_x -= chatlength;
						
						if (middle_x < 0) {
							middle_x = 0;
						}
						if ((middle_x+chatlength) > resize.width()) {
							middle_x = resize.width() - chatlength;
						}
						$("roomchats").innerHTML += "<div id='chattext_"+this.chat_id+"' style='position:absolute; left:"+middle_x+"px; top:144px; z-index:150;'><table onclick='avatars.click("+id+")' border='0' cellpadding='0' cellspacing='0'><tr><td width='6' height='19'><img src='images/roomchat/1.gif'></td><td height='19' style='background: url(\"images/roomchat/2.gif\") repeat-x; padding: 3px 0px 0px 0px; background-color: white;' valign='top'><div class='eigenfont' style='color: black;'><b>"+name+"</b>: "+message+"</div></td><td width='10' height='19'><img src='images/roomchat/3.gif'></td></tr></table></div>";
						this.chat_id++;
					}
				}
			},	
			move : function () {
				if (client.mode != "main") {
					var node = $("roomchats");
					var len = node.childNodes.length;
					for (i = 0; i < len; i++) {
						var this_node = node.childNodes[i];
						if (this_node) {
							var new_top = parseInt(this_node.style.top)-22;
							if(new_top > 0) {
								new Effect.Move(this_node.id, { y:-22 });
							}
							else {
								node.removeChild(this_node);
							}
						}
					}
				}
			}
		}
	},
	button_down : function (button, buttontype) {
		button.style.backgroundPosition = "0px -17px";
	},
	button_up : function (button, buttontype) {
		button.style.backgroundPosition = "0px 0px";
	},
	vote : function (vote) {
		if (!room.data.voted) {
			packets.send.vote(vote);
		}
	},
	voted : function (score) {
		$('voted_text').innerHTML = texts["room_score"]+" "+score;
		HideContent('vote_bad');
		HideContent('vote_good');
		HideContent('vote_text');
		ShowContent('voted_text');
		room.data.voted = true;
	}
};
