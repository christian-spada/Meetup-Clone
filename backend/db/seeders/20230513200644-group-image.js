'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'GroupImages';

const groupImagesData = [
	{
		groupId: 1,
		url: '/pic',
		preview: true,
	},
	{
		groupId: 2,
		url: '/pic',
		preview: true,
	},
	{
		groupId: 2,
		url: '/pic',
		preview: false,
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, groupImagesData, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			options,
			{
				preview: { [Op.in]: [true, true, false] },
			},
			{}
		);
	},
};
