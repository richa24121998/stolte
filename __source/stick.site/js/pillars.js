$(document).ready(function() {
    var stick_pillars = {

        init:function () {
            var self = this;
            $(document).on( "resize", self.resize);

            //$('.pillar-buttona').on( "click", self.pillarClick);

            $(window).bind( 'hashchange', function(e) {
                self.hashChange();
            });

            $('.back-to-top').on( "click", self.backToTop);
            $('.pillar-buttona').on( "click", self.pillarLearnMore);


            //do load
            stick_pillars.current = stick_pillars.getCurrentFromHash();
            self.setPillar(stick_pillars.current);

        },//init

        pillarLearnMore:function() {
            if ($('body').hasClass('page_funding')) {
                window.location.hash = "#p";
            }
            return true;
        },

        getCurrentFromHash:function() {
            var cur = -1;
            if(window.location.hash) {
                var hash = '';
                hash = window.location.hash;
                hash = hash.replace('#p', '');
                cur = parseFloat(hash);
                if (cur!== 1 && cur !== 2 && cur !== 3) {
                    cur = -1;
                }
            }
            return cur;

        },
        pillarClick:function(evt) {
            /*
            var cur = stick_pillars.current;
            var curnew = stick_pillars.getCurrentFromHash();
            if (cur === curnew) {
                if ($('#content').hasClass('hash')) {
                    curnew = -1;
                } else {

                }
                stick_pillars.current = curnew
                stick_pillars.setPillar(stick_pillars.current);
            }
            */

        },
        hashChange:function(evt) {
            if ($('body').hasClass('page_funding')) {
                var hash = '';
                stick_pillars.current = stick_pillars.getCurrentFromHash();
                stick_pillars.fadeOut();
            }
            return true;
        },
        fadeOut:function() {
            TweenMax.fromTo('.pillars-content', 0.35,
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
                    delay: 0,
                    onComplete:stick_pillars.fadeIn
                }
            );
        },


        setPillar:function(index) {
            //top
            $('.pillars .col').removeClass('active');
            $('.pillars .col'+index).addClass('active');

            $('.pillar-buttons .col').removeClass('active');
            $('.pillar-buttons .col'+index).addClass('active');

            //bottom
            $('.pillar-content').removeClass('active');
            $('.pillar-content'+index).addClass('active');

            //no hash?
            if (index<0) {
                $('#content').addClass('nohash');
                $('#content').removeClass('hash');
            } else {
                $('#content').removeClass('nohash');
                $('#content').addClass('hash');
            }

            //set links
            $('.pillar-buttons .col').each(function( i ) {
                var index = $(this).attr('index');
                var nohashhref = $('a',this).attr('nohashhref');
                if ($(this).hasClass('active')) {
                    nohashhref += "#p";
                } else {
                    nohashhref += "#p"+index;
                }
                $('a',this).attr('href',nohashhref);

            });

            if (index>0) {
                stick_pillars.gotoFundingDetails();
            }

        },

        fadeIn:function() {
            stick_pillars.setPillar(stick_pillars.current);
            TweenMax.fromTo('.pillars-content', 0.75,
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
                    delay: 0
                }
            );



        },

        gotoFundingDetails:function() {
            $.scrollTo("#funding-details", 500, {easing: 'easeInOutQuad'});
        },
        backToTop:function() {
            $.scrollTo("#funding-priorities", 500, {easing: 'easeInOutQuad'});
        },

        resize:function(evt) {

        },
        resize2:function() {

            var doc_width = $(window).width();
            var doc_height = $(window).height();



        }//_resize

    }//obj
    stick_pillars.current=0;
    stick_pillars.init();

});
