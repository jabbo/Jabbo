var resize = {
	width: function() {
        var myWidth = 0;
        if (typeof(window.innerWidth) == 'number') {
            //Non-IE
            myWidth = window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
        }
        else if (document.body && document.body.clientWidth) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
        }
        return myWidth;
    },
    height: function() {
        var myHeight = 0;
        if (typeof(window.innerHeight) == 'number') {
            //Non-IE
            myHeight = window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
            //IE 6+ in 'standards compliant mode'
            myHeight = document.documentElement.clientHeight;
        }
        else if (document.body && document.body.clientHeight) {
            //IE 4 compatible
            myHeight = document.body.clientHeight;
        }
        return myHeight;
    },
    changeDim : function (el, changeX, changeY) {
	    var element = $(el);
	    if (element) {
		    element.style.width = changeX+'px';
		    element.style.height = changeY+'px';
   		}
    },
	changePos : function (el, changeX, changeY) {
	    var element = $(el);
	    if (element) {
		    element.style.left = changeX;
		    element.style.top = changeY;
	    }
    },
	resize : function () {
		object_center('preload_logo');
		object_center2('backview', '1258', '992');
		this.changeDim("main_black_div", this.width(), this.height());
		this.changeDim("main_black_1", this.width(), this.height()/2);
		this.changeDim("main_black_2", this.width(), this.height()/2);
		if ($('main_black_2')) {
			$('main_black_2').style.top = this.width()/2;
		}
		this.changeDim("block", this.width(), this.height());
		this.changeDim("loadview", this.width(), this.height());
		this.changeDim("loadtable", this.width(), this.height());
		this.changeDim("connection_lost_layer", this.width(), this.height());
		this.changeDim("connection_lost_transp", this.width(), this.height());
		this.changeDim("room_div", this.width(), this.height());
		this.changeDim("room_back", this.width(), this.height());
		this.changeDim("load_layer", this.width(), this.height());
		this.changeDim("kopen", this.width(), this.height());
		this.changeDim("matic_back", this.width(), this.height());
		
		
		this.changePos("register_box", this.width()-276, this.height()-400);
		this.changePos("login_box", this.width()-276, this.height()-270);
		this.changePos("laadbar", (this.width()/2)-214, this.height()-35);
		this.changePos("podium", this.width()-178, this.height()-176);
		this.changePos("infopop", this.width()-95, this.height()-243);
		this.changePos("infobadge", this.width()-155, this.height()-193);
		
		if ($('debug_screen')) {
			$('debug_screen').style.width = this.width()+'px';
		}
		if ($('debug_trans')) {
			$('debug_trans').style.width = this.width()+'px';
		}
		if ($('debug_text')) {
			$('debug_text').style.width = this.width()+'px';
		}
		if ($('debug_inputlayer')) {
			$('debug_inputlayer').style.width = this.width()+'px';
		}
		if ($('toolbar_container')) {
			$('toolbar_container').style.width = this.width()+'px';
			$('toolbar_container').style.top = this.height()-55;
		}
		if ($('toolbar_div')) {
			$('toolbar_div').style.width = this.width()+'px';
		}
		if ($('toolbar_icons')) {
			$('toolbar_icons').style.width = this.width()+'px';
		}
		if ($('buttons')) {
			$('buttons').style.width = (this.width()-8)+'px';
			$('buttons').style.top = this.height()-72;
		}
		if ($('roomtoolbar')) {
			$('roomtoolbar').style.width = this.width()+'px';
			$('roomtoolbar').style.top = this.height()-50;
		}
		if ($('roominfo1')) {
			$('roominfo1').style.top = this.height()-118;
		}
		if ($('roominfo2')) {
			$('roominfo2').style.top = this.height()-104;
		}
		if ($('vote_bad')) {
			$('vote_bad').style.top = this.height()-86;
		}
		if ($('vote_good')) {
			$('vote_good').style.top = this.height()-86;
		}
		if ($('vote_text')) {
			$('vote_text').style.top = this.height()-86;
		}
		if ($('voted_text')) {
			$('voted_text').style.top = this.height()-85;
		}
		if ($('roomchat')) {
			room.chat.expand();
			if ($('roomchat').value == texts["room_chatclick"]) {
				$("roomchat").style.width = (this.width()-380)+'px';
			}
		}
		if ($('matic')) {
			$('matic').style.top = this.height()-477;
			$("matic").style.left = (this.width()/2)-162;
		}
		if ($('inventory_back')) {
			$("inventory_back").style.left = this.width()-182;
		}
		if ($('inventory_next')) {
			$("inventory_next").style.left = this.width()-132;
		}
		if ($('inventory_close')) {
			$("inventory_close").style.left = this.width()-84;
		}
		var inv_open = inv.open;
		room.reload();
		if ($('inventory')) {
			if (inv_open) {
				inv.open = true;
				$("inventory").style.left = this.width()-267;
				inv.content('open');
			}
			else {
				$("inventory").style.left = this.width();
			}
		}
	}
}
Event.observe(window, "resize", function() {
	resize.resize();
});