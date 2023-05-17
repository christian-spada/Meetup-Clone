'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Groups';

const groupData = [
	{
		organizerId: 1,
		name: 'Basketball',
		about: 'Group for pickup basketball',
		type: 'In person',
		private: false,
		city: 'Philadelphia',
		state: 'PA',
	},
	{
		organizerId: 2,
		name: 'Gaming',
		about: 'Play all types of games with others',
		type: 'Online',
		private: false,
		city: 'Austin',
		state: 'TX',
	},
	{
		organizerId: 3,
		name: 'Live Music',
		about: 'Meetup to jam/play music together',
		type: 'In person',
		private: true,
		city: 'Los Angeles',
		state: 'CA',
	},
	{
		organizerId: 4,
		name: 'Golf',
		about: 'Group for Golf',
		type: 'In person',
		private: true,
		city: 'San Antonio',
		state: 'TX',
	},
	{
		organizerId: 5,
		name: 'Tennis',
		about: 'Tennis match',
		type: 'In person',
		private: false,
		city: 'St. Petersburg',
		state: 'FL',
	},
	{
		organizerId: 6,
		name: 'Zoom Book Club',
		about: 'Book club over zoom',
		type: 'Online',
		private: true,
		city: 'Omaha',
		state: 'NE',
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, groupData, {});
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			options,
			{
				organizerId: { [Op.in]: [1, 2, 3, 4, 5, 6] },
			},
			{}
		);
	},
};
