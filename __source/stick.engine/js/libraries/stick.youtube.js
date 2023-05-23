function stick_youtube( ) {
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	var t=this;
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.getTrailerHTML = function(ytid,autoplay) { 
		"use strict";
		var t=this;
		return '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + ytid + '?rel=0&showinfo=0&modestbranding=1&autoplay=' + autoplay + '&autohide=1&controls=2&wmode=transparent&enablejsapi=1" frameborder="0" allowfullscreen></iframe>';
	};
	
	this.setTrailer = function(tid,ytid,autoplay) {
		"use strict";
		var t=this;
		var thehtml = t.p.getTrailerHTML(ytid,autoplay);
		$(tid).html(thehtml);
	};

}