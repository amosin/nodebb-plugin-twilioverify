'use strict';

/* globals document, $ */

const registrationReferrer = location.protocol + '//' + location.host + config.relative_path + '/register/complete?registered=true'
const appRoot = location.protocol + '//' + location.host + config.relative_path

$(document).ready(function () {
    if (window.location.pathname === config.relative_path + '/verify') {
        if (ajaxify.data.phoneNumber.verified) {
            $('#verifyCodeBlock').hide();
        }
    }
});


$('#verify-form').on('submit', (e) => {
    e.preventDefault()
        $.ajax(config.relative_path + '/verify', {
            data: {
			    uid: $('#inputUID').val(),
			    phoneNumber: iti.getNumber(),
			    verificationCode:  $('#code').val()
            },
                type: 'POST',
                headers: {
                    'x-csrf-token': config.csrf_token,
                },
                success: function (data) {
                    console.log(data);
                    app.alertSuccess('verified!');
                    return location.href = appRoot;
                },
                error: function (xhr, status, errorThrown) {
                    return app.alertError(xhr.responseText);
                },
            });
		return false;

});

$('#submitBtn').on('click', updatePhoneNumber);


	function updatePhoneNumber() {
        if (ajaxify.data.phoneNumber === iti.getNumber()) {
            $('#verifyCodeBlock').show();
            return app.alertSuccess('[[verify:same_number]]');
        }
        $.ajax(config.relative_path + '/api/updatephone', {
            data: {
			    uid: $('#inputUID').val(),
			    phonenumber: iti.getNumber()
            },
                type: 'POST',
                headers: {
                    'x-csrf-token': config.csrf_token,
                },
                success: function (data) {
                    $('#verifyCodeBlock').show();
                    // SEND CODE
                    //sendNewCode($('#inputUID').val(), iti.getNumber());
                    app.alertSuccess('[[verify:phone_changed]]');
                    //location.reload();
                },
                error: function (xhr, status, errorThrown) {
				    return app.alertError(xhr.responseText);
                },
            });
		return false;
	}

function sendNewCode(uid,phoneNumber) {
    console.log('New code to ' + uid + phoneNumber);
        $.ajax(config.relative_path + '/api/verify/newcode', {
            data: {
			    uid: uid,
			    phoneNumber: phoneNumber
            },
                type: 'POST',
                headers: {
                    'x-csrf-token': config.csrf_token,
                },
                success: function (data) {
                    $('#sentVerificationCode').show();
                    return app.alertSuccess('New code sent');
                },
                error: function (xhr, status, errorThrown) {
                    return app.alertError(xhr.responseText);
                },
            });
		return false;
}
