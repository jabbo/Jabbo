var lib = {
	// script that calls for extra scripts in scripts/libraries when needed, makes sure they are only called once
	loaded : new Array(),
	load : function (lib) {
		if (!in_array(lib, this.loaded)) {
			get_script("js.php?lib="+lib);
			this.loaded.push(lib);
		}
	}
};
