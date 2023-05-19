const express = require('express');
const router = express.Router();
const { Group, Membership, Venue } = require('../../db/models');
const { requireAuth, requireAuthorizationResponse } = require('../../utils/auth');
const { entityNotFound } = require('../../utils/helpers');
const { validateVenue } = require('../../utils/custom-validators');

// === EDIT A VENUE ===
router.put('/:venueId', requireAuth, validateVenue, async (req, res, next) => {
	const { id: currUserId } = req.user;
	const { address, city, state, lat, lng } = req.body;
	const venueId = parseInt(req.params.venueId);

	const venueToEdit = await Venue.findByPk(venueId, {
		attributes: { exclude: ['createdAt', 'updatedAt'] },
		include: [{ model: Group }],
	});

	if (!venueToEdit) {
		return entityNotFound(res, 'Venue');
	}

	const group = venueToEdit.Group;

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

	const updatedVenue = await venueToEdit.update({
		address: address ?? venueToEdit.address,
		city: city ?? venueToEdit.city,
		state: state ?? venueToEdit.state,
		lat: lat ?? venueToEdit.lat,
		lng: lng ?? venueToEdit.lng,
	});

	const updatedVenuePojo = updatedVenue.toJSON();
	updatedVenuePojo.id = venueToEdit.id;
	updatedVenuePojo.groupId = venueToEdit.groupId;
	delete updatedVenuePojo.Group;

	res.json(updatedVenuePojo);
});

module.exports = router;
