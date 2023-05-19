const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');
const { Op } = require('sequelize');

// === CREATE/EDIT A GROUP VALIDATION ===
const validateGroup = (req, res, next) => {
	const { name, about, type, private, city, state } = req.body;

	const errorResult = { message: 'Bad Request', errors: {} };

	if (name.length > 60) {
		errorResult.errors.name = 'Name must be 60 characters or less';
	}
	if (about.length < 50) {
		errorResult.errors.about = 'About must be 50 characters or more';
	}
	if (type !== 'Online' && type !== 'In person') {
		errorResult.errors.type = 'Type must be "Online" or "In person"';
	}
	if (typeof private !== 'boolean') {
		errorResult.errors.private = 'Private must be a boolean';
	}
	if (!city) {
		errorResult.errors.city = 'City is required';
	}
	if (!state) {
		errorResult.errors.state = 'State is required';
	}

	if (Object.keys(errorResult.errors).length) {
		res.status(400);
		return res.json(errorResult);
	}

	next();
};

// === CREATE/EDIT A VENUE VALIDATION ===
const validateVenue = (req, res, next) => {
	const { address, city, state, lat, lng } = req.body;
	const errorsResult = { message: 'Bad Request', errors: {} };

	if (!address) {
		errorsResult.errors.address = 'Street address is required';
	}
	if (!city) {
		errorsResult.errors.city = 'City is required';
	}
	if (!state) {
		errorsResult.errors.state = 'State is required';
	}
	if (typeof lat !== 'number') {
		errorsResult.errors.lat = 'Latitude is not valid';
	}
	if (typeof lng !== 'number') {
		errorsResult.errors.lng = 'Longitude is not valid';
	}

	if (Object.keys(errorsResult.errors).length) {
		res.status(404);
		return res.json(errorsResult);
	}

	next();
};

module.exports = {
	validateGroup,
	validateVenue,
};
