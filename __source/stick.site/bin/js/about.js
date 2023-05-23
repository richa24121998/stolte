var stick_about;
$(document).ready(function() {
	stick_about = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-beginNewPageChange", self.unrevealAbout); //do it on begin click
			$(document).on( "stick-middleReveal_everythingIsOut", self.revealAbout); //and also in middle (helps with deep linking also)
			
			$('#section_about_box_small').on('click',self.openAboutVideo);
			$('#section_about_box_large_close').on('click',self.closeAboutVideo);
			$('#section_about_box_large_fullscreen').on('click',self.fullScreenOpen);
			
			$('#section_about_box_big_controls_holder .pause').on('click',self.littleVideoPause);
			$('#section_about_box_big_controls_holder .play').on('click',self.littleVideoPlay);
			//$('#about_vid_mobile_grabber').on('click',self.mobilePlay);
			
		},//init
		
		revealAbout:function(evt) {
			var tid = site.page_new;
			if (tid==="about") { 
				var tme = 0.75;
				var del = 0.5;
				var shift = 100;
				
				stick_about.reinitAboutVideo();
				stick_about.reinitAboutVideoMobile();
				
				TweenMax.set("#section_about_copy", {'opacity': 0, 'y': shift} );
				
				TweenMax.to("#section_about_copy", tme, { delay: del, css: {'opacity': 1, 'y': 0}, ease:Power3.easeOut});
			}
			stick_about.hideShowBG2();
		},
		
		unrevealAbout:function(evt) {
			var tid = site.page_current;
			//alert(tid);
			if (tid==="about") {
				var tme = 0.5;
				var del = 0;
				var shift = -100;
				
				TweenMax.to("#section_about_copy", tme, { delay: del, css: {'opacity': 0, 'y':shift}, ease:Power3.easeIn,onComplete:stick_about.unrevealAbout2});
			}
		},
		
		unrevealAbout2:function(evt) {
			stick_about.reinitAboutVideo();
			stick_about.reinitAboutVideoMobile();
			
			site.unrevealOldPage2();	
			
		},
		
		hideShowBG2:function() { 
			var tid = site.page_new;
			if (tid==="about") { 
				var site_mode = scGetSiteMode();
				if (site_mode==="large") { 
					$('#bgs2').show();
				} else { 
					$('#bgs2').hide();
				}
			} else { 
				$('#bgs2').hide();
			}
		},
		
		mobilePlay:function() { 
			stick_about.vidmobile.play();
		},
		
		
		reinitAboutVideoMobile:function() {
			stick_about.vidmobile.pause();
			stick_about.vidmobile.currentTime=0;
		},
		reinitAboutVideo:function() { 
			$('#section_about_box_large_inner').css('width','0%');
			$('#section_about_box_large').hide();
			$('#section_about_box_large_buttons').hide();
			
			stick_about.littleVideoPause();
			stick_about.littleVideoResetTime();
			
			
			stick_about.vidbig.pause();
			stick_about.vidbig.currentTime=0;
			
			var tid = site.page_current;
			if (tid==="about") {
				if (stick_overlay.current_overlay==="overlay_about") { 
					//stick_overlay.doOverlayClose();
				}
			}
		},
		
		
		openAboutVideo:function() { 
			/*
			var src = stick_config.subfolder + "assets/site/videos/about-vid.mp4";
			var thehtml = "<video id='about_vid_vid_id' class='about_vid_vid' autoplay>";
			thehtml += "<source src='" + src + "' type='video/mp4'>";
			thehtml += "</video>";
			$('#section_about_box_large_video').html(thehtml);
			*/
			
			stick_about.littleVideoResetTime();
			stick_about.littleVideoPlay();
			
			
			$('#section_about_box_large_inner').css('width','0%');
			$('#section_about_box_large').show();
			$('#section_about_box_large_buttons').show();

			
			TweenMax.to("#section_about_box_large_inner", 1.0, { delay: 0, css: {'width': '100%'}, ease:Power3.easeOut,onComplete:stick_about.openAboutVideo2});
		
		},
		openAboutVideo2:function() { 
			
		},
		
		
		littleVideoResetTime:function() { 
			stick_about.vidsmall.currentTime=0;	
		},
		littleVideoPlay:function() { 
			stick_about.vidsmall.play();
			$('#section_about_box_big_controls_holder .play').hide();
			$('#section_about_box_big_controls_holder .pause').show();
			
		},
		littleVideoPause:function() { 
			stick_about.vidsmall.pause();
			$('#section_about_box_big_controls_holder .play').show();
			$('#section_about_box_big_controls_holder .pause').hide();
			
		},
		
		closeAboutVideo:function() { 
			TweenMax.to("#section_about_box_large_inner", 0.75, { delay: 0, css: {'width': '0%'}, ease:Power3.easeIn,onComplete:stick_about.closeAboutVideo2});
			
		},
		closeAboutVideo2:function() { 
			stick_about.reinitAboutVideo();
		},
		fullScreenOpen:function() { 
			stick_overlay.doOverlayOpen("overlay_about");
			
			
			var ct = stick_about.vidsmall.currentTime;
			stick_about.littleVideoPause();
			
			//stick_about.reinitAboutVideo();
			
			
			stick_about.vidbig.currentTime = ct;
			stick_about.vidbig.play();
			
			
		},
		fullScreenClose:function() {
			var is_big_paused = $("#overlay_about_big").get(0).paused;
			stick_about.vidbig.pause();
			var ct = stick_about.vidbig.currentTime;
			stick_about.vidsmall.currentTime=ct;
			
			if (is_big_paused) {
			
			} else { 
				stick_about.littleVideoPlay();
			}
		},
		
		
		
		
		resize:function(evt) {
			stick_about.resize2();
			setTimeout(	stick_about.resize2,500);
		},
		resize2:function() {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			var site_mode = scGetSiteMode();
			var site_mode_changed = (site_mode!==stick_about.site_mode_last) ? true : false;
			stick_about.site_mode_last = site_mode;
			
			var section_margin_bottom,section_margin_top,section_h,section_w,section_l;
			
			
			//box sizing and placement
			var kill_nano = false;
			if (site_mode==="large") { 
				
				//left side
				section_l = getNavRight();
				section_l += 5; //margin left
				
				//width about % of screen
				section_w = doc_width*0.4;  
				
				//height
				section_h = getHeightFromNavBottom();
				section_margin_top = getNavBottom();
				if (section_h<200) { 
					//if too small, then snap to top of nav instead of bottom
					section_h = getHeightFromNavTop();
					section_margin_top = getNavTop();
					
					//make width smaller  
					section_w = (doc_width/3.4);  
				}
				
				//check to see if our potential box is way bigger than the content
				//if so, dont use scroll box & set box height to the content height
				var content_h = $('#section_about_copy .nano-content_inner').height();
				content_h += 100; //add some padding
				if (section_h>content_h) { 
					kill_nano=true; //dont use nano scroller
					section_h=content_h;
				}
				
				//the max width of box
				var max_section_w = 650;
				if (section_w>max_section_w) { 
					section_w = max_section_w;
				}
				//section_l = (doc_width/2)*0.55; 
				
				
			} else { 
				
				//mobile doesn't use nano box scroller
				section_w = doc_width-40-40;
				section_l = 40;
				section_margin_top = doc_height*0.45;
				section_h = "100%";
				
				//no nano in mobile
				kill_nano=true;
				
				//reinit html video also
				
				
				
			}
			
			//reinit videos
			if (site_mode_changed) { 
				stick_about.reinitAboutVideo();
				stick_about.reinitAboutVideoMobile();
			}
			
			$('#section_about_copy').css({'top':section_margin_top,'left':section_l,'width':section_w,'height':section_h});
			
			
			//about vid box small
			var about_box_small_rat = 223/233;
			var about_box_w_max = 223;
			var about_box_left = section_w + 5;
			var about_box_w = section_w * 0.37;
			if (about_box_w>about_box_w_max) { 
				about_box_w=about_box_w_max;	
			}
			$('#section_about_box').css({'left':about_box_left,'width':about_box_w});
			//about vid box play button
			var about_box_playbutton_w_max = 34;
			var about_box_playbutton_w = about_box_w * 0.18;
			if (about_box_playbutton_w > about_box_playbutton_w_max) { 
				about_box_playbutton_w = about_box_playbutton_w_max;	
			}
			$('#section_about_box_small_play .offon_holder').css({'width':about_box_playbutton_w,'height':about_box_playbutton_w});
			//about vid box large
			var about_large_w = about_box_w*1.85;
			var about_large_h = about_box_w / about_box_small_rat;
			$('#section_about_box_large').css({'width':about_large_w,'height':about_large_h});
			$('#section_about_box_large_video').css({'width':about_large_w,'height':about_large_h});
			//about vid box large buttons
			$('#section_about_box_large_buttons').css({'top':about_large_h+5});
			//about video control buttons w
			$('#section_about_box_big_controls_holder .btn').css({'width':about_box_playbutton_w,'height':about_box_playbutton_w});
			//mobile vide
			var about_vid_mobile_rat = 1920/1080;
			var about_vid_mobile_w = doc_width-80;
			var about_vid_mobile_h = about_vid_mobile_w/about_vid_mobile_rat;
			$('#about_vid_mobile_grabber').css({'width':about_vid_mobile_w,'height':about_vid_mobile_h});

			
			//figure out bg2
			stick_about.hideShowBG2()
			
			//kill nano?
			if (kill_nano) { 
				site.stopNano();
			} else { 
				site.startNano();
			}
						
		}//_resize
		
	}//obj
	stick_about.site_mode_last = "";
	stick_about.vidbig = document.getElementById("overlay_about_big");
	stick_about.vidsmall = document.getElementById("about_vid_vid_id");
	stick_about.vidmobile = document.getElementById("about_vid_mobile_grabber");
	stick_about.init();
	
});
