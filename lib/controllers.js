'use strict';

var Controllers = {};

Controllers.renderConfirm = function (req, res/* , next */) {
	if (req.user && req.user.uid) {
		user.getUserField(req.user.uid, 'mobileNumber', function(err, mobileNumber) {
			res.render('verify', {
				"mobileNumber": mobileNumber
			});
		});
	} else {
	res.render('/login', {});
	}
};

module.exports = Controllers;
