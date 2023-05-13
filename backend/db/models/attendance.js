'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Attendance extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	Attendance.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			eventId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: DataTypes.ENUM('attending', 'waitlist', 'pending'),
		},
		{
			sequelize,
			modelName: 'Attendance',
		}
	);
	return Attendance;
};
