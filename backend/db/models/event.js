'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Many-to-One: Events to Venue
			Event.belongsTo(models.Venue, { foreignKey: 'venueId' });

			// Many-to-One: Events to Groups
			Event.belongsTo(models.Group, { foreignKey: 'groupId' });

			// One-to-Many: Events to EventImages
			Event.hasMany(models.EventImage, { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true });

			// Many-to-Many: Events to Users
			Event.belongsToMany(models.User, {
				through: 'Attendances',
				foreignKey: 'eventId',
				otherKey: 'userId',
			});
		}
	}
	Event.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			venueId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			groupId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('In person', 'Online'),
				allowNull: false,
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: false,
			},
			startDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			endDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Event',
		}
	);
	return Event;
};
