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

module.exports = router;
