'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Memberships';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Memberships',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id',
					},
					onDelete: 'CASCADE',
				},
				groupId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'Groups',
						key: 'id',
					},
					onDelete: 'CASCADE',
				},
				status: {
					type: Sequelize.ENUM('host', 'co-host', 'member', 'pending'),
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
			},
			options
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable(options);
	},
};
