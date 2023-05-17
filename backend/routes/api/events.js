const express = require('express');
const router = express.Router();
const {
	Event,
	EventImage,
	Group,
	Membership,
	GroupImage,
	User,
	Venue,
	Attendance,
} = require('../../db/models');
const { requireAuth, requireAuthorizationResponse } = require('../../utils/auth');
const { entityNotFound } = require('../../utils/helpers');

// === GET ALL EVENTS ===
router.get('/', async (req, res) => {
	const events = await Event.findAll({
		include: [
			{
				model: Group,
				attributes: ['id', 'name', 'city', 'state'],
			},
			{
				model: Venue,
				attributes: ['id', 'city', 'state'],
			},
			{
				model: EventImage,
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			},
		],
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	});

	const eventsArr = [];
	for (const event of events) {
		const eventPojo = event.toJSON();
		const numAttendees = await Attendance.count({
			where: {
				eventId: event.id,
			},
		});

		eventPojo.numAttendees = numAttendees;
		for (const image of eventPojo.EventImages) {
			if (image.preview === true) {
				eventPojo.previewImage = image.url;
			}
		}

		delete eventPojo.EventImages;

		eventsArr.push(eventPojo);
	}

	res.json({ Events: eventsArr });
});

module.exports = router;
