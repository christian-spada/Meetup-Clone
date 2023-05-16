'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// One-to-Many: Users to Groups
			User.hasMany(models.Group, { foreignKey: 'organizerId', onDelete: 'CASCADE', hooks: true });

			// Many-to-Many: Users to Groups
			User.belongsToMany(models.Group, {
				through: 'Memberships',
				foreignKey: 'userId',
				otherKey: 'groupId',
			});

			// Many-to-Many: Users to Events
			User.belongsToMany(models.Event, {
				through: 'Attendances',
				foreignKey: 'userId',
				otherKey: 'eventId',
			});
		}
	}

	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [4, 30],
					isNotEmail(value) {
						if (Validator.isEmail(value)) {
							throw new Error('Cannot be an email.');
						}
					},
				},
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 256],
					isEmail: true,
				},
			},
			hashedPassword: {
				type: DataTypes.STRING.BINARY,
				allowNull: false,
				validate: {
					len: [60, 60],
				},
			},
		},
		{
			sequelize,
			modelName: 'User',
			defaultScope: {
				attributes: {
					exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
				},
			},
		}
	);
	return User;
};
