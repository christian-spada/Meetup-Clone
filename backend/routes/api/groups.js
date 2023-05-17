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

// === GET ALL GROUPS ===
router.get('/', async (req, res) => {
	const groups = await Group.findAll({
		include: {
			model: GroupImage,
			where: {
				preview: true,
			},
			attributes: ['url'],
			required: false,
		},
	});

	const groupArr = [];
	for (const group of groups) {
		const groupPojo = group.toJSON();
		const numMembers = await Membership.count({
			where: {
				groupId: group.id,
				status: ['host', 'co-host', 'member'],
			},
		});

		groupPojo.numMembers = 1;
		groupPojo.numMembers += numMembers;
		groupPojo.previewImage = null;

		for (const image of groupPojo.GroupImages) {
			groupPojo.previewImage = image.url;
		}

		delete groupPojo.GroupImages;

		groupArr.push(groupPojo);
	}

	res.json({ Groups: groupArr });
});

// === GET ALL GROUPS JOINED OR ORGANIZED BY CURRENT USER ===
router.get('/current', async (req, res) => {
	const groups = await Group.findAll({
		include: {
			model: GroupImage,
			where: {
				preview: true,
			},
			attributes: ['url'],
			required: false,
		},
		where: {
			organizerId: req.user.id,
		},
	});

	const groupArr = [];
	for (const group of groups) {
		const groupPojo = group.toJSON();
		const numMembers = await Membership.count({
			where: {
				groupId: group.id,
				status: ['host', 'co-host', 'member'],
			},
		});

		groupPojo.previewImage = null;
		groupPojo.numMembers = 1;
		groupPojo.numMembers += numMembers;

		for (const image of groupPojo.GroupImages) {
			groupPojo.previewImage = image.url;
		}

		delete groupPojo.GroupImages;

		groupArr.push(groupPojo);
	}

	res.json({ Groups: groupArr });
});

// === GET GROUP DETAILS BY ID ===
router.get('/:groupId', async (req, res) => {
	const { groupId } = req.params;

	const group = await Group.findByPk(groupId, {
		include: [
			{ model: GroupImage, attributes: { exclude: ['groupId', 'createdAt', 'updatedAt'] } },
			{
				model: User,
				as: 'Organizer',
				attributes: { exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt', 'username'] },
			},
			{ model: Venue, attributes: { exclude: ['createdAt', 'updatedAt'] } },
		],
	});

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	const groupPojo = group.toJSON();

	const numMembers = await Membership.count({
		where: { groupId, status: ['host', 'co-host', 'member'] },
	});

	groupPojo.numMembers = 1;
	groupPojo.numMembers += numMembers;
	res.json(groupPojo);
});

// === CREATE A GROUP ===
router.post('/', requireAuth, validateGroupCreation, async (req, res) => {
	const { name, about, type, private, city, state } = req.body;

	const newGroup = await Group.create({
		organizerId: req.user.id,
		name,
		about,
		type,
		private,
		city,
		state,
	});

	res.status(201);
	res.json(newGroup);
});

// === ADD IMAGE FOR GROUP ID ===
router.post('/:groupId/images', requireAuth, async (req, res) => {
	const { url, preview } = req.body;
	let { groupId } = req.params;
	groupId = parseInt(groupId);
	const { id: currUserId } = req.user;

	const group = await Group.findByPk(groupId);

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	if (group.organizerId !== currUserId) {
		return requireAuthorizationResponse(res);
	}

	if (group.organizerId === currUserId) {
		const newGroupImage = await GroupImage.create({
			url,
			preview,
		});

		const groupImgPojo = newGroupImage.toJSON();
		delete groupImgPojo.createdAt;
		delete groupImgPojo.updatedAt;

		return res.json(groupImgPojo);
	}
});

// === EDIT A GROUP ===
router.put('/:groupId', requireAuth, validateGroupEdit, async (req, res) => {
	let { groupId } = req.params;
	const { id: currUserId } = req.user;
	const { name, about, type, private, city, state } = req.body;
	groupId = parseInt(groupId);

	const groupToEdit = await Group.findByPk(groupId);

	if (!groupToEdit) {
		return entityNotFound(res, 'Group');
	}

	if (groupToEdit.organizerId !== currUserId) {
		return requireAuthorizationResponse(res);
	}

	const updatedGroup = await groupToEdit.update({
		name: name ?? groupToEdit.name,
		about: about ?? groupToEdit.about,
		type: type ?? groupToEdit.type,
		private: private ?? groupToEdit.private,
		city: city ?? groupToEdit.city,
		state: state ?? groupToEdit.state,
	});

	updatedGroup.organizerId = currUserId;

	return res.json(updatedGroup);
});

// === DELETE A GROUP ===
router.delete('/:groupId', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	let { groupId } = req.params;
	groupId = parseInt(groupId);

	const groupToDelete = await Group.findByPk(groupId);

	if (!groupToDelete) {
		return entityNotFound(res, 'Group');
	}

	if (groupToDelete.organizerId !== currUserId) {
		return requireAuthorizationResponse(res);
	}

	await groupToDelete.destroy();

	res.json({
		message: 'Successfully deleted',
	});
});

// === EVENTS ===

// === GET ALL EVENTS BY ID ===
router.get('/:groupId/events', async (req, res) => {
	let { groupId } = req.params;
	groupId = parseInt(groupId);

	const events = await Event.findAll({
		where: {
			groupId,
		},
		attributes: {
			exclude: ['description', 'price', 'capacity', 'createdAt', 'updatedAt'],
		},
		include: [
			{ model: Group, attributes: ['id', 'name', 'city', 'state'] },
			{ model: Venue, attributes: ['id', 'city', 'state'] },
			{ model: EventImage },
		],
	});

	if (!events.length) {
		return entityNotFound(res, 'Group');
	}

	const eventsArr = [];
	for (const event of events) {
		const eventPojo = event.toJSON();
		const numAttending = await Attendance.count({
			where: {
				eventId: event.id,
			},
		});

		eventPojo.numAttending = numAttending;
		eventPojo.previewImage = null;

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
