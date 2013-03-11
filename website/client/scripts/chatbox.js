// CHATBOX.JS
// contains the global chatbox code
var chatbox = {
	opened : false,
	open : function () {
		if (!room.loading) {
			if (!chatbox.opened) {
				$('chatbox_text').innerHTML = "";
				ShowContent("chatbox_load");
				chatbox.opened = true;
				chatbox.update();
				set_top('chatbox');
				ShowContent('chatbox');
				$("chatbox_input").focus();
			}
		}
	},
	close : function () {
		if (this.opened) {
			this.opened = false;
			HideContent('chatbox');
		}
	},
	reverse : function () {
		if (this.opened) {
			this.close();
		}
		else {
			this.open();
		}
	},
	update : function () {
		if (client.connection && this.opened) {
			var req = ajaxCreate();
			req.open("GET", "action.php?method=chat&r="+Math.round(9000*Math.random()),true);
			req.onreadystatechange = function()
			{
				if (req.readyState == 4)
				{
					$('chatbox_text').innerHTML = "<table border='0' class='clientfont'>"+req.responseText+"</table>";
		        	$('chatbox_text').scrollTop = $('chatbox_text').scrollHeight;
		        	HideContent("chatbox_load");
		        	setTimeout(function(){chatbox.update()},500)
				}
			}
			req.send(null);
		}
	},
	go : function () {
		if (client.connection && this.opened) {
			var chattext = $('chatbox_input').value;
			$('chatbox_input').value = "";
     		$('chatbox_input').focus();
			var req = ajaxCreate();
			req.open("POST", "action.php?method=chat&r="+Math.round(9000*Math.random()),true);
			req.onreadystatechange = function()
			{
				if (req.readyState == 4)
				{
					$('chatbox_text').innerHTML = "<table border='0' class='clientfont'>"+req.responseText+"</table>";
		        	$('chatbox_text').scrollTop = $('chatbox_text').scrollHeight;
				}
			}
			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    		req.send("text="+chattext);
		}
	}
};