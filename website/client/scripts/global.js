// GLOBAL.JS
// contains functions and data that are used globally around the client
var user = {
	logged_in : false,
	id : 0,
	name : "",
	rights : new Array(),
	money : 0,
	badge : 0,
	badges : 0,
	email : "",
	clothes : "",
	mission : "",
	messenger : "",
	sessionearned : 0
};
var Core = {
	CatchEnter : function (e, type) {
		try {
			var characterCode = e.keyCode;
			if(characterCode == 13) {
				switch(type) {
					case "roomchat":
						room.chat.new_chat();
						return false;
					break;
					case "chatbox":
						chatbox.go();
						return false;
					break;
					case "login":
						login.attempt();
						return false;
					break;
					case "debug":
						debug.userinput();
						return false;
					case "messenger":
						messenger.search();
						return false;
					case "navi":
						navi.search();
						return false;
					break;
					default:
						return true;
					break;
				}
			}
			return true;
		}
		catch(err) {
			return true;
		}
	}
};
// AJAX HANDLERS
function ajaxCreate() {
	try {
		if(window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
		else if(window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	catch (e) {
		return false;
	}
}
function ajaxSync(url, data) {
	var req = ajaxCreate();
	if(data != null)  {
		req.open("POST", url, false);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.setRequestHeader("Content-length", data.length);
	}
	else {
		req.open("GET", url, false);
	}
	req.send(data);
	return req;
}
function ajaxAsync(url, data, callback) {
	var req = ajaxCreate();
	if (data != null) {
		req.open("POST", url, true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.setRequestHeader("Content-length", data.length);
	}
	else {
		req.open("GET", url, true);
	}
	req.onreadystatechange = function() { if(req.readyState == 4) callback.complete(req); };
	req.send(data);
	return req;
}
// RUN EXTERNAL JAVASCRIPT
function open_script(script_location) {
	if (client.connection) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = script_location;
		try {
			document.getElementsByTagName('head').item(0).appendChild(script);
		}
		catch(err) {
			debug.error("Runscript Error: "+err.description);
		}
	}
}
// RUN JAVASCRIPT CODE, better than eval()
function run_script(jscode) {
	if (client.connection) {
		var script = document.createElement("script");
		script.type = "text/javascript"; 
		script.text = jscode;
		try {
			document.getElementsByTagName('head').item(0).appendChild(script);
		}
		catch(err) {
			debug.error("Run_script Error: "+err.description);
		}
	}
}
// get and run external scripts through ajax
function get_script(url) {
	if (client.connection) {
		var req = ajaxCreate();
		req.open("GET", url, true);
		req.onreadystatechange = function() { if (req.readyState == 4) run_script(req.responseText); };
		req.send(null);
	}
}
var client_button = 0;
var alert_nr = 0; // notify box id
var ctrl_status = false; // is CTRL pressed?
var alt_status = false; // is ALT pressed?
var fading = false;
function get_top() {
	// get highest z-index in a cheap manner: just add 1
	client.z_top++;
	return(client.z_top);
}
function set_top(el) {
	$(el).style.zIndex = ((get_top())*1)+1;
}
function get_top_real() {
	// get highest z-index in a real but CPU intensive manner: walk through every object
	if (document.all) {
		topZ = 0;
		for (i = 0; i < document.all.length; i++) {
			dit_element = document.all(i);
			topZ = Math.max(dit_element.style.zIndex, topZ);
		}
	}
	else {
		alles = new Array();
		alles = document.getElementsByTagName('*');
		topZ = 0;
		for (i = 0; i < alles.length; i++) {
			dezeZ = alles[i].style.zIndex;
			if (dezeZ == '') {
				dezeZ = 0;
			}
			if (parseInt(dezeZ) > parseInt(topZ)) {
				topZ = dezeZ;
			}
		}
	}
	return(topZ);
}
function stop_tclick() {
	// make tiles unclickable
	if (client.mode == "room") {
		// we're in a room
		HideContent('tile_hover');
		room.tiles.click = false;
	}
}
function start_tclick() {
	// make tiles clickable
	if (client.mode == "room") {
		room.tiles.click = true;
	}
}
function add_alert(alert_title, alert_message, alert_icon) {
	// a new alert box!
	alert_nr++;
	client_button++;
	var alert_call = "alert_"+alert_nr;
	var new_alert = document.createElement("div");
	new_alert.id = alert_call;
	new_alert.style.position = "absolute";
	new_alert.style.left = 0;
	new_alert.style.top = 0;
	new_alert.style.zIndex = ((get_top())*1)+1;
	new_alert.style.visibility="hidden";
	new_alert.innerHTML = "<table border='0' cellpadding='0' cellspacing='0'><tr><td width='17' height='35' style='background: url(\"images/alert/left_top.gif\");' onmousedown='dragStart(event, \""+alert_call+"\")'></td><td height='35' style='background: url(\"images/alert/center_top.gif\") repeat-x; padding: 4px 0px 0px 0px;' valign='top' align='middle' onmousedown='dragStart(event, \""+alert_call+"\")'><table border='0' height='15' cellpadding='0' cellspacing='0' style='font-weight: bold;'><tr><td width='4'></td><td><div style='padding: 2px 4px 2px 4px; color: #eeeeee; background-color: #6794a7; font-weight: bold;' class='eigenfont'>"+alert_title+"</div></td><td width='4'></td></tr></table></td><td width='18' height='35' style='background: url(\"images/alert/right_top.gif\");' onmousedown='dragStart(event, \""+alert_call+"\")'></td></tr><tr><td width='17' height='50' style='background: url(\"images/alert/left_center.gif\");'></td><td bgcolor='#efefef' align='middle' class='clientfont'>&nbsp;&nbsp;"+alert_message+"&nbsp;&nbsp;</td><td width='18' height='50' style='background: url(\"images/alert/right_center.gif\");'></td></tr><tr><td width='17' height='30' style='background: url(\"images/alert/left_center.gif\");'></td><td bgcolor='#efefef' align='middle'><table id='c_knop_"+client_button+"' onclick='del_alert("+client_button+")' onmousedown='button_down("+client_button+",2,true)' onmouseup='button_up("+client_button+",2,true)' onmouseout='button_up("+client_button+",2,true)' border='0' cellpadding='0' cellspacing='0'><tr><td width='11' height='23'><img id='c_knop_"+client_button+"_left' src='images/buttons/2_left1.gif'></td><td id='c_knop_"+client_button+"_center' height='23' style='background: url(\"images/buttons/2_center1.gif\") repeat-x; padding: 5px 0px 0px 0px;' valign='top'><div id='c_knop_"+client_button+"_text' class='eigenfont' style='color: #000000;'><b>"+texts["notify_ok"]+"</b></div></td><td width='11' height='23'><img id='c_knop_"+client_button+"_right' src='images/buttons/2_right1.gif'></td></tr></table></td><td width='18' height='30' style='background: url(\"images/alert/right_center.gif\");'></td></tr><tr><td width='17' height='17' style='background: url(\"images/alert/left_bottom.gif\");'></td><td style='background: url(\"images/alert/center_bottom.gif\") repeat-x;'></td><td width='18' height='17' style='background: url(\"images/alert/right_bottom.gif\");'></td></tr></table>";
	addEvent(new_alert, 'mouseover', function() { stop_tclick(); });
	addEvent(new_alert, 'mouseout', function() { start_tclick(); });
	addEvent(new_alert, 'click', function() { set_top(alert_call); });
	$("alerts").appendChild(new_alert);
	var object = $(alert_call);
	setTimeout(function(){object_center(alert_call); fade_in(alert_call, false); object.style.visibility = "visible";object.style.width = object.clientWidth; object.style.height = object.clientHeight;},0);
}
function del_alert(id) {
	var this_alert = $("alert_"+id);
	if (this_alert) {
		var callback = del_alert2(this_alert);
		fade_out("alert_"+id, callback);
	}
}
function del_alert2(this_alert) {
	var output = new Object();
	output.complete = function() {
		$("alerts").removeChild(this_alert);
		start_tclick();
	};
	return output;
}
// client button handlers
function button_down(button_nr, button_type, client) {
	if (client) {
		$("c_knop_"+button_nr+"_left").src = "images/buttons/"+button_type+"_left2.gif";
		$("c_knop_"+button_nr+"_center").style.background = "url(images/buttons/"+button_type+"_center2.gif) repeat-x";
		$("c_knop_"+button_nr+"_right").src = "images/buttons/"+button_type+"_right2.gif";
	}
	else {
		$("knop_"+button_nr+"_left").src = "images/buttons/"+button_type+"_left2.gif";
		$("knop_"+button_nr+"_center").style.background = "url(images/buttons/"+button_type+"_center2.gif) repeat-x";
		$("knop_"+button_nr+"_right").src = "images/buttons/"+button_type+"_right2.gif";
	}
}
function button_up(button_nr, button_type, client) {
	if (client) {
		$("c_knop_"+button_nr+"_left").src = "images/buttons/"+button_type+"_left1.gif";
		$("c_knop_"+button_nr+"_center").style.background = "url(images/buttons/"+button_type+"_center1.gif) repeat-x";
		$("c_knop_"+button_nr+"_right").src = "images/buttons/"+button_type+"_right1.gif";
	}
	else {
		$("knop_"+button_nr+"_left").src = "images/buttons/"+button_type+"_left1.gif";
		$("knop_"+button_nr+"_center").style.background = "url(images/buttons/"+button_type+"_center1.gif) repeat-x";
		$("knop_"+button_nr+"_right").src = "images/buttons/"+button_type+"_right1.gif";
	}
}
// animate movement
function movelayer(layername, endposx, endposy, steps, intervals, powr, movecallback)
{
	var move_layer = $(layername);
	if (!move_layer.currentPos) {
		move_layer.currentPos = [parseInt(move_layer.style.left),parseInt(move_layer.style.top)];
	}
	domovelayer(move_layer,move_layer.currentPos,[endposx,endposy],steps,intervals,powr,movecallback);
}
function easeInOut(minValue,maxValue,totalSteps,actualStep,powr)
{
	var delta = maxValue - minValue;
	var stepp = minValue+(Math.pow(((1 / totalSteps)*actualStep),powr)*delta);
	return Math.ceil(stepp);
}
function domovelayer(elem,startPos,endPos,steps,intervals,powr,movecallback)
{
	if (elem.posChangeMemInt) window.clearInterval(elem.posChangeMemInt);
	var actStep = 0;
	elem.posChangeMemInt = window.setInterval(
		function() {
			elem.currentPos = [
				easeInOut(startPos[0],endPos[0],steps,actStep,powr),
				easeInOut(startPos[1],endPos[1],steps,actStep,powr)
				];
			elem.style.left = elem.currentPos[0]+"px";
			elem.style.top = elem.currentPos[1]+"px";
			actStep++;
			if (actStep > steps)
			{
				elem.currentPos = null;
				window.clearInterval(elem.posChangeMemInt);
				if (movecallback)
				{
					movecallback.complete();
				}
			}
		}
		,intervals);
}
function set_trans(el, trans) { // set opacity of an object
	var object = $(el).style;
	object.opacity = trans;
	object.MozOpacity = trans;
	object.KhtmlOpacity = trans;
	object.filter = "alpha(opacity="+trans*100+")";
}
function fade_in(el, callback) { // do a fade in
	if ($(el))
	{
		set_trans(el, 0);
		ShowContent(el);
		do_fade_in(el, callback);
	}
}
function fade_out(el, callback) // do a fade out
{
	if ($(el))
	{
		set_trans(el, 1);
		ShowContent(el);
		do_fade_out(el, callback);
	}
}
function do_fade_in(el, callback)
{
	if ($(el))
	{
		var opacity = parseFloat($(el).style.opacity);
		if (opacity > 0.84)
		{
			set_trans(el, 1);
			if (callback)
			{
				callback.complete();
			}
		}
		else
		{
			opacity = opacity + 0.15;
			set_trans(el, opacity);
			setTimeout(function(){do_fade_in(el, callback);}, 50);
		}
	}
	return true;
}
function do_fade_out(el, callback)
{
	if ($(el))
	{
		var opacity = parseFloat($(el).style.opacity);
		if (opacity < 0.16)
		{
			set_trans(el, 0);
			if (callback)
			{
				callback.complete();
			}
		}
		else
		{
			opacity = opacity - 0.15;
			set_trans(el, opacity);
		    setTimeout(function(){do_fade_out(el, callback);}, 50);
		}
	}
	return true;
}
function createCookie(name,value,days) { // create a cookie
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) { // read a cookie
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) { // remove a cookie
	createCookie(name,"",-1);
}
function addEvent(obj, eventType, fn, useCapture) // add event listener
{
    if (obj.addEventListener) {
        obj.addEventListener(eventType, fn, useCapture);
        return true;
    } else {
        if (obj.attachEvent) {
            var r = obj.attachEvent("on"+eventType, fn);
            return r;
        }
    }
}
function isset(what) { // port of PHP function
	return Boolean(typeof what != 'undefined' && what);
}
function object_center(el) { // center an object according to client width and height
	var object = $(el);
	if (object) {
		object.style.left = Math.ceil((document.documentElement.scrollLeft+document.body.clientWidth-object.clientWidth)/2)+"px";
		object.style.top = Math.ceil((document.documentElement.scrollTop+document.body.clientHeight-object.clientHeight)/2)+"px";
	}
	return true;
}
function object_center2(el, width, height) { // center an object according to given width and height
	var object = $(el);
	if (object) {
		object.style.left = Math.ceil((document.documentElement.scrollLeft+document.body.clientWidth-width)/2)+"px";
		object.style.top =  Math.ceil((document.documentElement.scrollTop+document.body.clientHeight-height)/2)+"px";
	}
	return true;
}
function HideContent (div) { // Hide a dive by setting display:none
	if(typeof(div) == "object") {
		try
		{
			for(var i = 0; i < div.length; i++)
			{
				if($(div[i])) $(div[i]).hide();
				else debug.error("Couldn't hide: " + div[i]);
			}
		}
		catch (err)
		{
			debug.error(err);
		}
	}
	else if(typeof(div) == "string")
	{
		if($(div)) $(div).hide();
		else debug.error("Couldn't hide: " + div);
	}
	else debug.error("Very strange error in HideContent!");
}
function ShowContent(d) {
	if (d.length < 1) {
		return;
	}
	if ($(d)) {
		$(d).style.display = "";
	}
	else {
		debug.error("Couldn't show '"+d+"'");
	}
}
function ReverseContent(d) {
	if (d.length < 1) {
		return;
	}
	if ($(d).style.display == "none") {
		ShowContent(d);
	}
	else {
		HideContent(d);
	}
}
function fade_out_done(d)
{
	var output = new Object();
	output.complete = function()
	{
		HideContent(d);
		fading = false;
	};
	return output;
}
function fade_in_done()
{
	var output = new Object();
	output.complete = function()
	{
		fading = false;
	};
	return output;
}
function reverse_fade(d)
{
	if (d.length < 1)
	{
		return;
	}
	if ($(d).style.display == "none")
	{
		fading = true;
		var callback = fade_in_done();
		fade_in(d, callback);
	}
	else
	{
		fading = true;
		var callback = fade_out_done(d);
		fade_out(d, callback);
	}
}
function in_array(search_term, search_in)
{
	var i = search_in.length;
	if (i > 0) {
		do {
			if (search_in[i] === search_term) {
				return true;
			}
		} while (i--);
	}
	return false;
}
function textCounter(field, maxlimit)
{
	if (field.value.length > maxlimit) {
		field.value = field.value.substring(0, maxlimit);
	}
}
function isValidEmail(str) {
	return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}
function arr_dump(arr,level) // PHP print_r equivalent
{
	var dumped_text = "";
	if(!level)
	{
		level = 0;
	}
	var level_padding = "";
	for (var j=0; j<level; j++)
	{
		level_padding += "    ";
	}
	if(typeof(arr) == 'object')
	{
		for(var item in arr)
		{
			value = arr[item];
			if(typeof(value) == 'object')
			{
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += arr_dump(value,level);
			}
			else
			{
				dumped_text += level_padding + "    '" + item + "' => \"" + value + "\"\n";
			}
		}
	}
	else
	{
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
function removechilds(layer) // remove a child nodes of a div
{
	var holder = $(layer);
	while(holder.hasChildNodes()) {
		holder.removeChild(holder.lastChild);
	}
}
function htmlEntities(str) { // php equivalent
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function ucfirst (str) { // php equivalent
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}
var max_window_x, max_window_y;
function dragStart(event, id) {  // this function makes divs draggable: all windows like navigator and camera use it, furni doesn't
	var el;
	var x, y;
	if (id)
	{
		dragObj.elNode = $(id);
	}
	else
	{
		dragObj.elNode = document.all ? window.event.srcElement : event.target;
		if (dragObj.elNode.nodeType == 3)
		{
			dragObj.elNode = dragObj.elNode.parentNode;
		}
	}
	x = document.all ? window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft : event.clientX + window.scrollX;
	y = document.all ? window.event.clientY + document.documentElement.scrollTop + document.body.scrollLeft : event.clientY + window.scrollY;
	var dragwindow_width = parseInt(dragObj.elNode.style.width);
	var dragwindow_height = parseInt(dragObj.elNode.style.height);
	max_window_x = resize.width() - dragwindow_width + 10;
	if (id != "camera") {
		max_window_y = resize.height() - dragwindow_height + 10;
	}
	else {
		max_window_y = resize.height() - 150;
	}
	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
	dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
	if (isNaN(dragObj.elStartLeft))
	{
		dragObj.elStartLeft = 0;
	}
	if (isNaN(dragObj.elStartTop))
	{
		dragObj.elStartTop  = 0;
	}
	x = dragObj.elStartLeft + x - dragObj.cursorStartX;
	y = dragObj.elStartTop  + y - dragObj.cursorStartY;
	if (x < -10) {
		x = -10;
	}
	if (x > max_window_x) {
		x = max_window_x;
	}
	if (y < -10) {
		y = -10;
	}
	if (y > max_window_y) {
		y = max_window_y;
	}
	set_top(id); 
	if (document.all)
	{
		document.attachEvent("onmousemove", dragGo);
		document.attachEvent("onmouseup",   dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", dragGo,   true);
		document.addEventListener("mouseup",   dragStop, true);
		event.preventDefault();
	}
}
function dragGo(event)
{
	var x, y;
	x = document.all ? window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft : event.clientX + window.scrollX;
	y = document.all ? window.event.clientY + document.documentElement.scrollTop + document.body.scrollLeft : event.clientY + window.scrollY;
	x = dragObj.elStartLeft + x - dragObj.cursorStartX;
	y = dragObj.elStartTop  + y - dragObj.cursorStartY;
	if (x < -10) {
		x = -10;
	}
	if (x > max_window_x) {
		x = max_window_x;
	}
	if (y < -10) {
		y = -10;
	}
	if (y > max_window_y) {
		y = max_window_y;
	}
	dragObj.elNode.style.left = x+"px";
	dragObj.elNode.style.top  = y+"px";
	if (document.all)
	{
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		event.preventDefault();
	}
}
function dragStop(event)
{
	if (document.all)
	{
		document.detachEvent("onmousemove", dragGo);
		document.detachEvent("onmouseup",   dragStop);
	}
	else
	{
		document.removeEventListener("mousemove", dragGo, true);
		document.removeEventListener("mouseup", dragStop, true);
	}
}
function checkKeycode(e) // what key was pressed and handle actions
{
	var keycode;
	if (window.event) {
		keycode = window.event.keyCode;
	}
	else {
		if (e) {
			keycode = e.which;
		}
	}
	if (keycode == 112 || keycode == 114 || keycode == 116 || keycode == 118 || keycode == 122) {
		if (keycode != 116) {
			if (document.all) {
				$('trashtext').focus();
				event.keyCode = 0;
			}
			else {
				e.stopPropagation();
				e.preventDefault();
			}
		}
		else {
			// do a reload (F5)
			client.mode = "main";
			location.reload();
		}
		return false;
	}
	if (keycode == 17) {
		ctrl_status = true;
	}
	if (keycode == 18) {
		alt_status = true;
	}
	if (keycode == 33) {
		// PageUp, show debug and prevent other actions
		if (document.all) {
			$('trashtext').focus();
			event.keyCode = 0;
		}
		else {
			e.stopPropagation();
			e.preventDefault();
		}
		debug.show();
	}
	client.clicked(); // keyboard input makes client active
}
function checkKeys() {
	ctrl_status = false;
	alt_status = false;
}
var dragObj = new Object();
dragObj.zIndex = 0;
document.onkeydown = checkKeycode;
document.onkeyup = checkKeys;
var omitformtags=["input", "textarea", "select"];
omitformtags=omitformtags.join("|");
function disableselect(e)
{
	if (omitformtags.indexOf(e.target.tagName.toLowerCase())==-1)
	{
		return false;
	}
}
function reEnable() {
	return true;
}
if (typeof document.onselectstart!="undefined") {
	document.onselectstart=new Function ("return false");
}
else {
	document.onmousedown = disableselect;
	document.onmouseup = reEnable;
}
function clickIE4()
{
	if (event.button==2)
	{
		return false;
	}
}
function clickNS4(e)
{
	if (document.layers||$&&!document.all)
	{
		if (e.which==2||e.which==3)
		{
			return false;
		}
	}
}
if (document.layers) {
	document.captureEvents(Event.MOUSEDOWN);
	document.onmousedown=clickNS4;
}
else if (document.all&&!$) {
	document.onmousedown=clickIE4;
}
document.oncontextmenu=new Function("return false;");
addEvent(document, 'click', client.clicked);
function removeWho(who) {
	if(typeof who== 'string') who=$(who);
	if(who && who.parentNode)who.parentNode.removeChild(who);
}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
var speed = { // a timer to see how much time a certain function takes
	start:function (){
	    speedDate = new Date();
	    speedTime  = speedDate.getTime();
	},
	stop:function (){
	    speedDate = new Date();
	    return (speedDate.getTime()-speedTime);
	}
}
var tijdstip = last_active = 0;
setInterval(function(){tijdstip++;}, 1000);
window.offscreenBuffering = true;
addEvent(window, 'load', client.init); // initialize the client when ready!