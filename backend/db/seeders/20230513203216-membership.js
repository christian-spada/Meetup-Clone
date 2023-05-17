'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Memberships';

const membershipData = [
	{
		userId: 1,
		groupId: 1,
		status: 'pending',
	},
	{
		userId: 2,
		groupId: 2,
		status: 'member',
	},
	{
		userId: 3,
		groupId: 3,
		status: 'co-host',
	},
	{
		userId: 4,
		groupId: 4,
		status: 'host',
	},
	{
		userId: 5,
		groupId: 5,
		status: 'member',
	},
	{
		userId: 6,
		groupId: 6,
		status: 'host',
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, membershipData, {});
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		await queryInterface.bulkDelete(
			options,
			{
				userId: { [Op.in]: [1, 2, 3, 4, 5, 6] },
			},
			{}
		);
	},
};
