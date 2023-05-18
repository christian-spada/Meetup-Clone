const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		const errors = {};
		validationErrors.array().forEach(error => (errors[error.path] = error.msg));

		const err = Error('Bad request.');
		err.errors = errors;
		err.status = 400;
		err.title = 'Bad request.';
		next(err);
	}
	next();
};

// === VALIDATE ROLE HELPER: WORK IN PROGRESS ===
const validateRole = async (req, entityId, entityType) => {
	const { id: currUserId } = req.user;
	if (entityType === 'Event') {
		const event = await Event.findByPk(entityId, {
			include: { model: Group },
		});
		const group = event.Group;
		const membershipStatus = await Membership.findOne({
			attributes: ['status'],
			userId: currUserId,
			groupId: group.id,
		});
	}
};

module.exports = {
	handleValidationErrors,
	validateRole,
};
