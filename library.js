'use strict';

const controllers = require('./lib/controllers');

const plugin = {};

    var db = require.main.require('./src/database');
    var meta = require.main.require('./src/meta');
    var user = require.main.require('./src/user');
    var nconf = require.main.require('nconf');

	var accountSid = meta.config['twilio:sid'],
		authToken = meta.config['twilio:token'],
		twilioConfirmEmail = meta.config['twilio:confirmemail'],
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
	router.post('/api/updatephone', hostMiddleware.buildHeader, updatePhoneNumber);
	router.post('/api/verify/newcode', hostMiddleware.buildHeader, newCode);
	router.get('/api/verify', renderConfirm);

	router.get('/admin/twilio', hostMiddleware.admin.buildHeader, renderAdmin);
	router.get('/api/admin/twilio', renderAdmin);

	callback();
};

async function newCode(req, res, next) {
	const twilio = require('twilio')(accountSid, authToken);
	const errors = { wasValidated: false };
	const channel = 'sms';
	let verificationRequest;
    const userVerified = await user.getUserField(req.uid, 'phoneNumber:verified', req.body.phonenumber);
    if (userVerified) {
        return res.status(500).send('[[verify:phonenumber_already_verified]]');
    }
		try {
			const result = verificationRequest = await twilio.verify.services(verificactionSid)
			  .verifications
			  .create({ to: req.body.phoneNumber, channel });
            // TODO ACCEPT VOIP?
            //if (result.lookup.carrier.type === 'voip') {
            //    return res.status(500).send('[[verify:voip_not_accepted]]');
            //}
            return res.status(200).send('[[verify:verification_code_sent]]');
		  } catch (e) {
			console.log(e);
			return res.status(500).send('[[verify:something_wrong]]');
		  }
};


async function updatePhoneNumber(req, res, next) {
        const userData = await user.getUserFields(req.uid, ['phoneNumber', 'phoneNumber:verified']);
        const exists = await getUidByPhone(req.body.phonenumber);
        if (userData.phoneNumber === req.body.phonenumber) {
            return res.status(200).send('[[verify:same_number]]');
        }
        if (exists) {
            return res.status(500).send('[[verify:phonenumber-taken]]');
        }

        try {
            await user.setUserField(req.uid, 'phoneNumber', req.body.phonenumber);
            await user.setUserField(req.uid, 'phoneNumber:verified', false);
            await db.sortedSetAdd('phonenumbers:uid', req.uid, req.body.phonenumber);
            return res.status(200).send('[[verify:phone_changed]]');
        } catch {
	    return res.status(500).send('[[verify:something_wrong]]');
        }
}
async function getUidByPhone(phoneNumber) {
	if (!phoneNumber) {
		return 0;
	}
    return await db.sortedSetScore('phonenumbers:uid', phoneNumber);
}

function checkCode(req, res, next) {
    const twilio = require('twilio')(accountSid, authToken);
    const { verificationCode: code } = req.body;
    var verificationResult;
	if (req.user && req.user.uid) {
		user.getUserField(req.user.uid, 'phoneNumber', async function(err, phoneNumber) {
			//console.log('Checking code: ' + code + ' with phone: ' + phoneNumber);
            try {
              verificationResult = await twilio.verify.services(verificactionSid)
                .verificationChecks
                .create({ code, to: phoneNumber});
            } catch (e) {
                console.log(e);
                switch(e.status) {
                  case 404:
                        res.status(500).send('[[verify:time_expired]]');
                    break;
                  case 400:
                        res.status(500).send('[[verify:invalid_code]]');
                    break;
                  case 429:
                        res.status(500).send('[[verify:too_many_attempts]]');
                    break;
                  default:
                        res.status(500).send(e);
                }
            }


            if (verificationResult.status === 'approved') {
                await user.setUserField(req.uid, 'phoneNumber:verified', true);
                if (twilioConfirmEmail) {
                    await user.setUserField(req.uid, 'email:confirmed', 1);
                }
                res.status(200).send('[[verify:user_verified]]');
            } else {
                res.status(500).send('[[verify:invalid_code]]');
            }

		});

	}
}

async function renderConfirm(req, res, next) {
	if (req.user && req.user.uid) {
        const userData = await user.getUserFields(req.user.uid, ['phoneNumber', 'phoneNumber:verified']);
        //console.log(userData);
		res.render('verify', userData);
	} else {
		res.redirect('/login');
	}
}

function renderAdmin(req, res, next) {
	res.render('admin/twilio', {});
}

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	callback(null, header);
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
	params.referrer = '/verify';
	callback(null, params);
};

plugin.deleteUserPhone = async function(params, callback) {
    let userPhone = await user.getUserField(params.uid, 'phoneNumber');
    //console.log('lets delete UID phone number' + params.uid + ' ' + userPhone);
    await db.sortedSetRemove('phonenumbers:uid', userPhone);
}
plugin.whitelistField = function (hookData, callback) {
    hookData.whitelist.push('phoneNumber:verified');
    callback(null, hookData);
};

//TODO filter:account/edit.build
plugin.accountEdit = function(hookData, callback) {
   hookData.editButtons.push({
		link: '/verify',
		text: '[[verify:user_verification]]'
	});
  callback(null, hookData);
};

module.exports = plugin;
