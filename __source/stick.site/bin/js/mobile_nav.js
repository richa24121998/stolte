$(document).ready(function() {
	var stick_mobile_nav = {
		
		init:function () { 
			var self = this;
			$(document).on( "stick-resize", self._resize);
			$(document).on( "stick-beginNewPageChange", self.overlayHide);
			$(document).on( "stick-overlay-open", self.overlayHide); 
			$('#mobile_nav_hamburger .hamburger').click(self.doHamburerToggle);
			stick_mobile_nav.overlayHide();
		},//init
	
		doHamburerToggle:function(){
			if ($(this).hasClass('is-active')) { 
				
				stick_mobile_nav.overlayHide();
			} else { 
				
				stick_mobile_nav.overlayShow();
			}
			
		},//doHamburerToggle
		
		overlayShow:function() { 
			$('#mobile_nav_hamburger .hamburger').addClass('is-active');
			$('#mobile_nav_overlay').removeClass('hidden');
		},
		overlayHide:function() { 
			$('#mobile_nav_hamburger .hamburger').removeClass('is-active');
			$('#mobile_nav_overlay').addClass('hidden');
		},
		
		
		_resize:function(evt) {
			//BGS
			
			var doc_width = $(window).width();
			var doc_height = $(window).height();
			
			
		}//_resize
		
	}//obj
	stick_mobile_nav.init();
	
});
