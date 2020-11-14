'use strict';

const controllers = require('./lib/controllers');

const plugin = {},
    meta = module.parent.require('./meta'),
	user = module.parent.require('./user'),
	nconf = module.parent.require('nconf');

	var accountSid = meta.config['twilio:sid'],
		authToken = meta.config['twilio:token'],
		verificactionSid = meta.config['twilio:verificactiondid'];

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	//const hostControllers = params.controllers;

	//TODO move to controller
	// router.get('/verify', hostMiddleware.buildHeader, controllers.renderConfirm);
	// router.get('/api/verify', controllers.renderConfirm);
	router.get('/verify', hostMiddleware.buildHeader, renderConfirm);
	router.post('/verify', hostMiddleware.buildHeader, checkCode);
	router.get('/api/verify', renderConfirm);

	router.get('/admin/twilio', hostMiddleware.admin.buildHeader, renderAdmin);
	router.get('/api/admin/twilio', renderAdmin);

	callback();
};


plugin.verifyUser = function(params, callback) {
	const twilio = require('twilio')(accountSid, authToken);
	const errors = { wasValidated: false };
	const channel = 'sms';
	let verificationRequest;

	user.getUserField(params.uid, 'phoneNumber', function async(err, phoneNumber) {
		try {
			console.log('Phone numer:' + req.user.phoneNumber + 'channel?' + channel);
			verificationRequest = await twilio.verify.services(verificactionSid)
			  .verifications
			  .create({ to: phoneNumber, channel });
		  } catch (e) {
			console.log(e);
			return res.status(500).send(e);
		  }
	});
};


function checkCode(req, res, next) {
	if (req.user && req.user.uid) {
		user.getUserField(req.user.uid, 'phoneNumber', function(err, phoneNumber) {
			console.log('post to API');
		});
	} else {
		res.redirect('/login');
	}
}

function renderConfirm(req, res, next) {
	if (req.user && req.user.uid) {
		user.getUserField(req.user.uid, 'phoneNumber', function(err, phoneNumber) {
			res.render('verify', {
				"phoneNumber": phoneNumber
			});
		});
	} else {
		res.redirect('/login');
	}
}

function renderAdmin(req, res, next) {
	res.render('admin/twilio', {});
}

plugin.addCaptcha = function(params, callback) {
	params.data.captcha = {
		label: 'Phone Number (for verification)',
		html: '<input class="form-control" type="text" placeholder="Phone Number" name="phoneNumber" id="phoneNumber" />'
	};

	callback(null, params);
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	callback(null, header);
};

myPlugin.filterUserCreate = function (hookData, callback) {
    hookData.user.phoneNumber = hookData.data.phoneNumber;
    callback(null, hookData);
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/twilio',
		icon: 'fa-mobile',
		name: 'Twilio Verification'
	});

	callback(null, header);
};

plugin.redirectToConfirm = function(params, callback) {
	params.referrer = nconf.get('relative_path') + '/verify';
	callback(null, params);
};

module.exports = plugin;