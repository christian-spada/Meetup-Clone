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

// === CREATE AN EVENT BY GROUP ID ===
const validateEventCreation = (req, res, next) => {
	const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
	const errorResult = { message: 'Bad Request', errors: {} };

	if (!venueId) {
		errorResult.errors.venueId = 'Venue does not exist';
	}
	if (name.length < 5) {
		errorResult.errors.name = 'Name must be at least 5 characters';
	}
	if (type !== 'Online' && type !== 'In person') {
		errorResult.errors.type = 'Type must be Online or In person';
	}
	if (typeof capacity !== 'number') {
		errorResult.errors.capacity = 'Capacity must be an integer';
	}
	if (typeof price !== 'number') {
		errorResult.errors.price = 'Price is invalid';
	}
	if (!description) {
		errorResult.errors.description = 'Description is required';
	}
	if (!startDate) {
		errorResult.errors.startDate = 'Start date must be in the future';
	}
	if (!endDate) {
		errorResult.errors.endDate = 'End date must less than start date';
	}

	if (Object.keys(errorResult.errors).length) {
		res.status(400);
		return res.json(errorResult);
	}

	next();
};

module.exports = { validateGroupCreation, validateGroupEdit, validateEventCreation };
