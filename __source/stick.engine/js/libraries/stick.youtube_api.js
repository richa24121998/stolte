function stick_youtube_api( ) {
	//v3 - with controls
	
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
	this.init = function(ytid,container_name,autoplay,yt_generic_controls) { //autoplay: 1 or 0, yt_generic_controls: 1 or 0
		"use strict";
		var t=this;
		t.p.ytid = ytid;
		t.p.container_name=container_name;
		t.p.container_parent = $("#"+t.p.container_name).parent();
		console.log(t.p.container_parent);
		t.p.autoplay = autoplay;
		var ytcontrols = (yt_generic_controls==1) ? 2 : 0;
		
		$(document).on( "stick-youtube-api-pause", t.p.eventPause);
		$(".cover_big_play",t.p.container_parent).on('click',t.p.playVideo);
		$(".vid_controls .vid_player",t.p.container_parent).on('click',t.p.vidPlayToggle);
		$(".vid_controls .vid_audio",t.p.container_parent).on('click',t.p.vidAudioToggle);
		$(".vid_controls .vid_stop",t.p.container_parent).on('click',t.p.stopVideo);

		
		t.p.yt_player = new YT.Player(t.p.container_name, {
		  height: '100%',
		  width: '100%',
		  videoId: t.p.ytid,
		  playerVars:{ 'controls':ytcontrols,'rel':0,'showinfo':0,'modestbranding':1,'fs':1,'autoplay':t.p.autoplay},
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
	
	///CALLBACK HOOKS
	this.eventPause = function(e) { 
		"use strict";
		//console.log(t);
		var container_name = e.container_name;
		if (container_name!==t.p.container_name) { 
			t.p.pauseVideo();
		}
	};
	
	
	///CONTROL HOOKS
	this.playVideo = function() { 
		"use strict";
		t.p.yt_player.playVideo();
		
		t.p.hideCover();
	};
	this.stopVideo = function() { 
		"use strict";
		t.p.yt_player.stopVideo();
	};
	this.pauseVideo = function() { 
		"use strict";
		t.p.yt_player.pauseVideo();
	};
	this.vidPlayToggle = function() { 
		var state = t.p.yt_player.getPlayerState();
		if (state===YT.PlayerState.PLAYING) { 
			t.p.pauseVideo();
		} else { 
			t.p.playVideo();
		}
	}
	this.muteVideo = function() { 
		"use strict";
		t.p.yt_player.setVolume(0);
		t.p.isMuted();
	};
	this.unmuteVideo = function() { 
		"use strict";
		t.p.yt_player.setVolume(100);
		t.p.isUnmuted();
	};
	this.vidAudioToggle = function() { 
		var vol = t.p.yt_player.getVolume();
		if (vol>0) { 
			t.p.muteVideo();
		} else { 
			t.p.unmuteVideo();
		}
	}
	
	
	
	///DISPLAY HOOKS
	this.isPlayed = function() { 
		"use strict";
		$(".vid_controls .vid_player",t.p.container_parent).removeClass('play');
		$(".vid_controls .vid_player",t.p.container_parent).addClass('pause');
		
		t.p.hideCover();
	};
	this.isPaused = function() { 
		"use strict";
		$(".vid_controls .vid_player",t.p.container_parent).addClass('play');
		$(".vid_controls .vid_player",t.p.container_parent).removeClass('pause');
	};
	this.isMuted = function() { 
		"use strict";
		$(".vid_controls .vid_audio",t.p.container_parent).removeClass('off');
		$(".vid_controls .vid_audio",t.p.container_parent).addClass('on');
	};
	this.isUnmuted = function() { 
		"use strict";
		$(".vid_controls .vid_audio",t.p.container_parent).addClass('off');
		$(".vid_controls .vid_audio",t.p.container_parent).removeClass('on');
	};
	this.isStopped = function() { 
		"use strict";
		t.p.showCover();
	};
	this.hideCover = function() { 
		"use strict";
		$(".cover_big_play",t.p.container_parent).hide();
		$(".cover",t.p.container_parent).hide();	
	};
	this.showCover = function() { 
		"use strict";
		$(".cover_big_play",t.p.container_parent).show();
		$(".cover",t.p.container_parent).show();	
	};

	
	
	
	
	///LISTENERS AND STATE CHAGNES
	this.vid_onPlayerStateChange = function(event,t) {
		"use strict";
		//var t=this;
		//console.log(event.data);
		//trace(t);
		switch (event.data) { 
			case -1: //stopped
				t.p.isPaused();
				t.p.isStopped();
				break;
			case YT.PlayerState.ENDED:
				if (typeof t.p.CB_ENDED === "function") {
					t.p.CB_ENDED();
				}
				
				t.p.isPaused();
				break;
			case YT.PlayerState.PLAYING:
				//pause others
				$.event.trigger({
					type: "stick-youtube-api-pause",
					container_name: t.p.container_name
				});
					
				if (typeof t.p.CB_PLAYING === "function") {
					//playing callback
					t.p.CB_PLAYING();
				}
				
				t.p.isPlayed();
				break;
			case YT.PlayerState.PAUSED:
				if (typeof t.p.CB_PAUSED === "function") {
					t.p.CB_PAUSED();
				}
				
				t.p.isPaused();
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
	
	
}//f