$(document).ready(function() {
    var stick_quotes = {

        init:function () {
            var self = this;
            $(document).on( "resize", self.resize);

            $('.quotes .circle').on( "click", self.dotClick);

            self.current=0;
            self.setQuote(stick_quotes.current);
            self.start();

        },//init

        start:function() {
            stick_quotes.slide_count=$('.quote-holder .quote').length;
            if (stick_quotes.slide_count>1) {
                stick_quotes.fadeOut();
            }
        },


        dotClick:function(evt) {
            TweenMax.killTweensOf('.quotes .quote-holder');
            stick_quotes.kill_timer=true;
            stick_quotes.current = parseFloat($(this).attr('index'));
            stick_quotes.fadeOut();
        },
        fadeOut:function() {
            var del = 0;
            if (stick_quotes.kill_timer===false) {
                del=10;
            }
            TweenMax.fromTo('.quotes .quote-holder', 0.35,
                {
                    scaleX: 1,
                    y: 0,
                    opacity:1
                },
                {
                    scaleX: 0.95,
                    y: 0,
                    opacity:0,
                    ease:Linear.easeNone,
                    delay: del,
                    onComplete:stick_quotes.fadeIn,
                    onUpdate:cssFilterTween,
                    onUpdateParams: ["{self}","blur", 0, stick_quotes.blurLevel]
                }
            );
        },


        setQuote:function(index) {
            $('.quotes .circle').removeClass('active');
            $('.quotes .circle'+index).addClass('active');
            TweenMax.set('.quotes .quote',{display:'none'});
            TweenMax.set('.quotes .quote'+index,{display:'block'});
        },

        fadeIn:function() {
            var cb=null;
            if (stick_quotes.kill_timer) {
               //no more timer

            } else {
                //time is looping automatically, so increment
                stick_quotes.current++;
                if (stick_quotes.current>=stick_quotes.slide_count) {
                    stick_quotes.current=0;
                }
                cb = stick_quotes.fadeOut;
            }
            stick_quotes.setQuote(stick_quotes.current);

            TweenMax.fromTo('.quotes .quote-holder', 1.25,
                {
                    scaleX: 0.95,
                    y: 0,
                    opacity:0
                },
                {
                    scaleX: 1,
                    y: 0,
                    opacity:1,
                    ease:Quint.easeOut,
                    delay: 0,
                    onUpdate:cssFilterTween,
                    onUpdateParams: ["{self}","blur", stick_quotes.blurLevel, 0],
                    onComplete:cb
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
    stick_quotes.current=0;
    stick_quotes.kill_timer=false;
    stick_quotes.slide_count=0;
    stick_quotes.blurLevel=0.5;
    stick_quotes.init();

});
