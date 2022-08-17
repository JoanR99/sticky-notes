import Note from '../models/note';

export const findByIdAndUserId = async (id: number, userId: number) =>
	await Note.findOne({
		where: {
			id,
			userId,
		},
	});

export const deleteNote = async (id: number) =>
	await Note.destroy({ where: { id } });
