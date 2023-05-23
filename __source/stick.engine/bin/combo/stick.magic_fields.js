/*
v 1.0

//init
site.stick_mf_login = new stick_magic_fields();
site.stick_mf_login.init('#section_login_login','#login_field_submit',site.doLoginEmail); //some outer holder, submit id, success callback

//html example
<div id="login_via_fields">
	<div class="stick_magic_field" stick_validate_type="email"  stick_validate_required="1"  stick_validate_other="" stick_validate_error_msg="Please enter a valid email"  >
		<label  for="login_email">Email Address</label>
		<input maxlength="100"  id="login_email" type="email" name="login_email" placeholder="Email Address" autocomplete="off" />
	</div>
	<div class="stick_magic_field" stick_validate_type="password"  stick_validate_required="1" stick_validate_other="notblank" stick_validate_error_msg="Please enter your password"   >								
		<label  for="login_password">Password</label>
		<input  maxlength="100" id="login_password" type="password" name="login_password" placeholder="Password" autocomplete="off" />
	</div>
	
	
	<div id="login_field_submit_outer">
		<div id="login_field_submit" class="green_button gray">
			<div class="div-table"><div class="div-tablecell">
				<span class="txt">LOGIN</span>
			</div></div>
		</div>
	</div>
	
</div>


*/
function stick_magic_fields( ) {
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	var t=this;
	
	this.id_field_container = "";
	this.id_field_grabber = "";
	this.id_errors_grabber = "";
	this.field_class = ".stick_magic_field";
	this.field_errors = ".stick_magic_field_errors";
	this.callback;
	
	this.clicked_submit_once = false;
	
	//debugger
	this.detailed_log = false;
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.init = function(id_field_grabber,id_submit,callback) { 
		var t=this;
		
		
		t.p.id_field_container = id_field_grabber;
		t.p.id_field_grabber = id_field_grabber + " " + t.p.field_class;
		t.p.id_errors_grabber = id_field_grabber + " " + t.p.field_errors;
		t.p.callback = callback;
		
		$(t.p.id_field_grabber).each(function(  ) {
			$('input',this).val('');//clear all
			$('input',this).focus(t.p.magicFocus);
			//$('input',this).bind('touchstart click', t.p.magicFocus);
			$('input',this).blur(t.p.magicBlur);
			$('input',this).keyup(t.p.magicKeyUp);
		});
		setTimeout(function() { 
			$(t.p.id_field_grabber).each(function(  ) {
				t.p.magicLabelActiveCheck( $('input',this)  );
			});
		},1000);
		
		$(t.p.id_field_grabber).each(function(  ) {
			$('.checkbox_box',this).removeClass('active');
			$('.checkbox_box',this).click(t.p.magicCheckboxToggle);
		});
			
		
		$(id_submit).click(t.p.magicSubmit);
		
	};
	
	
	////////////////////////////////////////////////////////////////////////
	//FOCUS AND BLUR EVENTS
	////////////////////////////////////////////////////////////////////////
	this.magicCheckboxToggle = function() {
		if ($(this).hasClass('active')) { 
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}
		if (t.p.clicked_submit_once===true) { 
			t.p.magicValidate();
		}
		
	};
	this.magicFocus = function() {
		$(this).parent().addClass('labelactive');
		t.p.magicLabelActiveCheck(this);
		if (t.p.clicked_submit_once===true) { 
			t.p.magicValidate();
		}
	};
	this.magicBlur = function() {
		t.p.magicLabelActiveCheck(this);
		if (t.p.clicked_submit_once===true) { 
			t.p.magicValidate();
		}
	};
	this.magicKeyUp = function() {
		t.p.magicLabelActiveCheck(this);
		if (t.p.clicked_submit_once===true) { 
			t.p.magicValidate();
		}
	};
	this.magicLabelActiveCheck= function(tt) {
		var val = $(tt).val();
		if (t.p.detailed_log) trace("field blur:" + val);
		if (val==="") { 
			$(tt).parent().removeClass('labelactive');
		} else { 
			$(tt).parent().addClass('labelactive');
		}
		if ($(tt).is(':focus')) { 
			$(tt).parent().addClass('labelactive');
		}
		
		
	}
	
	
	
	////////////////////////////////////////////////////////////////////////
	//SUBMIT
	////////////////////////////////////////////////////////////////////////
	this.magicSubmit = function() { 
		"use strict";
		t.p.clicked_submit_once=true;
		var cont = t.p.magicValidate();
		if (cont) { 
			t.p.callback();
		}
	};
	
	this.magicValidate = function() {
		t.p.magicValidateClearAllFieldErrors();
		if (t.p.detailed_log) trace("magicValidate id_field_grabber:" + t.p.id_field_grabber);
		var cont = true;
		$(t.p.id_field_grabber).each(function(  ) {
			var valid = true;
			var stick_validate_type = $(this).attr('stick_validate_type');
			var stick_validate_required = $(this).attr('stick_validate_required');
			var stick_validate_other = $(this).attr('stick_validate_other');
			var stick_validate_error_msg = $(this).attr('stick_validate_error_msg');
			
			if (t.p.detailed_log) trace("####################");
			if (t.p.detailed_log) trace("stick_validate_type:"+stick_validate_type);
			if (t.p.detailed_log) trace("stick_validate_required:"+stick_validate_required);
			if (t.p.detailed_log) trace("stick_validate_other:"+stick_validate_other);
			switch (stick_validate_type) { 
				case "email":
					var val = $('input',this).val();
					if (t.p.detailed_log) trace("email val"+val);
					if (stick_validate_required==="1") { 
						if (val ==="" || t.p.isValidEmail(val) ===false) { 
							valid=false;
						} 
					} else { 
						if (val !=="" && t.p.isValidEmail(val) ===false) { 
							valid=false;
						} 
					} 
					break;
				case "text":
					var val = $('input',this).val();
					if (t.p.detailed_log) trace("text val"+val);
					if (stick_validate_required==="1") { 
						if (val ==="") { 
							valid=false;
						} 
					} 
					break;
				case "password": //options: notblank, strong
					var val = $('input',this).val();
					if (t.p.detailed_log) trace("password val"+val);
					if (stick_validate_required==="1") { 
						if (stick_validate_other==="notblank" && val ==="" ) { 
							valid=false;
						} else if (stick_validate_other==="strong" && t.p.isStrongPassword(val) ===false ) { 
							valid=false;
						} else if (stick_validate_other==="length"  ) { 
							if (val.length < 8) { 
								valid = false;
							} 
						}  else if (stick_validate_other==="match" || val==="" ) { 
							var val2 = $('#signup_password').val();
							if (val !== val2 || val==="" || val2==="") { 
								valid=false;
							}
						}
					}
					break;
				case "checkbox":
					var is_checked = $('.checkbox_box',this).hasClass('active');
					if (t.p.detailed_log) trace("checkbox val"+is_checked);
					if (stick_validate_required==="1") { 
						if (is_checked===false) { 
							valid=false;
						} 
					} 
					break;
			
			}
			if (t.p.detailed_log) trace("is valid?"+valid);
			if (valid===false) { 
				cont=false;
				$(this).addClass('error');
				if (stick_validate_error_msg!="") { 
					//$(t.p.id_errors_grabber).append("<br>"+stick_validate_error_msg);
					$('.stick_magic_field_error_display',this).html(stick_validate_error_msg);
					$('.stick_magic_field_error_display',this).show();
				} else { 
					$('.stick_magic_field_error_display',this).hide();
				}
			}
		});
		
		$(t.p.id_field_grabber).each(function(  ) {
			t.p.magicLabelActiveCheck( $('input',this)  );
		});
		return cont;
	};
	this.magicValidateClearAllFieldErrors = function() { 
		"use strict";
		var t=this;
		$(t.p.id_field_grabber + " .stick_magic_field_error_display").html('');
		$(t.p.id_field_grabber + " .stick_magic_field_error_display").hide();
		$(t.p.id_field_grabber).removeClass("error");
		$(t.p.id_errors_grabber).html('');
		$(t.p.id_field_grabber).each(function(  ) {
			t.p.magicLabelActiveCheck( $('input',this)  );
		});
		
		
	};
	
	
	////////////////////////////////////////////////////////////////////////
	//VALIDATORS
	////////////////////////////////////////////////////////////////////////
	this.isValidPhone = function(p) {
		"use strict";
		var phoneRe =  /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
		var digits = p.replace(/\D/g, "");
		return (digits.match(phoneRe) !== null);
	};

	this.isNumeric = function(val) {
		"use strict";
		if (isNaN(parseFloat(val))) {
			return false;
		} else { 
			return true;
		}
	};

	this.isValidEmail = function(val) { 
		"use strict";
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test(val) === false) {	
			return false;
		} else { 
			return true;
		}
	};

	this.isValidUSZip = function(sZip) {
		"use strict";
		return /^\d{5}(-\d{4})?$/.test(sZip);
	};
	
	this.isStrongPassword = function(val) { 
		"use strict";
		var cont = true;
		if (val.length < 6) { 
			cont = false;
		} 
		if ( ( val.match(/[a-z]/) ) && ( val.match(/[A-Z]/) ) )  { 
			//upper and lower
		} else { 
			cont = false;
		}
		if (val.match(/\d+/)) { 
			//at least one number
		} else { 
			cont = false;
		}
		
		return cont;
	};


}