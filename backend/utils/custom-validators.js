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

// === CREATE/EDIT AN EVENT VALIDATION ===
const validateEvent = (req, res, next) => {
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

	next();
};

const validateEventQueryParams = (req, res, next) => {
	let { page, size, name, type, startDate } = req.query;
	const errorResult = { message: 'Bad Request', errors: {} };

	page = parseInt(page);
	size = parseInt(size);

	const startDateObj = new Date(startDate);

	if (page && (page < 1 || page > 10)) {
		errorResult.errors.page = 'Page must be greater than or equal to 1';
	}
	if (size && (size < 1 || size > 20)) {
		errorResult.errors.size = 'Size must be greater than or equal to 1';
	}
	if (name && typeof name !== 'string') {
		errorResult.errors.name = 'Name must be a string';
	}
	if (type && type !== 'Online' && type !== 'In person') {
		errorResult.errors.type = 'Type must be "Online" or "In Person"';
	}
	if (startDate && Number.isNaN(startDateObj.getTime())) {
		errorResult.errors.startDate = 'Start date must be a valid datetime';
	}

	if (Object.keys(errorResult.errors).length) {
		res.status(400);
		return res.json({ errorResult });
	}

	if (!page) page = 1;
	if (!size) size = 20;

	const pagination = {
		limit: size,
		offset: (page - 1) * size,
	};

	const where = {};

	if (name) where.name = name;
	if (type) where.type = type;
	if (startDate) where.startDate = startDate;

	req.pagination = pagination;
	req.where = where;

	next();
};

module.exports = { validateGroupCreation, validateGroupEdit, validateEventQueryParams };
