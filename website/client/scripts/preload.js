var preload = {
	img : new Array(),
	loaded : new Array(),
	count : 0,
	init : function() {
		var len = preImg.length;
		for (var i = 0; i < len; i++) {
			this.img[i] = document.createElement('img');
	        this.img[i].setAttribute('src', preImg[i]);
		}
		var len = this.img.length;
		for (i = 0; i < len; i++) {
			this.loaded[i] = false;
		}
		this.load();
	},
	adjustbar : function() {
		var procent = Math.floor((this.count*100)/preImg.length);
		$("grijsbar").style.width = procent+"%";
		$("zwartbar").style.width = (100-procent)+"%";
	},
	load : function() {
		var len = this.img.length;
		if (this.count == len) {
			this.adjustbar();
			client.loaded();
			return;
		}
		for (i = 0; i <= len; i++) {
			if (this.loaded[i] == false && this.img[i].complete) {
				this.adjustbar();
				this.loaded[i] = true;
				this.count++;
			}
		}
		setTimeout(function(){preload.load();},10);
	}
};