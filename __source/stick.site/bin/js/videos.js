$(document).ready(function() {
	var stick_videos = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-beginNewPageChange", self.unrevealSection); //do it on begin click
			$(document).on( "stick-middleReveal_everythingIsOut", self.revealSection); //and also in middle (helps with deep linking also)
			
			$(document).on( "stick-overlay-open", self.stopVideo);
			
			$('#section_videos .video_thumb').on( "click", self.thumbClick);
						
		},//ini t
		
		revealSection:function(evt) {
			var tid = site.page_new;
			if (tid==="videos") { 
				var tme = 0.75;
				var del = 0.5;
				var shift = 100;
				
				//first ytid
				stick_videos.current_thumb=0;
				stick_videos.setVideo(stick_videos.current_thumb);
				
				TweenMax.set("#section_videos_copy", {'opacity': 0, 'y': shift} );
				
				TweenMax.to("#section_videos_copy", tme, { delay: del, css: {'opacity': 1, 'y': 0}, ease:Power3.easeOut});
			
				
			}
		},
		
		unrevealSection:function(evt) {
			var tid = site.page_current;
			if (tid==="videos") {
				var tme = 0.5;
				var del = 0;
				var shift = -100;
				
				TweenMax.to("#section_videos_copy", tme, { delay: del, css: {'opacity': 0, 'y':shift}, ease:Power3.easeIn,onComplete:stick_videos.unrevealSection2});
			}
		},
		
		unrevealSection2:function(evt) {
			$('#section_videos_copy_video_yt').html('');
			site.unrevealOldPage2();	
		},
		
		thumbClick:function() { 
			var index = $(this).attr('index');
			stick_videos.setVideo(index);
		},
		
		setVideo:function(index) { 
			stick_videos.current_thumb = index;
			var ytid = $('#video_thumb_'+stick_videos.current_thumb).attr('ytid');
			stick_videos.syt.setTrailer('#section_videos_copy_video_yt',ytid,1);
			
			$('.video_thumb').removeClass('active');
			$('#video_thumb_'+stick_videos.current_thumb).addClass('active');
			
		},
		
		stopVideo:function() { 
			$('#section_videos_copy_video_yt').html('');
			var ytid = $('#video_thumb_'+stick_videos.current_thumb).attr('ytid');
			stick_videos.syt.setTrailer('#section_videos_copy_video_yt',ytid,0);
		},
		
		
		resize:function(evt) {
			stick_videos.resize2();
			setTimeout(stick_videos.resize2,500);
		},
		resize2:function() {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			var site_mode = scGetSiteMode();
			
			var section_margin_bottom,section_margin_top,section_h,section_w,section_l;
			if (site_mode==="large") { 
				section_l = getNavRight();
				
				section_h = getHeightFromNavTop();
				section_margin_top = getNavTop();
				section_l += 15;
				
				section_w = (doc_width/1.5);  //1.6 was really wide
				
				
			} else { 
				section_w = doc_width-40-40;
				section_l = 40;
				
				section_margin_top = 120;
				section_h = "100%";
				
			}
			
			
			//yt sizer
			var yt_rat = 560/315;
			var yt_w = Math.floor(section_w*.7);
			var yt_h = yt_w/yt_rat;
			var thumbs_margin=15;
			var thumbs_w = Math.floor(section_w-yt_w-thumbs_margin);
			
			$('#section_videos_copy #section_videos_copy_video_holder').css('width',yt_w);
			$('#section_videos_copy_video_yt').css( {'width':yt_w,'height':yt_h});
			
			section_h=yt_h;
			//set content heiight
			$('#section_videos_copy').css({'top':section_margin_top,'left':section_l,'width':section_w,'height':section_h});
			
			//thumbs
			thumbs_w *= 0.6; //and shrink more
			
			var nano_pad = 40;
			var thumb_img_max = 200;
			var thumb_rail_max = thumb_img_max+nano_pad;
			if (thumbs_w>thumb_rail_max) { 
				thumbs_w = thumb_rail_max;
			}
			$('#section_videos .nano').css( {'width':thumbs_w,'margin-left':thumbs_margin+'px'});
			
			
			
			
			
			//yt sizer mobile
			var m_yt_w = doc_width-80;
			var m_yt_h = m_yt_w/yt_rat;
			$('.video_mobile_card').css( {'width':m_yt_w});
			$('.video_mobile_card_vid').css( {'width':m_yt_w,'height':m_yt_h});
			
			
			
			
			if (site_mode==="large") { 
				site.startNano();
			} else { 
				site.stopNano();
				stick_videos.stopVideo();
			}	
			
			
			
		}//_resize
		
	}//obj
	stick_videos.init();
	stick_videos.syt = new stick_youtube();
	stick_videos.current_thumb=0;
	
	
});
