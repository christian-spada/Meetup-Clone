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
const validateEventBody = ({
	venueId,
	name,
	type,
	capacity,
	price,
	description,
	startDate,
	endDate,
}) => {
	const errorObj = { errors: {}, message: 'Bad Request' };

	if (venueId === null) {
		errorObj.errors.venueId = 'Venue does not exist';
	}
	if (name.length < 5) {
		errorObj.errors.name = 'Name must be at least 5 characters';
	}
	if (type !== 'Online' || type !== 'In person') {
		errorObj.errors.type = 'Type must be Online or In person';
	}
	if (typeof capacity !== 'number') {
		errorObj.errors.capacity = 'Capacity must be an integer';
	}
	if (typeof price !== 'number') {
		errorObj.errors.price = 'Price is invalid';
	}
	if (!description) {
		errorObj.errors.description = 'Description is required';
	}
	// how do I know if a dates in the future
	// if (startDate )
};

const validateEventCreation = [handleValidationErrors];

module.exports = { validateGroupCreation, validateGroupEdit };
