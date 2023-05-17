'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Attendances';

const attendancesData = [
	{
		eventId: 1,
		userId: 1,
		status: 'waitlist',
	},
	{
		eventId: 2,
		userId: 2,
		status: 'attending',
	},
	{
		eventId: 3,
		userId: 3,
		status: 'pending',
	},
	{
		eventId: 4,
		userId: 4,
		status: 'attending',
	},
	{
		eventId: 5,
		userId: 5,
		status: 'waitlist',
	},
	{
		eventId: 6,
		userId: 6,
		status: 'pending',
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, attendancesData, {});
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			options,
			{
				eventId: {
					[Op.in]: [1, 2, 3, 4, 5, 6],
				},
			},
			{}
		);
	},
};
