$(document).ready(function() {
    var stick_grantees = {

        init:function () {
            var self = this;
            $(document).on( "resize", self.resize);


            //FILTERS
            $('.grantees-filter .cb-square').on( "click", self.filterClick);
            $('#grantee-filter-search').keyup(self.filterKeyUp);
            //FILTERS INITIAL LOAD
            $('#grantee-filter-search').val('');

            //POPUPS
            $(document).keyup(function(e) {
                if (self.overlay_is_open) {
                    if (e.keyCode === 27) { // escape key
                        self.closePopup();
                    }
                }
            });
            $('#popup-x').on( "click", self.closePopup);
            $('#popup_scrim').on( "click", self.closePopup);

            $('.grantees .col').on( "click", self.granteeClick);
            //POPUP INITIAL LOAD
            if (site_config.site_segment1===stick_grantees.url && site_config.site_segment2!=="") {
                self.setPopup(site_config.site_segment2,false);
                self.openPopup();
            }

        },//init


        clearChecks:function() {
            var section = 'col1';
            $( ".grantees-filter ." + section + " .cb-square" ).each(function( index ) {
                if ( $(this).attr('val')==="all" ) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
            section = 'col2';
            $( ".grantees-filter ." + section + " .cb-square" ).each(function( index ) {
                if ( $(this).attr('val')==="all" ) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        },
        clearSearch:function() {
            $('#grantee-filter-search').val('');
        },



        filterKeyUp:function() {
            stick_grantees.clearChecks();
            clearTimeout(stick_grantees.filter_delay_tmr);
            stick_grantees.filter_delay_tmr = setTimeout(stick_grantees.redrawFilters, 500);
        },
        filterClick:function(e) {
            //clear search
            stick_grantees.clearSearch();

            //section
            var section = $(this).attr('section');
            if ( $(this).attr('val')==="all" ) {
                //kill other toggles
                $('.grantees-filter .' + section + ' .cb-square-other' ).removeClass('active');
            } else {
                //kill all
                $('.grantees-filter .' + section + ' .cb-square-all' ).removeClass('active');
            }
            //toggle
            $(this).toggleClass('active');

            //add all if all are gone
            var allgone=true;
            $( ".grantees-filter ." + section + " .cb-square" ).each(function( index ) {
                if ($(this).hasClass('active')) {
                    allgone=false;
                }
            });
            if (allgone) {
                $('.grantees-filter .' + section + ' .cb-square-all').addClass('active');
            }

            stick_grantees.redrawFilters();
        },
        redrawFilters:function() {
            //GET VALUES
            //col1 - funding prioroties
            var fp_val=Array();
            $( ".grantees-filter .col1 .cb-square" ).each(function( index ) {
                if ($(this).hasClass('active')) {
                    var val = $(this).attr('val');
                    fp_val.push(val);
                }
            });
            //col2 - year
            var year_val=Array();
            $( ".grantees-filter .col2 .cb-square" ).each(function( index ) {
                if ($(this).hasClass('active')) {
                    var val = $(this).attr('val');
                    year_val.push(val);
                }
            });
            //search

            trace('FILTERS');
            trace(fp_val);
            trace(year_val);

            //FILTER
            var didone=false;
            $( ".grantees .col" ).each(function( index ) {
                var show=true;


                var meta_funding_priorities = $(this).attr('meta-funding-priorities');
                var meta_year = $(this).attr('meta-year');
                var meta_title = $(this).attr('meta-title');
                meta_title = meta_title.toLowerCase();


                //PRIORITIES: filter if not all, check that it at least has one instance
                if (fp_val[0]!=='all') {
                    var oneinstance=false;
                    for (var i=0;i<fp_val.length;i++) {
                        var tval = fp_val[i];
                        var n = meta_funding_priorities.indexOf(tval);
                        if (n>-1) {
                            oneinstance=true;
                        }
                    }
                    if (oneinstance===false) {
                        show = false;
                    }
                }

                //DATE: filter if not all, check that it at least has one instance
                if (year_val[0]!=='all') {
                    var oneinstance=false;
                    for (var i=0;i<year_val.length;i++) {
                        var tval = year_val[i];
                        var n = meta_year.indexOf(tval);
                        if (n>-1) {
                            oneinstance=true;
                        }
                    }
                    if (oneinstance===false) {
                        show = false;
                    }
                }

                //NAME:
                var searchval = $('#grantee-filter-search').val();
                searchval = searchval.toLowerCase();
                trace(searchval + ":"+meta_title);
                if (searchval !=='' ) {
                    var n = meta_title.indexOf(searchval);
                    if (n==-1) {
                        show = false;
                    }
                }

                //final
                if (show) {
                    didone=true;
                    $(this).css({'display':'block'});
                } else {
                    $(this).css({'display':'none'});
                }


            });

            if (didone) {
                $('#grantees-no-results').hide();
            } else {
                $('#grantees-no-results').show();
            }
        },



        setPopup:function(slug,change_url) {
            stick_grantees.popup = slug;
            if (change_url) {
                changeUrl(slug, site_config.base_url + stick_grantees.url + "/" + slug);
            }
            var body = $('.col-' +slug + ' .grantee-body').html();
            $('#popup-hook').html(body);

            //CHANGE BODY POSITIONING
            /*
            $('#popup-hook .popup-image-bg-body').addClass('contact-bottom clearfix');
            var lasth2 = $('#popup-hook h2' ).last();
            $( lasth2 ).before( $('#popup-hook .popup-image-bg-body'));
            var allremaining = $('#popup-hook .popup-image-bg-body').nextAll();
            $( allremaining ).wrapAll( "<div class='contact-txt contact-bottom clearfix'></div>");
            $( '#popup-hook .contact-bottom' ).wrapAll( "<div class='contact-bottom-holder clearfix'></div>");
            $( '#popup-hook .popup-image-bg-body-img' ).wrapAll( "<div class='div-table'><div class='div-tablecell'></div></div>");
            $( '#popup-hook .contact-txt' ).wrapInner( "<div class='div-table'><div class='div-tablecell'></div></div>");
            */

            stick_grantees.resize();
        },

        granteeClick:function(evt) {
            var slug = $(this).attr('slug');
            stick_grantees.setPopup(slug,true);
            stick_grantees.openPopup();

        },
        openPopup:function() {
            //stick_grantees.popup

            //OPEN POPUP
            $('#popup').css({'display':'block'});

            //SET POPUP
            $("#popup .nano").nanoScroller({ stop: true });
            $("#popup .nano").nanoScroller({ sliderMaxHeight: 200 });
            $("#popup .nano").nanoScroller({ scroll: 'top' });
            
            TweenMax.fromTo('#popup', 0.75,
                {
                    opacity:0
                },
                {
                    opacity:1,
                    ease:Linear.easeNone,
                    delay: 0
                }
            );

            $('body').addClass('overflow-hidden');
            stick_grantees.overlay_is_open=true;

        },

        closePopup:function() {
            //stick_grantees.popup

            //CLOSE POPUP
            TweenMax.fromTo('#popup', 0.75,
                {
                    opacity:1
                },
                {
                    opacity:0,
                    ease:Linear.easeNone,
                    delay: 0,
                    onComplete:stick_grantees.closePopup2
                }
            );
        },
        closePopup2:function() {
            $('body').removeClass('overflow-hidden');
            $('#popup').css({'display':'none'});
            stick_grantees.overlay_is_open=false;
            changeUrl('', site_config.base_url + stick_grantees.url + "/");


        },



        resize:function(evt) {
            stick_grantees.resize2();
            setTimeout(	stick_grantees.resize2,500);
        },
        resize2:function() {

            var doc_width = $(window).width();
            var doc_height = $(window).height();

            $("#popup .nano").nanoScroller({ sliderMaxHeight: 200 });

        }//_resize

    }//obj
    stick_grantees.url = "our-grantees";
    stick_grantees.filter_delay_tmr;
    stick_grantees.popup="";
    stick_grantees.overlay_is_open=false;
    stick_grantees.init();

});
