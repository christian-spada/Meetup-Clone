'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Venue extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Many-to-One: Venues to Group
			Venue.belongsTo(models.Group, { foreignKey: 'groupId' });

			// One-to-Many: Venues to Events
			Venue.hasMany(models.Event, { foreignKey: 'venueId', onDelete: 'CASCADE', hooks: true });
		}
	}
	Venue.init(
		{
			groupId: DataTypes.INTEGER,
			address: {
				type: DataTypes.STRING,
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
			lat: {
				type: DataTypes.DECIMAL,
				allowNull: false,
			},
			lng: {
				type: DataTypes.DECIMAL,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Venue',
		}
	);
	return Venue;
};
