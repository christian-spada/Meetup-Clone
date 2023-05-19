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

const validateEventQueryParams = (req, res, next) => {
	console.log(Op);
	let { page, size, name, type, startDate } = req.query;
	const errorResult = { message: 'Bad Request', errors: {} };

	page = parseInt(page);
	size = parseInt(size);

	if (page && page < 1 && page > 10) {
		errorResult.errors.page = 'Page must be greater than or equal to 1';
	}
	if (size && size < 1) {
		errorResult.errors.size = 'Size must be greater than or equal to 1';
	}
	if (typeof name !== 'string') {
		errorResult.errors.name = 'Name must be a string';
	}
	if (type !== 'Online' && type !== 'In person') {
		errorResult.errors.type = 'Type must be "Online" or "In Person"';
	}
	if (!startDate) {
		errorResult.errors.startDate = 'Start date must be a valid datetime';
	}

	if (Object.keys(errorResult.errors).length) {
		res.status(400);
		return res.json({ errorResult });
	}

	const pagination = {
		limit: size,
		offset: (page - 1) * size,
	};

	const where = {
		name,
		type,
		startDate,
	};

	req.pagination = pagination;
	req.where = where;

	next();
};

module.exports = { validateGroupCreation, validateGroupEdit, validateEventQueryParams };
