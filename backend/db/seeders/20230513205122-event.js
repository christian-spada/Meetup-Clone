'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Events';

const eventData = [
	{
		venueId: 1,
		groupId: 1,
		name: 'Vegan BBQ',
		description: 'Place for vegan BBQ foods',
		type: 'In person',
		capacity: 35,
		price: 20,
		startDate: '2023-6-5 18:00:00',
		endDate: '2023-6-5 22:00:00',
	},
	{
		venueId: 2,
		groupId: 3,
		name: 'Basketball Tournament',
		description: 'B-ball tourney for ballers',
		type: 'In person',
		capacity: 60,
		price: 15,
		startDate: '2023-8-9 12:00:00',
		endDate: '2023-8-9 18:00:00',
	},
	{
		venueId: 3,
		groupId: 3,
		name: 'Call of Duty Tournament',
		description: 'A CoD tourney for gamers',
		type: 'Online',
		capacity: 50,
		price: 50,
		startDate: '2023-1-2 12:00:00',
		endDate: '2023-1-2 20:00:00',
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, eventData, {});
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			options,
			{
				venueId: { [Op.in]: [1, 2, 3] },
			},
			{}
		);
	},
};
