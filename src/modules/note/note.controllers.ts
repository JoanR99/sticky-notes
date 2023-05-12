import { Response, Request } from 'express';

import * as notesService from './note.service';
import NotFound from '../../errors/NotFound';
import { CreateNoteInput, GetNotesQuery, UpdateNoteInput } from './note.schema';

export const createNote = async (
	req: Request<{}, {}, CreateNoteInput>,
	res: Response
) => {
	const id = req.user;

	const note = await notesService.createNote(req.body, Number(id));

	res.status(201).json(note);
};

export const getNotes = async (
	req: Request<{}, {}, {}, GetNotesQuery>,
	res: Response
) => {
	const id = req.user;

	const notes = await notesService.getNotes(Number(id), req.query);

	res.status(200).json(notes);
};

export const updateNote = async (
	req: Request<{ id: string }, {}, UpdateNoteInput>,
	res: Response
) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findById(Number(id));

	if (!note) {
		throw new NotFound(req.t('note.not_found'));
	}

	if (note.authorId !== Number(userId)) {
		return res.status(403).send();
	}

	const updatedNote = await notesService.updateNote(note.id, req.body);

	return res.status(200).json(updatedNote);
};

export const deleteNote = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const userId = req.user;
	const { id } = req.params;

	const note = await notesService.findById(Number(id));

	if (!note) {
		throw new NotFound(req.t('note.not_found'));
	}

	if (note.authorId !== Number(userId)) {
		return res.status(403).send();
	}

	const deletedNote = await notesService.deleteNote(Number(id));

	return res.status(200).json(deletedNote);
};
