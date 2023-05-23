$(document).ready(function() {
	var stick_comedytour = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-beginNewPageChange", self.unrevealSection); //do it on begin click
			$(document).on( "stick-middleReveal_everythingIsOut", self.revealSection); //and also in middle (helps with deep linking also)
						
		},//init
		
		revealSection:function(evt) {
			var tid = site.page_new;
			if (tid==="comedy-tour") { 
				var tme = 0.75;
				var del = 0.5;
				var shift = 100;
				
				TweenMax.set("#section_comedytour_copy", {'opacity': 0, 'y': shift} );
				
				TweenMax.to("#section_comedytour_copy", tme, { delay: del, css: {'opacity': 1, 'y': 0}, ease:Power3.easeOut});
			
				
			}
		},
		
		unrevealSection:function(evt) {
			var tid = site.page_current;
			if (tid==="comedy-tour") {
				var tme = 0.5;
				var del = 0;
				var shift = -100;
				
				TweenMax.to("#section_comedytour_copy", tme, { delay: del, css: {'opacity': 0, 'y':shift}, ease:Power3.easeIn,onComplete:stick_comedytour.unrevealSection2});
			}
		},
		
		unrevealSection2:function(evt) {
			site.unrevealOldPage2();	
		},
		
		
		resize:function(evt) {
			stick_comedytour.resize2();
			setTimeout(stick_comedytour.resize2,500);
		},
		resize2:function() {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			var site_mode = scGetSiteMode();
			
			var section_margin_bottom,section_margin_top,section_h,section_w,section_l,poster_h,poster_w,nano_w;
			if (site_mode==="large") { 
				section_l = getNavRight();
				section_h = getHeightFromNavTop();
				section_margin_top = getNavTop();
				section_l += 15;
				
				//percentage of the screen
				section_w = (doc_width-section_l);
				
				
				//so we make the poster rheight fill the remaining height.  then caluclate the rest of the width from there.
				var poster_rat = 416/616;
				poster_h = section_h;
				poster_w = poster_h*poster_rat;
				
				//limits
				var poster_h_min = 175;
				var poster_h_max = 616;
				var nano_w_max = 450;
				var nano_w_min = 200;
				
				
				nano_w = section_w-poster_w-50;
				if (nano_w<nano_w_min) { 
					poster_h *= 0.5;
				}
				if (poster_h<poster_h_min) { 
					poster_h=poster_h_min;
				}
				if (poster_h>poster_h_max) { 
					poster_h=poster_h_max;
				}
				poster_w = poster_h*poster_rat;
				
				//a percentage of screen, minus psoter w
				nano_w = section_w-poster_w-50;
				if (nano_w>nano_w_max) { 
					nano_w=nano_w_max;
				}
				
				if (nano_w<nano_w_min) { 
					nano_w=nano_w_min;	
				}
				
				
			} else { 
				section_w = doc_width-40-40;
				section_l = 40;
				section_margin_top = $('#section_comedytour_tt').height()+40;
				section_h = "100%";
				
				poster_w = section_w;
				poster_h = "auto";
				
				nano_w = "90%";
				
				
			}
			$('#section_comedytour_copy #section_comedytour_poster').css( {'width':poster_w,'height':poster_h});
			$('#section_comedytour_copy .nano').css( {'width':nano_w});
			$('#section_comedytour_copy').css({'top':section_margin_top,'left':section_l,'width':section_w,'height':section_h});
			
			var ylh = $('#section_comedytour_copy .nano-content_inner').height();
			$('#section_comedytour_copy .yellow_vertical_line').css( {'height':ylh });
			
			if (site_mode==="large") { 
				site.startNano();
			} else { 
				site.stopNano();
			}	
			
		}//_resize
		
	}//obj
	stick_comedytour.init();
	
});
