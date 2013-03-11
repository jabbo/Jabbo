// AVATARS.JS
// handles the avatars in a room
var avatars = {
	pictures : new Array(), // stores preloaded pictures
	avapos : null, // avapos stores where the right image can be found in the avatar sprite
	clicked : 0, // contains the id of the avatar that has been clicked on
	init : function () {
		this.avapos = new Array(); // avapos will be filled
		var direction = new Array(1,2,3,4,5,6,7,8);
		var count = 0;
		var len = direction.length;
		for (i = 0; i < len; i++) {
			this.avapos[direction[i]] = new Array();
			this.avapos[direction[i]][0] = count; //std
			count += 64;
			this.avapos[direction[i]][1] = count; //wlk
			count += 64;
			this.avapos[direction[i]][2] = count; //wlk
			count += 64;
			this.avapos[direction[i]][3] = count; //wlk
			count += 64;
			this.avapos[direction[i]][4] = count; //wlk
			count += 64;
		}
		for (i = 1; i <= 4; i++) { // sitting
			this.avapos[(i*2)][5] = count;
			count += 64;
		}
		debug.yellow("Avatar sprite positions calculated");
	},
	url : function (figure, data) {
		return "avatar.php?figure="+figure+data;
	},
	add : function (id, name, mission, clothes, badge, tile, turn, drink, brb, sit, friend, rights) {
		if (!room.loading) {
			if (!$("ava_"+id)) {
				var tile1 = (tile.split(/_/)[0])*1; // tile is stored as "5_1", now split it to 5 and 1
				var tile2 = (tile.split(/_/)[1])*1;
				if (room.data.mode == "s") { // small or big rooms?
					var ava_x = room.tiles.posx[tile]-2;
					var ava_y = room.tiles.posy[tile]-65;
				}
				if (room.data.mode == "b") {
					var ava_x = room.tiles.posx[tile]+4;
					var ava_y = room.tiles.posy[tile]-85;
				}
				var newava = document.createElement("div");
				newava.id = "ava_"+id;
				newava.serverid = id;
				newava.name = name;
				newava.mission = mission;
				newava.tile = [tile1, tile2];
				newava.clothes = clothes;
				newava.badge = badge;
				newava.drink = drink;
				newava.brb = brb;
				newava.sit = sit;
				newava.turn = turn;
				newava.friend = friend;
				newava.rights = rights;
				newava.moving = false;
				newava.ani = false;
				newava.step = 1;
				newava.next = new Array();
				newava.end = false;
				newava.furni = "avatar"; // for heightmaps
				addEvent(newava, 'click', function() { avatars.click(id); });
				addEvent(newava, 'mouseover', function() { avatars.tagin(id); });
				addEvent(newava, 'mouseout', function() { avatars.tagout(id); });
				newava.style.position = "absolute";
				newava.style.left = ava_x;
				newava.style.top = ava_y;
				newava.style.width = "64px";
				newava.style.height = "110px";
				newava.style.zIndex = 2; // FOR NOW, WON'T WORK WITH STAKING! (to get above the doors)
				newava.className = "item_trans2";
				newava.style.backgroundImage = "url('images/ghost.gif')";
				
				if (sit == "") {
					newava.style.zIndex = 2; // FOR NOW, WON'T WORK WITH STAKING! (to get above the doors)
					$("tile"+tile).appendChild(newava);
				}
				else {
					newava.style.zIndex = tile1+tile2;
					$("tile"+sit.split("|")[1]).appendChild(newava);
				}
				
				if (drink == "camera") {
					this.loadpicture("avatar3.php?figure="+clothes, id);
				}
				else {
					this.loadpicture("avatar2.php?figure="+clothes, id);
				}
					
				var image = document.createElement("img");
				image.src = "images/nametag.php?t="+ucfirst($("ava_"+id).name);
				image.id = "tag_"+id;
				image.user = id;
				image.style.position = "absolute";
				image.style.display = "none";
				$("nametags").appendChild(image);
				set_top("tag_"+id);
				
				furni.heightmaps();
				
				if (sit == "") {
					this.set(id, newava.turn, 0);
				}
				else {
					this.set(id, newava.turn, 5);
				}
				ShowContent("ava_"+id);
			}
		}
		else {
			setTimeout(function(){avatars.add(id, name, mission, clothes, badge, tile, turn, drink, brb, sit, friend, rights);},20);
		}
	},
	loadpicture : function (url, id) {
		if (!avatars.pictures[url]) {
			avatars.pictures[url] = document.createElement("img");
			avatars.pictures[url].src = url;
			avatars.pictures[url].loaded = false;
			avatars.pictureloaded(url, id);
		}
		else {
			if (avatars.pictures[url].loaded) {
				$("ava_"+id).style.backgroundImage = "url('"+url+"')";
				if ($("ava_"+id).brb == 0) {
					$("ava_"+id).className = "item_solid";
				}
				else {
					$("ava_"+id).className = "item_trans2";
				}
			}
			else {
				avatars.pictureloaded(url, id);
			}
		}	
	},
	pictureloaded : function (url, id) {
		if (avatars.pictures[url].complete) {
			avatars.pictures[url].loaded = true;
			$("ava_"+id).style.backgroundImage = "url('"+url+"')";
			if ($("ava_"+id).brb == 0) {
				$("ava_"+id).className = "item_solid";
			}
			else {
				$("ava_"+id).className = "item_trans2";
			}
		}
		else {
			setTimeout(function(){avatars.pictureloaded(url, id);},10);
		}
	},
	givedrink : function (id, drink) {
		// give avatar a drink, only camera supported atm
		var avatar = $("ava_"+id);
		if (avatar) {
			avatar.drink = drink;
			if (drink == "camera") {
				this.loadpicture("avatar3.php?figure="+avatar.clothes, id);
			}
			else {
				this.loadpicture("avatar2.php?figure="+avatar.clothes, id);
			}
		}
	},
	updatebrb : function (id, brb) {
		// update brb status
		var avatar = $("ava_"+id);
		if (avatar) {
			avatar.brb = brb;
			if (avatar.brb == 0) {
				$("ava_"+id).className = "item_solid";
			}
			else {
				$("ava_"+id).className = "item_trans2";
			}
		}
	},
	del : function (id) {
		// delete avatar
		var avatar = $("ava_"+id);
		if (avatar) {
			avatar.parentNode.removeChild(avatar);
			furni.heightmaps();
		}
		if (this.clicked == id) {
			furni.click("");
		}
	},
	click : function(id) {
		// an avatar has been clicked on
		var data = $("ava_"+id);
		if (data) { // check if avatar excists
			this.clicked = id;
			ShowContent("infoshade"); // show the info box
			$('infotext').innerHTML = ucfirst(data.name);
			$('infodesc').innerHTML = data.mission;
			$('infopop').style.backgroundImage = "url('avatar2.php?figure="+data.clothes+"&brb=0')";
			if (data.badge != 0) {
				$('infobadge').src = "images/badges/"+data.badge+".gif";
			}
			else {
				$('infobadge').src = "images/blank.gif";
			}
			$('infoicon').src = "images/blank.gif";
			$('buttons').innerHTML = "";
			if (id > 0) {
				// normal avatar
				if (id != user.id) {
					if (id != room.data.owner) {
						// rights
						if (data.rights) {
							$('buttons').innerHTML += '<div onclick="avatars.takerights('+id+')" onmousedown="room.button_down(this, \'rights2\')" onmouseup="room.button_up(this, \'rights2\')" style="width: 118px; background-image:url(\'images/rooms/rights2.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
						}
						else {
							$('buttons').innerHTML += '<div onclick="avatars.giverights('+id+')" onmousedown="room.button_down(this, \'rights1\')" onmouseup="room.button_up(this, \'rights1\')" style="width: 89px; background-image:url(\'images/rooms/rights1.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
						}
						
					}
					// here comes the friend request code
				}
				else {
					// dancing, waving
				}
			}
			else if (id < 0) { 
				// it's abot! (bot ID's are below zero)
				if (in_array("kick_bot", user.rights)) {
					$('buttons').innerHTML += '<div onclick="avatars.kickbot('+id+')" onmousedown="room.button_down(this, \'kick\')" onmouseup="room.button_up(this, \'kick\')" style="width: 49px; background-image:url(\'images/rooms/kick.gif\'); height: 17px; z-index:3; background-position: 0px -0px; background-repeat:no-repeat; float: right;"></div>';
				}
			}
		}

	},
	tagin : function(id) {
		// show the name of the avatar above it
		if($("ava_"+id)) {
			if ($("tag_"+id)) {
				if (!$("ava_"+id).moving && furni.obj == null) {
					
					var middle_x = parseInt($("ava_"+id).style.left);
					middle_x += ($("ava_"+id).clientWidth)/2;
					middle_x -= ($("tag_"+id).width)/2;
					
					$("tag_"+id).style.left = middle_x;
					$("tag_"+id).style.top = parseInt($("ava_"+id).style.top)-15;
					
					set_trans("tag_"+id, 0);
					ShowContent("tag_"+id);
					Effect.Fade("tag_"+id, { duration: 0.2, from: 0, to: 1 });
				}
			}
		}
		else {
			debug.error("Avatar "+id+" not loaded");
		}
	},
	tagout : function(id) {
		if($("ava_"+id)) {
			if ($("tag_"+id)) {
				Effect.Fade("tag_"+id, { duration: 0.2, from: 1, to: 0 });
			}
		}
		else {
			debug.error("Avatar "+id+" not loaded");
		}
	},
	set : function (id, turn, action) {
		// set sprite position
		if ($("ava_"+id)) {
			$("ava_"+id).style.backgroundPosition = "-"+this.avapos[turn][action]+"px 0px";
		}
		
	},
	move : function (id, x, y, turn) {
		// move an avatar!
		if($("ava_"+id)) {
			HideContent("tag_"+id); // hide the tag
			if ($("ava_"+id).moving) {
				$("ava_"+id).next.push([x, y, turn]); // if it's already moving, add to waiting queue
			}
			else {
				var data = $("ava_"+id);
				
				var tile = x+"_"+y;
				if (room.data.mode == "s") {
					var ava_x = room.tiles.posx[tile]-2;
					var ava_y = room.tiles.posy[tile]-65;
				}
				if (room.data.mode == "b") {
					var ava_x = room.tiles.posx[tile]+4;
					var ava_y = room.tiles.posy[tile]-85;
				}
				$("ava_"+id).moving = true;
				
				$("ava_"+id).tile = [x, y];
				$("ava_"+id).turn = turn;
				$("tile"+tile).appendChild($("ava_"+id)); // move the avatar to the right <div>, every tile has a div, for zindex purposes
				
				if (!data.ani) {
					// start walking animation
					$("ava_"+id).ani = true;
					$("ava_"+id).step = 1;
					this.animate(id);
				}
				
				var movecallback = avatars.moved(id);
				movelayer('ava_'+id, ava_x, ava_y, 25, 20, 1, movecallback); // the moving animation
				
				//set_grid(); -> not only grid, but also heightmap for furni, right?
			}
		}
		else {
			debug.error("Avatar "+id+" not loaded");
		}
	},
	stopmove : function (id) {
		// stop moving an avatar
		if($("ava_"+id)) {
			if ($("ava_"+id).moving) {
				$("ava_"+id).end = true;
				$("ava_"+id).sit = "";
			}
			else {
				$("ava_"+id).ani = false;
				$("ava_"+id).end = false;
				$("ava_"+id).sit = "";
				avatars.set(id, $("ava_"+id).turn, 0);
			}
			furni.heightmaps();
		}
	},
	stopmovesit : function (id, sit) {
		// stop moving an avatar and sit down
		if($("ava_"+id)) {
			if ($("ava_"+id).moving) {
				$("ava_"+id).end = true;
				$("ava_"+id).sit = sit;
			}
			else {
				$("ava_"+id).ani = false;
				$("ava_"+id).end = false;
				$("ava_"+id).sit = sit;
				$("ava_"+id).turn = parseInt($("ava_"+id).sit.split("|")[0]);
				avatars.set(id, $("ava_"+id).turn, 5); // action 5 means sitting
				$("ava_"+id).style.zIndex = $("ava_"+id).tile[0]+$("ava_"+id).tile[1];
				$("tile"+$("ava_"+id).sit.split("|")[1]).appendChild($("ava_"+id));
			}
			furni.heightmaps();
		}
	},
	moved : function (id) {
		output = {
			complete : function () {
				if($("ava_"+id)) {
					$("ava_"+id).moving = false;
					if ($("ava_"+id).next.length > 0) {
						// next move from waiting queue
						var nextmove = $("ava_"+id).next.shift();
						avatars.move(id, nextmove[0], nextmove[1], nextmove[2]);
					}
					else {
						if ($("ava_"+id).end) { // if this is false, we're expecting more movement packets from the server, so keep doing the walking animation
							$("ava_"+id).ani = false;
							$("ava_"+id).end = false;
							if ($("ava_"+id).sit == "") {
								$("ava_"+id).style.zIndex = 2;
								avatars.set(id, $("ava_"+id).turn, 0); // action 0 is standing
							}
							else {
								$("ava_"+id).turn = parseInt($("ava_"+id).sit.split("|")[0]);
								avatars.set(id, $("ava_"+id).turn, 5); // action 5 is sitting
								$("ava_"+id).style.zIndex = $("ava_"+id).tile[0]+$("ava_"+id).tile[1];
								$("tile"+$("ava_"+id).sit.split("|")[1]).appendChild($("ava_"+id));
							}
						}
					}
					furni.heightmaps();
				}
			}
		};
		return output;
	},
	animate : function (id) {
		if($("ava_"+id)) {
			if ($("ava_"+id).ani) {
				this.set(id, $("ava_"+id).turn, $("ava_"+id).step);
				$("ava_"+id).step++;
				if ($("ava_"+id).step > 4) {
					$("ava_"+id).step = 1;
				}
				var animateavatars = setTimeout(function(){avatars.animate(id);}, 150);
			}
		}
	},
	kickbot : function (id) {
		if($("ava_"+id)) {
			var bot_id = id - id*2; // make negative: bot ids are negative
			packets.send.botkick(bot_id);
			furni.click(""); // clear info box
		}
	},
	giverights : function (id) {
		if($("ava_"+id)) {
			packets.send.giverights(id);
			furni.click("");
		}
	},
	takerights : function (id) {
		if($("ava_"+id)) {
			packets.send.takerights(id);
			furni.click("");
		}
	},
	updaterights : function (id, rights) {
		if($("ava_"+id)) {
			$("ava_"+id).rights = rights;
			if (id == user.id) {
				// your rights!
				room.data.rights = rights;
			}
		}
	},
	updatesit : function (id, sit) {
		// a chair was turned while someone was sitting on it
		if($("ava_"+id)) {
			$("ava_"+id).sit = sit;
			if (sit == "") {
				avatars.set(id, $("ava_"+id).turn, 0);
				var tile = $("ava_"+id).tile;
				$("ava_"+id).style.zIndex = 2;
				$("tile"+tile[0]+"_"+tile[1]).appendChild($("ava_"+id));
			}
			else {
				$("ava_"+id).turn = parseInt($("ava_"+id).sit.split("|")[0]);
				avatars.set(id, $("ava_"+id).turn, 5);
				$("ava_"+id).style.zIndex = $("ava_"+id).tile[0]+$("ava_"+id).tile[1];
				$("tile"+$("ava_"+id).sit.split("|")[1]).appendChild($("ava_"+id));
			}
		}
	}
};