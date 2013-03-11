// ANIMATE.JS
// this class contains animations
var animate = {
	drop : { // used for dropping furniture
		g : 3.724, // gravitational constant 1/100th scale in px / ms2
		start : function (id, x, y) {
			obj = $(id);
			if (isset(obj.timer)) {
				clearTimeout(obj.timer);
			}
			obj.style.top = document.documentElement.scrollTop-obj.clientHeight+"px";
			obj.style.left = x;
			obj.endpos = y;
			obj.ti = new Date; // record initial time in miliseconds
			
			obj.timer = setTimeout(function(){animate.drop.go(id);},100); // start dropping
		},
		go : function (id) {
			obj = $(id);
			clearTimeout(obj.timer); // clear timeout
			var tc = new Date; // get current time in miliseconds
			var td = tc.getTime() - obj.ti.getTime(); // get difference between timestamps
			var tPos = this.g * td * td / 2500; // determine top position for object
			// if we're not at the bottom, do it again
			if (tPos < obj.endpos) {
				obj.style.top = tPos + "px"; // set object's top position
				obj.timer = setTimeout(function(){animate.drop.go(id);},1); // do it again
			} else {
				obj.b = true;
				obj.style.top = obj.endpos + "px";
				setTimeout(function(){animate.drop.bounce(id);},50);
			}
		},
		bounce : function (id) {
			obj = $(id);
			clearTimeout(obj.timer); // clear timeout
			if (obj.b) {
				obj.b = false;
				obj.style.top = obj.endpos - 5 + "px";
				obj.timer = setTimeout(function(){animate.drop.bounce(id);},100);
			} else {
				obj.style.top = obj.endpos + "px";
			}
		}
	}
};