$(document).ready(function() {

	$(document).ready(function () {
		var $sidebar = $("#sidebar-menu");
		var $openButton = $("#sidebar-button");
		var $closeButton = $("#sidebar-close-button")
		$openButton.click(function () {
		  if ($sidebar.hasClass("sidebar-close")) {
			$sidebar.removeClass("sidebar-close").addClass("sidebar-open");
		  }
		});
		$closeButton.click(function () {
		  if ($sidebar.hasClass("sidebar-open")) {
			$sidebar.removeClass("sidebar-open").addClass("sidebar-close");
		  } 
		});
	  
	  });

	  
	// var stick_mobile_nav = {
		
	// 	init:function () { 
	// 		var self = this;
	// 		$(document).on( "stick-resize", self._resize);
	// 		$(document).on( "stick-beginNewPageChange", self.overlayHide);
	// 		$(document).on( "stick-overlay-open", self.overlayHide);

    //         $('#mobile_nav_overlay a').on( "click", self.overlayHide);

    //         stick_mobile_nav.overlayHide();

	// 		$('#mobile_nav_hamburger .hamburger').click(self.doHamburerToggle);
    //         $('#mobile_nav_overlay .navitem').click(self.overlayHide);

	// 		stick_mobile_nav.overlayHide();
	// 	},//init
	
	// 	doHamburerToggle:function(){
	// 		if ($(this).hasClass('is-active')) {
	// 			stick_mobile_nav.overlayHide();
	// 		} else { 
				
	// 			stick_mobile_nav.overlayShow();
	// 		}
			
	// 	},//doHamburerToggle
		
	// 	overlayShow:function() { 
	// 		$('#mobile_nav_hamburger .hamburger').addClass('is-active');
	// 		$('#mobile_nav_overlay').removeClass('hidden');
	// 	},
	// 	overlayHide:function() { 
	// 		$('#mobile_nav_hamburger .hamburger').removeClass('is-active');
	// 		$('#mobile_nav_overlay').addClass('hidden');
	// 	},
		
		
	// 	_resize:function(evt) {
	// 		//BGS
			
	// 		var doc_width = $(window).width();
	// 		var doc_height = $(window).height();
			
			
	// 	}//_resize
		
	// }//obj
	// stick_mobile_nav.init();
	
});
