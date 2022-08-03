const Note = require('../models/note');
const User = require('../models/user');
const Color = require('../models/color');

module.exports.getNotes = async (req, res) => {
	const id = req.user;
	const { isArchive } = req.query;

	const user = await User.findOne({ where: { id } });

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
	const id = req.user;
	const { title, content, color: colorId } = req.body;

	const user = await User.findOne({ where: { id } });

	if (!user) {
		throw new Error('User does not exist');
	}

	const color = await Color.findOne({ where: { id: colorId } });

	if (!color) {
		throw new Error('Color does not exist');
	}

	const note = await user.createNote({ title, content });

	await note.setColor(color);

	res.status(200).json(note);
};

module.exports.getNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await Note.findOne({
		where: {
			id,
			userId,
		},
	});

	if (this.createNote) {
		return res.status(200).json(note);
	} else {
		return res.status(400).json({ errorMessage: 'Note not found.' });
	}
};

module.exports.deleteNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await Note.findOne({ where: { id, userId } });

	if (!note) throw new Error('Note not found');

	await Note.destroy({ where: { id } });

	return res.status(200).json({ message: 'Note deleted successfully' });
};

module.exports.updateNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;
	const { title, content, color: colorId, isArchive } = req.body;

	const note = await Note.findOne({ where: { id, userId } });

	if (!note) {
		throw new Error('You can not update a note of another user');
	}

	if (typeof isArchive === 'undefined') {
		console.log(note);
		if (note.colorId !== colorId) {
			const newColor = await Color.findOne({ where: { id: colorId } });

			if (!newColor) {
				throw new Error('Color does not exist');
			}

			await note.setColor(newColor);
		}

		note.title = title;
		note.content = content;
		await note.save();
	} else {
		note.isArchive = isArchive;
		await note.save();
	}

	return res.status(200).json({ message: 'Note updated successfully' });
};
