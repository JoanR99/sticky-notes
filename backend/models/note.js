const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Color = require('./color');

const Note = sequelize.define('notes', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	title: {
		type: DataTypes.STRING,
	},
	content: {
		type: DataTypes.STRING,
	},
	isArchive: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

Note.belongsTo(Color);
Color.hasMany(Note);

module.exports = Note;
