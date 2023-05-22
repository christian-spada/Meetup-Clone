const express = require('express');
const router = express.Router();
const {
	Event,
	EventImage,
	Group,
	Membership,
	User,
	Venue,
	Attendance,
} = require('../../db/models');
const { requireAuth, requireAuthorizationResponse } = require('../../utils/auth');
const { entityNotFound } = require('../../utils/helpers');
const { validateEvent } = require('../../utils/custom-validators');
const { validateEventQueryParams } = require('../../utils/custom-validators');

// === GET ALL EVENTS ===
router.get('/', validateEventQueryParams, async (req, res) => {
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
		where: req.where,
		...req.pagination,
	});

	const eventsArr = [];
	for (const event of events) {
		const eventPojo = event.toJSON();
		const numAttending = await Attendance.count({
			where: {
				eventId: event.id,
				status: ['attending'],
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
		where: { eventId, status: ['attending'] },
	});

	eventPojo.numAttending = numAttending;
	res.json(eventPojo);
});

// === EDIT AN EVENT BY ID ===
router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
	const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
	const { id: currUserId } = req.user;
	const eventId = parseInt(req.params.eventId);

	const eventToEdit = await Event.findByPk(eventId, {
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
		include: [{ model: Group }, { model: Venue }],
	});

	if (!eventToEdit) {
		return entityNotFound(res, 'Event');
	}

	const group = eventToEdit.Group;
	const venue = eventToEdit.Venue;

	if (!venue) {
		return entityNotFound(res, 'Venue');
	}

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId: group.id,
			userId: currUserId,
		},
	});

	const hasValidRole = membershipStatus?.status === 'co-host' || group.organizerId === currUserId;

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	const updatedEvent = await eventToEdit.update({
		venueId: venueId ?? eventToEdit.venueId,
		name: name ?? eventToEdit.name,
		type: type ?? eventToEdit.type,
		capacity: capacity ?? eventToEdit.capacity,
		price: price ?? eventToEdit.price,
		description: description ?? eventToEdit.description,
		startDate: startDate ?? eventToEdit.startDate,
		endDate: endDate ?? eventToEdit.endDate,
	});

	const updatedEventPojo = updatedEvent.toJSON();
	updatedEventPojo.id = eventToEdit.id;
	updatedEventPojo.groupId = group.id;

	delete updatedEventPojo.Group;
	delete updatedEventPojo.Venue;
	delete updatedEventPojo.createdAt;
	delete updatedEventPojo.updatedAt;

	res.json(updatedEventPojo);
});

// === DELETE AN EVENT ===
router.delete('/:eventId', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const eventId = parseInt(req.params.eventId);

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

	const newEventImage = await EventImage.create({
		eventId,
		url,
		preview,
	});

	res.json({ id: newEventImage.id, url, preview });
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
	delete newAttendancePojo.eventId;
	delete newAttendancePojo.createdAt;
	delete newAttendancePojo.updatedAt;

	res.json(newAttendancePojo);
});

// === CHANGE STATUS OF ATTENDANCE ===
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const { userId, status } = req.body;
	const eventId = parseInt(req.params.eventId);

	const event = await Event.findByPk(eventId, {
		include: { model: Group },
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

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	if (status === 'pending') {
		res.status(400);
		return res.json({
			message: 'Cannot change an attendance status to pending',
		});
	}

	const attendance = await Attendance.findOne({
		where: {
			userId,
			eventId,
		},
	});

	if (!attendance) {
		res.status(404);
		return res.json({
			message: 'Attendance between the user and the event does not exist',
		});
	}

	const updatedAttendance = await attendance.update({
		userId,
		status,
	});

	const updatedAttendancePojo = updatedAttendance.toJSON();
	delete updatedAttendancePojo.updatedAt;

	res.json(updatedAttendancePojo);
});

// === DELETE ATTENDANCE TO EVENT ===
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const eventId = parseInt(req.params.eventId);
	const { userId: attendeeId } = req.body;

	const event = await Event.findByPk(eventId, {
		include: [{ model: Group }],
	});

	if (!event) {
		return entityNotFound(res, 'Event');
	}

	const group = event.Group;
	const attendance = await Attendance.findOne({
		where: {
			eventId,
			userId: attendeeId,
		},
	});

	if (!attendance) {
		res.status(404);
		return res.json({
			message: 'Attendance does not exist for this User',
		});
	}

	const hasValidRole = group.organizerId === currUserId || attendeeId === currUserId;

	if (!hasValidRole) {
		res.status(403);
		return res.json({
			message: 'Only the User or organizer may delete an Attendance',
		});
	}

	await attendance.destroy();
	res.json({
		message: 'Successfully deleted attendance from event',
	});
});

module.exports = router;
