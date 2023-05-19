const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage } = require('../../db/models');
const { requireAuth, requireAuthorizationResponse } = require('../../utils/auth');
const { entityNotFound } = require('../../utils/helpers');

// === DELETE A GROUP IMAGE ===
router.delete('/:imageId', requireAuth, async (req, res) => {
	const { id: currUserId } = req.user;
	const imageId = parseInt(req.params.imageId);

	const imageToDelete = await GroupImage.findByPk(imageId, {
		include: [{ model: Group }],
	});

	if (!imageToDelete) {
		return entityNotFound(res, 'Group Image');
	}

	const group = imageToDelete.Group;
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
