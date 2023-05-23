$(document).ready(function() {
	var stick_nav = {
		
		init:function () { 
			var self = this;
            $(document).on( "resize", self.resize);

            $('.navitem').on( "click", self.navClick);

            //first
			//var first_url = page_obj.meta_url;
            var first_url = "";
			if (first_url==="") {
                first_url="home";
			}
            stick_nav.setNav(first_url);

		},//init

        navClick:function(evt) {
            var tid = $(this).attr('tid');
            stick_nav.setNav(tid);

        },

        setNav:function(tid) {
            //set active
            $('.navitem li').removeClass('active');
            $("#navmenu_li_"+tid).addClass('active');
            $("#mobilenavmenu_li_"+tid).addClass('active');

        },

        resize:function(evt) {
            stick_nav.resize2();
            setTimeout(	stick_nav.resize2,500);
        },
        resize2:function() {

			var doc_width = $(window).width();
			var doc_height = $(window).height();

			$('#nav .txt').each(function(index) {
                var thew = $('span',this).width();
                $(this).css('width',thew+20);
            });
			
			
		}//_resize
		
	}//obj
	stick_nav.init();
	
});
