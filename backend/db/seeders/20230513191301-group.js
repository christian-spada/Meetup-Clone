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
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, groupData, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			options,
			{
				name: { [Op.in]: ['Basketball', 'Gaming', 'Live Music'] },
			},
			{}
		);
	},
};
