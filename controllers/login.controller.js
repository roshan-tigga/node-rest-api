var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { check, validationResult} = require("express-validator/check");
const User = require('../models/user.model');

exports.login = function (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		});
	} 
	
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) return res.status(500).send({ status: 'Error', code: '500', message: 'Error on the server.' });
		if (!user) return res.status(404).send({ status: 'Error', code: '401', message: 'Your email id not match.' });
		
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ status: 'Error', code: '401', message: 'Your password not match.' });
		
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		}); 
		
		res.status(200).send({ status: 'Success', code: '200', token: token });
	});
	
};