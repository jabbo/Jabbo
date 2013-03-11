var socket = {
	connect : function(host, port) {
		// If we're using the Flash fallback, we need Flash.
		if (!window.WebSocket && !swfobject.hasFlashPlayerVersion('10.0.0')) {
			alert('Flash Player >= 10.0.0 is required.');
			client.exit();
		}
	  	try  {
		  	
		  	JabboServer = new Alchemy({
				Server: host,
				Port: port,
				DebugMode: false
			});
		  	JabboServer.Connected = this.onopen;
			JabboServer.Disconnected = this.onclose;
			JabboServer.MessageReceived = this.onread;
			JabboServer.Start();
		}
		catch(err) {
			//server bridge is offline
			debug.error(err);
			client.exit();
		}
    },
    send : function(data) {
	    if (JabboServer) {
        	JabboServer.Send(data+"#");
    	}
        if (debug.active) {
        	debug.add("SENT: "+data);
    	}
    },
    onread : function(event) {
	    var data = event.data;
	    var to_parse = data.split("#");
	    
	    if (debug.active) {
		    var n=to_parse.length-1;
			var k=n;
			do {
			var i=k-n;
				debug.add("RECV: "+to_parse[i]);
				packets.receive(to_parse[i]);
			}
			while(--n);
		}
		else {
			var n=to_parse.length-1;
			var k=n;
			do {
			var i=k-n;
				packets.receive(to_parse[i]);
			}
			while(--n);
		}
    },
    onopen : function() {
	    debug.green("Connection with server established!");
    },
    onclose : function(code) {
        debug.error("Connection with server closed!");
        set_top("connection_lost_layer");
		ShowContent('connection_lost_layer');
        client.exit();
    }
};
var packets = {
	init : function() {
		socket.connect(document.domain, 3500);
	},
	receive : function(packet) {
		var header = parseInt(packet.substr(0,3), 10); // 10: decimaal stelsel
		var content = packet.substr(3);
		if (content != "") {
			var data = JSON.parse(content);
		}
		else {
			var data = "";
		}
		switch(header) 
		{
		case 1:
			// connection accepted by the server, show login screen!
			socket.send("006"); // tell the server you've received the ping request
			login.show();
			break;    
		case 2:
			debug.yellow("Connection is about to be closed.");
			client.connection = false;
			break;
		case 3:
			debug.error("Packet rejected by server.");
			break;
		case 5:
			// server pings
			socket.send("006"); // tell the server you've received the ping request
			break;
		case 6:
			// server is still here
			break;
		case 8:
			// user money update
			user.money = data.Cr;
			user.mission = data.M;
			user.clothes = data.C;
			user.badge = data.B;
			catalogue.moneyupdate();
			break;
		case 12:
			// Server RAM
			debug.green("Server RAM usage: "+(Math.round((data.R/1024)*100)/100)+" MB / "+data.R+" KB");
			break;
		case 13:
			// alert
			client.notify(data.M, data.T);
			break;
		case 16:
			// registercheck answer
			register.regstart_checked(data.A);
			break;
		case 18:
			// login succesful
			login.succes();
			break;
		case 19:
			// login failed
			login.error(data.R);
			break;
		case 20:
			// update user data
			user.id = data.I;
			user.name = data.UN;
			user.rights = data.R.split(";");
			user.money = data.MY;
			user.badge = data.CB;
			user.badges = data.B;
			user.clothes = data.C;
			user.mission = data.M;
			user.messenger = data.MM;
			inv.login_data = data.ID; // store inventory data
			break;
		case 24:
			// messenger search answer
			messenger.searched(data.I, data.M, data.C, data.L, data.O, data.A);
			break;
		case 27:
			// messenger buddy requests
			var len = data.R.length;
			var count = 0;
			for(x in data.R) {
				if(count >= len) break;
				else {
					var request = {
						I: data.R[x].I,
						N: data.R[x].N
					}
					messenger.requests.push(request);
					count++;
				}
			}
			messenger.update(1);
			break;
		case 29:
			// friend list update
			messenger.buddies = data.F;
			messenger.update(1);
			// messages are initialised when receiving this packet, so:
			if (!messenger.loaded) {
				messenger.loaded = true;
				if (messenger.messages.length > 0 && client.sound) {
					soundManager.play("messenger");
				}
			}
			break;
		case 31:
			// messenger message
			var message = {
				I: data.I,
				FI: data.FI,
				FN: data.FN,
				C: data.C,
				M: data.M,
				D: data.D
			}
			messenger.messages.push(message);
			messenger.update(1);
			if (messenger.loaded && client.sound) {
				soundManager.play("messenger");
			}
			break;
		case 33:
			// update money data
			user.money = data.M;
			user.sessionearned = data.S;
			catalogue.moneyupdate();
			break;
		case 35:
			// buy furniture answer
			catalogue.buyanswer(data.A);
			break;
		case 37:
			crcodes.checkedok();
			break;
		case 38:
			crcodes.checkedbad(data.E);
			break;
		case 40:
			// navigator data coming in
			if (data.P != null) { navi.lists.publics = data.P; }
			if (data.R != null) { navi.lists.privates = data.R; }
			if (data.O != null) { navi.lists.own = data.O; }
			navi.update_publics();
			navi.update_guestrooms();
			navi.update_own();
			break;
		case 41:
			// room data + furniture
			room.data = {
				id : data.I,
				name : data.N,
				descr : data.D,
				owner : data.O,
				ownername : data.ON,
				floor : data.Fl,
				wall : data.Wl,
				lang : data.L,
				breed : data.B,
				door : data.Do,
				mode : data.M,
				rights : data.R,
				holes : data.H,
				voted : data.V,
				score : data.S
			};
			furni.data = data.F;
			room.load();
			break;
		case 43:
			// room loading failed
			room.fail('error');
			break;
		case 44:
			// room loading done serverside
			room.loadedserver = true;
			room.loaded();
			break;
		case 45:
			// client kicked from room
			client.exit2();
			break;
		case 47:
			// move/add furniture
			furni.packet(data);
			break;
		case 48:
			// remove furniture
			furni.remove(data.I);
			break;
		case 49:
			// move furniture
			furni.moved(data.I, data.T, data.S, data.SH, data.H, data.A, data.F);
			break;
		case 52:
			// chat bubble
			room.chat.show_chat.render(data.U, data.I, data.M);
			break;
		case 53:
			// user is spamming
			room.chat.spam.init(3);
			break;
		case 55:
			client.notify("Reported by: "+data.U+"<br>Message: "+data.M, "Help Report");
			break;
		case 56:
			avatars.add(data.I, data.U, data.M, data.C, data.B, (parseInt(data.X)+1)+"_"+(parseInt(data.Y)+1), data.H, data.D, data.Brb, data.S, data.F, data.R);	
			break;
		case 57:
			avatars.move(data.I, parseInt(data.X)+1, parseInt(data.Y)+1, data.H);
			break;
		case 58:
			avatars.del(data.I);
			break;
		case 61:
			// room is full
			room.fail('full');
			break;
		case 63:
			// open chatbox
			chatbox.open();
			break;
		case 64:
			avatars.stopmove(data.I);
			break;
		case 66:
			room.voted(data.S);
			break;
		case 68:
			// navigator search data coming in
			navi.lists.searched = data.R;
			navi.update_searched();
			break;
		case 71:
			// create room answer
			matic.answer(data.A);
			break;
		case 72:
			// club status update
			club.update(data.S, data.D, data.PM, data.RM);
			break;
		case 74:
			// give avatar drink
			avatars.givedrink(data.I, data.D);
			break;
		case 76:
			// opens picture
			camera.loadpicture(data.C, data.CA);
			break;
		case 79:
			// update rights of avatar
			avatars.updaterights(data.I, data.R);
			break;
		case 80:
			// update sit status of avatar
			avatars.updatesit(data.I, data.S);
			break;
		case 81:
			// stop moving and sit
			avatars.stopmovesit(data.I, data.S);
			break;
		case 82:
			// update brb status
			avatars.updatebrb(data.I, data.Brb);
			break;
		default:
			debug.error("Unknown packet header.");
			break;
		}
	},
	send :
	{
		inactive : function () {
			socket.send("009");
		},
		activeagain : function () {
			socket.send("010");
		},
		requestram : function () {
			socket.send("011"); // request server ram usage
		},
		login : function (try_name, try_pass) {
			// login
			var data = {
				U: try_name,
				P: hex_md5(hex_md5(try_name)+hex_md5(try_pass))
			};
			socket.send("017"+JSON.stringify(data));
		},
		login_done : function () {
			// login complete clientside
			socket.send("021");
		},
		register_start_check : function () {
			// check if register is valid
			var data = {
				IP: 0
			};
			socket.send("015"+JSON.stringify(data));
		},
		globalalert : function (message) {
			// global alert
			var data = {
				M: message.replace("#", "")
			};
			socket.send("014"+JSON.stringify(data));
		},
		naviupdate : function () {
			// request navigator update
			socket.send("039");
		},
		messengermission : function (mission) {
			// change messenger mission
			var data = {
				M: mission
			};
			socket.send("022"+JSON.stringify(data));
		},
		messengersearch : function (searchname) {
			var data = {
				N: searchname.replace("#", "")
			};
			socket.send("023"+JSON.stringify(data));
		},
		addbuddy : function (id) {
			var data = {
				I: id
			};
			socket.send("025"+JSON.stringify(data));
		},
		delbuddy : function (id) {
			var data = {
				I: id
			};
			socket.send("026"+JSON.stringify(data));
		},
		writemessage : function (id, message) {
			var data = {
				I: id,
				M: message
			};
			socket.send("030"+JSON.stringify(data));
		},
		delmessage : function (id) {
			var data = {
				I: id
			};
			socket.send("032"+JSON.stringify(data));
		},
		messengeranswerrequest : function (id, answer) {
			var data = {
				I: id,
				A: answer
			};
			socket.send("028"+JSON.stringify(data));
		},
		room_go : function (id) {
			// go to a room
			var data = {
				I: parseInt(id)
			};
			socket.send("042"+JSON.stringify(data));
		},
		room_chat : function (to, message) {
			//send the chat to the server
			if (message.replace("#", "") != "") {
				var data = {
					T: to,
					M: message.replace("#", "")
				};
				socket.send("051"+JSON.stringify(data));
			}
		},
		room_leave : function () {
			//leave the room
			socket.send("046");
		},
		report : function (message) {
			//send the report
			var data = {
				M: message.replace("#", "")
			};
			socket.send("054"+JSON.stringify(data));
		},
		coupon : function (coupon) {
			//send coupon code
			var data = {
				C: coupon
			};
			socket.send("036"+JSON.stringify(data));
		},
		buyfurni : function (cat, furni, amount, mode, to, message) {
			// buy furniture
			var data = {
				C: cat,
				F: furni,
				A: amount,
				M: mode,
				T: to,
				Me: message
			};
			socket.send("034"+JSON.stringify(data));
		},
		banktransfer : function (to, amount) {
			var data = {
				U: to,
				M: amount
			};
			socket.send("RT"+JSON.stringify(data));
		},
		walkrequest : function (x, y) {
			var data = {
				X: parseInt(x)-1,
				Y: parseInt(y)-1
			};
			socket.send("059"+JSON.stringify(data));
		},
		furni_move : function (id, tile) {
			var data = {
				I: parseInt(id),
				T: tile
			};
			socket.send("050"+JSON.stringify(data));
		},
		furni_turn : function (id) {
			var data = {
				I: parseInt(id)
			};
			socket.send("049"+JSON.stringify(data));
		},
		furni_action : function (id) {
			var data = {
				I: parseInt(id)
			};
			socket.send("069"+JSON.stringify(data));
		},
		furni_pickup : function (id) {
			var data = {
				I: parseInt(id),
				T: "inv"
			};
			socket.send("050"+JSON.stringify(data));
		},
		botkick : function (id) {
			var data = {
				I: parseInt(id)
			};
			socket.send("061"+JSON.stringify(data));
		},
		openchat : function () {
			socket.send("062");
		},
		vote : function (vote) {
			var data = {
				V: vote
			};
			socket.send("065"+JSON.stringify(data));
		},
		getdrink : function (drink) {
			var data = {
				D: drink
			};
			socket.send("073"+JSON.stringify(data));
		},
		navisearch : function (searchtext) {
			var data = {
				S: searchtext
			};
			socket.send("067"+JSON.stringify(data));
		},
		createroom : function (new_name, new_desc, new_type, new_safe, new_pass) {
			var data = {
				N: new_name,
				D: new_desc,
				T: parseInt(new_type),
				S: parseInt(new_safe),
				P: new_pass
			};
			socket.send("070"+JSON.stringify(data));
		},
		openpicture : function (id) {
			var data = {
				I: id
			};
			socket.send("075"+JSON.stringify(data));
		},
		giverights : function (id) {
			var data = {
				I: id
			};
			socket.send("077"+JSON.stringify(data));
		},
		takerights : function (id) {
			var data = {
				I: id
			};
			socket.send("078"+JSON.stringify(data));
		}
	}
};