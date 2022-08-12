const userService = require('../services/user.services');
const notesService = require('../services/notes.services');
const colorService = require('../services/color.services');

const getNotes = async (req, res) => {
	const id = req.user;
	const { isArchive } = req.query;

	const user = await userService.findUserById(id);

	if (!user) {
		throw new Error('User does not exist');
	}

	const notes = await user.getNotes({
		where: { isArchive },
		order: [['updatedAt', 'DESC']],
		include: 'color',
	});

	res.status(200).json(notes);
};

const createNote = async (req, res) => {
	const id = req.user;
	const { title, content, color: colorId } = req.body;

	const user = await userService.findUserById(id);

	if (!user) {
		throw new Error('User does not exist');
	}

	const color = await colorService.findById(colorId);

	if (!color) {
		throw new Error('Color does not exist');
	}

	const note = await user.createNote({ title, content });

	await note.setColor(color);

	res.status(200).json(note);
};

const getNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findByIdAndUserId(id, userId);

	if (note) {
		return res.status(200).json(note);
	} else {
		return res.status(400).json({ errorMessage: 'Note not found.' });
	}
};

const deleteNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findByIdAndUserId(id, userId);

	if (!note) throw new Error('Note not found');

	await notesService.deleteNote(id);

	return res.status(200).json({ message: 'Note deleted successfully' });
};

const updateNote = async (req, res) => {
	const userId = req.user;
	const { id } = req.params;
	const { title, content, color: colorId, isArchive } = req.body;

	const note = await notesService.findByIdAndUserId(id, userId);

	if (!note) {
		throw new Error('You can not update a note of another user');
	}

	if (typeof isArchive === 'undefined') {
		if (note.colorId !== colorId) {
			const newColor = await colorService.findById(colorId);

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

module.exports = { getNote, createNote, getNotes, updateNote, deleteNote };
