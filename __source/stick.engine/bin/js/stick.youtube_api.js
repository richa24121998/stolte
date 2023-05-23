function stick_youtube_api( ) {
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	var t=this;
	var ytid='';
	var container_name='';
	var yt_player;
	var autoplay;
	
	var CB_ENDED=null;
	var CB_PLAYING=null;
	var CB_PAUSED=null;
	var CB_BUFFERING=null;
	var CB_CUED=null;
	
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.init = function(ytid,container_name,autoplay) { //autoplay: 1 or 0
		"use strict";
		var t=this;
		t.p.ytid = ytid;
		t.p.container_name=container_name;
		t.p.autoplay = autoplay;
		
		t.p.yt_player = new YT.Player(t.p.container_name, {
		  height: '100%',
		  width: '100%',
		  videoId: t.p.ytid,
		  playerVars:{ 'controls':2,'rel':0,'showinfo':0,'modestbranding':1,'fs':1,'autoplay':t.p.autoplay},
		  events: {
			'onStateChange': function (e) { 
				t.p.vid_onPlayerStateChange(e,t);
			},
			'onPlaybackQualityChange': null,
			'onPlaybackRateChange': null,
			'onError': null,
			'onApiChange': null
			}
		});
	};
	this.playVideo = function() { 
		"use strict";
		var t=this;
		t.p.yt_player.playVideo();
	};
	this.setCBEnded = function (f) { 
		"use strict";
		var t=this;
		t.p.CB_ENDED=f;
	};
	this.setCBPlaying = function (f) { 
		"use strict";
		var t=this;
		t.p.CB_PLAYING=f;
	};
	this.setCBPaused = function (f) { 
		"use strict";
		var t=this;
		t.p.CB_PAUSED=f;
	};
	this.setCBBuffering = function (f) { 
		"use strict";
		var t=this;
		t.p.CB_BUFFERING=f;
	};
	this.setCBCued = function (f) { 
		"use strict";
		var t=this;
		t.p.CB_CUED=f;
	};
	this.vid_onPlayerStateChange = function(event,t) {
		"use strict";
		//var t=this;
		//trace(event);
		//trace(t);
		switch (event.data) { 
			case YT.PlayerState.ENDED:
				if (typeof t.p.CB_ENDED === "function") {
					t.p.CB_ENDED();
				}
				break;
			case YT.PlayerState.PLAYING:
				if (typeof t.p.CB_PLAYING === "function") {
					t.p.CB_PLAYING();
				}
				break;
			case YT.PlayerState.PAUSED:
				if (typeof t.p.CB_PAUSED === "function") {
					t.p.CB_PAUSED();
				}
				break;
			case YT.PlayerState.BUFFERING:
				if (typeof t.p.CB_PLAYING === "function") {
					t.p.CB_PLAYING();
				}
				break;
			case YT.PlayerState.CUED:
				if (typeof t.p.CB_CUED === "function") {
					t.p.CB_CUED();
				}
				break;
		}
	};
	
}//f