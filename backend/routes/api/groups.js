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
const {
	validateGroupCreation,
	validateGroupEdit,
	validateVenueCreation,
} = require('../../utils/custom-validators');

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

		groupPojo.numMembers = numMembers;
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
router.get('/current', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;

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
			organizerId: currUserId,
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
		groupPojo.numMembers = numMembers;

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

	const newMembership = await Membership.create({
		userId: req.user.id,
		groupId: newGroup.id,
		status: 'host',
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
			groupId,
			url,
			preview,
		});

		return res.json({ id: newGroupImage.id, url, preview });
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

// === VENUES ===

// === GET ALL VENUES BY GROUP ID ===
router.get('/:groupId/venues', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const groupId = parseInt(req.params.groupId);

	const group = await Group.findByPk(groupId);

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	const venues = await Venue.findAll({
		include: [{ model: Group }],
		where: {
			groupId,
		},
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	});

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId,
			userId: currUserId,
		},
	});

	const hasValidRole = group.organizerId === currUserId || membershipStatus?.status === 'co-host';

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	const venuesArr = venues.map(venue => {
		const venuePojo = venue.toJSON();
		delete venuePojo.Group;
		return venuePojo;
	});

	res.json({ Venues: venuesArr });
});

// === CREATE A NEW VENUE BY GROUP ID ===
router.post('/:groupId/venues', requireAuth, validateVenueCreation, async (req, res) => {
	const { id: currUserId } = req.user;
	const groupId = parseInt(req.params.groupId);
	const { address, city, state, lat, lng } = req.body;

	const group = await Group.findByPk(groupId);

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId,
			userId: currUserId,
		},
	});

	const hasValidRole = group.organizerId === currUserId || membershipStatus?.status === 'co-host';

	if (!hasValidRole) {
		return requireAuthorizationResponse(res);
	}

	const newVenue = await Venue.create({
		address,
		city,
		state,
		lat,
		lng,
	});

	const newVenuePojo = newVenue.toJSON();
	delete newVenuePojo.createdAt;
	delete newVenuePojo.updatedAt;

	res.json(newVenuePojo);
});

// === EVENTS ===

// === GET ALL EVENTS BY GROUP ID ===
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

// === MEMBERS ===

// === GET ALL MEMBERS OF GROUP ===
router.get('/:groupId/members', async (req, res) => {
	const { id: currUserId } = req.user;
	const groupId = parseInt(req.params.groupId);

	const group = await Group.findByPk(groupId, {
		include: [{ model: User }],
	});

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	if (group.organizerId === currUserId) {
		const members = await Membership.findAll({
			where: {
				groupId,
			},
		});

		const allMembersArr = [];
		for (const member of members) {
			const { userId } = member;
			const user = await User.findByPk(userId);
			const userObj = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				Membership: {
					status: member.status,
				},
			};

			allMembersArr.push(userObj);
		}
		res.json({ Members: allMembersArr });
	} else {
		const members = await Membership.findAll({
			where: {
				groupId,
			},
		});

		const allMembersArr = [];
		for (const member of members) {
			const { userId } = member;
			const user = await User.findByPk(userId);
			if (member.status !== 'pending') {
				const userObj = {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					Membership: {
						status: member.status,
					},
				};

				allMembersArr.push(userObj);
			}
		}
		res.json({ Members: allMembersArr });
	}
});

// === DELETE A MEMBERSHIP ===
router.delete('/:groupId/membership', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const groupId = parseInt(req.params.groupId);
	const { memberId } = req.body;

	const group = await Group.findByPk(groupId);
	if (!group) {
		return entityNotFound(res, 'Group');
	}

	const membershipToDelete = await Membership.findByPk(memberId);
	if (membershipToDelete) {
		const user = await User.findByPk(membershipToDelete.userId);

		if (!user) {
			res.status(400);
			return res.json({
				message: 'Validation Error',
				errors: {
					memberId: "User couldn't be found",
				},
			});
		}
	}

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId,
			userId: currUserId,
		},
	});

	if (!membershipStatus) {
		res.status(404);
		return res.json({
			message: 'Membership does not exist for this User',
		});
	}

	const isAuthorizedToDelete =
		membershipToDelete?.userId === currUserId || membershipStatus?.status === 'host';

	if (!isAuthorizedToDelete) {
		return requireAuthorizationResponse(res);
	}

	await membershipToDelete.destroy();

	res.json({
		message: 'Successfully deleted membership from group',
	});
});

// === REQUEST A MEMBERSHIP
router.post('/:groupId/membership', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const groupId = parseInt(req.params.groupId);

	const group = await Group.findByPk(groupId);

	if (!group) {
		return entityNotFound(res, 'Group');
	}

	const membershipStatus = await Membership.findOne({
		attributes: ['status'],
		where: {
			groupId: group.id,
			userId: currUserId,
		},
	});

	if (membershipStatus?.status === 'pending') {
		res.status(400);
		return res.json({
			message: 'Membership has already been requested',
		});
	}

	const memberStatuses = ['member', 'co-host', 'host'];
	if (memberStatuses.includes(membershipStatus?.status)) {
		res.status(400);
		return res.json({
			message: 'User is already a member of the group',
		});
	}

	const newMembership = await Membership.create({
		groupId,
		userId: currUserId,
		status: 'pending',
	});

	res.json({ memberId: newMembership.id, status: 'pending' });
});

module.exports = router;
