// CAMERA.JS
// contains the camera code
var camera = {
	camid : null,
	loader : null,
	savepic : null,
	savenum : null,
	picturepic : null,
	pictureloader : null,
	pictureloading : false,
	taking : false,
	saving : false,
	drag : function () {
		if (this.camid != null) {
			HideContent("askcamera");
			furni.dragstart(this.camid);
			this.camid = null;
		}
	},
	open : function () {
		if (this.camid != null) {
			HideContent("askcamera");
			set_top("camera");
			this.reEnable();
			ShowContent("camera");
			this.camid = null;
			packets.send.getdrink("camera");
		}
	},
	take : function () {
		// take picture
		if (this.savenum == null && client.connection && !this.taking && !this.saving) {
			this.taking = true;
			$("cameratake").src = "images/camera/take1.gif";
			camera.loader = getBusyOverlay($("savepic"),{color: 'black', opacity: 0.5},{color: '#fff', size: 48});
			var x = parseInt($("camera").style.left)+29;
			var y = parseInt($("camera").style.top)+24;
			var req = ajaxCreate();
			req.open("GET", "camera.php?id="+room.id+"&x="+x+"&y="+y+"&cx="+resize.width()+"&cy="+resize.height()+"&r="+Math.round(9000*Math.random()), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					camera.savenum = req.responseText;
					camera.savepic = document.createElement("img");
					camera.savepic.src = "cache/camera/"+camera.savenum+".gif";
					camera.savepic.style.border = '1px solid black';
					camera.savepic.style.position = "absolute";
					camera.saveload();
				}
			};
			req.send(null);
		}
	},
	saveload : function () {
		if (this.savepic.complete) {
			// show cached image, and ask to save
			camera.loader.remove();
			camera.taking = false;
			$("savepic").appendChild(this.savepic);
			$("cameradel").src = "images/camera/del2.gif";
			$("camerasave").src = "images/camera/save2.gif";
			$("cameracaptionimg").src = "images/camera/caption2.gif";
			$("camera_caption").value = "";
			ShowContent("camera_caption");
			$("camera_caption").focus();
		}
		else {
			setTimeout(function(){camera.saveload();},10);
		}
	},
	save : function () {
		// save picture
		if (this.savenum != null && client.connection && !this.taking && !this.saving) {
			this.saving = true;
			camera.loader = getBusyOverlay($("savepic"),{color: 'black', opacity: 0.5},{color: '#fff', size: 48});
			var saveid = this.savenum;
			this.captionreg();
			var caption = $("camera_caption").value.replace(/\n/g, "||");
			this.savenum = null;
			this.resetGUI();
			$("cameratake").src = "images/camera/take1.gif";
			var req = ajaxCreate();
			req.open("GET", "camerasave.php?id="+saveid+"&caption="+caption+"&r="+Math.round(9000*Math.random()), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					if (req.responseText == "error") {
						client.notify(texts["camera_savefail"], texts["notify_error"]);
					}
					camera.loader.remove();
					camera.reEnable();
					camera.saving = false;
				}
			};
			req.send(null);
		}
	},
	deletepic : function () {
		if (this.savenum != null && !this.taking) {
			this.reEnable();
		}
	},
	reEnable : function () {
		this.resetGUI();
		removechilds("savepic");
		this.savenum = null;
	},
	resetGUI: function () {
		$("cameratake").src = "images/camera/take2.gif";
		$("cameradel").src = "images/camera/del1.gif";
		$("camerasave").src = "images/camera/save1.gif";
		$("cameracaptionimg").src = "images/camera/caption1.gif";
		HideContent("camera_caption");
		$("trashtext").focus();
	},
	captionreg : function () {
		// check caption input
		var reg = new RegExp("<(.|\n)*?>");
  		$("camera_caption").value = $("camera_caption").value.replace(reg, "");
  		textCounter($('camera_caption'),76);
	},
	showpicture : function (id) {
		if (!this.pictureloading) {
			$('picturecaption').innerHTML = "";
			set_top("picture");
			ShowContent("picture");
			camera.pictureloader = getBusyOverlay($("picturepic"),{color: 'black', opacity: 0.5},{color: '#fff', size: 48});
			packets.send.openpicture(id);
			camera.pictureloading = true;
		}
	},
	loadpicture : function (code, caption) {
		if (this.pictureloading) {
			$('picturecaption').innerHTML = caption;
			camera.picturepic = document.createElement("img");
			camera.picturepic.src = "photos/"+code+".gif";
			camera.picturepic.style.border = '1px solid black';
			camera.picturepic.style.position = "absolute";
			camera.pictureloaded();
		}
	},
	pictureloaded : function () {
		if (this.picturepic.complete) {
			// show cached image
			camera.pictureloader.remove();
			camera.pictureloading = false;
			$("picturepic").appendChild(this.picturepic);
		}
		else {
			setTimeout(function(){camera.pictureloaded();},10);
		}
	}	
};