const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');

// === CREATE A GROUP ===
const validateGroupCreation = [
	check('name').isLength({ min: 1, max: 60 }).withMessage('Name must be 60 characters or less'),
	check('about').isLength({ min: 50 }).withMessage('About must be 50 characters or more'),
	check('type').isIn(['Online', 'In person']).withMessage("Type must be 'Online' or 'In person'"),
	check('private').isBoolean().withMessage('Private must be a boolean'),
	check('city').exists({ checkFalsy: true }).withMessage('City is required'),
	check('state').exists({ checkFalsy: true }).withMessage('State is required'),
	handleValidationErrors,
];

// === EDIT A GROUP ===
const validateGroupEdit = [
	check('name').isLength({ min: 1, max: 60 }).withMessage('Name must be 60 characters or less'),
	check('about').isLength({ min: 50 }).withMessage('About must be 50 characters or more'),
	check('type').isIn(['Online', 'In person']).withMessage("Type must be 'Online' or 'In person'"),
	check('private').isBoolean().withMessage('Private must be a boolean'),
	check('city').exists({ checkFalsy: true }).withMessage('City is required'),
	check('state').exists({ checkFalsy: true }).withMessage('State is required'),
	handleValidationErrors,
];

// === VALIDATE VENUE CREATION ===
const validateVenueCreation = (req, res, next) => {
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

	return errorsResult;
};

module.exports = { validateGroupCreation, validateGroupEdit, validateVenueCreation };
