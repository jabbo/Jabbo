var debug = {
	active : false,
	shown : function () {
		if ($('debug_screen').style.display != "none") {
			return true;
		}
		else {
			return false;
		}
	},
	show: function() {
    	set_top('debug_screen');
	    ReverseContent('debug_screen');
	    this.scrolldown();
	    if (this.shown()) {
			$("debug_input").focus();
		}
		else {
			start_tclick();
		}
    },
    scrolldown : function () {
	    if (this.shown()) {
		    $('debug_text').scrollTop = $('debug_text').scrollHeight;
	    }
    },
    write_debug : function(text, color) {
	    if (text != "") {
		    $('debug_text').innerHTML += "<br><font color='"+color+"'>"+htmlEntities(text)+"</font>";
        	this.scrolldown();
    	}
    },
    writedirect : function(text, color) {
	    if (text != "") {
		    $('debug_text').innerHTML += "<br><font color='"+color+"'>"+text+"</font>";
        	this.scrolldown();
    	}
    },
    add: function(text) {
	    this.write_debug(text, "white");
    },
    error: function(text) {
	    this.write_debug(text, "red");
    },
    yellow: function(text) {
	    this.write_debug(text, "yellow");
    },
    green: function(text) {
	    this.write_debug(text, "#01eb01");
    },
    userinput: function () {
	    var debug_parse = $('debug_input').value;
		if (debug_parse.length > 1)
		{
			this.yellow(debug_parse);
			var command = debug_parse.substr(0,1);
			var data = debug_parse.substr(1);
			switch(command)
			{
			case ">":
				// send packet to server
				socket.send(data);
				break;    
			case "<":
				// parse virtual packet clientside
				packets.receive(data);
				break;
			case "!":
				// run JS code clientside
				try {
					eval(data);
				}
				catch(err) {
					debug.error("Error: "+err.description);
				}				
				break;
			case "?":
				// alert content of a variable
				try {
					eval("client.notify("+data+", 'Debug');");
				}
				catch(err) {
					debug.error("Error: "+err.description);
				}				
				break;
			case "(":
				packets.send.globalalert(data);
				break;
			case ":":
				// special debug command
				switch(data.split(" ")[0]) {
				case "on":
					this.active = true;
					break;
				case "off":
					this.active = false;
					break;
				case "dump":
					client.notify("<div style='background-color: black; width: 550px; height: 350px; overflow: scroll; overflow: auto;' align='left'>"+$('debug_text').innerHTML+"</div>", "Debug Dump");
					break;
				case "reload":
					window.location.reload();
					break;
				case "clear":
					$('debug_text').innerHTML = "<font color='yellow'>Jabbo client - debug</font>";
					break;
				case "count":
					furni.manager.check();
					break;
				case "ram":
					packets.send.requestram();
					break;
				case "openchat":
					packets.send.openchat();
					break;
				case "roomid":
					navi.byid(data.substr(7));
					break;
				case "help":
					this.writedirect("<u>Debug usage:</u><br>> send packet<br>< receive packet<br>! execute code<br>( global alert<br>? check value<br>: use command: on-off-dump-reload-clear-count-ram-openchat-roomid-help", "yellow");
					break;
				default:
					this.error("Unknown debug command");
				}
				break;
			case "+":
				// load library
				lib.load(data);
				break;
			default:
				this.error("Unknown command");
			}
			$('debug_input').value = "";
		}
    }
};