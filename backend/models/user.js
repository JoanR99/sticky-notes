const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Note = require('./note');

const User = sequelize.define('users', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
	},
	email: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
	refreshToken: {
		type: DataTypes.STRING,
	},
});

User.hasMany(Note);
Note.belongsTo(User);

module.exports = User;
