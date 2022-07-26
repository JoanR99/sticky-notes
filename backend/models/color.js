const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Color = sequelize.define('colors', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	hex: {
		type: DataTypes.STRING,
	},
});

module.exports = Color;
