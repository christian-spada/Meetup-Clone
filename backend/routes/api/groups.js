const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
		const groupObj = group.toJSON();
		const numMembers = await Membership.count({
			where: {
				groupId: group.id,
			},
		});

		const url = groupObj.GroupImages[0]?.url;
		groupObj.previewImage = url || null;
		groupObj.numMembers = numMembers;
		delete groupObj.GroupImages;

		groupArr.push(groupObj);
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
		res.status(404);
		return res.json({
			message: "Group couldn't be found",
		});
	}

	const groupPojo = group.toJSON();

	const numMembers = await Membership.count({ where: { groupId } });

	groupPojo.numMembers = numMembers;
	res.json(groupPojo);
});

// === CREATE A GROUP ===
router.post('/', requireAuth, async (req, res) => {
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
	const { id: organizerId } = req.user;

	const group = await Group.findByPk(groupId);

	if (!group) {
		res.status(404);
		return res.json({
			message: "Group couldn't be found",
		});
	}

	if (groupId !== organizerId) {
		return res.json({ message: 'You must be group organizer to add an image' });
	}

	if (groupId === organizerId) {
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

module.exports = router;
