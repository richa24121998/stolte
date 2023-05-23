$(document).ready(function() {
    var stick_top_image = {

        init:function () {
            var self = this;
            $(document).on( "resize", self.resize);

            //do load
            stick_top_image.current = 0;
            self.start();

        },//init

        start:function() {
            stick_top_image.slide_count=$('.top-image-hook').length;
            if (stick_top_image.slide_count>1) {
                stick_top_image.fadeOut();
            }
        },


        fadeOut:function() {
            TweenMax.fromTo('#top-image-hook-'+stick_top_image.current, 0.5,
                {
                    scaleX: 1,
                    y: 0,
                    opacity:1
                },
                {
                    scaleX: 1,
                    y: 0,
                    opacity:0,
                    ease:Linear.easeNone,
                    delay: 5,
                    onStart:stick_top_image.fadeIn
                }
            );

        },

        fadeIn:function() {
            stick_top_image.current++;
            if (stick_top_image.current>=stick_top_image.slide_count) {
                stick_top_image.current=0;
            }

            TweenMax.fromTo('#top-image-hook-'+stick_top_image.current, 0.5,
                {
                    scaleX: 1,
                    y: 0,
                    opacity:0
                },
                {
                    scaleX: 1,
                    y: 0,
                    opacity:1,
                    ease:Linear.easeNone,
                    delay: 0,
                    onComplete:stick_top_image.fadeOut
                }
            );
        },



        resize:function(evt) {

        },
        resize2:function() {

            var doc_width = $(window).width();
            var doc_height = $(window).height();



        }//_resize

    }//obj
    stick_top_image.current=0;
    stick_top_image.slide_count=0;
    stick_top_image.init();

});
