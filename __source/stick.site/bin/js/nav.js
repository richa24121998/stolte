$(document).ready(function() {
	var stick_nav = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self.resize);
			$(document).on( "stick-beginNewPageChange", self.newPageChange); //do it on begin click
			$(document).on( "stick-middleReveal_everythingIsOut", self.midPageChange); //and also in middle (helps with deep linking also)
			
			$('#nav_menu li').on({
			    mouseenter: function() {
			    	var sel_holder = $('.bg_over_holder',this);
			    	var sel = $('.bg_over',this);
			    	TweenMax.set(sel_holder, {'text-align':'left'});
			    	TweenMax.killTweensOf(sel);
			    	TweenMax.set(sel, {'width': '0%'});
			    	TweenMax.to(sel, 0.750, { delay: 0, css: {'width': '100%'}, ease:Power3.easeOut});
			    },
			    mouseleave: function() {
					var sel_holder = $('.bg_over_holder',this);
			    	var sel = $('.bg_over',this);
			    	$('.bg_over_holder',this).css({'text-align':'right'});
			    	TweenMax.killTweensOf(sel);
			    	TweenMax.set(sel, {'width': '100%'});
			    	TweenMax.to(sel, 1.25, { delay: 0, css: {'width': '0%'}, ease:Power3.easeOut});
			    }
			});
			
			
		},//init
		
		seqPreloadDone:function(e){ 
			//trace(e);	
			//trace(e.tid);
			$('#nav_tt').on('mouseenter', function() { stick_nav.seq_instance.resume(true);});
			$('#nav_tt').on('mouseleave', function() { stick_nav.seq_instance.stop();});
		},
				
		
		
		newPageChange:function() { 
			stick_nav.setNav();
			stick_nav.revealUnrevealCheck();
			
		},
		midPageChange:function() { 
			stick_nav.setNav();
			if (stick_nav.did_once===false) { 
				stick_nav.revealUnrevealCheck();
			}
		},
		
		revealUnrevealCheck:function() { 
			var tid = site.obj_new.section;
			//reveal/unreveal
			stick_nav.did_once=true;
			if (tid==="gallery") { 
				stick_nav.unrevealNav();
				stick_nav.did_first_reveal=true;
			} else { 
				stick_nav.revealNav();
			}
				
		},
		
		
		revealNav:function(evt) {
			if (stick_nav.is_revealed===false) { 
				stick_nav.is_revealed=true;
				
				var doc_height = $(window).height();
				
				var tme = 0.75;
				var del = 0;
				var del_step = 0.07;
				var shift = doc_height;
				
				$("#nav").show();
				TweenMax.set("#nav", {'opacity': 1} );
				TweenMax.set("#nav_tt", {'opacity': 0, 'y': shift} );
				TweenMax.set("#nav_menu_dt", {'opacity': 0, 'y': shift} );
				TweenMax.set("#nav_menu li", {'opacity': 0, 'y': shift} );
				
				var nav_tt_opacity=1;
				if (stick_nav.did_first_reveal===false) { 
					nav_tt_opacity=0;
					
					//load baloons
					$(document).on( "stick-seq-preload-done", stick_nav.seqPreloadDone);
					stick_nav.seq_instance = new stick_seq('nav_tt_seq',stick_config.subfolder+'assets/site/images/framework/tt/'+stick_config.heart_name_seed,0,stick_config.num_heart_baloons,'png',0,stick_config.num_heart_baloons,false);
					stick_nav.seq_instance.preload();
					
				} 
				stick_nav.did_first_reveal=true;
				
				//CustomWiggle.create("myWiggle", {wiggles:6});
				
				TweenMax.to("#nav_tt", tme, { delay: del, css: {'opacity': nav_tt_opacity, 'y': 0}, ease:Power3.easeOut,onComplete:stick_nav.playSeq });
				del += del_step;
				
				TweenMax.to("#nav_menu_dt", tme, { delay: del, css: {'opacity': 1, 'y': 0}, ease:Power3.easeOut});
				del += del_step;
				
				$( "#nav_menu li" ).each(function() {
					TweenMax.to(this, tme, { delay: del, css: {'opacity': 1, 'y': 0}, ease:Power3.easeOut});
					del += del_step;
				});
			}
			
		},
		
		playSeq:function() { 
			if (stick_nav.did_seq_once===false) { 
				stick_nav.did_seq_once=true;
				//stick_nav.seq_instance.resume(true); //DONT PLAY LOOP AFTER DONE
			}
		},
		
		
		unrevealNav:function(evt) {
			if (stick_nav.is_revealed) { 
				stick_nav.is_revealed=false;
				
				var doc_height = $(window).height();
				var tme = 0.75;
				var del = 0;
				var del_step = 0.07;
				var shift = -doc_height;
				
				
				TweenMax.to("#nav_tt", tme, { delay: del, css: {'opacity': 0, 'y': shift}, ease:Power3.easeIn});
				del += del_step;
				
				TweenMax.to("#nav_menu_dt", tme, { delay: del, css: {'opacity': 0, 'y': shift}, ease:Power3.easeIn});
				del += del_step;
				
				$( "#nav_menu li" ).each(function(i) {
					var cb = null;
					if (i+1 >= $( "#nav_menu li" ).length) { 
						cb = stick_nav.unrevealNav2;
					}
					TweenMax.to(this, tme, { delay: del, css: {'opacity': 0, 'y': shift}, ease:Power3.easeIn,onComplete:cb});
					del += del_step;
				});
				
			}
		},
		unrevealNav2:function() {
			$("#nav").hide();
		},
		
		setNav:function(evt) {
			//set active
			var tid = site.obj_new.section;
			if (tid==="") tid = "home";
			
			//remove old
			TweenMax.killTweensOf($("#nav_menu li.active .bg_over"));
			$("#nav_menu li.active .bg_over").css({'width':'100%'})
			$("#nav_menu li.active .bg_over_holder").css('text-align','right');
			TweenMax.to( $("#nav_menu li.active .bg_over"), 1.25, { delay: 0, css: {'width': '0%'}, ease:Power3.easeOut});
			$("#nav_menu li").removeClass('active');
			
			//add new
			//$("#navmenu_li_" +tid  + " .bg_over_holder").css('text-align','left');
			//TweenMax.to( $("#nav_menu li.active .bg_over"), 0.750, { delay: 0, css: {'width': '100%'}, ease:Power3.easeOut});
			$("#navmenu_li_"+tid).addClass('active');
			
			
			//do mobile also
			$("#mobile_nav_overlay li").removeClass('active');
			$("#mobilenavmenu_li_"+tid).addClass('active');
			
		},
	
		
		
		resize:function(evt) {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			var nav_w = (doc_width/2)*0.75; //2/3 of half width
			if (nav_w>501) nav_w = 501;
			if (nav_w<350) nav_w = 350;
			nav_w = Math.round(nav_w);
			
			$('#nav').css({'width':nav_w});
				
			$('#topline').css({'width':nav_w+50});
			
			//special preloader hooke
			var logo_top = getTTTop();
			var site_mode = scGetSiteMode();
			if (site_mode==="tiny") { 
				nav_w = doc_width-100;
				var max_nav_w = 300;
				if (nav_w>max_nav_w) { 
					nav_w=max_nav_w;
				}
			}
			$('#preloader_tt').css({'width':nav_w,'top':logo_top});
			$('#preloader_tt').show();
			
			//#nav_tt_seq - baloon;
			//default is 100x100 baloon lines up with the 501x210 nav tt
			//this placement is 0 top and 272 left
			var pct_nav_w = nav_w/501;
			var nat_tt_seq_w = pct_nav_w*100;
			var nat_tt_seq_l = pct_nav_w*272;
			var nat_tt_seq_t = pct_nav_w*-15;
			$('.tt_seq').css({'width':nat_tt_seq_w,'height':nat_tt_seq_w,'left':nat_tt_seq_l,'top':nat_tt_seq_t});
		
			
		}//resize
		
	}//obj
	stick_nav.is_revealed = false;
	stick_nav.did_first_reveal = false;
	stick_nav.did_once = false;
	stick_nav.did_seq_once = false;
	stick_nav.init();
	
});
