'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'GroupImages';

const groupImagesData = [
	{
		groupId: 1,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171632776167505/aldebaran-s-uXchDIKs4qI-unsplash.jpg',
		preview: true,
	},
	{
		groupId: 2,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171633082343534/guillermo-ferla-Oze6U2m1oYU-unsplash.jpg',
		preview: true,
	},
	{
		groupId: 3,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171633451438120/ivana-cajina-asuyh-_ZX54-unsplash.jpg',
		preview: true,
	},
	{
		groupId: 4,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171633824743515/jeremy-thomas-E0AHdsENmDg-unsplash.jpg',
		preview: true,
	},
	{
		groupId: 5,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171635506647212/vincentiu-solomon-ln5drpv_ImI-unsplash.jpg',
		preview: true,
	},
	{
		groupId: 6,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171634869125160/shot-by-cerqueira-0o_GEzyargo-unsplash.jpg',
		preview: true,
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, groupImagesData, {});
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
