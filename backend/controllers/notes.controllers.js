const Note = require('../models/note');
const User = require('../models/user');
const Color = require('../models/color');

module.exports.getNotes = async (req, res) => {
	const email = req.user;
	const { isArchive } = req.query;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const notes = await user.getNotes({
		where: { isArchive },
		order: [['updatedAt', 'DESC']],
		include: Color,
	});

	res.status(200).json(notes);
};

module.exports.createNote = async (req, res) => {
	const email = req.user;
	const { title, content, color: colorName } = req.body;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const color = await Color.findOne({ where: { name: colorName } });

	if (!color) {
		throw new Error('Color does not exist');
	}

	const note = await user.createNote({ title, content });

	await note.setColor(color);

	res.status(200).json(note);
};

module.exports.getNote = async (req, res) => {
	const email = req.user;
	const { id } = req.params;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const note = await Note.findByPk(id);

	const n = await user.hasNote(note);

	if (n) {
		return res.status(200).json(note);
	} else {
		return res.status(400).json({ errorMessage: 'Note not found.' });
	}
};

module.exports.deleteNote = async (req, res) => {
	const email = req.user;
	const { id } = req.params;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const note = await Note.findByPk(id);

	const n = await user.hasNote(note);

	if (!n) {
		throw new Error('You can not delete a note of another user');
	}

	await user.removeNote(note);

	await Note.destroy({ where: { id } });

	return res.status(200).json({ message: 'Note deleted successfully' });
};

module.exports.updateNote = async (req, res) => {
	const email = req.user;
	const { id } = req.params;
	const { title, content, color: colorName, isArchive } = req.body;
	console.log(colorName);

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const note = await Note.findByPk(id);

	const n = await user.hasNote(note);

	if (!n) {
		throw new Error('You can not update a note of another user');
	}

	if (!title) {
		await Note.update({ isArchive }, { where: { id } });
	} else {
		const newColor = await Color.findOne({ where: { name: colorName } });

		if (!newColor) {
			throw new Error('Color does not exist');
		}

		await note.setColor(newColor);
		const newNote = await Note.update({ title, content }, { where: { id } });
	}

	return res.status(200).json({ message: 'Note updated successfully' });
};
