// CLUB.JS
// Jabbo Club code goes here
var club = {
	member : false,
	restingdays : 0,
	passedmonths : 0,
	restingmonths : 0,
	update : function (clubstatus, days, pm, rm) {
		this.member = clubstatus;
		this.restingdays = days;
		this.passedmonths = pm;
		this.restingmonths = rm;
		if (this.member) {
			client.notify(this.restingdays);
		}
	},
	moreclick : function () {
		setTimeout(function(){club.more();},1);	// the timeout is important for the function that will give the right window the highest z-index to have it shown on top of everything else. Alert boxes work this way as well.
	},
	more : function () {
		set_top('catalogue');
		ShowContent('catalogue');
		if (!catalogue.init_done && !catalogue.loading) {
			catalogue.gowait = "club";
			catalogue.init();
		}
		else {
			this.gocat();
		}
	},
	gocat : function () {
		var len = catalogue.cats.length;
		for (i = 0; i < len; i++) {
			if (catalogue.cats[i].name == "Jabbo Club") {
				catalogue.go(i+1);
			}
		}
	}
}