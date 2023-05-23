/*
USAGE:
var seq_instance = new stick_seq('module_videos_hover','videos/WATCH VIDEOS_01_000',1,12,'png',false,false,false);	
seq_instance.preload();
$('#module_videos_hover').on('mouseenter', function() { seq_instance.resume();});
$('#module_videos_hover').on('mouseleave', function() { seq_instance.stop();});

//TO MAKE IT FINISH THE SEQUENCE AFTER YOU ROLL OFF
var seq_instance = new stick_seq('module_videos_hover','videos/WATCH VIDEOS_01_000',1,12,'png',1,12,false);	

	
preload fires stick-seq-preload-done
so add somewhere:
$(document).on( "stick-seq-preload-done", somefunction);	
somefunction(e) { 
	
}

tid: 					the div id that contains the slides
path:					the path of wher the images are stored, with partial of the name
beg:					image number start
end:					image number end
filetype:				filetype
inner_loop_start:		start number if you'd like a sub loop outside of the reveal and unreveal
inner_loop_end:			a number if you'd like a sub loop outside of the reveal and unreveal
always_stay_in_inner:	never leave the inner


IN YOUR CSS
Style the div:
tid div { 
	background-size: cover;
	width:100%;
	height:100%;
	position:absolute;
	top:0;
	left:0;
}
And size the TID 

*/
function stick_seq( tid,path,beg,end,filetype,inner_loop_start,inner_loop_end,always_stay_in_inner ) {
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	
	this.filetype = filetype;
	this.tid = tid;
	this.path = path;
	this.fps = 10; 
	this.transition_time = 1000/this.fps;
	
	this.slide_num_beg=beg;
	this.slide_num_max=end;
	
	this.inner_loop_start=inner_loop_start;
	this.inner_loop_end=inner_loop_end;
	this.always_stay_in_inner = always_stay_in_inner;
	
	this.cs = beg; //current slide
	this.tmr;
	this.is_stopped=true;
	this.is_goto_inner_loop_start=false;
	this.is_goto_first_frame_start=false;
	
	this.option="z";
	
	this.did_once = false;
	
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.goto_inner_loop_start = function() { 
		"use strict";
		//trace(this);
		//trace('stick_seq:resume'+this.transition_time);
		var t=this;
		t.p.is_goto_inner_loop_start=true;
		//alert(t.p.is_goto_inner_loop_start+":"+t.p.is_stopped);
		if (t.p.is_stopped) { 
			clearInterval(t.p.tmr);
			t.p.is_stopped=false;
			t.p.tmr = setInterval(function() { t.nextSlide(t,false);}, t.transition_time);
		}
	};
	this.goto_first_frame_start = function() { 
		"use strict";
		var t=this;
		//trace('goto_first_frame_start'+t.p.is_stopped);
		t.p.is_goto_first_frame_start=true;
		//if (t.p.is_stopped) { 
			clearInterval(t.p.tmr);
			t.p.is_stopped=false;
			t.p.tmr = setInterval(function() { t.nextSlide(t,false);}, t.transition_time);
		//}
	};
		
	this.resume = function(runrillend) { 
		"use strict";
		//trace(this);
		trace('stick_seq:resume'+this.transition_time);
		var cont=false;
		var t=this;
		if (t.p.is_stopped ) { 
			cont=true;
		}
		if (cont) { 
			clearInterval(t.p.tmr);
			t.p.is_stopped=false;
			
			if (runrillend!=true) runrillend=false;
			
			t.p.tmr = setInterval(function() { t.nextSlide(t,runrillend);}, t.transition_time);
		}
	};
	this.set_first_frame = function() { 
		"use strict";
		var t=this;
		var old_cs = t.p.cs;
		var new_cs = t.p.slide_num_beg;
		t.p.cs = new_cs;
		$("#"+t.p.tid+"_" +old_cs).hide();
		$("#"+t.p.tid+"_" +new_cs).css('display','block');
	};
	this.stop = function(option) { 
		"use strict";
		var t=this;
		//trace('stick_seq:stop'+t.p.tid);
		
		clearInterval(t.p.tmr);
		t.p.is_stopped=true;
		
		var new_cs;
		var old_cs = t.p.cs;
		var is_characters_roll = false;
		if (t.p.tid==="module_trailer_hover") { 
			new_cs = t.p.inner_loop_end;
			if (new_cs>old_cs) { 
				t.p.cs = new_cs;
				$("#"+t.p.tid+"_" +old_cs).hide();
				$("#"+t.p.tid+"_" +new_cs).css('display','block');
			}
			
		} else if (t.p.tid==="module_photos_hover") { 
			//var new_cs = t.p.slide_num_beg;
			//t.p.cs = new_cs;
			//$("#"+t.p.tid+"_" +old_cs).hide();
			//$("#"+t.p.tid+"_" +new_cs).css('display','block');
		} else if (t.p.tid==="module_books_hover" || t.p.tid==="module_books_mobile_hover" ) { 
			//var new_cs = t.p.slide_num_beg;
			new_cs = 12;
			t.p.cs = new_cs;
			$("#"+t.p.tid+"_" +old_cs).hide();
			$("#"+t.p.tid+"_" +new_cs).css('display','block');
		} else if (t.p.tid==="module_specialbox_hover" ) { 
			//var new_cs = t.p.slide_num_beg;
			new_cs = 16;
			t.p.cs = new_cs;
			$("#"+t.p.tid+"_" +old_cs).hide();
			$("#"+t.p.tid+"_" +new_cs).css('display','block');
		} else if (t.p.tid.includes("module_characters_roll")) { 
			new_cs = t.p.inner_loop_end;
			t.p.cs = new_cs;
			$("#"+t.p.tid+"_" +old_cs).hide();
			$("#"+t.p.tid+"_" +new_cs).css('display','block');
			is_characters_roll=true;
			//trace("t.p.tid" + t.p.tid);
			//trace("slide stop module_characters_roll"+option);
			if (option==="characters_rollout") { 
				t.p.option="characters_rollout";
				is_characters_roll=false;
			}
		}
		
		//trace("is_goto_first_frame_start:"+t.p.is_goto_first_frame_start);
		if (t.p.is_goto_first_frame_start) { 
			t.p.is_goto_first_frame_start=false;
		} else if (t.p.inner_loop_start!==false && t.p.always_stay_in_inner===false) { 
			//$("#"+t.p.tid+" .generic_hover_slide").hide();
			//t.p.cs = t.p.inner_loop_end;
			//trace("is_characters_roll:"+is_characters_roll);
			if (is_characters_roll===false) { 
				//t.p.is_stopped=false;
				t.p.tmr = setInterval(function() { t.nextSlide(t,true);}, t.transition_time);
			} 
		} 
	};
	
	this.nextSlide = function(t,runtillend) { 
		"use strict";
		//trace('stick_seq:' + t.tid + '_'+t.cs);
		//trace('stick_seq:nextSlide');
		//trace(t.p);
		var old_cs = t.p.cs;
		
		if (runtillend) { 
			t.p.cs++;
		} else { 
			t.p.cs++;
		}
		
		//trace('nextSlide:'+t.p.cs);
		
		var thebeg = t.p.slide_num_beg;
		var theend = t.p.slide_num_max;
		
		//if inner looper
		if (t.p.inner_loop_start!==false) { 
			thebeg = t.p.inner_loop_start;
			theend = t.p.inner_loop_end;
		}
		
		//if rollout
		if (runtillend) { 
			thebeg = t.p.slide_num_beg;
			theend = t.p.slide_num_max;
		}
		
		//first slide
		if (t.p.cs>theend) { 
			t.p.cs = thebeg;
			if (t.p.tid==="module_locker_hover"  ) { 
				
				if (runtillend===false) {
					t.p.did_once=true;
					t.p.stop();
					clearInterval(t.p.tmr);
				}
			}
			
			if (runtillend) {
				clearInterval(t.p.tmr);
				//trace("slide:"+t.p.option);
				//trace('characters move run till end in seq');
				if (t.p.option==="characters_rollout") { 
					t.p.option="";
					//site.charactersMove();
				}
			}
		}
		
		$("#"+t.p.tid+"_" +t.p.cs).css('display','block');
		$("#"+t.p.tid+"_" +old_cs).hide();
		
		//check to stop it
		if (t.p.is_goto_inner_loop_start) { 
			if (t.p.cs>=t.p.inner_loop_start) { 
				t.p.is_goto_inner_loop_start=false;
				t.p.stop();	
			}
		}
		if (t.p.is_goto_first_frame_start) { 
			//trace('nextSlide check: is_goto_first_frame_start'+t.p.cs+':'+t.p.inner_loop_start);
			if (t.p.cs>=t.p.inner_loop_start) { 
				t.p.stop();	
				//site.charactersMove3();
			}
		
		}
		
	};
	this.hideall = function(t) { 
		for (var i=t.p.slide_num_beg;i<=t.p.slide_num_max;i++) { 
			$("#"+t.p.tid+" .generic_hover_slide").hide();
			$("#"+t.p.tid+" .generic_hover_slide").css('opacity','1');
		}
		$("#"+t.p.tid+"_" +t.p.cs).css('display','block');
		$("#"+t.p.tid+"_" +t.p.cs).css('opacity','1');
		
		//event
		$.event.trigger({
			type: "stick-seq-preload-done",
			tid: t.p.tid
		});
	};
	this.preload = function() {
		var t=this;
		var preload_arr = Array();
		
		var newme_prefix = t.p.path;
		var newme_prefix2 = "";
		for (var i=t.p.slide_num_beg;i<=t.p.slide_num_max;i++) { 
			if (i<10) { 
				newme_prefix2 = "0";
			} else { 
				newme_prefix2 = "";
			}
			
			var temphtml = "<div style='opacity:0.00;display:block;' class='generic_hover_slide' id='" + t.p.tid + "_" + i + "'></div>";
			$('#'+t.p.tid).append(temphtml);
			var src = newme_prefix + newme_prefix2 + i + "." + t.p.filetype;
			$('#'+t.p.tid+"_" + i).css("background-image", "url('" + src + "')");
			$('#'+t.p.tid+"_" + i).attr("preloadimage", src);
			preload_arr.push(src);
		}
		
		var queue = new createjs.LoadQueue();
		queue.on("complete", function(e) {
			setTimeout(function() { 
				t.hideall(t);
			}, 250);
		});
		queue.on("progress", function(e) {
			//trace(e);
		});
		queue.loadManifest(preload_arr, true, "");
		
		/*
		$.preload(preload_arr, {
			init: function(loaded, total) {
			},
			loaded: function(img, loaded, total) {
				var pct = loaded/total;
				trace('loaded'+pct);
			},
			loaded_all: function(loaded, total) {
				setTimeout(function() { 
					t.hideall(t);
				}, 250);
			}
		});
		*/
	};
	
	//first
	var t=this;
	var newme_prefix = t.p.path;
	var newme_prefix2 = "";
	if (t.p.cs<10) { 
		newme_prefix2 = "0";
	}
	var temphtml = "<div style='opacity:0.00;display:block;' class='generic_hover_slide' id='" + t.p.tid + "_" + t.p.cs + "'></div>";
	$('#'+t.p.tid).append(temphtml);
	$('#'+t.p.tid+"_" + t.p.cs).css("background-image", "url('" + newme_prefix + newme_prefix2 + t.p.cs + "." + t.p.filetype + "')");
	$('#'+t.p.tid+"_" + t.p.cs).attr("preloadimage", "" + newme_prefix + newme_prefix2 + t.p.cs + "." + t.p.filetype);
	$("#"+t.p.tid+"_" +t.p.cs).css('display','block');
	$("#"+t.p.tid+"_" +t.p.cs).css('opacity','1');
	
	
}