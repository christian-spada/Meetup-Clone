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

// === DELETE AN EVENT ===
router.delete('/:eventId', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	let { eventId } = req.params;
	eventId = parseInt(eventId);

	const eventToDelete = await Event.findByPk(eventId, {
		include: [{ model: Group }],
	});

	if (!eventToDelete) {
		return entityNotFound(res, 'Event');
	}

	const group = eventToDelete.Group;
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

	await eventToDelete.destroy();

	res.json({
		message: 'Successfully deleted',
	});
});

// === ATTENDEES ===

// === GET ALL ATTENDEES BY EVENT ID ===
router.get('/:eventId/attendees', async (req, res) => {
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

	const hasValidRole = group.organizerId === currUserId || membershipStatus?.status === 'co-host';

	const result = {};

	if (hasValidRole) {
		const allAttendees = await Attendance.findAll({
			where: {
				eventId,
			},
		});

		const attendeesArr = [];
		for (const attendee of allAttendees) {
			const user = await User.findByPk(attendee.userId);
			const attendeePojo = attendee.toJSON();

			const newAttendeeObj = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				Attendance: {
					status: attendeePojo.status,
				},
			};

			attendeesArr.push(newAttendeeObj);
		}

		result.Attendees = attendeesArr;
	} else {
		const someAttendees = await Attendance.findAll({
			where: {
				eventId,
				status: ['attending', 'waitlist'],
			},
		});

		const attendeesArr = [];

		for (const attendee of someAttendees) {
			const user = await User.findByPk(attendee.userId);
			const attendeePojo = attendee.toJSON();
			const newAttendeeObj = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				Attendance: {
					status: attendeePojo.status,
				},
			};

			attendeesArr.push(newAttendeeObj);
		}

		result.Attendees = attendeesArr;
	}

	res.json(result);
});

// === REQUEST TO ATTEND EVENT BY EVENT ID ===
router.post('/:eventId/attendance', requireAuth, async (req, res) => {
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

	const hasValidRole = group.organizerId === currUserId || membershipStatus?.status !== 'pending';

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	const attendanceStatus = await Attendance.findOne({
		attributes: ['status'],
		where: {
			eventId,
			userId: currUserId,
		},
	});

	if (attendanceStatus?.status === 'pending') {
		res.status(400);
		return res.json({
			message: 'Attendance has already been requested',
		});
	}

	if (attendanceStatus?.status === 'attending' || attendanceStatus?.status === 'waitlist') {
		res.status(400);
		return res.json({
			message: 'User is already an attendee of the event',
		});
	}

	const newAttendance = await Attendance.create({
		eventId,
		userId: currUserId,
		status: 'pending',
	});

	const newAttendancePojo = newAttendance.toJSON();
	delete newAttendancePojo.id;
	delete newAttendancePojo.createdAt;
	delete newAttendancePojo.updatedAt;

	res.json(newAttendancePojo);
});

module.exports = router;
