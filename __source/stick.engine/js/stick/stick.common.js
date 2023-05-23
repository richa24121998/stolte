
//////////////////////////////////////////////////////////////////////////////
////// COMMON JS FUNCTIONS
////// /stickcreations.com 3-20-2017
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//////STICK SITE RELATED
//////////////////////////////////////////////////////////////////////////////
function scAddAnalyticsEventHandle(container_id) { 
	$(container_id + ' .analytics_handle').click(scAnalyticsEvent);
}
function scAnalyticsEvent(container_id,cb) { 
	var l1 = $(this).attr('l1');
	var l2 = $(this).attr('l2');
	var l3 = $(this).attr('l3');
	gaTrackEvent(l1,l2,l3);
}
function scGetSiteMode() { 
	doc_width = $(document).width();
	doc_height = $(document).height();
	
	var meta_breakbpoint = pxToNum($('#meta_breakpoint').css('padding-top'));
	var site_mode = "large";
	if (meta_breakbpoint>0) { 
		if ( doc_width<meta_breakbpoint) { 
			site_mode = "tiny";
		}
	}
	return site_mode;
}


function getURLPageFromLocation(subfolder) {
	var current_location = String(window.location);
	current_location = current_location.toLowerCase();
	//current_location = current_location.replace(base_url,"");
	var strpos1 = current_location.indexOf('://');
	if (strpos1>-1) {
		var strpos2 = current_location.indexOf('/',strpos1+3);
		if (strpos2>-1) {
			//alert("1:"+current_location);
			current_location = current_location.substr(strpos2+1);
			//alert("2:"+current_location);
			current_location = current_location.replace(subfolder,"");
		}
	}
	//alert("3:"+current_location);
	return current_location;
}

function scSetBodyClass(route) { 
	//change body class
    //alert(route);
    if (route!==undefined && route!=='undefined' && route!=='') { 
   		route = route.trim();
   		if (route.substr(0,1)==="/") { 
	   		route = route.substr(1);
	   	}
	   	if (route.substr(-1,1)==="/") { 
	   		route = route.substr(0,route.length-1);
	   	}
	   	route = route.replace(' ','_');
	   	route = route.replace('/','_');
	   	route = route.replace('__','_');
   		scRemoveClassPrefix('body','page_');
   		$('body').addClass('page_'+route);	
   	}
}
function scRemoveClassPrefix(tid,prefix) { 
	var classList = Array();
	var classes = $(tid).attr('class');
	if (classes!==undefined && classes!=='undefined' && classes!=='') { 
		classList = classes.split(/\s+/);
	}
	var prefix_length = prefix.length;
	$.each(classList, function(index, item) {
	    if (item.substring(0,prefix_length) === prefix) {
	       $(tid).removeClass(item);
	    }
	});	
}



//////////////////////////////////////////////////////////////////////////////
//////URL & BROWSER RELATED
//////////////////////////////////////////////////////////////////////////////


//window.onpopstate = history.onpushstate = function(e) { ... }
(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        // ... whatever else you want to do
        // maybe call onhashchange e.handler
        return pushState.apply(history, arguments);
    }
})(window.history);

		
//browser
var browser = {
        chrome: false,
        mozilla: false,
        opera: false,
        msie: false,
        safari: false,
		name:"unknown"
};
var sUsrAg = navigator.userAgent;
if(sUsrAg.indexOf("Chrome") > -1) {
	browser.chrome = true;
	browser.name = "chrome";
} else if (sUsrAg.indexOf("Safari") > -1) {
	browser.safari = true;
	browser.name = "safari";
} else if (sUsrAg.indexOf("Opera") > -1) {
	browser.opera = true;
	browser.name = "opera";
} else if (sUsrAg.indexOf("Firefox") > -1) {
	browser.mozilla = true;
	browser.name = "firefox";
} else if (sUsrAg.indexOf("MSIE") > -1) {
	browser.msie = true;
	browser.name = "msie";
}


function changeUrl(title, url) {
    //if (url.substr(0,1)==='/') {
        //url = url.substr(1);
    //}
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        //alert("HTML5 not supported");
    }
}

function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}
		

//////////////////////////////////////////////////////////////////////////////
//////ANALYTICS
//////////////////////////////////////////////////////////////////////////////

function gaTrackEvent(lev1,lev2,lev3) { 
	trace("ga: " + lev1 + ":" + lev2 + ":" +  lev3);
	//ga('send', 'event', lev1,lev2,lev3);  // value is a number.
    gtag('event', 'engagement', {
        'event_category': lev1,
        'event_action': lev2,
        'event_label': lev3,
    });
}


//////////////////////////////////////////////////////////////////////////////
//////DEBUG
//////////////////////////////////////////////////////////////////////////////

//add console
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

//trace
function trace(txt) { 
	if (window.console) console.log(txt);
	//$('#debug').html($('#debug').html() + txt + "::::");
}


//////////////////////////////////////////////////////////////////////////////
//////TXT, NUMBER, ARRAY MANIPULATION
//////////////////////////////////////////////////////////////////////////////
//add ability to push one array into another
//var newArray = [];
//newArray.pushArray(dataArray1);
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};


//add indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}



function pxToNum(txt) { 
	txt = txt.toString();
	var kill = "px";
	var script = "/" + kill + "/g";
	//alert(script);
	var t = txt.replace(kill,'');
	t = parseFloat(t);
	return t;
}
function stripCharacters(txt,kill) { 
	var script = "/" + kill + "/g";
	//alert(script);
	return txt.replace(kill,'');
}

function addZeroIfSingle(v) { 
	v = parseFloat(v);
	if (v<10) v = "0"+v;
	return v;
}

//usage shuffleArray(arr); - NO RETURN VALUE
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

//////////////////////////////////////////////////////////////////////////////
//////FIELDS
//////////////////////////////////////////////////////////////////////////////

function isPhotoType(val) {
	if (val.indexOf(".jpg")>=0 || val.indexOf(".jpeg")>=0 || val.indexOf(".gif")>=0 || val.indexOf(".png")>=0) { 
		return true;
	} else { 
		return false;
	}
}

function isValidPhone(p) {
  var phoneRe =  /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  var digits = p.replace(/\D/g, "");
  return (digits.match(phoneRe) !== null);
}

//isnumeric
function isNumeric(val) {
	if (isNaN(parseFloat(val))) {
		return false;
	} else { 
		return true;
	}
}

function isValidEmail(val) { 
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(reg.test(val) == false) {	
		return false;
	} else { 
		return true;
	}
}

function isValidUSZip(sZip) {
   return /^\d{5}(-\d{4})?$/.test(sZip);
}

function magicFormRefresh() { 
	//magic form
	$('.magic_form').each(function(index) {
		var attr = $(this).attr("starter");
		var val = $(this).val();
		trace("x:"+val+" - starter"+attr);
		if (val=="") { 
			$(this).val(attr);
		}
	});
	$('.magic_form').focus( function() {
		var val = $(this).val();
		var attr = $(this).attr("starter");
		if (val==attr) $(this).val("");
	});
	$('.magic_form').blur( function() {
		var val = $(this).val();
		if (val=="") { 
			var attr = $(this).attr("starter");
			$(this).val(attr);
		}
	});
}
	
//////////////////////////////////////////////////////////////////////////////
//////STATES, ZIPS, LOCATIONS
//////////////////////////////////////////////////////////////////////////////
	function isValidUSState(val) { 
	var ret = false;
	val = val.toUpperCase();
	var usStates = [
		{ name: 'ALABAMA', abbreviation: 'AL'},
		{ name: 'ALASKA', abbreviation: 'AK'},
		{ name: 'AMERICAN SAMOA', abbreviation: 'AS'},
		{ name: 'ARIZONA', abbreviation: 'AZ'},
		{ name: 'ARKANSAS', abbreviation: 'AR'},
		{ name: 'CALIFORNIA', abbreviation: 'CA'},
		{ name: 'COLORADO', abbreviation: 'CO'},
		{ name: 'CONNECTICUT', abbreviation: 'CT'},
		{ name: 'DELAWARE', abbreviation: 'DE'},
		{ name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
		{ name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
		{ name: 'FLORIDA', abbreviation: 'FL'},
		{ name: 'GEORGIA', abbreviation: 'GA'},
		{ name: 'GUAM', abbreviation: 'GU'},
		{ name: 'HAWAII', abbreviation: 'HI'},
		{ name: 'IDAHO', abbreviation: 'ID'},
		{ name: 'ILLINOIS', abbreviation: 'IL'},
		{ name: 'INDIANA', abbreviation: 'IN'},
		{ name: 'IOWA', abbreviation: 'IA'},
		{ name: 'KANSAS', abbreviation: 'KS'},
		{ name: 'KENTUCKY', abbreviation: 'KY'},
		{ name: 'LOUISIANA', abbreviation: 'LA'},
		{ name: 'MAINE', abbreviation: 'ME'},
		{ name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
		{ name: 'MARYLAND', abbreviation: 'MD'},
		{ name: 'MASSACHUSETTS', abbreviation: 'MA'},
		{ name: 'MICHIGAN', abbreviation: 'MI'},
		{ name: 'MINNESOTA', abbreviation: 'MN'},
		{ name: 'MISSISSIPPI', abbreviation: 'MS'},
		{ name: 'MISSOURI', abbreviation: 'MO'},
		{ name: 'MONTANA', abbreviation: 'MT'},
		{ name: 'NEBRASKA', abbreviation: 'NE'},
		{ name: 'NEVADA', abbreviation: 'NV'},
		{ name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
		{ name: 'NEW JERSEY', abbreviation: 'NJ'},
		{ name: 'NEW MEXICO', abbreviation: 'NM'},
		{ name: 'NEW YORK', abbreviation: 'NY'},
		{ name: 'NORTH CAROLINA', abbreviation: 'NC'},
		{ name: 'NORTH DAKOTA', abbreviation: 'ND'},
		{ name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
		{ name: 'OHIO', abbreviation: 'OH'},
		{ name: 'OKLAHOMA', abbreviation: 'OK'},
		{ name: 'OREGON', abbreviation: 'OR'},
		{ name: 'PALAU', abbreviation: 'PW'},
		{ name: 'PENNSYLVANIA', abbreviation: 'PA'},
		{ name: 'PUERTO RICO', abbreviation: 'PR'},
		{ name: 'RHODE ISLAND', abbreviation: 'RI'},
		{ name: 'SOUTH CAROLINA', abbreviation: 'SC'},
		{ name: 'SOUTH DAKOTA', abbreviation: 'SD'},
		{ name: 'TENNESSEE', abbreviation: 'TN'},
		{ name: 'TEXAS', abbreviation: 'TX'},
		{ name: 'UTAH', abbreviation: 'UT'},
		{ name: 'VERMONT', abbreviation: 'VT'},
		{ name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
		{ name: 'VIRGINIA', abbreviation: 'VA'},
		{ name: 'WASHINGTON', abbreviation: 'WA'},
		{ name: 'WEST VIRGINIA', abbreviation: 'WV'},
		{ name: 'WISCONSIN', abbreviation: 'WI'},
		{ name: 'WYOMING', abbreviation: 'WY' }
	];			
	
	for(var i=0;i<usStates.length;i++) { 
		if (val==usStates[i]['abbreviation']){
			ret = true;
		}
	}
	return ret;
}


function isLACounty(zip) { 
	var la_zipcodes_string = '90001, 90002, 90003, 90004, 90005, 90006, 90007, 90008, 90010, 90011, 90012, 90013, 90014, 90015, 90016, 90017, 90018, 90019, 90020, 90021, 90022, 90023, 90024, 90025, 90026, 90027, 90028, 90029, 90031, 90032, 90033, 90034, 90035, 90036, 90037, 90038, 90039, 90040, 90041, 90042, 90043, 90044, 90045, 90046, 90047, 90048, 90049, 90056, 90057, 90058, 90059, 90061, 90062, 90063, 90064, 90065, 90066, 90067, 90068, 90069, 90071, 90077, 90079, 90094, 90095, 90099, 90101, 90201, 90210, 90211, 90212, 90220, 90221, 90222, 90230, 90232, 90240, 90241, 90242, 90245, 90247, 90248, 90249, 90250, 90254, 90255, 90260, 90261, 90262, 90263, 90265, 90266, 90270, 90272, 90274, 90275, 90277, 90278, 90280, 90290, 90291, 90292, 90293, 90301, 90302, 90303, 90304, 90305, 90311, 90401, 90402, 90403, 90404, 90405, 90501, 90502, 90503, 90504, 90505, 90506, 90601, 90602, 90603, 90604, 90605, 90606, 90638, 90640, 90650, 90660, 90670, 90701, 90703, 90706, 90710, 90712, 90713, 90715, 90716, 90717, 90723, 90731, 90732, 90744, 90745, 90746, 90755, 90802, 90803, 90804, 90805, 90806, 90807, 90808, 90810, 90813, 90814, 90815, 90822, 90831, 90833, 90834, 90835, 91001, 91006, 91007, 91010, 91011, 91016, 91020, 91024, 91030, 91040, 91042, 91101, 91103, 91104, 91105, 91106, 91107, 91108, 91201, 91202, 91203, 91204, 91205, 91206, 91207, 91208, 91210, 91214, 91301, 91302, 91303, 91304, 91306, 91307, 91311, 91316, 91321, 91324, 91325, 91326, 91331, 91335, 91340, 91342, 91343, 91344, 91345, 91350, 91351, 91352, 91354, 91355, 91356, 91364, 91367, 91381, 91382, 91383, 91384, 91387, 91390, 91401, 91402, 91403, 91405, 91406, 91411, 91423, 91436, 91501, 91502, 91504, 91505, 91506, 91601, 91602, 91604, 91605, 91606, 91607, 91608, 91702, 91706, 91711, 91722, 91723, 91724, 91731, 91732, 91733, 91740, 91741, 91744, 91745, 91746, 91748, 91750, 91754, 91755, 91765, 91766, 91767, 91768, 91770, 91773, 91775, 91776, 91780, 91789, 91790, 91791, 91792, 91801, 91803, 91804, 93510, 93532, 93534, 93535, 93536, 93543, 93544, 93550, 93551, 93552, 93553, 93563, 93591';
	var zipcode = zip.toString();
	var zipcode_is_in_zipcodes = false;  // default
	if(0 === zipcode.length){
		zipcode_is_in_zipcodes = false;  // if empty ""
	} else {
		var zip_index = la_zipcodes_string.indexOf(zipcode);
		zipcode_is_in_zipcodes = (zip_index!=-1) ? true : false; // if found
	}
	return zipcode_is_in_zipcodes;		
}




//////////////////////////////////////////////////////////////////////////////
//////DATE TIME
//////////////////////////////////////////////////////////////////////////////

//add hours
Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}

function calcAge(birth_year,birth_month,birth_day) {//pass in y,d,m
	var today_date = new Date();
	var today_year = today_date.getFullYear();
	var today_month = today_date.getMonth();
	var today_day = today_date.getDate();
	var age = today_year - birth_year;
    if ( today_month < (birth_month - 1)) {
        age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
        age--;
    }
    trace(age);
	if (isNaN(age)) age=-1;
	return age;
}


function makeValidMonth(v) { 
	if (isNumeric(v)) { 
		v = parseFloat(v);
		if (v<= 0 || v>12) { 
			v= -1;
		} else { 
			v= addZeroIfSingle(v);
		}
	} else { 
		v=-1;
	}
	return v;
}
function makeValidDay(v) { 
	if (isNumeric(v)) { 
		v = parseFloat(v);
		if (v<= 0 || v>31) { 
			v = -1;
		} else { 
			v = addZeroIfSingle(v);
		}
	} else { 
		v=-1;
	}
	return v;
}
function makeValidYear(v) { 
	if (isNumeric(v)) { 
		v = parseFloat(v);
		if (v < 1900 || v > 2016) { 
			v = -1;
		} else { 
			v = addZeroIfSingle(v);
		}
	} else { 
		v=-1;
	}
	return v;
}

function getTimeZone(dt) {
    return /\((.*)\)/.exec(dt.toString())[1];
}

function scIsDateReached(yy, mm, dd, h, m, s,hours_timezone_adjust) { 
	if (yy===null) yy=1970;
	if (mm===null) mm=1;
	if (dd===null) dd=1;
	if (h===null) h=0;
	if (m===null) m=0;
	if (s===null) s=0;
	mm -=1; //month starts at 0
	
	var od = new Date(yy, mm, dd,h,m,s);
	var cd = new Date();
	
	if(hours_timezone_adjust==="undefined" || hours_timezone_adjust===undefined) { 
		hours_timezone_adjust="";	
	}
		
	if (hours_timezone_adjust !== "") { 
		var offset = cd.getTimezoneOffset();
		offset = -1 * (offset/60);  //negative is east of GMT, positive is west of GMT
		offset = offset-hours_timezone_adjust; //our adjust uses the regular with negative for west of GMT
		//alert(offset);
		//8 is LA, 7 without daylight savings
	
		od.addHours(offset);
	}
	
	//alert(od);
	trace("Current Date: " + cd);
	trace("Checkign for Date: " + od);
	if (cd >= od) {
		var ret = true;
	} else {
		var ret = false;
	}
	return ret;
}

//adds "dt-reached" class to elements that have "check-dt-reached" class
//<div class="check-dt-reached" dt="yy-mm-dd-h-m-s-tzj">
//selector default is check-dt-reached
function scAddIsDateReachedFlag(selector) { 
	$(selector).each(function(index) {
		$(this).removeClass('dt-reached');
		
		var dt = $(this).attr('dt');
		var dt_arr = dt.split("-");
		var yy = dt_arr[0];
		var mm = dt_arr[1];
		var dd = dt_arr[2];
		var h = dt_arr[3];
		var m = dt_arr[4];
		var s = dt_arr[5];
		var hours_timezone_adjust = dt_arr[6];
		if (scIsDateReached(yy, mm, dd, h, m, s,hours_timezone_adjust)) { 
			$(this).addClass('dt-reached');
		} 
	});
	
}
function scAddIsDateReachedFlagMostRecent(selector) { 
	var cont=true;
	$(selector).each(function(index) {
		if (cont) { 
			var dt = $(this).attr('dt');
			var dt_arr = dt.split("-");
			var yy = dt_arr[0];
			var mm = dt_arr[1];
			var dd = dt_arr[2];
			var h = dt_arr[3];
			var m = dt_arr[4];
			var s = dt_arr[5];
			var hours_timezone_adjust = dt_arr[6];
			if (scIsDateReached(yy, mm, dd, h, m, s,hours_timezone_adjust)) { 
				$(selector).removeClass('dt-reached');
				$(this).addClass('dt-reached');
			} else { 
				cont=false;	
			}
		}
		
	});
}


//////////////////////////////////////////////////////////////////////////////
//////SCROLL RELATED
//////////////////////////////////////////////////////////////////////////////
function isScrolledIntoView(elem,type) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
	
	var h =  $(elem).height();
	var wh = docViewBottom-docViewTop;
	
	var elemTop = $(elem).offset().top;
    var elemBottom = elemTop +h;
	
	
	//trace (elem+":"+h + ":::::"+docViewTop+":::"+docViewBottom+"::::"+wh+":::"+elemBottom);

	
	if (type=="above_top") { 
		var ret = (elemTop <= docViewTop-site.scrollto_offset);
	} else { 
		//onpage - nothing off
		//var ret = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		if (h > wh) { 
			var ret = (elemBottom <= docViewBottom+(wh/2));
		} else { 
			var ret = ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		}
	}
    return ret;
}


//SCROLLS TO TOP OF PAGE
//USE in SITE LOAD
//scOpenTopOfPage(true);
function scOpenTopOfPage(doonce) { 
	window.scrollTo(0, 1); 
	document.body.scrollTop = 1;
	window.scrollTo(0, 0); 
	document.body.scrollTop = 0;
	$('#container').scrollTop( 0);

	
	$(this).scrollTop(0);
	if (doonce) { 
		//$(window).on('beforeunload', function(){
			//scOpenTopOfPage(false);
		//});
		$(window).on('unload', function(){
			scOpenTopOfPage(false);
		});
		setTimeout(function(){ 
			scOpenTopOfPage(false);
		}, 30);
	}
}


//////////////////////////////////////////////////////////////////////////////
//////ANIMATION RELATED
//////////////////////////////////////////////////////////////////////////////

/** fixes flicker in jQuery show function */
var fxAttrs = [
  // height animations
  [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
  // width animations
  [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
  // opacity animations
  [ "opacity" ]
 ];

function genFx( type, num ){
 var obj = {};
 jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
  obj[ this ] = type;
 });
 return obj;
}

(function($){ 
    $.fn.extend({ 
 show: function(speed,callback){
  if ( speed ) {
   return this.animate(genFx("show", 3), speed, callback);
  } else {
   for ( var i = 0, l = this.length; i < l; i++ ){
    var old = jQuery.data(this[i], "olddisplay");

    this[i].style.display = old || "";

    if ( jQuery.css(this[i], "display") === "none" ) {
     jQuery.data(this[i], "olddisplay", 'block');
    }
   }

   // Set the display of the elements in a second loop
   // to avoid the constant reflow
   for ( var i = 0, l = this.length; i < l; i++ ){
    this[i].style.display = jQuery.data(this[i], "olddisplay") || "";
   }

   return this;
  }
 }
    }); 
})(jQuery);



//smoothscroll
/*
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	  var target = $(this.hash);
	  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	  if (target.length) {
		$('html, body').animate({
		  scrollTop: target.offset().top
		}, 1000);
		return false;
	  }
	}
  });
});
*/


//cssFilterTween
//onUpdate:cssFilterTween,onUpdateParams: ["{self}","grayscale", 100, 0]
function cssFilterTween(tl, filter, start, end){
	var units = ['px','deg','%'];
	var tlp = (tl.progress()*100) >> 0;
	switch (filter) {
		case "blur":
			//filter = "blur";
			if (start < end){
				var inc = start + Math.abs(start - end)/100 * tlp; 
			}else {
				var inc = start - Math.abs(start - end)/100 * tlp; 
			}
			TweenMax.set(tl.target,{'-webkit-filter':'blur('+ inc + units[0]+')', 'filter':'blur('+ inc + units[0]+')'});
			break;
		case "hue-rotate":
			//filter = "hue-rotate"
			var tlp = (tl.progress()*100) >> 0;
			if (start < end){
				var inc = start + Math.abs(start - end)/100 * tlp; 
			}else {
				var inc = start - Math.abs(start - end)/100 * tlp; 
			}
			TweenMax.set(tl.target,{'-webkit-filter':'hue-rotate('+ inc + units[1]+')', 'filter':'hue-rotate('+ inc +units[1]+')'});
			break;
		 default:
		 	//everything else is %
			var tlp = (tl.progress()*100) >> 0;
			if (start < end){
				var inc = start + Math.abs(start - end)/100 * tlp; 
			}else {
				var inc = start - Math.abs(start - end)/100 * tlp; 
			}
			TweenMax.set(tl.target,{'-webkit-filter':filter +'('+ inc + units[2]+')', 'filter':filter +'('+ inc +units[2]+')'});
			break;
			
	}
}


//////////////////////////////////////////////////////////////////////////////
//////JS FILE TYPE & SIZE
//////////////////////////////////////////////////////////////////////////////
function formatFileSize(bytes) {
	if (typeof bytes !== 'number') {
		return '';
	}
	if (bytes >= 1000000000) {
	    return (bytes / 1000000000).toFixed(2) + ' GB';
	}
	if (bytes >= 1000000) {
		return (bytes / 1000000).toFixed(2) + ' MB';
	}
	return (bytes / 1000).toFixed(2) + ' KB';
}
	
function scGetFileSize(fileid,type) { 
	//type = kb, mb, gb
	//returns KB
	var iSize = ($(fileid)[0].files[0].size / 1024);
	if (type==="gb") { 
		iSize = (Math.round(((iSize / 1024) / 1024) * 100) / 100);
	} else if (type==="mb") { 
		iSize = (Math.round((iSize / 1024) * 100) / 100);
	} else { 
		iSize = (Math.round(iSize * 100) / 100);
	}
	return iSize;
}
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'gif':
		case 'png':
		case 'bmp':
			return true;
			break;
		}
    return false;
}