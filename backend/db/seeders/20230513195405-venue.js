'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Venues';

const venueData = [
	{
		groupId: 1,
		address: '123 Flower Dr',
		city: 'Houston',
		state: 'TX',
		lat: 37.254,
		lng: -110.349,
	},
	{
		groupId: 2,
		address: '456 Spot St',
		city: 'San Jose',
		state: 'CA',
		lat: 17.24,
		lng: 59.339,
	},
	{
		groupId: 3,
		address: '789 Bluesky Ln',
		city: 'Ann Arbor',
		state: 'MI',
		lat: 60.25,
		lng: -69.349,
	},
	{
		groupId: 4,
		address: '15 Cherry Ln',
		city: 'Detroit',
		state: 'MI',
		lat: 90.25,
		lng: -9.349,
	},
	{
		groupId: 5,
		address: '1 Orchid Way',
		city: 'San Diego',
		state: 'Ca',
		lat: 14.25,
		lng: -120.349,
	},
	{
		groupId: 6,
		address: '50 Redbrick St',
		city: 'Salt Lake City',
		state: 'UT',
		lat: 50.25,
		lng: -3.349,
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, venueData, {});
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			options,
			{
				groupId: { [Op.in]: [1, 2, 3, 4, 5, 6] },
			},
			{}
		);
	},
};
