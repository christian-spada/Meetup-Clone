const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');
const { Op } = require('sequelize');

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

// === VALIDATE EVENT EDIT ===
const validateEventEdit = (req, res) => {
	const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

	const errorResult = { message: 'Bad Request', errors: {} };

	const startDateStr = new Date(startDate).toDateString();
	const endDateStr = new Date(endDate).toDateString();
	const startDateObj = new Date(startDateStr);
	const endDateObj = new Date(endDateStr);

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
	if (startDateObj.getTime() < Date.now()) {
		errorResult.errors.startDate = 'Start date must be in the future';
	}
	if (endDateObj.getTime() < startDateObj.getTime()) {
		errorResult.errors.endDate = 'End date is less than start date';
	}

	if (Object.keys(errorResult.errors).length) {
		res.status(400);
		return res.json(errorResult);
	}
};

module.exports = { validateGroupCreation, validateGroupEdit, validateEventEdit };
