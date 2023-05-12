'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = 'Users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			options,
			[
				{
					firstName: 'Demo',
					lastName: 'Lition',
					email: 'demo@user.io',
					username: 'Demo-lition',
					hashedPassword: bcrypt.hashSync('password'),
				},
				{
					firstName: 'Fake1',
					lastName: 'User2',
					email: 'user1@user.io',
					username: 'FakeUser1',
					hashedPassword: bcrypt.hashSync('password2'),
				},
				{
					firstName: 'Fake2',
					lastName: 'User2',
					email: 'user2@user.io',
					username: 'FakeUser2',
					hashedPassword: bcrypt.hashSync('password3'),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
			},
			{}
		);
	},
};
