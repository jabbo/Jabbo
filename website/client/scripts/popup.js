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
	if(data != null) {
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
var omitformtags=["input", "textarea", "select"]
omitformtags=omitformtags.join("|")
function disableselect(e){
if (omitformtags.indexOf(e.target.tagName.toLowerCase())==-1)
return false
}
function reEnable()
{
	return true;
}
if (typeof document.onselectstart!="undefined")
document.onselectstart=new Function ("return false")
else
{
	document.onmousedown=disableselect
	document.onmouseup=reEnable
}
function clickIE4()
{
	if (event.button==2)
	{
		return false;
	}
}
function clickNS4(e) {
	if (document.layers||document.getElementById&&!document.all) {
		if (e.which==2||e.which==3) {
			return false;
		}
	}
}
if (document.layers) {
	document.captureEvents(Event.MOUSEDOWN);
	document.onmousedown=clickNS4;
}
else if (document.all&&!document.getElementById) {
	document.onmousedown=clickIE4;
}
document.oncontextmenu=new Function("return false;")
function popup_count() {
	var req = ajaxCreate();
	req.open("GET", "popup.php?r="+Math.round(9000*Math.random()), true);
	req.onreadystatechange = function() { if (req.readyState == 4) document.getElementById("count_jabbos").innerHTML = req.responseText; }
	req.send(null);
}
setInterval(function(){popup_count();}, 60000);

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
	    var element = document.getElementById(el);
	    if (element) {
		    element.style.width = changeX+'px';
		    element.style.height = changeY+'px';
   		}
    },
	resize : function () {
		resize.changeDim("clientembed", resize.width(), resize.height()-30);
		resize.changeDim("the_iframe", resize.width(), resize.height()-30);
		if (document.getElementById("logo")) {
			document.getElementById("logo").style.width = (resize.width()/2)-140+'px';
		}
	}
}

function addEvent(obj, eventType, fn, useCapture)
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
addEvent(window, 'resize', resize.resize);
addEvent(window, 'load', resize.resize);