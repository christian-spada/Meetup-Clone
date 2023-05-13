'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Many-to-One: Groups to Users
			Group.belongsTo(models.User, { foreignKey: 'organizerId' });

			// Many-to-Many: Groups to Users
			Group.belongsToMany(models.User, {
				through: 'Memberships',
				foreignKey: 'groupId',
				otherKey: 'userId',
			});

			// One-to-Many: Groups to Events
			Group.hasMany(models.Event, { foreignKey: 'groupId' });

			// One-to-Many: Groups to Venues
			Group.hasMany(models.Venue, { foreignKey: 'groupId' });

			// One-to-Many: Groups to GroupImages
			Group.hasMany(models.GroupImage, { foreignKey: 'groupId' });
		}
	}
	Group.init(
		{
			organizerId: DataTypes.INTEGER,
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			about: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('In person', 'Online'),
				allowNull: false,
			},
			private: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Group',
		}
	);
	return Group;
};
