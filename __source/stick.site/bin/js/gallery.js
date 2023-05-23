$(document).ready(function() {
	var stick_gallery = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-revealNewPage_final", self.revealGallery);
			$(document).on( "stick-middleReveal_everythingIsOut", self.resetGallery);
			
			$("#section_gallery_close").on( "click", self.closeGallery);
			
			gallery_widget = new stick_gallery_widget('#gallery');
			gallery_widget.reinit();
			
			self.resetGallery();
						
		},//init
		
		resetGallery:function() { 
			TweenMax.set("#section_gallery_close", {'opacity': 0} );
			TweenMax.set("#gallery .stick_left", {'opacity': 0} );
			TweenMax.set("#gallery .stick_right", {'opacity': 0} );
			
		},
		
		revealGallery:function() { 
			trace("revealGallery");
			if (site.page_new==="gallery") { 
				
				
				var tme = 0.5;
				var del = 0;
				
				var site_mode = scGetSiteMode();
				
				//add extra delay to wait for nav to leave
				if (site_mode==="large") { 
					if ($("#nav").css("display") !=="none") { 
						del = 0.5;
					}
				}
				var del_step = 0.15;
				var shift = -150;
				var rshift = shift;
				
				
				
				if (site_mode==="tiny") { 
					rshift *= -1;
				}
				
				TweenMax.set("#section_gallery_close", {'opacity': 0, 'x': shift} );
				TweenMax.set("#gallery .stick_left", {'opacity': 0, 'x': shift} );
				TweenMax.set("#gallery .stick_right", {'opacity': 0, 'x': rshift} );
				
				TweenMax.to("#gallery .stick_right", tme, { delay: del, css: {'opacity': 1, 'x': 0}, ease:Power3.easeOut});
				
				if (site_mode==="large") { 
					del += del_step;
				}
				
				TweenMax.to("#gallery .stick_left", tme, { delay: del, css: {'opacity': 1, 'x': 0}, ease:Power3.easeOut});
				del += del_step;
				
				TweenMax.to("#section_gallery_close", tme, { delay: del, css: {'opacity': 1, 'x': 0}, ease:Power3.easeOut});
				del += del_step;
			}
			
		},
		
		closeGallery:function() { 
			var tme = 0.5;
			var del = 0;
			var del_step = 0.15;
			var shift = -150;
			var rshift = shift;
			
			var site_mode = scGetSiteMode();
			if (site_mode==="tiny") { 
				rshift *= -1;
			}
						
			
			TweenMax.to("#gallery .stick_right", tme, { delay: del, css: {'opacity': 1, 'x': rshift}, ease:Power3.easeIn});
			
			if (site_mode==="large") { 
				del += del_step;
			}
			
			TweenMax.to("#gallery .stick_left", tme, { delay: del, css: {'opacity': 1, 'x': shift}, ease:Power3.easeIn});
			del += del_step;
			
			
			TweenMax.to("#section_gallery_close", tme, { delay: del, css: {'opacity': 1, 'x': shift}, ease:Power3.easeIn,onComplete:stick_gallery.closeGallery2});
			del += del_step;

			gaTrackEvent("gallery","close","click");
			
		},
		
		closeGallery2:function() { 
			var slug = site.page_previous;
			site.changeUrlSlug(slug);
			//reinit after delay
			//setTimeout(stick_gallery.closeGallery3,1000);
		},
		
		closeGallery3:function() { 
			gallery_widget.reinit();
		},
		
		resize:function(evt) {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			
			
		}//_resize
		
	}//obj
	stick_gallery.init();
	
});
