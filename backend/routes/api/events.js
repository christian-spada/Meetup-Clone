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
			exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt'],
		},
	});

	const eventsArr = [];
	for (const event of events) {
		const eventPojo = event.toJSON();
		const numAttending = await Attendance.count({
			where: {
				eventId: event.id,
				status: ['attending', 'waitlist'],
			},
		});

		eventPojo.numAttending = numAttending;
		eventPojo.previewImage = null;
		if (!eventPojo.Venue) {
			eventPojo.Venue = null;
		}
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

// === GET EVENT DETAILS BY ID ===
router.get('/:eventId', async (req, res) => {
	const { eventId } = req.params;

	const event = await Event.findByPk(eventId, {
		include: [
			{ model: EventImage, attributes: { exclude: ['eventId', 'createdAt', 'updatedAt'] } },
			{
				model: Group,
				attributes: { exclude: ['organizerId', 'about', 'createdAt', 'updatedAt', 'type'] },
			},
			{ model: Venue, attributes: { exclude: ['createdAt', 'updatedAt', 'groupId'] } },
		],
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	});

	if (!event) {
		return entityNotFound(res, 'Event');
	}

	const eventPojo = event.toJSON();

	const numAttending = await Attendance.count({
		where: { eventId, status: ['waitlist', 'attending'] },
	});

	eventPojo.numAttending = numAttending;
	res.json(eventPojo);
});

// === ADD IMAGE TO EVENT BY ID ===
router.post('/:eventId/images', requireAuth, async (req, res) => {
	const { url, preview } = req.body;
	const { id: currUserId } = req.user;
	const eventId = parseInt(req.params.eventId);

	const event = await Event.findByPk(eventId, {
		include: [{ model: Group }],
	});

	if (!event) {
		return entityNotFound(res, 'Event');
	}

	const group = event.Group;

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId: group.id,
			userId: currUserId,
		},
	});

	const attendanceStatus = await Attendance.findOne({
		attributes: ['status'],
		where: {
			eventId,
			userId: currUserId,
		},
	});

	const validStatuses = ['host', 'co-host', 'waitlist', 'attending'];
	const hasValidRole =
		validStatuses.includes(membershipStatus?.status) ||
		validStatuses.includes(attendanceStatus?.status);

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	res.json({ url, preview });
});

module.exports = router;
