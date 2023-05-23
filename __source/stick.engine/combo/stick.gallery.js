/*
<div id="gallery">
	<div class="stick_left stick_arrow"></div>
	<div class="stick_right stick_arrow"></div>
	<div class="stick_dots"></div>
	<div class="stick_slides">
		<div class="stick_slide"></div>
		<div class="stick_slide"></div>
		<div class="stick_slide"></div>
	</div>
</div>

*/
function stick_gallery_widget(id ) {
	
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	var t=this;
	
	//default names
	t.p.main_id = id;
	t.p.analytics_l1_id = id.replace("#","");
	t.p.gallery_dots = t.p.main_id + " .stick_dots";
	t.p.gallery_slides = t.p.main_id + " .stick_slides";
	t.p.gallery_slide = t.p.main_id + " .stick_slide";
	t.p.gallery_arrow_left = t.p.main_id + " .stick_left";
	t.p.gallery_arrow_right = t.p.main_id + " .stick_right";
	
	//config - these get overrid below 
	t.p.num_slides_per_panel = 0;
	t.p.slide_width = 0;
	t.p.offscreen_left = 0;
	t.p.offscreen_right = 0;
	t.p.slide_time = 0.75;
	
	//inner varaibles
	t.p.num_slides=0;
	t.p.current_panel=0;
	t.p.num_panels=0;
	t.p.is_transitioning=false;
	t.p.slide_show_timer=null;
	
	
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.reinit = function() { 
		//$(window).resize(t.p.galleryResize);
		$(document).on( "stick-resize", t.p.galleryResize);
		
		//trace('reinit 2:'+t.p.main_id);
		t.p.gallery_dots = t.p.main_id + " .stick_dots";
		t.p.gallery_slides = t.p.main_id + " .stick_slides";
		t.p.gallery_slide = t.p.main_id + " .stick_slide";
		t.p.gallery_arrow_left = t.p.main_id + " .stick_left";
		t.p.gallery_arrow_right = t.p.main_id + " .stick_right";
		
		
		
		t.p.num_slides_per_panel=1;
		t.p.offscreen_left=0;
		t.p.slide_time=0.5;
		t.p.num_slides = $(t.p.gallery_slide).length;
		
		
		
		t.p.current_panel=0;
		t.p.num_panels = Math.ceil(t.p.num_slides/t.p.num_slides_per_panel);
		
		var i =0;
		$(t.p.gallery_slide).each(function(  ) {
			$(this).removeClass();
			$(this).addClass('stick_slide');
			$(this).addClass('stick_slide_index_'+i);
			var current_panel = Math.floor(i/t.p.num_slides_per_panel);
			$(this).addClass('stick_slide_panel_'+current_panel);
			TweenMax.set(this, {'x':t.p.slide_width*i});
			i++;
		});
		
		if (t.p.num_slides>1) { 
			//listeners
			$(t.p.gallery_arrow_left).click(t.p.arrowLeft);
			$(t.p.gallery_arrow_right).click(t.p.arrowRight);
			
			$(t.p.gallery_slide).swipe( { 
				swipeLeft: t.p.arrowRight,
				swipeRight: t.p.arrowLeft,
				allowPageScroll:"auto",
				threshold:30
			});
			
			
		} else { 
			$(t.p.gallery_arrow_left).remove();
			$(t.p.gallery_arrow_right).remove();
		}
		
		//dots
		if (t.p.num_panels>1) { 
			$(t.p.gallery_dots).show();
			$(t.p.gallery_dots).html('');
			var newhtml = '';
			for (var i=0;i<t.p.num_panels;i++) { 
				var temp = "<div class='stick_dot stick_dot_" + i + "' index='" + i + "'></div>";
				newhtml+= temp;
			}
			
			$(t.p.gallery_dots).html(newhtml);
			$(t.p.gallery_dots + ' .stick_dot').click(t.p.dotClick);
			
		} else { 
			$(t.p.gallery_dots).hide();
		}
		t.p.setDot();
			
		
		t.p.galleryResize();
		setTimeout(t.p.galleryResize,500);
		
	};
	
	this.dotClick = function() { 
		var index = parseFloat($(this).attr('index'));
		if (index!==t.p.current_panel) { 
			if (index<t.p.current_panel) { 
				t.p.moveDot(index,'left');
			} else { 
				t.p.moveDot(index,'right');
			}
		}
	};
	
	
	this.moveDot = function(next_panel,dir) { 
		//if (t.p.is_transitioning===false) { 
			gaTrackEvent(t.p.analytics_l1_id,dir,"click");
			
			if (dir==='left') { 
				var display_adjust = "+="+t.p.offscreen_right;
				var left_offset = t.p.offscreen_left - (t.p.num_slides_per_panel*t.p.slide_width);
			} else { 
				var display_adjust = "-="+t.p.offscreen_right;
				var left_offset = t.p.offscreen_right;
			}
			
			//position offscreen slides
			$(t.p.main_id + ' .stick_slide_panel_'+next_panel).each(function( index ) {
				var thel = index*t.p.slide_width;
				TweenMax.set(this, {'x':left_offset+thel});
			});
		
			
			TweenMax.to($(t.p.main_id + ' .stick_slide_panel_'+next_panel), t.p.slide_time, {css:{"x":display_adjust}, delay:0, ease:Power3.easeInOut});
			TweenMax.to($(t.p.main_id + ' .stick_slide_panel_'+t.p.current_panel), t.p.slide_time, {css:{"x":display_adjust}, delay:0, ease:Power3.easeInOut,onComplete:t.p.doneTransitioning});
			
			t.p.current_panel=next_panel;
			gaTrackEvent(t.p.analytics_l1_id,"panel_loaded",next_panel);
			t.p.setDot();
		//}
	};
	
	this.setDot = function() { 
		$(t.p.gallery_dots + ' .stick_dot').removeClass('active');
		$(t.p.gallery_dots + ' .stick_dot_'+(t.p.current_panel)).addClass('active');
		//alert(t.p.current_panel);
	};
	
	this.arrowLeft = function() { 
		if (t.p.is_transitioning===false) { 
			t.p.is_transitioning=true;
			var next_panel = t.p.current_panel-1;
			if (next_panel<0) next_panel=t.p.num_panels-1;
			//alert(t.p.current_panel+":"+next_panel);
			
			t.p.moveDot(next_panel,'left');
			
			
		}
		
	};
	this.arrowRight = function() { 
		//trace('arrowRight 1');
		//trace(t.p.is_transitioning);
		if (t.p.is_transitioning===false) { 
			//trace('arrowRight 2');
			t.p.is_transitioning=true;
			var next_panel = t.p.current_panel+1;
			if (next_panel>=t.p.num_panels) next_panel=0;
			//alert(t.p.current_panel+":"+next_panel);
			
			t.p.moveDot(next_panel,'right');
		}
	};
	this.doneTransitioning = function() { 
		t.p.is_transitioning=false;
	};
	
	this.gallerySwipe = function(event, direction, distance, duration, fingerCount, fingerData) {
	//this.gallerySwipe = function(direction) {
		if (direction==="left") { 
			t.p.arrowRight();
		} else if (direction==="right") { 
			t.p.arrowLeft();
		}
	};
	
	this.startSlideshow = function() { 
		//trace('stick_gallery: startSlideshow' + t.p.num_slides);
		if (t.p.num_slides>1) {
			//trace('stick_gallery 1');	 
			if (t.p.slide_show_timer===null) { 
				//trace('stick_gallery 2');
				t.p.slide_show_timer=setInterval(t.p.arrowRight,4000);
			}
		}
	};
	
	this.galleryResize = function() { 
		//trace('galleryResize');
		
		var doc_width = $(window).width();
		var doc_height = $(window).height();
		
		$('#gallery').css({'width':doc_width,'height':doc_height});
			
		t.p.slide_width=doc_width;
		t.p.offscreen_right=t.p.num_slides_per_panel*t.p.slide_width;
		
		$(t.p.gallery_slides).css('width',t.p.offscreen_right);//set container w
		$(t.p.gallery_slides).css('height',doc_height);//set slide_width
		$(t.p.gallery_slide).css('width',t.p.slide_width);//set slide_width
		$(t.p.gallery_slide).css('height',doc_height);//set slide_width
		
		var i =0;
		if (t.p.is_transitioning===false) { 
			$(t.p.gallery_slide).each(function(  ) {
				var current_panel = Math.floor(i/t.p.num_slides_per_panel);
				if (t.p.current_panel===current_panel) { 
					TweenMax.set(this, {'x':0});
				} else { 
					TweenMax.set(this, {'x':t.p.slide_width});
				}
				i++;
			});
		}
		
		/*
		var h;
		if ($('body').hasClass('tiny')) { 
			h = $(t.p.gallery_slide + " img.gallery_m").height();
		} else {
			h = $(t.p.gallery_slide + " img.gallery_d").height();
		}
		*/
		var h = doc_height;
		$(t.p.gallery_slides).css('height',h);
		$(t.p.main_id + ' .stick_slides_wrapper').css('height',h);
		
		
		//img resize
		$('#gallery .stick_slides .galleryimg').each(function(index, element) {
			var thew = parseFloat($(this).attr('w'));
			var theh = parseFloat($(this).attr('h'));
			var therat = thew/theh;
			var neww = doc_width;
			var newh = neww/therat;
			if (newh<doc_height) {
				newh=doc_height
				neww=newh*therat;
			}
			var thel = (doc_width-neww)/2;
			var thet = (doc_height-newh)/2;
			//thet = thet/2;
			
			$(this).css({ 'width':neww, 'height':newh,'left':thel,'top':thet});
		});
		
		
		//arrows
			//CENTER ON PAGE
			//var stick_arrow_h = $(t.p.main_id + ' .stick_arrow').height();
			//var newt = (h-stick_arrow_h)/2;
			//$(t.p.main_id + ' .stick_arrow').css('top',newt);
			
		//CENTER left, and position close above and right below
		var site_mode = scGetSiteMode();
		var about_margin_bottom,about_margin_top,about_h,about_w,about_l;
		var adj = 40;
		if (site_mode==="tiny") { 
			adj=0;
		}
		if (site_mode==="tiny" && doc_width<doc_height) { 
			//portrait mobile
			$('#gallery .gallery_d').hide();
			$('#gallery .gallery_m').show();
		} else { 
			//desktop, landscape mobile
			$('#gallery .gallery_d').show();
			$('#gallery .gallery_m').hide();
		}
		
		//arrows
		var stick_arrow_h = $(t.p.main_id + ' .stick_arrow').height();
		var stick_arrow_h_half = stick_arrow_h/2;
		var newt = (h-stick_arrow_h)/2;
		newt += 30;
		$(t.p.main_id + ' .stick_left').css('top',newt-stick_arrow_h_half);
		var newt_close = newt-adj;
		var newt_right = newt+adj;
		//$("#section_gallery_close").css('top',newt_close-15);
		$("#section_gallery_close").css('top',12);
		$(t.p.main_id + ' .stick_right').css('top',newt_right-stick_arrow_h_half);
		
		
		
	};
	
	
}