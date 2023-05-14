const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth.js');
const { Group, Membership, GroupImage } = require('../../db/models');
const { toJSONArray } = require('../../utils/helpers.js');

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

module.exports = router;
