const express = require('express');
const router = express.Router();
const {
	Group,
	Membership,
	GroupImage,
	User,
	Venue,
	EventImage,
	Event,
	Attendance,
} = require('../../db/models');
const { requireAuth, requireAuthorizationResponse } = require('../../utils/auth');
const { entityNotFound } = require('../../utils/helpers');
const { validateGroupCreation, validateGroupEdit } = require('../../utils/custom-validators');

// === DELETE AN EVENT IMAGE ===
router.delete('/:imageId', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const imageId = parseInt(req.params.imageId);

	const imageToDelete = await EventImage.findByPk(imageId);

	if (!imageToDelete) {
		return entityNotFound(res, 'Event Image');
	}

	const event = await Event.findByPk(imageToDelete.eventId, {
		include: [{ model: Group }],
	});

	const group = event.Group;

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId: group.id,
			userId: currUserId,
		},
	});

	const hasValidRole = group.organizerId === currUserId || membershipStatus?.status === 'co-host';

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	await imageToDelete.destroy();
	res.json({
		message: 'Successfully deleted',
	});
});

module.exports = router;
