const Note = require('../models/note');

const findByIdAndUserId = async (id, userId) =>
	await Note.findOne({
		where: {
			id,
			userId,
		},
	});

const deleteNote = async (id) => await Note.destroy({ where: { id } });

module.exports = { findByIdAndUserId, deleteNote };
