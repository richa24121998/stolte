$(document).ready(function() {

    if ($('body').hasClass('page_contact-us')) {
        $('#contact-form #phone').mask("000-000-0000", {placeholder: "###-###-####"});
        $('#contact-form input').keyup(kuValidateContact );
        $('#contact-form textarea').keyup(kuValidateContact );
    }

    if (md.mobile()===null) {
        $('body').addClass('device_desktop');
    } else {
        $('body').addClass('device_mobile');
    }

    document.addEventListener('touchmove', function(e) {
        if ($('body').hasClass('page_funding') && $('body').hasClass('device_mobile')) {
            scrollFunding();
        }
    }, false);

    //nested list filter
    $( "ul" ).has( "ul" ).addClass( "multilevel" );



    });

function scrollFunding() {
    //window.location.hash="#p";
}


var do_contact_keyup=false
function kuValidateContact() {
    if (do_contact_keyup) {
        validateContact();
    }
}
function validateContact() {
    var cont = true;

    var val;

    //name
    var val = $('#contact-form #fromName').val();
    if (val === '') {
        cont=false;
        $('#contact-form #fromName').addClass('error');
    } else {
        $('#contact-form #fromName').removeClass('error');
    }

    //email
    var val = $('#contact-form #fromEmail').val();
    if (val === '' || isValidEmail(val)===false) {
        cont=false;
        $('#contact-form #fromEmail').addClass('error');
    } else {
        $('#contact-form #fromEmail').removeClass('error');
    }

    //phone
    var val = $('#contact-form #phone').val();
    if (val.length != 12 || isValidPhone(val)===false) {
        cont=false;
        $('#contact-form #phone').addClass('error');
    } else {
        $('#contact-form #phone').removeClass('error');
    }

    //message
    var val = $('#contact-form #message').val();
    if (val === '') {
        cont=false;
        $('#contact-form #message').addClass('error');
    } else {
        $('#contact-form #message').removeClass('error');
    }

    do_contact_keyup=true;

    return cont;
}
