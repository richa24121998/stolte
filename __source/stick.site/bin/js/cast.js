$(document).ready(function() {
	var stick_cast = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-beginNewPageChange", self.unrevealSection); //do it on begin click
			$(document).on( "stick-middleReveal_everythingIsOut", self.revealSection); //and also in middle (helps with deep linking also)
				
			$(document).on( "stick-section-inner-change", self.innerSectionChangeEvent);
			$('#cast_nav .cast_nav_entry').on({
			    mouseenter: self.navOnEvent,
			    mouseleave: self.navOffEvent
			});
			$('#cast_arrow').on('click',self.nextCast);
			
			//init states
			$('.cast_content_member_copy').hide();
			TweenMax.set($('.cast_content_member_img'), {'x': '-102%'} );
			//$('.cast_content_member_img').css('x','-102%');			
			
		},//init
		
		revealSection:function(evt) {
			var tid = site.obj_new.section;
			var cur_tid = site.obj_current.section;
			if (tid==="cast") { 
				TweenMax.killTweensOf('.cast_content_member_img');
				TweenMax.set(".cast_content_member_img", {'x': '-102%'} );
				stick_cast.current_tid='fff';
				stick_cast.innerSectionChange(true);
			}
			
		},
		
		unrevealSection:function(evt) {
			var tid = site.obj_current.section;
			if (tid==="cast") {
				var tme = 0.5;
				var del = 0;
				var shift = -100;
				
				TweenMax.to("#section_cast_copy", tme, { delay: del, css: {'opacity': 0, 'y':shift}, ease:Power3.easeIn,onComplete:stick_cast.unrevealSection2});
			}
		},
		
		unrevealSection2:function(evt) {
			stick_cast.killActiveNav();
			
			site.unrevealOldPage2();	
		},
		
		
		////////////////////////////////////////////////////////////////////////////////
		//INNER CAST RELATED
		nextCast:function() { 
			stick_cast.current_cast++;
			if (stick_cast.current_cast>=cast_order.length) { 
				stick_cast.current_cast=0;
			}	
			var tid = cast_order[stick_cast.current_cast];
			//stick_cast.setNewCast(tid,false);
			site.changeUrlSlug("cast-"+tid);
		},
		
		innerSectionChangeEvent:function() { 
			stick_cast.setNewCast(false);
		},
		innerSectionChange:function(first_page_load) { 
			stick_cast.setNewCast(first_page_load);
		},
		
		setNewCast:function(first_page_load) { 
			var tid = site.page_new;
			var tid = tid.replace("cast-","");
			
			stick_cast.new_tid=tid;
			stick_cast.setNewNav(tid);
			if (first_page_load) { 
				//$('#cast_content_member_'+tid).show();
				stick_cast.revealCast(first_page_load);
			} else { 
				site.page_in_transition=true;
				stick_cast.unrevealCast();
			}
		},
		unrevealCast:function() { 
			//TweenMax.set("#section_cast_copy", {'opacity': 0, 'y': shift} );
			TweenMax.to(".cast_content_member_copy", 0.5, { delay: 0, css: {'opacity': 0}, ease:Power3.easeOut/*,onComplete:stick_cast.middleRevealCast*/});
			stick_cast.middleRevealCast();
		},
		middleRevealCast:function() { 
			stick_cast.revealCast(false);
		},
		revealCast:function(first_page_load) { 
			var tid = stick_cast.new_tid;
			var oldtid = stick_cast.current_tid;
			
			//if (oldtid!==tid) { 
		
				var del = 0;
				if (first_page_load) { 
					del = 0.5;
					//oldtid="";
					TweenMax.set(".cast_content_member_img", {'x': '-102%'} );
				}
				
				for (var i=0;i<cast_order.length;i++) { 
					if (cast_order[i] !== tid && cast_order[i] !== oldtid) { 
						TweenMax.set("#cast_content_member_img_"+cast_order[i], {'x': '-102%'} );
					}
				}
				
				TweenMax.killTweensOf("#cast_content_member_img_"+tid);
				TweenMax.killTweensOf("#cast_content_member_img_"+oldtid);
				TweenMax.set("#cast_content_member_img_"+tid, {'x': '-102%'} ); //new one off screen
				TweenMax.set("#cast_content_member_img_"+oldtid, {'x': '0%'} );
				TweenMax.to("#cast_content_member_img_"+oldtid, 1.0, { delay: del, css: {'x': '102%'}, ease:Power4.easeOut});
				TweenMax.to("#cast_content_member_img_"+tid, 0.9, { delay: del+0.2, css: {'x': '0%'}, ease:Power4.easeOut});
			//}
			
			$('.cast_content_member_copy').hide();
			$("#cast_content_member_copy_"+tid).css({'opacity':0,'display':'block'});
			TweenMax.to("#cast_content_member_copy_"+tid, 0.5, { delay: del+0.5, css: {'opacity': 1}, ease:Power3.easeOut,onComplete:stick_cast.revealCast2});
			
		},
		revealCast2:function() { 
			stick_cast.current_tid = stick_cast.new_tid;
			site.page_in_transition=false;
			
			var site_mode = scGetSiteMode();
			if (site_mode==="large") { 
				site.startNano();
			} else { 
				site.stopNano();
			}	
			
			//set nav
			$('#cast_nav_entry_'+stick_cast.current_tid).addClass('active');
			$('#cast_nav_entry_'+stick_cast.current_tid + " .cast_nav_entry_name").css('color','#ffff');
		},
		
		setNewNav:function(tid) { 
			//cast_content_member_	
			//$('.cast_nav_entry').removeClass('active');
			//$('#cast_nav_entry_'+tid).addClass('active');
			
			//kill old
			stick_cast.killActiveNav();
			
			//add new
			var sel = $('#cast_nav_entry_'+tid);
			stick_cast.navOn(sel,true);
			
			
			//get current cast
			for (var i=0;i<cast_order.length;i++) { 
				if (cast_order[i] === tid) { 
					stick_cast.current_cast = i;
				} else {
					
				}
			}
		},
		
		killActiveNav:function() { 
			var sel = $('.cast_nav_entry.active');
			stick_cast.navOff(sel,true);
		},
		
		navOnEvent:function() { 
			$(this).addClass('on');
			stick_cast.navOn(this,false);
		},
		navOn:function(t,set_active_on_complete) { 
			var sel = $('.cast_nav_entry_line_inner',t);
			if (pxToNum(sel.css('left'))===0) { 
				stick_cast.navOn2(t,set_active_on_complete);
			} else{ 
				//	if (this).
				TweenMax.set(sel, {'left': '-102%'});
				
				var sel_name = $('.cast_nav_entry_name',t);
				TweenMax.killTweensOf(sel_name);
				TweenMax.killTweensOf(sel);
				TweenMax.to(sel_name, 0.250, { delay: 0, css: {'color': '#ffffff'}, ease:Power4.easeOut});
				TweenMax.to(
					sel, 
					0.450, 
					{ 
						delay: 0, 
						css: {'left': 0}, 
						ease:Power3.easeOut,
						onComplete:stick_cast.navOn2,
						onCompleteParams:[t,set_active_on_complete]
					});
			}
		},
		navOn2:function(t,set_active_on_complete) { 
			if (set_active_on_complete) { 
				$(t).addClass('active');
			}
		},
		navOffEvent:function() { 
			$(this).addClass('off');
			if ($(this).hasClass('active')===false) { 
				stick_cast.navOff(this,false);
			}
		},
		navOff:function(t,kill_active_on_complete) {
			var sel = $('.cast_nav_entry_line_inner',t);
			var sel_name = $('.cast_nav_entry_name',t);
			
			TweenMax.killTweensOf(sel_name);
			TweenMax.killTweensOf(sel);
			
			if (kill_active_on_complete) { 
				TweenMax.set(sel, {'left': 0});
				$(t).removeClass('active');
			}
				
			
			TweenMax.to(sel_name, 0.550, { delay: 0, css: {'color': '#fff600'}, ease:Power3.easeOut});
			
			TweenMax.to(
				sel, 
				0.550, 
				{ 
					delay: 0, 
					css: {'left': '102%'}, 
					ease:Power3.easeOut,
					onComplete:stick_cast.navOff2,
					onCompleteParams:[t,kill_active_on_complete]
				}
			);
		},
		navOff2:function(t,kill_active_on_complete) { 
			if (kill_active_on_complete) { 
				$(t).removeClass('active');
			}
		},
				
		////////////////////////////////////////////////////////////////////////////////		
		resize:function(evt) {
			stick_cast.resize2();
			setTimeout(	stick_cast.resize2,500);
		},
		resize2:function() {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			var site_mode = scGetSiteMode();
			
			
			//nav
			var nav_t,nav_l,nav_h,nav_w,nav_l,nav_t;
			if (site_mode==="large") { 
				var tt_top = getTTTop();
				var tt_h = getTTHeight();
				var tt_r = getTTRight();
				
				nav_t = 0;
				nav_l = tt_r + 50;
				nav_h = getTTBottom()+7;	
				nav_w = doc_width - tt_r - 100;
				
				var max_nav_w = 815;
				if (nav_w>max_nav_w) { 
					nav_w = max_nav_w;
				}
				
			} else { 
				nav_t = $('#section_cast_tt').height() + 40;
				nav_l = 20;
				nav_h = 'auto';
				nav_w = doc_width - 20 - 20;
				
			}
			$('#cast_nav').css({'top':nav_t,'left':nav_l,'width':nav_w,'height':nav_h});
			
			//content
			var section_margin_bottom,section_margin_top,section_h,section_w,section_l,cast_img_w;
			if (site_mode==="large") { 
				section_l = getNavRight();
				
				section_h = getHeightFromNavTop();
				section_margin_top = getNavTop();
				section_l += 15;
				section_w = (doc_width/1.5);  //1.6 was really wide
				
				//max w
				var section_w_max = 900;
				if (section_w>section_w_max) { 
					section_w=section_w_max;
				}
				
				//max h
				var section_h_max = 650;
				if (section_h>section_h_max) {
					section_h=section_h_max;
				}
				
				//the arrow placement
				var arrow_l = section_l + section_w + 3; 
				
				//42% screen space - in css also
				cast_img_w = section_w*.42; 
				
				//make sure content box is not smaller than cast_img_w
				if (section_h<cast_img_w) { 
					section_h=cast_img_w;
				}
				
			} else { 
				
				//mobile does not use nano
				section_w = doc_width-40-40;
				section_l = 40;
				section_margin_top = nav_t+$('#cast_nav').height()+20;;
				section_h = "102%";
				var arrow_l = section_l + section_w + 3;
				cast_img_w = section_w;
			}
			$('#cast_content').css({'top':section_margin_top,'left':section_l,'width':section_w,'height':section_h});
			$('#cast_arrow').css({'top':section_margin_top+22,'left':arrow_l});
			
			
			//cast_content_member_img
			cast_img_w = Math.floor(cast_img_w);
			$('#cast_content_member_img_holder').height(cast_img_w);
			$('.cast_content_member_img').height(cast_img_w);
			$('#cast_content_member_img_holder').width(cast_img_w);
			$('.cast_content_member_img').width(cast_img_w);
			
			if (site_mode==="large") { 
				site.startNano();
			} else { 
				site.stopNano();
			}			
		}//_resize
		
	}//obj
	stick_cast.current_cast=0;
	stick_cast.current_tid="";
	stick_cast.new_tid="";
	stick_cast.init();
	
});
