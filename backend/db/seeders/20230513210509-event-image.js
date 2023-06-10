'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'EventImages';

const eventImagesData = [
	{
		eventId: 1,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171634315468850/joel-filipe-QwoNAhbmLLo-unsplash.jpg',
		preview: true,
	},
	{
		eventId: 2,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117171635196272780/spacex--p-KCm6xB9I-unsplash.jpg',
		preview: true,
	},
	{
		eventId: 3,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117172850961436853/alexander-andrews-eNoeWZkO7Zc-unsplash.jpg',
		preview: true,
	},
	{
		eventId: 4,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117172850588123228/alex-fxrwJGMCz_g-unsplash.jpg',
		preview: true,
	},
	{
		eventId: 5,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117172851817074698/willian-justen-de-vasconcellos-KTdWSxukp54-unsplash.jpg',
		preview: true,
	},
	{
		eventId: 6,
		url: 'https://cdn.discordapp.com/attachments/1116875350929068035/1117172851414401116/greg-rakozy-oMpAz-DN-9I-unsplash.jpg',
		preview: true,
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(options, eventImagesData, {});
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
